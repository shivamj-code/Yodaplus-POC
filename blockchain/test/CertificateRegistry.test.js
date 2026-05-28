const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CertificateRegistry", function () {

    let certificateRegistry;
    let owner;
    let addr1;

    beforeEach(async function () {

        [owner, addr1] = await ethers.getSigners();

        const CertificateRegistry = await ethers.getContractFactory("CertificateRegistry");

        certificateRegistry = await CertificateRegistry.deploy();

        await certificateRegistry.waitForDeployment();
    });

    describe("Certificate Issuance", function () {

        it("Should issue a certificate successfully", async function () {

            const certId = "CERT001";

            const documentHash = ethers.keccak256(
                ethers.toUtf8Bytes("Sample Certificate")
            );

            await certificateRegistry.issueCertificate(
                certId,
                documentHash
            );

            const cert = await certificateRegistry.verifyCertificate(certId);

            expect(cert.certificateId).to.equal(certId);
            expect(cert.documentHash).to.equal(documentHash);
            expect(cert.revoked).to.equal(false);
            expect(cert.valid).to.equal(true);
        });

        it("Should prevent duplicate certificate issuance", async function () {

            const certId = "CERT001";

            const documentHash = ethers.keccak256(
                ethers.toUtf8Bytes("Sample Certificate")
            );

            await certificateRegistry.issueCertificate(
                certId,
                documentHash
            );

            await expect(
                certificateRegistry.issueCertificate(
                    certId,
                    documentHash
                )
            ).to.be.revertedWith("Certificate already exists");
        });
    });

    describe("Certificate Verification", function () {

        it("Should return correct certificate details", async function () {

            const certId = "CERT002";

            const documentHash = ethers.keccak256(
                ethers.toUtf8Bytes("Blockchain Certificate")
            );

            await certificateRegistry.issueCertificate(
                certId,
                documentHash
            );

            const cert = await certificateRegistry.verifyCertificate(certId);

            expect(cert.certificateId).to.equal(certId);
            expect(cert.documentHash).to.equal(documentHash);
            expect(cert.issuer).to.equal(owner.address);
            expect(cert.revoked).to.equal(false);
            expect(cert.valid).to.equal(true);
        });
    });

    describe("Certificate Revocation", function () {

        it("Should revoke a certificate successfully", async function () {

            const certId = "CERT003";

            const documentHash = ethers.keccak256(
                ethers.toUtf8Bytes("Revokable Certificate")
            );

            await certificateRegistry.issueCertificate(
                certId,
                documentHash
            );

            await certificateRegistry.revokeCertificate(certId);

            const cert = await certificateRegistry.verifyCertificate(certId);

            expect(cert.revoked).to.equal(true);
            expect(cert.valid).to.equal(false);
        });

        it("Should prevent revoking nonexistent certificate", async function () {

            await expect(
                certificateRegistry.revokeCertificate("INVALID")
            ).to.be.revertedWith("Certificate does not exist");
        });
    });

    describe("Access Control", function () {

        it("Should prevent non-owner from issuing certificate", async function () {

            const certId = "CERT004";

            const documentHash = ethers.keccak256(
                ethers.toUtf8Bytes("Unauthorized")
            );

            await expect(
                certificateRegistry
                    .connect(addr1)
                    .issueCertificate(certId, documentHash)
            ).to.be.reverted;
        });

        it("Should prevent non-owner from revoking certificate", async function () {

            const certId = "CERT005";

            const documentHash = ethers.keccak256(
                ethers.toUtf8Bytes("Protected Certificate")
            );

            await certificateRegistry.issueCertificate(
                certId,
                documentHash
            );

            await expect(
                certificateRegistry
                    .connect(addr1)
                    .revokeCertificate(certId)
            ).to.be.reverted;
        });
    });
});