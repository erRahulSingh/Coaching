const mongoose = require("mongoose");

const PlanSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ["library", "course"],
    required: true
  },
  time: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    default: 0
  },
  admissionFee: {
    type: Number,
    required: true,
    default: 0
  },
  features: {
    type: [String],
    default: []
  },
  color: {
    type: String,
    default: "bg-[#0a1c5d] hover:bg-[#071444] text-white"
  },
  bulletColor: {
    type: String,
    default: "text-[#0a1c5d]"
  },
  badge: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model("Plan", PlanSchema);
