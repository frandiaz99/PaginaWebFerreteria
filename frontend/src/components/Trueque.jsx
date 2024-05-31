import React, { useEffect, useState } from 'react'
import '../styles/Trueque.css'
import Modal from '../components/Modal'
import { estaEnModoUser } from '../helpers/estaEnModo'
import PopupEfectivizar from './PopupEfectivizar'
import PopupElegirSucursal from './PopupSucursal';

function getDateOnly(datetimeLocalString) {
  const datetime = new Date(datetimeLocalString);
  const year = datetime.getFullYear();
  const month = String(datetime.getMonth() + 1).padStart(2, '0');
  const day = String(datetime.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getTimeOnly(datetimeLocalString) {
  const datetime = new Date(datetimeLocalString);
  const hours = String(datetime.getHours()).padStart(2, '0');
  const minutes = String(datetime.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

function Trueque({ trueque, pendiente, cancelarTrueque = () => console.log("nada") }) {
  const userPublica = trueque.articulo_publica.usuario;
  const userCompra = trueque.articulo_compra.usuario;
  const usuarioActual = JSON.parse(localStorage.getItem('user'))
  const soyElQueAcepta = usuarioActual._id == userPublica._id

  const [modalCancelar, setModalCancelar] = useState(false)
  const [truequeState, setTruequeState] = useState(trueque) //solamente para actualizar este componente al elegir sucursal
  const [truequeAceptado, setTruequeAceptado] = useState(trueque.trueque_aceptado)
  const [truequeConfirmado, setTruequeConfirmado] = useState(trueque.fecha_venta !== undefined)
  const [showPopup, setShowPopup] = useState(false)
  const [popupSucursal, setPopupSucursal] = useState(false)
  const [sucursales, setSucursales] = useState([]);

  const [efectivizar, setEfectivizar] = useState(false);
  /*const [fechaSeleccionada, setFechaSeleccionada] = useState('');
  const [sucursalSeleccionada, setSucursalSeleccionada] = useState('');
  const [truequePendienteEspera, setTruequePendienteEspera] = useState(false);*/

  const handleCancelar = (event) => {
    event.stopPropagation();
    setModalCancelar(true)
  }

  const handleElegirSucursal = () => {
    setPopupSucursal(true);

  }
  const handleEfectivizar = () => {
    setEfectivizar(true);
    setShowPopup(true);

  }

  const handleCancelarEfectivizacion = () => {
    setEfectivizar(false)
    setShowPopup(true)
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

  useEffect(() => {
    fetch('http://localhost:5000/sucursal/getSucursales',
      {
        method: "GET",
        headers: {
          "Content-Type": "application/JSON",
          //"Cookie": localStorage.getItem('jwt')
        }, credentials: "include"
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Hubo un problema al obtener las sucursales');
        }
        return response.json();
      })
      .then(data => {
        setSucursales(data.Sucursales)
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }, [])

  const actualizarEstado = (t) => {
    setTruequeState({ ...trueque, fecha_venta: t.fecha_venta, sucursal: t.sucursal })
  }

  useEffect(() => {
    if (truequeState.fecha_venta && truequeState.sucursal) setTruequeConfirmado(true)
  }, [truequeState])


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
            truequeConfirmado
              ?
              <span>Confirmado para el {getDateOnly(truequeState.fecha_venta)} a las {getTimeOnly(truequeState.fecha_venta)} en {truequeState.sucursal.nombre}</span>
              :
              truequeAceptado
                ?
                <span>Aceptado</span>
                :
                soyElQueAcepta
                  ?
                  <span>Oferta de Trueque recibida | En espera</span>
                  :
                  <span>Oferta de Trueque envíada | En espera</span>
            :
            <span>Realizado el {getDateOnly(truequeState.fecha_venta)}</span>
          }
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
                    {!truequeConfirmado && <button className='botonUnTrueque' onClick={handleElegirSucursal}>Elegir sucursal</button>}
                    <button className='botonUnTrueque cancelar' onClick={handleCancelar}>Cancelar</button>
                  </>
                  :
                  <>
                    <button className='botonUnTrueque aceptarT' onClick={aceptarOfertaTrueque}>Aceptar</button>
                    <button className='botonUnTrueque cancelar' onClick={rechazarOfertaTrueque}>Rechazar</button>
                  </>
                :
                <button className='botonUnTrueque cancelar' onClick={handleCancelar}>Cancelar</button>
              :
              <>
                <button className='botonUnTrueque' onClick={handleEfectivizar} >Efectivizar</button>
                <button className='botonUnTrueque cancelar' onClick={handleCancelarEfectivizacion}>Cancelar</button>
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
        efectivizar={efectivizar}
      />
      <PopupElegirSucursal
        show={popupSucursal}
        onClose={() => setPopupSucursal(false)}
        sucursales={sucursales}
        trueque={trueque}
        actualizarEstado={actualizarEstado}
      />
    </div>

  )
}

export default Trueque