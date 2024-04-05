import React from 'react'
import Header from '../components/Header/Header'
import {Routes, Route, useLocation} from 'react-router-dom'
import CrearCuenta from '../views/CrearCuenta'
import IniciarSesion from '../views/IniciarSesion'

function RutasInvitado() {
  const location= useLocation()

  const rutaDefinida = () => {
    return (
        [
        'crear_cuenta',
        'iniciar_sesion'
        ].includes(location.pathname.split('/')[2])
    )
  }

  return (
    <>
      {rutaDefinida() && <Header/>}
      <Routes>
          <Route path='crear_cuenta' element={<CrearCuenta/>}/>
          <Route path='/iniciar_sesion' element={<IniciarSesion/>}/>
          
          <Route path='*' element={<div>404 not found</div>}/>
      </Routes>
    </>
  )
}

export default RutasInvitado