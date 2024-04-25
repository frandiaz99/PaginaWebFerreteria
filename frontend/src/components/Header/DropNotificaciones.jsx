import React from 'react'
import '../../styles/DropNotificaciones.css'
import UnaNotificacion from './UnaNotificacion'

function DropNotificaciones() {
  const notificaciones= JSON.parse(localStorage.getItem('user')).notificaciones
  var tiene= false;
  if (notificaciones.length > 0){
    tiene= true;
  }

  return (
    <div className='dropNotificaciones'>

        <h4 style={{margin:'0', marginTop:'5px'}}>Notificaciones</h4>
        {tiene &&
        notificaciones.map((noti) =>(
          <UnaNotificacion contenido={noti}/>
        ))
        }

        {!tiene &&
        <>
          <hr />
          <p>No tenés notificaciones</p>
        </>
        }

    </div>
  )
}

export default DropNotificaciones