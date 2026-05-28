import { FileText, UploadCloud, X } from "lucide-react";
import Button from "./Button";

const FileUpload = ({ id, label, file, error, onChange, onClear }) => (
  <div className="space-y-2">
    <label htmlFor={id} className="block text-sm font-medium text-slate-700">
      {label}
    </label>
    <label
      htmlFor={id}
      className="flex cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 px-6 py-8 text-center transition hover:border-primary-400 hover:bg-primary-50"
    >
      <UploadCloud className="h-8 w-8 text-primary-600" aria-hidden="true" />
      <span className="mt-3 text-sm font-semibold text-slate-800">
        Upload PDF certificate
      </span>
      <span className="mt-1 text-xs text-slate-500">PDF files only</span>
      <input
        id={id}
        type="file"
        accept="application/pdf,.pdf"
        className="sr-only"
        onChange={(event) => onChange(event.target.files?.[0] || null)}
        aria-invalid={Boolean(error)}
      />
    </label>
    {file ? (
      <div className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3">
        <div className="flex min-w-0 items-center gap-3">
          <FileText className="h-5 w-5 shrink-0 text-primary-600" aria-hidden="true" />
          <span className="truncate text-sm font-medium text-slate-700">{file.name}</span>
        </div>
        <Button
          type="button"
          variant="ghost"
          className="min-h-9 px-3"
          icon={X}
          onClick={onClear}
          aria-label="Remove selected PDF"
        />
      </div>
    ) : null}
    {error ? <p className="text-sm text-red-600">{error}</p> : null}
  </div>
);

export default FileUpload;
