//es aglo  mas local no va a tener rutas
//cuadno se hacen ciertas cosas se va tener q crear una instancia
//notificacionSchema
const { DataUser, DataNotificacion, DataSucursal, DataProducto, DataVenta } = require("../model/Schema.js");
const { adminAuth, workerAuth, userAuth } = require("../middleware/auth.js");

const upload = require("../imagenes/imagen.js");
const multer = require("multer");


//
const express = require("express");
const { constrainedMemory } = require("process");
const mongoose  = require("mongoose");
const router = express.Router();




const getNotificacionesNuevas  = async (req, res, next) => {
  await DataNotificacion.find({usuario: req.body.Auth._id, visto: false})
  //, -usuario se le podri poner para no remandarle el id del user
  .then((Notificaciones) =>{
     return res.status(200).json(Notificaciones);
    }).catch((err) =>{
      console.log(err)
      return res.status(400).json({message: "Error fetching the notifications"});
    })
};

const getNotificaciones  = async (req, res, next) => {
  //console.log(req.body.Auth._id);
  await DataNotificacion.find({usuario: req.body.Auth._id})
  //, -usuario se le podri poner para no remandarle el id del user
  .then((Notificaciones) =>{
    return res.status(200).json(Notificaciones);
  }).catch((err) =>{
    console.log(err)
    return res.status(400).json({message: "Error fetching the notifications"});
  })
};
  

const verNotificacion = async (req, res, next) => {
  if ((!req.body.Notificacion) || (!req.body.Notificacion._id)){
    return res.status(400).json({message: "'_id' en 'Notificacion' no encontrado", status: 401});
  }
  const user = req.body.Auth;
  const notificacion = req.body.Notificacion;
  DataNotificacion.findOneAndUpdate({_id: notificacion._id, usuario: user._id},{$set: {visto: true}}, {new : true}).then(async (N)  => {
    if (!N){ 
      return res.status(400).json({message:"Notificacion para usuario no encontrada"})
    }
    DataUser.findOneAndUpdate({ _id: user._id },{ $pull: { notificaciones: N._id } }, {new: true}).then(user => {
      if (user) {

        return res.status(200).json("OK");
      } else {
        console.log("Usuario no encontrado");
      }
    }).catch((err =>{
      console.log(err);
      res.status(401).json("probable error del back");
    }))
  }).catch((err) =>{
    console.log(err)
    return res.status(401).json({message: "Error obteniendo la notificacion"})
  })
}
  

const NuevaNotificacion = async (id_usuario, tipo, id_objeto) =>{
  console.log("Creando notificacion")
  let texto;
  switch (tipo) {
    case 1:
      texto = "Tu oferta de intercambio fue ACEPTADA";
      break;
  case 2:
      texto = "Tu oferta de intercambio fue RECHAZADA";
  break;
  case 3:
      texto = "Un trueque fue cancelado";
  break;
  case 4:
      texto = "Se establecio una fecha para el trueque";
  break;
  case 5:
      texto = "Tu articulo fue tasado";
  break;
  case 6:
      texto = "Tenes una nueva oferta de intercambio";
  break;
   
  default:
    texto = "falta asignar texto"
  break;
  }

  DataNotificacion.create({usuario: id_usuario, objeto: id_objeto, tipo: tipo, texto: texto}).then((notificacion) => {
    console.log(notificacion)
    DataUser.findOneAndUpdate({_id: id_usuario}, {$push: {notificaciones: notificacion._id}}).then().catch(err => console.log(err));
  }).catch((err) => {
    console.log(err);
  });
}


  
//
//router.route("/getNotificacionesNuevas").get(userAuth, getNotificacionesNuevas);
router.route("/getNotificaciones").get(userAuth, getNotificaciones);
router.route("/verNotificacion").post(userAuth, verNotificacion);



//module.exports = ;
module.exports = {router, NuevaNotificacion};