const express = require("express");

const router = express.Router();

const {
  punchIn,
  punchOut,
  myAttendance,
  teamAttendance
} = require("./attendance.controller");

const authMiddleware = require(
  "../../middlewares/auth.middleware"
);

const roleMiddleware = require(
  "../../middlewares/role.middleware"
);

const upload = require(
  "../../middlewares/upload.middleware"
);

router.use(authMiddleware);

router.post(
  "/punch-in",
  upload.single("selfie"),
  punchIn
);

router.post(
  "/punch-out",
  upload.single("selfie"),
  punchOut
);

router.get(
  "/my-attendance",
  myAttendance
);

router.get(
  "/team-attendance",
  roleMiddleware(
    "SUPER_ADMIN",
    "MANAGER"
  ),
  teamAttendance
);

module.exports = router;