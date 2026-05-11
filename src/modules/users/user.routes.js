const express = require("express");

const router = express.Router();

const {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  updateUserStatus,
  deleteUser
} = require("./user.controller");

const authMiddleware = require("../../middlewares/auth.middleware");

const roleMiddleware = require("../../middlewares/role.middleware");

router.use(authMiddleware);

router.post(
  "/",
  roleMiddleware("SUPER_ADMIN"),
  createUser
);

router.get(
  "/",
  roleMiddleware("SUPER_ADMIN", "MANAGER"),
  getUsers
);

router.get(
  "/:id",
  roleMiddleware("SUPER_ADMIN", "MANAGER"),
  getUserById
);

router.put(
  "/:id",
  roleMiddleware("SUPER_ADMIN"),
  updateUser
);

router.patch(
  "/:id/status",
  roleMiddleware("SUPER_ADMIN"),
  updateUserStatus
);

router.delete(
  "/:id",
  roleMiddleware("SUPER_ADMIN"),
  deleteUser
);

module.exports = router;