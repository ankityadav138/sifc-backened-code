const express = require("express");
const router = express.Router();

const {
  createClientVisit,
  getClientVisits,
  updateClientVisit,
  uploadDocumentImage
} = require("./clientVisit.controller");

const authMiddleware = require("../../middlewares/auth.middleware");
const roleMiddleware = require("../../middlewares/role.middleware");
const upload = require("../../middlewares/upload.middleware");

router.use(authMiddleware);

router.post(
  "/",
  roleMiddleware("SALES_EXECUTIVE"),
  createClientVisit
);

router.get(
  "/",
  roleMiddleware("SALES_EXECUTIVE", "SUPER_ADMIN", "MANAGER"),
  getClientVisits
);

router.put(
  "/:id",
  roleMiddleware("SALES_EXECUTIVE", "SUPER_ADMIN"),
  updateClientVisit
);

router.post(
  "/upload",
  roleMiddleware("SALES_EXECUTIVE", "SUPER_ADMIN", "MANAGER"),
  upload.single("file"),
  uploadDocumentImage
);

module.exports = router;
