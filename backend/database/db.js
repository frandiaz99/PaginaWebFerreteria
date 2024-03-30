const Mongoose = require("mongoose");
//const localDB = `mongodb://localhost:27017/role_auth`;
const localDB = `mongodb://localhost:27017/DB`;

const connectDB = async () => {
  await Mongoose.connect(localDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  console.log("MongoDB Connected")
}
console.log(connectDB);
module.exports = connectDB