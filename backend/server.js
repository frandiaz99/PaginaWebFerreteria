const express = require("express");
//const connectDB = require("./database/db");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const cors = require("cors");
//const fs = require("fs");
//const https = require"https";

const { adminAuth, workerAuth, userAuth } = require("./middleware/auth.js");

const PORT = 5000;
const app = express();

//Connecting the Database
//connectDB();

/*
//Primera forma, BD local
mongoose.connect("mongodb://localhost:27017/DB");
//mongoose.connect("mongodb://0.0.0.0:27017/");
//mongoose.set("debug", true);
//fin primera forma
*/

/*
//Segunda forma
//conectando a la DB
const mongoDB = "mongodb+srv://quintanjuli:nm8Vir5XC4ow2KWM@cluster0.trqsger.mongodb.net/" ;
//console.log('path = ', __dirname);
mongoose.connect(mongoDB).then((data) => {
  console.log('Connected version: ', data.version);
}, (error) => {
  console.log('Error: ', error);
});
// fin Segunda forma
*/

//Tercera forma
const credentials = "./database/X509-cert-5548456613154801466.pem";
const uri =
  "mongodb+srv://cluster0.trqsger.mongodb.net/?authSource=%24external&authMechanism=MONGODB-X509&retryWrites=true&w=majority&appName=Cluster0";
const clientOptions = {
  tlsCertificateKeyFile: credentials,
  serverApi: { version: "1", strict: true, deprecationErrors: true },
};

mongoose.connect(uri, clientOptions).then(
  (data) => {
    console.log("Connected to DB, version: ", data.version);
  },
  (error) => {
    console.log("Error: ", error);
  }
);
//fin de la tercera forma

//checkeo por fallo ded la DB
const database = mongoose.connection;

database.on("error", (error) => {
  //console.log("Error mongo");
  console.error.bind(console, "MongoDB connection error:");
  //console.log (error)
});

database.on("connected", () => {
  console.log("Conectado");
});

database.on("disconected", () => {
  console.log("Conexion with DB lost");
});

//configurando e iniciando la api

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, // enable credentials (cookies, authorization headers, etc.)
    preflightContinue: false, // if true, the request will continue even if not handled by CORS middleware
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  })
);

console.log("Conexion established");

const server = app.listen(PORT, () =>
  console.log(`Server Connected to port ${PORT}`)
);
// Handling Error
process.on("unhandledRejection", (err) => {
  console.log(`An error occurred: ${err.message}`);
  server.close(() => process.exit(1));
});

// autentication middleware
app.get("/admin", adminAuth, (req, res) => res.send("Admin Route"));
app.get("/worker", workerAuth, (req, res) => res.send("Admin Route"));
app.get("/user", userAuth, (req, res) => res.send("User Route"));

//routes
app.use("/user", require("./routes/user.js"));
app.use("/articulo", require("./routes/articulo"));
app.use("/sucursal", require("./routes/sucursales"));
app.use("/trueque", require("./routes/trueque"));
app.use(express.static("imagenes"));


//console.log ("comentar esto pa q ande bien")
//app.use("/mail", require("./routes/mail"));
//app.use("/producto", require("./routes/producto"));

//app.use("/pay", require("./routes/pagar"))

///prueba   esto esta para que cheken nada mas despues se borra
const { DataUser } = require("./model/Schema");
/*
app.get("/home", (req, res) => {
  res.json({ hi: "there" });
});

app.post("/create", (req, res) => {
  try {
    const body = req.body;
    console.log(body);
 
    User = new DataUser({
      email: req.body.email,
    });
    res.json(User);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal error" });
  }
});*/

///fin prueba
