const express = require("express");
const { adminAuth, workerAuth, userAuth } = require("../middleware/auth");
const { DataArticulo, DataTrueque } = require("../model/Schema");
const router = express.Router();

const upload = require("../imagenes/imagen.js");
const multer = require("multer");
const { NuevaNotificacion } = require("./notificacion.js");

const crearArticulo = async (req, res, next) => {
  const articulo = JSON.parse(req.body.Articulo);
  /*
  console.log({ req: req });
  console.log({ Articulo: req.body.Articulo });
  console.log({ file: req.file });
  console.log({ files: req.files });
  console.log({ Auth: req.body.Auth });
  */
  //console.log({"body": body});
  const usuario = req.body.Auth._id; //auth lo genero yo desde el middleware del back no necesito que me lo pasen
  const { nombre, descripcion, interesado } = articulo;

  if (!nombre || !descripcion || !interesado){
    console.log ("registrar articulo: faltan recibir parametros");
    return res.status(400).json({message: "No se recibieron los campos 'nombre', 'interesado' o 'descripcion'", status: 402})
  }

  //comprueba si subio foto, si no lo havce le asigna la defecto
  let File, filename;
  if (req.files.length == 0) {
    filename = ["Imagen_publicacion_default.jpg"];
  } else {
    File = req.files;
    //console.log(File);
    filename = File.map((File) => File.filename);
    //console.log(filename);
  }
  //console.log({ File: File });

  await DataArticulo.create({
    usuario,
    nombre,
    descripcion,
    interesado,
    foto_articulo: filename,
    fecha: Date.now(),
  })
    .then((Articulo) => {
      res.status(200).json(Articulo);
    })
    .catch((err) => {
      res.status(401).json({
        message: "Error en la creacion de la articulo",
        error: err.message,
      });
    });
};

const getArticulos = async (req, res, next) => {
  await DataArticulo.find(
    { borrado: false, vendido: false },
    "-borrado -vendido"
  )
    .then((Articulos) => {
      //console.log(Articulos);
      res.status(200).json(Articulos);
    })
    .catch((err) => {
      res
        .status(401)
        .json({ message: "Error obteniendo articulos", error: err.message });
    });
};

const borrarArticulo = async (req, res, next) => {
  const body = req.body;
  const User = body.Auth;
  const Articulo = body.Articulo;

  if (!Articulo) {
    console.log("Objeto 'Articulo' en 'body' no recibido");
    return res.status(401).json({
      message: "Objeto 'Articulo' en 'body' no recibido",
      status: 402,
    });
  }

  if (!Articulo._id) {
    console.log("'id' no recibido");
    return res
      .status(401)
      .json({ message: "Objeto 'id' en 'Articulo' no recibido", status: 403 });
  }

  try {
    const Publi = await DataArticulo.findById(Articulo._id);
    if (!Publi) {
      console.log("Articulo not found");
      return res
        .status(404)
        .json({ message: "Articulo not found", status: 404 });
    }
    if (!(User.rol >= 2 || Publi.usuario._id == User._id)) {
      console.log("No es el creador del articulo ni administrador");
      return res.status(401).json({
        message: "No posee permisos para borrar el articulo",
        status: 405,
      });
    }
    //es el creador del articulo
    await Publi.deleteOne().then((result) => {
      if (result) {
        console.log("Articulo successfully deleted");
        return res
          .status(200)
          .json({ message: "Articulo successfully deleted", status: 200 });
      } else {
        console.log("Erro borrando articulo");
        return res
          .status(200)
          .json({ message: "Error borrando articulo", status: 406 });
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
};

const getMisArticulos = async (req, res, next) => {
  const User = req.body.Auth;
  //console.log(User);
  try {
    DataArticulo.find({ usuario: User._id })
      .then((articulos) => {
        if (articulos) {
          console.log("articulos obtenidos");
          res.status(200).json({ message: "Succesfully", articulos });
        } else {
          console.log("no tiene articulos");
          res.status(400).json({ message: "No posee articulos", status: 404 });
        }
      })
      .catch((err) => {
        console.log("error obteniendo articulos");
        res
          .status(400)
          .json({ message: "No se pudo buscar en los articulos", status: 403 });
      });
  } catch (err) {
    console.log(err);
    console.log("error raro");
    res
      .status(400)
      .json({ message: "Error raro tratando de obtener", status: 402 });
  }

  //200 OK
  //402 error en proceso
  //403 no se pudo obtener articulos
  //404 no tine articulos
};

const intercambiarArticulo = async (req, res, next) => {
  const body = req.body;
  const User = body.Auth;
  const Articulo = body.Articulo;

  if (!Articulo) {
    console.log("Objeto 'Articulo' en 'body' no recibido");
    return res.status(401).json({
      message: "Objeto 'Articulo' en 'body' no recibido",
      status: 402,
    });
  }

  if (!Articulo.miArticulo || !Articulo.suArticulo) {
    console.log("'miArticulo' o 'suArticulo' no recibido");

    return res.status(401).json({
      message: "Objeto 'miArticulo' o 'suArticulo' en 'Articulo' no recibido",
      status: 403,
    });
  }

  const miArticulo = await DataArticulo.findById(Articulo.miArticulo).then();
  const suArticulo = await DataArticulo.findById(Articulo.suArticulo).then();
  console.log("paso");
  //console.log("su articulo: ", suArticulo);
  //console.log("mi articulo: ", miArticulo);
  if (!miArticulo || !suArticulo) {
    return res.status(404).json({
      message: "Objeto 'miArticulo' o 'suArticulo' en no encontrado",
      status: 404,
    });
  }

  if (miArticulo.reservado || suArticulo.reservado) {
    return res.status(404).json({
      message: "El articulo 'miArticulo' o 'suArticulo' ya fue reservado, cancelar / rechazar el trueque primero",
      status: 409,
    });
  }

  if (miArticulo.vendido || suArticulo.vendido) {
    return res.status(404).json({
      message: "El articulo 'miArticulo' o 'suArticulo' ya fue vendido",
      status: 408,
    });
  }


  if (miArticulo.usuario._id != User._id) {
    console.log(
      "El articulo no le pertenece al usuario",
      User._id,
      miArticulo.usuario
    );
    return res.status(401).json({
      message: "Objeto 'miArticulo' no te pertenece",
      status: 406,
    });
  }

  if (
    miArticulo.vendido ||
    miArticulo.borrado ||
    suArticulo.vendido ||
    suArticulo.borrado
  ) {
    return res.status(401).json({
      message: "Objeto 'miArticulo' o 'suArticulo' no disponibles",
      status: 405,
    });
  }

  if (miArticulo.precio != suArticulo.precio) {
    return res.status(401).json({
      message:
        "Objeto 'miArticulo' y 'suArticulo' no pertenecen a la misma categoria de precio",
      status: 407,
    });
  }

  DataArticulo.findByIdAndUpdate({ _id: miArticulo._id }, ({ reservado: true })).then().catch((err) => {
    console.log(err);
    return res.status(400).json({ message: "Error obteniendo los datos", status: 400 });
  })
  DataArticulo.findByIdAndUpdate({ _id: suArticulo._id }, ({ reservado: true })).then().catch((err) => {
    console.log(err);
    return res.status(400).json({ message: "Error obteniendo los datos", status: 400 });
  })

  DataTrueque.create({
    articulo_compra: miArticulo._id,
    articulo_publica: suArticulo._id,
  })
    .then((data) => {
      console.log(
        "Avisar al dueno suArticulo que se creo una nueva solicitud de trueque"
      );
      NuevaNotificacion(data.articulo_publica.usuario._id, 6, data._id);
      res.status(200).json({ message: "Trueque creado", data, status: 200});
    })
    .catch((err) => {
      console.error("Eror creadn objeto de trueque", err);
      res.status(401).json({ message: "Error creadno trueque", err });
    });
};

const tasarArticulo = async (req, res, next) => {
  const Art = req.body.Articulo;
  if (!Art) {
    console.log("Variable 'Articulo' no recibida ");
    return res.status(401).json({ message: "Consulta erronea, falta 'Articulo'", status: 401 });
  }
  if (!Art._id || !Art.precio) {
    console.log("Variable '_id' o 'precio' en 'Articulo' no recibida ");
    return res.status(401).json({ message: "Consulta erronea, falta objeto '_id' y/o 'precio'", status: 402 });
  }
  if (Art.precio < 1 || Art.precio > 10) {
    return res.status(401).json({ message: "Consulta erronea, 'precio' debe estar entre 1 y 10 inclusive", status: 403 });
  }

  DataArticulo.findOneAndUpdate({ _id: Art._id }, { precio: Art.precio })
    .then((Articulo) => {
      if (Articulo) {
        NuevaNotificacion(Articulo.usuario._id, 5, Articulo._id);
        return res.status(200).json({ message: "Articulo encontrado y actualizado", status: 200, Articulo, });
      } else return res.status(401).json({ message: "Articulo NO encontrado", status: 404 });

    })
    .catch((error) => {
      console.log(error);
      return res.status(401).json({ message: "Erro otro", status: 400, error });
    });

  //200 exitosa
  //400 Error otro
  //401 Variable 'Articulo' no recibida
  //402 Variable '_id' y/o 'precio' no recibida
  //403 Variable 'precio' es menor a 1 o mayor a 5
  //404 _id, Articulo not found
};



//Direcciones
router.route("/getArticulos").get(getArticulos);
router.route("/crearArticulo").post(upload.any("Imagen"), userAuth, crearArticulo);

router.route("/getMisArticulos").get(userAuth, getMisArticulos);
router.route("/borrarArticulo").delete(userAuth, borrarArticulo);
router.route("/intercambiarArticulo").post(userAuth, intercambiarArticulo);

router.route("/tasarArticulo").post(workerAuth, tasarArticulo);


module.exports = router;
