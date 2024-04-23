const {DataUser, DataNotificacion} = require("../model/Schema")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken");
const jwtSecret = 'daa1dc6519bff687520b8dd1e6c0fd60cfbb06d7693be9cfbcea56053a52f5f5482701';

const {getNotificacionesNuevas} = require ("./notificacion");
//
const express = require("express")
const {adminAuth, workerAuth, userAuth} = require ("../middleware/auth");
const router = express.Router();
//
const password_min_leght = 6;

const register = async (req, res, next) => {

  if (!req.body.User){
    return res.status(400).json({message: "Object User not recibed"})
  }
  const { email, dni, password, suscripto, nombre, foto} = req.body.User;
  if (!email || !dni || !password || !nombre || !foto){
    return res.status(400).json({message: "Los parametros recibidos no son valido"})
  }
  if (password.length < password_min_leght) {
    return res.status(400).json({ message: `Password less than ${password_min_leght} characters` })
  }
  var format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
  var i=0;
  var character='';
  var upper, special = false;
  while ((i <= password.length)  && !(upper && special)){
    character = password.charAt(i);
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
  
  if (isNaN(dni)){
    return res.status(400).json({message: "The DNI is not a number"})
  }

  if (dni.length != 8){
    return res.status(400).json({message: "The dni is shorten than 8 digits"})
  }


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

  bcrypt.hash(password, 10).then(async (hash) => {
    await DataUser.create({
      email,
      dni,
      rawPassword: password,
      password: hash,
      suscripto,
      nombre,
      foto,
    })
      .then((user) =>{
        // es igual a 3hs, va a ser el tiempo en hacer un timeout osea se va a tener que volver a logear
        const maxAge = 3 * 60 * 60
        const token = jwt.sign({id: user._id, email, dni, rol: user.rol}, jwtSecret, {expiresIn: maxAge /* 3hrs en segundos */});

        res.cookie ("jwt", token, {
          httpOnly: true, maxAge: maxAge * 1000,    //3hs en milisegundos
        });

        res.status(201).json({
          message: "User successfully created", 
          User: user._id,             //se deberia cambiar para no pasar el user completo solo el ID se deja asi por el momento para debugear mas facil
        })
      })
      .catch((error) =>{  
        console.log(error)
        res.status(400).json({
          message: "User not successful created",
          error: error.message,
          error_values: Object.keys(error.errors),
          //faltaria hacer codigos de erro para ver desde el front xq fue el problema
        })
      }
      );
  });
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
          const resp = {"_id": user._id, "rol": user.rol, "email": user.email, "nombre": user.nombre, "foto": user.foto, "notificaciones": notificaciones };
          //fin nuevo
          console.log("Correct password")
          res.status(201).json({ message: "Login successful", User: resp})      //tambien se deberia cambiar user por user._id
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
    const user = await DataUser.findById(id);
    if (!user) {
      console.log("User not found");
      return res.status(404).json({ message: "User not found" });
    }
    console.log("User found, deleting user");
    await user.deleteOne();
    console.log("User successfully deleted");
    res.status(200).json({ message: "User successfully deleted", user });
  } catch (error) {
    console.error("An error occurred", error);
    res.status(500).json({ message: "An error occurred", error: error.message });
  }
}



const desbloquearUser = async (req, res, next) => {
    const dni = req.body.User.dni;
    if (!dni) {
      console.log("No se recibio la id")
      return res.status(400).json({message: "No se recibio ID, expected User._id:"})
    }
    try{
      await DataUser.updateOne({ "dni": dni }, { intento_desbloqueo: 0 })
      res.status(200).json({message: "User debloqueado"});
    } catch (err) {
      console.error("An error occurred", err);
      res.status(500).json({ message: "An error occurred", error: err.message });
    }
}



//new routes
router.route("/register").post(register);
router.route("/login").post(login);

//user routes
router.route("/logout").post(userAuth, logout);

//admin routes
router.route("/deleteUser").delete(adminAuth, deleteUser);
router.route("/desbloquearUser").post(adminAuth, desbloquearUser);

module.exports = router