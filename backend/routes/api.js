const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const Razorpay = require("razorpay");
const Admin = require("../models/Admin");
const Admission = require("../models/Admission");
const Student = require("../models/Student");
const Payment = require("../models/Payment");
const Plan = require("../models/Plan");
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

// --- Seed default plans if none exist ---
async function seedDefaultPlans() {
  try {
    const planCount = await Plan.countDocuments();
    if (planCount === 0) {
      console.log("No plans found in database. Seeding default library shifts and course programs...");
      
      const defaultPlans = [
        // Library Shifts
        {
          name: "Morning Shift",
          type: "library",
          time: "06:00 AM - 11:00 AM",
          price: 300,
          admissionFee: 0,
          features: [
            "AC Study Hall",
            "High Speed Free Wi-Fi",
            "Comfortable Cushioned Seat",
            "RO Pure Mineral Water",
            "CCTV Secure Zone",
            "Daily Newspaper Access"
          ],
          color: "bg-[#0a1c5d] hover:bg-[#071444] text-white",
          bulletColor: "text-[#0a1c5d]"
        },
        {
          name: "Midday Shift",
          type: "library",
          time: "11:00 AM - 04:00 PM",
          price: 400,
          admissionFee: 0,
          features: [
            "AC Study Hall",
            "High Speed Free Wi-Fi",
            "Comfortable Cushioned Seat",
            "RO Pure Mineral Water",
            "CCTV Secure Zone",
            "Daily Newspaper Access"
          ],
          color: "bg-[#f48c06] hover:bg-[#d07403] text-white",
          bulletColor: "text-[#f48c06]"
        },
        {
          name: "Evening Shift",
          type: "library",
          time: "04:00 PM - 09:00 PM",
          price: 300,
          admissionFee: 0,
          features: [
            "AC Study Hall",
            "High Speed Free Wi-Fi",
            "Comfortable Cushioned Seat",
            "RO Pure Mineral Water",
            "CCTV Secure Zone",
            "Daily Newspaper Access"
          ],
          color: "bg-[#10b981] hover:bg-[#059669] text-white",
          bulletColor: "text-[#10b981]"
        },
        {
          name: "Normal Sheet Full Day",
          type: "library",
          time: "Full Day Access",
          price: 500,
          admissionFee: 0,
          features: [
            "24 Hours Study Access",
            "Assigned Comfort Seat",
            "AC Study Hall Environment",
            "High Speed Free Wi-Fi",
            "CCTV Surveillance 24/7",
            "Pin-drop Silence Zone"
          ],
          color: "bg-[#6366f1] hover:bg-[#4f46e5] text-white",
          bulletColor: "text-[#6366f1]"
        },
        {
          name: "Special Sheet Full Day",
          type: "library",
          time: "Full Day Access (Reserved)",
          price: 600,
          admissionFee: 0,
          features: [
            "Reserved Dedicated Desk",
            "Personal Lockable Cabinet",
            "AC Study Hall Environment",
            "High Speed Free Wi-Fi",
            "RO Pure Mineral Water",
            "24/7 Absolute Security"
          ],
          color: "bg-[#ec4899] hover:bg-[#db2777] text-white",
          bulletColor: "text-[#ec4899]"
        },
        // Coaching Courses
        {
          name: "Class 9th & 10th Foundation",
          type: "course",
          time: "BSEB & CBSE Programs",
          price: 0,
          admissionFee: 0,
          features: [
            "Complete Syllabus Coverage",
            "Daily Doubt Clearing Classes",
            "Weekly Chapter-wise Tests",
            "Free Comprehensive Study Material",
            "Integrated Free Library Access"
          ],
          color: "bg-[#0a1c5d] hover:bg-[#071444] text-white",
          bulletColor: "text-blue-500",
          badge: "Coaching Class"
        },
        {
          name: "Class 11th & 12th Academics",
          type: "course",
          time: "Science, Commerce & Arts",
          price: 0,
          admissionFee: 0,
          features: [
            "Lectures by Expert Faculties",
            "Chapter-wise Revision Notes",
            "NCERT & Board Pattern Prep",
            "Weekly Mock Test & Performance Audit",
            "Integrated Free Library Access"
          ],
          color: "bg-[#0a1c5d] hover:bg-[#071444] text-white",
          bulletColor: "text-[#f48c06]",
          badge: "Coaching Class"
        },
        {
          name: "Competitive Exams target",
          type: "course",
          time: "JEE / NEET / NTSE / Olympiads",
          price: 0,
          admissionFee: 0,
          features: [
            "Specialized Competitive Curriculum",
            "Mock Tests & National Ranking Series",
            "One-to-One Mentor Support Sessions",
            "Advanced Doubt Solving Desks",
            "24/7 Library Study Desk Reserved"
          ],
          color: "bg-[#0a1c5d] hover:bg-[#071444] text-white",
          bulletColor: "text-emerald-500",
          badge: "Special Prep"
        },
        {
          name: "Foundation Coaching Packages",
          type: "course",
          time: "Long-term Integrated Prep",
          price: 0,
          admissionFee: 0,
          features: [
            "Basic Concept Strengthening Sessions",
            "Monthly Parent-Teacher Analysis",
            "Regular Feedback & Mock Papers",
            "Doubt Sessions with Expert Faculty",
            "Integrated Free Library Access"
          ],
          color: "bg-[#0a1c5d] hover:bg-[#071444] text-white",
          bulletColor: "text-purple-500",
          badge: "Integrated Program"
        }
      ];

      await Plan.insertMany(defaultPlans);
      console.log("Seeding complete! Seeded 9 default plans.");
    }
  } catch (error) {
    console.error("Error seeding default plans:", error);
  }
}
seedDefaultPlans();

// --- Plans API Routes ---

// Get all plans (public)
router.get("/plans", async (req, res) => {
  try {
    const plans = await Plan.find().sort({ createdAt: 1 });
    res.json(plans);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new plan (admin protected)
router.post("/admin/plans", verifyToken, async (req, res) => {
  try {
    const { name, type, time, price, admissionFee, features, color, bulletColor, badge } = req.body;
    if (!name || !type || !time) {
      return res.status(400).json({ error: "Name, type, and time are required fields." });
    }

    const newPlan = new Plan({
      name,
      type,
      time,
      price: price || 0,
      admissionFee: admissionFee || 0,
      features: features || [],
      color: color || "bg-[#0a1c5d] hover:bg-[#071444] text-white",
      bulletColor: bulletColor || "text-[#0a1c5d]",
      badge
    });

    await newPlan.save();
    res.status(201).json({ success: true, data: newPlan });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update plan details (admin protected)
router.put("/admin/plans/:id", verifyToken, async (req, res) => {
  try {
    const { name, time, price, admissionFee, features, color, bulletColor, badge } = req.body;
    
    const updatedPlan = await Plan.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          name,
          time,
          price: price !== undefined ? price : 0,
          admissionFee: admissionFee !== undefined ? admissionFee : 0,
          features: features || [],
          color: color || "bg-[#0a1c5d] hover:bg-[#071444] text-white",
          bulletColor: bulletColor || "text-[#0a1c5d]",
          badge
        }
      },
      { new: true }
    );

    if (!updatedPlan) {
      return res.status(404).json({ error: "Plan not found." });
    }

    res.json({ success: true, data: updatedPlan });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete plan (admin protected)
router.delete("/admin/plans/:id", verifyToken, async (req, res) => {
  try {
    const deletedPlan = await Plan.findByIdAndDelete(req.params.id);
    if (!deletedPlan) {
      return res.status(404).json({ error: "Plan not found." });
    }
    res.json({ success: true, message: "Plan deleted successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
