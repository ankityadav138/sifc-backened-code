const DSR = require("./dsr.model");

const CallLog = require("../calls/call.model");

const User = require("../users/user.model");

const moment = require("moment");

const submitDSR = async (req, res) => {
  try {
    const { finalRemarks } = req.body;

    const creator = await User.findById(req.user.id).select("name");

    const today =
      moment().format("YYYY-MM-DD");

    // Check existing DSR
    let dsr = await DSR.findOne({
      userId: req.user.id,
      date: today
    });

    // Prevent resubmit
    if (dsr?.isSubmitted) {
      return res.status(400).json({
        success: false,
        message:
          "DSR already submitted"
      });
    }

    // Get today's calls
    const startOfDay =
      moment().startOf("day").toDate();

    const endOfDay =
      moment().endOf("day").toDate();

    const calls = await CallLog.find({
      userId: req.user.id,

      createdAt: {
        $gte: startOfDay,
        $lte: endOfDay
      }
    });

    // Calculate counters
    const totalCalls = calls.length;

    const followUps = calls.filter(
      (c) =>
        c.callStatus === "FOLLOW_UP"
    ).length;

    const notAnswered = calls.filter(
      (c) =>
        c.callStatus ===
        "NOT_ANSWERED"
    ).length;

    const converted = calls.filter(
      (c) =>
        c.callStatus === "CONVERTED"
    ).length;

    // Create or update DSR
    if (!dsr) {
      dsr = await DSR.create({
        userId: req.user.id,
        createdByName: creator ? creator.name : req.user.name,
        role: req.user.role,

        date: today,

        totalCalls,

        followUps,

        notAnswered,

        converted,

        finalRemarks,

        isSubmitted: true,

        submittedAt: new Date()
      });
    } else {
      dsr.totalCalls = totalCalls;

      dsr.followUps = followUps;

      dsr.notAnswered =
        notAnswered;

      dsr.converted = converted;

      dsr.finalRemarks =
        finalRemarks;

      dsr.createdByName = creator ? creator.name : req.user.name;
      dsr.role = req.user.role;
      dsr.isSubmitted = true;

      dsr.submittedAt = new Date();

      await dsr.save();
    }

    res.status(200).json({
      success: true,
      message:
        "DSR submitted successfully",

      data: dsr
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const myDSR = async (req, res) => {
  try {
    const dsr = await DSR.find({
      userId: req.user.id
    }).sort({
      createdAt: -1
    });

    res.status(200).json({
      success: true,
      data: dsr
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const teamDSR = async (req, res) => {
  try {
    let filter = {};

    if (req.user.role === "MANAGER") {
      const teamUsers =
        await User.find({
          managerId: req.user.id
        });

      const ids = teamUsers.map(
        (u) => u._id
      );

      filter.userId = {
        $in: ids
      };
    }

    const dsr = await DSR.find(filter)
      .populate(
        "userId",
        "name phone role"
      )
      .sort({
        createdAt: -1
      });

    res.status(200).json({
      success: true,
      data: dsr
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const reviewDSR = async (req, res) => {
  try {
    const {
      managerRemarks,
      flagged
    } = req.body;

    const dsr =
      await DSR.findByIdAndUpdate(
        req.params.id,
        {
          managerRemarks,
          flagged
        },
        {
          new: true
        }
      );

    res.status(200).json({
      success: true,
      message:
        "DSR reviewed successfully",

      data: dsr
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  submitDSR,
  myDSR,
  teamDSR,
  reviewDSR
};