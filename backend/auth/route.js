const express = require("express")
const { register, login, deleteUser } = require("./auth")
const router = express.Router();

const {adminAuth, workerAuth, userAuth} = require ("../middleware/auth");

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/deleteUser").delete(adminAuth, deleteUser);

module.exports = router