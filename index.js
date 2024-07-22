// index.js
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const port = process.env.API_PORT || 4242;
const booksRouter = require("./routes/books");
const healthCheckRouter = require("./routes/healthCheck");
const { errorHandler } = require("./middleware/errorMiddleware");

app.use(express.json());

app.get("/", (req, res) => {
  res.sendStatus(200);
});

app.use("/books", booksRouter);
app.use("/health", healthCheckRouter);

// Use the error handling middleware
app.use(errorHandler);

app.listen(port, () => console.log(`Server running on port: ${port}`));
