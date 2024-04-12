import React from 'react'
import '../styles/PaginaPrincipal.css'
import Articulo from '../components/Articulo'
import UltimoTrueque from '../components/UltimoTrueque'
import Paginacion from '../components/Paginacion'
import { useState, useEffect } from 'react'

function PaginaPrincipal() {
  var articulos= []
  const [pagActual,setPagActual]= useState(1);
  const [articulosActuales,setArticulosActuales]= useState(articulos)
  const [filtro,setFiltro]= useState('todo')
  const[orden,setOrden]= useState('nada')
  
  const articulosXPag= 5 //en cada pagina mostrar 5 articulos
  const ultimosTrueques= [{num:1}, {num:2}, {num:3}, {num:4}, {num:5}]  //fetch para ultimosTrueques en useEffect
  
  const handlePageChange= (pagina) =>{
    setPagActual(pagina)
  } 

  const handleFiltros = (event) => {
    setFiltro(event.target.value)
  }
  const handleOrden = (event) =>{
    setOrden(event.target.value)
  }
  
  function mostrarArticulos(){  
    const ultimoarticulo= pagActual * articulosXPag
    const primerArticulo= ultimoarticulo - articulosXPag
    return articulosActuales.slice(primerArticulo,ultimoarticulo)
  }
  
  //Cada vez que cambia filtro u orden hay que filtrar y ordenar de nuevo
  useEffect(() => {
    let resultados = [...articulos];

    // Filtrar
    if (filtro !== 'todo') {
      resultados = resultados.filter(articulo => articulo.categoria == filtro);
    }

    // Ordenar 
    if (orden !== 'nada'){
      resultados.sort((a, b) => {
        if (orden === 'tasacion') {
            return b.tasacion - a.tasacion
        } else if (orden === 'puntaje'){ 
            return b.puntaje - a.puntaje
        }
    })
    }

    setArticulosActuales(resultados);
}, [filtro, orden])

useEffect(() => {
  fetch('http://localhost:5000/publicacion/getPublicaciones')
  .then(response => {
    if (!response.ok) {
      throw new Error('Hubo un problema con la solicitud');
    }
    return response.json();
  })
  .then(data => {
    articulos= data;
    setArticulosActuales(articulos)
  })
  .catch(error => {
    console.error('Error:', error);
  });
}, [])

  return (
    <>
      <main className='container'>
        
        <div className='body-trueques'>
          <div className='ultimosTrueques'>
            <h4>Últimos Trueques</h4>
            <div className='ultimosTrueques-lista'>
              {ultimosTrueques.map((unTrueque) =>(
                <UltimoTrueque/>
              ))}
            </div>
          </div>

          <div className='articulos'>
            {mostrarArticulos().map((art) =>(
              <Articulo articulo={art}/>
            ))}
          </div>

          <div className='orden-y-filtros'>
            <div className='orden'>
              <label htmlFor="ordenar">Ordenar por</label>
              <select name="selector" id="ordenar" onChange={handleOrden}>
                <option value="nada">Sin orden</option>
                <option value="tasacion">Mayor Tasación</option>
                <option value="puntaje">Mayor puntaje</option>
              </select>
            </div>
            <div className='filtros'>
              <label htmlFor='filtrar'>Filtros</label>
              <select name="selector" id="filtrar" onChange={handleFiltros}>
                <option value="todo">Todo</option>
                <option value="c1">$0-$1000</option>
                <option value="c2">$1000-$10000</option>
                <option value="c3">$10000-$50000</option>
                <option value="c4">+$50000</option>
              </select>
            </div>
          </div>
        </div>

        <Paginacion totalItems= {articulosActuales.length} itemsXPag={articulosXPag} onPageChange={handlePageChange}/>

      </main>
    </>
  );
}

export default PaginaPrincipal
