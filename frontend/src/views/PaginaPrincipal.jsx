import React from 'react'
import '../styles/PaginaPrincipal.css'
import Articulo from '../components/Articulo'
import UltimoTrueque from '../components/UltimoTrueque'
import Paginacion from '../components/Paginacion'
import Filtros from '../components/Filtros'
import { useState, useEffect } from 'react'

const articulosXPag= 5 //en cada pagina mostrar 5 articulos
const ultimosTrueques= [{num:1}, {num:2}, {num:3}, {num:4}, {num:5}]  //fetch para ultimosTrueques en useEffect

function PaginaPrincipal() {
  const [totalArticulos, setTotalArticulos]= useState([])
  const [articulosActuales,setArticulosActuales]= useState(totalArticulos) //aca se guardan los filtrados
  const [pagActual,setPagActual]= useState(1);

  const handlePageChange= (pagina) =>{
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


  useEffect(() => { //Se obtienen los articulos
    fetch('http://localhost:5000/publicacion/getPublicaciones')
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

          <Filtros totalItems={totalArticulos} actualizar={handleFiltros}/>
        </div>

        {articulosActuales.length > 0 && <Paginacion totalItems= {articulosActuales.length} itemsXPag={articulosXPag} onPageChange={handlePageChange}/>}

      </main>
    </>
  );
}

export default PaginaPrincipal
