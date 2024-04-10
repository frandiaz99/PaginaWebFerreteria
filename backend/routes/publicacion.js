const express = require("express")
const {adminAuth, workerAuth, userAuth} = require ("../middleware/auth");
const {DataPublicacion} = require ("../model/Schema");


const router = express.Router();




const  crearPublicacion = async (req, res, next) =>{
  const body = req.body;
  const usuario = body.Auth._id;  //auth lo genero yo desde el middleware del back no necesito que me lo pasen
  const {titulo, descripcion}  = body.Publicacion;
  
  await DataPublicacion.create({ usuario, titulo, descripcion, fecha: Date.now()})
  .then((Publicacion) => {
    res.status(200).json(Publicacion);
  })
  .catch((err) => {
    res.status(401).json({message: "Error en la creacion de la publicacion",error: err.message})
  });
  
};

const getPublicaciones = async (req, res, next) => {
  await DataPublicacion.find({borrado: false, estado_libre: true}, '-borrado -estado_libre')
  .then((Publicaciones) =>{
    res.status(200).json(Publicaciones);
  }).catch((err) =>{
    res.status(401).json({message: "Error obteniendo publicaciones", error: err.message})
  })
};


const borrarPublicacion = async (req, res, next) => {
  const body = req.body
  const User = body.Auth;
  const Publicacion = body.Publicacion;
  
  try{

    const Publi = await DataPublicacion.findById(Publicacion._id);
    if (!Publi){
      console.log("Publicacion not found");
      return res.status(404).json({ message: "Publicacion not found" });
    }
    if (!((User.role == 3) || (Publi.usuario._id == User._id))){
      console.log("No es el creador de la publicacion ni administrador");
      res.status(401).json({message: "No posee permisos para borrar la publicacion"})
    }
    //es el creador de la publicacion
    await Publi.deleteOne();
    console.log("Publicacion successfully deleted");
    res.status(200).json({ message: "Publicacion successfully deleted" });
    } catch (err) {
      console.error("An error occurred", err);
      res.status(500).json({ message: "An error occurred", error: err.message });
    }
      //if (true) {}    //chekear si la solicitud va deesde un administrador o hace otra tura de acceso separada
};



//Direcciones 
router.route("/crearPublicacion").post(userAuth, crearPublicacion);
//router.route("/getPublicaciones").get(userAuth, getPublicaciones);
router.route("/getPublicaciones").get( getPublicaciones);
router.route("/borrarPublicacion").delete(userAuth, borrarPublicacion);

module.exports = router