const express = require("express");
const mongoose = require("mongoose");
const { adminAuth, workerAuth, userAuth } = require("../middleware/auth");
const { DataArticulo, DataTrueque, DataUser, DataValoracion } = require("../model/Schema");
const { MandarMail } = require("./mail.js");
const { CalcularPuntos } = require("./producto.js");
const { error } = require("console");
const { parse } = require("path");
const { parseArgs } = require("util");
const { NuevaNotificacion } = require("./notificacion.js");
const router = express.Router();


const getUltimosTrueques = async (req, res, next) => {
  try {
    let Trueque = await DataTrueque.find({ venta_confirmada: true }).sort({ fecha_venta: -1 }).limit(5);
    Trueque = await Trueque.map((T) => ({ articulo_compra: { imagen_articulo: T.articulo_compra.foto_articulo[0], imagen_usuario: T.articulo_compra.usuario.foto_perfil }, articulo_publica: { imagen_articulo: T.articulo_publica.foto_articulo[0], imagen_usuario: T.articulo_publica.usuario.foto_perfil }, fecha: T.fecha_venta }))
    return res.status(200).json({ message: "OK", status: 200, Trueque });

  } catch (error) {
    return res.status(400).json({ message: "Error probable de la DB/server", status: 401, error: error.message });
  }

}



const getTruequesPendientes = async (req, res, next) => {
  await DataTrueque.find({ venta_confirmada: false, venta_cerrada: false}).then((data) => {
    //console.log(data);
    if (data[0]) {
      console.log("articulos obtenidos");
      return res.status(200).json({ message: "Succesfully", data, status: 200 });
    } else {
      console.log("no tiene articulos");
      return res.status(400).json({ message: "No hay trueques pendientes", status: 401 });
    }
  }).catch((error) => {
    return res.status(400).json({ message: "Error obteniendo trueques pendientes", status: 400 });
  });
}

const getTruequesCompletados = async (req, res, next) => {
  await DataTrueque.find({ venta_confirmada: true }).then((data) => {
    //console.log(data);
    if (data[0]) {
      console.log("articulos obtenidos");
      return res.status(200).json({ message: "Succesfully", data, status: 200 });
    } else {
      console.log("no tiene articulos");
      return res.status(400).json({ message: "No hay trueques completados", status: 401 });
    }
  }).catch((error) => {
    return res.status(400).json({ message: "Error obteniendo trueques completados", status: 400 });
  });
}



const responderOferta = async (req, res, next) => {
  const body = req.body;
  if (!body.Trueque) {
    return res.status(400).json({ message: "No se recibio el objeto 'Trueque'", status: 401 });
  }
  if (!body.Trueque._id) {
    return res.status(400).json({ message: "No se recibio el objeto '_id' en 'Trueque'", status: 402 });
  }
  if (body.Trueque.trueque_aceptado == null) {
    return res.status(400).json({ message: "No se recibio el objeto 'trueque_aceptado' en 'Trueque'", status: 406 });
  }
  body.Trueque.trueque_aceptado = JSON.parse(body.Trueque.trueque_aceptado);

  await DataTrueque.findById(body.Trueque._id).then((Trueque) => {
    console.log(Trueque);
    if (!Trueque) {
      return res.status(400).json({ message: "No se encontro el trueque conb el '_id' recibido", status: 404 });
    }
    if (Trueque.articulo_publica.usuario._id != body.Auth._id) {
      console.log("No es el creador del articulo");
      return res.status(400).json({ message: "No es el creador del articulo del trueque", status: 403 });
    }
    if (Trueque.trueque_aceptado) {
      return res.status(400).json({ message: "Este trueque ya fue aceptado", status: 405 });
    }
    const hol = false;
    console.log(body.Trueque.trueque_aceptado, hol)
    if (body.Trueque.trueque_aceptado) {
      //console.log("CREAR NOTIFICACION Y AVISAR AL SEGUNDO USUARIO QUE SE ACEPTO LA OFERTA");
      DataTrueque.findByIdAndUpdate(Trueque._id, { trueque_aceptado: true }).then(() => {
        NuevaNotificacion(Trueque.articulo_compra.usuario._id, 1, Trueque._id);
        return res.status(200).json({ message: "Trueque correctamente aceptado", status: 200 });
      }).catch((error) => {
        return res.status(400).json({ message: "Error aceptando trueque", error, status: 400 });
      })
      
    } else {
      console.log("borrando trueque");
      //console.log("CREAR NOTIFICACION Y AVISAR AL SEGUNDO USUARIO QUE SE RECHAZO LA OFERTA");
      DataTrueque.findOneAndDelete({ _id: Trueque._id }).then(() => {
        NuevaNotificacion(Trueque.articulo_compra.usuario._id, 2, Trueque._id);
        return res.status(200).json({ message: "Trueque correctamente borrado", status: 200 });
      }).catch((error) => {
        return res.status(400).json({ message: "Error borrando trueque", error, status: 400 });
      })
    }

  }).catch((error) => {
    return res.status(400).json({ message: "Error obteniendo trueque", error, status: 400 });
  });
}


const cancelarTrueque = async (req, res, next) => {
  const body = req.body;
  const User = body.Auth;
  const Trueque = body.Trueque;

  if (!Trueque) {
    console.log("Objeto 'Articulo' en 'body' no recibido");
    return res.status(401).json({
      message: "Objeto 'Trueque' en 'body' no recibido",
      status: 402,
    });
  }

  if (!Trueque._id) {
    console.log("'id' no recibido");
    return res
      .status(401)
      .json({ message: "Objeto 'id' en 'Truqeu' no recibido", status: 403 });
  }

  try {
    const Publi = await DataTrueque.findById(Trueque._id);
    if (!Publi) {
      console.log("Trueque not found");
      return res
        .status(404)
        .json({ message: "Trueque not found", status: 404 });
    }

    //  if (!(User.rol >= 2)) {
    //      console.log("No es empleado ni administrador");

    if (!((Publi.articulo_compra.usuario._id == User._id) || (Publi.articulo_publica.usuario._id == User._id))) {
      console.log("Tampoco es un usuario que participa en el trueque");
      return res.status(401).json({
        message: "No posee permisos para borrar el Trueque",
        status: 405,
      });
    }
    //}

    if (Publi.fecha_venta) {
      var today = new Date();
      var tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1)

      console.log("fecha trueque", Publi.fecha_venta, "fecha dentro de un dia", tomorrow)
      if (Publi.fecha_venta < tomorrow) {
        console.log("Este trueque tiene fecha para dentro de menos de un dia")
        return res.status(401).json({ message: "No se puede cancelar un trueque con fecha establecida paradentro de menos de 24Hs", status: 408 });
      }
    }



    if (Publi.venta_confirmada) {
      console.log("Este trueque ya fue efectivizado, no se puede cancelar ya")
      return res.status(401).json({ message: "El trueque ya fue efectivizado", status: 407 });
    }
    if (Publi.venta_cerrada) {
      console.log("Este trueque ya fue cancelado, no se puede cancelar ya")
      return res.status(401).json({ message: "El trueque ya fue cancelado", status: 407 });
    }


    MandarMail(Publi.articulo_publica.usuario.email, 2, `El trueque de ${Publi.articulo_publica.nombre} y ${Publi.articulo_compra.nombre}, fue CANCELADO`);
    MandarMail(Publi.articulo_compra.usuario.email, 2, `El trueque de ${Publi.articulo_publica.nombre} y ${Publi.articulo_compra.nombre}, fue CANCELADO`);
    NuevaNotificacion(Trueque.articulo_compra.usuario._id, 3, Trueque._id);
    NuevaNotificacion(Trueque.articulo_publica.usuario._id, 3, Trueque._id);

    DataArticulo.findByIdAndUpdate({ _id: Publi.articulo_compra._id }, { $set: { reservado: false } }).catch((err) => {
      console.log(err);
      return res.status(400).json({ message: "Error obteniendo los datos", status: 400 });
    });
    DataArticulo.findByIdAndUpdate({ _id: Publi.articulo_publica._id }, { $set: { reservado: false } }).catch((err) => {
      console.log(err);
      return res.status(400).json({ message: "Error obteniendo los datos", status: 400 });
    });


    await Publi.deleteOne().then((result) => {
      if (result) {
        console.log("Trueque successfully deleted");
        return res
          .status(200)
          .json({ message: "Trueque successfully deleted", status: 200 });
      } else {
        console.log("Erro borrando Trueque");
        return res
          .status(400)
          .json({ message: "Error borrando Trueque", status: 406 });
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
  //407 el trueque ya fue efectivizado
};


const setFecha = async (req, res, next) => {  
  const { Auth, Trueque } = req.body;
  console.log(req.body);
  if (!Trueque || !Trueque._id || !Trueque.sucursal || !Trueque.fecha_venta) {
    console.log("");
    return res.status(401).json({ message: "No se recibio el 'Trueque._id', 'Trueque.fecha_venta' o 'Trueque.sucursal' ", status: 401 })
  }

  DataTrueque.findById(Trueque._id).then((T) => {
    if (!T) {
      return res.status(400).json({ message: "Error, no se encontro el trueque recibido", status: 404 })
    }
    if (!T.trueque_aceptado) {
      return res.status(400).json({ message: "Error, el trueque todavia no fue aceptado por el usuario", status: 402 })
    }
    if (!(T.articulo_compra.usuario._id == Auth._id || T.articulo_publica.usuario._id == Auth._id)) {
      return res.status(400).json({ message: "Error, no es usuario participante del trueque", status: 403 })
    }
    if (T.fecha_venta || T.sucursal) {
      return res.status(400).json({ message: "Este trueque ya tiene una sucursal y fecha establecido", status: 405 })
    }

    const fecha = new Date(Trueque.fecha_venta);
    //console.log(Trueque.fecha_venta, "  ", fecha, "  ", Date.now(), "  ", (fecha < Date.now()));
    if (fecha < Date.now()) {
      return res.status(400).json({ message: "Error, la fecha recibida ya paso", status: 406 })
    }

    DataTrueque.findByIdAndUpdate(Trueque._id, { sucursal: Trueque.sucursal, fecha_venta: Trueque.fecha_venta }, { new: true }).then((newTrueque) => {
      //console.log(`El trueque de ${newTrueque.articulo_publica.nombre} y ${newTrueque.articulo_compra.nombre}, se establecio para el dia ${newTrueque.fecha_venta} en la sucursal ${newTrueque.sucursal.nombre}`);
      
      if (T.articulo_compra.usuario._id == Auth._id){
        MandarMail(newTrueque.articulo_publica.usuario.email, 2, `El trueque de ${newTrueque.articulo_publica.nombre} y ${newTrueque.articulo_compra.nombre}, se establecio para el dia ${newTrueque.fecha_venta} en la sucursal ${newTrueque.sucursal.nombre}`);
        NuevaNotificacion(T.articulo_publica.usuario._id, 4, T._id);

      } else {
        MandarMail(newTrueque.articulo_compra.usuario.email, 2, `El trueque de ${newTrueque.articulo_publica.nombre} y ${newTrueque.articulo_compra.nombre}, se establecio para el dia ${newTrueque.fecha_venta} en la sucursal ${newTrueque.sucursal.nombre}`);
        NuevaNotificacion(T.articulo_compra.usuario._id, 4, T._id);
      }

      return res.status(200).json({ message: "La fecha y la sucursal se establecio correctamente", status: 200 })
    }).catch((error) => {
      console.log(error);
      return res.status(400).json({ message: "Error de conexion del server", status: 400 })
    })

  }).catch((error) => {
    console.log(error);
    return res.status(400).json({ message: "Error de conexion del server", status: 400 })
  })

};


const efectivizarTrueque = async (req, res, next) => {
  const body = req.body;
  const User = body.Auth;
  const Trueque = body.Trueque;
  const Ventas = body.Ventas;
  let Efectivizar = body.Efectivizar;


  //console.log("body ->", req.body)
  console.log("Ventas ->", req.body.Ventas)

  /*
  if (User.rol == 1){
    return res.status(401).json({ message: "No posee permisos", status: 401 });
  }*/

  if (!Trueque || !Trueque._id) {
    console.log("No se recibio el objeto 'Trueque' y/o '_id'")
    return res.status(401).json({ message: "No se recibio el objeto 'trueque' con '_id'", status: 402 });
  }



  DataTrueque.findById(Trueque._id).then(async (T) => {
    //console.log(T.fecha_venta, Date.now());
    if (!T) {
      console.log("No se encontro el trueque recibido")
      return res.status(401).json({ message: "No se encontro el trueque", status: 404 });
    }
    if (T.venta_confirmada || T.venta_cerrada) {
      console.log("El trueque recibido ya fue finalizado")
      return res.status(401).json({ message: "El trueque recibido ya fue finalizado", status: 403 });
    }
    //console.log("USer", User, " sucursal", User.sucursal)
    if (User.rol == 2 && T.sucursal._id != User.sucursal._id) {
      console.log("El trueque esta establecido para otra sucursal diferente ")
      return res.status(401).json({ message: "El trueque esta establecido para otra sucursal distinta", status: 406 });
    }
    //if (T.fecha_venta > Date.now()){
    /*
  if (!T.fecha_venta || T.fecha_venta > Date.now()){
    console.log("Todavia falta para la fecha acordada para el trueque")
    return res.status(401).json({ message: "Falta para la fecha del intercambio", status: 405 });
  }*/

    var puntos_compra = 0;
    var puntos_publica = 0;

    var prod_publica;
    try {
      prod_publica = await CalcularPuntos(T.articulo_publica.usuario.dni, Ventas);
      console.log("prodPublica: ", prod_publica);
      if (prod_publica.Status != 200) {
        return res.status(400).json({ message: "Error buscando codigo", status: prod_publica.Status, respuesta: prod_publica.Mensaje });
      } else {
        puntos_publica += prod_publica.Puntos;
      }
    } catch (error) {
      console.error("An error occurred:", error);
      return res.status(400).json({ message: "Error probable DB", status: 400 });
    }


    var prod_compra;
    try {
      prod_compra = await CalcularPuntos(T.articulo_compra.usuario.dni, Ventas);
      console.log("prodCompra: ", prod_compra);

      if (prod_compra.Status != 200) {
        return res.status(400).json({ message: "Error buscando codigo", status: prod_compra.Status, respuesta: prod_compra.Mensaje });
      } else {
        puntos_compra += prod_compra.Puntos;
      }
    } catch (error) {
      console.error("An error occurred:", error);
      return res.status(400).json({ message: "Error probable DB", status: 400 });
    }
    


    var tipo_operacion;
    if (!Efectivizar) {
      tipo_operacion = "CANCELADO"
      console.log("Canceladdddooo-------------------------------      ---------------------")

    } else {
      tipo_operacion = "EFECTIVIZADO"

      puntos_compra += T.articulo_compra.precio * 10;
      puntos_publica += T.articulo_publica.precio * 10;


    }

    MandarMail(T.articulo_compra.usuario.email, 2, `El trueque entre el articulo ${T.articulo_compra.nombre} y el articulo ${T.articulo_publica.nombre} se a ${tipo_operacion} con exito y se te a sumado un total de ${puntos_compra} puntos`);
    MandarMail(T.articulo_publica.usuario.email, 2, `El trueque entre el articulo ${T.articulo_compra.nombre} y el articulo ${T.articulo_publica.nombre} se a ${tipo_operacion} con exito y se te a sumado un total de ${puntos_publica} puntos`);

    DataUser.findByIdAndUpdate({ _id: T.articulo_compra.usuario._id }, { $inc: { puntos: puntos_compra } }).catch((err) => {
      console.log(err);
      return res.status(400).json({ message: "Error obteniendo los datos", status: 400 });
    });
    DataArticulo.findByIdAndUpdate({ _id: T.articulo_compra._id }, { $set: { vendido: Efectivizar, reservado: Efectivizar } }).catch((err) => {
      console.log(err);
      return res.status(400).json({ message: "Error obteniendo los datos", status: 400 });
    });

    DataUser.findByIdAndUpdate({ _id: T.articulo_publica.usuario._id }, { $inc: { puntos: puntos_publica }, $set: { vendido: Efectivizar, reservado: Efectivizar } }).catch((err) => {
      console.log(err);
      return res.status(400).json({ message: "Error obteniendo los datos", status: 400 });
    });
    DataArticulo.findByIdAndUpdate({ _id: T.articulo_publica._id }, { $set: { vendido: Efectivizar, reservado: Efectivizar } }).catch((err) => {
      console.log(err);
      return res.status(400).json({ message: "Error obteniendo los datos", status: 400 });
    });

    DataTrueque.findByIdAndUpdate({ _id: T._id }, ({ venta_confirmada: Efectivizar, venta_cerrada: !Efectivizar, fecha_venta: Date.now(), empleado_cierra: User._id, producto_compra: prod_compra.Mensaje, producto_publica: prod_publica.Mensaje })).then().catch((err) => {
      console.log(err);
      return res.status(400).json({ message: "Error obteniendo los datos", status: 400 });
    })


    return res.status(200).json({ message: "OK", status: 200 });

  }).catch((err) => {
    console.log(err);
    return res.status(400).json({ message: "Error obteniendo los datos", status: 400 });
  });

};


const valorarTrueque = async (req, res, next) => {
  const User = req.body.Auth;
  var Trueque = req.body.Trueque;
  var Valoracion = req.body.Valoracion;


  if (!Trueque || !Trueque._id) {
    return res.status(400).json({ message: "Falta la variable 'Trueque._id' ", status: 401 });
  }

  if (!Valoracion || !Valoracion.opinion || !Valoracion.valoracion) {
    return res.status(400).json({ message: "Falta la variable 'Valoracion.opinion' o 'Valoracion.valoracion'", status: 402 });
  }
  if (Valoracion.valoracion < 1 || Valoracion.valoracion > 5) {
    return res.status(400).json({ message: "El valor de valoracion debe encontrarse entre 1 y 5 inclusive", status: 407 });
  }

  try {
    const T = await DataTrueque.findById(Trueque._id)
    if (!T) {
      return res.status(400).json({ message: "Error Articulo no encontrado", status: 404 });
    }
    Trueque = T
  } catch {
    return res.status(400).json({ message: "Error Probable del server / DB", status: 400 });
  }

  if (!Trueque.venta_confirmada) {
    return res.status(400).json({ message: "El trueque todavia no fue finalizado", status: 403 });
  }


  let publica;
  if (Trueque.articulo_publica.usuario._id == User._id) {
    publica = true;
  } else if (Trueque.articulo_compra.usuario._id == User._id) {
    publica = false;
  } else {
    return res.status(400).json({ message: "Usuario no autorizado para opinar en este articulo", status: 405 });
  }

  console.log("valor", publica)

  if (publica && Trueque.valoracion_publica) {
    return res.status(400).json({ message: "Este usuario ya realizo su opinion de este trueque ahora si", status: 406 });
  } else if (!publica && Trueque.valoracion_compra) {
    return res.status(400).json({ message: "Este usuario ya realizo su opinion de este trueque", status: 406 });
  }

  var idOtro;
  if (publica) {
    idOtro = Trueque.articulo_compra.usuario._id;
  } else { idOtro = Trueque.articulo_publica.usuario._id; }


  await DataValoracion.create({ opinion: Valoracion.opinion, valoracion: Valoracion.valoracion, sobre_usuario: idOtro, de_usuario: User._id }).then((V) => {
    V.valoracion = parseInt(V.valoracion);
    Valoracion = V;
  }).catch(error => {
    return res.status(400).json({ message: "Error Probable del server / DB", status: 400 });
  })

  if (publica) {
    await DataTrueque.findByIdAndUpdate(Trueque._id, { valoracion_publica: Valoracion }).then(T => {
      Trueque = T;
    }).catch(error => {
      return res.status(400).json({ message: "Error Probable del server / DB", status: 400 });
    })
  } else {
    await DataTrueque.findByIdAndUpdate(Trueque._id, { valoracion_compra: Valoracion }).then(T => {
      Trueque = T;
    }).catch(error => {
      return res.status(400).json({ message: "Error Probable del server / DB", status: 400 });
    })
  }
  /*
try {
  
  DataValoracion.find({sobre_usuario: idOtro})

  const result = await DataUser.findOneAndUpdate({ _id: User._id },
     [{ $set: {valoracion: { $divide: [{ $add: ["$valoracion", Valoracion.valoracion] }, 2] }}}], { new: true }
  );
  res.status(200).json({message: "OK", status: 200});
  
} catch (error) {
  console.log(error)
  return res.status(400).json({message: "Error Probable del server / DB", status: 400});
}*/



  try {
    const result = await DataValoracion.aggregate([
      { $match: { sobre_usuario: idOtro } },
      { $group: { _id: null, totalValoracion: { $sum: '$valoracion' }, count: { $sum: 1 } } },
      { $project: { _id: 0, averageValoracion: { $divide: ['$totalValoracion', '$count'] } } }
    ]);

    if (result.length > 0) {
      await DataUser.findOneAndUpdate({ _id: idOtro}, { $set: { valoracion: result[0].averageValoracion } });
      res.status(200).json({ message: "OK", status: 200 });
    } else {
      console.log(result)
      res.status(400).json({ message: "Erro geting valoracion", status: 400 });
    }
  } catch (error) {
    console.error("An error occurred:", error);
    return res.status(400).json({ message: "Error Probable del server / DB", status: 400 });
  }

}


router.route("/getUltimosTrueques").get(getUltimosTrueques);

router.route("/getPendientes").get(userAuth, getTruequesPendientes);
router.route("/getCompletados").get(userAuth, getTruequesCompletados);
router.route("/responderOferta").post(userAuth, responderOferta);
router.route("/cancelarTrueque").delete(userAuth, cancelarTrueque)
router.route("/setFecha").post(userAuth, setFecha)
router.route("/valorarTrueque").post(userAuth, valorarTrueque)

router.route("/efectivizarTrueque").post(workerAuth, efectivizarTrueque);


module.exports = router;
