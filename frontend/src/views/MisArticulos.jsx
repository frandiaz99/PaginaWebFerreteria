import React, { useState, useEffect } from 'react'
import '../styles/MisArticulos.css'
import Articulo from '../components/Articulo';
import routes from '../routes';

function MisArticulos() {
  const [articulosTasados, setArticulosTasados]= useState([])
  const [articulosNOtasados, setArticulosNOtasados]= useState([])
  const [eliminado, setEliminado]= useState(false)
  const [obtenido, setObtenido]= useState(false)

  if (location.pathname == routes.empleadoTasar){
    useEffect(() => {
      fetch('http://localhost:5000/articulo/getArticulos', 
      {method: "GET", 
      headers: {
        "Content-Type": "application/JSON",
        //"Cookie": localStorage.getItem('jwt')
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
        setArticulosTasados(data.filter(a => a.precio > 0))
        setArticulosNOtasados(data.filter(a => a.precio == 0))
        setObtenido(true)
      })
      .catch(error => {
        const errorData= JSON.parse(error.message)
        console.log(errorData.message)
      });
    }, [eliminado])
  }else{
      useEffect(() => {
        fetch('http://localhost:5000/articulo/getMisArticulos', 
        {method: "GET", 
        headers: {
          "Content-Type": "application/JSON",
          //"Cookie": localStorage.getItem('jwt')
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
          setArticulosTasados(data.articulos.filter(a => a.precio > 0))
          setArticulosNOtasados(data.articulos.filter(a => a.precio == 0))
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
            <h3>Tasados</h3>
          </div>
          {articulosTasados.length == 0 ? 
            <div className='noHayItems'>
              {obtenido ? location.pathname == routes.empleadoTasar ? 'No hay articulos tasados' : 'No tenes artículos tasados'
              : 'Cargando artículos tasados...'}
            </div> //Podria ser un componente
          :
          <div className='misArticulos'>
            {articulosTasados.map((art, index) =>(<Articulo key={index} articulo={art} misArticulos={true} eliminar={reinicarArts}/>))}
          </div>
          }
        </div>

        <div className='contenedor-misArticulos'>  {/*Aca irian los NO tasados*/}
          <div className='tituloMisArticulos'>
            <h3>No tasados</h3>
          </div>
          {articulosNOtasados.length == 0 ? 
            <div className='noHayItems'>
              {obtenido ? 'No hay articulos para tasar' : 'Cargando artículos no tasados...'}
            </div> //Podria ser un componente
          :
            <div className='misArticulos'>
              {articulosNOtasados.map((art, index) =>(<Articulo key={index} articulo={art} misArticulos={true} eliminar={reinicarArts}/>))}
            </div>
          }
        </div>

      </div>
    </main>
  )
}

export default MisArticulos