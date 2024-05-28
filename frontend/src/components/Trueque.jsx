import React, { useEffect, useState } from 'react'
import '../styles/Trueque.css'
import Modal from '../components/Modal'
import { estaEnModoUser } from '../helpers/estaEnModo'
import PopupEfectivizar from './PopupEfectivizar'

function Trueque({ trueque, pendiente, cancelarTrueque = () => console.log("nada") }) {
  const [modalCancelar, setModalCancelar] = useState(false)
  const userPublica = trueque.articulo_publica.usuario;
  const userCompra = trueque.articulo_compra.usuario;
  const [truequePendienteConfirmado, setTruequePendienteConfirmado] = useState(false);
  const [truequePendienteEspera, setTruequePendienteEspera] = useState(false);
  const [truequeAceptado, setTruequeAceptado] = useState(trueque.trueque_aceptado)

  const usuarioActual = JSON.parse(localStorage.getItem('user'))
  const soyElQueAcepta = usuarioActual._id == userPublica._id

  const handleCancelar = (event) => {
    event.stopPropagation();
    setModalCancelar(true)
  }

  const handleElegirSucursal = () => {

  }

  const aceptarOfertaTrueque = () => {
    trueque.trueque_aceptado = true;
    fetch("http://localhost:5000/trueque/responderOferta", {
      method: "POST",
      headers: { "Content-Type": "application/JSON" },
      body: JSON.stringify({ Trueque: trueque }),
      credentials: "include"
    })
      .then(response => {
        if (!response.ok) {
          return response.json().then(data => {
            throw new Error(JSON.stringify({ message: data.message, status: data.status }));
          })
        }
        return response.json();
      })
      .then(data => {
        console.log("data :", data)
        setTruequeAceptado(true)
      })
      .catch(error => {
        console.error('Error:', error);
      })
  }

  const rechazarOfertaTrueque = () => {
    trueque.trueque_aceptado = false;
    fetch("http://localhost:5000/trueque/responderOferta", {
      method: "POST",
      headers: { "Content-Type": "application/JSON" },
      body: JSON.stringify({ Trueque: trueque }),
      credentials: "include"
    })
      .then(response => {
        if (!response.ok) {
          return response.json().then(data => {
            throw new Error(JSON.stringify({ message: data.message, status: data.status }));
          })
        }
        return response.json();
      })
      .then(data => {
        console.log("data :", data)
        cancelarTrueque()
      })
      .catch(error => {
        console.error('Error:', error);
      })
  }

  const handleYes = () => {
    setModalCancelar(false)

    console.log("Trueque: ", trueque)
    fetch('http://localhost:5000/trueque/cancelarTrueque',
      {
        method: "DELETE",
        headers: { "Content-Type": "application/JSON" },
        body: JSON.stringify({ Trueque: trueque }),
        credentials: "include"
      })
      .then(response => {
        if (!response.ok) {
          return response.json().then(data => {
            throw new Error(JSON.stringify({ message: data.message }));
          })
        }
        return response.json();
      })
      .then(data => {
        cancelarTrueque()
      })
      .catch(error => {
        const errorData = JSON.parse(error.message)
        console.log(errorData.message)
      });
  }



  return (
    <div className='unTrueque'>

      <div className='contenido-unTrueque'>

        <div className='informacion-unTrueque'>

          <div className='usuario-unTrueque'>
            <img className='fotoUser-ultimoTrueque' src={`http://localhost:5000/img/${userPublica.foto_perfil}`} />
            <p className='nombre-unTrueque'>{userPublica.nombre} </p>
          </div>

          <div className='art-unTrueque'>
            <img className='fotoArticulo-unTrueque' src={`http://localhost:5000/img/${trueque.articulo_publica.foto_articulo}`} />
          </div>

          <div className='divImagen-unTrueque'> <img src="truequeicono.avif" alt="" className='imagenTrueque-unTrueque' /></div>

          <div className='art-unTrueque'>
            <img className='fotoArticulo-unTrueque' src={`http://localhost:5000/img/${trueque.articulo_compra.foto_articulo}`} />
          </div>

          <div className='usuario-unTrueque'>
            <img className='fotoUser-ultimoTrueque' src={`http://localhost:5000/img/${userCompra.foto_perfil}`} />
            <p className='nombre-unTrueque'>{userCompra.nombre}</p>
          </div>

        </div>

        <div className='fecha-unTrueque'>
          {pendiente
            ?
            truequeAceptado
              ?
              <span>Confirmado</span>
              :
              soyElQueAcepta
                ?
                <span>Oferta de Trueque recibida. En Espera</span>
                :
                <span>Oferta de Trueque envíada. En Espera</span>
            :
            <span>Si esta completado iria la fecha</span>
          } {/* falta fechaaaaaaaaaaaaaa */}
        </div>

      </div>


      <div className='opciones-unTrueque'>
        {pendiente
          ?
          <div className='cancelar_efectivizar'>
            {estaEnModoUser()
              ?
              soyElQueAcepta
                ?
                truequeAceptado
                  ?
                  <>
                    <button className='botonUnTrueque' onClick={handleElegirSucursal}>Elegir sucursal</button>
                    <button className='botonUnTrueque' onClick={handleCancelar}>Cancelar</button>
                  </>
                  :
                  <>
                    <button onClick={aceptarOfertaTrueque}>Aceptar</button>
                    <button onClick={rechazarOfertaTrueque}>Rechazar</button>
                  </>
                :
                <button className='botonUnTrueque' onClick={handleCancelar}>Cancelar</button>
              :
              <>
                <button className='botonUnTrueque' disabled={!truequePendienteConfirmado} >Efectivizar</button>
                <button className='botonUnTrueque' onClick={handleCancelar}>Cancelar</button>
              </>
            }
          </div>
          :
          <div className='divRegistrarVenta'>
            <button className='botonUnTrueque'>Registrar venta</button>
          </div>
        }

      </div>
      <Modal texto={'¿Estás seguro que querés cancelar el trueque?'} confirmacion={modalCancelar} setConfirmacion={setModalCancelar} handleYes={handleYes} ok={false} />
      <PopupEfectivizar
        show={showPopup}
        onClose={() => setShowPopup(false)}
        truequeAEfectivizar={trueque}
      />
    </div>

  )
}

export default Trueque