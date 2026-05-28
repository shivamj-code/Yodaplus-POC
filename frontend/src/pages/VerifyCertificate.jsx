import { useState } from "react";
import toast from "react-hot-toast";
import { FileSearch, Search, ShieldAlert, ShieldCheck } from "lucide-react";
import Button from "../components/Button";
import Card from "../components/Card";
import DetailRow from "../components/DetailRow";
import FileUpload from "../components/FileUpload";
import Input from "../components/Input";
import PageContainer from "../components/PageContainer";
import ProgressBar from "../components/ProgressBar";
import StatusAlert from "../components/StatusAlert";
import { useAsyncAction } from "../hooks/useAsyncAction";
import {
  verifyCertificateById,
  verifyCertificateByPdf
} from "../services/certificateService";
import {
  formatDate,
  getCertificate,
  isCertificateValid
} from "../utils/formatters";
import { isPdfFile } from "../utils/validation";

const VerifyCertificate = () => {
  const [mode, setMode] = useState("id");
  const [certificateId, setCertificateId] = useState("");
  const [pdf, setPdf] = useState(null);
  const [formError, setFormError] = useState("");
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null);
  const { loading, error, setError, run } = useAsyncAction();

  const resetResult = () => {
    setResult(null);
    setError("");
    setFormError("");
    setProgress(0);
  };

  const handleVerify = async (event) => {
    event.preventDefault();
    resetResult();

    if (mode === "id" && !certificateId.trim()) {
      setFormError("Certificate ID is required");
      return;
    }

    if (mode === "pdf" && (!pdf || !isPdfFile(pdf))) {
      setFormError("Upload a valid PDF file");
      return;
    }

    try {
      const data = await run(() =>
        mode === "id"
          ? verifyCertificateById(certificateId.trim())
          : verifyCertificateByPdf(pdf, (progressEvent) => {
              if (!progressEvent.total) return;
              setProgress(Math.round((progressEvent.loaded * 100) / progressEvent.total));
            })
      );

      setResult(data);
      if (isCertificateValid(data)) {
        toast.success("Certificate verified");
      } else {
        toast.error("Certificate is invalid or revoked");
      }
    } catch (err) {
      toast.error(err.userMessage || "Verification failed");
    }
  };

  const certificate = result ? getCertificate(result) : null;
  const valid = result ? isCertificateValid(result) : false;
  const blockchain = certificate?.blockchain || {};

  return (
    <PageContainer
      eyebrow="Verify"
      title="Verify Certificate"
      description="Validate a credential using its certificate ID or by uploading the original PDF."
    >
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1fr]">
        <Card className="p-6">
          <div className="mb-5 grid grid-cols-2 rounded-lg bg-slate-100 p-1">
            <button
              type="button"
              onClick={() => {
                setMode("id");
                resetResult();
              }}
              className={`rounded-md px-3 py-2 text-sm font-semibold transition ${
                mode === "id" ? "bg-white text-primary-700 shadow-sm" : "text-slate-600"
              }`}
            >
              Certificate ID
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("pdf");
                resetResult();
              }}
              className={`rounded-md px-3 py-2 text-sm font-semibold transition ${
                mode === "pdf" ? "bg-white text-primary-700 shadow-sm" : "text-slate-600"
              }`}
            >
              PDF Upload
            </button>
          </div>

          <form className="grid gap-5" onSubmit={handleVerify}>
            {mode === "id" ? (
              <Input
                id="verifyCertificateId"
                label="Certificate ID"
                value={certificateId}
                onChange={(event) => {
                  setCertificateId(event.target.value);
                  setFormError("");
                }}
                placeholder="CERT-1779863724523"
                error={formError}
              />
            ) : (
              <FileUpload
                id="verifyPdf"
                label="Upload Certificate PDF"
                file={pdf}
                error={formError}
                onChange={(file) => {
                  setPdf(file);
                  setFormError("");
                }}
                onClear={() => setPdf(null)}
              />
            )}
            {loading && mode === "pdf" && progress > 0 ? (
              <ProgressBar value={progress} />
            ) : null}
            {error ? (
              <StatusAlert type="error" title="Verification failed" message={error} />
            ) : null}
            <Button type="submit" loading={loading} icon={mode === "id" ? Search : FileSearch}>
              Verify Certificate
            </Button>
          </form>
        </Card>

        <div>
          {result ? (
            <Card className="p-6">
              <div
                className={`mb-5 flex items-center gap-3 rounded-lg border p-4 ${
                  valid
                    ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                    : "border-red-200 bg-red-50 text-red-800"
                }`}
              >
                {valid ? (
                  <ShieldCheck className="h-7 w-7" aria-hidden="true" />
                ) : (
                  <ShieldAlert className="h-7 w-7" aria-hidden="true" />
                )}
                <div>
                  <h2 className="text-lg font-bold">
                    {valid ? "Valid Certificate" : "Invalid Certificate"}
                  </h2>
                  <p className="text-sm opacity-90">
                    {valid
                      ? "The certificate record was found and is not revoked."
                      : "The certificate could not be validated or has been revoked."}
                  </p>
                </div>
              </div>

              <dl>
                <DetailRow label="Certificate ID" value={certificate?.certificateId} />
                <DetailRow
                  label="Student Name"
                  value={certificate?.studentName || certificate?.recipientName}
                />
                <DetailRow label="Course" value={certificate?.courseName || certificate?.course} />
                <DetailRow
                  label="Institution"
                  value={certificate?.institutionName || certificate?.institution}
                />
                <DetailRow
                  label="SHA256 Hash"
                  value={certificate?.hash || certificate?.documentHash || blockchain?.documentHash}
                  truncate
                />
                <DetailRow
                  label="Transaction Hash"
                  value={certificate?.txHash || blockchain?.txHash}
                  truncate
                />
                <DetailRow
                  label="Issued Date"
                  value={formatDate(certificate?.issuedAt || blockchain?.issuedAt)}
                />
                <DetailRow
                  label="Revocation Status"
                  value={blockchain?.revoked || certificate?.revoked ? "Revoked" : "Active"}
                />
              </dl>
            </Card>
          ) : (
            <Card className="p-6">
              <h2 className="text-lg font-bold text-slate-950">Verification result</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Search by certificate ID for the current backend. PDF verification will work when
                your backend exposes the multipart verification endpoint.
              </p>
            </Card>
          )}
        </div>
      </div>
    </PageContainer>
  );
};

export default VerifyCertificate;
