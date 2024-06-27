const express = require("express");
const { adminAuth, workerAuth, userAuth } = require("../middleware/auth");
const { DataPublicidad } = require("../model/Schema");

const router = express.Router();

const upload = require("../imagenes/imagen.js");
const multer = require("multer");

const getPromociones = async (req, res, next) => {
    await DataPublicidad.find(
        { aprobado: true },
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

const getPromocionesPendientes = async (req, res, next) =>  {
    await DataPublicidad.find(
        { aprobado: false },
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

    console.log("bbbbbbbbbbbbbb -> ", req.body)

    const Promocion = JSON.parse(req.body.Promocion);

    console.log("promo --> ", Promocion)

    //comprueba si subio foto, si no lo havce le asigna la defecto
    let File;
    if (!req.file) {
        File = { filename: "Imagen_sucursal_default.jpg" };
    } else { File = req.file };
    console.log({ "File": File });

    if (!Promocion) {
        console.log("Variable 'Promocion no recibida ");
        return res.status(401).json({ message: "Consulta erronea, falta objeto", status: 402 });
    }
    if (!Promocion.titulo || !Promocion.fecha || !Promocion.duracion) {
        console.log("Variable no recibida");
        return res.status(401).json({ message: "Consulta erronea, faltan parametros", status: 403 });
    }



    await DataPublicidadd.create({
        titulo: Promocion.titulo,
        texto: Promocion.texto,
        fecha: Promocion.fecha,
        duracion: Promocion.duracion,
        foto_promocion: File.filename,
        aprobado: Promocion.aprobado
    })
        .then((Promocion) => {
            res.status(200).json(Promocion);
        })
        .catch((err) => {
            res.status(401).json({
                message: "Error en la creacion de la promocion",
                error: err.message,
            });
        });
};

const eliminarPromocion = async (req, res, next) => {
    const body = req.body;
    const User = body.Auth;
    const Promocion = body.Promocion;
    console.log("aaaaaaaaaaaaaaaaaaaaa")

    if (!Promocion) {
        console.log("Objeto 'Sucursal' en 'body' no recibido");
        return res.status(401).json({
            message: "Objeto 'Sucursal' en 'body' no recibido",
            status: 402,
        });
    }

    if (!Promocion._id) {
        console.log("'id' no recibido");
        return res
            .status(401)
            .json({ message: "Objeto 'id' en 'Sucursal' no recibido", status: 403 });
    }

    try {
        const Publi = await DataPublicidad.findById(Promocion._id);
        if (!Publi) {
            console.log("Sucursal not found");
            return res
                .status(404)
                .json({ message: "Sucursal not found", status: 404 });
        }
        if (!(User.rol >= 2)) {

            return res.status(401).json({
                message: "No posee permisos para borrar el articulo",
                status: 405,
            });
        }
        //es el creador del articulo
        await Publi.deleteOne().then((result) => {
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

const aceptarPromocion = async (req, res, next) => {
    const body = req.body;
    if (!body.Promocion) {
        return res.status(400).json({ message: "No se recibio el objeto 'Trueque'", status: 401 });
    }
    if (!body.Promocion._id) {
        return res.status(400).json({ message: "No se recibio el objeto '_id' en 'Trueque'", status: 402 });
    }
    if (body.Promocion.aprobado == null) {
        return res.status(400).json({ message: "No se recibio el objeto 'trueque_aceptado' en 'Trueque'", status: 406 });
    }
    body.Promocion.aprobado = JSON.parse(body.Promocion.aprobado);

    await DataPublicidad.findById(body.Promocion._id).then((Promocion) => {
        console.log(Promocion);
        if (!Promocion) {
            return res.status(400).json({ message: "No se encontro el trueque conb el '_id' recibido", status: 404 });
        }
        if (Promocion.aprobado) {
            return res.status(400).json({ message: "Este trueque ya fue aceptado", status: 405 });
        }

        if (body.Promocion.aprobado) {

            DataPublicidad.findByIdAndUpdate(Promocion._id, { aprobado: true }).then(() => {
                return res.status(200).json({ message: "Trueque correctamente aceptado", status: 200 });
            }).catch((error) => {
                return res.status(400).json({ message: "Error aceptando trueque", error, status: 400 });
            })

        }


    }).catch((error) => {
        return res.status(400).json({ message: "Error obteniendo trueque", error, status: 400 });
    });
};



//Direcciones
router.route("/getPromociones").get(getPromociones);
router.route("/getPromocionesPendientes").get(getPromocionesPendientes);
router.route("/crearPromocion").post(upload.single("Imagen"), userAuth, crearPromocion);
router.route("/eliminarPromocion").delete(workerAuth, eliminarPromocion);
router.route("/aceptarPromocion").post(adminAuth, aceptarPromocion);
module.exports = router;
