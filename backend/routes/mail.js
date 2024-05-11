const { DataUser, DataNotificacion, DataSucursal } = require("../model/Schema");
//const { adminAuth, workerAuth, userAuth } = require("../middleware/auth");

//const upload = require("../imagenes/imagen.js");

const { getNotificacionesNuevas } = require("./notificacion");
//
const express = require("express");
//const router = express.Router();
//




const mandarMail = async (mailDestino, mailTipo, mailMensaje) =>{
  


}



//routes


//router.route("/getSucursales").get(getSucursales);
//router.route("/newSucursal").post(adminAuth, newSucursal);

/*
//admin routes
router.route("/deleteUser").delete(adminAuth, deleteUser);
router.route("/desbloquearUser").post(adminAuth, desbloquearUser);
*/
module.exports = {mandarMail};
