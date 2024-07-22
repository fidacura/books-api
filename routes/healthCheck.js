// routes/healthCheck.js
const express = require("express");
const router = express.Router();
const pool = require("../models/dbBooks");

router.get("/", async (req, res) => {
  try {
    // Check database connection
    await pool.query("SELECT 1");

    res.status(200).json({
      status: "healthy",
      message: "API is running and database is connected",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      status: "unhealthy",
      message: "API is running but database connection failed",
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
});

module.exports = router;
