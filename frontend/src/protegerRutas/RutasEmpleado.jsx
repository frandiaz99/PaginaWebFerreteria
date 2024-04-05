import React from 'react'
import Header from '../components/Header/Header'
import {Routes, Route, useLocation} from 'react-router-dom'

function RutasEmpleado() {
    const location= useLocation()

    const rutaDefinida = () => {
      return (
          [
          'futuroURLEmpleado',
          ].includes(location.pathname.split('/')[2]) || location.pathname === '/empleado'
      )
    }
  
    return (
      <>
        {rutaDefinida() && <Header/>}
        <Routes>
            <Route path='' element={<div>Cuenta Empleado</div>}/>
            
            <Route path='*' element={<div>404 not found</div>}/>
        </Routes>
      </>
    )
}

export default RutasEmpleado