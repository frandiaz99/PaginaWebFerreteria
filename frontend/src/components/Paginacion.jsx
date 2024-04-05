import '../styles/Paginacion.css'
import { useState } from 'react';

function Paginacion({totalItems, itemsXPag, onPageChange}) {
  const [pagActual,setPagActual]= useState(1); 
  const totalPaginas= Math.ceil(totalItems / itemsXPag)

  const handlePageChange = (page) => {
    setPagActual(page);
    onPageChange(page);
  };

  const mostrarAnterior= pagActual > 1
  const mostrarSiguiente = pagActual < totalPaginas

  return (
    <div className='paginas'>
      {mostrarAnterior ?(
        <div className='paginaCambio' onClick={() => handlePageChange(pagActual-1)}>{'<'}</div>
      ) : null}

      <div className='pagina'>{pagActual}/{totalPaginas}</div>
      
      {mostrarSiguiente ?(
       <div className='paginaCambio' onClick={() => handlePageChange(pagActual+1)}>{'>'}</div> 
      ) : null}
    </div>
  );
}

export default Paginacion;