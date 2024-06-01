const { DataUser, DataNotificacion, DataSucursal } = require("../model/Schema");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const jwtSecret =
  "daa1dc6519bff687520b8dd1e6c0fd60cfbb06d7693be9cfbcea56053a52f5f5482701";

const upload = require("../imagenes/imagen.js");
const multer = require("multer");

const shortid = require("shortid");
const shortNumericId = () => {
  var number = 0;
  while (number <= 9999) {
    number = parseInt(shortid.generate(), 36).toString().slice(0, 5);
  }
  return number;
};

const { getNotificacionesNuevas } = require("./notificacion");
//
const express = require("express");
const { adminAuth, workerAuth, userAuth } = require("../middleware/auth");
const { MandarMail } = require("./mail.js");
const { json } = require("body-parser");
//const { Console, error } = require("console");
const router = express.Router();
//
const password_min_leght = 6;
//const venciminetoCookie = 3 * 60 * 60; //3 horas
const venciminetoCookie = 20 * 24 * 60 * 60; //20 dias
//const venciminetoCookie = 3; //3 dias
const InstalarCookie = async (user, res) =>{
  const token = jwt.sign(
    { id: user._id, email: user.email, dni: user.dni, rol: user.rol, sucursal: user.sucursal },
    jwtSecret,
    { expiresIn: venciminetoCookie }
  );

  res.cookie("jwt", token, {
    httpOnly: true,
    maxAge: venciminetoCookie * 1000,
  });
};



const register = async (req, res, next) => {
  console.log("registrando usuario");
  // res.setHeader("Content-Type", "application/json");
  /*  
  console.log({"Body": req.body});
  console.log("------------------------   -------------------------   ---------------")
  console.log(req.Imagen);
  console.log(req.file);
  */
  let File;
  if (!req.file) {
    File = { filename: "Imagen_user_default.png" };
  } else {
    File = req.file;
  }
  //console.log({ File: File });

  //const User = JSON.parse(req.body.User);
  const User = req.body.User;
  //console.log({ User: User });

  if (!User) {
    return res.status(400).json({ message: "Object User not recibed" });
  }
  //const { nombre, apellido, email, password, dni, nacimiento, suscripto} = req.body.User;
  if (
    !User.nombre ||
    !User.apellido ||
    !User.email ||
    !User.password ||
    !User.dni ||
    !User.nacimiento ||
    !User.sucursal
  ) {
    console.log("falta chekear que suba la foto");
    return res
      .status(400)
      .json({ message: "Los parametros recibidos no son valido" });
  }
  if (User.password.length < password_min_leght) {
    //return res.status(400).json({ message: `Password less than ${password_min_leght} characters` })
    //return res.status(400).send("Passsword is to short")
    return res.status(400);
  }
  var format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
  var i = 0;
  var character = "";
  var upper,
    special = false;
  while (i <= User.password.length && !(upper && special)) {
    character = User.password.charAt(i);
    if (format.test(character)) {
      special = true;
    } else if (isNaN(character) && character === character.toUpperCase()) {
      //console.log(character, "", character.toLocaleUpperCase());
      upper = true;
    }
    i++;
  }
  if (!upper || !special) {
    return res.status(400).json({
      message: "The password do not contain upper case or special character",
    });
  }

  if (isNaN(User.dni)) {
    return res.status(400).json({ message: "The DNI is not a number" });
  }

  if (User.dni.length != 8) {
    return res
      .status(400)
      .json({ message: "The DNI is shorten than 8 digits" });
  }
  //console.log("email y dni se unico, email sea valido,sucursal valida)");
  //console.log("Entra");

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

  await DataSucursal.findOne({ _id: User.sucursal._id })
    .then((sucursal) => {
      if (!sucursal) {
        console.log(`sucursal ${User.sucursal.nombre} no encontrada`);
        console.log("response", sucursal);
        return res.status({
          message: `sucursal ${User.sucursal.nombre} no encontrada`,
          status: 404,
        });
      }
    })
    .catch((err) => {
      console.log(`Error buscando sucursal`);
      return res.status({
        message: `Error buscando la sucursal ${User.sucursal.nombre}`,
        error: err,
        status: 400,
      });
    });

  /*
    if (!File) {
      console.log("Imagen no recibida");
      File.filename = "Imagen_1714493186314.png";
    } else {
      console.log("Imagen recibida", File);
  
    }*/

  const Auth = req.body.Auth;
  let rol = 1;
  if (Auth && (Auth.rol = 3) && User.rol) {
    rol = User.rol;
  }

  await bcrypt.hash(User.password, 10).then(async (hash) => {
    ////////////////////
    await DataUser.create({
      //! || ! || !
      //  || !User.nacimiento || !User.sucursal

      nombre: User.nombre,
      apellido: User.apellido,
      email: User.email,
      dni: User.dni,
      rawPassword: User.password, //esto se deberia borrar en version final
      password: hash,
      fecha_nacimiento: nacimiento,
      sucursal: User.sucursal._id, //hay que ponerlo pero primero se debe pasar datos al front
      suscripto: User.suscripto,
      foto_perfil: File.filename,
      rol: rol,
      code: shortNumericId(),
    })
      .then((user) => {
        console.log("Usuario creado correctamente");
        // es igual a 3hs, va a ser el tiempo en hacer un timeout osea se va a tener que volver a logear}

        if (!req.body.Auth) {
          //const maxAge = venciminetoCookie;
          /*
          const token = jwt.sign(
            { id: user._id, email: user.email, dni: user.dni, rol: user.rol, sucursal: user.sucursal },
            jwtSecret,
            { expiresIn: venciminetoCookie }
          );

          res.cookie("jwt", token, {
            httpOnly: true,
            maxAge: venciminetoCookie * 1000,
          });
          */
          InstalarCookie (user, res);
        }

        //console.log("Enviando al fron confirmacion de creacion de usuario con cookie");
        return res.status(201).json({
          user /*
          message: "User successfully created", 
          //User: user._id,             //se deberia cambiar para no pasar el user completo solo el ID se deja asi por el momento para debugear mas facil
        */,
        });
      })
      .catch((error) => {
        console.log("Usuario NO creado correctamente");
        console.log(error);
        return res.status(400).json({
          message: "User not successful created",
          error: error.message,
          error_values: Object.keys(error.errors),
          //faltaria hacer codigos de erro para ver desde el front xq fue el problema
        });
      });
  });
  //console.log("4");
};

const login = async (req, res, next) => {
  if (!req.body.User) {
    return res
      .status(400)
      .json({ message: "Object User not recibed", status: 402 });
  }
  const { dni, password } = req.body.User;
  if (!dni || !password) {
    return res.status(400).json({
      message: "Dni or Password not present",
      status: 403,
    });
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
    const user = await DataUser.findOne({ dni });
    if (!user) {
      console.log("User not found");
      res.status(400).json({
        message: "Login not successful",
        error: "User not found",
        status: 404,
      });
    } else {
      if (user.intento_desbloqueo >= 3) {
        console.log("User bloqued");
        /*
        DataUser.updateOne({ "dni": user.dni }, { $inc: { intento_desbloqueo: 1 } }).catch(
          //poner en caso de error(?
        );*/
        return res.status(400).json({
          message: "User bloqued",
          intento: user.intento_desbloqueo,
          status: 407,
        });
      }

      // comparing given password with hashed password
      console.log("Comparing password");
      bcrypt.compare(password, user.password).then((result) => {
        if (result) {
          if (user.rol > 1) {
            if (req.body.User.code) {
              if (user.code == req.body.User.code) {
                DataUser.findOneAndUpdate(
                  { _id: user._id },
                  { code: shortNumericId() }
                ).then();
                console.log("Code correcto y actualizado uno nuevo");
              } else {
                console.log("El codigo es:", user.code);
                return res.status(401).json({
                  message: "Login successful, but the 'code' is not right",
                  status: 206,
                }); //tambien se deberia cambiar user por user._id
              }
            } else {
              MandarMail(user.email, 1, user.code);
              console.log(
                "falta crear bien el MandarMail, pero el codigo es:",
                user.code
              );
              return res.status(401).json({
                message: "Login successful, but code not recibed",
                status: 205,
              }); //tambien se deberia cambiar user por user._id
            }
          }

          //nuevo
          //const maxAge = venciminetoCookie;
          /*
          const token = jwt.sign(
            { id: user._id, email: user.email, dni: user.dni, rol: user.rol },
            jwtSecret,
            {
              expiresIn: venciminetoCookie, // 3hrs en sec
            }
          );
          res.cookie("jwt", token, {
            httpOnly: true,
            maxAge: venciminetoCookie * 1000, // 3hrs en ms
          });*/
          InstalarCookie (user, res)

          const notificaciones = getNotificacionesNuevas(user._id);
          //const resp = {"_id": user._id, "rol": user.rol, "email": user.email, "nombre": user.nombre, "foto": user.foto, "notificaciones": notificaciones };
          //fin nuevo
          console.log("Correct password");
          DataUser.updateOne(
            { dni: user.dni },
            { $set: { intento_desbloqueo: 0 } }
          ).then();

          res
            .status(201)
            .json({ message: "Login successful", User: user, status: 200 }); //tambien se deberia cambiar user por user._id
        } else {
          console.log("Incorrect password");
          DataUser.findOneAndUpdate(
            { dni: user.dni },
            { $inc: { intento_desbloqueo: 1 } },
            { new: true }
          ).then((updateUser) => {
            //console.log(updateUser);
            if (updateUser.intento_desbloqueo === 3) {
              return res.status(400).json({
                message: "Login not succesful, user bloqued",
                status: 406,
              });
            } else {
              return res.status(400).json({
                message: "Login not succesful",
                status: 405,
              });
            }
          }); //error code : user bloqued
        }
      });
    }
  } catch (error) {
    console.log("An error ocurred");
    res.status(400).json({
      message: "An error occurred",
      error: error.message,
    });
  }
  // 200 correcto
  // 402 object "User" no recibido
  // 403 "password" o "dni" no recibido
  // 404  "dni" de User no encontrado
  // 405 contraseña incorrecta
  // 406 contraseña incorrecta, bloqueado
  // 407 previamente bloqueado
};

const logout = async (req, res, next) => {
  res.cookie("jwt", "", { maxAge: "1" });
  res.status(201).json({ message: "User loged out" });
};

const getSelf = async (req, res, next) => {
  try {
    const User = await DataUser.findById(req.body.Auth._id);
    if (!User) {
      res.status(400).json({ message: "Usuario no encontrado" });
    }
    res.status(200).json({ User });
  } catch (err) {
    console.error("An error occurred", err);
    res.status(500).json({ message: "An error occurred", error: err.message });
  }
};

const getUser = async (req, res, next) => {
  const User = req.body.User;
  if (!User) {
    console.log("Variable 'User' no recibida ");
    return res
      .status(401)
      .json({ message: "Consulta erronea, falta objeto", status: 402 });
  }
  if (!User._id) {
    console.log("Falta variable '_id'");
    return res.status(401).json({
      message: "Consulta erronea, faltan parametro '_id'",
      status: 403,
    });
  }

  DataUser.findOne({ _id: User._id })
    .then((user) => {
      //console.log(user);
      console.log("No se si es necesario mandar el user para el front");
      if (user) {
        return res
          .status(200)
          .json({ message: "Usuario encontrado", status: 200, user });
      } else {
        return res
          .status(401)
          .json({ message: "Usuario NO encontrado", status: 405 });
      }
    })
    .catch((error) => {
      console.log(error);
      return res.status(401).json({ message: "Erro otro", status: 400, error });
    });

  //200 exitosa
  //400 Error otro
  //402 "User" no recibido
  //403 Variable '_id' no recibida
  //405 DNI,User not found
};

const editarPerfil = async (req, res, next) => {
  try {
    res.setHeader("Content-Type", "application/json");

    //console.log(req);
    // console.log(req.body.User);
    // console.log(req.body.Auth);
    //console.log(req.body.Auth);
    /*
    console.log({ Body: req.body });
    console.log(
      "------------------------   -------------------------   ---------------"
    );
    console.log({ imagen: req.Imagen });
    console.log(
      "------------------------   -------------------------   ---------------"
    );
    console.log({ file: req.file });
    console.log("------------------------   -------------------------   ---------------");
    */
    // Obtener los datos del usuario actual
    const userId = req.body.Auth._id; // ID del usuario actual
    const currentUser = await DataUser.findById(userId);

    if (!currentUser) {
      return res.status(400).json({ message: "Usuario no encontrado" });
    }

    // Manejo de la imagen de perfil
    let foto_perfil;
    if (!req.file) {
      // Si no se proporciona una imagen, mantener la imagen actual del usuario
      foto_perfil = currentUser.foto_perfil;
    } else {
      // Si se proporciona una imagen, usar la nueva imagen cargada
      foto_perfil = req.file.filename; // Asigna el nombre del archivo generado por multer
    }

    // Modificar los datos del usuario según lo proporcionado en la solicitud
    const { nombre, apellido, sucursal } = JSON.parse(req.body.User);
    if (nombre) currentUser.nombre = nombre;
    if (apellido) currentUser.apellido = apellido;
    currentUser.foto_perfil = foto_perfil; // Actualiza la foto de perfil
    //if (sucursal) currentUser.sucursal = sucursal;
    //console.log("Sucursal:", sucursal);
    console.log(
      "------------------------   -------------------------   ---------------"
    );
    console.log(
      "Falta que el front reciba las id de las sucusasles y madne las id"
    );
    console.log(
      "------------------------   -------------------------   ---------------"
    );

    if (currentUser.sucursal) {
      //agregue este if porque si es admin no tiene una sucursal asignada (nico)

      if (currentUser.sucursal._id != sucursal._id) {
        await DataSucursal.findById(sucursal._id)
          .then((data) => {
            //console.log(data);
            if (data) {
              currentUser.sucursal = sucursal._id;
            } else {
              return res
                .status(400)
                .json({ message: "Sucursal no encontrada", error: data });
            }
          })
          .catch((error) => {
            return res
              .status(400)
              .json({ message: "Error buscando sucursal", error });
          });
      }
    }
    // Guardar los cambios en la base de datos
    await currentUser
      .save()
      .then((data) => {
        //console.log({ "User actualizado": data });
        return res
          .status(200)
          .json({ message: "Perfil actualizado correctamente", user: data });
      })
      .catch((err) => {
        return res
          .status(200)
          .json({ message: "Error actualizado perfil", error: err });
      });
  } catch (err) {
    console.error("Ocurrió un error al editar el perfil:", err);
    return res.status(500).json({
      message: "Ocurrió un error al editar el perfil",
      error: err.message,
    });
  }
};

const cambiarContrasena = async (req, res, next) => {
  const User = req.body.User;
  if (!User) {
    console.log("Variable 'User' no recibida ");
    return res
      .status(401)
      .json({ message: "Consulta erronea, falta objeto", status: 402 });
  }
  if (!User.password || !User.newPassword) {
    console.log("Falta variable 'password' o 'newPassword'");
    return res.status(401).json({
      message: "Consulta erronea, faltan parametro 'password' o 'newPassword'",
      status: 403,
    });
  }

  if (User.newPassword.length < password_min_leght) {
    //return res.status(400).json({ message: `Password less than ${password_min_leght} characters` })
    //return res.status(400).send("Passsword is to short")
    return res
      .status(401)
      .json({ message: "Contrasena nueva muy corta", status: 406 });
  }
  var format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
  var i = 0;
  var character = "";
  var upper = false,
    special = false;
  while (i <= User.newPassword.length && !(upper && special)) {
    character = User.newPassword.charAt(i);
    if (format.test(character)) {
      special = true;
    } else if (isNaN(character) && character === character.toUpperCase()) {
      //console.log(character, "", character.toLocaleUpperCase());
      upper = true;
    }
    i++;
  }
  if (!(upper && special)) {
    return res.status(400).json({
      message: "The password do not contain upper case or special character",
      status: 407,
    });
  }
  //console.log(req.body);
  //console.log (req.Auth)

  DataUser.findOne({ dni: req.body.Auth.dni })
    .then((userViejo) => {
      //console.log(userViejo)
      if (!userViejo) {
        return res
          .status(401)
          .json({ message: "Usuario NO encontrado", status: 405 });
      } else {
        bcrypt
          .compare(User.password, userViejo.password)
          .then(async (result) => {
            if (result) {
              console.log("Correct password");

              await bcrypt.hash(User.newPassword, 10).then(async (hash) => {
                DataUser.findOneAndUpdate(
                  { dni: userViejo.dni },
                  { $set: { rawPassword: User.newPassword, password: hash } }
                )
                  .then((userNuevo) => {
                    //console.log("Contraseña actualizada:", userNuevo)
                    return res.status(200).json({
                      message: "contrasena actualizada",
                      status: 200,
                      userNuevo,
                    });
                  })
                  .catch((err) => {
                    console.log("Error al actualizar la contrasena:", err);
                    return res.status(200).json({
                      message: "error guardando user",
                      status: 409,
                      err,
                    });
                  });
              });
            } else {
              console.log("Incorrect password", result);
              return res
                .status(401)
                .json({ message: "Contraseña erronea", status: 408 });
            }
          });
      }
    })
    .catch((error) => {
      console.log(error);
      return res.status(401).json({ message: "Erro otro", status: 400, error });
    });
  //200 exitosa
  //400 Error otro
  //402 "User" no recibido
  //403 Variable 'password' o 'newPassword' no recibida
  //405 DNI,User not found
  //406 contrasena nueva muy corta
  //407 contrasena nueva no cumple condicuiones
  //408 contrasena vieja erronea
  //409 error de lserver al guardar user
};

const getByDNI = async (req, res, next) => {
  const User = req.body.User;
  if (!User) {
    console.log("Variable 'User' no recibida ");
    return res
      .status(401)
      .json({ message: "Consulta erronea, falta objeto", status: 402 });
  }
  if (!User.dni) {
    console.log("Falta variable 'dni'");
    return res.status(401).json({
      message: "Consulta erronea, faltan parametro 'dni'",
      status: 403,
    });
  }

  DataUser.findOne({ dni: User.dni })
    .then((user) => {
      //console.log(user);
      console.log("No se si es necesario mandar el user para el front");
      if (user) {
        return res
          .status(200)
          .json({ message: "Usuario encontrado", status: 200, user });
      } else {
        return res
          .status(401)
          .json({ message: "Usuario NO encontrado", status: 405 });
      }
    })
    .catch((error) => {
      console.log(error);
      return res.status(401).json({ message: "Erro otro", status: 400, error });
    });

  //200 exitosa
  //400 Error otro
  //402 "User" no recibido
  //403 Variable 'dni' no recibida
  //405 DNI,User not found
};

const getUsuarios = async (req, res, next) => {
  console.log("Entrando a get usuarios");
  try {
    DataUser.find({ rol: { $in: [1, 2] } }).then((Users) => {
      return res.status(200).json({ message: "Consulta exitosa", Users });
    });
  } catch (err) {
    return res.status(400).json({ message: "Error en la consulta", err });
  }
};

const getEmpleados = async (req, res, next) => {
  console.log("get empleados");
  try {
    DataUser.find({ rol: 2 }).then((Empleados) => {
      return res.status(200).json({ message: "Consulta exitosa", Empleados });
    });
  } catch (err) {
    return res.status(400).json({ message: "Error en la consulta", err });
  }
};

const setEmpleado = async (req, res, next) => {
  const dni = req.body.dni;
  if (!dni) {
    console.log("Variable 'dni' no recibida ");
    return res
      .status(401)
      .json({ message: "Consulta erronea, falta objeto", status: 402 });
  }
  console.log(
    "Se puede registrtar como a un empleado a un usuario que ya es empleado, no pasa nada pero se podria evitar"
  );

  DataUser.findOne({ dni })
    .then((user) => {
      if (user) {
        if (user.rol > 1) {
          console.log(`El usuario ${dni} ya esta registrado como empelado}`);
          return res.status(403).json({
            message: `El usuario  ${dni} ya es empleado`,
            status: 401,
            user,
          });
        }
        DataUser.findOneAndUpdate({ dni }, { rol: 2 })
          .then((user) => {
            return res.status(200).json({
              message: "Usuario encontrado y actualizado",
              status: 200,
              user,
            });
          })
          .catch((error) => {
            console.log(error);
            return res
              .status(401)
              .json({ message: "Erro otro", status: 400, error });
          });
      } else {
        return res
          .status(404)
          .json({ message: "Usuario NO encontrado", status: 404 });
      }
    })
    .catch((error) => {
      console.log(error);
      return res.status(401).json({ message: "Erro otro", status: 400, error });
    });

  //200 exitosa
  //400 Error otro
  //403 Variable 'dni' no recibida
  //404 DNI,User not found
};

const setRol2 = async (req, res, next) => {
  req.body.User.rol = 2;
  next();
};

const bloquearUser = async (req, res, next) => {
  const id = req.body._id;
  if (!req.body) {
    return res.status(400).json({
      message: "'body' not present",
      status: 401,
    });
  }
  if (!id) {
    return res.status(400).json({
      message: "'_id' not present",
      status: 402,
    });
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
  /*
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
    res
      .status(500)
      .json({ message: "An error occurred", error: error.message });
  }*/
  await DataUser.findOneAndUpdate({ _id: id }, { intento_desbloqueo: 3 })
    .then((bloqueado) => {
      console.log(
        "se podria bloquear a cualquier usuario incluso admin y trabajador"
      );
      if (!bloqueado) {
        console.log("User not found");
        return res.status(404).json({ message: "User not found", status: 404 });
      }
      console.log("User found and bloqued");
      res
        .status(200)
        .json({ message: "User successfully bloqued", bloqueado, status: 200 });
    })
    .catch((error) => {
      console.error("An error occurred", error);
      res.status(500).json({
        message: "An error occurred",
        error: error.message,
        status: 400,
      });
    });
};

const desbloquearUser = async (req, res, next) => {
  const dni = req.body.User.dni;
  if (!req.body.User) {
    console.log("No se recibio el User");
    return res.status(400).json({
      message: "No se recibio User, expected 'User.dni'",
      status: 401,
    });
  }
  if (!dni) {
    console.log("No se recibio el DNI");
    return res
      .status(400)
      .json({ message: "No se recibio DNI, expected User.dni:", status: 402 });
  }
  try {
    await DataUser.updateOne({ dni: dni }, { intento_desbloqueo: 0 }).then(
      (user) => {
        if (user) {
          console.log("desbloqueo exitoso");
          return res
            .status(200)
            .json({ message: "User desbloqueado", status: 200 });
        } else {
          console.log("desbloqueo erroneo DNI no encontrado en la DB");
          return res
            .status(404)
            .json({ message: "User not found", status: 404 });
        }
      }
    );
  } catch (err) {
    console.error("An error occurred", err);
    res.status(500).json({ message: "An error occurred", error: err.message });
  }
};

const deleteEmpleado = async (req, res, next) => {
  console.log(
    "se podria poner como usuario a cualquier usuario incluso admin y trabajador"
  );
  const id = req.body._id;
  if (!req.body) {
    return res.status(400).json({
      message: "'body' not present",
      status: 401,
    });
  }
  if (!id) {
    return res.status(400).json({
      message: "'_id' not present",
      status: 402,
    });
  }
  console.log(id);

  await DataUser.findOneAndUpdate({ _id: id }, { $set: { rol: 1 } })
    .then((borrado) => {
      if (!borrado) {
        console.log("User not found");
        return res.status(404).json({ message: "User not found", status: 404 });
      }
      console.log("User found and fired");
      return res
        .status(200)
        .json({ message: "User successfully fired", borrado, status: 200 });
    })
    .catch((error) => {
      console.error("An error occurred", error);
      return res.status(500).json({
        message: "An error occurred",
        error: error.message,
        status: 400,
      });
    });
};

//new routes
//router.route("/register").post(upload.single("Imagen"), register);
router.route("/register").post(register);
router.route("/login").post(login);

//user routes
//router.route("/logout").post(userAuth, logout);
router.route("/logout").post(logout);
router.route("/getSelf").get(userAuth, getSelf);
router.route("/getUser").get(userAuth, getUser);
router
  .route("/editarPerfil")
  .post(upload.single("Imagen"), userAuth, editarPerfil);
router.route("/cambiarContrasena").post(userAuth, cambiarContrasena);

//worker routes
router.route("/getByDNI").get(workerAuth, getByDNI);
router.route("/getUsuarios").get(workerAuth, getUsuarios);

//admin routes
router.route("/getEmpleados").get(adminAuth, getEmpleados);
router.route("/setEmpleado").post(adminAuth, setEmpleado);
router.route("/registrarEmpleado").post(adminAuth, setRol2, register);

router.route("/bloquearUser").post(adminAuth, bloquearUser);
router.route("/desbloquearUser").post(adminAuth, desbloquearUser);
router.route("/deleteEmpleado").post(adminAuth, deleteEmpleado);

module.exports = router;
