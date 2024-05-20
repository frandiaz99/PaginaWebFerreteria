import React from 'react';
import '../styles/Paginacion.css'
import { useEffect, useState } from 'react';

function Paginacion({totalItems, itemsXPag, onPageChange}) {
  const [pagActual,setPagActual]= useState(1); 
  const totalPaginas= Math.ceil(totalItems / itemsXPag)

  const handlePageChange = (page) => {
    setPagActual(page);
    onPageChange(page);
  };

  const mostrarAnterior= pagActual > 1
  const mostrarSiguiente = pagActual < totalPaginas

  useEffect(() => {  //Si cambia el total de páginas por las dudas ir a la pagina 1 para no tener errores de que pagina mostrar
    setPagActual(1)
    handlePageChange(1)
  }, [totalPaginas]) 

  return (
    <div className='paginas'>
      {mostrarAnterior ?(
        <div className='paginaCambio' onClick={() => handlePageChange(pagActual-1)}><ion-icon name="caret-back-outline"></ion-icon></div>
      ) : null}
      <div className='pagina'>{pagActual} de {totalPaginas}</div>
      
      {mostrarSiguiente ?(
       <div className='paginaCambio' onClick={() => handlePageChange(pagActual+1)}><ion-icon name="caret-forward-outline"></ion-icon></div> 
      ) : null}
    </div>
  );
}

export default Paginacion;
