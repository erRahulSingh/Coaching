const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
const Admission = require("../models/Admission");
const admissionController = require("../controllers/admissionController");

// --- JWT Verification Middleware ---
const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(403).json({ error: "Access denied. No token provided." });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(403).json({ error: "Access denied. Token malformed." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "super_secret_jms_jwt_token_key_12345");
    req.admin = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid token. Session expired." });
  }
};

// --- Candidate Routes ---
router.post("/admissions", admissionController.createAdmission);

// --- Admin Authentication Routes ---

// Create initial admin credentials (temporary signup for setup)
router.post("/admin/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: "Please enter all fields" });
    }

    const existingAdmin = await Admin.findOne({ username });
    if (existingAdmin) {
      return res.status(400).json({ error: "Admin username already exists" });
    }

    const newAdmin = new Admin({ username, password });
    await newAdmin.save();

    res.status(201).json({ success: true, message: "Admin account registered successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin Login
router.post("/admin/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: "Please fill all fields" });
    }

    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate Token
    const token = jwt.sign(
      { id: admin._id, username: admin.username },
      process.env.JWT_SECRET || "super_secret_jms_jwt_token_key_12345",
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      token,
      admin: { id: admin._id, username: admin.username },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- Admin Panel API Dashboard Actions (Protected) ---

// Retrieve all admission applications
router.get("/admin/admissions", verifyToken, async (req, res) => {
  try {
    const admissions = await Admission.find().sort({ createdAt: -1 });
    res.json(admissions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update application state (e.g. Contacted, Admitted)
router.put("/admin/admissions/:id", verifyToken, async (req, res) => {
  try {
    const { status } = req.body;
    if (!["Pending", "Contacted", "Admitted", "Cancelled"].includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }

    const updatedAdmission = await Admission.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!updatedAdmission) {
      return res.status(404).json({ error: "Admission record not found" });
    }

    res.json({ success: true, data: updatedAdmission });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get dashboard aggregations (Total, Pending, Admitted counts)
router.get("/admin/dashboard-stats", verifyToken, async (req, res) => {
  try {
    const total = await Admission.countDocuments();
    const pending = await Admission.countDocuments({ status: "Pending" });
    const contacted = await Admission.countDocuments({ status: "Contacted" });
    const admitted = await Admission.countDocuments({ status: "Admitted" });

    res.json({
      total,
      pending,
      contacted,
      admitted,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
