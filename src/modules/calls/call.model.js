const mongoose = require("mongoose");

const callSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    leadId: {
      type: String
    },

    leadName: {
      type: String
    },

    phone: {
      type: String
    },

    callStatus: {
      type: String,

      enum: [
        "ANSWERED",
        "FOLLOW_UP",
        "NOT_ANSWERED",
        "CONVERTED"
      ],

      required: true
    },

    followUpDate: {
      type: Date,
      default: null
    },

    comments: {
      type: String
    },

    numberOfCalls: {
      type: Number
    },

    interviewsScheduled: {
      type: Number
    },

    interviewsConducted: {
      type: Number
    },

    numberOfJoinings: {
      type: Number
    },

    hrRemarks: {
      type: String
    },

    role: {
      type: String,
      enum: ["SUPER_ADMIN", "MANAGER", "TELECALLER", "HR"]
    },

    createdByName: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model(
  "CallLog",
  callSchema
);