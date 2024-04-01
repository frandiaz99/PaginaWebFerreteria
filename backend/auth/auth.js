const {DataUser} = require("../model/Schema")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken");

const jwtSecret = 'daa1dc6519bff687520b8dd1e6c0fd60cfbb06d7693be9cfbcea56053a52f5f5482701';


const password_min_leght = 8;

exports.register = async (req, res, next) => {
  const { email, password, role } = req.body
  if (password.length < password_min_leght) {
    return res.status(400).json({ message: `Password less than ${password_min_leght} characters` })
  }
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
      rawPassword: password,
      password: hash,
      role,
    })
      .then((user) =>{
        // es igual a 3hs, va a ser el tiempo en hacer un timeout osea se va a tener que volver a logear
        const maxAge = 3 * 60 * 60
        const token = jwt.sign({id: user._id, email, role: user.role}, jwtSecret, {expiresIn: maxAge /* 3hrs en segundos */});

        res.cookie ("jwt", token, {
          httpOnly: true, maxAge: maxAge * 1000,    //3hs en milisegundos
        });

        res.status(201).json({
          message: "User successfully created",
          user,             //se deberia cambiar para no pasar el user completo solo el ID se deja asi por el momento para debugear mas facil
        })
      })
      .catch((error) =>
        res.status(400).json({
          message: "User not successful created",
          error: error.message,
        })
      );
  });
}



exports.login = async (req, res, next) => {
  const { email, password } = req.body
  if (!email || !password) {
      res.status(400).json({
      message: "Email or Password not present",
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
    const user = await DataUser.findOne({ email })
    if (!user) {
      console.log("User not found")
      res.status(400).json({
        message: "Login not successful",
        error: "User not found",
      })
    } else {
      // comparing given password with hashed password
      console.log("Comparing password")
      bcrypt.compare(password, user.password).then((result) => {
        if (result){
          //nuevo
          const maxAge = 3 * 60 * 60;
          const token = jwt.sign(
            { id: user._id, email, role: user.role },
            jwtSecret,
            {
              expiresIn: maxAge, // 3hrs en sec
            }
          );
          res.cookie("jwt", token, {
            httpOnly: true,
            maxAge: maxAge * 1000, // 3hrs en ms
          });
          
          
          
          //fin nuevo
          console.log("Correct password")
          res.status(201).json({ message: "Login successful", user})      //tambien se deberia cambiar user por user._id
        } else {
          console.log("Incorrect password")
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




exports.deleteUser = async (req, res, next) => {
  const { id } = req.body
  console.log(req.body);
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