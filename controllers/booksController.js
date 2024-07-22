// controllers/booksController.js
const booksService = require("../services/booksService");
const { AppError } = require("../middleware/errorMiddleware");

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
    const booksByAuthor = await booksService.getBooksByAuthor(author);
    res.status(200).json({
      status: "success",
      data: { books: booksByAuthor },
    });
  } catch (err) {
    next(new AppError("Error fetching books by author", 500));
  }
};

// Get books by genre
const getBooksByGenre = async (req, res, next) => {
  try {
    const { genre } = req.params;
    const booksByGenre = await booksService.getBooksByGenre(genre);
    res.status(200).json({
      status: "success",
      data: { books: booksByGenre },
    });
  } catch (err) {
    next(new AppError("Error fetching books by genre", 500));
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
const createBook = async (req, res, next) => {
  try {
    const newBook = await booksService.createBook(req.body);
    res.status(201).json({
      status: "success",
      data: { book: newBook },
    });
  } catch (err) {
    next(new AppError("Error creating book", 500));
  }
};

// Update a book
const updateBook = async (req, res, next) => {
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
    next(new AppError("Error updating book", 500));
  }
};

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
