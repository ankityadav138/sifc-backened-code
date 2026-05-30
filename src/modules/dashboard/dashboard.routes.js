const express = require("express");

const router = express.Router();

const {
  adminDashboard,
  managerDashboard,
  telecallerDashboard
} = require(
  "./dashboard.controller"
);

const authMiddleware = require(
  "../../middlewares/auth.middleware"
);

const roleMiddleware = require(
  "../../middlewares/role.middleware"
);

router.use(authMiddleware);

router.get(
  "/admin",

  roleMiddleware("SUPER_ADMIN"),

  adminDashboard
);

router.get(
  "/manager",

  roleMiddleware("MANAGER"),

  managerDashboard
);

router.get(
  "/telecaller",

  roleMiddleware(
    "TELECALLER",
    "HR"
  ),

  telecallerDashboard
);

module.exports = router;