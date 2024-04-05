import React from 'react'
import '../../styles/DropNotificaciones.css'
import UnaNotificacion from './UnaNotificacion'

function DropNotificaciones() {
  const notificaciones= JSON.parse(localStorage.getItem('user')).notificaciones || null

  return (
    <div className='dropNotificaciones'>

        <h4 style={{margin:'0', marginTop:'5px'}}>Notificaciones</h4>
        {notificaciones &&
        notificaciones.map((noti) =>(
          <UnaNotificacion contenido={noti}/>
        ))
        }

        {!notificaciones &&
        <>
          <hr />
          <p>No tenes ninguna notificación</p>
        </>
        }

    </div>
  )
}

export default DropNotificaciones