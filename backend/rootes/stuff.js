const express = require("express");
const router = express.Router();
const auth = require("../middelware/auth");
const bookController = require("../controllers/stuff");
const multer = require("../middelware/multer-config");

router.get("/", auth, bookController.getAllBooks);
router.post("/", auth, multer, bookController.createBook);
router.get("/:id", auth, bookController.getOneBook);
router.put("/:id", auth, multer, bookController.modifyBook);
router.delete("/:id", auth, bookController.deleteBook);

module.exports = router;
