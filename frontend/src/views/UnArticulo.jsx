import React, { useState, useEffect } from 'react'
//import Pagar from '../components/Pagar'
//<Pagar/>
//import { CardPayment } from '@mercadopago/sdk-react';
import  Pagar from '../components/Pagar';
import '../styles/UnArticulo.css'
//import { MercadoPagoInstance } from '@mercadopago/sdk-react/mercadoPago/initMercadoPago';

function esMiArticulo(){
  const propietarioArticulo= JSON.parse(localStorage.getItem('articulo')).usuario._id
  const user= JSON.parse(localStorage.getItem('user'))._id
  return user == propietarioArticulo
}

function UnArticulo() {

  //MercadoPagoInstance.publicKey = 'TEST-5927481826006053-041716-b330d25407c1fe4b73d7e41b9e193bc8-267438622';
  
  
/*
  <CardPayment
        initialization={{ amount: 100 }}
        onSubmit={async (param) => {
          console.log(param);
        }}/>;*/

  
  var imagenes = [];
  var srcFotoArt = "http://localhost:5000/img/";
  var foto_articulo, foto_perfil;
  var indiceActual = 0;
  const [articuloSeleccionado, setArticuloSeleccionado] = useState(null); //El useState devuelve un array

  //Para cuando los datos del localStorage se bugueen: comentar los documents, recargar pag, descomentarlos y volver a cargar.

  useEffect(() => {
    const articuloLocal = localStorage.getItem('articulo');
    console.log(articuloLocal);
    if (articuloLocal) {
        setArticuloSeleccionado(JSON.parse(articuloLocal));
        console.log(articuloSeleccionado);
    }
  }, []); //Para ejecutarlo 1 vez sola

  useEffect(() => {
      setTimeout(2000);
      if (articuloSeleccionado) {
          console.log(articuloSeleccionado);
          foto_articulo = srcFotoArt + articuloSeleccionado.foto_articulo;
          foto_perfil = srcFotoArt + articuloSeleccionado.usuario.foto_perfil;
          console.log(foto_perfil);
          if (!imagenes.includes(foto_articulo)){
            console.log("dentro");
            imagenes.push(foto_articulo);
          }
          //Lo dejo para cuando haya mas de una foto en la bd, de momento es como esta arriba
          /*for (let i=0; i<; i++){
              imagenes.push(srcFotoArt);
          }*/
          document.getElementById("nombre-articulo").innerHTML = articuloSeleccionado.nombre;
          document.getElementById("descripcion-articulo").innerHTML = articuloSeleccionado.descripcion;
          document.getElementById("descripcion-interesado-en").innerHTML = articuloSeleccionado.interesado;
          document.getElementById("foto-articulo").src = imagenes[indiceActual];
          document.getElementById("imagen-perfil").src = foto_perfil;
          document.getElementById("nombre-usuario").innerHTML = articuloSeleccionado.usuario.nombre;
          localStorage.setItem('puntaje_usuario', articuloSeleccionado.usuario.puntos);
      }
  }, [articuloSeleccionado, imagenes]); //Para ejecutarlo cuando cambie articuloSeleccionado o imagenes.



  function generarEstrellas (){
    var estrellas = [];
    //Ver tema de las imagenes y ver que hacer con el intercambiar.
    var puntuacion = localStorage.getItem('puntaje_usuario');
    console.log(puntuacion);
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
    if (estado === "atras" && indiceActual > 0){
      console.log("atras");
      indiceActual -= 1;
    }else{
      if (estado === "siguiente" && (indiceActual >= 0 && indiceActual < imagenes.length-1)){
        console.log("adelante");
        indiceActual += 1;
      }
    }
    console.log(indiceActual)
    document.getElementById("foto-articulo").src=imagenes[indiceActual];
  }

  function redirectPerfil (){
    localStorage.setItem("datos-dueño-articulo", );
  }



  return (
    <main className='main'>
      <div className='unArticulo-principal'>
        <div id='main-container'>
          <div id='container-foto'>
            <button className='boton-foto' onClick={() => cambiarImagen('atras')}>&lt;</button>
            <img id='foto-articulo' src="" alt="imagen" />
            <button className='boton-foto' onClick={() => cambiarImagen('siguiente')}>&gt;</button>
          </div>
          <div id='container-info'>
            <h2 id='nombre-articulo' className='spacing'></h2> 
            <p id='descripcion-articulo' className='spacing'></p>
            <div className='div-interesado-en'>
              <h4 id='interesado-en' className='spacing'>Interesado en: </h4>
              <p id="descripcion-interesado-en"></p>
            </div>
            <div id="container-buttons" className="spacing">
              {!esMiArticulo() && <button id="boton-intercambiar" >
                Intercambiar
              </button>}
              <div id="container-perfil">
                <h5 id='palabra-propietario'>Propietario</h5>
                <button id='boton-ver-perfil' onClick={redirectPerfil}>
                  <img src="" alt="Imagen-perfil" id='imagen-perfil'/>
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

      {/*<Pagar/>  */  }
      
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