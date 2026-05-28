const express = require("express");

const router = express.Router();

const upload = require("../middleware/uploadMiddleware");

const {
    issueCertificate,
    verifyCertificateByPDF,
    verifyCertificate,
    revokeCertificate
} = require("../controllers/certificateController");

// ========================================
// HEALTH ROUTE
// ========================================

router.get("/", (req, res) => {

    res.json({
        success: true,
        message: "Certificate routes working"
    });
});

// ========================================
// ISSUE CERTIFICATE
// ========================================

router.post(
    "/issue",
    upload.single("pdf"),
    upload.handleUploadError,
    issueCertificate
);

// ========================================
// VERIFY CERTIFICATE BY PDF
// ========================================

router.post(
    "/verify",
    upload.single("pdf"),
    upload.handleUploadError,
    verifyCertificateByPDF
);

// ========================================
// VERIFY CERTIFICATE BY ID
// ========================================

router.get(
    "/verify/:certificateId",
    verifyCertificate
);

// ========================================
// REVOKE CERTIFICATE
// ========================================

router.post(
    "/revoke/:certificateId",
    revokeCertificate
);

module.exports = router;
