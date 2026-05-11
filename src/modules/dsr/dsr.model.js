const mongoose = require("mongoose");

const dsrSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    date: {
      type: String,
      required: true
    },

    totalCalls: {
      type: Number,
      default: 0
    },

    followUps: {
      type: Number,
      default: 0
    },

    notAnswered: {
      type: Number,
      default: 0
    },

    converted: {
      type: Number,
      default: 0
    },

    finalRemarks: {
      type: String
    },

    managerRemarks: {
      type: String
    },

    flagged: {
      type: Boolean,
      default: false
    },

    isSubmitted: {
      type: Boolean,
      default: false
    },

    submittedAt: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model(
  "DSR",
  dsrSchema
);