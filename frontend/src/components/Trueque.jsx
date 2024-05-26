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



  return (
    <div className='unTrueque'>

      <div className='contenido-unTrueque'>

        <div className='informacion-unTrueque'>

          <div className='usuario-unTrueque'>
            <h3 className='dni-unTrueque'>{trueque.articulo_publica.usuario.dni}</h3>
            <p className='nombre-unTrueque'>{trueque.articulo_publica.usuario.nombre} </p>
          </div>

          <div className='art-unTrueque'>
            <h4>{trueque.articulo_publica.nombre}</h4>
          </div>

          <div className='divImagen-unTrueque'> <img src="truequeicono.avif" alt="" className='imagenTrueque-unTrueque' /></div>

          <div className='art-unTrueque'>
            <h4>{trueque.articulo_compra.nombre}</h4>
          </div>

          <div className='usuario-unTrueque'>
            <h3 className='dni-unTrueque'>{trueque.articulo_compra.usuario.dni}</h3>
            <p className='nombre-unTrueque'>{trueque.articulo_compra.usuario.nombre}</p>
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