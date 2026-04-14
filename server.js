const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"]
  }
});

app.use(cors());
app.use(express.json());

// Rendre io accessible dans les contrôleurs
app.set("io", io);

// FAKE AUTH
app.use((req, res, next) => {
  req.user = { id: new mongoose.Types.ObjectId() };
  next();
});

// Routes
const taskRoutes = require("./routes/taskRoutes");
app.use("/api", taskRoutes);

// WebSocket
io.on("connection", (socket) => {
  console.log("Client connecté:", socket.id);

  socket.on("disconnect", () => {
    console.log("Client déconnecté:", socket.id);
  });
});

// Connexion MongoDB puis démarrage du serveur
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/lab2_tasks";
const PORT = process.env.PORT || 3000;

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log("Connecté à MongoDB");
    server.listen(PORT, () => {
      console.log(`Serveur lancé sur port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Erreur de connexion MongoDB:", err.message);
    process.exit(1);
  });
