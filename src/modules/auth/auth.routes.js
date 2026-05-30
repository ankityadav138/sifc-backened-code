const express = require("express");

const router = express.Router();

const {
  register,
  login,
  getProfile
} = require("./auth.controller");

const authMiddleware = require(
  "../../middlewares/auth.middleware"
);

const validate = require(
  "../../middlewares/validate.middleware"
);

const {
  registerSchema
} = require("./auth.validation");

router.post(
  "/register",

  validate(registerSchema),

  register
);

router.post(
  "/login",
  login
);

router.get(
  "/profile",
  authMiddleware,
  getProfile
);

module.exports = router;