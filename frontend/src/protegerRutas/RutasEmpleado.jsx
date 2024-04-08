import React from 'react'
import Header from '../components/Header/Header'
import {Routes, Route, useLocation} from 'react-router-dom'
import Promociones from '../views/Promociones.jsx'
import PrincipalAdminYEmple from '../views/PrincipalAdminYEmple.jsx'
import EstadisticasArticulos from '../views/EstadisticasArticulos.jsx'
import Tasar from '../views/Tasar.jsx'

function RutasEmpleado() {
    const location= useLocation()

    const rutaDefinida = () => {
      return (
          [
          'promociones',
          'estadisticas',
          'tasar'
          ].includes(location.pathname.split('/')[2]) || location.pathname === '/empleado'
      )
    }
  
    return (
      <>
        {rutaDefinida() && <Header/>}
        <Routes>
            <Route path='' element={<PrincipalAdminYEmple/>}/>
            <Route path='promociones' element={<Promociones/>}/>
            <Route path='estadisticas' element={<EstadisticasArticulos/>}/>
            <Route path='tasar' element={<Tasar/>}/>
            <Route path='*' element={<div>404 not found</div>}/>
        </Routes>
      </>
    )
}

export default RutasEmpleado