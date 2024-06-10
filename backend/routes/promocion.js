const express = require("express");
const { adminAuth, workerAuth, userAuth } = require("../middleware/auth");
const { DataArticulo, DataTrueque } = require("../model/Schema");

const router = express.Router();

const upload = require("../imagenes/imagen.js");
const multer = require("multer");

const getPromociones = async (req, res, next) => {
    await DataPromocion.find(
        { aprobado: true, duracion: true },
        "-aprobado -duracion"
    )
        .then((Promociones) => {
            //console.log(Articulos);
            res.status(200).json(Promociones);
        })
        .catch((err) => {
            res
                .status(401)
                .json({ message: "Error obteniendo promociones", error: err.message });
        });
};

const crearPromocion = async (req, res, next) => {
    const Promocion = JSON.parse(req.body.Promocion);


    if (!Promocion) {
        console.log("Variable 'Promocion no recibida ");
        return res.status(401).json({ message: "Consulta erronea, falta objeto", status: 402 });
    }
    if (!Promocion.titulo || !Promocion.texto || !Promocion.fecha || !Promocion.duracion) {
        console.log("Variable no recibida");
        return res.status(401).json({ message: "Consulta erronea, faltan parametros", status: 403 });
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

    await DataPromocion.create({
        titulo: Promocion.titulo,
        texto: Promocion.texto,
        fecha: Promocion.fecha,
        duracion: Promocion.duracion,
        foto_promocion: filename,
    })
        .then((Promocion) => {
            res.status(200).json(Articulo);
        })
        .catch((err) => {
            res.status(401).json({
                message: "Error en la creacion de la promocion",
                error: err.message,
            });
        });
};

//Direcciones
router.route("/getPromociones").get(getPromociones);
router.route("/crearArticulo").post(/*upload.any("Imagen"),*/userAuth, crearPromocion);
module.exports = router;
