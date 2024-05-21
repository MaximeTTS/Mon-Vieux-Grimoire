const multer = require("multer");
const sharp = require("sharp");
const path = require("path");

const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
};

const storage = multer.memoryStorage();

const upload = multer({ storage: storage }).single("image");

const processImage = (req, res, next) => {
  if (!req.file) {
    return next();
  }

  const extension = MIME_TYPES[req.file.mimetype];
  const filename = req.file.originalname.split(" ").join("_") + Date.now() + "." + extension;
  const filepath = path.join("images", filename);

  sharp(req.file.buffer)
    .resize(800)
    .toFormat(extension, { quality: 80 })
    .toFile(filepath, (err, info) => {
      if (err) {
        return next(err);
      }
      req.file.filename = filename;
      next();
    });
};

module.exports = { upload, processImage };