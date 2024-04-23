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
    <div className='navIzquierda nav'>
      {estaEnModoUser() ?
      <>
      <Link className='boton' to={routes.sucursalesLogin} ><span>Ver Sucursales</span></Link>
      <Link className='boton' to={routes.promociones} ><span>Ver Promociones</span></Link>
      </> :
      <>
      {(user.rol == 3 && (estaEnModoAdmin() || estaEnModoEmple())) && <Link className='boton' to={routes.adminSucursales}><span>Ver Sucursales</span></Link>}

      <Link className='boton' to={routes.empleadoPromociones} ><span>Ver Promociones</span></Link>
      <Link className='boton' to={routes.empleadoEstadisticas} ><span>Artículos destacados</span></Link>
      </>
      }
      
    </div>

    {estaEnModoUser() &&
    <div className='subirArt nav'>
      <Link className='boton' to={routes.subirArticulo}><button className='boton'>Subir Articulo</button></Link>
    </div>}

    {(estaEnModoAdmin() || estaEnModoEmple()) &&
    <div className='subirArt nav'>
      <Link className='boton' to={routes.empleadoTasar}><button className='boton'>Tasar Artículo</button></Link>
    </div>
    }

    <div className='navDerecha nav'>
      {estaEnModoUser() &&
      <>
      <Link className='boton' to={routes.misArticulos} ><span>Mis Articulos</span></Link>
      <Link className='boton' to={routes.misTrueques} ><span>Mis Trueques</span></Link>
      </>}

      {(!estaEnModoUser() && user.rol === 3) &&
      <>
      <Link className='boton' to={routes.adminUsuarios} ><span>Usuarios</span></Link>
      <Link className='boton' to={routes.adminEmpleados} ><span>Empleados</span></Link>
      </>}
    </div>

    </>
  )
}

export default NavBar