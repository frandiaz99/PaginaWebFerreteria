const express = require("express")
const { register, login,  logout, deleteUser } = require("./auth")
const {adminAuth, workerAuth, userAuth} = require ("../middleware/auth");


const router = express.Router();


router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").post(userAuth, logout);

//router.route("")
router.route("/deleteUser").delete(adminAuth, deleteUser);

module.exports = router
