import React from 'react'
import Header from '../components/Header/Header'
import { Routes, Route, useLocation } from 'react-router-dom'
import Promociones from '../views/Promociones.jsx'
import TruequesPyC from '../views/TruequesPyC.jsx'
import EstadisticasArticulos from '../views/EstadisticasArticulos.jsx'
import Tasar from '../views/Tasar.jsx'
import NotFound from '../views/NotFound.jsx'

function RutasEmpleado() {
  const location = useLocation()

  const rutaDefinida = () => {
    return (
      [
        'promociones',
        'estadisticas',
        'tasar',
        'crearPromocion'
      ].includes(location.pathname.split('/')[2]) || location.pathname === '/empleado'
    )
  }

  return (
    <>
      {rutaDefinida() && <Header />}
      <Routes>
        <Route path='' element={<TruequesPyC />} />
        <Route path='promociones' element={<Promociones />} />
        <Route path='estadisticas' element={<EstadisticasArticulos />} />
        <Route path='tasar' element={<Tasar />} />
        <Route path='crearPromocion' element={<crearPromocion />} />
        <Route path='*' element={<NotFound />} />

      </Routes>
    </>
  )
}

export default RutasEmpleado