require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const apiRoutes = require("./routes/api");

const app = express();

// Middlewares
app.use(cors({ origin: "*" })); // Allow requests from all origins (Vercel frontend)
app.use(express.json());

// Database connection
connectDB();

// API Routes
app.use("/api", apiRoutes);

// Base route for health checks
app.get("/", (req, res) => {
  res.json({ message: "JMS Modern Classes & Library Backend API is running successfully!" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong on the server!" });
});

// Only listen when running locally (not on Vercel)
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Export for Vercel serverless
module.exports = app;
