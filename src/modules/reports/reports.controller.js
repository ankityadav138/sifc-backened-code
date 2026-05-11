const Attendance = require(
  "../attendance/attendance.model"
);

const CallLog = require(
  "../calls/call.model"
);

const DSR = require(
  "../dsr/dsr.model"
);

const User = require(
  "../users/user.model"
);

const moment = require("moment");

const dsrReport = async (req, res) => {
  try {
    const {
      startDate,
      endDate,
      userId
    } = req.query;

    let filter = {};

    if (startDate && endDate) {
      filter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    if (userId) {
      filter.userId = userId;
    }

    const reports = await DSR.find(filter)
      .populate(
        "userId",
        "name phone role"
      )
      .sort({
        createdAt: -1
      });

    res.status(200).json({
      success: true,
      count: reports.length,
      data: reports
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const attendanceReport =
  async (req, res) => {
    try {
      const {
        startDate,
        endDate,
        userId
      } = req.query;

      let filter = {};

      if (startDate && endDate) {
        filter.createdAt = {
          $gte: new Date(
            startDate
          ),

          $lte: new Date(endDate)
        };
      }

      if (userId) {
        filter.userId = userId;
      }

      const reports =
        await Attendance.find(filter)
          .populate(
            "userId",
            "name phone role"
          )
          .sort({
            createdAt: -1
          });

      res.status(200).json({
        success: true,

        count: reports.length,

        data: reports
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  };

const callReport = async (req, res) => {
  try {
    const {
      startDate,
      endDate,
      userId,
      callStatus
    } = req.query;

    let filter = {};

    if (startDate && endDate) {
      filter.createdAt = {
        $gte: new Date(startDate),

        $lte: new Date(endDate)
      };
    }

    if (userId) {
      filter.userId = userId;
    }

    if (callStatus) {
      filter.callStatus =
        callStatus;
    }

    const reports =
      await CallLog.find(filter)
        .populate(
          "userId",
          "name phone role"
        )
        .sort({
          createdAt: -1
        });

    res.status(200).json({
      success: true,

      count: reports.length,

      data: reports
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  dsrReport,
  attendanceReport,
  callReport
};