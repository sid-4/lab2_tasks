const Task = require("../models/Task");

exports.createTask = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Non authentifié" });
    }

    const { title, description, done, priority, assignedUserId } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Le titre est requis" });
    }

    const newTask = await Task.create({
      title,
      description: description || "",
      done: done ?? false,
      priority: priority || "medium",
      userId: req.user.id,
      assignedUserId: assignedUserId || null
    });

    // Émettre l'événement WebSocket
    const io = req.app.get("io");
    io.emit("taskCreated", newTask);

    return res.status(201).json(newTask);
  } catch (error) {
    return res.status(500).json({ message: "Erreur serveur" });
  }
};

exports.getTasks = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Non authentifié" });
    }

    const userTasks = await Task.find({
      $or: [
        { userId: req.user.id },
        { assignedUserId: req.user.id }
      ]
    }).sort({ createdAt: -1 });

    return res.status(200).json(userTasks);
  } catch (error) {
    return res.status(500).json({ message: "Erreur serveur" });
  }
};

exports.updateTask = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Non authentifié" });
    }

    const { id } = req.params;
    const updates = req.body;

    const task = await Task.findOneAndUpdate(
      { _id: id, userId: req.user.id },
      updates,
      { new: true, runValidators: true }
    );

    if (!task) {
      return res.status(404).json({ message: "Tâche non trouvée" });
    }

    // Émettre l'événement WebSocket
    const io = req.app.get("io");
    io.emit("taskUpdated", task);

    return res.status(200).json(task);
  } catch (error) {
    return res.status(500).json({ message: "Erreur serveur" });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Non authentifié" });
    }

    const { id } = req.params;

    const task = await Task.findOneAndDelete({ _id: id, userId: req.user.id });

    if (!task) {
      return res.status(404).json({ message: "Tâche non trouvée" });
    }

    // Émettre l'événement WebSocket
    const io = req.app.get("io");
    io.emit("taskDeleted", { _id: id });

    return res.status(200).json({ message: "Tâche supprimée" });
  } catch (error) {
    return res.status(500).json({ message: "Erreur serveur" });
  }
};
