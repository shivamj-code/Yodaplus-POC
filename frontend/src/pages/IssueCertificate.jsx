import { useState } from "react";
import toast from "react-hot-toast";
import { CheckCircle2, Send } from "lucide-react";
import Button from "../components/Button";
import Card from "../components/Card";
import DetailRow from "../components/DetailRow";
import FileUpload from "../components/FileUpload";
import Input from "../components/Input";
import PageContainer from "../components/PageContainer";
import ProgressBar from "../components/ProgressBar";
import StatusAlert from "../components/StatusAlert";
import { useAsyncAction } from "../hooks/useAsyncAction";
import { issueCertificate } from "../services/certificateService";
import { isPdfFile, validateRequired } from "../utils/validation";

const initialForm = {
  studentName: "",
  courseName: "",
  institutionName: "",
  pdf: null
};

const IssueCertificate = () => {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null);
  const { loading, error, run } = useAsyncAction();

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: "" }));
  };

  const validate = () => {
    const nextErrors = {
      studentName: validateRequired(form.studentName, "Student name"),
      courseName: validateRequired(form.courseName, "Course name"),
      institutionName: validateRequired(form.institutionName, "Institution name"),
      pdf: !form.pdf ? "Certificate PDF is required" : !isPdfFile(form.pdf) ? "Upload a valid PDF file" : ""
    };

    setErrors(nextErrors);
    return !Object.values(nextErrors).some(Boolean);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    setProgress(0);
    setResult(null);

    try {
      const data = await run(() =>
        issueCertificate(form, (progressEvent) => {
          if (!progressEvent.total) return;
          setProgress(Math.round((progressEvent.loaded * 100) / progressEvent.total));
        })
      );

      setResult(data);
      setForm(initialForm);
      toast.success("Certificate issued successfully");
    } catch (err) {
      toast.error(err.userMessage || "Failed to issue certificate");
    }
  };

  return (
    <PageContainer
      eyebrow="Issue"
      title="Issue Certificate"
      description="Create a certificate record, hash the PDF, and store the proof on blockchain."
    >
      <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
        <Card className="p-6">
          <form className="grid gap-5" onSubmit={handleSubmit}>
            <Input
              id="studentName"
              label="Student Name"
              value={form.studentName}
              onChange={(event) => updateField("studentName", event.target.value)}
              placeholder="e.g. Aditi Sharma"
              error={errors.studentName}
            />
            <Input
              id="courseName"
              label="Course Name"
              value={form.courseName}
              onChange={(event) => updateField("courseName", event.target.value)}
              placeholder="e.g. Blockchain Fundamentals"
              error={errors.courseName}
            />
            <Input
              id="institutionName"
              label="Institution Name"
              value={form.institutionName}
              onChange={(event) => updateField("institutionName", event.target.value)}
              placeholder="e.g. Yodaplus Academy"
              error={errors.institutionName}
            />
            <FileUpload
              id="issuePdf"
              label="PDF Upload"
              file={form.pdf}
              error={errors.pdf}
              onChange={(file) => updateField("pdf", file)}
              onClear={() => updateField("pdf", null)}
            />
            {loading && progress > 0 ? <ProgressBar value={progress} /> : null}
            {error ? (
              <StatusAlert type="error" title="Issuance failed" message={error} />
            ) : null}
            <Button type="submit" loading={loading} icon={Send}>
              Issue Certificate
            </Button>
          </form>
        </Card>

        <div>
          {result ? (
            <Card className="p-6">
              <div className="mb-4 flex items-center gap-3 text-emerald-700">
                <CheckCircle2 className="h-6 w-6" aria-hidden="true" />
                <h2 className="text-xl font-bold">Certificate issued</h2>
              </div>
              <dl>
                <DetailRow label="Certificate ID" value={result.certificateId} />
                <DetailRow label="SHA256 Hash" value={result.hash || result.documentHash} truncate />
                <DetailRow label="Transaction Hash" value={result.txHash} truncate />
              </dl>
              {result.qrCode || result.qrCodeUrl ? (
                <img
                  src={result.qrCode || result.qrCodeUrl}
                  alt="Certificate verification QR code"
                  className="mt-5 h-36 w-36 rounded-lg border border-slate-200 object-contain"
                />
              ) : null}
            </Card>
          ) : (
            <Card className="p-6">
              <h2 className="text-lg font-bold text-slate-950">Ready to issue</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Submit learner details with the certificate PDF. The backend will create the
                certificate ID, compute the SHA256 hash, and return the blockchain transaction.
              </p>
            </Card>
          )}
        </div>
      </div>
    </PageContainer>
  );
};

export default IssueCertificate;
