import React, { useState, useEffect } from 'react'
import '../styles/MisArticulos.css'
import Articulo from '../components/Articulo';

function MisArticulos() {
  const [totalArticulos, setTotalArticulos]= useState([])


  useEffect(() => {     //Cambiar el url del fetch cuando se cree del back para obtener articulos de un usuario
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
    <main className='main'>
      <div className='misArticulosPrincipal'>

        <div className='contenedor-misArticulos'>    {/*Aca irian los tasados*/}
          <div className='tituloMisArticulos'>
            <h3>Tasados</h3>
          </div>
          {totalArticulos.length == 0 ? 
            <div className='noHayItems'>
              No tenes artículos tasados
            </div> //Podria ser un componente
          :
          <div className='misArticulos'>
            {totalArticulos.map((art, index) =>(<Articulo key={index} articulo={art} misArticulos={true}/>))}
          </div>
          }
        </div>

        <div className='contenedor-misArticulos'>  {/*Aca irian los NO tasados*/}
          <div className='tituloMisArticulos'>
            <h3>No tasados</h3>
          </div>
          {totalArticulos.length == 0 ? 
            <div className='noHayItems'>
              No hay articulos para tasar
            </div> //Podria ser un componente
          :
            <div className='misArticulos'>
              {totalArticulos.map((art, index) =>(<Articulo key={index} articulo={art} misArticulos={true}/>))}
            </div>
          }
        </div>

      </div>
    </main>
  )
}

export default MisArticulos