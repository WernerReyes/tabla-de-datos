// VARIABLES
const padreContenedor = document.querySelector('#contenedor-padre');

const nombreFila = document.querySelector('#nombreFila');
const nombreTabla = document.querySelector('#nombreTabla');
const nombreTablaBuscar = document.querySelector('#nombreTablaBuscar')

const bntCrear = document.querySelector('.crear-tabla');
const btnAgregarFilas = document.querySelector('.agregar-filas');


let informacionTablas = [];
let editando;
let idFilas;


// EVENTOS
addEventListeners()
function addEventListeners() {
  
    // Cuando hace click
    bntCrear.addEventListener( 'click', datosTabla );
    btnAgregarFilas.addEventListener( 'click', datosFilas );

}


// FUNCIONES
function datosTabla(e) {
  e.preventDefault();

  // Desaabilitamos el formulario de agregar-filas
  btnAgregarFilas.previousElementSibling.classList.add('d-none');
  // Habilitamos el formulario de crear-tabla
  btnAgregarFilas.previousElementSibling.previousElementSibling.classList.remove('d-none');
  
 
  
  if(bntCrear.textContent.trim() === 'Crear tabla') {
 // Comprobamos si se cumple la condicion
 if( nombreTabla.value.trim() === '') {
  mostrarError('Campo obligatorio', '.mensaje-error');
   return;
 }

  // Comprobamos si la tabla ingresada existe.
  const nombreExistente = informacionTablas.some( info => info.nombreTabla === nombreTabla.value.trim().toLowerCase());
  if(nombreExistente) {
    mostrarError(`La tabla "${nombreTabla.value}" ya existe`, '.mensaje-error');
    return;
  }

 // Guardamos los datos en el objeto
  const infoTablasObj = {
    nombreTabla: nombreTabla.value.trim().toLowerCase(),
    fila: [],
    cantidadFilas: 0,
    filasCompletadas: 0,
    id: Date.now()
  }
  
  // Llenamos el arreglo
  informacionTablas = [...informacionTablas, {...infoTablasObj}];

   // Creamos la tabla
   tablaCreada();
  
   // Reseteamos el formulario
   e.target.parentElement.reset();
}

bntCrear.textContent = 'Crear tabla';
btnAgregarFilas.textContent = 'Agregar filas';
  
}



function datosFilas(e) {
  e.preventDefault();

  // Habilitamos el formulario de agregar-filas
  btnAgregarFilas.previousElementSibling.classList.remove('d-none');
  // Ocultamos el formulario de crear-tabla
  btnAgregarFilas.previousElementSibling.previousElementSibling.classList.add('d-none');
  

  if(btnAgregarFilas.textContent === 'Agregar' || btnAgregarFilas.textContent === 'Guardar cambios') {
  // Comprobamos si los campos no estan vacios
  if( nombreFila.value.trim() === '' || nombreTablaBuscar.value.trim() === '') {
    mostrarError('Campos obligatorios', '.mensaje-error-2');
     return;
   }
 
  // Creamos un objeto donde se almacenan los datos respectivos
  const objetoFila = {
      nombreFila: nombreFila.value.trim(),
      fecha: new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'numeric', year: 'numeric' }),
      idFila: Date.now()
  };

  // Obtenemos el indice donde se va a agregar la fila
  const indiceTabla = 
  informacionTablas.findIndex( tabla => tabla.nombreTabla === nombreTablaBuscar.value.trim().toLowerCase() );
  
  // Si el indice devuelve -1, significa que la tabla buscada no existe
  if( indiceTabla !== -1 ) {

    if(editando) {
      // console.log(idFilas);
      editarFilas( {...objetoFila}, idFilas );
      
      // Habilitamos el input de busqueda
      nombreTablaBuscar.disabled = false;

      btnAgregarFilas.textContent = 'Agregar';

      editando = false;
    } else {
      
     // Agregamos datos al arreglo
     informacionTablas[indiceTabla].fila.push({...objetoFila});

     // Actualizamos la cantidad-filas al AGREGAR
     actualizarCantidadFilas(informacionTablas[indiceTabla], `div[data-id='${informacionTablas[indiceTabla].id}'] .total-filas`)
    
     
    }

     // Pasamoe el padre a la nueva funcion crear
     const padre = padreContenedor.querySelector(`div[data-id='${informacionTablas[indiceTabla].id}']`);
     filasCreadas(informacionTablas[indiceTabla].fila, padre);

     // Resetemos el formulario
     e.target.parentElement.reset();

     return;
    
  } 

    mostrarError(`No existe una tabla llamanda ${nombreTablaBuscar.value}`, '.mensaje-error-2')
  
  return;
  }

  
  btnAgregarFilas.textContent = 'Agregar';
  bntCrear.textContent = 'Crear nueva tabla';
 
}


function actualizarCantidadFilas(info , selector) {
  const contenido = padreContenedor.querySelector(selector);
     info.cantidadFilas = info.fila.length;
     contenido.textContent = `${info.fila.length}`;
}


function editarFilas(filaEditada, idFila) {
   informacionTablas.forEach( info => {
    info.fila = info.fila.map( filas => filas.idFila === idFila ? filaEditada : filas );
   })

}


function tablaCreada() {


  if(informacionTablas.length > 0) {

  
      informacionTablas.forEach( info => {
      
        const elementoExistente = padreContenedor.querySelector(`div[data-id='${info.id}']`);
        if(!elementoExistente) {
    
          // creamos la tabla
          const divPadre = document.createElement('DIV');
          divPadre.classList.add('card','my-4','mx-auto','div-padre');
          divPadre.dataset.id = info.id;
          divPadre.style.maxWidth = '90%';

          // Creamos el boton agregar
          const btnBorrarTabla = document.createElement('BUTTON');
          btnBorrarTabla.classList.add('btn','btn-primary','btn-xxs','borrar-tabla','p-2');
          btnBorrarTabla.dataset.id = info.id;
          btnBorrarTabla.innerHTML = 
          `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-circle" viewBox="0 0 16 16">
          <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
          <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
        </svg>`;

        


          // Contenido agregado
          divPadre.innerHTML = 
          `
              <div class="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
                  <div class="bg-gradient-primary shadow-primary border-radius-lg pt-4 pb-3">
                      <div class="position-absolute top-0 end-0 m-2">
                      ${btnBorrarTabla.outerHTML}
                     </div>     
                      <h6 class="text-white text-capitalize ps-3 text-center">${info.nombreTabla}</h6> 

                      <div class="d-flex justify-content-center align-items-center">
                      <div>
                        <div class="d-flex justify-content-between align-items-center mb-1 max-width-progress-wrap">
                          <p class="text-success mb-0">79%</p>
                        </div>
                        <p class="mb-0">
                           <span class="fila-completada">0</span>
                           <span>/</span>
                           <span class="total-filas">0</span>
                        </p>
                        <div class="progress progress-md">
                        <div class="progress-bar bg-success" role="progressbar" style="width: 85%" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
                        </div>
                      </div>
                    </div>

                  </div> 
              </div>
              <div id='filas'>
                  <div class="card-body px-0 pb-2"> 
                    <div class="table-responsive p-0">
                      <table class="table align-items-center mb-0">
                         <thead>
                           <tr>
                             <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Author</th>
                             <th class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Status</th>
                             <th class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Employed</th>
                             <th class="text-secondary opacity-7"></th>
                           </tr>
                       </thead>
                       <tbody class='padre-fila'>

                       </tbody>
                      </table> 
                    </div>
               </div>  
            </div>
          `
          padreContenedor.appendChild(divPadre);
          
          // Borramos las tablas
          borrarTabla(divPadre.querySelector('.borrar-tabla'), info.id);
        
        }
      })  
      
      btnAgregarFilas.classList.remove('disabled');
      return;
     
}
 btnAgregarFilas.classList.add('disabled');

 // Desabilitamos el formulario de agregar-filas
 btnAgregarFilas.previousElementSibling.classList.add('d-none');

  // Habilitamos el formulario de crear-tabla
  btnAgregarFilas.previousElementSibling.previousElementSibling.classList.remove('d-none');
  
  bntCrear.textContent = 'Crear tabla';
  btnAgregarFilas.textContent = 'Agregar filas';

}


function filasCreadas(nameAgregar, divPadre) {
  const tbodyFilas = divPadre.firstElementChild.nextElementSibling
                             .firstElementChild.firstElementChild
                             .firstElementChild.firstElementChild.nextElementSibling;
  limpiarHTML(tbodyFilas);

  nameAgregar.forEach ( info => {

    // const elementoExistente = divPadre.querySelector(`tr[data-id='${info.idFila}']`);
    //     if(!elementoExistente) {

  const  { nombreFila, fecha, idFila }  = info;
  
  const tr = document.createElement('TR');
        tr.dataset.id = idFila;
        tr.innerHTML = 
      `
                <td>
                  <div class="d-flex px-2 py-1">
                    <div class="form-check form-switch">
                      <input class="form-check-input" type="checkbox" role="switch" id="completado">
                    </div>
                    <div class="d-flex flex-column justify-content-center">
                      <h6 class="mb-0 text-sm">${nombreFila}</h6>
                      <p class="text-xs text-secondary mb-0"></p>
                    </div>
                  </div>
                </td>
                <td class="align-middle text-center text-sm">
                  <span class="badge badge-sm bg-danger imcompleto">No mcompleto</span>
                </td>
                <td class="align-middle text-center">
                  <span class="text-secondary text-xs font-weight-bold"
                    >${fecha}</span
                  >
                </td>
                <td class="align-middle">
                  <a class="text-secondary font-weight-bold text-xs editar-fila">Editar</a>
                </td>
                <td class="align-middle">
                  <a class="text-secondary font-weight-bold text-xs eliminar-fila" data-id="${idFila}">Eliminar
                  </a>
                </td>
      `
      // Insertamos las filas
      tbodyFilas.appendChild(tr);
    
 // }     
} );

// Elimniar filas
const botonesEliminar = document.querySelectorAll('.eliminar-fila');
botonesEliminar.forEach(btn => {
const idFila = btn.dataset.id;
  borrarFilas(btn, idFila);
  });

 // Editamos filas
 const botonesEditar = document.querySelectorAll('.editar-fila');
 botonesEditar.forEach( btn => {
  btn.onclick = () => cargarEdicionFilas([...informacionTablas], nameAgregar, divPadre); 
 })

// Completado de filas
// const btnCompleto = document.querySelectorAll('#completado');
// btnCompleto.forEach ( btn => {
//   btn.addEventListener('change', () => {
//     verificar(informacionTablas, divPadre)
//   } );
// })

}

// function verificar(tabla, divPadre) {
//   const filaCompletada = divPadre.querySelector('.fila-completada');
//   const indexTabla = tabla.findIndex( info => info.id == divPadre.dataset.id);
  
//   tabla[indexTabla].fila.forEach(filas => {
//     const imcompleto = divPadre.querySelector(`tr[data-id='${filas.idFila}'] .imcompleto`);
//     const checkbox = divPadre.querySelector(`tr[data-id='${filas.idFila}'] input[type='checkbox']`);
    
//     if (checkbox.checked) {
//       // Aumentamos si se presiona check
//       tabla[indexTabla].filasCompletadas++;
//       filaCompletada.textContent = tabla[indexTabla].filasCompletadas;
      
//       // Cambiamos los estilos
//       imcompleto.classList.remove('bg-danger');
//       imcompleto.classList.add('bg-gradient-success');
//       imcompleto.textContent = 'Completado';

//       return;
//     } 
//       // Disminuimos si se presiona anti-check
//       tabla[indexTabla].filasCompletadas--;
//       filaCompletada.textContent = tabla[indexTabla].filasCompletadas;
      
//       // Cambiamos los estilos
//       imcompleto.classList.remove('bg-gradient-success');
//       imcompleto.classList.add('bg-danger');
//       imcompleto.textContent = 'No completado';
//   });
// }

function cargarEdicionFilas(tabla, filas, divPadre) {
  const indexTabla = tabla.findIndex( info => info.id == divPadre.dataset.id);
  tabla[indexTabla].fila.forEach( (fil,index) => {
    // Editamso los valores
    fil.nombreFila = filas[index].nombreFila;
    idFilas = filas[index].idFila;

    // Llenamos los formularios
  nombreFila.value = filas[index].nombreFila;
  nombreTablaBuscar.value = tabla[indexTabla].nombreTabla;
  })
  
  
  // Desabilitamos el input de busqueda
  nombreTablaBuscar.disabled = true;

  btnAgregarFilas.textContent = 'Guardar cambios';


  editando = true;

}

function borrarTabla(btnBorrar, id) {
  // Buscamos el elemento de la tabla que deseamos eliminar
  const tabla = padreContenedor.querySelector(`div[data-id='${id}']`);
  // console.log(tabla);

  if (tabla) {
  btnBorrar.onclick = () => {
    // Eliminamos la tabla de su padre
    tabla.parentNode.removeChild(tabla);

    // Filtramos el arreglo informacionTablas para eliminar la tabla eliminada
    informacionTablas = informacionTablas.filter(info => info.id !== id);

    // Vuelve a crear las tablas restantes para mantener la consistencia
    tablaCreada();
  }
  }
}

function borrarFilas(btnBorrar, idFila) {
    // Buscamos el elemento de la fila que deseamos eliminar
    const divFila = padreContenedor.querySelector(`tr[data-id='${idFila}']`);

    const idCount = divFila.parentElement.parentElement.parentElement
                         .parentElement.parentElement.parentElement.dataset.id;

    if (divFila) {
      btnBorrar.onclick = () => {
      // Eliminamos la fila de su padre
      divFila.parentNode.removeChild(divFila);

      // Filtramos el arreglo informacionTablas para eliminar la fila eliminada
      informacionTablas.forEach(info => {
        info.fila = info.fila.filter(fila => fila.idFila !== Number(idFila));
         
        // Actualizamos la cantidad de filas al ELIMINAR
        actualizarCantidadFilas(info, `div[data-id='${idCount}'] .total-filas`); 
      });

      // Vuelve a crear las filas restantes para mantener la consistencia
      tablaCreada();
    }
  };
}

function mostrarError(mensaje, selector) {
    const mensajeError = document.createElement("P");
    mensajeError.classList.add('alert', 'alert-danger');
    mensajeError.textContent = mensaje;

    // Insertarlo en el contenido
    const divError = document.querySelector(selector);
    limpiarHTML(divError);
    divError.appendChild(mensajeError);

    setTimeout( () =>  {
       mensajeError.remove();
    },3000);
}


function limpiarHTML(campo) {
    while( campo.firstChild ) {
        campo.removeChild(campo.firstChild );
    }
}
