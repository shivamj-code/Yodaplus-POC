import { useState } from "react";
import toast from "react-hot-toast";
import { Ban, CheckCircle2 } from "lucide-react";
import Button from "../components/Button";
import Card from "../components/Card";
import DetailRow from "../components/DetailRow";
import Input from "../components/Input";
import PageContainer from "../components/PageContainer";
import StatusAlert from "../components/StatusAlert";
import { useAsyncAction } from "../hooks/useAsyncAction";
import { revokeCertificate } from "../services/certificateService";
import { validateRequired } from "../utils/validation";

const RevokeCertificate = () => {
  const [certificateId, setCertificateId] = useState("");
  const [formError, setFormError] = useState("");
  const [result, setResult] = useState(null);
  const { loading, error, run } = useAsyncAction();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setResult(null);

    const validationError = validateRequired(certificateId, "Certificate ID");
    if (validationError) {
      setFormError(validationError);
      return;
    }

    try {
      const data = await run(() => revokeCertificate(certificateId.trim()));
      setResult(data);
      setCertificateId("");
      toast.success("Certificate revoked successfully");
    } catch (err) {
      toast.error(err.userMessage || "Failed to revoke certificate");
    }
  };

  return (
    <PageContainer
      eyebrow="Admin"
      title="Revoke Certificate"
      description="Revoke a certificate by ID and record the revocation transaction on blockchain."
    >
      <div className="grid gap-6 lg:grid-cols-[0.85fr_1fr]">
        <Card className="p-6">
          <form className="grid gap-5" onSubmit={handleSubmit}>
            <Input
              id="revokeCertificateId"
              label="Certificate ID"
              value={certificateId}
              onChange={(event) => {
                setCertificateId(event.target.value);
                setFormError("");
              }}
              placeholder="CERT-1779863724523"
              error={formError}
            />
            {error ? <StatusAlert type="error" title="Revocation failed" message={error} /> : null}
            <Button type="submit" variant="danger" loading={loading} icon={Ban}>
              Revoke Certificate
            </Button>
          </form>
        </Card>

        <div>
          {result ? (
            <Card className="p-6">
              <div className="mb-4 flex items-center gap-3 text-emerald-700">
                <CheckCircle2 className="h-6 w-6" aria-hidden="true" />
                <h2 className="text-xl font-bold">Certificate revoked</h2>
              </div>
              <dl>
                <DetailRow label="Certificate ID" value={result.certificateId} />
                <DetailRow label="Transaction Hash" value={result.txHash} truncate />
              </dl>
            </Card>
          ) : (
            <Card className="p-6">
              <h2 className="text-lg font-bold text-slate-950">Admin action</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Revocation should be used when a certificate is issued incorrectly, compromised, or
                no longer valid. The frontend will show backend and blockchain errors clearly.
              </p>
            </Card>
          )}
        </div>
      </div>
    </PageContainer>
  );
};

export default RevokeCertificate;
