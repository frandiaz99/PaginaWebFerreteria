import { Navigate } from 'react-router-dom'
import routes from '../routes'
function ProtegerUser({children}) {
    const user= JSON.parse(localStorage.getItem('user')) || null
    
    if (user){
      if(user.rol < 3){
        return children
      }
      <Navigate to={routes.adminPrincipal}/>
    }
  return (
    <Navigate to={routes.iniciarSesion}/>
  )
}

export default ProtegerUser