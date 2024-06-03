const { DataUser, DataNotificacion, DataSucursal } = require("../model/Schema");
const { adminAuth, workerAuth, userAuth } = require("../middleware/auth");

const upload = require("../imagenes/imagen.js");
const multer = require("multer");

const { getNotificacionesNuevas } = require("./notificacion");
//
const express = require("express");
const router = express.Router();
//

const getSucursales = async (req, res, next) => {
  console.log("get sucursales");
  try {
    DataSucursal.find().then((Sucursales) => {
      return res.status(200).json({ message: "Consulta exitosa", Sucursales });
    });
  } catch (err) {
    return res.status(400).json({ message: "Error en la consulta", err });
  }
};

const newSucursal = async (req, res, next) => {

  let File;
  if (!req.file){
    File = {filename: "Imagen_sucursal_default.jpg"};
  } else {File = req.file};
  console.log({"File": File});


  const Sucursal = JSON.parse(req.body.Sucursal);

  if (!Sucursal) {
    console.log("Variable 'Sucursal' no recibida ");
    return res.status(401).json({ message: "Consulta erronea, falta objeto", status: 402 });
  }
  if (!Sucursal.nombre || !Sucursal.provincia || !Sucursal.ciudad || !Sucursal.direccion || !Sucursal.telefono) {
    console.log( "Variable 'nombre', 'provincia', 'ciudad', 'direccion' o 'telefono' no recibida");
    return res.status(401).json({ message: "Consulta erronea, faltan parametros", status: 403 });
  }

  Sucursal.foto = "Imagen_sucursal_default.jpg";

  await DataSucursal.create({
    nombre: Sucursal.nombre, provincia: Sucursal.provincia, ciudad: Sucursal.ciudad, direccion: Sucursal.direccion, telefono: Sucursal.telefono, foto: File.filename
  }).then((Sucursal) => {
    console.log("Creacion exitosa")
    return res.status(200).json({ message: "Creacion exitosa", Sucursal, status: 200});
  }).catch ((err) => {
    console.log("Creacion erronea", err)
    return res.status(400).json({ message: "Error en la creacion", status: 400, err });
  });

  //setSucursal()
  //200 exitosa
  //400 Error otro
  //402 "Articulo" no recibido
  //403 Variable 'nombre', 'provincia', 'ciudad', 'direccion' o 'telefono' no recibida
};

//routes

router.route("/getSucursales").get(getSucursales);
router.route("/newSucursal").post(upload.single("Imagen"), adminAuth, newSucursal);

/*
//admin routes
router.route("/deleteUser").delete(adminAuth, deleteUser);
router.route("/desbloquearUser").post(adminAuth, desbloquearUser);
*/
module.exports = router;
