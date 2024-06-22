

const express = require("express")
const {adminAuth, workerAuth, userAuth} = require ("../middleware/auth");
//const {DataArticulo} = require ("../model/Schema");


const{ MercadoPagoConfig, Preference} = require ("mercadopago");
const { stringify } = require("querystring");
const access_token= "TEST-5927481826006053-041716-b330d25407c1fe4b73d7e41b9e193bc8-267438622";
//TEST-5927481826006053-041716-b330d25407c1fe4b73d7e41b9e193bc8-267438622
const client = new MercadoPagoConfig({ accessToken: access_token},{locale: "es-AR"});
//const client = new MercadoPagoConfig({ accessToken: access_token});

const router = express.Router();





const crearPedido = async (req, res, next) =>{
	
console.log("Chekera que se pide cantidad")

	try {
		if ((!req.body) || (!req.body.Promocion) || (!req.body.Promocion.Duracion)) {
			return res.status(400).json({message: "Error de parametros mandados", status: 401});
		}
		
		const duracionPromocion = parseInt(req.body.Promocion.Duracion);
		console.log("Cantidad dias: ", duracionPromocion );
		if (isNaN(duracionPromocion)){
			return res.status(400).json({message: "El valor recibido no es un numero"});
		}
/*
		let body = {
			items:[ {
				currency_id: 'ARS',
				title: 'Mi producto',
						quantity: 1,
						unit_price: 2000
			}]*/
			/*,
			back_urls: {
				success: "",
				failure: "",
				pending: "",
			}
		}*/
		
		
		const preference = new Preference(client);
		console.log(preference)
		//body = JSON.stringify(body)
		//console.log(body);

		const result = await preference.create({body: {
			items: [
				{
					title: 'Mi producto',
					quantity: duracionPromocion,
					unit_price: 2000
				}
			],
			back_urls: {
				success: "http://localhost:5173/user/mis_articulos",
				failure: "http://localhost:5173/user/mis_articulos",
				pending: "http://localhost:5173/user/mis_articulos",
			}
		}, auto_return: "approved"});
		console.log(result.id);

		res.status(200).json({"id": result.id});
	} catch (err){
		console.log({"Error": err})
		res.status(401).json({message: "Error probable del back", status: 401});
	}

};












router.route("/crearPedido").post(userAuth, crearPedido);

module.exports = router









/*

//const mercadopago = require("mercadopago");
//mercadopago.configure({
//});



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
*/
