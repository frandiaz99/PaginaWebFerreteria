import React from 'react'
import '../../styles/Header.css' 
import { useLocation , Link, useNavigate} from 'react-router-dom'
import routes from '../../routes.js'
import CrearIniciar from './CrearIniciar'
import OpcionesUser from './OpcionesUser.jsx'
import NavBar from './NavBar.jsx'

const esInvitado= () =>{
  return (
    location.pathname.startsWith('/invitado') || location.pathname === '/'
    )
}

const estaEnModoUser= () =>{ 
  return (
    location.pathname.startsWith('/user')
    )
}

const estaEnModoEmpleado= () =>{
  return (
    location.pathname.startsWith('/empleado')
    )
}

function Header() {
  const location= useLocation()
  const navigate= useNavigate()
  const user= JSON.parse(localStorage.getItem('user')) || null

  const handleHome = () =>{
    if (user){
      if (estaEnModoUser()){
        navigate(routes.userPrincipal)
      }else if (estaEnModoEmpleado() && user.rol == 2){
        navigate(routes.empleadoPrincipal)
      }else{
        navigate(routes.adminPrincipal)
      }
    }else{
      navigate(routes.pagPrincipal)
    }
  }

  return (
    <header className="header">

      <div className='header__section1'> {/*Header parte amarilla*/}

          <div className='section1__logo' onClick={handleHome} style={{cursor:'pointer'}}>
            <img src="Fedeteria_Solo_Logo.png" alt="Fedeteria" className='logo__soloLogo'/>
            <img src="Fedeteria_Solo_Texto.png" alt="Fedeteria" className='logo__soloTexto' />
          </div>

        {esInvitado() ? <CrearIniciar/> : <OpcionesUser/>}

      </div>



      <div className='header__section2'> {/*Header parte gris*/}

        {esInvitado() ? <Link to={routes.sucursales}><p>Ver Sucursales</p></Link> : <NavBar/>}

      </div>

    </header>
  )
}

export default Header