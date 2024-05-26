import React, { useState, useRef, useEffect } from 'react'
import '../styles/PrincipalAdminYEmple.css'
import Trueque from '../components/Trueque'
import Buscador from '../components/Buscador'
import FiltroFecha from '../components/FiltroFecha'
import trueques from '../data/trueques.json'


function PrincipalAdminYEmple() {
  const usuarioActual= JSON.parse(localStorage.getItem('user'))
  const [verPendientes, setVerPendientes]= useState(true)
  const [truequesPendientes, setTruequesPendientes]= useState([])
  const [truequesCompletados, setTruequesCompletados]= useState([])
  const titulo_pendientes_ref= useRef(null)
  const titulo_completados_ref= useRef(null)

  const handlePendientes= () =>{
    titulo_completados_ref.current.style.color = 'rgb(170, 170, 170)'
    titulo_pendientes_ref.current.style.color = 'black'
    setVerPendientes(true)
  }                                                     

  const handleCompletados= () =>{
    titulo_completados_ref.current.style.color = 'black'
    titulo_pendientes_ref.current.style.color = 'rgb(170, 170, 170)'
    setVerPendientes(false)
  }

  const obtenerPendientes=(trueques)=>{
    if (trueques){
      console.log(usuarioActual)
      if (usuarioActual.rol == 2){
        return trueques.filter(t => t.completado == false && t.sucursal == usuarioActual.puntos) //comparo con puntos porque no existe sucursal todavia en mongo
      }
      return trueques.filter(t => t.completado == false)
    }
    return []
  }                                                                  //funciones temporales hasta obtener del back pendientes y completados
  const obtenerCompletados=(trueques)=>{
    if (trueques){
      if (usuarioActual.rol == 2){
        return trueques.filter(t => t.completado == true && t.sucursal == usuarioActual.puntos)
      }
      return trueques.filter(t => t.completado == true)
    }
    return []
  }

  useEffect(()=>{
    titulo_completados_ref.current.style.color = 'rgb(170, 170, 170)'
    titulo_pendientes_ref.current.style.color = 'black'
    fetch('http://localhost:5000/trueque/getPendientes', 
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
        setTruequesPendientes(data.data) 
      })
      .catch(error => {
        const errorData= JSON.parse(error.message)
        console.log(errorData.message)
      });
    setTruequesCompletados(obtenerCompletados(trueques))//import json temporal
  }, [])

  return (
    <main className='main'>
      <div className='principal_admin_emple'>

          <div className='pendientes_y_completados-principal_admin_emple'>
            <h4 className='titulo-pendientes_y_completados' onClick={handlePendientes} ref={titulo_pendientes_ref}>Trueques Pendientes</h4>
            <h4 className='titulo-pendientes_y_completados' onClick={handleCompletados} ref={titulo_completados_ref}>Trueques Completados</h4>
          </div>
       

          <div className='filtros_y_trueques-principal_admin_emple'>
            {verPendientes ? <Buscador/> : <FiltroFecha/>}

            <div className='trueques'>
              {verPendientes && truequesPendientes.map((t,index) => (<Trueque key={index} trueque={t} pendiente={true}/>))}
              {!verPendientes && truequesCompletados.map((t,index) => (<Trueque key={index} trueque={t} pendiente={false}/>))}
            </div>
        </div>

       {!verPendientes && <div className='ganancia-principal_admin_emple'>
          <h3 className='tituloGanancia'>Ganancia</h3>
          <h2 className='ganancia'>$1000</h2>
        </div>}

      </div>
    </main>
  )
}

export default PrincipalAdminYEmple