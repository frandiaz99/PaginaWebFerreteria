import React from 'react'
import { Navigate } from 'react-router-dom'
import routes from '../routes'

function ProtegerTercero({children}) {
    const cuentaUserTercero= JSON.parse(localStorage.getItem('userTercero')) || null

    if (cuentaUserTercero) return children
  return (
    <Navigate to={routes.pagPrincipal}/>
  )
}

export default ProtegerTercero