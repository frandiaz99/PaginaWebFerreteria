import React from 'react'
import '../../styles/Header.css' 
import { useLocation , Link} from 'react-router-dom'
import routes from '../../routes.js'
import CrearIniciar from './CrearIniciar'
import OpcionesUser from './OpcionesUser.jsx'
import NavBar from './NavBar.jsx'

const esInvitado= () =>{
  return (
    location.pathname.startsWith('/invitado') || esPaginaPrincipal()
    )
}

const esUser= () =>{ 
  return (
    location.pathname.startsWith('/user')
    )
}

const esAdmin= () =>{
  return (
    location.pathname.startsWith('/admin')
    )
}

const esEmpleado= () =>{
  return (
    location.pathname.startsWith('/empleado')
    )
}

const esPaginaPrincipal= () =>{
  return( 
    location.pathname === routes.pagPrincipal
  )
}

function Header() {
  const location= useLocation()

  return (
    <header className="header">

      <div className='header__section1'>

        <Link to={routes.pagPrincipal}>
          <div className='section1__logo'>
            <img src="Fedeteria_Solo_Logo.png" alt="Fedeteria" className='logo__soloLogo'/>
            <img src="Fedeteria_Solo_Texto.png" alt="Fedeteria" className='logo__soloTexto' />
          </div>
        </Link>

        {(esUser() || esEmpleado() || esAdmin()) && <OpcionesUser/>} {/*crear opciones emple y opciones admin*/}

        {esInvitado() && <CrearIniciar />}

      </div>

      <div className='header__section2'>

        {(esPaginaPrincipal() ||
        location.pathname === routes.sucursales
         )&& <Link to={routes.sucursales}><p>Ver Sucursales</p></Link>}

        {(esUser() || esEmpleado() || esAdmin()) &&  <NavBar/>}

      </div>

    </header>
  )
}

export default Header