const QRCode = require("qrcode");

const FRONTEND_URL =
    process.env.FRONTEND_URL ||
    "http://localhost:5173";

const isValidCertificateId = (certificateId) =>
    typeof certificateId === "string" &&
    /^CERT-[A-Za-z0-9-]+$/.test(certificateId);

const buildVerificationUrl = (certificateId) => {

    if (!isValidCertificateId(certificateId)) {
        throw new Error("Invalid certificate ID for QR generation");
    }

    const baseUrl = FRONTEND_URL.replace(/\/+$/, "");

    return `${baseUrl}/verify/${encodeURIComponent(certificateId)}`;
};

const generateQRCode = async (certificateId) => {

    try {

        const verificationUrl =
            buildVerificationUrl(certificateId);

        return await QRCode.toDataURL(verificationUrl, {
            errorCorrectionLevel: "M",
            type: "image/png",
            margin: 2,
            width: 320
        });

    } catch (error) {

        console.error("QR Generation Error:", error);

        throw new Error("Failed to generate QR code");
    }
};

module.exports = {
    generateQRCode,
    buildVerificationUrl
};
