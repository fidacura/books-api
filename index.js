const express = require("express");
const helmet = require("helmet");
const app = express();
const bodyParser = require("body-parser");
const port = process.env.API_PORT || 4242;
const booksRouter = require("./routes/books");
const healthCheckRouter = require("./routes/healthCheck");
const { errorHandler } = require("./middleware/errorMiddleware");

app.use(express.json());
app.use(helmet());

app.get("/", (req, res) => {
  res.sendStatus(200);
});

app.use("/books", booksRouter);
app.use("/health", healthCheckRouter);

// use the error handler middleware
app.use(errorHandler);

// only start the server if we're not in a test environment
if (process.env.NODE_ENV !== "test") {
  app.listen(port, () => console.log(`Server running on port: ${port}`));
}

module.exports = app;
