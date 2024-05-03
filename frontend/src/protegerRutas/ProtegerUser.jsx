import { Navigate } from 'react-router-dom'
import routes from '../routes'
function ProtegerUser({children}) {
    const user= JSON.parse(localStorage.getItem('user')) || null
    const cuentaActual= localStorage.getItem('cuentaActual')

    if (user){
      if(user.rol < 3){
        if (user.rol == 1){
          return children
        }
        if (user.rol == 2){
          if (cuentaActual == 'usuario'){
            return children
          }
          if (cuentaActual == 'empleado'){
            return <Navigate to={routes.empleadoPrincipal}/>
          }
        }
      }
      return <Navigate to={routes.adminPrincipal}/>
    }
  return (
    <Navigate to={routes.iniciarSesion}/>
  )
}

export default ProtegerUser