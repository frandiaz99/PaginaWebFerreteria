const express = require("express")
const { register, login, deleteUser } = require("./auth")

const router = express.Router()
router.route("/register").post(register);
router.route("/login").post(login);
router.route("/deleteUser").delete(deleteUser);

module.exports = router