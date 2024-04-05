import React from 'react'
import { Link } from 'react-router-dom'
import '../../styles/NavBar.css'
import routes from '../../routes'
function NavBar() {
  return (
    <>
    <div className='sucursales_promociones'>
      <Link to={routes.sucursalesLogin} style={{textDecoration:'none'}}><span>Ver Sucursales</span></Link>
      <Link to={routes.promociones} style={{textDecoration:'none'}}><span>Ver Promociones</span></Link>
    </div>

    <div className='subirArt'>
      <Link to={routes.subirArticulo}><button>Subir Articulo</button></Link>
    </div>

    <div className='art_trueques'>
      <Link to={routes.misArticulos} style={{textDecoration:'none'}}><span>Mis Articulos</span></Link>
      <Link to={routes.misTrueques} style={{textDecoration:'none'}}><span>Mis Trueques</span></Link>
    </div>
    </>
  )
}

export default NavBar