import React from 'react'
import '../styles/PaginaPrincipal.css'
import Articulo from '../components/Articulo'
import UltimoTrueque from '../components/UltimoTrueque'
import Paginacion from '../components/Paginacion'
import { useState } from 'react'
import articulos from '../data/articulos.json' //Esto seria con un fetch en un useEffect

function PaginaPrincipal() {
  //var articulos; hay que leerlos del back
  const [pagActual,setPagActual]= useState(1);
  const [articulosFiltrados,setArticulosFiltrados]= useState(articulos) //setear esto en useEffect cuando se lee articulos del back
  const articulosXPag= 5 //en cada pagina mostrar 5 articulos
  const ultimosTrueques= [{num:1}, {num:2}, {num:3}, {num:4}, {num:5}]  //fetch para ultimosTrueques en useEffect
 
  const handlePageChange= (pagina) =>{
    setPagActual(pagina)
  } 

  const handleFiltros = (event) => {
    setArticulosFiltrados(articulos.filter(art => {
      return event.target.value === 'todo' || art.categoria === event.target.value;
    }))
  }
  const handleOrden = (event) =>{
    var articulosOrdenados=[]
    if (event.target.value == 'nada'){
      articulosOrdenados= articulos
    }else if(event.target.value == 'tasacion'){
      articulosOrdenados= [...articulosFiltrados].sort((a1,a2) => {return a2.tasacion - a1.tasacion}) //[...] para crear copia
    }else if (event.target.value == 'puntaje'){
      articulosOrdenados= [...articulosFiltrados].sort((a1,a2) => {return a2.puntaje - a1.puntaje})
    }
    setArticulosFiltrados(articulosOrdenados)
  }
  
  function mostrarArticulos(){  
    const ultimoarticulo= pagActual * articulosXPag
    const primerArticulo= ultimoarticulo - articulosXPag
    return articulosFiltrados.slice(primerArticulo,ultimoarticulo)
  }
  
  return (
    <>
      <main className='container'>
        
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
        
      </main>
      <Paginacion totalItems= {articulosFiltrados.length} itemsXPag={articulosXPag} onPageChange={handlePageChange}/>
    </>
  );
}

export default PaginaPrincipal
