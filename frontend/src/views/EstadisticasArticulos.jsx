import React, { useState, useEffect } from 'react'
import '../styles/EstadisticasArticulos.css'
import ArticuloDestacado from '../components/ArticuloDestacado';
import routes from '../routes';
import FiltroFechaDestacados from '../components/FiltroFechaDestacados';


function EstadisticasArticulos() {
  const [articulosDestacados, setArticulosDestacados]= useState([])
  const [articulosDestacadosFiltro, setArticulosDestacadosFiltro]= useState([])
  const [eliminado, setEliminado]= useState(false)
  const actualizarArticulosDestacados = (a) =>{
    setArticulosDestacadosFiltro(a)
  }
  const [totalGanancias, setTotalGanancias] = useState(0)

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
    }, [location.pathname])

    useEffect(() => {
      setArticulosDestacadosFiltro(articulosDestacados)
    }, [articulosDestacados])

    useEffect(() => {
      var ganancias = 0;
      for (let i = 0; i < articulosDestacadosFiltro.length; i++) {
        ganancias += articulosDestacadosFiltro[i].promocionado.duracion * 2000;
      }
      setTotalGanancias(ganancias)
    }, [articulosDestacadosFiltro])

    useEffect(() => {
      console.log("que tiene el filtro: ")
      console.log(articulosDestacadosFiltro)
    }, [articulosDestacadosFiltro])
  }

  const reinicarArts= () =>{
    setEliminado(!eliminado)
  }

  return (
    <main className='main'>
      <div className='misArticulosPrincipal'>
        <FiltroFechaDestacados totalItems={articulosDestacados} actualizar={actualizarArticulosDestacados}/>
        <div className='contenedor-misArticulos'>
          <div className='tituloMisArticulos'>
            <h3>Art&iacute;culos destacados</h3>
          </div>
          {articulosDestacadosFiltro.length == 0 ? 
            <div className='noHayItems'>
              No se destacaron art&iacute;culos.
            </div> //Podria ser un componente
            :
            <div className='misArticulos'>
              {articulosDestacadosFiltro.slice(0, 3).map((art, index) =>(<ArticuloDestacado key={index} articulo={art} misArticulos={false} eliminar={reinicarArts}/>))}
              {articulosDestacadosFiltro.length > 3 && (
                <div className='misArticulos-overflow'>
                  {articulosDestacadosFiltro.slice(3).map((art, index) =>(<ArticuloDestacado key={index + 3} articulo={art} misArticulos={false} eliminar={reinicarArts}/>))}
                </div>
              )}
            </div>}
          <div className='ganancia-principal_admin_emple'>
            <h3 className='tituloGanancia'>Ganancia Total</h3>
            <h2 className='ganancia'>${totalGanancias}</h2>
          </div>
        </div>
      </div>
    </main>
  )
}

export default EstadisticasArticulos