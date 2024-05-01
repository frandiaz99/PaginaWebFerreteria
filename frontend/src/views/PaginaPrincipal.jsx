import React from 'react'
import '../styles/PaginaPrincipal.css'
import Articulo from '../components/Articulo'
import UltimoTrueque from '../components/UltimoTrueque'
import Paginacion from '../components/Paginacion'
import Filtros from '../components/Filtros'
import { useState, useEffect, useRef } from 'react'

const articulosXPag= 5 //en cada pagina mostrar 5 articulos
const ultimosTrueques= [{num:1}, {num:2}, {num:3}, {num:4}, {num:5}]  //fetch para ultimosTrueques en useEffect

function PaginaPrincipal() {
  const [totalArticulos, setTotalArticulos]= useState([])
  const [articulosActuales,setArticulosActuales]= useState(totalArticulos) //aca se guardan los filtrados
  const [pagActual,setPagActual]= useState(1);
  const articulosRef= useRef(null)

  const handlePageChange= (pagina) =>{
    articulosRef.current.scrollTop= 0 //Sube el scroll cuando cambias de pagina
    setPagActual(pagina)
  } 

  const handleFiltros= (resultado) =>{
    setArticulosActuales(resultado)
  }
  
  function mostrarArticulos(){  
    const ultimoarticulo= pagActual * articulosXPag
    const primerArticulo= ultimoarticulo - articulosXPag
    return articulosActuales.slice(primerArticulo,ultimoarticulo)
  }
  
  useEffect(() =>{
    setArticulosActuales(totalArticulos)
  }, [totalArticulos]) //Solo cambia la primera vez


  useEffect(() => {
    fetch('http://localhost:5000/articulo/getArticulos', 
    {method: "GET", 
    headers: {
      "Content-Type": "application/JSON",
      //"Cookie": localStorage.getItem('jwt')
    },credentials: "include"})
    .then(response => {
      if (!response.ok) {
        throw new Error('Hubo un problema al obtener los articulos');
      }
      return response.json();
    })
    .then(data => {
      setTotalArticulos(data)
    })
    .catch(error => {
      console.error('Error:', error);
    });
  }, [])


  return (
    <>
      <main className='main'>
        
        <div className='body-trueques'>
          <div className='ultimosTrueques'>
            <h4 className='tituloUltimoTrueques'>Últimos Trueques</h4>
            <div className='ultimosTrueques-lista'>
              {ultimosTrueques.map((unTrueque, indice) =>(
                <UltimoTrueque key={indice}/>
              ))}
            </div>
          </div>

          <div className='main-articulos'>
            <Filtros totalItems={totalArticulos} actualizar={handleFiltros}/> 
            
            <div className='articulos' ref={articulosRef}>
              {(totalArticulos.length == 0 || articulosActuales == 0)? 
                <div className='noHayItems'>
                  No hay articulos disponibles aún
                </div> //Podria ser un componente
              :
              mostrarArticulos().map((art, index) =>(<Articulo key={index} articulo={art}/>))
              }
            </div>

            {articulosActuales.length > 0 && <Paginacion totalItems= {articulosActuales.length} itemsXPag={articulosXPag} onPageChange={handlePageChange}/>}
          </div>
        </div>
      </main>
    </>
  );
}

export default PaginaPrincipal
