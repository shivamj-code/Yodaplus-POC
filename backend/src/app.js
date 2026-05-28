const express = require("express");
const cors = require("cors");
const path = require("path");

// Import routes
const certificateRoutes = require("./routes/certificateRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static folder for uploaded PDFs
app.use(
    "/uploads",
    express.static(path.join(__dirname, "uploads"))
);

// Health check route
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "CertChain Backend API Running"
    });
});

// API Routes
app.use("/api/certificates", certificateRoutes);

module.exports = app;