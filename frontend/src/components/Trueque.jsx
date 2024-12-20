import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/Trueque.css'
import Modal from '../components/Modal'
import routes from '../routes'
import { estaEnModoUser } from '../helpers/estaEnModo'
import PopupEfectivizar from './PopupEfectivizar'
import PopupElegirSucursal from './PopupSucursal';
import PopupPuntuarUsuario from './PopupPuntuarUsuario';

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

function Trueque({ trueque, pendiente, cancelarTrueque = () => null, sumarGanancias= () => null }) {
  const navigate = useNavigate()
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
  const [noCancelarPorFecha,setNoCancelarPorFecha]= useState(false)
  const [popupPuntuarUsuario, setPopupPuntuarUsuario] = useState(false);
  const [noPuntuoTodavia, setNoPuntuoTodavia]= useState(false)

  const [efectivizar, setEfectivizar] = useState(false);

  const [irAUnArticulo, setIrAUnArticulo] = useState(false)

  const [gananciaPorTrueque, setGananciaPorTrueque]= useState(0)
  
  useEffect(() =>{
    if (soyElQueAcepta) setNoPuntuoTodavia(trueque.valoracion_publica == null)
    else setNoPuntuoTodavia(trueque.valoracion_compra == null)
  },[])

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

  useEffect(() => {
    if (irAUnArticulo) navigate(routes.unArticulo)
  }, [irAUnArticulo])

  useEffect(() => {
    if (truequeState.fecha_venta && truequeState.sucursal) setTruequeConfirmado(true)
  }, [truequeState])

  useEffect(() => {
      let total= 0;
      if (trueque.producto_compra.length > 0){
        total+= trueque.producto_compra.reduce((acumulador,p) => acumulador + (p.producto.precio * p.cantidad), 0)
      }
      if (trueque.producto_publica.length > 0){
        total+= trueque.producto_publica.reduce((acumulador,p) => acumulador + (p.producto.precio * p.cantidad), 0)
      }
      setGananciaPorTrueque(total)
      sumarGanancias(total)

       // Cleanup function to subtract the gain when component unmounts
       return () => {
         sumarGanancias(-total);
        };
  },[])

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
                throw new Error(JSON.stringify({message: data.message, status: data.status}));
            });
        }
        return response.json();
    })
      .then(data => {
        cancelarTrueque()
      })
      .catch(error => {
        const errorData = JSON.parse(error.message)
        if (errorData.status == 408) setNoCancelarPorFecha(true)
      });
  }



  const actualizarEstado = (t) => {
    //setTruequeState({ ...trueque, fecha_venta: t.fecha_venta, sucursal: t.sucursal })
    window.location.reload()
  }



  const irArticulo = (articulo) => {
    if (location.pathname !== routes.pagPrincipal /*invitado*/) {
      localStorage.setItem('articulo', JSON.stringify(articulo))
    }
    setIrAUnArticulo(true)
  }



  function redirectPerfil(user) {
    if (user.dni == usuarioActual.dni && usuarioActual.rol !== 2) {
      navigate(routes.perfil)
    } else {
      localStorage.setItem('userTercero', JSON.stringify(user));
      navigate(routes.perfilTercero)
    }
  }



  return (
    <div className='unTrueque'>

      <div className='contenido-unTrueque'>

        <div className='informacion-unTrueque'>

          <div className='usuario-unTrueque' onClick={() => redirectPerfil(userPublica)}>
            <img className='fotoUser-ultimoTrueque' src={`http://localhost:5000/img/${userPublica.foto_perfil}`} />
            <div className='infoUserTrueque'>
              <p className='nombre-unTrueque'>{userPublica.nombre}</p>
              {!estaEnModoUser() && <p style={{fontSize:'15px'}}>{userPublica.dni}</p>}
           </div>
          </div>

          <div className='art-unTrueque'>
            <img className='fotoArticulo-unTrueque' src={`http://localhost:5000/img/${trueque.articulo_publica.foto_articulo}`} onClick={() => irArticulo(trueque.articulo_publica)} />
          </div>

          <div className='divImagen-unTrueque'> <img src="truequeicono.avif" alt="" className='imagenTrueque-unTrueque' /></div>

          <div className='art-unTrueque'>
            <img className='fotoArticulo-unTrueque' src={`http://localhost:5000/img/${trueque.articulo_compra.foto_articulo}`} onClick={() => irArticulo(trueque.articulo_compra)} />
          </div>

          <div className='usuario-unTrueque' onClick={() => redirectPerfil(userCompra)}>
            <img className='fotoUser-ultimoTrueque' src={`http://localhost:5000/img/${userCompra.foto_perfil}`} />
           <div className='infoUserTrueque'>
              <p className='nombre-unTrueque'>{userCompra.nombre}</p>
              {!estaEnModoUser() && <p style={{fontSize:'15px'}}>{userCompra.dni}</p>}
           </div>
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
            <>
            <span>Realizado el {getDateOnly(truequeState.fecha_venta)} a las {getTimeOnly(truequeState.fecha_venta)} en {truequeState.sucursal.nombre}</span>
            </>
          }
        </div>

      </div>


      <div className='opciones-unTrueque'>

        {pendiente
          ?
          <div className='cancelar_efectivizar'>
            <>
            {estaEnModoUser()
            ?
              truequeAceptado
              ?
                <>
                  {!truequeConfirmado && <button className='botonUnTrueque' onClick={handleElegirSucursal}>Elegir sucursal</button>}
                  <button className='botonUnTrueque cancelar' onClick={handleCancelar}>Cancelar</button>
                </>
              :
              soyElQueAcepta
              ?
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
            </>
          </div>
          :
          <div>
            {estaEnModoUser() 
            ?
              noPuntuoTodavia && <button className='botonUnTrueque' onClick={() => setPopupPuntuarUsuario(true)}>Calificar trueque</button>
            :
              <p className='gananciaPorTrueque'>${gananciaPorTrueque}</p>
            }

          </div>
        }

      </div>
      <Modal texto={'¿Estás seguro que querés cancelar el trueque?'} confirmacion={modalCancelar} setConfirmacion={setModalCancelar} handleYes={handleYes} ok={false} />
      <Modal texto={'No se puede cancelar un trueque con fecha establecida para dentro de menos de 24hs'} confirmacion={noCancelarPorFecha} setConfirmacion={setNoCancelarPorFecha} ok={true}/>
      <PopupPuntuarUsuario
        show={popupPuntuarUsuario}
        onClose={() => setPopupPuntuarUsuario(false)}
        trueque={trueque}
        yaPuntuo={() => setNoPuntuoTodavia(false)}
      />
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