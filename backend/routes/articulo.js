const express = require("express")
const {adminAuth, workerAuth, userAuth} = require ("../middleware/auth");
const {DataArticulo} = require ("../model/Schema");


const router = express.Router();

const upload = require("../imagenes/imagen.js")
const multer = require("multer");



const  crearArticulo = async (req, res, next) =>{
  const articulo = JSON.parse(req.body.Articulo);
  /*console.log({"Articulo":req.body.Articulo});
  console.log({"file":req.file});
  console.log({"Auth": req.body.Auth});*/
  //console.log({"body": body});
  const usuario = req.body.Auth._id;  //auth lo genero yo desde el middleware del back no necesito que me lo pasen
  const {nombre, descripcion, interesado}  = articulo;
  
  //comprueba si subio foto, si no lo havce le asigna la defecto
  let File;
  if (!req.file){
    File = {filename: "Imagen_publicacion_default.jpg"};
  } else {File = req.file};
  console.log({"File": File});



  await DataArticulo.create({ usuario, nombre, descripcion, interesado, foto_articulo: File.filename, fecha: Date.now() })
  .then((Articulo) => {
    res.status(200).json(Articulo);
  })
  .catch((err) => {
    res.status(401).json({message: "Error en la creacion de la articulo",error: err.message})
  });
  
};

const getArticulos = async (req, res, next) => {
  await DataArticulo.find({borrado: false, vendido: false}, '-borrado -vendido')
  .then((Articulos) =>{
    //console.log(Articulos);
    res.status(200).json(Articulos);
  }).catch((err) =>{
    res.status(401).json({message: "Error obteniendo articulos", error: err.message})
  })
};


const borrarArticulo = async (req, res, next) => {
  const body = req.body
  const User = body.Auth;
  const Articulo = body.Articulo;

  if (!Articulo){
    console.log("Objeto 'Articulo' en 'body' no recibido")
    res.status(401).json({message: "Objeto 'Articulo' en 'body' no recibido", status: 402})
  }
  
  if (!Articulo.id){
    console.log("'id' no recibido")
    res.status(401).json({message: "Objeto 'id' en 'Articulo' no recibido", status: 403})
  }


  
  try{

    const Publi = await DataArticulo.findById(Articulo.id);
    if (!Publi){
      console.log("Articulo not found");
      return res.status(404).json({ message: "Articulo not found" , status: 404});
    }
    if (!((User.rol == 3) || (Publi.usuario._id == User._id))){
      console.log("No es el creador del articulo ni administrador");
      return res.status(401).json({message: "No posee permisos para borrar el articulo", status: 405})
    }
    //es el creador del articulo
    await Publi.deleteOne().then( (result) => {
      if (result) {
        console.log("Articulo successfully deleted");
        return res.status(200).json({ message: "Articulo successfully deleted", status: 200 });
      } else{
        console.log("Erro borrando articulo");
        return res.status(200).json({ message: "Error borrando articulo", status: 406 });

      }

    });
    } catch (err) {
      console.error("An error occurred", err);
      return res.status(500).json({ message: "An error occurred", error: err.message, status: 400 });
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
    const User = req.body.Auth
    console.log(User)
    try {
      DataArticulo.find({usuario: User._id}).then( (articulos) => {
        if (articulos){
          console.log("articulos obtenidos")
          res.status(200).json({ message: "Succesfully", articulos });
        } else {
          console.log("no tiene articulos")
          res.status(400).json({ message: "No posee articulos", status: 404 });
          
        }
        
      }).catch ((err) =>{
        console.log("error obteniendo articulos")
        res.status(400).json({ message: "No se pudo buscar en los articulos", status: 403 });
        
      })
    } catch (err) {
      console.log (err)
      console.log("error raro")
      res.status(400).json({ message: "Error raro tratando de obtener", status: 402 });
  }

  //200 OK
  //402 error en proceso
  //403 no se pudo obtener articulos
  //404 no tine articulos

};



//Direcciones 
router.route("/crearArticulo").post(upload.single("Imagen"), userAuth, crearArticulo);
router.route("/getMisArticulos").get(userAuth, getMisArticulos);
router.route("/getArticulos").get(getArticulos);
router.route("/borrarArticulo").delete(userAuth, borrarArticulo);

module.exports = router