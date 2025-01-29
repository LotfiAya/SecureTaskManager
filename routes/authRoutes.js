const express = require("express");
const { register, login, logout } = require("../controllers/authController");
const {
  validateRegister,
  validateLogin,
} = require("../middlewares/validationMiddleware");

const router = express.Router();

router.post("/register", validateRegister, register);
router.post("/login", validateLogin, login);
router.get("/logout", logout);

module.exports = router;
