const { Pool } = require("pg");

const pool = new Pool({
  user: process.env.POSTGRES_BOOKS_USER,
  host: process.env.POSTGRES_BOOKS_HOST,
  database: process.env.POSTGRES_BOOKS_DB,
  password: process.env.POSTGRES_BOOKS_PASSWORD,
  port: 5432,
});

module.exports = pool;
