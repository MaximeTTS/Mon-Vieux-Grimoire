const express = require("express");
const mongoose = require("mongoose");
const app = express();
const stuffRoutes = require("./rootes/stuff");
const bodyParser = require("body-parser");
const userRoutes = require("./rootes/user");
const path = require("path");
const cors = require('cors')
require('dotenv').config();

mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch((error) => console.log("Connexion à MongoDB échouée !", error));

app.use(cors());

app.use(express.json());
app.use("/api/stuff", stuffRoutes);
app.use("/api/auth", userRoutes);
app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/api/books", stuffRoutes);

module.exports = app;
