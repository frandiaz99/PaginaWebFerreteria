const express = require("express")
const multer = require("multer");
const {v4 : uuidv4 } = require("uuid");
const {adminAuth, workerAuth, userAuth} = require ("../middleware/auth");
const {DataArticulo} = require ("../model/Schema");
const path = require ("path")

const router = express.Router();


const storage = multer.diskStorage({destination: (req, file, cb) =>{
  cb(null, "imagenes/img");
},
filename: (req, file, cb) => {
  //cb(null, uuidv4() + "-" + Date.now() + path.extname(file.originalname));
  cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname));
}
});
/*
const fileFilter = (req, file, cb) => {
  const allowedFileTypes = ["image/jpeg", "image/jpg", "image/png"];
  if(allowedFileTypes.includes(file.mimetype)){
    cb(null, true);
  } else {
    cb(null, true);
  }
}*/


const upload = multer({storage: storage});
module.exports = upload;

/*
exports.subirFoto = (req, res, next) => {
  const  img = req("Imagen");
  console.log(img);
  if (img) {
    console.log("Se recibio una imagen, subirla")
    //agregar url de la imagen subida al req
    req.body.User= {"img": "Url de la imagen"};
  }
  console.log("Se sale de subir una imagen")
  next();
};*/





/*
router.route("/upload").post(upload.single(), (req, res, next) => {
  console.log(res);
});

*/
//module.exports = router;