const crypto = require("crypto");
const fs = require("fs");

// Generate SHA256 hash from uploaded PDF
const generateFileHash = (filePath) => {

    return new Promise((resolve, reject) => {

        if (!filePath) {
            return reject(new Error("File path is required for hashing"));
        }

        const hash = crypto.createHash("sha256");
        const stream = fs.createReadStream(filePath);

        stream.on("error", reject);

        stream.on("data", (chunk) => {
            hash.update(chunk);
        });

        stream.on("end", () => {
            resolve(hash.digest("hex"));
        });
    });
};

module.exports = {
    generateFileHash
};
