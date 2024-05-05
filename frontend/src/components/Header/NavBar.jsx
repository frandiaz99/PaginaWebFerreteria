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
      <Link className='boton' to={routes.sucursalesLogin}><span className='optionNav'>Ver Sucursales</span></Link>
      <Link className='boton' to={routes.promociones} ><span className='optionNav'>Ver Promociones</span></Link>
      </> :
      <>
      {user.rol == 3 && <Link className='boton' to={routes.adminSucursales}><span className='optionNav'>Ver Sucursales</span></Link>}

      <Link className='boton' to={routes.empleadoPromociones} ><span className='optionNav'>Ver Promociones</span></Link>
      <Link className='boton' to={routes.empleadoEstadisticas} ><span className='optionNav'>Artículos destacados</span></Link>
      </>
      }
      
    </div>

    {estaEnModoUser() &&
    <div className='subirArt nav'>
      <Link className='boton' to={routes.subirArticulo}><span className='optionNav'>Subir Articulo</span></Link>
    </div>}

    {(estaEnModoEmple() && user.rol == 2) &&
    <div className='subirArt nav'>
      <Link className='boton' to={routes.empleadoTasar}><span className='optionNav' style={{marginRight:'13rem'}}>Tasar Artículo</span></Link>
    </div>
    }
    {user.rol == 3 &&
    <div className='subirArt nav'>
      <Link className='boton' to={routes.empleadoTasar}><span className='optionNav' style={{marginRight:'7rem'}}>Tasar Artículo</span></Link>
    </div>
    }

    <div className='navDerecha nav'>
      {estaEnModoUser() &&
      <>
      <Link className='boton' to={routes.misArticulos} ><span className='optionNav'>Mis Articulos</span></Link>
      <Link className='boton' to={routes.misTrueques} ><span className='optionNav'>Mis Trueques</span></Link>
      </>}

      {user.rol === 3 &&
      <>
      <Link className='boton' to={routes.adminUsuarios} ><span className='optionNav'>Usuarios</span></Link>
      <Link className='boton' to={routes.adminEmpleados} ><span className='optionNav'>Empleados</span></Link>
      </>}
    </div>
    </>
  )
}

export default NavBar