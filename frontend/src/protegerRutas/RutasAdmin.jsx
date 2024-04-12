import React from 'react'
import Header from '../components/Header/Header'
import {Routes, Route, useLocation} from 'react-router-dom'
import AdminUsuarios from '../views/AdminUsuarios.jsx'
import AdminEmpleados from '../views/AdminEmpleados.jsx'
import PrincipalAdminYEmple from '../views/PrincipalAdminYEmple.jsx'
import Sucursales from '../views/Sucursales.jsx'

function RutasAdmin() {
    const location= useLocation()

    const rutaDefinida = () => {
      return (
          [
          'usuarios',
          'empleados',
          'sucursales'
          ].includes(location.pathname.split('/')[2]) || location.pathname === '/admin'
      )
    }
  
    return (
      <>
        {rutaDefinida() && <Header/>}
        <Routes>
            <Route path='' element={<PrincipalAdminYEmple/>}/>
            <Route path='sucursales' element={<Sucursales/>}/>
            <Route path='usuarios' element={<AdminUsuarios/>}/>
            <Route path='empleados' element={<AdminEmpleados/>}/>
            <Route path='*' element={<div>404 not found</div>}/>
        </Routes>
      </>
    )
}

export default RutasAdmin