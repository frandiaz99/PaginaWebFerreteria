import React from 'react'
import { Link } from 'react-router-dom'
import '../../styles/NavBar.css'
import routes from '../../routes'

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

const estaEnModoEmple= () =>{
  return (
    location.pathname.startsWith('/empleado')
    )
}

function NavBar() {
  const user= JSON.parse(localStorage.getItem('user')) || null
  return (
    <>
    <div className='navIzquierda'>
      {estaEnModoUser() ?
      <>
      <Link to={routes.sucursalesLogin} style={{textDecoration:'none'}}><span>Ver Sucursales</span></Link>
      <Link to={routes.promociones} style={{textDecoration:'none'}}><span>Ver Promociones</span></Link>
      </> :
      <>
      {(user.rol == 3 && (estaEnModoAdmin() || estaEnModoEmple())) && <Link to={routes.adminSucursales} style={{textDecoration:'none'}}><span>Ver Sucursales</span></Link>}

      <Link to={routes.empleadoPromociones} style={{textDecoration:'none'}}><span>Ver Promociones</span></Link>
      <Link to={routes.empleadoEstadisticas} style={{textDecoration:'none'}}><span>Artículos destacados</span></Link>
      </>
      }
      
    </div>

    {estaEnModoUser() &&
    <div className='subirArt'>
      <Link to={routes.subirArticulo}><button>Subir Articulo</button></Link>
    </div>}

    {(estaEnModoAdmin() || estaEnModoEmple()) &&
    <div className='subirArt'>
      <Link to={routes.empleadoTasar}><button>Tasar Artículo</button></Link>
    </div>
    }

    <div className='navDerecha'>
      {estaEnModoUser() &&
      <>
      <Link to={routes.misArticulos} style={{textDecoration:'none'}}><span>Mis Articulos</span></Link>
      <Link to={routes.misTrueques} style={{textDecoration:'none'}}><span>Mis Trueques</span></Link>
      </>}

      {(!estaEnModoUser() && user.rol === 3) &&
      <>
      <Link to={routes.adminUsuarios} style={{textDecoration:'none'}}><span>Usuarios</span></Link>
      <Link to={routes.adminEmpleados} style={{textDecoration:'none'}}><span>Empleados</span></Link>
      </>}
    </div>

    </>
  )
}

export default NavBar