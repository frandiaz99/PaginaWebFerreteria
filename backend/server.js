const express = require("express")
const app = express()
const PORT = 5000
const connectDB = require("./database/db");
app.use("/api/auth", require("./auth/route"))



//Connecting the Database
connectDB();

const server = app.listen(PORT, () =>
console.log(`Server Connected to port ${PORT}`)
)
// Handling Error
process.on("unhandledRejection", err => {
  console.log(`An error occurred: ${err.message}`)
  server.close(() => process.exit(1))
})



app.use(express.json())