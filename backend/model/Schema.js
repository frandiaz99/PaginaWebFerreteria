const mongodb = require ("mongodb");

const autopopulate = require("mongoose-autopopulate");

const mongoose = require ("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = mongoose.Schema({
  email: {type: String, required: true, unique: true},
  dni: {type: Number, required: true, unique: true},
  rawPassword: { type: String, required: true, minlength: 8},
  password: { type: String, required: true},
  role: {type: Number, required: true, default: 1},   //1 User, 2 Worker, 3 Admin
  
  suscripto: {type: Boolean, default: false}, 
  puntos: {type: Number, default: 0},
  intento_desbloqueo: {type: Number, default: 0},

  //publicaciones: {type: [mongoose.Schema.Types.ObjectId], ref: "Publicacion", autopopulate: true},

  //publicaciones [(FK)],  trueques [(FK)], Valoracion[(FK)]
});

const sucursalSchema = mongoose.Schema({
  nombre: {required: true, type:String},
  direccion: {type: String, required: true}


  //Empleados[(FK)], direccion: String(link maps), Trueques[(FK)]
});

const empleadoSchema = mongoose.Schema({
  
  //Usuario(FK), Trueques_Cerrados [(FK): Trueques], VentasProductos [(FK): Ventas]
});



const publicacionSchema = mongoose.Schema({
  usuario: {type: mongoose.Schema.Types.ObjectId, ref:"User", autopopulate: true},
  titulo: {type: String, required: true},
  descripcion: {type: String, required: true},
  fecha: {type: Date},  //debe recibir JS date (yyyy-mm-dd) es decir (2024-12-31) se le puede poner hora tambien
  rango_precio: {type: Number, default: 0},
  estado_libre: {type: Boolean, default: true}, //en falso cuando se relizo la vent
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
  
  publicacion: {type: mongoose.Schema.Types.ObjectId, ref: "Publicacion", autopopulate: true}

  //User_Publica(FK):Usuario, User_Compra(FK)?:Usuario, Empleado_Cierra(FK)?:Empleado, Sucursal (FK)?, Publicacion(FK), Opinion_Publica(FK)?, Opinion_Compra(FK)?
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
  
  usuario: {type: [mongoose.Schema.Types.ObjectId], ref: "Usuario", autopopulate: true, required: true},

  //Trueques(FK), Usuario(FK)
  //El Nombre_Usuario seria el nombre del que opina, no guardo su id xq me parece alp2 y no tiene por que. Se podria poner hasta que el que opina elija el nombre con el que aparecece
})


//UNIQUE VALIDAATOR

userSchema.plugin(uniqueValidator);


//MONGOOSE AUTO-POPULATE
userSchema.plugin(autopopulate);
empleadoSchema.plugin(autopopulate);
sucursalSchema.plugin(autopopulate);
truequeSchema.plugin(autopopulate);
publicacionSchema.plugin(autopopulate);
promocionSchema.plugin(autopopulate);
ventaSchema.plugin(autopopulate);
valoracionSchema.plugin(autopopulate);



//EXPORTING MODELS

const DataUser = mongoose.model("User",userSchema);
const DataEmpleado = mongoose.model("Empleado", empleadoSchema);
const DataSucursal = mongoose.model("Sucursal", sucursalSchema);
const DataTrueque = mongoose.model("Trueque", truequeSchema);
const DataPublicacion = mongoose.model("Publicacion", publicacionSchema);
const DataPromocion = mongoose.model("Promocion", promocionSchema);
const DataVenta = mongoose.model("Venta", ventaSchema);
const DataValoracion = mongoose.model("Valoracion", valoracionSchema);


module.exports = {DataEmpleado, DataPromocion, DataPublicacion, DataSucursal, DataTrueque, DataUser, DataValoracion, DataVenta};





