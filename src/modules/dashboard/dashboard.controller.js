const User = require("../users/user.model");

const CallLog = require(
  "../calls/call.model"
);

const DSR = require("../dsr/dsr.model");

const moment = require("moment");

const adminDashboard =
  async (req, res) => {
    try {
      const todayStart =
        moment()
          .startOf("day")
          .toDate();

      const todayEnd =
        moment()
          .endOf("day")
          .toDate();

      // Users Count
      const totalManagers =
        await User.countDocuments({
          role: "MANAGER"
        });

      const totalTelecallers =
        await User.countDocuments({
          role: "TELECALLER"
        });

      const totalHR =
        await User.countDocuments({
          role: "HR"
        });

      // Today's Calls
      const totalCallsToday =
        await CallLog.countDocuments({
          createdAt: {
            $gte: todayStart,
            $lte: todayEnd
          }
        });

      // Today's Follow Ups
      const totalFollowUps =
        await CallLog.countDocuments({
          callStatus: "FOLLOW_UP",

          createdAt: {
            $gte: todayStart,
            $lte: todayEnd
          }
        });

      // DSR Submitted
      const totalDSRSubmitted =
        await DSR.countDocuments({
          isSubmitted: true,

          createdAt: {
            $gte: todayStart,
            $lte: todayEnd
          }
        });

      res.status(200).json({
        success: true,

        data: {
          totalManagers,

          totalTelecallers,

          totalHR,

          totalCallsToday,

          totalFollowUps,

          totalDSRSubmitted
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  };

  const managerDashboard =
  async (req, res) => {
    try {
      const teamUsers =
        await User.find({
          managerId: req.user.id
        });

      const ids = teamUsers.map(
        (u) => u._id
      );

      const todayStart =
        moment()
          .startOf("day")
          .toDate();

      const todayEnd =
        moment()
          .endOf("day")
          .toDate();

      const teamCallsToday =
        await CallLog.countDocuments({
          userId: { $in: ids },

          createdAt: {
            $gte: todayStart,
            $lte: todayEnd
          }
        });

      const teamFollowUps =
        await CallLog.countDocuments({
          userId: { $in: ids },

          callStatus: "FOLLOW_UP",

          createdAt: {
            $gte: todayStart,
            $lte: todayEnd
          }
        });

      const dsrSubmitted =
        await DSR.countDocuments({
          userId: { $in: ids },

          isSubmitted: true,

          createdAt: {
            $gte: todayStart,
            $lte: todayEnd
          }
        });

      res.status(200).json({
        success: true,

        data: {
          activeTelecallers:
            ids.length,

          teamCallsToday,

          teamFollowUps,

          dsrSubmitted
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  };

  const telecallerDashboard =
  async (req, res) => {
    try {
      const todayStart =
        moment()
          .startOf("day")
          .toDate();

      const todayEnd =
        moment()
          .endOf("day")
          .toDate();

      const callsMade =
        await CallLog.countDocuments({
          userId: req.user.id,

          createdAt: {
            $gte: todayStart,
            $lte: todayEnd
          }
        });

      const followUps =
        await CallLog.countDocuments({
          userId: req.user.id,

          callStatus: "FOLLOW_UP",

          createdAt: {
            $gte: todayStart,
            $lte: todayEnd
          }
        });

      const notAnswered =
        await CallLog.countDocuments({
          userId: req.user.id,

          callStatus:
            "NOT_ANSWERED",

          createdAt: {
            $gte: todayStart,
            $lte: todayEnd
          }
        });

      const converted =
        await CallLog.countDocuments({
          userId: req.user.id,

          callStatus: "CONVERTED",

          createdAt: {
            $gte: todayStart,
            $lte: todayEnd
          }
        });

      res.status(200).json({
        success: true,

        data: {
          callsMade,

          followUps,

          notAnswered,

          converted
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  };

  module.exports = {
  adminDashboard,
  managerDashboard,
  telecallerDashboard
};