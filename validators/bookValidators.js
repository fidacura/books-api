// validators/bookValidators.js
const { body, param } = require("express-validator");

const createBookValidators = [
  body("title").notEmpty().withMessage("Title is required"),
  body("author")
    .isArray()
    .withMessage("Author must be an array")
    .notEmpty()
    .withMessage("At least one author is required"),
  body("genre").optional().isString().withMessage("Invalid genre"),
  body("isbn")
    .optional()
    .isLength({ min: 10, max: 13 })
    .withMessage("ISBN must be between 10 and 13 characters long")
    .matches(/^[0-9-]+$/)
    .withMessage("ISBN must contain only numbers and hyphens"),
  body("pages")
    .isInt({ min: 1 })
    .withMessage("Pages must be a positive integer"),
  body("publisher").notEmpty().withMessage("Publisher is required"),
  body("publication_date").isISO8601().withMessage("Invalid publication date"),
  body("read_state")
    .isIn(["read", "unread", "in-progress"])
    .withMessage("Invalid read state"),
  body("opening_line").optional(),
  body("language").optional(),
  body("format").optional().isString().withMessage("Invalid format"),
  body("rating")
    .optional()
    .isFloat({ min: 0, max: 5 })
    .withMessage("Rating must be between 0 and 5"),
  body("categories")
    .optional()
    .isArray()
    .withMessage("Categories must be an array"),
];

const updateBookValidators = [
  param("id").isInt({ min: 1 }).withMessage("Invalid book ID"),
  body("title").optional().notEmpty().withMessage("Title cannot be empty"),
  body("author")
    .optional()
    .isArray()
    .withMessage("Author must be an array")
    .notEmpty()
    .withMessage("At least one author is required"),
  body("genre").optional().isString().withMessage("Invalid genre"),
  body("isbn")
    .optional()
    .isLength({ min: 10, max: 13 })
    .withMessage("ISBN must be between 10 and 13 characters long")
    .matches(/^[0-9-]+$/)
    .withMessage("ISBN must contain only numbers and hyphens"),
  body("pages")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Pages must be a positive integer"),
  body("publisher")
    .optional()
    .notEmpty()
    .withMessage("Publisher cannot be empty"),
  body("publication_date")
    .optional()
    .isISO8601()
    .withMessage("Invalid publication date"),
  body("read_state")
    .optional()
    .isIn(["read", "unread", "in-progress"])
    .withMessage("Invalid read state"),
  body("opening_line").optional(),
  body("language").optional(),
  body("format").optional().isString().withMessage("Invalid format"),
  body("rating")
    .optional()
    .isFloat({ min: 0, max: 5 })
    .withMessage("Rating must be between 0 and 5"),
  body("categories")
    .optional()
    .isArray()
    .withMessage("Categories must be an array"),
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
