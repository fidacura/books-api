// index.js
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const port = process.env.API_PORT || 4242;
const booksRouter = require("./routes/books");

app.use(express.json());

app.get("/", (req, res) => {
  res.sendStatus(200);
});

app.use("/books", booksRouter);

app.listen(port, () => console.log(`Server running on port: ${port}`));
