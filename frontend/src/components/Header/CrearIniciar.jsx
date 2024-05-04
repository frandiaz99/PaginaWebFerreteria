import React from 'react'
import '../../styles/CrearIniciar.css' 
import { Link, useLocation, useNavigate } from 'react-router-dom'
import routes from '../../routes.js'

function CrearIniciar() {
  const location= useLocation()
  const navigate= useNavigate();

  return (
        <div className='section1__crear_inicar'>

          {location.pathname === routes.pagPrincipal &&
          <Link to={routes.crearCuenta} className='link'>
            <p className='crear_inicar__crearCuenta'>
              Crear cuenta
            </p>
          </Link>}


          {location.pathname !== routes.pagPrincipal && 
            <div className='volver' onClick={ () => {navigate(routes.pagPrincipal)}}>
              <ion-icon name="home-outline" size='small'></ion-icon> 
            </div>}


          {location.pathname !== routes.iniciarSesion &&
          <Link to={routes.iniciarSesion} className='link'>
          <button className='boton_iniciar'>Iniciar Sesión</button>
          </Link>}

        </div>
  )
}

export default CrearIniciar