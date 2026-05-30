const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
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

    punchIn: {
      time: Date,

      selfie: String,

      location: {
        lat: Number,
        lng: Number
      }
    },

    punchOut: {
      time: Date,

      selfie: String,

      location: {
        lat: Number,
        lng: Number
      }
    },

    totalHours: {
      type: Number,
      default: 0
    },

    status: {
      type: String,
      enum: ["PRESENT", "ABSENT"],
      default: "PRESENT"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model(
  "Attendance",
  attendanceSchema
);