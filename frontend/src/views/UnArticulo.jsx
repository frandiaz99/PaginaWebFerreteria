import React, { useState, useEffect } from 'react'
import routes from '../routes.js'
//import Pagar from '../components/Pagar'
//<Pagar/>
//import { CardPayment } from '@mercadopago/sdk-react';
import Pagar from '../components/PublicitarArticulo.jsx';
import '../styles/UnArticulo.css'
import { Link, Navigate, useNavigate } from 'react-router-dom';
//import { MercadoPagoInstance } from '@mercadopago/sdk-react/mercadoPago/initMercadoPago';

import PopupIntercambio from '../components/PopupIntercambio';

function intercambiar(art) {
  const user = JSON.parse(localStorage.getItem('user'))
  if (user.rol == 1 || localStorage.getItem('cuentaActual') == 'usuario') {
    if (user._id == art.usuario._id || art.reservado) return false
    else return true
  } else return false
}

function tasar(art) {
  const user = JSON.parse(localStorage.getItem('user'))
  if (user.rol == 3 || localStorage.getItem('cuentaActual') == 'empleado') {
    return art.precio == 0
  } else return false
}

function UnArticulo() {
  const navigate = useNavigate();
  //MercadoPagoInstance.publicKey = 'TEST-5927481826006053-041716-b330d25407c1fe4b73d7e41b9e193bc8-267438622';

  /*
    <CardPayment
          initialization={{ amount: 100 }}
          onSubmit={async (param) => {
            console.log(param);
          }}/>;*/


  var srcFotoArt = "http://localhost:5000/img/";
  var path_fotos_articulo = [];
  var fotos_articulo, foto_perfil, boton_foto;
  var indiceActual = 0;
  var boton_foto = document.getElementsByClassName("boton-foto");
  const [articuloSeleccionado, setArticuloSeleccionado] = useState(null); //El useState devuelve un array

  const [nuevoArticulo, setNuevoArticulo] = useState(null)
  //Para cuando los datos del localStorage se bugueen: comentar los documents, recargar pag, descomentarlos y volver a cargar.

  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const articuloLocal = JSON.parse(localStorage.getItem('articulo'));
    if (articuloLocal) {
      setArticuloSeleccionado(articuloLocal);
      console.log("asdas",articuloLocal);
    }
    boton_foto[0].style.display = "none";

  }, []); //Para ejecutarlo 1 vez sola

  useEffect(() => {
    if (articuloSeleccionado) {
      fotos_articulo = articuloSeleccionado.foto_articulo;
      foto_perfil = srcFotoArt + articuloSeleccionado.usuario.foto_perfil;
      //console.log(fotos_articulo);
      //Lo dejo para cuando haya mas de una foto en la bd, de momento es como esta arriba
      for (let i = fotos_articulo.length - 1; i >= 0; i--) {
        path_fotos_articulo.push(srcFotoArt + fotos_articulo[i]);
      }
     // console.log(path_fotos_articulo);
      if (path_fotos_articulo.length <= 1) {
        boton_foto[0].style.display = "none";
        boton_foto[1].style.display = "none";
      } else {
        boton_foto[1].style.display = "block";
      }
      document.getElementById("nombre-articulo").innerHTML = articuloSeleccionado.nombre;
      document.getElementById("descripcion-articulo").innerHTML = articuloSeleccionado.descripcion;
      if (articuloSeleccionado.precio > 0) document.getElementById("categoria-articulo").innerHTML = articuloSeleccionado.precio;
      document.getElementById("descripcion-interesado-en").innerHTML = articuloSeleccionado.interesado;
      document.getElementById("foto-articulo").src = path_fotos_articulo[0];
      document.getElementById("imagen-perfil").src = foto_perfil;
      document.getElementById("nombre-usuario").innerHTML = articuloSeleccionado.usuario.nombre;
      //localStorage.setItem('puntaje_usuario', articuloSeleccionado.usuario.puntos); que es esto ? asklfjaklfl
    }
  }, [articuloSeleccionado, path_fotos_articulo]); //Para ejecutarlo cuando cambie articuloSeleccionado o imagenes.



  function generarEstrellas() {
    var estrellas = [];
    var puntuacion;
    //Ver tema de las imagenes y ver que hacer con el intercambiar.
    if (articuloSeleccionado) puntuacion = articuloSeleccionado.usuario.valoracion;
    const estrellasCompletas = Math.floor(puntuacion);
    const hayMediaEstrella = puntuacion - estrellasCompletas >= 0.5;
    const estrellasVacias = 5 - estrellasCompletas - (hayMediaEstrella ? 1 : 0);

    for (let i = 0; i < estrellasCompletas; i++) {
      estrellas.push(<ion-icon name="star"></ion-icon>);
    }

    if (hayMediaEstrella) {
      estrellas.push(<ion-icon name="star-half"></ion-icon>);
    }

    for (let i = 0; i < estrellasVacias; i++) {
      estrellas.push(<ion-icon name="star-outline"></ion-icon>);
    }

    return estrellas;
  }

  function cambiarImagen(estado) {
    boton_foto[0].style.display = "block";
    boton_foto[1].style.display = "block";
    if (estado === "atras" && indiceActual > 0) {
      console.log("atras");
      indiceActual -= 1;
    } else {
      if (estado === "siguiente" && (indiceActual >= 0 && indiceActual < path_fotos_articulo.length - 1)) {
        console.log("adelante");
        indiceActual += 1;
      }
    }
    console.log(indiceActual)
    document.getElementById("foto-articulo").src = path_fotos_articulo[indiceActual];
    if (indiceActual == path_fotos_articulo.length - 1) {
      boton_foto[1].style.display = "none";
    } else if (indiceActual == 0) {
      boton_foto[0].style.display = "none";
    }
  }

  function redirectPerfil() {
    const userTercero = articuloSeleccionado.usuario;
    const user = JSON.parse(localStorage.getItem('user'))
    if (user.dni == userTercero.dni && user.rol !== 2) {
      navigate(routes.perfil)
    } else {
      localStorage.setItem('userTercero', JSON.stringify(userTercero));
      navigate(routes.perfilTercero)
    }
  }

  function handleChange(e) {
    setNuevoArticulo({
      ...articuloSeleccionado,
      [e.target.name]: e.target.value,
    })
  }

  useEffect(() =>{
    if (articuloSeleccionado){
      setNuevoArticulo({
        ...articuloSeleccionado,
        precio: 1,
      })
    }
  },[articuloSeleccionado])

  function handleGuardar() {
    console.log(nuevoArticulo)
    fetch(
      "http://localhost:5000/articulo/tasarArticulo",
      {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({Articulo: nuevoArticulo}),
        credentials: "include",
      }
    )
      .then((response) => {
        if (!response.ok) {
          return response.json().then(data => {
              throw new Error(JSON.stringify({ message: data.message, status: data.status }));
          });
      }
      return response.json();
      })
      .then((data) => {
        console.log("Articulo tasado", data);
        navigate(routes.empleadoTasar)
      })
      .catch((error) => {
        const errorData = JSON.parse(error.message)
        console.log(errorData.message)
      });

  }


  return (
    <main className='main'>
      <div className='unArticulo-principal'>
        <div id='main-container'>
          <div id='container-foto'>
            <button className='boton-foto' onClick={() => cambiarImagen('atras')}><ion-icon name="arrow-back-outline"></ion-icon></button>
            <img id='foto-articulo' src="" alt="foto" />
            <button className='boton-foto' onClick={() => cambiarImagen('siguiente')}><ion-icon name="arrow-forward-outline"></ion-icon></button>
          </div>
          <div id='container-info'>
            <h2 id='nombre-articulo' className='spacing'></h2>
            <p id='descripcion-articulo' className='spacing'></p>
            <div className='div_categoria'>
              <h4>Categoria:</h4>
              {articuloSeleccionado && tasar(articuloSeleccionado) ? (
                 <select name='precio' onChange={handleChange} style={{marginLeft:'10px'}}>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                    <option value="8">8</option>
                    <option value="9">9</option>
                    <option value="10">10</option>
                 </select>
              ) : (
                <p id='categoria-articulo' className='spacing'>{articuloSeleccionado && articuloSeleccionado.categoria}</p>
              )}
            </div>
            <h4 id='interesado-en' className='spacing'>Interesado en: </h4>
            <div className='div-interesado-en'>
              <p id="descripcion-interesado-en"></p>
            </div>
            <div id="container-buttons" className="spacing">
              {(articuloSeleccionado && intercambiar(articuloSeleccionado))?
                <button className="boton-intercambiar" onClick={() => setShowPopup(true)}>
                  Intercambiar
                </button>: <Pagar/>
              }

              {(articuloSeleccionado && tasar(articuloSeleccionado)) &&
                <button className="boton-intercambiar" onClick={handleGuardar}>
                  Tasar
                </button>
              }

              <div id="container-perfil">

                <h5 id='palabra-propietario'>Propietario</h5>
                <button id='boton-ver-perfil' onClick={redirectPerfil}>
                  <img src="" alt="Imagen-perfil" id='imagen-perfil' />
                  <div id='container-datos-usuario'>
                    <h5 id='nombre-usuario'></h5>

                    <p id='puntaje-usuario'>{generarEstrellas()}</p>
                  </div>
                </button>

              </div>

            </div>
          </div>
        </div>
      </div>

      {articuloSeleccionado && (
        <PopupIntercambio
          show={showPopup}
          onClose={() => setShowPopup(false)}
          articuloAIntercambiar={articuloSeleccionado}
        />
      )}
    </main>
  )
}

export default UnArticulo

//<button onClick={Pagar}>Promocionar</button>
















/*
  const initialization = {
    amount: 100,
    
   };
   
   
   const onSubmit = async (formData) => {
    // callback llamado al hacer clic en el botón enviar datos
    return new Promise((resolve, reject) => {
      fetch('http://localhost:5000/process_payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
        .then((response) => response.json())
        .then((response) => {
          // recibir el resultado del pago
          resolve();
        })
        .catch((error) => {
          // manejar la respuesta de error al intentar crear el pago
          reject();
        });
    });
   };
   
   
   const onError = async (error) => {
    // callback llamado para todos los casos de error de Brick
    console.log(error);
   };
   
   
   const onReady = async () => {
    
     // Callback llamado cuando Brick está listo.
     // Aquí puedes ocultar cargamentos de su sitio, por ejemplo.
    
   };
   



  

      



<CardPayment
   initialization={initialization}
   onSubmit={onSubmit}
   onReady={onReady}
   onError={onError}
/>*/