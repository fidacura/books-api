// controllers/booksController.js
const booksService = require("../services/booksService");
const { validationResult } = require("express-validator");
const { AppError } = require("../middleware/errorMiddleware");
const {
  createBookValidators,
  updateBookValidators,
} = require("../validators/bookValidators");

const checkValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log("Validation errors:", errors.array()); // Add this line
    return res.status(400).json({
      status: "fail",
      message: "Validation error",
      errors: errors.array(),
    });
  }
  next();
};

// Get all books
const getBooks = async (req, res, next) => {
  try {
    const books = await booksService.getBooks();
    res.status(200).json({
      status: "success",
      data: { books },
    });
  } catch (err) {
    next(new AppError("Error fetching books", 500));
  }
};

// Get books by author
const getBooksByAuthor = async (req, res, next) => {
  try {
    const { author } = req.params;
    console.log("Fetching books for author:", author); // Add this line for debugging
    const booksByAuthor = await booksService.getBooksByAuthor(author);
    res.status(200).json({
      status: "success",
      data: { books: booksByAuthor },
    });
  } catch (err) {
    console.error("Error in getBooksByAuthor:", err); // Add this line for debugging
    next(new AppError(`Error fetching books by author: ${err.message}`, 500));
  }
};

// Get books by genre
const getBooksByGenre = async (req, res, next) => {
  try {
    const { genre } = req.params;
    console.log("Fetching books for genre:", genre); // Add this line for debugging
    const booksByGenre = await booksService.getBooksByGenre(genre);
    res.status(200).json({
      status: "success",
      data: { books: booksByGenre },
    });
  } catch (err) {
    console.error("Error in getBooksByGenre:", err); // Add this line for debugging
    next(new AppError(`Error fetching books by genre: ${err.message}`, 500));
  }
};

// Get books by publisher
const getBooksByPublisher = async (req, res, next) => {
  try {
    const { publisher } = req.params;
    const booksByPublisher = await booksService.getBooksByPublisher(publisher);
    res.status(200).json({
      status: "success",
      data: { books: booksByPublisher },
    });
  } catch (err) {
    next(new AppError("Error fetching books by publisher", 500));
  }
};

// Get books by title
const getBooksByTitle = async (req, res, next) => {
  try {
    const { title } = req.params;
    const booksByTitle = await booksService.getBooksByTitle(title);
    res.status(200).json({
      status: "success",
      data: { books: booksByTitle },
    });
  } catch (err) {
    next(new AppError("Error fetching books by title", 500));
  }
};

// Get book by ID
const getBookById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const book = await booksService.getBookById(id);
    if (!book) {
      return next(new AppError("Book not found", 404));
    }
    res.status(200).json({
      status: "success",
      data: { book },
    });
  } catch (err) {
    if (err.name === "DatabaseError") {
      return next(new AppError("Database error occurred", 500));
    }
    next(new AppError("Error fetching book by ID", 500));
  }
};

// Get book by ISBN
const getBookByISBN = async (req, res, next) => {
  try {
    const { isbn } = req.params;
    const book = await booksService.getBookByISBN(isbn);
    if (!book) {
      return next(new AppError("Book not found", 404));
    }
    res.status(200).json({
      status: "success",
      data: { book },
    });
  } catch (err) {
    next(new AppError("Error fetching book by ISBN", 500));
  }
};

// Create a new book
const createBook = [
  ...createBookValidators,
  checkValidationErrors,
  async (req, res, next) => {
    try {
      console.log("Received book data:", req.body); // Add this line
      const newBook = await booksService.createBook(req.body);
      res.status(201).json({
        status: "success",
        data: { book: newBook },
      });
    } catch (err) {
      console.error("Error in createBook:", err); // Add this line
      if (err.code === "23505") {
        return next(new AppError("A book with this ISBN already exists", 409));
      }
      if (err.name === "ValidationError") {
        return next(new AppError(err.message, 422));
      }
      next(new AppError("Error creating book", 500));
    }
  },
];

// Update a book
const updateBook = [
  ...updateBookValidators,
  checkValidationErrors,
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const updatedBook = await booksService.updateBook(id, req.body);
      if (!updatedBook) {
        return next(new AppError("Book not found", 404));
      }
      res.status(200).json({
        status: "success",
        data: { book: updatedBook },
      });
    } catch (err) {
      if (err.name === "ValidationError") {
        return next(new AppError(err.message, 422));
      }
      if (err.code === "23505") {
        // Unique violation in PostgreSQL
        return next(new AppError("A book with this ISBN already exists", 409));
      }
      next(new AppError("Error updating book", 500));
    }
  },
];

// Delete a book
const deleteBook = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await booksService.deleteBook(id);
    if (!result) {
      return next(new AppError("Book not found", 404));
    }
    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (err) {
    next(new AppError("Error deleting book", 500));
  }
};

module.exports = {
  getBooks,
  getBooksByAuthor,
  getBooksByGenre,
  getBooksByPublisher,
  getBooksByTitle,
  getBookById,
  getBookByISBN,
  createBook,
  updateBook,
  deleteBook,
};
