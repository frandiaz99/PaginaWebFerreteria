import { Navigate } from 'react-router-dom'
import routes from '../routes'
function ProtegerSucursalesLogin({children}) {
    const user= JSON.parse(localStorage.getItem('user')) || null

    if (user){ 
      return children
    }
  return ( //Si no esta logueado devolver sucursales no registrados
    <Navigate to={routes.sucursales}/>
  )
}

export default ProtegerSucursalesLogin