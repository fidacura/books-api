// validators/bookValidators.js
const { body, param } = require("express-validator");
const xss = require("xss");
const sanitizeHtml = require("sanitize-html");

const sanitizeString = (value) => {
  if (typeof value !== "string") return value;
  return sanitizeHtml(xss(value.trim()), {
    allowedTags: [],
    allowedAttributes: {},
  });
};

const createBookValidators = [
  body("title")
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ max: 255 })
    .withMessage("Title must not exceed 255 characters")
    .customSanitizer(sanitizeString),
  body("author")
    .isArray()
    .withMessage("Author must be an array")
    .notEmpty()
    .withMessage("At least one author is required")
    .custom((value) => value.every((author) => typeof author === "string"))
    .withMessage("Each author must be a string")
    .customSanitizer((value) => value.map(sanitizeString)),
  body("isbn")
    .optional()
    .isString()
    .withMessage("ISBN must be a string")
    .customSanitizer((value) => value.replace(/[-\s]/g, ""))
    .isLength({ min: 10, max: 13 })
    .withMessage("ISBN must be between 10 and 13 characters long")
    .matches(/^[0-9]+$/)
    .withMessage("ISBN must contain only numbers"),
  body("pages")
    .isInt({ min: 1 })
    .withMessage("Pages must be a positive integer")
    .toInt(),
  body("publisher")
    .notEmpty()
    .withMessage("Publisher is required")
    .isLength({ max: 255 })
    .withMessage("Publisher must not exceed 255 characters")
    .customSanitizer(sanitizeString),
  body("publication_date")
    .isISO8601()
    .withMessage("Invalid publication date")
    .toDate(),
  body("read_state")
    .isIn(["read", "unread", "in-progress"])
    .withMessage("Invalid read state"),
  body("opening_line")
    .optional()
    .isString()
    .withMessage("Opening line must be a string")
    .customSanitizer(sanitizeString),
  body("language")
    .optional()
    .isString()
    .withMessage("Language must be a string")
    .isLength({ max: 50 })
    .withMessage("Language must not exceed 50 characters")
    .customSanitizer(sanitizeString),
  body("format")
    .optional()
    .isString()
    .withMessage("Format must be a string")
    .isLength({ max: 50 })
    .withMessage("Format must not exceed 50 characters")
    .customSanitizer(sanitizeString),
  body("rating")
    .optional()
    .isFloat({ min: 0, max: 5 })
    .withMessage("Rating must be between 0 and 5")
    .toFloat(),
  body("description")
    .optional()
    .isString()
    .withMessage("Description must be a string")
    .customSanitizer(sanitizeString),
];

const updateBookValidators = [
  param("id").isInt({ min: 1 }).withMessage("Invalid book ID").toInt(),
  ...createBookValidators.map((validator) => validator.optional()),
];

const idParamValidator = [
  param("id").isInt({ min: 1 }).withMessage("Invalid book ID").toInt(),
];

const isbnParamValidator = [
  param("isbn")
    .isString()
    .withMessage("ISBN must be a string")
    .customSanitizer((value) => value.replace(/[-\s]/g, ""))
    .isLength({ min: 10, max: 13 })
    .withMessage("ISBN must be between 10 and 13 characters long")
    .matches(/^[0-9]+$/)
    .withMessage("ISBN must contain only numbers"),
];

const authorParamValidator = [
  param("author")
    .notEmpty()
    .withMessage("Author parameter is required")
    .isString()
    .withMessage("Author must be a string")
    .customSanitizer(sanitizeString),
];

const genreParamValidator = [
  param("genre")
    .notEmpty()
    .withMessage("Genre parameter is required")
    .isString()
    .withMessage("Genre must be a string")
    .customSanitizer(sanitizeString),
];

const publisherParamValidator = [
  param("publisher")
    .notEmpty()
    .withMessage("Publisher parameter is required")
    .isString()
    .withMessage("Publisher must be a string")
    .customSanitizer(sanitizeString),
];

const titleParamValidator = [
  param("title")
    .notEmpty()
    .withMessage("Title parameter is required")
    .isString()
    .withMessage("Title must be a string")
    .customSanitizer(sanitizeString),
];

module.exports = {
  createBookValidators,
  updateBookValidators,
  idParamValidator,
  isbnParamValidator,
  authorParamValidator,
  genreParamValidator,
  publisherParamValidator,
  titleParamValidator,
};
