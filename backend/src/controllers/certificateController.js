const db = require("../config/db");
const fs = require("fs/promises");

const {
    generateFileHash
} = require("../services/hashService");

const {
    issueCertificateOnChain,
    verifyCertificateOnChain,
    revokeCertificateOnChain
} = require("../services/blockchainService");

const getCertificateByHash = (hash) => {

    return new Promise((resolve, reject) => {

        db.get(
            `
            SELECT *
            FROM certificates
            WHERE documentHash = ?
            `,
            [hash],
            (err, row) => {

                if (err) {
                    return reject(err);
                }

                resolve(row);
            }
        );
    });
};

const cleanupUploadedFile = async (filePath) => {

    if (!filePath) {
        return;
    }

    try {
        await fs.unlink(filePath);
    } catch (error) {
        console.warn("Uploaded file cleanup failed:", error.message);
    }
};

const normalizeHash = (hash = "") => hash.replace(/^0x/i, "").toLowerCase();

const buildCertificateResponse = (row, blockchainData) => {

    const isRevoked =
        row.revoked === 1 ||
        row.revoked === true ||
        blockchainData.revoked === true;

    const hashMatches =
        normalizeHash(blockchainData.documentHash) ===
        normalizeHash(row.documentHash);

    const valid =
        Boolean(blockchainData.valid) &&
        hashMatches &&
        !isRevoked;

    return {
        valid,
        certificate: {
            certificateId: row.certificateId,
            studentName: row.recipientName,
            recipientName: row.recipientName,
            courseName: row.course,
            course: row.course,
            institutionName: row.institutionName || "",
            hash: row.documentHash,
            documentHash: row.documentHash,
            txHash: row.txHash,
            isRevoked,
            revoked: isRevoked,
            issuedAt: blockchainData.issuedAt || row.createdAt,
            createdAt: row.createdAt,
            blockchain: blockchainData
        }
    };
};

// ========================================
// ISSUE CERTIFICATE
// ========================================

const issueCertificate = async (req, res) => {

    try {

        const { recipientName, course } = req.body;

        if (!recipientName || !course) {

            return res.status(400).json({
                success: false,
                message:
                    "recipientName and course are required"
            });
        }

        if (!req.file) {

            return res.status(400).json({
                success: false,
                message: "No PDF uploaded"
            });
        }

        // Generate SHA256 hash
        const hash = await generateFileHash(
            req.file.path
        );

        // Generate certificate ID
        const certificateId =
            "CERT-" + Date.now();

        // Store on blockchain
        const blockchainResult =
            await issueCertificateOnChain(
                certificateId,
                hash
            );

        // Save in database
        db.run(
            `
            INSERT INTO certificates (
                certificateId,
                recipientName,
                course,
                documentHash,
                txHash,
                revoked
            )
            VALUES (?, ?, ?, ?, ?, ?)
            `,
            [
                certificateId,
                recipientName,
                course,
                hash,
                blockchainResult.txHash,
                0
            ],
            function (err) {

                if (err) {

                    console.error(err);

                    return res.status(500).json({
                        success: false,
                        message:
                            "Database insert failed"
                    });
                }

                return res.status(201).json({
                    success: true,
                    message:
                        "Certificate issued successfully",

                    data: {
                        certificateId,
                        recipientName,
                        course,
                        hash,
                        txHash:
                            blockchainResult.txHash
                    }
                });
            }
        );

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ========================================
// VERIFY CERTIFICATE BY PDF
// ========================================

const verifyCertificateByPDF = async (req, res) => {

    try {

        if (!req.file) {

            return res.status(400).json({
                success: false,
                valid: false,
                message: "PDF file is required"
            });
        }

        const uploadedHash = await generateFileHash(
            req.file.path
        );

        const row = await getCertificateByHash(
            uploadedHash
        );

        if (!row) {

            return res.status(404).json({
                success: false,
                valid: false,
                message: "Certificate not found"
            });
        }

        const blockchainData =
            await verifyCertificateOnChain(
                row.certificateId
            );

        const verification =
            buildCertificateResponse(
                row,
                blockchainData
            );

        return res.status(200).json({
            success: verification.valid,
            valid: verification.valid,
            message: verification.valid
                ? "Certificate verified successfully"
                : "Certificate is invalid or revoked",
            certificate: verification.certificate
        });

    } catch (error) {

        console.error("PDF Verification Error:", error);

        return res.status(500).json({
            success: false,
            valid: false,
            message: error.message || "PDF verification failed"
        });

    } finally {

        await cleanupUploadedFile(req.file && req.file.path);
    }
};

// ========================================
// VERIFY CERTIFICATE
// ========================================

const verifyCertificate = async (req, res) => {

    try {

        const { certificateId } = req.params;

        // Get blockchain data
        const blockchainData =
            await verifyCertificateOnChain(
                certificateId
            );

        // Get DB data
        db.get(
            `
            SELECT *
            FROM certificates
            WHERE certificateId = ?
            `,
            [certificateId],
            (err, row) => {

                if (err) {

                    return res.status(500).json({
                        success: false,
                        message:
                            "Database query failed"
                    });
                }

                if (!row) {

                    return res.status(404).json({
                        success: false,
                        message:
                            "Certificate not found"
                    });
                }

                return res.status(200).json({
                    success: true,

                    data: {
                        certificateId:
                            row.certificateId,

                        recipientName:
                            row.recipientName,

                        course:
                            row.course,

                        documentHash:
                            row.documentHash,

                        txHash:
                            row.txHash,

                        blockchain:
                            blockchainData
                    }
                });
            }
        );

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ========================================
// REVOKE CERTIFICATE
// ========================================

const revokeCertificate = async (req, res) => {

    try {

        const { certificateId } = req.params;

        // Revoke on blockchain
        const blockchainResult =
            await revokeCertificateOnChain(
                certificateId
            );

        // Update DB
        db.run(
            `
            UPDATE certificates
            SET revoked = 1
            WHERE certificateId = ?
            `,
            [certificateId],
            function (err) {

                if (err) {

                    return res.status(500).json({
                        success: false,
                        message:
                            "Database update failed"
                    });
                }

                return res.status(200).json({
                    success: true,
                    message:
                        "Certificate revoked successfully",

                    data: {
                        certificateId,
                        txHash:
                            blockchainResult.txHash
                    }
                });
            }
        );

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    issueCertificate,
    verifyCertificateByPDF,
    verifyCertificate,
    revokeCertificate
};
