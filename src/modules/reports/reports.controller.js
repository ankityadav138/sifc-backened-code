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

const telecallerSummary =
  async (req, res) => {
    try {
      const {
        startDate,
        endDate,
      } = req.query;

      let matchFilter = {};

      // Date filter
      if (
        startDate &&
        endDate
      ) {
        matchFilter.createdAt = {
          $gte: new Date(startDate),

          $lte: new Date(endDate),
        };
      }

      const report =
        await CallLog.aggregate([
          {
            $match: matchFilter,
          },

          {
            $group: {
              _id: '$userId',

              totalCalls: {
                $sum: 1,
              },

              followUps: {
                $sum: {
                  $cond: [
                    {
                      $eq: [
                        '$callStatus',
                        'FOLLOW_UP',
                      ],
                    },
                    1,
                    0,
                  ],
                },
              },

              converted: {
                $sum: {
                  $cond: [
                    {
                      $eq: [
                        '$callStatus',
                        'CONVERTED',
                      ],
                    },
                    1,
                    0,
                  ],
                },
              },

              notAnswered: {
                $sum: {
                  $cond: [
                    {
                      $eq: [
                        '$callStatus',
                        'NOT_ANSWERED',
                      ],
                    },
                    1,
                    0,
                  ],
                },
              },

              lastCallTime: {
                $max: '$createdAt',
              },
            },
          },

          {
            $lookup: {
              from: 'users',

              localField: '_id',

              foreignField: '_id',

              as: 'user',
            },
          },

          {
            $unwind: '$user',
          },

          {
            $project: {
              telecallerId:
                '$user._id',

              name:
                '$user.name',

              totalCalls: 1,

              followUps: 1,

              converted: 1,

              notAnswered: 1,

              lastCallTime: 1,
            },
          },
        ]);

      res.status(200).json({
        success: true,

        data: report,
      });
    } catch (error) {
      res.status(500).json({
        success: false,

        message: error.message,
      });
    }
  };

  const callSummary = async (
  req,
  res,
) => {
  try {
    const {
      startDate,
      endDate,
      role,
      managerId,
    } = req.query;

    let matchFilter = {};

    // Date filter
    if (
      startDate &&
      endDate
    ) {
      matchFilter.createdAt = {
        $gte: new Date(startDate),

        $lte: new Date(endDate),
      };
    }

    // Build user filter
    let userFilter = {};

    if (role) {
      userFilter.role = role;
    }

    if (managerId) {
      userFilter.managerId =
        managerId;
    }

    const report =
      await CallLog.aggregate([
        {
          $lookup: {
            from: 'users',

            localField: 'userId',

            foreignField: '_id',

            as: 'user',
          },
        },

        {
          $unwind: '$user',
        },

        {
          $match: {
            ...matchFilter,

            ...(role && {
              'user.role': role,
            }),

            ...(managerId && {
              'user.managerId':
                managerId,
            }),
          },
        },

        {
          $group: {
            _id: '$userId',

            name: {
              $first:
                '$user.name',
            },

            role: {
              $first:
                '$user.role',
            },

            totalCalls: {
              $sum: 1,
            },

            followUps: {
              $sum: {
                $cond: [
                  {
                    $eq: [
                      '$callStatus',
                      'FOLLOW_UP',
                    ],
                  },
                  1,
                  0,
                ],
              },
            },

            converted: {
              $sum: {
                $cond: [
                  {
                    $eq: [
                      '$callStatus',
                      'CONVERTED',
                    ],
                  },
                  1,
                  0,
                ],
              },
            },

            notAnswered: {
              $sum: {
                $cond: [
                  {
                    $eq: [
                      '$callStatus',
                      'NOT_ANSWERED',
                    ],
                  },
                  1,
                  0,
                ],
              },
            },

            lastCallTime: {
              $max:
                '$createdAt',
            },
          },
        },

        {
          $project: {
            userId: '$_id',

            name: 1,

            role: 1,

            totalCalls: 1,

            followUps: 1,

            converted: 1,

            notAnswered: 1,

            lastCallTime: 1,
          },
        },

        {
          $sort: {
            totalCalls: -1,
          },
        },
      ]);

    res.status(200).json({
      success: true,

      count: report.length,

      data: report,
    });
  } catch (error) {
    res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};

module.exports = {
  dsrReport,
  attendanceReport,
  callReport,
  telecallerSummary,
  callSummary,
};