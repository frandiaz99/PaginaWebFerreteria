import React from 'react'
import { Navigate } from 'react-router-dom'
import routes from '../routes'

function ProtegerTercero() {
    const articulo= JSON.parse(localStorage.getItem('articulo')) || null

    if (articulo) return children
  return (
    <Navigate to={routes.pagPrincipal}/>
  )
}

export default ProtegerTercero