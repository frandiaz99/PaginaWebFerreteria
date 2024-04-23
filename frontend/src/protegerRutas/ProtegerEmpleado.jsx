import React from 'react'
import { Navigate } from 'react-router-dom'
import routes from '../routes'

function ProtegerEmpleado({children}) {
    const user= JSON.parse(localStorage.getItem('user')) || null

    if (user !== null){
        if (user.rol === 2 || user.rol === 3){
          return children
        }
    }
  return (
    <Navigate to={routes.pagPrincipal}/>
  )
}

export default ProtegerEmpleado