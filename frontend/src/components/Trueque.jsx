import React, { useEffect, useState } from 'react'
import '../styles/Trueque.css'
import Modal from '../components/Modal'

function Trueque({ trueque, pendiente }) {
  const [modalCancelar, setModalCancelar] = useState(false)

  const handleCancelar = () => {
    setModalCancelar(true)
  }

  const handleYes = () => {
    //fetch para cancelar trueque
    setModalCancelar(false)
    window.location.reload()
  }

  function mostrar(trueque) {
    console.log("truequeeeee", trueque)
    if (trueque.articulo_publica == null) {
      console.log("soy un NULL")
    }

    return trueque.dni1
  }


  return (
    <div className='unTrueque'>

      <div className='contenido-unTrueque'>

        <div className='informacion-unTrueque'>

          <div className='usuario-unTrueque'>
            <h3 className='dni-unTrueque'>{mostrar(trueque)}</h3>
            <p className='nombre-unTrueque'>{trueque.nombre1} </p>
          </div>

          <div className='art-unTrueque'>
            <h4>{trueque.art1}</h4>
          </div>

          <div className='divImagen-unTrueque'> <img src="truequeicono.avif" alt="" className='imagenTrueque-unTrueque' /></div>

          <div className='art-unTrueque'>
            <h4>{trueque.art2}</h4>
          </div>

          <div className='usuario-unTrueque'>
            <h3 className='dni-unTrueque'>{trueque.dni2}</h3>
            <p className='nombre-unTrueque'>{trueque.nombre2}</p>
          </div>

        </div>

        <div className='fecha-unTrueque'>
          <span>{trueque.fecha}</span>
        </div>

      </div>


      <div className='opciones-unTrueque'>
        {pendiente
          ?
          <div className='cancelar_efectivizar'>
            <button className='botonUnTrueque' onClick={handleCancelar}>Cancelar</button>
            <button className='botonUnTrueque'>Efectivizar</button>
          </div>
          :
          <div className='divRegistrarVenta'>
            <button className='botonUnTrueque'>Registrar venta</button>
          </div>}

      </div>
      <Modal texto={'¿Estás seguro que querés cancelar el trueque?'} confirmacion={modalCancelar} setConfirmacion={setModalCancelar} handleYes={handleYes} ok={false} />
    </div>
  )
}

export default Trueque