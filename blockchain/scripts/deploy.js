const hre = require("hardhat");

async function main() {

    console.log("Deploying CertificateRegistry contract...");

    const CertificateRegistry = await hre.ethers.getContractFactory(
        "CertificateRegistry"
    );

    const certificateRegistry = await CertificateRegistry.deploy();

    await certificateRegistry.waitForDeployment();

    const contractAddress = await certificateRegistry.getAddress();

    console.log("====================================");
    console.log("CertificateRegistry deployed to:");
    console.log(contractAddress);
    console.log("====================================");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});