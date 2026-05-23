const CallLog = require("./call.model");

const createCall = async (req, res) => {
  try {
    const {
      leadId,
      leadName,
      phone,
      callStatus,
      followUpDate,
      comments
    } = req.body;

    const call = await CallLog.create({
      userId: req.user.id,

      leadId,
      leadName,
      phone,

      callStatus,

      followUpDate,

      comments
    });

    res.status(201).json({
      success: true,
      message: "Call updated successfully",
      data: call
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const myCalls = async (req, res) => {
  try {
    const calls = await CallLog.find({
      userId: req.user.id
    }).sort({
      createdAt: -1
    });

    res.status(200).json({
      success: true,
      count: calls.length,
      data: calls
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const teamCalls = async (req, res) => {
  try {
    const User = require("../users/user.model");

    let filter = {};

    if (req.user.role === "MANAGER") {
      const teamUsers = await User.find({
        managerId: req.user.id
      });

      const ids = teamUsers.map(
        (u) => u._id
      );

      filter.userId = {
        $in: ids
      };
    }

    const calls = await CallLog.find(filter)
      .populate(
        "userId",
        "name phone role"
      )
      .sort({
        createdAt: -1
      });

    res.status(200).json({
      success: true,
      data: calls
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const userCallLogs = async (
  req,
  res,
) => {
  try {
    const {userId} = req.params;

    // Manager access validation
    if (
      req.user.role ===
      'MANAGER'
    ) {
      const User = require(
        '../users/user.model',
      );

      const user =
        await User.findById(
          userId,
        );

      if (
        !user ||
        user.managerId.toString() !==
          req.user.id
      ) {
        return res.status(403).json({
          success: false,

          message:
            'Access denied',
        });
      }
    }

    const calls =
      await CallLog.find({
        userId,
      })
        .populate(
          'userId',
          'name phone role',
        )
        .sort({
          createdAt: -1,
        });

    const formattedCalls =
      calls.map(call => ({
        id: call._id,

        leadId: call.leadId,

        leadName:
          call.leadName,

        phone: call.phone,

        callStatus:
          call.callStatus,

        followUpDate:
          call.followUpDate,

        comments:
          call.comments,

        createdAt:
          call.createdAt,

        telecaller: {
          id: call.userId._id,

          name:
            call.userId.name,

          phone:
            call.userId.phone,
        },
      }));

    res.status(200).json({
      success: true,

      count:
        formattedCalls.length,

      data: formattedCalls,
    });
  } catch (error) {
    res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};

module.exports = {
  createCall,
  myCalls,
  teamCalls,
  userCallLogs
};