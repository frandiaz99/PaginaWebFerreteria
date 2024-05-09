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
  
  try{

    const Publi = await DataArticulo.findById(Articulo._id);
    if (!Publi){
      console.log("Articulo not found");
      return res.status(404).json({ message: "Articulo not found" });
    }
    if (!((User.rol == 3) || (Publi.usuario._id == User._id))){
      console.log("No es el creador del articulo ni administrador");
      res.status(401).json({message: "No posee permisos para borrar el articulo"})
    }
    //es el creador del articulo
    await Publi.deleteOne();
    console.log("Articulo successfully deleted");
    res.status(200).json({ message: "Articulo successfully deleted" });
    } catch (err) {
      console.error("An error occurred", err);
      res.status(500).json({ message: "An error occurred", error: err.message });
    }
    //if (true) {}    //chekear si la solicitud va deesde un administrador o hace otra tura de acceso separada
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
      res.status(400).json({ message: "Erro tratando de obtener", status: 402 });
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