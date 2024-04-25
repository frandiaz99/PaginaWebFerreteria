import React from 'react'
import '../styles/Filtros.css'
import { useState, useEffect } from 'react'

function Filtros({totalItems, actualizar}) {
  const [filtro,setFiltro]= useState('todo')
  const[orden,setOrden]= useState('nada')
  
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
      const partes = filtro.split('-'); //Temporal, deberian existir las categorias
      const A = parseInt(partes[0]);
      const B = parseInt(partes[1]);
      resultados = resultados.filter(articulo => articulo.precio > A && articulo.precio <= B);
    }
    // Ordenar 
    if (orden !== 'nada'){
      resultados.sort((a, b) => {
        if (orden === 'precio') return b.precio - a.precio
        else if (orden === 'puntaje') return b.puntaje - a.puntaje
      })
    }
    actualizar(resultados);

  }, [filtro, orden])

  return (
    <div className='orden-y-filtros'>
      
        <div className='orden'>
            <label htmlFor="ordenar">Ordenar por</label>
            <select name="selector" id="ordenar" onChange={handleOrden}>
              <option value="nada">Sin orden</option>
              <option value="precio">Mayor Tasación</option>
              <option value="puntaje">Mayor puntaje</option>
            </select>
        </div>

        <div className='filtros'>
            <label htmlFor='filtrar'>Filtros</label>
            <select name="selector" id="filtrar" onChange={handleFiltros}>
              <option value="todo">Todo</option>
              <option value="0-1000">$0-$1000</option> {/*Por ahora lo manejamos asi pero deberia ser value con una categoria */}
              <option value="1000-10000">$1000-$10000</option>
              <option value="10000-50000">$10000-$50000</option>
              <option value="50000-100000">+$50000</option>
            </select>
          </div>

    </div>
  )
}

export default Filtros