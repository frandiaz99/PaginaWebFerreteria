import React, { useState, useRef, useEffect } from 'react'
import '../styles/TruequesPyC.css'
import Trueque from '../components/Trueque'
import Buscador from '../components/Buscador'
import FiltroFecha from '../components/FiltroFecha'
import { estaEnModoUser } from '../helpers/estaEnModo'

function obtenerMisTrueques(trueques, usuarioActual) {
  return trueques.filter(t => usuarioActual._id == t.articulo_publica.usuario._id || usuarioActual._id == t.articulo_compra.usuario._id)
}

function obtenerTruequesConfirmados(trueques, user) {
  const truequesConfirmados = trueques.filter(t => t.fecha_venta !== undefined)
  if (user.rol == 2) return truequesConfirmados.filter(t => t.sucursal._id == user.sucursal._id)
  else return truequesConfirmados
}

function TruequesPyC() {
  const usuarioActual = JSON.parse(localStorage.getItem('user'))
  const [verPendientes, setVerPendientes] = useState(JSON.parse(localStorage.getItem('verPendientes')))
  const [totalTruequesPendientes, setTotalTruequesPendientes]= useState([])
  const [truequesPendientes, setTruequesPendientes] = useState([])
  const [truequesCompletados, setTruequesCompletados] = useState([])
  const [totalTruequesCompletados, setTotalTruequesCompletados]= useState([])
  const [dataObtenida, setDataObtenida] = useState(false)
  const [eliminado, setEliminado] = useState(false)
  const [gananciaTotal, setGananciaTotal]= useState(0)
  const [verEstadisticas, setVerEstadisticas]= useState(false)

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
        if (estaEnModoUser()) {
            const t= obtenerMisTrueques(data.data, usuarioActual)
            setTruequesPendientes(t)
            setTotalTruequesPendientes(t)
        }
        else {
          const t=obtenerTruequesConfirmados(data.data, usuarioActual)
          setTruequesPendientes(t)
          setTotalTruequesPendientes(t)
        }
        setDataObtenida(true)
        console.log("trueques pendientes: ", data.data)
      })
      .catch(error => {
        console.error('Error:', error);
        setTruequesPendientes([])
        setTotalTruequesPendientes([])
        setDataObtenida(true)
      })
  }, [eliminado]);

  useEffect(() => {
    fetch("http://localhost:5000/trueque/getCompletados", {
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
        if (estaEnModoUser()) setTruequesCompletados(obtenerMisTrueques(data.data.reverse(), usuarioActual))
        else{
          const t= obtenerTruequesConfirmados(data.data.reverse(), usuarioActual)
          setTruequesCompletados(t)
          setTotalTruequesCompletados(t)
        } 
      })
      .catch(error => {
        console.error('Error:', error);
        setTruequesCompletados([])
      })
  }, []);


  const sumarGanancias= (ganancia) =>{
    setGananciaTotal(prevGananciaTotal => prevGananciaTotal + ganancia)
  }

  const handlePendientes = () => {
    titulo_completados_ref.current.style.color = 'rgb(170, 170, 170)'
    titulo_pendientes_ref.current.style.color = 'black'
    localStorage.setItem('verPendientes', 'true')
    setVerPendientes(true)
  }

  const handleCompletados = () => {
    titulo_completados_ref.current.style.color = 'black'
    titulo_pendientes_ref.current.style.color = 'rgb(170, 170, 170)'
    localStorage.setItem('verPendientes', 'false')
    setVerPendientes(false)
  }

  const handleCancelarTrueque = () => {
    setEliminado(!eliminado)
  }

  useEffect(() => {
    if (verPendientes){
      titulo_completados_ref.current.style.color = 'rgb(170, 170, 170)'
      titulo_pendientes_ref.current.style.color = 'black'
    }
    else{
      titulo_completados_ref.current.style.color = 'black'
      titulo_pendientes_ref.current.style.color = 'rgb(170, 170, 170)'
    }
  }, [])

  const handleBuscar= (dni) => {
    const truequesBuscados= totalTruequesPendientes.filter(t => String(t.articulo_compra.usuario.dni).includes(dni) || String(t.articulo_publica.usuario.dni).includes(dni))
    setTruequesPendientes(truequesBuscados)
  }

  const handleBuscarPorTrueque= (nombre) =>{
    const truequesBuscados= totalTruequesPendientes.filter(t => String(t.articulo_compra.nombre).includes(nombre) || String(t.articulo_publica.nombre).includes(nombre))
    setTruequesPendientes(truequesBuscados)
  }

  const actualizarTruequesCompletados= (t) =>{
    setTruequesCompletados(t)
    setVerEstadisticas(true)
  }

  return (
    <main className='main'>
      <div className='principal_admin_emple'>

        <div className='pendientes_y_completados-principal_admin_emple'>
          <h4 className='titulo-pendientes_y_completados' onClick={handlePendientes} ref={titulo_pendientes_ref}>Trueques Pendientes</h4>
          <h4 className='titulo-pendientes_y_completados' onClick={handleCompletados} ref={titulo_completados_ref}>Trueques Completados</h4>
        </div>


        <div className='filtros_y_trueques-principal_admin_emple'>
          {verPendientes ? <Buscador handleBuscar={estaEnModoUser() ? handleBuscarPorTrueque : handleBuscar} textoBoton={'Buscar'}/> : estaEnModoUser() ? null : <FiltroFecha totalItems={totalTruequesCompletados} actualizar={actualizarTruequesCompletados}/>}

          <div className='trueques'>
            {dataObtenida
              ?
              verPendientes
                ?
                truequesPendientes.length > 0
                  ?
                  truequesPendientes.map((t) => (
                    <>
                    <Trueque key={t._id} trueque={t} pendiente={verPendientes} cancelarTrueque={handleCancelarTrueque} />
                    </>
                  ))
                  :
                  <p> No hay trueques pendientes</p>
                :
                truequesCompletados.length > 0
                  ?
                  truequesCompletados.map((t) => (
                    <>
                    <Trueque key={t._id} trueque={t} pendiente={verPendientes} cancelarTrueque={handleCancelarTrueque} sumarGanancias={sumarGanancias} />
                    </>
                  ))
                  :
                    verEstadisticas 
                    ?
                      <p>No se realizaron trueques entre esas fechas</p>
                    :
                      <p> No hay trueques completados</p>
              :
              <p>Cargando Trueques...</p>
            }

          </div>
        </div>

        {(verPendientes == false && !estaEnModoUser() )&& <div className='ganancia-principal_admin_emple'>
          <h3 className='tituloGanancia'>Ganancia Total</h3>
          <h2 className='ganancia'>${gananciaTotal}</h2>
          </div>}
      </div>
    </main>
  )
}

export default TruequesPyC