const express = require("express");

const router = express.Router();

const {
  submitDSR,
  myDSR,
  teamDSR,
  reviewDSR
} = require("./dsr.controller");

const authMiddleware = require(
  "../../middlewares/auth.middleware"
);

const roleMiddleware = require(
  "../../middlewares/role.middleware"
);

router.use(authMiddleware);

router.post(
  "/submit",

  roleMiddleware(
    "TELECALLER",
    "HR"
  ),

  submitDSR
);

router.get(
  "/my",

  roleMiddleware(
    "TELECALLER",
    "HR"
  ),

  myDSR
);

router.get(
  "/team",

  roleMiddleware(
    "SUPER_ADMIN",
    "MANAGER"
  ),

  teamDSR
);

router.patch(
  "/:id/review",

  roleMiddleware(
    "SUPER_ADMIN",
    "MANAGER"
  ),

  reviewDSR
);

module.exports = router;