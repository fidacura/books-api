const pool = require("../models/dbBooks");

const getBooks = async () => {
  const { rows } = await pool.query("SELECT * FROM books");
  return rows;
};

const getBooksByAuthor = async (author) => {
  const { rows } = await pool.query("SELECT * FROM books WHERE author = $1", [
    author,
  ]);
  return rows;
};

const getBooksByGenre = async (genre) => {
  const { rows } = await pool.query("SELECT * FROM books WHERE genre = $1", [
    genre,
  ]);
  return rows;
};

const getBooksByPublisher = async (publisher) => {
  const { rows } = await pool.query(
    "SELECT * FROM books WHERE publisher = $1",
    [publisher]
  );
  return rows;
};

const getBooksByTitle = async (title) => {
  const { rows } = await pool.query("SELECT * FROM books WHERE title = $1", [
    title,
  ]);
  return rows;
};

const getBookById = async (id) => {
  const { rows } = await pool.query("SELECT * FROM books WHERE book_id = $1", [
    id,
  ]);
  return rows[0];
};

const getBookByISBN = async (isbn) => {
  const { rows } = await pool.query("SELECT * FROM books WHERE isbn = $1", [
    isbn,
  ]);
  return rows[0];
};

const createBook = async (book) => {
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

  // Check for mandatory fields
  if (!title || !pages || !publisher || !published || !read_state) {
    throw new Error(
      "Missing mandatory fields: title, pages, publisher, published, and read_state are required."
    );
  }

  const { rows } = await pool.query(
    "INSERT INTO books (title, isbn, pages, publisher, published, read_state, opening_line, language, edition) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *",
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
    ]
  );
  return rows[0];
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

  // Check for mandatory fields
  if (!title || !pages || !publisher || !published || !read_state) {
    throw new Error(
      "Missing mandatory fields: title, pages, publisher, published, and read_state are required."
    );
  }

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
  return rows[0];
};

const deleteBook = async (id) => {
  await pool.query("DELETE FROM books WHERE book_id = $1", [id]);
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
