import React from 'react'
import '../../styles/DropNotificaciones.css'
import UnaNotificacion from './UnaNotificacion'

function DropNotificaciones() {
  const notificaciones= JSON.parse(localStorage.getItem('user')).notificaciones
  var tiene= false;
  
  if (notificaciones){
    tiene= true;
  }
console.log("noti: "+notificaciones)
  return (
    <div className='dropNotificaciones'>
        <h4 style={{margin:'0', marginTop:'5px', marginBottom:'5px'}}>Notificaciones</h4>
        <hr />
        {tiene &&
        notificaciones.slice(0, 15).map((noti) =>(
          <UnaNotificacion contenido={noti}/>
        ))
        }
        <hr />
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