import React from 'react'
import { Link } from 'react-router-dom'
import '../../styles/NavBar.css'
import routes from '../../routes'

const modoUser= () =>{ 
  return (
    location.pathname.startsWith('/user')
    )
}

const modoAdmin= () =>{
  return (
    location.pathname.startsWith('/admin')
    )
}

const modoEmple= () =>{
  return (
    location.pathname.startsWith('/empleado')
    )
}

function NavBar() {
  const user= JSON.parse(localStorage.getItem('user')) || null
  return (
    <>
    <div className='navIzquierda'>
      {modoUser() ?
      <>
      <Link to={routes.sucursalesLogin} style={{textDecoration:'none'}}><span>Ver Sucursales</span></Link>
      <Link to={routes.promociones} style={{textDecoration:'none'}}><span>Ver Promociones</span></Link>
      </> :
      <>
      {((modoAdmin() || modoEmple()) && user.rol == 3) && <Link to={routes.adminSucursales} style={{textDecoration:'none'}}><span>Ver Sucursales</span></Link>}
      <Link to={routes.empleadoPromociones} style={{textDecoration:'none'}}><span>Ver Promociones</span></Link>
      <Link to={routes.empleadoEstadisticas} style={{textDecoration:'none'}}><span>Estadísticas Artículos</span></Link>
      </>
      }
      
    </div>

    {modoUser() &&
    <div className='subirArt'>
      <Link to={routes.subirArticulo}><button>Subir Articulo</button></Link>
    </div>}

    {(modoAdmin() || modoEmple()) &&
    <div className='subirArt'>
      <Link to={routes.empleadoTasar}><button>Tasar Artículo</button></Link>
    </div>
    }

    <div className='navDerecha'>
      {modoUser() &&
      <>
      <Link to={routes.misArticulos} style={{textDecoration:'none'}}><span>Mis Articulos</span></Link>
      <Link to={routes.misTrueques} style={{textDecoration:'none'}}><span>Mis Trueques</span></Link>
      </>}

      {(!modoUser() && user.rol === 3) &&
      <>
      <Link to={routes.adminUsuarios} style={{textDecoration:'none'}}><span>Usuarios</span></Link>
      <Link to={routes.adminEmpleados} style={{textDecoration:'none'}}><span>Empleados</span></Link>
      </>}
    </div>

    </>
  )
}

export default NavBar