import Tablas from "./clases/Tablas.js";
import UI from "./clases/UI.js";

( function() {

    // VARIABLES
    const contenedorTablas = document.querySelector('#contenedor-padre');
    const formularioTablas = document.querySelector('#formulario-tablas');
    const formularioFilas = document.querySelector('#formulario-filas');
    // Btns
    const btnAgregarFilas = formularioTablas.querySelector('.agregar-filas');
    const btnAgregarTablas = formularioFilas.querySelector('.crear-tabla');

    let editandoFila = false;
    
    // INSTANCIAS
    const tablas = new Tablas();
    const ui = new UI();

    // EVENTOS
    eventListeners();
    function eventListeners() {

        // Habilitamos el formulario que deseemos
        habilitarFormulario(btnAgregarFilas);
        habilitarFormulario(btnAgregarTablas);
       
        // Validamos los formularios
        formularioTablas.addEventListener( 'submit', validarTablas );
        formularioFilas.addEventListener('submit', validarFilas );

        // Cuando el documento ya esta listo 
        document.addEventListener('DOMContentLoaded', crearTablas );

        // Eliminar tablas
        eliminarTablas(contenedorTablas);

        // Eliminar filas
        eliminarFilas(contenedorTablas);
        // Editar filas
        editarFilas(contenedorTablas);
        //Completar filas
        filaCompletado(contenedorTablas);
    

    }

    // FUNCIONES
    function habilitarFormulario(btn) {
        btn.addEventListener('click', () => {
            formularioFilas.classList.toggle('d-none');
            formularioTablas.classList.toggle('d-none');
        })
    }


    function crearTablas() {

        ui.crearTablas(contenedorTablas, tablas.tablas);


        // Desabilitamos el btn de agregar filas
        if( tablas.tablas.length ) {
            btnAgregarFilas.classList.remove('disabled');

            console.log("Desabilitado");
        } else {
           btnAgregarFilas.classList.add('disabled');
           
           // En caso de que no hayga ninguna tabla desabilitamos la opcion "AGREGAR FILAS"
           formularioFilas.classList.add('d-none');
           formularioTablas.classList.remove('d-none');
        }
    }

    // <!-- TABLAS --> 
    function validarTablas(e) {
        e.preventDefault();
        
        const nombreTabla = document.querySelector('#nombreTabla').value;
  
        if(nombreTabla.trim() === '') {
            ui.motrarAlerta(formularioTablas.querySelector('.btns-cont'), "Campos abligatorio", 'error' );
            return;
        }

        if(tablas.tablas.some( tabla => tabla.nombre.toLowerCase() === nombreTabla.trim().toLowerCase() )) {
            ui.motrarAlerta(formularioTablas.querySelector('.btns-cont'),`La tabla "${nombreTabla}" ya existe`, 'error' );
            return;
        }
        
        // Enviamos un objeto
        tablas.insertandoTablas( 
            { 
            nombre: nombreTabla.trim(), 
            idTabla: new Date().getTime(),
            completados: 0
            
            } 
                               );

        // Creamos las tablas
        crearTablas();
        
        // Reiniciamos el formulario
        formularioTablas.reset();

    }

    function eliminarTablas(container) {
        container.addEventListener( 'click', e => {
            
            if( e.target.classList.contains('borrar-tabla') || e.target.classList.contains('bi-x-circle') ) {
                
                // Obtenemos su ID
                const idTabla = e.target.dataset.id;
                
                // Eliminamos las tablas
                tablas.eliminarTablas(idTabla);

                // Volvemos a crear las tablas
                crearTablas();
            }
            
        } )
        
    }
    

    // <!-- FILAS --> 
    function validarFilas(e) {
        e.preventDefault();

        const nombreFila = document.querySelector('#nombreFila');
        const nombreTablaInsertar = document.querySelector('#nombreTablaBuscar').value;

        if([nombreFila.value, nombreTablaInsertar].some( datos => datos.trim() === '' )) {
            ui.motrarAlerta(formularioFilas.querySelector('.btns-cont'), "Campos abligatorio", 'error' );
            return;
        }
          
        // Cuando editemos 
        if(editandoFila) {
            
            // Editamos las filas
            tablas.editarFilas(nombreFila);

            // Cambiamos lo que dice el boton
            formularioFilas.querySelector('.agregar-filas').innerHTML = '<i class="bi bi-box-arrow-in-down mx-2"></i>Insertar Fila';
            
            // Habilitamos el input
            document.querySelector('#nombreTablaBuscar').disabled = false;
            
            // Desactivamos el MODO EDICIÓN
            editandoFila = false;


        } else {

        if(!tablas.tablas.some( tabla => tabla.nombre === nombreTablaInsertar.trim().toLowerCase() )) {
            ui.motrarAlerta(formularioFilas.querySelector('.btns-cont'), `La tabla "${nombreTablaInsertar}" no existe`, 'error' );
            return;
        }

        tablas.insertandoFilas(
              {
                nombre: nombreFila.value.trim(),
                nombreTablaInsertar, 
                idFila: new Date().getTime(),
                fecha: new Date().toLocaleDateString('es-ES'),
                completado: false
              } );

        }
        
         // Creamos las filas
         crearTablas();
        
        // Reiniciamos el formulario
        formularioFilas.reset();

    }

    function eliminarFilas(container) {

        container.addEventListener( 'click', e => {
            
            if( e.target.classList.contains('eliminar-fila') ) {
                
                // Obtenemos su ID
                const idFila = e.target.dataset.id;
                
                // Eliminamos las tablas
                tablas.eliminarFilas(idFila);

                // // Volvemos a crear las tablas
                crearTablas();
            }
            
        } )

    }


    function editarFilas(container) {
        container.addEventListener( 'click', e => {
            
            if( e.target.classList.contains('editar-fila') ) {
                
                // Obtenemos su ID
                const idFila = e.target.dataset.id;
  
                // Hallamos el índice de la tabla que contiene la fila con el idFila proporcionado
                 const indexTabla = tablas.tablas.findIndex(tabla => tabla.filas.findIndex(fila => fila.idFila === Number(idFila)) !== -1);
               
                // Hallamos los valores de las filas a editar
                const filaEncontrado = tablas.tablas[indexTabla].filas.find( fila => fila.idFila === Number(idFila) );
                     
                // Llenamos los valores a editar
                const nombreFila = document.querySelector('#nombreFila');
                nombreFila.value = filaEncontrado.nombre;
                nombreFila.dataset.id = idFila;
                const nombreTablaInsertar = document.querySelector('#nombreTablaBuscar');
                nombreTablaInsertar.value = filaEncontrado.nombreTablaInsertar;
                nombreTablaInsertar.disabled = true;


                // En caso presionemos editar se colocara en el FORMULARIO PARA EDITAR
                formularioFilas.classList.remove('d-none');
                formularioTablas.classList.add('d-none');

                // Cambiamos lo que dice el boton
                formularioFilas.querySelector('.agregar-filas').innerHTML = '<i class="bi bi-pencil-square mx-2"></i>Editar fila';

                // El modo editar va a estar en TRUE
                editandoFila = true;
            }
            
        } )

    }

    function filaCompletado(container) {
       
        container.addEventListener('change', e => {

            if(e.target.classList.contains('completado')) {

                const idChecked = e.target.dataset.id;
                
                if(e.target.checked) {
                    tablas.filaCompletada(idChecked, 'completado')
                }  else {
                    tablas.filaCompletada(idChecked, 'incompleto')
                }
                crearTablas();
 
            }
        })
    }





} )();