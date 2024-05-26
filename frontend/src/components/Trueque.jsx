import React, { useEffect, useState } from 'react'
import '../styles/Trueque.css'
import Modal from '../components/Modal'

function Trueque({ trueque, pendiente, eliminar = () => console.log("nada") }) {
  const [modalCancelar, setModalCancelar] = useState(false)
  const userPublica = trueque.articulo_publica.usuario;
  const userCompra = trueque.articulo_compra.usuario;

  const handleCancelar = (event) => {
    event.stopPropagation();
    setModalCancelar(true)
  }

  const handleYes = () => {
    setModalCancelar(false)

    console.log("Trueque: ", trueque)
    fetch('http://localhost:5000/trueque/eliminarTrueque',
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
        eliminar()
      })
      .catch(error => {
        const errorData = JSON.parse(error.message)
        console.log(errorData.message)
      });

    window.location.reload()
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
          <span>{trueque.fecha}</span> {/* falta fechaaaaaaaaaaaaaa */}
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