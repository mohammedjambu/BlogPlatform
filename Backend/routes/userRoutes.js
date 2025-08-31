const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { body, validationResult } = require("express-validator");

// Middleware to handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// validation rules for registration
const registerValidationRules = [
  body("username")
    .trim()
    .isLength({ min: 3 })
    .withMessage("Username must be at least 3 characters long."),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long.")
    .matches(/\d/)
    .withMessage("Password must contain a number.")
    .matches(/[a-zA-Z]/)
    .withMessage("Password must contain a letter."),
];

router.post("/login", userController.login);

router.post(
  "/register",
  registerValidationRules,
  handleValidationErrors,
  userController.register
);

module.exports = router;
