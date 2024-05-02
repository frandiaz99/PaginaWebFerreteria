/* OMITIR 	HASTA QUE DECIDA QUE HACER CON METODO DE PAGO

const express = require("express")
const {adminAuth, workerAuth, userAuth} = require ("../middleware/auth");
//const {DataArticulo} = require ("../model/Schema");


const router = express.Router();



const{ MercadoPagoConfig, Payment } = require ("mercadopago");
//const mercadopago = require("mercadopago");
//mercadopago.configure({
//	access_token: "<TEST-5927481826006053-041716-b330d25407c1fe4b73d7e41b9e193bc8-267438622>",
//});


const client = new MercadoPagoConfig({ accessToken: 'TEST-5927481826006053-041716-b330d25407c1fe4b73d7e41b9e193bc8-267438622' });

const process_payment = async (req, res) => {
  console.log("Arriando que es gerundio");
  const payment = new Payment(client);
  
 // payment.create({ body: req.body })
 // .then(console.log)
 // .catch(console.log);
  
  
  payment.create({ body: {
    transaction_amount: 100,
    description: 'La descripcion',
    payment_method_id: '<PAYMENT_METHOD_ID>',
    payer: {
      email: 'juliq.gelp@gmail.com'
    },
  } }).then(console.log).catch(console.log);
  
};


/////




8//import { MercadoPagoConfig, Payment } from 'mercadopago';

// Step 2: Initialize the client object
const client = new MercadoPagoConfig({ accessToken: 'access_token', options: { timeout: 5000, idempotencyKey: 'abc' } });

// Step 3: Initialize the API object
const payment = new Payment(client);

// Step 4: Create the request object
const body = {
	transaction_amount: 12.34,
	description: '<DESCRIPTION>',
	payment_method_id: '<PAYMENT_METHOD_ID>',
	payer: {
		email: '<EMAIL>'
	},
};
const requestOptions = {
	idempotencyKey: '<IDEMPOTENCY_KEY>',
};
payment.create({ body, requestOptions }).then(console.log).catch(console.log);





/////

const create_preference = async (req, res) => {
  
  let preference = {
    items: [
      {
				title: req.body.description,
				unit_price: Number(req.body.price),
				quantity: Number(req.body.quantity),
			}
		],
		back_urls: {
			"success": "http://localhost:8080/feedback",
			"failure": "http://localhost:8080/feedback",
			"pending": "http://localhost:8080/feedback"
		},
		auto_return: "approved",
	};
  console.log(preference);
	client.Preference.create(preference)
		.then(function (response) {
      console.log("llega");
			res.json({
				id: response.body.id
			});
		}).catch(function (error) {
			console.log(error);
		});
};

router.route("/create_preference").post(userAuth, create_preference);




//Direcciones 
router.route("/process_payment").post(userAuth, process_payment);

module.exports = router

*/