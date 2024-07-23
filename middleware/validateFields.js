// middleware/validateFields.js
const allowedFields = [
  "title",
  "author",
  "isbn",
  "pages",
  "publisher",
  "publication_date",
  "read_state",
  "opening_line",
  "language",
  "format",
  "rating",
  "description",
];

const validateFields = (req, res, next) => {
  const unexpectedFields = Object.keys(req.body).filter(
    (field) => !allowedFields.includes(field)
  );
  if (unexpectedFields.length > 0) {
    return res
      .status(400)
      .json({ error: `Unexpected fields: ${unexpectedFields.join(", ")}` });
  }
  next();
};

module.exports = validateFields;
