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
      resultados = resultados.filter(articulo => articulo.precio == filtro);
    }

    // Ordenar 
    resultados.sort((a, b) => {
      if (orden === 'precio') return b.precio - a.precio
      else if (orden === 'puntaje') return b.usuario.valoracion - a.usuario.valoracion
    });

    setResultadosFiltrados(resultados);

  }, [filtro, orden, totalItems])

  useEffect(() => {
    actualizar(resultadosFiltrados);
  }, [resultadosFiltrados]);

  return ( 
    <div className='orden-y-filtros'>
      
        <div className='orden'>
            <label htmlFor="ordenar">Ordenar por</label>
            <select data-select='filtros' name="selector" id="ordenar" onChange={handleOrden}>
              <option value="precio">Mayor Categoria</option>
              <option value="puntaje">Mayor puntaje</option>
            </select>
        </div>

        <div className='filtros'>
            <label htmlFor='filtrar'>Filtros</label>
            <select data-select='filtros' name="selector" id="filtrar" onChange={handleFiltros}>
              <option value="todo">Sin filtros</option>
              <option value="1">Categoria 1</option>
              <option value="2">Categoria 2</option>
              <option value="3">Categoria 3</option>
              <option value="4">Categoria 4</option>
              <option value="5">Categoria 5</option>
              <option value="6">Categoria 6</option>
              <option value="7">Categoria 7</option>
              <option value="8">Categoria 8</option>
              <option value="9">Categoria 9</option>
              <option value="10">Categoria 10</option>
            </select>
          </div>

    </div>
  )
}

export default Filtros