window.onload = () => {
    todolist.init();
};

const todolist = {
        options: {
            dayName: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
            monthName: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Setiembre', 'Octubre', 'Noviembre', 'Diciembre']
        },
        init() {
            todolist.functions.updateDate();
            todolist.functions.updateTasksActives();

            document.querySelector('.todolist .form button').addEventListener('click', todolist.events.agregarClick);
            document.querySelector('.todolist .search button').addEventListener('click', todolist.events.buscarClick);
            let tasks = localStorage.tasks != null ? JSON.parse(localStorage.tasks) : [];

            todolist.functions.render(tasks);
        },
        events: {
            buscarClick(e) {
                let tasks = localStorage.tasks != null ? JSON.parse(localStorage.tasks) : [];

                let nombreBusqueda = document.querySelector('#txtTareaBusqueda').value;

                let regexBusqueda = RegExp(`^.*${nombreBusqueda}.*$`)

                let tasksResult = tasks.filter(x => x.nombre.match(regexBusqueda));

                todolist.functions.render(tasksResult);
            },
            agregarClick(e) {
                let tasks = localStorage.tasks != null ? JSON.parse(localStorage.tasks) : [];
                let nombre = document.querySelector('#txtTarea').value;

                if (nombre.trim() == "") return;

                let id = tasks.length == 0 ? 1 : tasks.map(x => x.id).sort((a, b) => a - b)[tasks.length - 1] + 1;

                let task = {
                    id,
                    nombre,
                    active: false
                }

                document.querySelector('.todolist .form input').value = "";

                tasks.push(task);

                localStorage.setItem('tasks', JSON.stringify(tasks));

                todolist.functions.render(tasks);
            },
            eliminarClick(e) {
                if (!confirm('¿Desea eliminar la tarea?')) return;
                let button = e.currentTarget;
                let tasks = localStorage.tasks != null ? JSON.parse(localStorage.tasks) : [];
                let id = button.getAttribute('data-id');
                let index = tasks.findIndex(x => x.id == id);
                tasks.splice(index, 1);
                localStorage.setItem('tasks', JSON.stringify(tasks));
                todolist.functions.render(tasks);
            },
            listoChecked(e) {
                let inputCheck = e.currentTarget;
                let { checked } = inputCheck;

                let tasks = localStorage.tasks != null ? JSON.parse(localStorage.tasks) : [];
                let id = inputCheck.getAttribute('data-id');
                let index = tasks.findIndex(x => x.id == id);
                tasks[index].active = checked;

                localStorage.setItem('tasks', JSON.stringify(tasks));
                todolist.functions.updateTasksActives();
            }
        },
        functions: {
            updateDate() {
                let fecha = new Date();
                let nombreDia = todolist.options.dayName[fecha.getDay()];
                let nombreMes = todolist.options.monthName[fecha.getMonth()];
                document.querySelector('.date span').textContent = `${nombreDia}, ${fecha.getDate()} de ${nombreMes}`;
            },
            updateTasksActives() {
                let tasks = localStorage.tasks != null ? JSON.parse(localStorage.tasks) : [];
                let tasksActive = tasks.filter(x => x.active).length;
                document.querySelector('.date small').textContent = `${tasksActive} tareas activas`;
            },
            render(results = []) {
                let tasks = results;

                if (tasks.length > 0) document.querySelector('.todolist .search').classList.remove('disabled');

                let tasksInnerHtml = tasks.map(x => `<li><input type="checkbox" class="chkListo" ${x.active ? "checked" : ""} data-id="${x.id}"><span>${x.nombre}</span><button class="btnEliminar" data-id="${x.id}">Eliminar</button></li>`).join('<hr>');

                document.querySelector('.todolist .list').innerHTML = `${tasksInnerHtml == "" ? '<div class="message">No hay lista de tareas</div>' : `<ul>${tasksInnerHtml}</ul>`}`;
                document.querySelectorAll('.btnEliminar').forEach(x => x.addEventListener('click', todolist.events.eliminarClick));
                document.querySelectorAll('.chkListo').forEach(x => x.addEventListener('click', todolist.events.listoChecked));
        }
    }

}