class Tablas {
    constructor() {
        this.tablas = JSON.parse( localStorage.getItem('tablas') ) || [];
    }

    insertandoTablas(tabla) {
      this.tablas = [...this.tablas, tabla ]; 
      this.sincronizarStorage();
    }

    eliminarTablas(id) {
      this.tablas = this.tablas.filter( tabla => tabla.idTabla !== Number(id) );
      this.sincronizarStorage();
    }


    insertandoFilas(filas) {
      this.tablas = this.tablas.map( tabla => {
        if(tabla.nombre.toLowerCase() === filas.nombreTablaInsertar.trim().toLowerCase() ) {
            return { ...tabla, filas: [ ...(tabla.filas || []), { ...filas } ] };
        }
        return tabla;
      } )
      this.sincronizarStorage();
  
    }

    eliminarFilas(id) {
      this.tablas.forEach(tabla => {
        tabla.filas = tabla.filas.filter(fila => {
          if (fila.idFila === Number(id)) {
            if (fila.completado) {
              tabla.completados -= 1;
            }
            return false; // No se incluirá la fila en el nuevo array
          }
          return true; // Se incluirá la fila en el nuevo array
        });
      });
      
      this.sincronizarStorage();

    }
    

    editarFilas(nombre) {
      this.tablas.map( tabla => {
         tabla.filas.map( fila => {
          if(fila.idFila === Number(nombre.dataset.id)) {
            fila.nombre = nombre.value;
          }
          return fila;
         } )
         return tabla;
      } )
    this.sincronizarStorage();
    }

    filaCompletada(id, tipo) {
      this.tablas.map(tabla => {
        tabla.filas.map(fila => {
          if (fila.idFila === Number(id) && tipo === 'completado') {
            fila.completado = true;
            tabla.completados += 1;
          }
      
          if (fila.idFila === Number(id) && tipo === 'incompleto') {
            fila.completado = false;
            tabla.completados -= 1;
          }
      
          return fila;
        });
      
        return tabla;
      });

      this.sincronizarStorage();
      
    }
    

    sincronizarStorage() {
      localStorage.setItem('tablas', JSON.stringify(this.tablas) );
    }

}

export default Tablas;