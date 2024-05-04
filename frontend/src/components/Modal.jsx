import React from 'react'
import '../styles/Modal.css'

function Modal({texto, confirmacion, setConfirmacion, handleYes = () => setConfirmacion(false), ok}) {
    if(confirmacion){
        return (
              <div className='confirmacion'>
                <p>
                  {texto}
                </p>
                <div className='botonesConfirm'>
                  {ok&& <button onClick={handleYes} className='botonConfirm'>Ok</button>}

                  {!ok && <button onClick={handleYes} className='botonConfirm'>Si</button>}
                  {!ok && <button onClick={() => {setConfirmacion(false)}} className='botonConfirm'>No</button>}
                </div>
              </div>
        )
    }else{
        return null
    }
}

export default Modal