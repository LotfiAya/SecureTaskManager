const { validationResult } = require("express-validator");
const { readData, writeData } = require("../utils/fileHandler");
const config = require("../config/config");
const logger = require("../utils/logger");

const addTask = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { task } = req.body;

  try {
    const data = await readData(config.dbPath);
    const taskId = Date.now();
    const createdAt = new Date().toISOString();

    data.tasks.push({
      id: taskId,
      task,
      user: req.session.user.username,
      createdAt,
    });

    await writeData(config.dbPath, data);
        res.status(201).json({ msg : "Task added successfully"});
  } catch (err) {
    logger.error("Error adding task:", err);
    res.status(500).json({ errors : "Internal server error"});
  }
};

const getTasks = async (req, res) => {
  if (!req.session.user || !req.session.user.username) {
    return res.status(401).json({ errors : "Unauthorized"});
  }

  try {
    const data = await readData(config.dbPath);

    // Vérification du format des données
    if (!data.tasks || !Array.isArray(data.tasks)) {
      logger.error("Tasks data format error");
      return res.status(500).json({ errors: "Data format error" });
    }

    // Filtrer les tâches pour l'utilisateur connecté
    const userTasks = data.tasks
      .filter((task) => task.user === req.session.user.username)
      .map((task) => ({
        id: task.id,
        task: task.task,
        createdAt: task.createdAt,
      }));

    // Retourner les tâches sous forme JSON
    res.status(200)
    res.json(userTasks);
  } catch (err) {
    logger.error("Error retrieving tasks:", err);
    res.status(500).json({ errors: "Internal server error" });
  }
};

const deleteTask = async (req, res) => {
  if (!req.session.user || !req.session.user.username) {
    return res.status(401).json({ errors: "Unauthorized" });
  }

  const id = parseInt(req.params.id, 10);

  // Validation du paramètre ID
  if (isNaN(id)) {
    return res.status(400).json({ errors: "Invalid task ID" });
  }

  try {
    const data = await readData(config.dbPath);

    // Vérification du format des données
    if (!data.tasks || !Array.isArray(data.tasks)) {
      logger.error("Tasks data format error");
      return res.status(500).json({ errors: "Data format error" });
    }

    // Rechercher l'index de la tâche et vérifier la propriété
    const taskIndex = data.tasks.findIndex(
      (task) => task.id === id && task.user === req.session.user.username
    );

    if (taskIndex === -1) {
      return res.status(404).json({ errors: "Task not found or unauthorized" });
    }

    // Supprimer la tâche
    data.tasks.splice(taskIndex, 1);
    await writeData(config.dbPath, data);

    res.status(200)
    res.json({ msg : "Task deleted successfully"});
  } catch (err) {
    logger.error("Error deleting task:", err);
    res.status(500).json({ errors: "Internal server error" });
  }
};

module.exports = { addTask, getTasks, deleteTask };