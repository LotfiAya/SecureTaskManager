const express = require("express");
const {
  addTask,
  getTasks,
  deleteTask,
} = require("../controllers/taskController");
const { validateTask } = require("../middlewares/validationMiddleware");

const router = express.Router();

const csrfProtection = require("csurf")({ cookie: true });
router.use(csrfProtection);

router.post("/add",  validateTask, addTask);
router.get("/tasks",  getTasks);
router.delete("/tasks/:id",  deleteTask);

module.exports = router;
