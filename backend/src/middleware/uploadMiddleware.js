const multer = require("multer");
const path = require("path");
const fs = require("fs");

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, "../uploads");

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({

    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },

    filename: function (req, file, cb) {

        const uniqueName =
            Date.now() + "-" + file.originalname.replace(/\s+/g, "-");

        cb(null, uniqueName);
    },
});

// File filter (PDF only)
const fileFilter = (req, file, cb) => {

    const isPdf =
        file.mimetype === "application/pdf" &&
        path.extname(file.originalname).toLowerCase() === ".pdf";

    if (isPdf) {
        cb(null, true);
    } else {
        cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE", "pdf"));
    }
};

// Multer upload config
const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: MAX_FILE_SIZE
    }
});

const handleUploadError = (err, req, res, next) => {

    if (!err) {
        return next();
    }

    if (err instanceof multer.MulterError) {

        if (err.code === "LIMIT_FILE_SIZE") {
            return res.status(413).json({
                success: false,
                valid: false,
                message: "PDF file size must be 10MB or less"
            });
        }

        if (err.code === "LIMIT_UNEXPECTED_FILE") {
            return res.status(400).json({
                success: false,
                valid: false,
                message: "Only PDF files are allowed"
            });
        }
    }

    return res.status(400).json({
        success: false,
        valid: false,
        message: err.message || "File upload failed"
    });
};

upload.handleUploadError = handleUploadError;

module.exports = upload;
