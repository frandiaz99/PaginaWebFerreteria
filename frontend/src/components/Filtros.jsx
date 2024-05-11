import React from 'react'
import '../styles/Filtros.css'
import { useState, useEffect } from 'react'

function Filtros({totalItems, actualizar}) {
  const [filtro,setFiltro]= useState('todo')
  const[orden,setOrden]= useState('precio')
  const [resultadosFiltrados, setResultadosFiltrados] = useState([])
  
  const handleFiltros = (event) => {
    setFiltro(event.target.value)
  }

  const handleOrden = (event) =>{
    setOrden(event.target.value)
  }

  useEffect(() => {
    let resultados = [...totalItems];

    // Filtrar
    if (filtro !== 'todo') {
      const partes = filtro.split('-');
      const A = parseInt(partes[0]);
      const B = parseInt(partes[1]);
      resultados = resultados.filter(articulo => articulo.precio > A && articulo.precio <= B);
    }

    // Ordenar 
    resultados.sort((a, b) => {
      if (orden === 'precio') return b.precio - a.precio
      else if (orden === 'puntaje') return b.puntaje - a.puntaje
    });

    setResultadosFiltrados(resultados);

  }, [filtro, orden, totalItems])

  useEffect(() => {
    actualizar(resultadosFiltrados);
  }, [resultadosFiltrados]);

  return ( null
    /*<div className='orden-y-filtros'>
      
        <div className='orden'>
            <label htmlFor="ordenar">Ordenar por</label>
            <select data-select='filtros' name="selector" id="ordenar" onChange={handleOrden}>
              <option value="precio">Mayor Tasación</option>
              <option value="puntaje">Mayor puntaje</option>
            </select>
        </div>

        <div className='filtros'>
            <label htmlFor='filtrar'>Filtros</label>
            <select data-select='filtros' name="selector" id="filtrar" onChange={handleFiltros}>
              <option value="todo">Sin filtros</option>
              <option value="0-1000">$0-$1000</option> {/*Por ahora lo manejamos asi pero deberia ser value con una categoria 
              <option value="1000-10000">$1000-$10000</option>
              <option value="10000-50000">$10000-$50000</option>
              <option value="50000-100000">+$50000</option>
            </select>
          </div>

    </div>*/
  )
}

export default Filtros