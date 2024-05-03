import React from 'react'
import { Navigate } from 'react-router-dom'
import routes from '../routes'

function ProtegerEmpleado({children}) {
    const user= JSON.parse(localStorage.getItem('user')) || null
    const cuentaActual= localStorage.getItem('cuentaActual')

    if (user !== null){
        if (user.rol === 3){
          return children
        }
        if (user.rol === 2){
          if (cuentaActual == 'empleado'){
            return children
          }
          if (cuentaActual == 'usuario')
            return <Navigate to={routes.userPrincipal}/>
        }
    }
  return (
    <Navigate to={routes.pagPrincipal}/>
  )
}

export default ProtegerEmpleado