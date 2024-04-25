import React, { useState } from 'react'
import '../../styles/OpcionesUser.css'
import { Link , useNavigate, useLocation} from 'react-router-dom'
import routes from '../../routes'
import DropNotificaciones from './DropNotificaciones'

const estaEnModoUser= () =>{ 
  return (
    location.pathname.startsWith('/user')
    )
}
const estaEnModoAdmin= () =>{
  return (
    location.pathname.startsWith('/admin')
    )
}
const estaEnModoEmpleado= () =>{
  return (
    location.pathname.startsWith('/empleado')
    )
}

function OpcionesUser() {
  const navigate= useNavigate()
  const [dropCuentaOpen,setDropCuentaOpen]= useState(false)
  const [dropNotificacionesOpen, setDropNotificacionesOpen]= useState(false)
  const user=JSON.parse(localStorage.getItem('user')) || null
  var srcFotoPerfil;

  if (user){  //esto es para no leer un null que solo pasa si borras el storage manualmente
    srcFotoPerfil= user.foto
  }

  const handleHome = () =>{
    if (estaEnModoUser()){
      navigate(routes.userPrincipal)
    }else if (estaEnModoEmpleado() && user.rol == 2){
      navigate(routes.empleadoPrincipal)
    }else{
      navigate(routes.adminPrincipal)
    }
  }

  const handleNotificaciones = () =>{
    setDropCuentaOpen(false)
    setDropNotificacionesOpen(!dropNotificacionesOpen)
  }

  const handleCuenta = () =>{
    setDropNotificacionesOpen(false)
    setDropCuentaOpen(!dropCuentaOpen)
  }

  const handleCerrarSesion = () => {
    fetch('http://localhost:5000/user/logout', {
      method: "POST",
    })
    .then(response => {
      if (response.ok) {
        console.log('La sesión se cerró correctamente');
        localStorage.removeItem('user');
        navigate(routes.pagPrincipal);
      } else {
        throw new Error('Hubo un problema al cerrar sesión');
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
  }
  

  return (
    <div className='opcionesUser'>

        <div className='homeIcon' onClick={handleHome} style={{cursor:'pointer'}}>
            <ion-icon name="home-outline" size='small'></ion-icon>
        </div>

        {estaEnModoUser() &&
          <div className='containersDrop'>

              <div className='notificaciones' onClick={handleNotificaciones} style={{cursor:'pointer'}}>
                  <ion-icon name="chatbubbles-outline" size='small'></ion-icon>
              </div>

          {dropNotificacionesOpen && <DropNotificaciones/>}

          </div>
        }

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

            {estaEnModoUser() && 
            <Link to={routes.perfil} className='link'>
              <div className='dropCuenta__items'>
                <ion-icon name="person-outline"></ion-icon>
                <p>Ver perfil</p>
              </div>            
            </Link>}

            {(user.rol === 2 && estaEnModoUser()) &&
            <Link to={routes.empleadoPrincipal} className='link'>
              <div className='dropCuenta__items'>
                <ion-icon name="key-outline"></ion-icon>
                <p>Cuenta Empleado</p>
            </div>
            </Link>}

            {estaEnModoEmpleado() &&
            <Link to={routes.userPrincipal} className='link'>
              <div className='dropCuenta__items'>
                <ion-icon name="key-outline"></ion-icon>
                <p>Cuenta Usuario</p>
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