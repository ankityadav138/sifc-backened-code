const mongoose = require("mongoose");

const callSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    leadId: {
      type: String,
      required: true
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
      type: String,
      required: true
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