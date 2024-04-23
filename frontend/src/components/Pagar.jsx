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
import { initMercadoPago } from '@mercadopago/sdk-react';
initMercadoPago('YOUR_PUBLIC_KEY');


import { CardPayment } from '@mercadopago/sdk-react';


function Pagar (){
  
  
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


} 

export default Pagar;