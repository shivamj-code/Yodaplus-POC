import { Download, ExternalLink, QrCode } from "lucide-react";
import Button from "./Button";

const downloadDataUrl = (dataUrl, filename) => {
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
};

const QRCodeCard = ({ qrCode, certificateId, verificationUrl }) => {
  if (!qrCode) return null;

  const handleDownload = () => {
    downloadDataUrl(qrCode, `${certificateId || "certificate"}-qr.png`);
  };

  return (
    <div className="mt-6 rounded-lg border border-slate-200 bg-slate-50 p-5">
      <div className="mb-4 flex items-center gap-2 text-slate-900">
        <QrCode className="h-5 w-5 text-primary-600" aria-hidden="true" />
        <h3 className="text-base font-bold">Verification QR</h3>
      </div>
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
        <img
          src={qrCode}
          alt={`Verification QR for ${certificateId}`}
          className="h-44 w-44 rounded-lg border border-slate-200 bg-white p-2 object-contain"
        />
        <div className="grid flex-1 gap-3">
          <p className="break-all text-sm leading-6 text-slate-600">
            {verificationUrl}
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button variant="secondary" icon={Download} onClick={handleDownload}>
              Download QR
            </Button>
            {verificationUrl ? (
              <Button
                as="a"
                href={verificationUrl}
                target="_blank"
                rel="noreferrer"
                icon={ExternalLink}
              >
                Open Verification
              </Button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRCodeCard;
