const request = require("supertest");
const app = require("../index");
const pool = require("../models/dbBooks");

describe("Book Endpoints", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /books", () => {
    it("should get all books", async () => {
      const mockBooks = [{ id: 1, title: "Test Book" }];
      pool.query.mockResolvedValue({ rows: mockBooks });

      const res = await request(app).get("/books");

      expect(res.statusCode).toBe(200);
      expect(res.body.data.books).toEqual(mockBooks);
    });
  });

  describe("GET /books/id/:id", () => {
    it("should get a book by ID", async () => {
      const mockBook = { id: 1, title: "Test Book" };
      pool.query.mockResolvedValue({ rows: [mockBook] });

      const res = await request(app).get("/books/id/1");

      expect(res.statusCode).toBe(200);
      expect(res.body.data.book).toEqual(mockBook);
    });

    it("should return 404 for non-existent book", async () => {
      pool.query.mockResolvedValue({ rows: [] });

      const res = await request(app).get("/books/id/999");

      expect(res.statusCode).toBe(404);
      expect(res.body.status).toBe("fail");
      expect(res.body.message).toBe("Book not found");
    });
  });

  describe("POST /books", () => {
    it("should create a new book", async () => {
      const newBook = {
        title: "New Book",
        author: ["Test Author"],
        isbn: "1234567890",
        pages: 200,
        publisher: "Test Publisher",
        publication_date: "2023-01-01",
        read_state: "unread",
      };

      // Mock the book insertion
      pool.query.mockResolvedValueOnce({ rows: [{ book_id: 1, ...newBook }] });
      // Mock the author check (author doesn't exist)
      pool.query.mockResolvedValueOnce({ rows: [] });
      // Mock the author insertion
      pool.query.mockResolvedValueOnce({ rows: [{ author_id: 1 }] });
      // Mock the book-author link insertion
      pool.query.mockResolvedValueOnce({ rows: [] });
      // Mock the final book fetch
      pool.query.mockResolvedValueOnce({
        rows: [{ ...newBook, book_id: 1, authors: ["Test Author"] }],
      });

      const res = await request(app).post("/books").send(newBook);

      expect(res.statusCode).toBe(201);
      expect(res.body.data.book).toMatchObject({
        ...newBook,
        book_id: 1,
        authors: ["Test Author"],
      });
    });

    it("should return 400 for invalid book data", async () => {
      const invalidBook = { title: "" };

      const res = await request(app).post("/books").send(invalidBook);

      expect(res.statusCode).toBe(400);
    });
  });
});
