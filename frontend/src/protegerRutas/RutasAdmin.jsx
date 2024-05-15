import React from 'react'
import Header from '../components/Header/Header'
import {Routes, Route, useLocation} from 'react-router-dom'
import AdminUsuarios from '../views/AdminUsuarios.jsx'
import AdminEmpleados from '../views/AdminEmpleados.jsx'
import PrincipalAdminYEmple from '../views/PrincipalAdminYEmple.jsx'
import Sucursales from '../views/Sucursales.jsx'
import NotFound from '../views/NotFound.jsx'
import RegistrarEmpleado from '../views/RegistrarEmpleado.jsx'
import Perfil from '../views/Perfil.jsx'
import EditarPerfil from '../views/EditarPerfil.jsx'
import CambiarContrasenia from '../views/CambiarContrasenia.jsx'
import SubirSucursal from '../views/SubirSucursal.jsx'

function RutasAdmin() {
    const location= useLocation()

    const rutaDefinida = () => {
      return (
          [
          'usuarios',
          'empleados',
          'sucursales',
          'registrar_empleado',
          'perfil',
          'editar_perfil',
          'cambiar_contrasenia',
          'subir_sucursal'
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
            <Route path='registrar_empleado' element={<RegistrarEmpleado/>}/>
            <Route path='perfil' element={<Perfil/>}/>
            <Route path='editar_perfil' element={<EditarPerfil/>}/>
            <Route path='subir_sucursal' element={<SubirSucursal/>}/>
            <Route path='cambiar_contrasenia' element={<CambiarContrasenia/>}/>
            <Route path='*' element={<NotFound/>}/>
        </Routes>
      </>
    )
}

export default RutasAdmin