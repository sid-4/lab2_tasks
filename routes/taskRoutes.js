const express = require("express");
const router = express.Router();

const {
  createTask,
  getTasks,
  updateTask,
  deleteTask
} = require("../controllers/taskController");

// POST /tasks
router.post("/tasks", createTask);

// GET /tasks
router.get("/tasks", getTasks);

// PUT /tasks/:id
router.put("/tasks/:id", updateTask);

// DELETE /tasks/:id
router.delete("/tasks/:id", deleteTask);

module.exports = router;
