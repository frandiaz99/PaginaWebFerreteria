import React, { useState, useRef, useEffect } from 'react'
import '../styles/PrincipalAdminYEmple.css'
import Trueque from '../components/Trueque'
import Buscador from '../components/Buscador'
import FiltroFecha from '../components/FiltroFecha'
import trueques from '../data/trueques.json'


function PrincipalAdminYEmple() {
  const usuarioActual = JSON.parse(localStorage.getItem('user'))
  const [verPendientes, setVerPendientes] = useState(true)
  const [truequesPendientes, setTruequesPendientes] = useState([])
  const [truequesCompletados, setTruequesCompletados] = useState([])
  const titulo_pendientes_ref = useRef(null)
  const titulo_completados_ref = useRef(null)

  useEffect(() => {
    fetch("http://localhost:5000/trueque/getPendientes", {
      method: "GET",
      headers: { "Content-Type": "application/JSON" },
      credentials: "include"
    })
      .then(response => {
        if (!response.ok) {
          return response.json().then(data => {
            throw new Error(JSON.stringify({ message: data.message, status: data.status }));
          })
        }
        return response.json();
      })
      .then(data => {
        setTruequesPendientes(data.data)
        console.log("donde tan los trueques, aca tannnnn: ", truequesPendientes)
        console.log("data1 -> ", data)
        console.log("data2:", data.data)
        console.log("cuanto te mide?: ", truequesPendientes, length)
        setVerPendientes(true)
      })
      .catch(error => {
        console.error('Error:', error);
      })
  }, []);

  const handlePendientes = () => {
    titulo_completados_ref.current.style.color = 'rgb(170, 170, 170)'
    titulo_pendientes_ref.current.style.color = 'black'
    setVerPendientes(true)
  }

  const handleCompletados = () => {
    titulo_completados_ref.current.style.color = 'black'
    titulo_pendientes_ref.current.style.color = 'rgb(170, 170, 170)'
    setVerPendientes(false)
  }

  const obtenerPendientes = (trueques) => {
    if (trueques) {
      console.log(usuarioActual)
      if (usuarioActual.rol == 2) {
        return trueques.filter(t => t.completado == false && t.sucursal == usuarioActual.puntos) //comparo con puntos porque no existe sucursal todavia en mongo
      }
      return trueques.filter(t => t.completado == false)
    }
    return []
  }
  const obtenerCompletados = (trueques) => {
    if (trueques) {
      if (usuarioActual.rol == 2) {
        return trueques.filter(t => t.completado == true && t.sucursal == usuarioActual.puntos)
      }
      return trueques.filter(t => t.completado == true)
    }
    return []
  }

  useEffect(() => {
    titulo_completados_ref.current.style.color = 'rgb(170, 170, 170)'
    titulo_pendientes_ref.current.style.color = 'black'
    //fetch para obtener todos los trueques
    //setTruequesPendientes(obtenerPendientes(trueques)) //import json temporal
    setTruequesCompletados(obtenerCompletados(trueques))
  }, [])

  return (
    <main className='main'>
      <div className='principal_admin_emple'>

        <div className='pendientes_y_completados-principal_admin_emple'>
          <h4 className='titulo-pendientes_y_completados' onClick={handlePendientes} ref={titulo_pendientes_ref}>Trueques Pendientes</h4>
          <h4 className='titulo-pendientes_y_completados' onClick={handleCompletados} ref={titulo_completados_ref}>Trueques Completados</h4>
        </div>


        <div className='filtros_y_trueques-principal_admin_emple'>
          {verPendientes ? <Buscador /> : <FiltroFecha />}

          <div className='trueques'>
            {verPendientes && truequesPendientes.length > 0 ? (
              truequesPendientes.map((t, index) => (
                <Trueque key={index} trueque={t} pendiente={true} />
              ))
            ) : verPendientes ? (
              <p> No hay trueques pendientes</p>
            ) : truequesCompletados.length > 0 ? (
              truequesCompletados.map((t, index) => (
                <Trueque key={index} trueque={t} pendiente={false} />
              ))
            ) : (
              <p>No hay trueques completados</p>
            )}

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