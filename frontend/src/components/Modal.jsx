import React from 'react'
import '../styles/Modal.css'

function Modal({texto, confirmacion, setConfirmacion, handleYes}) {
    if(confirmacion){
        return (
              <div className='confirmacion'>
                <p>
                  {texto}
                </p>
                <div className='botonesConfirm'>
                  <button onClick={handleYes} className='botonConfirm'>Si</button>
                  <button onClick={() => {setConfirmacion(false)}} className='botonConfirm'>No</button>
                </div>
              </div>
        )
    }else{
        return null
    }
}

export default Modal