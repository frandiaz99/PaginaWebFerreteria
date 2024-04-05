import { Navigate } from 'react-router-dom'
import routes from '../routes'
function ProtegerSucursales({children}) {
    const user= JSON.parse(localStorage.getItem('user')) || null
    if (user == null){ 
      return children
    }
  return ( //Si esta logueado devolver sucursales login
    <Navigate to={routes.sucursalesLogin}/>
  )
}

export default ProtegerSucursales