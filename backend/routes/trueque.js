const express = require("express");
const mongoose = require("mongoose");
const { adminAuth, workerAuth, userAuth } = require("../middleware/auth");
const { DataArticulo, DataTrueque, DataUser } = require("../model/Schema");
const { mandarMail } = require("./mail.js");

const router = express.Router();






const getTruequesPendientes = async (req, res, next) => {
  await DataTrueque.find({ venta_confirmada: false }).then((data) => {
    console.log(data);
    if (data[0]) {
      console.log("articulos obtenidos");
      return res.status(200).json({ message: "Succesfully", data, status: 200 });
    } else {
      console.log("no tiene articulos");
      return res.status(400).json({ message: "No hay trueques pendientes", status: 401 });
    }
  }).catch((error) => {
    return res.status(400).json({ message: "Error obteniendo trueques pendientes", status: 400 });
  });
}



const responderOferta = async (req, res, next) => {
  const body = req.body;
  if (!body.Trueque) {
    return res.status(400).json({ message: "No se recibio el objeto 'Trueque'", status: 401 });
  }
  if (!body.Trueque._id) {
    return res.status(400).json({ message: "No se recibio el objeto '_id' en 'Trueque'", status: 402 });
  }
  if (body.Trueque.trueque_aceptado == null) {
    return res.status(400).json({ message: "No se recibio el objeto 'trueque_aceptado' en 'Trueque'", status: 406 });
  }
  body.Trueque.trueque_aceptado = JSON.parse(body.Trueque.trueque_aceptado);

  await DataTrueque.findById(body.Trueque._id).then((Trueque) => {
    console.log(Trueque);
    if (!Trueque) {
      return res.status(400).json({ message: "No se encontro el trueque conb el '_id' recibido", status: 404 });
    }
    if (Trueque.articulo_publica.usuario._id != body.Auth._id) {
      console.log("No es el creador del articulo");
      return res.status(400).json({ message: "No es el creador del articulo del trueque", status: 403 });
    }
    if (Trueque.trueque_aceptado) {
      return res.status(400).json({ message: "Este trueque ya fue aceptado", status: 405 });
    }
    const hol = false;
    console.log(body.Trueque.trueque_aceptado, hol)
    if (body.Trueque.trueque_aceptado) {
      console.log("CREAR NOTIFICACION Y AVISAR AL SEGUNDO USUARIO QUE SE ACEPTO LA OFERTA");
      DataTrueque.findByIdAndUpdate(Trueque._id, { trueque_aceptado: true }).then(() => {
        return res.status(200).json({ message: "Trueque correctamente aceptado", status: 200 });
      }).catch((error) => {
        return res.status(400).json({ message: "Error aceptando trueque", error, status: 400 });
      })

    } else {
      console.log("borrando trueque");
      console.log("CREAR NOTIFICACION Y AVISAR AL SEGUNDO USUARIO QUE SE RECHAZO LA OFERTA");
      DataTrueque.findOneAndDelete({ _id: Trueque._id }).then(() => {
        return res.status(200).json({ message: "Trueque correctamente borrado", status: 200 });
      }).catch((error) => {
        return res.status(400).json({ message: "Error borrando trueque", error, status: 400 });
      })
    }

  }).catch((error) => {
    return res.status(400).json({ message: "Error obteniendo trueque", error, status: 400 });
  });
}

const cancelarTrueque = async (req, res, next) => {
  const body = req.body;
  const User = body.Auth;
  const Trueque = body.Trueque;

  if (!Trueque) {
    console.log("Objeto 'Articulo' en 'body' no recibido");
    return res.status(401).json({
      message: "Objeto 'Trueque' en 'body' no recibido",
      status: 402,
    });
  }

  if (!Trueque._id) {
    console.log("'id' no recibido");
    return res
      .status(401)
      .json({ message: "Objeto 'id' en 'Truqeu' no recibido", status: 403 });
  }

  try {
    const Publi = await DataTrueque.findById(Trueque._id);
    if (!Publi) {
      console.log("Trueque not found");
      return res
        .status(404)
        .json({ message: "Trueque not found", status: 404 });
    }
    if (Publi.venta_confirmada){
      console.log("Este trueque ya fue efectivizado, no se puede cancelar ya")
      return res.status(401).json({ message: "El trueque ya fue efectivizado", status: 407 });
    }
    if (!(User.rol >= 2)) {
      console.log("No es empleado ni administrador");

      if (!((Publi.articulo_compra.usuario._id = User._id) || (Publi.articulo_publica.usuario._id = User._id))){
        console.log("Tampoco es un usuario que participa en el trueque");
        return res.status(401).json({
          message: "No posee permisos para borrar el Trueque",
          status: 405, 
        });
      }
    }
    console.log("Avisar a ambos usuarios de que se cancela el trueque por mail correo")
    await Publi.deleteOne().then((result) => {
      if (result) {
        console.log("Trueque successfully deleted");
        return res
          .status(200)
          .json({ message: "Trueque successfully deleted", status: 200 });
      } else {
        console.log("Erro borrando Trueque");
        return res
          .status(200)
          .json({ message: "Error borrando Trueque", status: 406 });
      }
    });
  } catch (err) {
    console.error("An error occurred", err);
    return res
      .status(500)
      .json({ message: "An error occurred", error: err.message, status: 400 });
  }

  //200 exitosa
  //400 Error Raro
  //402 Objeto 'Articulo' en 'body' no recibido
  //403 "Objeto 'id' en 'Articulo' no recibido"
  //404 Articulo not found
  //405 No posee permisos para eliminar articulo
  //406 Error borrando articulo, de parte de mongoose
  //407 el trueque ya fue efectivizado
};


const setFecha = async (req, res, next) =>{
  const {Auth, Trueque} = req.body;
  if (!Trueque || !Trueque._id || !Trueque.sucursal || !Trueque.fecha_venta){
    console.log("");
    res.status(401).json({message: "No se recibio el 'Trueque._id', 'Trueque.fecha_venta' o 'Trueque.sucursal' ", status: 401})
  }
  
  DataTrueque.findById(Trueque._id).then((T) =>{
    if (!T){
      return res.status(400).json({message: "Error, no se encontro el trueque recibido", status:  404})
    }
    if (!T.trueque_aceptado){
      return res.status(400).json({message: "Error, el trueque todavia no fue aceptado por el usuario", status:  402})
    }
    if ( !(T.articulo_compra.usuario._id == Auth._id || T.articulo_publica.usuario._id == Auth._id)){
      return res.status(400).json({message: "Error, no es usuario participante del trueque", status:  403})
    }
    if (T.fecha_venta || T.sucursal){
      return res.status(400).json({message: "Este trueque ya tiene una sucursal y fecha establecido", status:  405})
    }
    
    const fecha = new Date(Trueque.fecha_venta);
    //console.log(Trueque.fecha_venta, "  ", fecha, "  ", Date.now(), "  ", (fecha < Date.now()));
    if (fecha < Date.now()){
      return res.status(400).json({message: "Error, la fecha recibida ya paso", status:  406})
    }

    DataTrueque.findByIdAndUpdate(Trueque._id, {sucursal: Trueque.sucursal, fecha_venta: Trueque.fecha_venta}, {new: true}).then((newTrueque) => {
      //console.log(`El trueque de ${newTrueque.articulo_publica.nombre} y ${newTrueque.articulo_compra.nombre}, se establecio para el dia ${newTrueque.fecha_venta} en la sucursal ${newTrueque.sucursal.nombre}`);
      mandarMail(newTrueque.articulo_publica.usuario.email, 2, `El trueque de ${newTrueque.articulo_publica.nombre} y ${newTrueque.articulo_compra.nombre}, se establecio para el dia ${newTrueque.fecha_venta} en la sucursal ${newTrueque.sucursal.nombre}`);
      mandarMail(newTrueque.articulo_compra.usuario.email, 2, `El trueque de ${newTrueque.articulo_publica.nombre} y ${newTrueque.articulo_compra.nombre}, se establecio para el dia ${newTrueque.fecha_venta} en la sucursal ${newTrueque.sucursal.nombre}`);
      console.log("Faltaria hacer las notificaciones")
      return res.status(200).json({message: "La fecha y la sucursal se establecio correctamente", status:  200})
    }).catch((error) =>{
      console.log(error);
      return res.status(400).json({message: "Error de conexion del server", status:  400})
    })
    
  }).catch((error) => {
    console.log(error);
    return res.status(400).json({message: "Error de conexion del server", status:  400})
  })

};


const efectivizarTrueque = async (req, res, next) =>{
  const body = req.body;
  const User = body.Auth;
  const Trueque = body.Trueque;
  const Ventas = body.Ventas;
  
  if (User.rol == 1){
    return res.status(401).json({ message: "No posee permisos", status: 401 });
  }

  if (!Trueque || !Trueque._id){
    console.log("No se recibio el objeto 'Trueque' y/o '_id'")
    return res.status(401).json({ message: "No se recibio el objeto 'trueque' con '_id'", status: 402 });
  }


  
  
  DataTrueque.findById(Trueque._id).then((T) =>{
    console.log(T.fecha_venta, Date.now());
    if (!T){
      console.log("No se encontro el trueque recibido")
      return res.status(401).json({ message: "No se encontro el trueque", status: 404 });
    }
    if (T.venta_confirmada){
      console.log("El trueque recibido ya fue finalizado")
      return res.status(401).json({ message: "El trueque recibido ya fue finalizado", status: 403 });
    }
    if (User.rol = 2 && T.sucursal != User.sucursal){
      console.log("El trueque esta establecido para otra sucursal diferente ")
      return res.status(401).json({ message: "El trueque esta establecido para otra sucursal distinta", status: 406 });
    }
    //if (T.fecha_venta > Date.now()){
    if (!T.fecha_venta || T.fecha_venta > Date.now()){
      console.log("Todavia falta para la fecha acordada para el trueque")
      return res.status(401).json({ message: "Falta para la fecha del intercambio", status: 405 });
    }
    var puntos_compra = T.articulo_compra.precio * 10;
    var puntos_publica = T.articulo_publica.precio * 10;
    // ver si se registra alguan venta, a quien y sumarle los puntos
    console.log("Falta calular bien los puntos");

    mandarMail(T.articulo_compra.usuario.email, 2, `El trueque entre el articulo ${T.articulo_compra.nombre} y el articulo ${T.articulo_publica.nombre} se a efectuado con exito y se te a sumado un total de ${puntos_compra} puntos`);
    mandarMail(T.articulo_publica.usuario.email, 2, `El trueque entre el articulo ${T.articulo_compra.nombre} y el articulo ${T.articulo_publica.nombre} se a efectuado con exito y se te a sumado un total de ${puntos_publica} puntos`);

    DataUser.findByIdAndUpdate({_id: T.articulo_compra.usuario._id}, {$inc: {puntos: puntos_compra} }).catch((err) =>{
      console.log (err);
      return res.status(400).json({message: "Error obteniendo los datos", status: 400});
    });
    DataUser.findByIdAndUpdate({_id: T.articulo_publica.usuario._id}, {$inc: {puntos: puntos_publica} }).catch((err) =>{
      console.log (err);
      return res.status(400).json({message: "Error obteniendo los datos", status: 400});
    });

    DataTrueque.findByIdAndUpdate({_id: T._id},({venta_confirmada: true})).then().catch((err)=>{
      console.log (err);
      return res.status(400).json({message: "Error obteniendo los datos", status: 400});
    })
    return res.status(200).json({message: "OK", status: 200}) ;

  }).catch ((err) => {
    console.log (err);
    return res.status(400).json({message: "Error obteniendo los datos", status: 400});
  });

};



router.route("/getPendientes").get(userAuth, getTruequesPendientes);
router.route("/responderOferta").post(userAuth, responderOferta);
router.route("/cancelarTrueque").delete(userAuth, cancelarTrueque)
router.route("/setFecha").post(userAuth, setFecha)

router.route("/efectivizarTrueque").post(workerAuth, efectivizarTrueque);


module.exports = router;