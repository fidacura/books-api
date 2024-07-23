const { Pool } = require("pg");

// Mock the database pool
jest.mock("./models/dbBooks", () => ({
  query: jest.fn(),
}));

// Global setup
global.beforeAll(async () => {
  // any global setup we need
});

// Global teardown
global.afterAll(async () => {
  // any global teardown you need
});
