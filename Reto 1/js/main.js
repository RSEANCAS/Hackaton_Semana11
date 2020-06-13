window.onload = () => {
    calculadora.init();
}

const calculadora = {
    init() {
        document.querySelectorAll('.calculadora .valores button').forEach(x => x.addEventListener('click', calculadora.events.valoresClick));
        document.querySelectorAll('.calculadora .operaciones button').forEach(x => x.addEventListener('click', calculadora.events.operacionesClick));
        document.querySelector('.calculadora .resultado input').addEventListener("keydown", calculadora.events.inputKeyDown);
    },
    events: {
        inputKeyDown(e) {
            let listaOperaciones = Array.from(document.querySelectorAll('.calculadora .operaciones .operador')).map(x => { return { valor: x.getAttribute('value'), texto: x.getAttribute('text') }; });
            let listaOperacionesValores = listaOperaciones.map(x => x.texto.length == 1 ? x.texto : `(${x.texto})`);

            let regexText = listaOperacionesValores.map(x => x.length == 1 ? `\\${x}` : x).join('');
            let regexValue = RegExp(`[${regexText}]+`);

            console.log(regexValue);
            let texto = String.fromCharCode(e.keyCode).toLowerCase();
            if (texto.match(/[0-9.]/)) document.querySelector(`.valor[value="${texto}"]`).click();
            if (texto.match(regexValue)) document.querySelector(`.operador[text="${texto}"]`).click();
            console.log(texto);
        },
        valoresClick(e) {
            let button = e.currentTarget;
            let valor = button.textContent;
            let inputResultado = document.querySelector('.calculadora .resultado input');

            let listaOperaciones = Array.from(document.querySelectorAll('.calculadora .operaciones .operador')).map(x => { return { valor: x.getAttribute('value'), texto: x.getAttribute('text') }; });
            let listaOperacionesValores = listaOperaciones.map(x => x.valor.length == 1 ? x.valor : `(${x.valor})`);

            let regexText = listaOperacionesValores.map(x => x.length == 1 ? `\\${x}` : x).join('');
            let regexValue = RegExp(`[${regexText}]+`);
            let listaValores = inputResultado.value.split(regexValue);
            if (valor == '.' && listaValores[listaValores.length - 1].includes(valor)) return;
            if (valor == '0' && listaValores[listaValores.length - 1].length > 0 && listaValores[listaValores.length - 1].split('').filter(x => x != valor).length == 0) return;

            let textoFormula = inputResultado.value;
            let textoFormulaAcumulada = `${textoFormula}${valor}`;
            inputResultado.value = textoFormulaAcumulada;
        },
        operacionesClick(e) {
            let listaOperaciones = Array.from(document.querySelectorAll('.calculadora .operaciones .operador')).map(x => { return { valor: x.getAttribute('value'), texto: x.getAttribute('text') }; });
            let listaOperacionesValores = listaOperaciones.map(x => x.valor);


            let inputResultado = document.querySelector('.calculadora .resultado input');
            if (inputResultado.value == "") return;
            let arrayResultado = inputResultado.value.split('');
            if (listaOperacionesValores.includes(arrayResultado[arrayResultado.length - 1])) return;
            let button = e.currentTarget;
            let texto = button.getAttribute('text');
            let valor = button.getAttribute('value');
            let textoFormula = inputResultado.value;
            if (valor == "=") {
                let sectionHistorial = document.querySelector('.calculadora .historial');
                let inputHistorial = document.querySelector('.calculadora .historial input');
                inputHistorial.value = textoFormula;

                if (sectionHistorial.classList.contains('disabled')) sectionHistorial.classList.remove('disabled');

                listaOperaciones.forEach(x => {
                    textoFormula = textoFormula.replace(x.texto, x.valor);
                })
                let resultado = eval(textoFormula);
                inputResultado.value = resultado;
                return;
            } else if (valor == "") {
                inputResultado.value = "";
                inputHistorial.value = "";
                return;
            }

            let textoFormulaAcumulada = `${textoFormula}${texto}`;
            inputResultado.value = textoFormulaAcumulada;
        }
    }
}