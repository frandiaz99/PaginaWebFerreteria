import React from 'react'
import Header from '../components/Header/Header'
import {Routes, Route, useLocation} from 'react-router-dom'

function RutasAdmin() {
    const location= useLocation()

    const rutaDefinida = () => {
      return (
          [
          'futuroURLAdmin',
          ].includes(location.pathname.split('/')[2]) || location.pathname === '/admin'
      )
    }
  
    return (
      <>
        {rutaDefinida() && <Header/>}
        <Routes>
            <Route path='' element={<div>Cuenta Admin</div>}/>
            
            <Route path='*' element={<div>404 not found</div>}/>
        </Routes>
      </>
    )
}

export default RutasAdmin