import { Navigate } from 'react-router-dom'
import routes from '../routes'
function ProtegerUser({children}) {
    const user= JSON.parse(localStorage.getItem('user')) || null
    
    if (user){
      return children
    }
  return (
    <Navigate to={routes.iniciarSesion}/>
  )
}

export default ProtegerUser