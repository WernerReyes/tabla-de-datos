class UI {

    crearTablas( container, tablas ) {

        this.limpiarHTML(container);
        
        tablas.forEach( tabla => {
            
            const { idTabla, nombre, filas, completados } = tabla;

            // SCRIPTING
            const divCard = document.createElement('DIV');
            divCard.className = 'card py-5 my-4 mx-auto div-padre"';
            divCard.style.maxWidth = '90%';

                // Encabezado tabla
                const divHeader = document.createElement('DIV');
                divHeader.className = 'card-header p-0 position-relative mt-n4 mx-3 z-index-2';
                    const divBorder = document.createElement('DIV');
                    divBorder.className = 'bg-gradient-primary shadow-primary border-radius-lg pt-4 pb-3';
                        const divBnt = document.createElement('DIV');
                        divBnt.className = 'position-absolute top-0 end-0 m-2';
                            const btnElimnarTabla = document.createElement('BUTTON');
                            btnElimnarTabla.className = 'btn btn-primary btn-xxs borrar-tabla p-2';
                            btnElimnarTabla.dataset.id = idTabla;
                            btnElimnarTabla.innerHTML = `<i class="bi bi-x-circle" data-id="${idTabla}"></i>`;
                        const nameTabla = document.createElement('H6');
                        nameTabla.className = 'text-white text-capitalize ps-3 text-center';
                        nameTabla.textContent = nombre.toUpperCase();
                        const divPorcentaje = document.createElement('DIV');
                        divPorcentaje.className = 'd-flex justify-content-center align-items-center';
                        divPorcentaje.innerHTML = `
                             <div>
                             <div class="d-flex justify-content-between align-items-center mb-1 max-width-progress-wrap">
                                 <p class="text-success mb-0">${(filas) ? this.porcentajeCompleto(filas,completados) : 0}%</p>
                             </div>
                             <p class="mb-0">
                                 <span class="fila-completada">${completados}</span>
                                 <span>/</span>
                                 <span class="total-filas">${ (filas) ? filas.length : 0 }</span>
                             </p>
                             <div class="progress progress-md">
                             <div class="progress-bar bg-success" role="progressbar" style="width: ${(filas) ? this.porcentajeCompleto(filas,completados) : 0}%" aria-valuenow="${(filas) ? this.porcentajeCompleto(filas,completados) : 0}" aria-valuemin="0" aria-valuemax="100"></div>
                             </div>
                        `

                        divBnt.appendChild(btnElimnarTabla);
                    divBorder.appendChild(divBnt);
                    divBorder.appendChild(nameTabla);
                    divBorder.appendChild(divPorcentaje);
                divHeader.appendChild(divBorder);
            divCard.appendChild(divHeader);


                if( filas ) {

                     // Filas
                const divFilas = document.createElement('DIV');
                    const cardBody = document.createElement('DIV');
                    cardBody.classList.add('card-body','px-0','pb-2');
                        const tableResponsive = document.createElement('DIV');
                        tableResponsive.classList.add('table-responsive','p-0');
                            const divTabla = document.createElement('TABLE');
                            divTabla.className = 'table align-items-center mb-0';
                               
                                // Encabezado fila
                                const thead = document.createElement('THEAD');
                                thead.innerHTML = `
                                    <tr>
                                       <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Nombre</th>
                                       <th class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Status</th>
                                       <th class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Fecha</th>
                                       <th class="text-secondary opacity-7"></th>
                                    </tr>
                                `

                 filas.forEach( fila => {
                    
                    const { nombre, idFila, fecha, completado } = fila;

                                // Fila
                                const tbody = document.createElement('TBODY');
                                tbody.classList.add('padre-fila');
                                    tbody.innerHTML = `
                                    <tr>
                                        <td>
                                          <div class="d-flex px-2 py-1">
                                            <div class="form-check form-switch">
                                              <input class="form-check-input completado" type="checkbox" role="switch" data-id="${idFila}" ${ completado ? 'checked' : ''}>
                                            </div>
                                            <div class="d-flex flex-column justify-content-center">
                                              <h6 class="mb-0 text-sm">${nombre}</h6>
                                              <p class="text-xs text-secondary mb-0"></p>
                                            </div>
                                          </div>
                                        </td>
                                        <td class="align-middle text-center text-sm">
                                          <span class="badge badge-sm  ${ !completado ? 'bg-danger' : 'bg-success' } imcompleto">${ !completado ? 'No completado' : 'completado' }</span>
                                        </td>
                                        <td class="align-middle text-center">
                                          <span class="text-secondary text-xs font-weight-bold">${fecha}</span>
                                        </td>
                                        <td class="align-middle">
                                          <a class="text-secondary font-weight-bold text-xs editar-fila" data-id="${idFila}">Editar</a>
                                        </td>
                                        <td class="align-middle">
                                          <a class="text-secondary font-weight-bold text-xs eliminar-fila" data-id="${idFila}">Eliminar</a>
                                        </td>
                                    </tr>
                                    
                                    
                                    `
                            divTabla.appendChild(thead);
                            divTabla.appendChild(tbody);
                        tableResponsive.appendChild(divTabla);
                    cardBody.appendChild(tableResponsive);
                divFilas.appendChild(cardBody);

            divCard.appendChild(divFilas);
                  } )
                }

        // Insertamos en el HTML
        container.appendChild(divCard);

        });
        

    }

    porcentajeCompleto(filas, completados) {
        if( filas.length ) {
            return (completados*100)/filas.length
        }
        return 0;
    }

    motrarAlerta(insercion, mensaje, tipo) {
        
        const existe = document.querySelector('.text-center.alert');
        
      if(!existe) {
        // Crear el div
        const divMensaje = document.createElement('DIV');
        divMensaje.classList.add('text-center', 'alert', 'mx-5', 'p-2', 'mt-3');

        if(tipo === 'error') {
            divMensaje.classList.add('alert-danger');
        } else {
            divMensaje.classList.add('alert-success');
        }

        // Mensaje de error
        divMensaje.textContent = mensaje;
        
        // Insertamos en el HTML
        insercion.insertAdjacentElement('afterend', divMensaje);

        // Quitar el mensaje del HTML
        setTimeout( () => {
         divMensaje.remove();
        },3000);

       }
    }

    limpiarHTML(container) {
        while( container.firstChild ) {
            container.removeChild(container.firstChild);
        }
    }


}

export default UI;