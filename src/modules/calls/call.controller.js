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

module.exports = {
  createCall,
  myCalls,
  teamCalls
};