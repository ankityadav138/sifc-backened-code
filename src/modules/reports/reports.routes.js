const express = require("express");

const router = express.Router();

const {
  dsrReport,
  attendanceReport,
  callReport,
  telecallerSummary,
  callSummary
} = require(
  "./reports.controller"
);

const authMiddleware = require(
  "../../middlewares/auth.middleware"
);

const roleMiddleware = require(
  "../../middlewares/role.middleware"
);

router.use(authMiddleware);

router.get(
  "/dsr",

  roleMiddleware(
    "SUPER_ADMIN",
    "MANAGER"
  ),

  dsrReport
);

router.get(
  "/attendance",

  roleMiddleware(
    "SUPER_ADMIN",
    "MANAGER"
  ),

  attendanceReport
);

router.get(
  "/calls",

  roleMiddleware(
    "SUPER_ADMIN",
    "MANAGER"
  ),

  callReport
);

router.get(
  '/telecaller-summary',

  roleMiddleware(
    'SUPER_ADMIN',
    'MANAGER',
  ),
  telecallerSummary,
);

router.get(
  '/call-summary',

  roleMiddleware(
    'SUPER_ADMIN',
    'MANAGER',
  ),

  callSummary,
);

module.exports = router;