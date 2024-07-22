// validators/bookValidators.js

const { body, param } = require("express-validator");

const createBookValidators = [
  body("title").notEmpty().withMessage("Title is required"),
  body("isbn").optional().isISBN().withMessage("Invalid ISBN"),
  body("pages")
    .isInt({ min: 1 })
    .withMessage("Pages must be a positive integer"),
  body("publisher").notEmpty().withMessage("Publisher is required"),
  body("published")
    .isISO8601()
    .withMessage("Published date must be a valid date"),
  body("read_state")
    .isIn(["read", "unread", "in-progress"])
    .withMessage("Invalid read state"),
  body("opening_line").optional(),
  body("language").optional(),
  body("edition")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Edition must be a positive integer"),
];

const updateBookValidators = [
  param("id").isInt({ min: 1 }).withMessage("Invalid book ID"),
  ...createBookValidators,
];

const idParamValidator = [
  param("id").isInt({ min: 1 }).withMessage("Invalid book ID"),
];

const isbnParamValidator = [param("isbn").isISBN().withMessage("Invalid ISBN")];

module.exports = {
  createBookValidators,
  updateBookValidators,
  idParamValidator,
  isbnParamValidator,
};
