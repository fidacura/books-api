jest.mock("../models/dbBooks");
const booksService = require("../services/booksService");
const pool = require("../models/dbBooks");

describe("Books Service", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should get all books", async () => {
    const mockBooks = [{ id: 1, title: "Test Book" }];
    pool.query.mockResolvedValue({ rows: mockBooks });

    const result = await booksService.getBooks();
    expect(result).toEqual(mockBooks);
    expect(pool.query).toHaveBeenCalledWith("SELECT * FROM books");
  });

  // Add more tests for other service methods
});
