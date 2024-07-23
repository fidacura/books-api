// services/booksService.js
const pool = require("../models/dbBooks");
const { AppError } = require("../middleware/errorMiddleware");

// Get all books
const getBooks = async () => {
  try {
    const { rows } = await pool.query("SELECT * FROM books");
    return rows;
  } catch (err) {
    throw new AppError("Error fetching books", 500);
  }
};

// Get books by author
const getBooksByAuthor = async (author) => {
  try {
    const { rows } = await pool.query(
      `SELECT DISTINCT b.* FROM books b
       JOIN book_authors ba ON b.book_id = ba.book_id
       JOIN authors a ON ba.author_id = a.author_id
       WHERE a.name ILIKE $1`,
      [`%${author}%`]
    );
    return rows;
  } catch (err) {
    console.error("Database error in getBooksByAuthor:", err);
    throw new AppError(`Error fetching books by author: ${err.message}`, 500);
  }
};

// Get books by category
const getBooksByCategory = async (category) => {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM books WHERE $1 = ANY(categories)",
      [category]
    );
    return rows;
  } catch (err) {
    throw new AppError(`Error fetching books by category: ${err.message}`, 500);
  }
};

// Get books by genre
const getBooksByGenre = async (genre) => {
  try {
    const { rows } = await pool.query(
      `SELECT DISTINCT b.* FROM books b
       JOIN book_genres bg ON b.book_id = bg.book_id
       JOIN genres g ON bg.genre_id = g.genre_id
       WHERE g.name ILIKE $1`,
      [`%${genre}%`]
    );
    return rows;
  } catch (err) {
    console.error("Database error in getBooksByGenre:", err);
    throw new AppError(`Error fetching books by genre: ${err.message}`, 500);
  }
};

// Get books by publisher
const getBooksByPublisher = async (publisher) => {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM books WHERE publisher ILIKE $1",
      [`%${publisher}%`]
    );
    return rows;
  } catch (err) {
    throw new AppError("Error fetching books by publisher", 500);
  }
};

// Get books by title
const getBooksByTitle = async (title) => {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM books WHERE title ILIKE $1",
      [`%${title}%`]
    );
    return rows;
  } catch (err) {
    throw new AppError("Error fetching books by title", 500);
  }
};

// Get book by ID
const getBookById = async (id) => {
  try {
    const { rows } = await pool.query(
      `
      SELECT b.*, array_agg(a.name) as authors
      FROM books b
      LEFT JOIN book_authors ba ON b.book_id = ba.book_id
      LEFT JOIN authors a ON ba.author_id = a.author_id
      WHERE b.book_id = $1
      GROUP BY b.book_id
    `,
      [id]
    );
    if (rows.length === 0) {
      throw new AppError("Book not found", 404);
    }
    console.log("Fetched book by ID:", JSON.stringify(rows[0], null, 2));
    return rows[0];
  } catch (err) {
    console.error("Error in getBookById:", err);
    if (err instanceof AppError) throw err;
    throw new AppError("Error fetching book by ID", 500);
  }
};

// Get book by ISBN
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

// Create a new book
const createBook = async (book) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const { rows } = await client.query(
      `INSERT INTO books (title, isbn, pages, publisher, publication_date, read_state, language, format)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [
        book.title,
        book.isbn,
        book.pages,
        book.publisher,
        book.publication_date,
        book.read_state,
        book.language,
        book.format,
      ]
    );
    const newBook = rows[0];

    for (let authorName of book.author) {
      let authorResult = await client.query(
        "SELECT author_id FROM authors WHERE name = $1",
        [authorName]
      );
      let authorId;
      if (authorResult.rows.length === 0) {
        const newAuthorResult = await client.query(
          "INSERT INTO authors (name) VALUES ($1) RETURNING author_id",
          [authorName]
        );
        authorId = newAuthorResult.rows[0].author_id;
      } else {
        authorId = authorResult.rows[0].author_id;
      }
      await client.query(
        "INSERT INTO book_authors (book_id, author_id) VALUES ($1, $2)",
        [newBook.book_id, authorId]
      );
    }

    await client.query("COMMIT");
    return newBook;
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};

// Update a book
const updateBook = async (id, book) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    console.log("Updating book with ID:", id);
    console.log("Update data:", JSON.stringify(book, null, 2));

    const updateFields = [];
    const updateValues = [];
    let parameterIndex = 1;

    for (const [key, value] of Object.entries(book)) {
      if (value !== undefined && key !== "author") {
        updateFields.push(`${key} = $${parameterIndex}`);
        updateValues.push(value);
        parameterIndex++;
      }
    }

    let updatedBook;
    if (updateFields.length > 0) {
      const query = `
        UPDATE books 
        SET ${updateFields.join(", ")}, 
            updated_at = CURRENT_TIMESTAMP
        WHERE book_id = $${parameterIndex}
        RETURNING *
      `;
      updateValues.push(id);
      console.log("Update query:", query);
      console.log("Update values:", updateValues);

      const { rows, rowCount } = await client.query(query, updateValues);
      console.log(`Number of rows updated: ${rowCount}`);
      console.log("Update result:", rows);

      if (rowCount === 0) {
        throw new AppError("Book not found", 404);
      }
      updatedBook = rows[0];
    } else {
      const { rows } = await client.query(
        "SELECT * FROM books WHERE book_id = $1",
        [id]
      );
      if (rows.length === 0) {
        throw new AppError("Book not found", 404);
      }
      updatedBook = rows[0];
    }

    // Handle author updates if provided
    if (book.author && Array.isArray(book.author)) {
      console.log("Updating authors");
      await client.query("DELETE FROM book_authors WHERE book_id = $1", [id]);

      for (let authorName of book.author) {
        let authorResult = await client.query(
          "SELECT author_id FROM authors WHERE name = $1",
          [authorName]
        );
        let authorId;
        if (authorResult.rows.length === 0) {
          const newAuthorResult = await client.query(
            "INSERT INTO authors (name) VALUES ($1) RETURNING author_id",
            [authorName]
          );
          authorId = newAuthorResult.rows[0].author_id;
        } else {
          authorId = authorResult.rows[0].author_id;
        }
        await client.query(
          "INSERT INTO book_authors (book_id, author_id) VALUES ($1, $2)",
          [id, authorId]
        );
      }
    }

    // Fetch the updated book with author information
    const { rows } = await client.query(
      `
      SELECT b.*, array_agg(a.name) as authors
      FROM books b
      LEFT JOIN book_authors ba ON b.book_id = ba.book_id
      LEFT JOIN authors a ON ba.author_id = a.author_id
      WHERE b.book_id = $1
      GROUP BY b.book_id
      `,
      [id]
    );

    if (rows.length === 0) {
      throw new AppError("Updated book not found", 404);
    }

    await client.query("COMMIT");
    console.log("Transaction committed");
    console.log("Final fetched book:", rows[0]);
    return rows[0];
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Error in updateBook:", err);
    if (err instanceof AppError) throw err;
    throw new AppError(`Error updating book: ${err.message}`, 500);
  } finally {
    client.release();
  }
};

// Delete a book
const deleteBook = async (id) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await client.query("DELETE FROM book_authors WHERE book_id = $1", [id]);
    await client.query("DELETE FROM book_genres WHERE book_id = $1", [id]);
    const { rowCount } = await client.query(
      "DELETE FROM books WHERE book_id = $1",
      [id]
    );
    await client.query("COMMIT");
    if (rowCount === 0) {
      throw new AppError("Book not found", 404);
    }
    return true;
  } catch (err) {
    await client.query("ROLLBACK");
    if (err instanceof AppError) throw err;
    throw new AppError("Error deleting book", 500);
  } finally {
    client.release();
  }
};

module.exports = {
  getBooks,
  getBooksByAuthor,
  getBooksByCategory,
  getBooksByGenre,
  getBooksByPublisher,
  getBooksByTitle,
  getBookById,
  getBookByISBN,
  createBook,
  updateBook,
  deleteBook,
};
