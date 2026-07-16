const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const Razorpay = require("razorpay");
const Admin = require("../models/Admin");
const Admission = require("../models/Admission");
const Student = require("../models/Student");
const Payment = require("../models/Payment");
const admissionController = require("../controllers/admissionController");

// Initialize Razorpay Instance
const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_SUIH6k4l3JewbV",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "13t9eVDEmoEaiZ4zjL03Zcav"
});

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

// --- Student JWT Verification Middleware ---
const verifyStudentToken = (req, res, next) => {
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
    req.student = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid token. Session expired." });
  }
};

// --- Candidate Routes ---
router.post("/admissions", admissionController.createAdmission);

// --- Student Authentication Routes ---

// Student Register
router.post("/student/register", async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    if (!name || !email || !phone || !password) {
      return res.status(400).json({ error: "Please fill all fields" });
    }

    const existingStudent = await Student.findOne({ email });
    if (existingStudent) {
      return res.status(400).json({ error: "An account with this email already exists" });
    }

    const newStudent = new Student({ name, email, phone, password });
    await newStudent.save();

    const token = jwt.sign(
      { id: newStudent._id, name: newStudent.name, email: newStudent.email },
      process.env.JWT_SECRET || "super_secret_jms_jwt_token_key_12345",
      { expiresIn: "7d" }
    );

    res.status(201).json({
      success: true,
      message: "Account created successfully!",
      token,
      student: { id: newStudent._id, name: newStudent.name, email: newStudent.email },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Student Login
router.post("/student/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Please fill all fields" });
    }

    const student = await Student.findOne({ email });
    if (!student) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const isMatch = await student.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: student._id, name: student.name, email: student.email },
      process.env.JWT_SECRET || "super_secret_jms_jwt_token_key_12345",
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      token,
      student: { id: student._id, name: student.name, email: student.email },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- Admin Authentication Routes ---

// Create initial admin credentials (temporary signup for setup)
router.post("/admin/register", async (req, res) => {
  try {
    const adminCount = await Admin.countDocuments();
    if (adminCount > 0) {
      return res.status(403).json({ error: "Registration disabled. An admin account already exists." });
    }

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

// --- Student Payment Routes (Razorpay Integration) ---

// Create a new Razorpay order
router.post("/payment/order", verifyStudentToken, async (req, res) => {
  try {
    const { batchName, amount } = req.body;
    if (!batchName || !amount) {
      return res.status(400).json({ error: "Batch name and amount are required" });
    }

    const options = {
      amount: Math.round(amount * 100), // Razorpay accepts in paisa (pennies)
      currency: "INR",
      receipt: `rcpt_${req.student.id.slice(-8)}_${Date.now()}`
    };

    const order = await razorpayInstance.orders.create(options);

    // Save initial transaction state in DB
    const newPayment = new Payment({
      student: req.student.id,
      studentName: req.student.name,
      studentEmail: req.student.email,
      batchName,
      amount,
      razorpayOrderId: order.id,
      status: "Created"
    });

    await newPayment.save();

    res.status(201).json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency
    });
  } catch (error) {
    console.error("Razorpay order creation failed:", error);
    const errMsg = error && error.error ? (error.error.description || error.error.message) : (error ? error.message : null);
    res.status(500).json({ error: errMsg || "Failed to create payment order" });
  }
});

// Verify payment signature
router.post("/payment/verify", verifyStudentToken, async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ error: "Missing payment confirmation parameters" });
    }

    // Verify signature using HMAC
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "13t9eVDEmoEaiZ4zjL03Zcav")
      .update(body.toString())
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      // Update transaction status to captured
      const payment = await Payment.findOneAndUpdate(
        { razorpayOrderId: razorpay_order_id },
        { 
          status: "Captured",
          razorpayPaymentId: razorpay_payment_id
        },
        { new: true }
      );

      if (!payment) {
        return res.status(404).json({ error: "Original transaction record not found" });
      }

      res.json({
        success: true,
        message: "Payment verified & captured successfully",
        data: payment
      });
    } else {
      // Update transaction status to failed
      await Payment.findOneAndUpdate(
        { razorpayOrderId: razorpay_order_id },
        { status: "Failed" }
      );

      res.status(400).json({ error: "Signature verification failed. Payment tampered." });
    }
  } catch (error) {
    console.error("Razorpay signature verification error:", error);
    res.status(500).json({ error: "Verification process failed" });
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

// Retrieve all successful payment records
router.get("/admin/payments", verifyToken, async (req, res) => {
  try {
    const payments = await Payment.find({ status: "Captured" }).sort({ createdAt: -1 });
    res.json(payments);
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

// Get dashboard aggregations (Total, Pending, Admitted counts and Revenue stats)
router.get("/admin/dashboard-stats", verifyToken, async (req, res) => {
  try {
    const total = await Admission.countDocuments();
    const pending = await Admission.countDocuments({ status: "Pending" });
    const contacted = await Admission.countDocuments({ status: "Contacted" });
    const admitted = await Admission.countDocuments({ status: "Admitted" });

    // Calculate revenue stats
    const revenueAggr = await Payment.aggregate([
      { $match: { status: "Captured" } },
      { $group: { _id: null, totalRevenue: { $sum: "$amount" } } }
    ]);

    const totalRevenue = revenueAggr.length > 0 ? revenueAggr[0].totalRevenue : 0;
    const successfulPaymentsCount = await Payment.countDocuments({ status: "Captured" });

    res.json({
      total,
      pending,
      contacted,
      admitted,
      totalRevenue,
      successfulPayments: successfulPaymentsCount
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
