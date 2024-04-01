const express = require("express")
const app = express()
//const connectDB = require("./database/db");
const PORT = 5000
const cookieParser = require ("cookie-parser");
const mongoose = require("mongoose");

const {adminAuth, workerAuth, userAuth} = require ("./middleware/auth.js");



//Connecting the Database
//connectDB();

//prueba

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



//pruebas

const {DataUser} = require("./model/Schema")
app.use(express.json())
app.use(cookieParser());
//fin pruebas



console.log('Conexion established');

const server = app.listen(PORT, () =>
console.log(`Server Connected to port ${PORT}`)
)
// Handling Error
process.on("unhandledRejection", err => {
  console.log(`An error occurred: ${err.message}`)
  server.close(() => process.exit(1))
})



//
app.use("/api/auth", require("./auth/route"))



app.get("/admin", adminAuth, (req, res) => res.send("Admin Route"));
app.get("/worker", workerAuth, (req, res) => res.send("Admin Route"));
app.get("/user", userAuth, (req, res) => res.send("User Route"));





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