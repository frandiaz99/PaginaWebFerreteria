const mongodb = require("mongodb");

const autopopulate = require("mongoose-autopopulate");

const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const { type } = require("os");

const userSchema = mongoose.Schema({
  nombre: { type: String, required: true },
  apellido: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  dni: { type: Number, required: true, unique: true },
  rawPassword: { type: String, required: true, minlength: 6 },
  password: { type: String, required: true },
  fecha_nacimiento: { type: Date },
  sucursal: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Sucursal",
    autopopulate: true,
  },
  suscripto: { type: Boolean, default: false },
  foto_perfil: { type: String, required: true },
  rol: { type: Number, required: true, default: 1 }, //1 User, 2 Worker, 3 Admin
  puntos: { type: Number, default: 0, required: true },
  intento_desbloqueo: { type: Number, default: 0 },
  code: { type: Number, default: 0 },
  valoracion: { type: Number, default: 0 },
  notificaciones: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Notificacion",
    autopopulate: true,
  },
  //nombre y apellido, sucursal, fecha nacimiento
  //articulos: {type: [mongoose.Schema.Types.ObjectId], ref: "Articulo", autopopulate: true},

  //articulos [(FK)],  trueques [(FK)], Valoracion[(FK)]
  //foto perfil
  //sucursal
});

const sucursalSchema = mongoose.Schema({
  nombre: { required: true, type: String, unique: true },
  provincia: { type: String, required: true },
  ciudad: { type: String, required: true },
  direccion: { type: String, required: true },
  telefono: { type: String, required: true },
  foto: { type: String, required: true },

  //Empleados[(FK)], direccion: String(link maps), Trueques[(FK)]
});

const empleadoSchema = mongoose.Schema({
  user: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "User",
    autopopulate: true,
  },

  //Usuario(FK), Trueques_Cerrados [(FK): Trueques], VentasProductos [(FK): Ventas]
  trabaja: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Sucursal",
    autopopulate: true,
  },
});

const articuloSchema = mongoose.Schema({
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    autopopulate: true,
  },
  nombre: { type: String, required: true },
  descripcion: { type: String, required: true },
  interesado: { type: String, required: true },
  foto_articulo: { type: [String] },
  fecha: { type: Date }, //debe recibir JS date (yyyy-mm-dd) es decir (2024-12-31) se le puede poner hora tambien
  precio: { type: Number, default: 0 },
  vendido: { type: Boolean, default: false }, //en true cuando se relizo la vent
  promocionado: {type: mongoose.Schema.Types.ObjectId, ref: "Promocionado", autopopulate: true,},
  borrado: { type: Boolean, default: false },
  reservado: { type: Boolean, default: false },
  //User (fk),    Cuando se arregla un trueque pasaria a estado de pendiente para que no se muestre
});

const truequeSchema = mongoose.Schema({
  fecha_venta: { type: Date },
  venta_confirmada: { type: Boolean, default: false },
  venta_cerrada: { type: Boolean, default: false },

  //user_publica: {type: mongoose.Schema.Types.ObjectId, ref: "User", autopopulate: true, required: true},
  //user_compra: {type: mongoose.Schema.Types.ObjectId, ref: "User", autopopulate: true},
  articulo_publica: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Articulo",
    autopopulate: true,
    required: true,
  },
  articulo_compra: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Articulo",
    autopopulate: true,
    required: true,
  },

  empleado_cierra: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Empleado",
    autopopulate: true,
  },
  sucursal: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Sucursal",
    autopopulate: true,
  },

  valoracion_publica: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Valoracion",
    autopopulate: true,
  },
  valoracion_compra: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Valoracion",
    autopopulate: true,
  },

  producto_compra: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Venta",
    autopopulate: true,
  },

  producto_publica: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Venta",
    autopopulate: true,
  },

  //User_Publica(FK):Usuario, User_Compra(FK)?:Usuario, Empleado_Cierra(FK)?:Empleado, Sucursal (FK)?, Articulo(FK), Opinion_Publica(FK)?, Opinion_Compra(FK)?
  trueque_aceptado: { type: Boolean, default: false }, //
  // dia
});

const publicidadSchema = mongoose.Schema({
  titulo: { type: String, required: true },
  texto: { type: String },
  aprobado: { type: Boolean, default: false },
  fecha: { type: Date, required: true },
  duracion: { type: Number, required: true },
  foto_promocion: { type: String, required: true },
});

const promocionadoSchema = mongoose.Schema({
  aprobado: { type: Boolean, default: false },
  fecha: { type: Date, required: true },
  duracion: { type: Number, required: true },
  articulo: { type: mongoose.Schema.Types.ObjectId, ref: "Articulo", required: true },
});

const ventaSchema = mongoose.Schema({
  producto: { type: mongoose.Schema.Types.ObjectId, ref: "Producto", autopopulate: true, required: true },
  cantidad: { required: true, type: Number },
  //Empleado(FK), Usuario(FK), Trueques(FK)?
});

const productoSchema = mongoose.Schema({
  codigo: { required: true, type: Number, default: 99 },
  nombre: { required: true, type: String, },
  precio: { required: true, type: Number, },
});

const valoracionSchema = mongoose.Schema({
  //nombre: { type: String, required: false, default: "Anonimo" },
  opinion: { type: String, required: true },
  valoracion: { type: Number, required: true },
  sobre_usuario: { type: mongoose.Schema.Types.ObjectId, ref: "User", autopopulate: true, },
  de_usuario: { type: mongoose.Schema.Types.ObjectId, ref: "User", autopopulate: true, },
  //Trueques(FK), Usuario(FK)
  //El Nombre_Usuario seria el nombre del que opina, no guardo su id xq me parece alp2 y no tiene por que. Se podria poner hasta que el que opina elija el nombre con el que aparecece
});

const notificacionSchema = mongoose.Schema({
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  objeto: { type: mongoose.Schema.Types.ObjectId },
  tipo: { type: Number, required: true },
  visto: { type: Boolean, default: false },
  texto: {type: String, required: true}
});
//notificacion

//UNIQUE VALIDAATOR

userSchema.plugin(uniqueValidator);

//MONGOOSE AUTO-POPULATE
userSchema.plugin(autopopulate);
empleadoSchema.plugin(autopopulate);
sucursalSchema.plugin(autopopulate);
truequeSchema.plugin(autopopulate);
articuloSchema.plugin(autopopulate);
publicidadSchema.plugin(autopopulate);
ventaSchema.plugin(autopopulate);
productoSchema.plugin(autopopulate);
valoracionSchema.plugin(autopopulate);
notificacionSchema.plugin(autopopulate);

//EXPORTING MODELS

const DataUser = mongoose.model("User", userSchema);
const DataEmpleado = mongoose.model("Empleado", empleadoSchema);
const DataSucursal = mongoose.model("Sucursal", sucursalSchema);
const DataTrueque = mongoose.model("Trueque", truequeSchema);
const DataArticulo = mongoose.model("Articulo", articuloSchema);
const DataPublicidad = mongoose.model("Publicidad", publicidadSchema);
const DataPromocionado = mongoose.model("Promocionado", promocionadoSchema);
const DataVenta = mongoose.model("Venta", ventaSchema);
const DataProducto = mongoose.model("Producto", productoSchema);
const DataValoracion = mongoose.model("Valoracion", valoracionSchema);
const DataNotificacion = mongoose.model("Notificacion", notificacionSchema);

module.exports = {
  DataEmpleado,
  DataPublicidad,
  DataPromocionado,
  DataArticulo,
  DataSucursal,
  DataTrueque,
  DataUser,
  DataValoracion,
  DataVenta,
  DataProducto,
  DataNotificacion,
};
