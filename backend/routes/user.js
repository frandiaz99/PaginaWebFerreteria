const {DataUser, DataNotificacion, DataSucursal} = require("../model/Schema")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken");
const jwtSecret = 'daa1dc6519bff687520b8dd1e6c0fd60cfbb06d7693be9cfbcea56053a52f5f5482701';

const upload = require("../imagenes/imagen.js")
const multer = require("multer");


const {getNotificacionesNuevas} = require ("./notificacion");
//
const express = require("express")
const {adminAuth, workerAuth, userAuth} = require ("../middleware/auth");
const router = express.Router();
//
const password_min_leght = 6;

const register = async (req, res, next) => {
  res.setHeader('Content-Type', 'application/json');
  /*  
  console.log({"Body": req.body});
  console.log("------------------------   -------------------------   ---------------")
  console.log(req.Imagen);
  console.log(req.file);
  */
 let File;
 if (!req.file){
  File = {filename: "Imagen_user_default.png"};
 } else {File = req.file};
 console.log({"File": File});
  
  const User = JSON.parse(req.body.User);
  console.log({"User": User});

  if (!User){
    return res.status(400).json({message: "Object User not recibed"})
  }
  //const { nombre, apellido, email, password, dni, nacimiento, suscripto} = req.body.User;
  if (!User.nombre || !User.apellido || !User.email || !User.password || !User.dni || !User.nacimiento || !User.sucursal){
    console.log("falta chekear que suba la foto");
    return res.status(400).json({message: "Los parametros recibidos no son valido"})
  }
  if (User.password.length < password_min_leght) {
    //return res.status(400).json({ message: `Password less than ${password_min_leght} characters` })
    //return res.status(400).send("Passsword is to short")
    return res.status(400)
  }
  var format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
  var i=0;
  var character='';
  var upper, special = false;
  while ((i <= User.password.length)  && !(upper && special)){
    character = User.password.charAt(i);
    if (character == character.toUpperCase()) {
      upper = true;
    }
    if(format.test(character)){
      special=true;
    }
    i++;
  }
  if (!upper || !special){
    return res.status(400).json({message: "The password do not contain upper case or special character"})
  }
  
  if (isNaN(User.dni)){
    return res.status(400).json({message: "The DNI is not a number"})
  }

  if (User.dni.length != 8){
    return res.status(400).json({message: "The DNI is shorten than 8 digits"})
  }
 console.log("email y dni se unico, email sea valido,sucursal valida)");
  console.log("Entra");
  
  //chekaer mail y dni no already in system
  //FALTA CHEKEAR TODO EL RESTO DE VARIABLES OBLIGATORIA, PARA QUE NO HAYA ERROR (dNI , ETC)
  /*
  try {

    await DataUser.create({
      email,
      password,
    }).then(user =>
      res.status(200).json({
        message: "User successfully created",
        user,
      })
    )
  } catch (err) {
    res.status(401).json({
      message: "User not successful created",
      error: err.mesage,
    })
  }*/
  //const URLfoto = upload(foto);
  //console.log(URLfoto);
const nacimiento = new Date(User.nacimiento);
if (isNaN(nacimiento.getTime())) {
  res.status(400).json({ message: "Invalid date format for nacimiento" });
}

const today = new Date();
let edad = today.getFullYear() - nacimiento.getFullYear();
const mes = today.getMonth() - nacimiento.getMonth();
if (mes < 0 || (mes === 0 && today.getDate() < nacimiento.getDate())) {
  edad--;
}
if (edad < 18) {
  res.status(401).json({ message: "Es menor de edad" });
}


  console.log("Hay que pasarle el id de las sucursales para recibirlo y guardarlo en eel objeto");
  let Sucursal = await DataSucursal.findOne ({"nombre": User.sucursal})
  if (!Sucursal){
    console.log("Se deberia responder error por sucursal no identificada, por el momento pongo cualquiera");
    Sucursal = await DataSucursal.findOne();
  }
/*
  if (!File) {
    console.log("Imagen no recibida");
    File.filename = "Imagen_1714493186314.png";
  } else {
    console.log("Imagen recibida", File);

  }*/



  await bcrypt.hash(User.password, 10).then(async (hash) => {
    await DataUser.create({
      //! || ! || !
      //  || !User.nacimiento || !User.sucursal
      
      nombre: User.nombre,
      apellido: User.apellido,
      email: User.email ,
      dni: User.dni,
      rawPassword: User.password,   //esto se deberia borrar en version final
      password: hash,
      fecha_nacimiento: nacimiento,
      //sucursal: User.sucursal,    //hay que ponerlo pero primero se debe pasar datos al front
      suscripto: User.suscripto,
      foto_perfil: File.filename
    })
      .then((user) =>{
        console.log("Usuario creado correctamente");
        // es igual a 3hs, va a ser el tiempo en hacer un timeout osea se va a tener que volver a logear
        const maxAge = 3 * 60 * 60
        const token = jwt.sign({id: user._id, email: user.email, dni: user.dni, rol: user.rol}, jwtSecret, {expiresIn: maxAge /* 3hrs en segundos */});
        
        res.cookie ("jwt", token, {
          httpOnly: true, maxAge: maxAge * 1000,    //3hs en milisegundos
        });
        
        console.log("Enviando al fron confirmacion de creacion de usuario con cookie");
        return res.status(201).json({user/*
          message: "User successfully created", 
          //User: user._id,             //se deberia cambiar para no pasar el user completo solo el ID se deja asi por el momento para debugear mas facil
        */
        })
      })
      .catch((error) =>{  
        console.log("Usuario NO creado correctamente");
        console.log(error)
        return res.status(400).json({
          message: "User not successful created",
          error: error.message,
          error_values: Object.keys(error.errors),
          //faltaria hacer codigos de erro para ver desde el front xq fue el problema
        })
      }
    );
  });
  console.log("4");
}



const login = async (req, res, next) => {
  if (!req.body.User){
      return res.status(400).json({message: "Object User not recibed"})
  }
  const { dni, password } = req.body.User;
  if (!dni || !password) {
      return res.status(400).json({
      message: "Dni or Password not present",
    })
  }
/*
  try {
    
    const user = await DataUser.findOne({ email, password })
    if (!user) {
      res.status(401).json({
        message: "Login not successful",
        error: "User not found",
      })
    } else {
      res.status(200).json({
        message: "Login successful",
        user,
      })
    }
  } catch (error) {
    res.status(400).json({
      message: "An error occurred",
      error: error.message,
    })
  }*/

  try {
    const user = await DataUser.findOne({ dni })
    if (!user) {
      console.log("User not found")
      res.status(400).json({
        message: "Login not successful",
        error: "User not found",
      })
    } else {
      if (user.intento_desbloqueo >= 3){
        console.log("User bloqued")
        return res.status(400).json({message: "User bloqued"})
      }

      // comparing given password with hashed password
      console.log("Comparing password")
      bcrypt.compare(password, user.password).then((result) => {
        if (result){
          //nuevo
          const maxAge = 3 * 60 * 60;
          const token = jwt.sign(
            { id: user._id, email: user.email, dni: user.dni, rol: user.rol },
            jwtSecret,
            {
              expiresIn: maxAge, // 3hrs en sec 
            }
          );
          res.cookie("jwt", token, {
            httpOnly: true,
            maxAge: maxAge * 1000, // 3hrs en ms
          });
          
          const notificaciones = getNotificacionesNuevas(user._id);
          //const resp = {"_id": user._id, "rol": user.rol, "email": user.email, "nombre": user.nombre, "foto": user.foto, "notificaciones": notificaciones };
          //fin nuevo
          console.log("Correct password")
          res.status(201).json({ message: "Login successful", User: user})      //tambien se deberia cambiar user por user._id
        } else {
          console.log("Incorrect password")
          DataUser.updateOne({ "dni": user.dni }, { $inc: { intento_desbloqueo: 1} }).catch(
            //poner en caso de error(?
          );
          res.status(400).json({ message: "Login not succesful" })
        }
      })
    }
  } catch (error) {
    console.log("An error ocurred")
    res.status(400).json({
      message: "An error occurred",
      error: error.message,
    })
  }

}



const logout = async (req, res, next) => {
  res.cookie("jwt", "", {maxAge: "1"});
  res.status(201).json({message: "User loged out"});
}







const deleteUser = async (req, res, next) => {
  
  const id = req.body.deleteID;
  if ( !id ) {
    return res.status(400).json({
    message: "ID not present",
  })
  }
  console.log(id);
/*
 await DataUser.findById(id)
    .then(user => user.deleteOne())
    .then(user =>{
      console.log("User found, deleting user");
      res.status(201).json({ message: "User successfully deleted", user })
    }
    )
    .catch(error => {
      console.log ("An error ocurred");
      res
      .status(400)
      .json({ message: "An error occurred", error: error.message })
    }
    ).catch(error => {
        console.log ("User ID not founded");
        res.status(400).json({message: "The id couldnt be found"})
      })*/

/*
await DataUser.findByIdAndDelete(id).exec()
.then( user => {
  res.status(200).json({message: "User successfully deleted", user})
}).catch(err => {
  res.status(400).json({message: "The ID couldnt be found"})
});
*/

  try {
    const User = await DataUser.findById(id);
    if (!User) {
      console.log("User not found");
      return res.status(404).json({ message: "User not found" });
    }
    console.log("User found, deleting user");
    await User.deleteOne();
    console.log("User successfully deleted");
    res.status(200).json({ message: "User successfully deleted", User });
  } catch (error) {
    console.error("An error occurred", error);
    res.status(500).json({ message: "An error occurred", error: error.message });
  }
}



const desbloquearUser = async (req, res, next) => {
    const dni = req.body.User.dni;
    if (!dni) {
      console.log("No se recibio el DNI")
      return res.status(400).json({message: "No se recibio DNI, expected User.dni:"})
    }
    try{
      await DataUser.updateOne({ "dni": dni }, { intento_desbloqueo: 0 })
      res.status(200).json({message: "User desbloqueado"});
    } catch (err) {
      console.error("An error occurred", err);
      res.status(500).json({ message: "An error occurred", error: err.message });
    }
}


const getSelf = async (req, res, next) => {
    try {
    const User = await DataUser.findById(req.body.Auth._id);
    if (!User){
      res.status(400).json({message: "Usuario no encontrado"})
    }
    res.status(200).json({User})
  } catch (err) {
    console.error("An error occurred", err);
    res.status(500).json({ message: "An error occurred", error: err.message });
  }
}






//new routes
router.route("/register").post( upload.single("Imagen"), register);
router.route("/login").post(login);

//user routes
router.route("/logout").post(userAuth, logout);
router.route("/getSelf").get(userAuth, getSelf);

//admin routes
router.route("/deleteUser").delete(adminAuth, deleteUser);
router.route("/desbloquearUser").post(adminAuth, desbloquearUser);

module.exports = router