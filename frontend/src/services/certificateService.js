import api from "../api/api";

const extractPayload = (response) => {
  const body = response?.data || {};
  return body.data ? { ...body, ...body.data } : body;
};

const shouldFallback = (error) =>
  error?.status === 404 || error?.status === 405 || error?.status === 400;

export const issueCertificate = async (
  { studentName, courseName, institutionName, pdf },
  onUploadProgress
) => {
  const formData = new FormData();

  // Send both frontend-friendly and current backend field names.
  formData.append("studentName", studentName);
  formData.append("recipientName", studentName);
  formData.append("courseName", courseName);
  formData.append("course", courseName);
  formData.append("institutionName", institutionName);
  formData.append("pdf", pdf);

  const response = await api.post("/certificates/issue", formData, {
    headers: { "Content-Type": "multipart/form-data" },
    onUploadProgress
  });

  return extractPayload(response);
};

export const verifyCertificateById = async (certificateId) => {
  try {
    const response = await api.post("/certificates/verify", { certificateId });
    return extractPayload(response);
  } catch (error) {
    if (!shouldFallback(error)) throw error;

    const fallback = await api.get(
      `/certificates/verify/${encodeURIComponent(certificateId)}`
    );
    return extractPayload(fallback);
  }
};

export const verifyCertificateByPdf = async (pdf, onUploadProgress) => {
  const formData = new FormData();
  formData.append("pdf", pdf);

  const response = await api.post("/certificates/verify", formData, {
    headers: { "Content-Type": "multipart/form-data" },
    onUploadProgress
  });

  return extractPayload(response);
};

export const revokeCertificate = async (certificateId) => {
  try {
    const response = await api.post("/certificates/revoke", { certificateId });
    return extractPayload(response);
  } catch (error) {
    if (!shouldFallback(error)) throw error;

    const fallback = await api.post(
      `/certificates/revoke/${encodeURIComponent(certificateId)}`
    );
    return extractPayload(fallback);
  }
};
