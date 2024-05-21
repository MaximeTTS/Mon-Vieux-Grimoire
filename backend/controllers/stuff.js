const Book = require("../models/Book");
const fs = require("fs");

exports.createBook = (req, res, next) => {
  const bookObject = JSON.parse(req.body.book);
  delete bookObject._id;
  delete bookObject._userId;
  const book = new Book({
    ...bookObject,
    userId: req.auth.userId,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
  });

  book
    .save()
    .then(() => res.status(201).json({ message: "Livre enregistré !" }))
    .catch((error) => res.status(400).json({ error }));
};

exports.getOneBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => res.status(200).json(book))
    .catch((error) => res.status(404).json({ error }));
};

exports.modifyBook = (req, res, next) => {
  const bookObject = req.file
    ? {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
      }
    : { ...req.body };

  delete bookObject._userId;

  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (book.userId != req.auth.userId) {
        return res.status(401).json({ message: "Non autorisé" });
      }

      const oldImageUrl = book.imageUrl;

      Book.updateOne({ _id: req.params.id }, { ...bookObject, _id: req.params.id })
        .then(() => {
          if (req.file) {
            const oldFilename = oldImageUrl.split('/images/')[1];
            fs.unlink(`images/${oldFilename}`, (err) => {
              if (err) console.log(err);
            });
          }
          res.status(200).json({ message: "Livre modifié !" });
        })
        .catch((error) => res.status(401).json({ error }));
    })
    .catch((error) => res.status(400).json({ error }));
};

exports.deleteBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (book.userId != req.auth.userId) {
        res.status(401).json({ message: "Non autorisé" });
      } else {
        const filename = book.imageUrl.split("/images/")[1];
        fs.unlink(`images/${filename}`, () => {
          Book.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: "Livre supprimé !" }))
            .catch((error) => res.status(401).json({ error }));
        });
      }
    })
    .catch((error) => res.status(500).json({ error }));
};

exports.getAllBooks = (req, res, next) => {
  Book.find()
    .then((books) => res.status(200).json(books))
    .catch((error) => res.status(400).json({ error }));
};

exports.rateBook = async (req, res, next) => {
  const { userId, rating } = req.body;

  if (userId !== req.auth.userId) {
    return res.status(401).json({ message: 'Unauthorized: You cannot rate on behalf of another user.' });
  }

  if (rating < 0 || rating > 5) {
    return res.status(400).json({ message: "Rating must be between 0 and 5." });
  }

  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    const existingRating = book.ratings.find(r => r.userId === userId);
    if (existingRating) {
      return res.status(400).json({ message: "User has already rated this book" });
    }

    book.ratings.push({ userId: userId, grade: rating });

    const totalRatings = book.ratings.length;
    const sumRatings = book.ratings.reduce((acc, cur) => acc + cur.grade, 0);
    book.averageRating = (sumRatings / totalRatings).toFixed(1);

    await book.save();
    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ message: "Error processing your request", error });
  }
};

exports.getBestRating = (req, res, next) => {
  Book.find().sort({ averageRating: -1 }).limit(3)
    .then(books => res.status(200).json(books))
    .catch(error => res.status(400).json({ error }));
};