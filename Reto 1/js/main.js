window.onload = () => {
    calculadora.init();
}

const calculadora = {
    init() {
        document.querySelectorAll('.calculadora .valores button').forEach(x => x.addEventListener('click', calculadora.events.valoresClick));
        document.querySelectorAll('.calculadora .operaciones button').forEach(x => x.addEventListener('click', calculadora.events.operacionesClick));
    },
    events: {
        valoresClick(e) {
            let button = e.currentTarget;
            let valor = button.textContent;
            let inputResultado = document.querySelector('.calculadora .resultado input');
            let textoFormula = inputResultado.value;
            let textoFormulaAcumulada = `${textoFormula}${valor}`;
            inputResultado.value = textoFormulaAcumulada;
        },
        operacionesClick(e) {
            let listaOperaciones = Array.from(document.querySelectorAll('.calculadora .operaciones .operador')).map(x => { return { valor: x.getAttribute('value'), texto: x.textContent }; });
            let listaOperacionesValores = listaOperaciones.map(x => x.valor);

            // let regexText = listaOperacionesValores.map(x => `\\${x}`).join('');
            // let regexSplit = `[${regexText}]+`;
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
                console.log(valor);
                console.log(inputResultado);
                inputResultado.value = "";
                console.log(inputResultado.value);
            }

            let textoFormulaAcumulada = `${textoFormula}${texto}`;
            inputResultado.value = textoFormulaAcumulada;
        }
    }
}