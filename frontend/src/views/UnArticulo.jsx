import React from 'react'
//import Pagar from '../components/Pagar'
//<Pagar/>
//import { CardPayment } from '@mercadopago/sdk-react';
import  Pagar from '../components/Pagar';
//import { MercadoPagoInstance } from '@mercadopago/sdk-react/mercadoPago/initMercadoPago';

function UnArticulo() {

  //MercadoPagoInstance.publicKey = 'TEST-5927481826006053-041716-b330d25407c1fe4b73d7e41b9e193bc8-267438622';
  
  
/*
  <CardPayment
        initialization={{ amount: 100 }}
        onSubmit={async (param) => {
          console.log(param);
        }}/>;*/


  return (
    <main className='main'>
      <div>UnArticulo</div>

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