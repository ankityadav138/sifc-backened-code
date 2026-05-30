const express = require(
  'express',
);

const router =
  express.Router();

const authMiddleware = require(
  '../../middlewares/auth.middleware',
);

const roleMiddleware = require(
  '../../middlewares/role.middleware',
);

const {
  teamStatus,
} = require('./manager.controller');

router.get(
  '/team-status',

  authMiddleware,

  roleMiddleware(
    'MANAGER',
    'SUPER_ADMIN',
  ),

  teamStatus,
);

module.exports = router;