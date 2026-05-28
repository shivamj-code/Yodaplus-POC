const { ethers } = require("ethers");

const contractABI = require("../abi/CertificateRegistryABI.json");

require("dotenv").config();

// Environment variables
const RPC_URL = process.env.SEPOLIA_RPC_URL;

const PRIVATE_KEY = process.env.PRIVATE_KEY;

const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;

// Provider
const provider = new ethers.JsonRpcProvider(RPC_URL);

// Wallet
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

// Contract instance
const contract = new ethers.Contract(
    CONTRACT_ADDRESS,
    contractABI,
    wallet
);

// ========================================
// ISSUE CERTIFICATE ON BLOCKCHAIN
// ========================================

const issueCertificateOnChain = async (
    certificateId,
    documentHash
) => {

    try {

        const tx = await contract.issueCertificate(
            certificateId,
            "0x" + documentHash
        );

        const receipt = await tx.wait();

        return {
            success: true,
            txHash: receipt.hash
        };

    } catch (error) {

        console.error("Blockchain Issue Error:", error);

        throw error;
    }
};

// ========================================
// VERIFY CERTIFICATE FROM BLOCKCHAIN
// ========================================

const verifyCertificateOnChain = async (
    certificateId
) => {

    try {

        const result = await contract.verifyCertificate(
            certificateId
        );

        return {
            certificateId: result[0],
            documentHash: result[1],
            issuer: result[2],
            issuedAt: result[3].toString(),
            revoked: result[4],
            valid: result[5]
        };

    } catch (error) {

        console.error("Blockchain Verify Error:", error);

        throw error;
    }
};

// ========================================
// REVOKE CERTIFICATE
// ========================================

const revokeCertificateOnChain = async (
    certificateId
) => {

    try {

        const tx = await contract.revokeCertificate(
            certificateId
        );

        const receipt = await tx.wait();

        return {
            success: true,
            txHash: receipt.hash
        };

    } catch (error) {

        console.error("Blockchain Revoke Error:", error);

        throw error;
    }
};

module.exports = {
    issueCertificateOnChain,
    verifyCertificateOnChain,
    revokeCertificateOnChain
};