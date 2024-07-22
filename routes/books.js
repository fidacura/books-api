const express = require("express");
const router = express.Router();
const booksController = require("../controllers/booksController");

// Routes that return multiple books
router.get("/", booksController.getBooks);
router.get("/author/:author", booksController.getBooksByAuthor);
router.get("/genre/:genre", booksController.getBooksByGenre);
router.get("/publisher/:publisher", booksController.getBooksByPublisher);
router.get("/title/:title", booksController.getBooksByTitle);

// Routes that return a single book based on a unique identifier
router.get("/id/:id", booksController.getBookById);
router.get("/isbn/:isbn", booksController.getBookByISBN);

router.post("/", booksController.createBook);
router.put("/:id", booksController.updateBook);
router.delete("/:id", booksController.deleteBook);

module.exports = router;
