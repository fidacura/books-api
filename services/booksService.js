// services/bookService.js
const pool = require("../models/dbBooks");
const { AppError } = require("../middleware/errorMiddleware");

const getBooks = async () => {
  try {
    const { rows } = await pool.query("SELECT * FROM books");
    return rows;
  } catch (err) {
    throw new AppError("Error fetching books", 500);
  }
};

const getBooksByAuthor = async (author) => {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM books WHERE author ILIKE $1",
      [`%${author}%`]
    );
    return rows;
  } catch (err) {
    console.error("Database error in getBooksByAuthor:", err); // Add this line for debugging
    throw new AppError(`Error fetching books by author: ${err.message}`, 500);
  }
};

const getBooksByGenre = async (genre) => {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM books WHERE genre ILIKE $1",
      [`%${genre}%`]
    );
    return rows;
  } catch (err) {
    console.error("Database error in getBooksByGenre:", err); // Add this line for debugging
    throw new AppError(`Error fetching books by genre: ${err.message}`, 500);
  }
};

const getBooksByPublisher = async (publisher) => {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM books WHERE publisher = $1",
      [publisher]
    );
    return rows;
  } catch (err) {
    throw new AppError("Error fetching books by publisher", 500);
  }
};

const getBooksByTitle = async (title) => {
  try {
    const { rows } = await pool.query("SELECT * FROM books WHERE title = $1", [
      title,
    ]);
    return rows;
  } catch (err) {
    throw new AppError("Error fetching books by title", 500);
  }
};

const getBookById = async (id) => {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM books WHERE book_id = $1",
      [id]
    );
    if (rows.length === 0) {
      throw new AppError("Book not found", 404);
    }
    return rows[0];
  } catch (err) {
    if (err instanceof AppError) throw err;
    throw new AppError("Error fetching book by ID", 500);
  }
};

const getBookByISBN = async (isbn) => {
  try {
    const { rows } = await pool.query("SELECT * FROM books WHERE isbn = $1", [
      isbn,
    ]);
    if (rows.length === 0) {
      throw new AppError("Book not found", 404);
    }
    return rows[0];
  } catch (err) {
    if (err instanceof AppError) throw err;
    throw new AppError("Error fetching book by ISBN", 500);
  }
};

const createBook = async (book) => {
  const {
    title,
    author,
    genre,
    isbn,
    pages,
    publisher,
    published,
    read_state,
    opening_line,
    language,
    edition,
  } = book;

  console.log("Creating book with data:", book); // Add this line

  if (!title || !pages || !publisher || !published || !read_state) {
    console.log("Missing required fields"); // Add this line
    throw new AppError(
      "Missing mandatory fields: title, pages, publisher, published, and read_state are required.",
      400
    );
  }

  try {
    const { rows } = await pool.query(
      "INSERT INTO books (title, author, genre, isbn, pages, publisher, published, read_state, opening_line, language, edition) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *",
      [
        title,
        author,
        genre,
        isbn,
        pages,
        publisher,
        published,
        read_state,
        opening_line,
        language,
        edition,
      ]
    );
    return rows[0];
  } catch (err) {
    console.error("Database error in createBook:", err); // Add this line
    if (err.code === "23505") {
      throw new AppError("A book with this ISBN already exists", 409);
    }
    throw new AppError("Error creating book", 500);
  }
};

const updateBook = async (id, book) => {
  const {
    title,
    isbn,
    pages,
    publisher,
    published,
    read_state,
    opening_line,
    language,
    edition,
  } = book;

  if (!title || !pages || !publisher || !published || !read_state) {
    throw new AppError(
      "Missing mandatory fields: title, pages, publisher, published, and read_state are required.",
      400
    );
  }

  try {
    const { rows } = await pool.query(
      "UPDATE books SET title = $1, isbn = $2, pages = $3, publisher = $4, published = $5, read_state = $6, opening_line = $7, language = $8, edition = $9 WHERE book_id = $10 RETURNING *",
      [
        title,
        isbn,
        pages,
        publisher,
        published,
        read_state,
        opening_line,
        language,
        edition,
        id,
      ]
    );
    if (rows.length === 0) {
      throw new AppError("Book not found", 404);
    }
    return rows[0];
  } catch (err) {
    if (err instanceof AppError) throw err;
    if (err.code === "23505") {
      // Unique violation
      throw new AppError("A book with this ISBN already exists", 409);
    }
    throw new AppError("Error updating book", 500);
  }
};

const deleteBook = async (id) => {
  try {
    const { rowCount } = await pool.query(
      "DELETE FROM books WHERE book_id = $1",
      [id]
    );
    if (rowCount === 0) {
      throw new AppError("Book not found", 404);
    }
    return true;
  } catch (err) {
    if (err instanceof AppError) throw err;
    throw new AppError("Error deleting book", 500);
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
