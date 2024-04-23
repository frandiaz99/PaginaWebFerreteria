import React from 'react'
import { Navigate } from 'react-router-dom'
import routes from '../routes'

function ProtegerAdmin({children}) {
    const user= JSON.parse(localStorage.getItem('user')) || null

    if (user !== null){
        if (user.rol == 3){
          console.log('hola')
            return children
        }
    }
  return (
    <Navigate to={routes.pagPrincipal}/>
  )
}

export default ProtegerAdmin