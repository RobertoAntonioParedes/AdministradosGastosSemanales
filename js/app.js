//Variables y selectores
const formulario = document.querySelector('#agregar-gasto');
const listaGastos = document.querySelector('#gastos ul');



//Eventos
eventListeners();

function eventListeners(){
    document.addEventListener('DOMContentLoaded', preguntaPresupuesto);
    formulario.addEventListener('submit', agregarGastos);

};


//Clases

class Presupuesto{
    constructor(presupuesto){
        this.presupuesto = Number(presupuesto);
        this.restante = Number(presupuesto);
        this.gastos = [];
    };
    nuevoGasto(gasto){
        this.gastos = [...this.gastos, gasto];
        this.calcularRestante();
    };

    calcularRestante(){
        const gastado = this.gastos.reduce((total, gasto)=> total + gasto.cantidad, 0 );
        this.restante = this.presupuesto - gastado;
    };

    eliminarGasto(id){
        this.gastos = this.gastos.filter(gasto => gasto.id !== id);
        this.calcularRestante();
    };
};

class UI{
    insertarPresupuesto(cantidad){
        //Extrayendo los valores
        const {presupuesto, restante} = cantidad; 

        //Agregando al HTML
        document.querySelector('#total').textContent = presupuesto;
        document.querySelector('#restante').textContent =  restante;
    };

    // Imprimir alerta
    imprimirAlerta(mensaje, tipo) {
        //crear el div
        const divMensaje = document.createElement('DIV');
        divMensaje.classList.add('text-center' ,'alert');
        
        if(tipo === 'error'){
            divMensaje.classList.add('alert-danger');
        }else{
            divMensaje.classList.add('alert-success');
        };
        
        //Mensaje de error
        divMensaje.textContent = mensaje;

        setTimeout (()=>{
            divMensaje.remove();
        }, 3500 );
        
        //Insertar en el HTML
        document.querySelector('.primario').insertBefore(divMensaje, formulario);
    }; 
    agregarGastos(gastos){
        this.limpiarHtml();

        //iterar sobre los gastos
        gastos.forEach(gasto => {

            const {cantidad, valor, id} = gasto;
            //Crear un Li
            const nuevoGasto = document.createElement('LI');
            nuevoGasto.className = 'list-group-item d-flex justify-content-between align-items-center';
            nuevoGasto.dataset.id = id;

        //Agregar el HTML de gasto

            nuevoGasto.innerHTML =`${valor}<span class="badge badge-primary badge-pill">$ ${cantidad} </span>`;

        //agregar boton para borrar gastos 
        const btnBorrar = document.createElement('BUTTON');
        btnBorrar.classList.add('btn', 'btn-danger', 'borrar-gasto');
        btnBorrar.innerHTML = 'borrar &times';
        nuevoGasto.appendChild(btnBorrar);

        btnBorrar.onclick = ()=>{
            eliminarGasto(id);
        }

        //Agregar al HTML
        listaGastos.appendChild(nuevoGasto);
        });
        
    };
    limpiarHtml(){
        while(listaGastos.firstChild){
            listaGastos.removeChild(listaGastos.firstChild);
        }
    };

    actualizarRestante(restante){
        document.querySelector('#restante').textContent = restante;

    };

    comprobarPresupuesto(presupuestoObj){
        const {presupuesto, restante} = presupuestoObj;
        const restanteDiv = document.querySelector('.restante');
        //Comprobar 25%
        if((presupuesto /4 ) > restante){
            restanteDiv.classList.remove('alert-success');
            restanteDiv.classList.add('alert-danger');
        }else if((presupuesto /2 )>restante){
            restanteDiv.classList.remove('alert-success');
            restanteDiv.classList.add('alert-warning');
        }else{
            restanteDiv.classList.remove('alert-danger','alert-warning');
            restanteDiv.classList.add('alert-success');
        }

        //SI el restante es 0 o menor
        if(restante <= 0){
            this.imprimirAlerta('El presupuesto se ha agotado', 'error');
            formulario.querySelector('button[type="submit"]').disabled = true;
        }
    };
};

//Instanciar
const ui = new UI();
let presupuesto;


//Funciones
function preguntaPresupuesto(){
    const presupuestoUser =  prompt('¿Cuál es tu presupuesto inicial?');
    if(presupuestoUser === '' || presupuestoUser === null || isNaN(presupuestoUser) ||presupuestoUser <= 0){
        window.location.reload();
        alert('Ingrese un VALOR valido');
    }
   // console.log (Number(presupuestoUser));
   presupuesto = new Presupuesto(presupuestoUser);
   ui.insertarPresupuesto(presupuesto);
   
};

function agregarGastos(e){
    e.preventDefault();

//leer los datos del formulario
const valor = document.querySelector('#gasto').value;
const cantidad = Number(document.querySelector('#cantidad').value);

//Validar
if(valor === '' || cantidad === ''){
    ui.imprimirAlerta('Ambos campos son obligatorios', 'error');
    return;
}else if(cantidad <=0 || isNaN(cantidad)){
    ui.imprimirAlerta('Ingrese un valor valido', 'error');
    return;
};

//Generar un objeto con el gasto
const gasto = {valor, cantidad, id: Date.now()};

//Añade un nuevo gasto
presupuesto.nuevoGasto(gasto);

//Mensaje de correcto
ui.imprimirAlerta('Agregado correctamente');

//Imprimir los gastos
const {gastos, restante} = presupuesto;
ui.agregarGastos(gastos);

ui.actualizarRestante(restante);

ui.comprobarPresupuesto(presupuesto);

//Reinicia el formulario
formulario.reset();
};

function eliminarGasto(id){
    //Elimina los gastos del objeto
    presupuesto.eliminarGasto(id);

    //Elimina los gastos del HTML
    const {gastos, restante} = presupuesto;
    ui.agregarGastos(gastos)
    ui.actualizarRestante(restante);
    ui.comprobarPresupuesto(presupuesto);

};

