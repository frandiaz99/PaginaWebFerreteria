import React, { useState, useEffect } from 'react'
import '../styles/MisArticulos.css'
import Articulo from '../components/Articulo';
import routes from '../routes';

function EstadisticasArticulos() {
  const [articulosDestacados, setArticulosDestacados]= useState([])
  const [eliminado, setEliminado]= useState(false)
  const [obtenido, setObtenido]= useState(false)

  if (location.pathname == routes.empleadoEstadisticas){
    useEffect(() => {
      fetch('http://localhost:5000/articulo/getArticulos', 
      {method: "GET", 
      headers: {
        "Content-Type": "application/json",
      },credentials: "include"})
      .then(response => {
        if (!response.ok) {
          return response.json().then(data => {
              throw new Error(JSON.stringify({message: data.message, status: data.status}));
          })
        }
        return response.json();
      })
      .then(data => {
        console.log(data)
        setArticulosDestacados(data.filter(a => a.promocionado && a.promocionado.aprobado))
        console.log(articulosDestacados.length)
        setObtenido(true)
      })
      .catch(error => {
        const errorData= JSON.parse(error.message)
        console.log(errorData.message)
      });
    }, [eliminado])
  }

  const reinicarArts= () =>{
    setEliminado(!eliminado)
  }

  return (
    <main className='main'>
      <div className='misArticulosPrincipal'>

        <div className='contenedor-misArticulos'>    {/*Aca irian los tasados*/}
          <div className='tituloMisArticulos'>
            <h3>Art&iacute;culos destacados</h3>
          </div>
          {articulosDestacados.length == 0 ? 
            <div className='noHayItems'>
              No hay articulos destacados.
            </div> //Podria ser un componente
          :
          <div className='misArticulos'>
            {articulosDestacados.map((art, index) =>(<Articulo key={index} articulo={art} misArticulos={false} eliminar={reinicarArts}/>))}
          </div>
          }
        </div>

      </div>
    </main>
  )
}

export default EstadisticasArticulos