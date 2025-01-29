const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
const { readData, writeData } = require("../utils/fileHandler");
const config = require("../config/config");
const logger = require("../utils/logger");

const register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400)
    return res.json({ errors: errors.array() });
  }

  const { username, password } = req.body;

  try {
    const data = await readData(config.dbPath);
    const userExists = data.users.find((u) => u.username === username);

    if (userExists) {
      res.status(400)
      return res.json({ errors: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    data.users.push({ username, password: hashedPassword });
    await writeData(config.dbPath, data);

    res.status(201)
    res.json({ msg: "User registered successfully" });
  } catch (err) {
    logger.error("Error during registration:", err);
    res.status(500)
    res.json({ errors: "Internal server error" })
  }
};

const login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400)
    return res.json({ errors: errors.array() });
  }

  const { username, password } = req.body;

  try {
    const data = await readData(config.dbPath);
    const user = data.users.find((u) => u.username === username);

    if(!user){
        res.status(400)
        return res.json({
            errors : "Invalid credentials"
        })
    }

    if (await bcrypt.compare(password, user.password) == true ){
        res.status(201);
        req.session.user = { username: user.username };
        return res.json({
          msg: "successful login",
        });
    } else {
        res.status(400);
        return res.json({
          errors: "Invalid credentials",
        });
    }
  } catch (err) {
    logger.error("Error during login:", err);
    res.status(500).send("Internal server error");
  }
};

const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      logger.error("Error destroying session:", err);
      res.status(500)
      return res.json({errors : "Logout failed. Please try again."});
    }

    res.clearCookie("connect.sid");
    res.status(200);
    res.json({msg : "logged out successfully"})
  });
};

module.exports = { register, login, logout };