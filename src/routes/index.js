const express = require("express");

const router = express.Router();

const authRoutes = require("../modules/auth/auth.routes");

const userRoutes = require("../modules/users/user.routes");

const attendanceRoutes = require(
  "../modules/attendance/attendance.routes"
);

router.use("/auth", authRoutes);

router.use("/users", userRoutes);

router.use(
  "/attendance",
  attendanceRoutes
);

const callRoutes = require(
  "../modules/calls/call.routes"
);

router.use("/calls", callRoutes);

const dsrRoutes = require(
  "../modules/dsr/dsr.routes"
);
router.use("/dsr", dsrRoutes);

const dashboardRoutes = require(
  "../modules/dashboard/dashboard.routes"
);
router.use(
  "/dashboard",
  dashboardRoutes
);

const reportRoutes = require(
  "../modules/reports/reports.routes"
);
router.use(
  "/reports",
  reportRoutes
);

const managerRoutes = require(
  '../modules/manager/manager.routes',
);

router.use(
  '/manager',
  managerRoutes,
);

const userCallRoutes = require(
  '../modules/calls/call.routes',
);

router.use(
  '/calls',
  userCallRoutes,
);




module.exports = router;