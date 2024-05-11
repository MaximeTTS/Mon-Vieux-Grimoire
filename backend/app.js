const express = require("express");
const mongoose = require("mongoose");
const app = express();
const stuffRoutes = require("./rootes/stuff");
const bodyParser = require("body-parser");
const userRoutes = require("./rootes/user");
const path = require("path");

mongoose
  .connect("mongodb+srv://maxime:maxime@monvieuxgrimoire.jgcbjqa.mongodb.net/?retryWrites=true&w=majority&appName=MonVieuxGrimoire", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch((error) => console.log("Connexion à MongoDB échouée !", error));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
  next();
});

app.use(express.json());
app.use("/api/stuff", stuffRoutes);
app.use("/api/auth", userRoutes);
app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/api/books", stuffRoutes);

module.exports = app;