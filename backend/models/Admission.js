const mongoose = require("mongoose");

const AdmissionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
  },
  phone: {
    type: String,
    required: [true, "Phone number is required"],
    trim: true,
  },
  whatsapp: {
    type: String,
    required: [true, "WhatsApp number is required"],
    trim: true,
  },
  course: {
    type: String,
    required: [true, "Course choice is required"],
  },
  shift: {
    type: String,
    required: [true, "Shift choice is required"],
  },
  status: {
    type: String,
    enum: ["Pending", "Contacted", "Admitted", "Cancelled"],
    default: "Pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Admission", AdmissionSchema);
