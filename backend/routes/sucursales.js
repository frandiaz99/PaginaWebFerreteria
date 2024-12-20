const { DataUser, DataNotificacion, DataSucursal } = require("../model/Schema");
const { adminAuth, workerAuth, userAuth } = require("../middleware/auth");

const upload = require("../imagenes/imagen.js");
const multer = require("multer");

//const { getNotificacionesNuevas } = require("./notificacion");
//
const express = require("express");
const router = express.Router();
//

const getSucursales = async (req, res, next) => {
  console.log("get sucursales");
  try {
    DataSucursal.find({borrado: "false"}).then((Sucursales) => {
      return res.status(200).json({ message: "Consulta exitosa", Sucursales });
    });
  } catch (err) {
    return res.status(400).json({ message: "Error en la consulta", err });
  }
};

const newSucursal = async (req, res, next) => {

  let File;
  if (!req.file) {
    File = { filename: "Imagen_sucursal_default.jpg" };
  } else { File = req.file };
  console.log({ "File": File });


  const Sucursal = JSON.parse(req.body.Sucursal);

  if (!Sucursal) {
    console.log("Variable 'Sucursal' no recibida ");
    return res.status(401).json({ message: "Consulta erronea, falta objeto", status: 402 });
  }
  if (!Sucursal.nombre || !Sucursal.provincia || !Sucursal.ciudad || !Sucursal.direccion || !Sucursal.telefono) {
    console.log("Variable 'nombre', 'provincia', 'ciudad', 'direccion' o 'telefono' no recibida");
    return res.status(401).json({ message: "Consulta erronea, faltan parametros", status: 403 });
  }

  try{
    const S= await DataSucursal.findOne({nombre: Sucursal.nombre})
    console.log(S);
    if (S) {
        return res.status(401).json({message: `El nombre '${Sucursal.nombre}' ya pertenece a una sucursal`, status: 405});
    }
  } catch (err) {
    console.log (err); 
    return res.status(401).json(err)
  }
  

  Sucursal.foto = "Imagen_sucursal_default.jpg";

  await DataSucursal.create({
    nombre: Sucursal.nombre, provincia: Sucursal.provincia, ciudad: Sucursal.ciudad, direccion: Sucursal.direccion, telefono: Sucursal.telefono, foto: File.filename
  }).then((Sucursal) => {
    console.log("Creacion exitosa")
    return res.status(200).json({ message: "Creacion exitosa", Sucursal, status: 200 });
  }).catch((err) => {
    console.log("Creacion erronea", err)
    return res.status(400).json({ message: "Error en la creacion", status: 400, err });
  });

  //setSucursal()
  //200 exitosa
  //400 Error otro
  //402 "Articulo" no recibido
  //403 Variable 'nombre', 'provincia', 'ciudad', 'direccion' o 'telefono' no recibida
};

const eliminarSucursal = async (req, res, next) => {
  const body = req.body;
  const User = body.Auth;
  const Sucursal = body.Sucursal;
  console.log("aaaaaaaaaaaaaaaaaaaaa")

  if (!Sucursal) {
    console.log("Objeto 'Sucursal' en 'body' no recibido");
    return res.status(401).json({
      message: "Objeto 'Sucursal' en 'body' no recibido",
      status: 402,
    });
  }

  if (!Sucursal._id) {
    console.log("'id' no recibido");
    return res
      .status(401)
      .json({ message: "Objeto 'id' en 'Sucursal' no recibido", status: 403 });
  }
  
  if (!(User.rol >= 2)) {
    return res.status(401).json({
      message: "No posee permisos para borrar el articulo",
      status: 405,
    });
  }

  try {
    //const Publi = await DataSucursal.find(Sucursal._id);
    const Publi = await DataSucursal.findOneAndUpdate({"_id": Sucursal._id}, {"borrado": true});
    if (!Publi) {
      console.log("Sucursal not found");
      return res
        .status(404)
        .json({ message: "Sucursal not found", status: 404 });
    }
    //es el creador del articulo
    /*await Publi.deleteOne().then((result) => {
      if (result) {
        console.log("Sucursal successfully deleted");
        return res
          .status(200)
          .json({ message: "Sucursal successfully deleted", status: 200 });
      } else {
        console.log("Erro borrando sucursal");
        return res
          .status(200)
          .json({ message: "Error borrando sucursal", status: 406 });
      }
    });*/
    res.status(200).json({message: "Sucursal borrada exitosamente"});
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
};

//routes

router.route("/getSucursales").get(getSucursales);
router.route("/newSucursal").post(upload.single("Imagen"), adminAuth, newSucursal);

router.route("/eliminarSucursal").delete(adminAuth, eliminarSucursal);

/*
//admin routes
router.route("/deleteUser").delete(adminAuth, deleteUser);
router.route("/desbloquearUser").post(adminAuth, desbloquearUser);
*/
module.exports = router;
