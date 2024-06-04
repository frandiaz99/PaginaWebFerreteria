const { DataUser, DataNotificacion, DataSucursal, DataProducto, DataVenta } = require("../model/Schema.js");
const { adminAuth, workerAuth, userAuth } = require("../middleware/auth.js");

const upload = require("../imagenes/imagen.js");
const multer = require("multer");


//
const express = require("express");
const router = express.Router();
//

const CalcularPuntos = async (dni, Ventas) => {
  let aux = 1;
  console.log("en CalcularPuntos seria mejor recibir solo el V.dni")
  Ventas = Ventas.filter(V => V.usuario.dni == dni);

  var codigos = Ventas.map(V => V.codigo);
  codigos = [...new Set(codigos)];

  let Productos;

  try {
    const P = await DataProducto.find({ codigo: codigos });
    if (P.length !== codigos.length) {
      const difference = await codigos.filter(value => !P.map(p => p.codigo).includes(value));
      console.log(difference);
      return { Monto: "", Status: 400, Mensaje: difference };
    } else {
      Productos = P;

      var temp = Ventas.map(V => {
        let P = Productos.find(P => P.codigo == V.codigo);
        return { codigo: V.codigo, precio: P.precio, cantidad: parseInt(V.cantidad), _id: P._id };
      });

      var Monto = temp.map(T => T.precio * T.cantidad).reduce((prev, act) => prev + act, 0);

      let venta = [];

      for (let i = 0; i < temp.length; i++) {
        let S = await DataVenta.create({ producto: temp[i]._id, cantidad: temp[i].cantidad });
        venta.push(S);
      }

      const Puntos = Math.floor(Monto / 1000);
      return { Monto, Puntos, Mensaje: venta, Status: 200 };
    }
  } catch (err) {
    console.error("Error:", err);
    return { Monto: "", Status: 400, Mensaje: "" };
  }
};


const RegistrarProducto = async (req, res, next) =>{
  const Producto = req.body.Producto;
  if (!Producto || !Producto.nombre || !Producto.precio){
    return res.status(400).json({message: "No se recibio Producto, Producto.codigo, Producto.nombre o Producto.precio"})
  }
  DataProducto.create({nombre: Producto.nombre, precio: Producto.precio}).then((P) =>{
    return res.status(200).json({message: "producto creado", P})
  }).catch((err) => {
    return res.status(400).json({message: "Error creando producto", err})
  });
};


router.route("/registrarProducto").post(RegistrarProducto);
//router.route("/calcularPuntos").post(CalcularPuntos);


//module.exports = router;
module.exports = {CalcularPuntos};
