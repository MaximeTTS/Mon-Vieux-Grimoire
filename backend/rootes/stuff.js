const express = require("express");
const router = express.Router();
const auth = require("../middelware/auth");
const bookController = require("../controllers/stuff");
const multer = require("../middelware/multer-config");

router.get("/", auth, bookController.getAllBooks);
router.get('/bestrating', bookController.getBestRating);
router.get("/:id", auth, bookController.getOneBook);
router.post('/:id/rating', auth, bookController.rateBook);
router.post("/", auth, multer, bookController.createBook);
router.put("/:id", auth, multer, bookController.modifyBook);
router.delete("/:id", auth, bookController.deleteBook);

module.exports = router;
