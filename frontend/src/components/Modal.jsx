import React from 'react'
import '../styles/Modal.css'
function esIniciarSesion(){
  return location.pathname === '/invitado/iniciar_sesion'
}
function Modal({texto, confirmacion, setConfirmacion, handleYes = () => setConfirmacion(false)}) {
    if(confirmacion){
        return (
              <div className='confirmacion'>
                <p>
                  {texto}
                </p>
                <div className='botonesConfirm'>
                  {esIniciarSesion() && <button onClick={handleYes} className='botonConfirm'>Ok</button>}

                  {!esIniciarSesion() && <button onClick={handleYes} className='botonConfirm'>Si</button>}
                  {!esIniciarSesion() && <button onClick={() => {setConfirmacion(false)}} className='botonConfirm'>No</button>}
                </div>
              </div>
        )
    }else{
        return null
    }
}

export default Modal