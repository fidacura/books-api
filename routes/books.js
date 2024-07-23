const express = require("express");
const router = express.Router();
const booksController = require("../controllers/booksController");
const {
  idParamValidator,
  isbnParamValidator,
  authorParamValidator,
  genreParamValidator,
  publisherParamValidator,
  titleParamValidator,
} = require("../validators/bookValidators");
const validateFields = require("../middleware/validateFields");

// Routes that return multiple books
router.get("/", booksController.getBooks);
router.get(
  "/author/:author",
  authorParamValidator,
  booksController.getBooksByAuthor
);
router.get(
  "/genre/:genre",
  genreParamValidator,
  booksController.getBooksByGenre
);
router.get(
  "/publisher/:publisher",
  publisherParamValidator,
  booksController.getBooksByPublisher
);
router.get(
  "/title/:title",
  titleParamValidator,
  booksController.getBooksByTitle
);

// Routes that return a single book based on a unique identifier
router.get("/id/:id", idParamValidator, booksController.getBookById);
router.get("/isbn/:isbn", isbnParamValidator, booksController.getBookByISBN);

// Create a new book
router.post("/", validateFields, booksController.createBook);

// Update a book
router.put(
  "/:id",
  idParamValidator,
  validateFields,
  booksController.updateBook
);

// Delete a book
router.delete("/:id", idParamValidator, booksController.deleteBook);

module.exports = router;
