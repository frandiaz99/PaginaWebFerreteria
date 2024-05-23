const express = require("express");
const mongoose = require("mongoose");
const { adminAuth, workerAuth, userAuth } = require("../middleware/auth");
const { DataArticulo, DataTrueque } = require("../model/Schema");

const router = express.Router();






const getTruequesPendientes = async (req, res, next) =>{
  await DataTrueque.find({venta_confirmada: false}).then((data) => {
    console.log(data);
    if (data[0]) {
      console.log("articulos obtenidos");
      return res.status(200).json({ message: "Succesfully", data, status: 200});
    } else {
      console.log("no tiene articulos");
      return res.status(400).json({ message: "No hay trueques pendientes", status: 401 });
    }
  }).catch ((error) => {
    return res.status(400).json({ message: "Error obteniendo trueques pendientes", status: 400 });
  });
}



const responderOferta = async (req, res, next) =>{
  const body = req.body;
  if (!body.Trueque){
    return res.status(400).json({ message: "No se recibio el objeto 'Trueque'", status: 401 });
  }
  if (!body.Trueque._id){
    return res.status(400).json({ message: "No se recibio el objeto '_id' en 'Trueque'", status: 402 });
  }
  if (!body.Trueque.trueque_aceptado){
    return res.status(400).json({ message: "No se recibio el objeto 'trueque_aceptado' en 'Trueque'", status: 406 });
  }
  body.Trueque.trueque_aceptado = JSON.parse(body.Trueque.trueque_aceptado);

  await DataTrueque.findById(body.Trueque._id).then((Trueque) => {
    console.log(Trueque);
    if (!Trueque) {
      return res.status(400).json({ message: "No se encontro el trueque conb el '_id' recibido", status: 404 });
    } 
    if (Trueque.articulo_publica.usuario._id != body.Auth._id){
      console.log("No es el creador del articulo");
      return res.status(400).json({ message: "No es el creador del articulo del trueque", status: 403 });
    }
    if (Trueque.trueque_aceptado){
      return res.status(400).json({ message: "Este trueque ya fue aceptado", status: 405 });
    }
    const hol = false;
    console.log(body.Trueque.trueque_aceptado,hol)
    if (body.Trueque.trueque_aceptado) {
      console.log("CREAR NOTIFICACION Y AVISAR AL SEGUNDO USUARIO QUE SE ACEPTO LA OFERTA");
      DataTrueque.findByIdAndUpdate(Trueque._id,{trueque_aceptado: true}).then( () => {
        return res.status(200).json({ message: "Trueque correctamente aceptado", status: 200}); 
      }).catch ((error) => {
        return res.status(400).json({ message: "Error aceptando trueque", error, status: 400});
      })
     
    } else {
      console.log("borrando trueque");
      console.log("CREAR NOTIFICACION Y AVISAR AL SEGUNDO USUARIO QUE SE RECHAZO LA OFERTA");
      DataTrueque.findOneAndDelete({_id: Trueque._id}).then( () => {
        return res.status(200).json({ message: "Trueque correctamente borrado", status: 200}); 
      }).catch ((error) => {
        return res.status(400).json({ message: "Error borrando trueque", error, status: 400});
      })
    }

  }).catch ((error) => {
    return res.status(400).json({ message: "Error obteniendo trueque", error, status: 400 });
  });
}







router.route("/getPendientes").get(userAuth, getTruequesPendientes);
router.route("/responderOferta").post(userAuth, responderOferta);



module.exports = router;