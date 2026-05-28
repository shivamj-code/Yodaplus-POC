// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract CertificateRegistry is Ownable {

    struct Certificate {
        string certificateId;
        bytes32 documentHash;
        address issuer;
        uint256 issuedAt;
        bool revoked;
    }

    mapping(string => Certificate) private certificates;

    event CertificateIssued(
        string certificateId,
        bytes32 documentHash,
        address issuer,
        uint256 issuedAt
    );

    event CertificateRevoked(
        string certificateId,
        address revokedBy,
        uint256 revokedAt
    );

    constructor() Ownable(msg.sender) {}

    function issueCertificate(
        string memory _certificateId,
        bytes32 _documentHash
    ) public onlyOwner {

        require(
            certificates[_certificateId].issuedAt == 0,
            "Certificate already exists"
        );

        certificates[_certificateId] = Certificate({
            certificateId: _certificateId,
            documentHash: _documentHash,
            issuer: msg.sender,
            issuedAt: block.timestamp,
            revoked: false
        });

        emit CertificateIssued(
            _certificateId,
            _documentHash,
            msg.sender,
            block.timestamp
        );
    }

    function verifyCertificate(
        string memory _certificateId
    )
        public
        view
        returns (
            string memory certificateId,
            bytes32 documentHash,
            address issuer,
            uint256 issuedAt,
            bool revoked,
            bool valid
        )
    {
        Certificate memory cert = certificates[_certificateId];

        require(cert.issuedAt != 0, "Certificate does not exist");

        bool isValid = !cert.revoked;

        return (
            cert.certificateId,
            cert.documentHash,
            cert.issuer,
            cert.issuedAt,
            cert.revoked,
            isValid
        );
    }

    function revokeCertificate(
        string memory _certificateId
    ) public onlyOwner {

        require(
            certificates[_certificateId].issuedAt != 0,
            "Certificate does not exist"
        );

        require(
            !certificates[_certificateId].revoked,
            "Certificate already revoked"
        );

        certificates[_certificateId].revoked = true;

        emit CertificateRevoked(
            _certificateId,
            msg.sender,
            block.timestamp
        );
    }
}