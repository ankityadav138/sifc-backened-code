const express = require("express");

const router = express.Router();

const {
  createCall,
  myCalls,
  teamCalls,
  userCallLogs
} = require("./call.controller");

const authMiddleware = require(
  "../../middlewares/auth.middleware"
);

const roleMiddleware = require(
  "../../middlewares/role.middleware"
);

router.use(authMiddleware);

router.post(
  "/",
  roleMiddleware(
    "TELECALLER",
    "HR"
  ),
  createCall
);



router.get(
  "/my-calls",
  roleMiddleware(
    "TELECALLER",
    "HR"
  ),
  myCalls
);

router.get(
  "/team-calls",
  roleMiddleware(
    "SUPER_ADMIN",
    "MANAGER"
  ),
  teamCalls
);

router.get(
  "/user-call-logs/:userId",
  roleMiddleware(
    "MANAGER"
  ),
  userCallLogs
);

module.exports = router;