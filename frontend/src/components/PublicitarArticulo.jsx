/*import React, { useEffect } from 'react';
import { DEBOUNCE_TIME_RENDER } from '../util/constants';
import {
  onErrorDefault,
  onReadyDefault,
  onSubmitDefault,
  onBinChangeDefault,
} from '../util/initial';
import { initBrick } from '../util/renderBrick';
import { TCardPayment } from './type';
import { UpdateValues } from '../util/types/common';

/**
 * Card Payment Brick allows you to offer payments with credit and debit card at yout checkout.
 *
 * Usage:
 *
 * ```ts
 * import CardPayment, {initMercadoPago} from '@mercadopago/sdk-react'
 *
 * initMercadoPago('YOUR_PUBLIC_KEY')
 *
 * const Example = () => {
 *   return(
 *      <CardPayment
 *       initialization={{amount: AMOUNT}} // AMOUNT is the value from the purchase, its the minium data to initialize CardPayment brick
 *       onSubmit={} // Receives a function that send the payment to backend and, through it, to MercadoPago
 *       />
 *  )
 * }
 * export default Example
 * ```
 *
 * @see {@link https://www.mercadopago.com/developers/en/docs/checkout-bricks/card-payment-brick/introduction Card Payment Brick documentation} for more information.
 */
/*
const CardPayment = ({
  onReady = onReadyDefault,
  onError = onErrorDefault,
  onSubmit = onSubmitDefault,
  onBinChange = onBinChangeDefault,
  initialization,
  customization,
  locale,
}: TCardPayment) => {
  useEffect(() => {
    // CardPayment uses a debounce to prevent unnecessary reRenders.
    let timer: ReturnType<typeof setTimeout>;
    const CardPaymentBrickConfig = {
      settings: {
        initialization,
        customization,
        callbacks: {
          onReady,
          onSubmit,
          onError,
          onBinChange,
        },
        locale,
      },
      name: 'cardPayment',
      divId: 'cardPaymentBrick_container',
      controller: 'cardPaymentBrickController',
    };
    timer = setTimeout(() => {
      initBrick(CardPaymentBrickConfig);
    }, DEBOUNCE_TIME_RENDER);

    return () => {
      clearTimeout(timer);
      window.cardPaymentBrickController?.unmount();
    };
  }, [initialization, customization, onBinChange, onReady, onError, onSubmit]);

  return <div id="cardPaymentBrick_container"></div>;
};

const useCardPaymentBrick = () => {
  const update = (updateValues: UpdateValues) => {
    if (window.cardPaymentBrickController) {
      window.cardPaymentBrickController.update(updateValues);
    } else {
      console.warn(
        '[Checkout Bricks] Card Payment Brick is not initialized yet, please try again after a few seconds.',
      );
    }
  };
  return { update };
};

export default CardPayment;
export { useCardPaymentBrick };
*/



import React from 'react';
import { useState } from 'react';

import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';
//initMercadoPago('TEST-5927481826006053-041716-b330d25407c1fe4b73d7e41b9e193bc8-267438622', {locale: "es-AR"});
//initMercadoPago('TEST-5927481826006053-041716-b330d25407c1fe4b73d7e41b9e193bc8-267438622');
initMercadoPago('TEST-d26767aa-ba98-4c84-aa23-5a3be7e05309', {locale: "es-AR"});
//initMercadoPago('TEST-596e3943-6d51-40ca-b28f-0895e4d0619a', {locale: "es-AR"});

//import { CardPayment } from '@mercadopago/sdk-react';
function Pagar (){
  const [preferenceId, setPreferenceId] = useState(null);
  // Poner form para camvbiar los datos

  const [cantidadDias, setCantidadDias] = useState(1);
  
  const initialization = {
    preferenceId: '<PREFERENCE_ID>',
  }
  
  const customization = {
    texts: {
     valueProp: 'smart_option',
    },
  }
  
  const onSubmit = async (formData) => {
    // callback called when clicking on Wallet Brick
    // this is possible because Brick is a button
    
    if (window.checkoutButton) window.checkoutButton.unmount();
  };
  
  const onError = async (error) => {
    // callback called for all Brick error cases
    console.log("error", error);
  };
  
  const onReady = async (R) => {
    // Callback called when Brick is ready.
    // Here, you can hide loadings on your website, for example.  
    console.log("onReady", R);
  };
  
  
  /*<Wallet
  initialization={initialization}
  customization={customization}
  onSubmit={onSubmit}
  onReady={onReady}
  onError={onError}
  />*/
  
  
  
  const crearPedido = async () => {
    console.log("Cambiar el id del articulo por uno posta")
    if (window.checkoutButton) window.checkoutButton.unmount();
    fetch(
      "http://localhost:5000/pagar/crearPedido",
      {
        method: "POST",
        headers: { "Content-Type": "application/JSON" },
        body: JSON.stringify({Articulo: {_id: "6678ceb189e1a384783bd36a"},Promocion:{Duracion: cantidadDias }}),
        credentials: "include",
      }
    )
    .then((response) => {
      if (!response.ok) {
        return response.json().then(data => {
          throw new Error(JSON.stringify({ message: data.message, status: data.status }));
        })
      }
      return response.json();
    })
    .then((data) => {
      console.log(data)
      //createCheckoutButton(data.id);
      setPreferenceId(data.id)
      return
    })
    .catch((error) => {
      console.error("Hubo al generar pedido", error);
    });
  }
  /*
  const createCheckoutButton = (id) => {
  if (window.checkoutButton) window.checkoutButton.unmount();
  <Wallet initialization={{ preferenceId: id }} customization={{ texts:{ valueProp: 'smart_option'}}} />
  
  }*/
 
 
 const [promocionandoArticulo, setPromocionandoArticulo] = useState(true);
 const cambiarCantidadDias = (e) =>{
    setCantidadDias(e.target.value)
  }


return (
  
  
  <div>
    {/* <button onClick={promocionarArticulo}>Promocionar</button> */}

    {/* :<button onClick={crearPedido}>Confirmar</button> */ }
  

      { promocionandoArticulo ? <button className="boton-intercambiar" onClick={() =>{setPromocionandoArticulo(false)}}>Promocionar</button>
       :(<><input type="numer" name="contenidoBuscador" placeholder="dias" onChange={cambiarCantidadDias}></input>       <button onClick={crearPedido}>Confirmar</button></>)}

    
    {/* {preferenceId && <Wallet initialization={{preferenceId: preferenceId, redirectMode: 'modal'}} customization={{ texts:{ valueProp: 'smart_option'}}} onSubmit={onSubmit} onReady={onReady} onError={onError} />} */}
    {preferenceId && <Wallet initialization={{preferenceId: preferenceId}} customization={{ texts:{ valueProp: 'smart_option'}}} />} 


  </div>
);

  } 
  
  export default Pagar;
  
  
  
  
  
  
  
  
  
  
  
  
  
  /*
  
  //window.cardPaymentBrickController.unmount() borra la instancia de la compra
  
  const initialization = {
    amount: 100,
  };
  
  
  const onSubmit = async (formData) => {
    console.log("Entro a onSubmit");
    // callback llamado al hacer clic en el botón enviar datos
    return new Promise((resolve, reject) => {
      fetch('/http://localhost:5000/pay/process_payment', {
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
        console.log("No se logro hacer el fetchal back")
        reject();
      });
    });
  };
  
  
  const onError = async (error) => {
    console.log("Entro a onError");
    // callback llamado para todos los casos de error de Brick
    console.log(error);
  };
  
  
  const onReady = async () => {
    console.log("Entro a onReady");
    //Callback llamado cuando Brick está listo.
    //Aquí puedes ocultar cargamentos de su sitio, por ejemplo.
    
  };
  
 
  return (
  <CardPayment
  initialization={initialization}
  onSubmit={onSubmit}
  onReady={onReady}
  onError={onError}
  />
 
  );
  
  
  
  */