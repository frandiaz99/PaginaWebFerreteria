import { Navigate } from 'react-router-dom'
import routes from '../routes'

function ProtegerInvitado({children}) {
  const user= JSON.parse(localStorage.getItem('user')) || null

  if (user == null){ 
    return children
  }
  return ( //retornar a pagina principal con user logueado si hay info en local storage
    <Navigate to={routes.userPrincipal}/>
  )
}

export default ProtegerInvitado