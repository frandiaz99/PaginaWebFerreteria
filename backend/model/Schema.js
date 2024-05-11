const mongodb = require ("mongodb");

const autopopulate = require("mongoose-autopopulate");

const mongoose = require ("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const { type } = require("os");

const userSchema = mongoose.Schema({
  nombre: {type: String, required: true},
  apellido: {type: String, required: true},
  email: {type: String, required: true, unique: true},
  dni: {type: Number, required: true, unique: true},
  rawPassword: { type: String, required: true, minlength: 6},
  password: { type: String, required: true},
  fecha_nacimiento: {type: Date}, 
  sucursal: {type: mongoose.Schema.Types.ObjectId, ref:"Sucursal", autopopulate: true},
  suscripto: {type: Boolean, default: false}, 
  foto_perfil: {type:String, required: true},
  rol: {type: Number, required: true, default: 1},   //1 User, 2 Worker, 3 Admin
  puntos: {type: Number, default: 0},
  intento_desbloqueo: {type: Number, default: 0},
  code: {type: Number, default: 0},
  //nombre y apellido, sucursal, fecha nacimiento
  //articulos: {type: [mongoose.Schema.Types.ObjectId], ref: "Articulo", autopopulate: true},

  //articulos [(FK)],  trueques [(FK)], Valoracion[(FK)]
  //foto perfil 
  //sucursal
});

const sucursalSchema = mongoose.Schema({
  nombre: {required: true, type:String, unique: true},
  provincia: {type: String, required: true},
  ciudad: {type: String, required: true},
  direccion: {type: String, required: true},
  telefono: {type: String, required: true},
  foto: {type: String, required: true},


  //Empleados[(FK)], direccion: String(link maps), Trueques[(FK)]
});

const empleadoSchema = mongoose.Schema({
  user: {type: [mongoose.Schema.Types.ObjectId], ref: "User", autopopulate: true},

  //Usuario(FK), Trueques_Cerrados [(FK): Trueques], VentasProductos [(FK): Ventas]
  trabaja: {type: [mongoose.Schema.Types.ObjectId], ref: "Sucursal", autopopulate: true},
});



const articuloSchema = mongoose.Schema({
  usuario: {type: mongoose.Schema.Types.ObjectId, ref:"User", autopopulate: true},
  nombre: {type: String, required: true},
  descripcion: {type: String, required: true},
  interesado: {type: String, required: true},
  foto_articulo: {type: String},
  fecha: {type: Date},  //debe recibir JS date (yyyy-mm-dd) es decir (2024-12-31) se le puede poner hora tambien
  precio: {type: Number, default: 0},
  vendido: {type: Boolean, default: false}, //en true cuando se relizo la vent
  promocionado: {type: Boolean, default: false},
  borrado: {type: Boolean, default: false},
  
  //User (fk),    Cuando se arregla un trueque pasaria a estado de pendiente para que no se muestre
});



const truequeSchema = mongoose.Schema({
  fecha_venta: {type: Date},
  venta_confirmada: {type: Boolean, default: false},
  
  
  user_publica: {type: mongoose.Schema.Types.ObjectId, ref: "User", autopopulate: true, required: true},
  user_compra: {type: mongoose.Schema.Types.ObjectId, ref: "User", autopopulate: true},
  empleado_cierra: {type: mongoose.Schema.Types.ObjectId, ref: "Empleado", autopopulate: true},
  sucursal: {type: mongoose.Schema.Types.ObjectId, ref: "Sucursal", autopopulate: true},
  
  
  valoracion_publica: {type: [mongoose.Schema.Types.ObjectId], ref: "Valoracion", autopopulate: true},
  valoracion_compra: {type: [mongoose.Schema.Types.ObjectId], ref: "Valoracion", autopopulate: true},
  
  articulo: {type: mongoose.Schema.Types.ObjectId, ref: "Articulo", autopopulate: true},
  
  //User_Publica(FK):Usuario, User_Compra(FK)?:Usuario, Empleado_Cierra(FK)?:Empleado, Sucursal (FK)?, Articulo(FK), Opinion_Publica(FK)?, Opinion_Compra(FK)?
  trueque_aceptado: {type: Boolean, default: false},      //
  // dia


})



const promocionSchema = mongoose.Schema({
  titulo: {type: String, required: true},
  texto: {type: String},
  aprobado: {type: Boolean, default: false},
  fecha: {type: Date, required: true},
  duracion: {type: Number, required: true}
  //Promociones -> Imagen,
});



const ventaSchema = mongoose.Schema({
  codigo_producto: {required: true, type: Number},
  nombre_producto: {required: true, type: String},
  precio_producto: {required: true, type: Number}
  
  //Empleado(FK), Usuario(FK), Trueques(FK)?
});


const valoracionSchema = mongoose.Schema({
  nombre: {type: String, required: true, default:'Anonimo'},
  opinion: {type: String, required: true},
  valoracion: {type: Number, required: true},
  
  usuario: {type: [mongoose.Schema.Types.ObjectId], ref: "User", autopopulate: true, required: true},

  //Trueques(FK), Usuario(FK)
  //El Nombre_Usuario seria el nombre del que opina, no guardo su id xq me parece alp2 y no tiene por que. Se podria poner hasta que el que opina elija el nombre con el que aparecece
})


const notificacionSchema = mongoose.Schema({
  usuario: {type: [mongoose.Schema.Types.ObjectId], ref: "User", required: true},
  objeto: {type: [mongoose.Schema.Types.ObjectId], required: true},
  tipo: {type: Number, required: true},
  visto: {type: Boolean, default: false}
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
promocionSchema.plugin(autopopulate);
ventaSchema.plugin(autopopulate);
valoracionSchema.plugin(autopopulate);
notificacionSchema.plugin(autopopulate);



//EXPORTING MODELS

const DataUser = mongoose.model("User",userSchema);
const DataEmpleado = mongoose.model("Empleado", empleadoSchema);
const DataSucursal = mongoose.model("Sucursal", sucursalSchema);
const DataTrueque = mongoose.model("Trueque", truequeSchema);
const DataArticulo = mongoose.model("Articulo", articuloSchema);
const DataPromocion = mongoose.model("Promocion", promocionSchema);
const DataVenta = mongoose.model("Venta", ventaSchema);
const DataValoracion = mongoose.model("Valoracion", valoracionSchema);
const DataNotificacion = mongoose.model("Notificacion", notificacionSchema);


module.exports = {DataEmpleado, DataPromocion, DataArticulo, DataSucursal, DataTrueque, DataUser, DataValoracion, DataVenta, DataNotificacion};





