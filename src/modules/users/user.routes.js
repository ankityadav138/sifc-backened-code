const express = require("express");

const router = express.Router();

const {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  updateUserStatus,
  deleteUser,
  getTelecallersByManager,
  assignManager
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
  "/manager/:managerId/telecallers",
  // roleMiddleware("MANAGER"),
  getTelecallersByManager
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

router.get(
  '/',
  roleMiddleware(
    'SUPER_ADMIN',
    'MANAGER',
  ),
  getUsers,
);

router.patch(
  '/assign-manager',
  roleMiddleware(
    'SUPER_ADMIN',
  ),
  assignManager,
);


module.exports = router;