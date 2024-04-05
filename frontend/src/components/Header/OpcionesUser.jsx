import React, { useState } from 'react'
import '../../styles/OpcionesUser.css'
import { Link , useNavigate} from 'react-router-dom'
import routes from '../../routes'
import DropNotificaciones from './DropNotificaciones'

function OpcionesUser() {
  const navigate= useNavigate()
  const [dropCuentaOpen,setDropCuentaOpen]= useState(false)
  const [dropNotificacionesOpen, setDropNotificacionesOpen]= useState(false)
  const user=JSON.parse(localStorage.getItem('user')) || null
  var srcFotoPerfil;

  if (user){  //esto es para no leer un null que solo pasa si borras el storage manualmente
    srcFotoPerfil= user.foto
  }

  const handleNotificaciones = () =>{
    setDropCuentaOpen(false)
    setDropNotificacionesOpen(!dropNotificacionesOpen)
  }

  const handleCuenta = () =>{
    setDropNotificacionesOpen(false)
    setDropCuentaOpen(!dropCuentaOpen)
  }

  const handleCerrarSesion = () =>{
    localStorage.removeItem('user')
    navigate(routes.pagPrincipal)
  }

  return (
    <div className='opcionesUser'>

        <div className='homeIcon'>
          <Link to={routes.pagPrincipal}>
            <ion-icon name="home-outline" size='small'></ion-icon>
          </Link>
        </div>

        <div className='containersDrop'>

          <div className='notificaciones' onClick={handleNotificaciones} style={{cursor:'pointer'}}>
            <ion-icon name="chatbubbles-outline" size='small'></ion-icon>
          </div>

          {dropNotificacionesOpen && <DropNotificaciones/>}
        </div>

        <div className='containersDrop'>

          <div className='cuenta' onClick={handleCuenta} style={{cursor:'pointer'}}>
            {srcFotoPerfil && <img src={srcFotoPerfil} alt="" className='fotoCuenta' />}
            {!srcFotoPerfil && <ion-icon name="person-outline" size="large"></ion-icon>}
          </div>

          {dropCuentaOpen && 
          <div className='dropCuenta'>

            <div className='dropCuenta__mail'>

                <div className='cuenta'>
                  {srcFotoPerfil && <img src={srcFotoPerfil} alt="" className='fotoCuenta' />}
                  {!srcFotoPerfil && <ion-icon name="person-outline" size="large"></ion-icon>}
                </div>

                <div className='nombre_y_email'>
                  <span>{user.nombre}</span>
                  <p style={{fontSize:'10px', color:'#5A5D6C'}}>{user.email}</p>
                </div>

            </div>

            <hr />

            <div className='dropCuenta__items'>
              <ion-icon name="person-outline"></ion-icon>
              <p>Ver perfil</p>
            </div>

            {user.rol === 2 && 
            <Link to={routes.empleadoPrincipal}>
              <div className='dropCuenta__items'>
                <ion-icon name="key-outline"></ion-icon>
                <p>Cuenta Empleado</p>
            </div>
            </Link>}
            
            {user.rol === 3 && 
            <Link to={routes.adminPrincipal}>
              <div className='dropCuenta__items'>
                <ion-icon name="key-outline"></ion-icon>
                <p>Cuenta Administrador</p>
              </div>
            </Link>}

            <hr />

            <div className='dropCuenta__items' onClick={handleCerrarSesion}>
              <ion-icon name="log-out-outline"></ion-icon>
              <p>Cerrar sesión</p>
            </div>

          </div>}

        </div>
    </div>
  )
}

export default OpcionesUser