import React, { useState, useEffect } from 'react'
//import Pagar from '../components/Pagar'
//<Pagar/>
//import { CardPayment } from '@mercadopago/sdk-react';
import  Pagar from '../components/Pagar';
import '../styles/UnArticulo.css'
//import { MercadoPagoInstance } from '@mercadopago/sdk-react/mercadoPago/initMercadoPago';

function UnArticulo() {

  //MercadoPagoInstance.publicKey = 'TEST-5927481826006053-041716-b330d25407c1fe4b73d7e41b9e193bc8-267438622';
  
  
/*
  <CardPayment
        initialization={{ amount: 100 }}
        onSubmit={async (param) => {
          console.log(param);
        }}/>;*/

  
  var imagenes = [];
  var indiceActual = 0;
  const [articuloSeleccionado, setArticuloSeleccionado] = useState(null); //El useState devuelve un array

  useEffect(() => {
      const articuloLocal = localStorage.getItem('articuloSeleccionado');
      if (articuloLocal) {
          setArticuloSeleccionado(JSON.parse(articuloLocal));
          console.log(articuloSeleccionado.nombre);
          document.getElementById("nombre-articulo").innerHTML = articuloSeleccionado.nombre;
          document.getElementById("descripcion-articulo").innerHTML = articuloSeleccionado.descripcion;
          document.getElementById("precio-articulo").innerHTML = articuloSeleccionado.precio;
          document.getElementById("descripcion-interesado-en").innerHTML = articuloSeleccionado.nombre;
      }
  }, []); //Para ejecutarlo 1 vez sola 

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

  return (
    <main className='main'>
      <div className='unArticulo-principal'>
      <div id='main-container'>
        <div id='container-foto'>
          <button className='boton-foto' onClick={() => cambiarImagen('atras')}>&lt;</button>
          <img id='foto-articulo' src={imagenes[indiceActual]} alt="Imagen-articulo" />
          <button className='boton-foto' onClick={() => cambiarImagen('siguiente')}>&gt;</button>
        </div>
        <div id='container-info'>
          <h2 id='nombre-articulo' className='spacing'></h2> 
          <p id='descripcion-articulo' className='spacing'></p>
          <p id='precio-articulo' className='spacing'></p>
          <h4 id='interesado-en' className='spacing'>Interesado en: </h4>
          <p id="descripcion-interesado-en"></p>
          <div id="container-buttons" className="spacing">
            <button id="boton-intercambiar" >
              Intercambiar
            </button>
            <div id="container-perfil">
              <h5>Propietario</h5>
              <button id='boton-ver-perfil'>
                <img src="" alt="Imagen-perfil" id='imagen-perfil'/>
                <div id='container-datos-usuario'>
                  <p id='nombre-usuario'>Usuario</p>
                  <p id='puntaje-usuario'>----- 5.0</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
      </div>

      <Pagar/>    
      
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