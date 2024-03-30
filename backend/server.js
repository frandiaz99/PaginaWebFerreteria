const express = require("express")
const app = express()
//const connectDB = require("./database/db");
const PORT = 5000

//pruebas

const {DataUser} = require("./model/Schema")
app.use(express.json())
//fin pruebas

//app.use("/api/auth", require("./auth/route"))       comentado momentaneamente para ver que no sea lo q ue causa error



//Connecting the Database
//connectDB();

//prueba

const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/DB");
//mongoose.connect("mongodb://0.0.0.0:27017/");
const database = mongoose.connection;
//mongoose.set("debug", true);

database.on("error", (error) => {
  console.log("Error mongo");
  console.log (error);
});

database.on("connected", () => {
  console.log("Conectado");
});

database.on("disconected", () => {
  console.log("Conexion with DB lost");
});
//fin prueba


console.log('Conexion established');

const server = app.listen(PORT, () =>
console.log(`Server Connected to port ${PORT}`)
)
// Handling Error
process.on("unhandledRejection", err => {
  console.log(`An error occurred: ${err.message}`)
  server.close(() => process.exit(1))
})


///prueba
app.get ('/home' , (req, res) => {
  res.send({hi: 'there'});
});

app.post('/create',  (req, res) => {
  try {
    const body = req.body;
    console.log(body);
    
    User = new DataUser({
      email: req.body.email
    });
    res.json(User);
  } catch (error) {
    console.error(error);
    res.status(500).json({error: "Internal error"});
  }
})

///fin prueba

//app.use(express.json())