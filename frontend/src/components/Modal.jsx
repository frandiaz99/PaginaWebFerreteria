import React from 'react'
import { useEffect , useRef} from 'react';
import '../styles/Modal.css'

function Modal({texto, confirmacion, setConfirmacion, handleYes = () => setConfirmacion(false), ok}) {
  const modalRef= useRef(null)

  const handleClickOutsideModal = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      setConfirmacion(false);
    }
  }

  useEffect(() => { //Cerrar modal cuando se toca fuera
    // Agrega el listener cuando el modal está abierto
    if (confirmacion) {
        document.addEventListener('mousedown', handleClickOutsideModal);
    }

    // Cleanup que remueve el listener
    return () => {
        document.removeEventListener('mousedown', handleClickOutsideModal);
    };
  }, [confirmacion]);

    if(confirmacion){
        return (
              <div className='confirmacion' ref={modalRef}>
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