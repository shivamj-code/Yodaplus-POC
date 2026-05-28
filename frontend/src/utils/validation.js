export const isPdfFile = (file) =>
  file?.type === "application/pdf" || file?.name?.toLowerCase().endsWith(".pdf");

export const validateRequired = (value, label) => {
  if (!String(value || "").trim()) return `${label} is required`;
  return "";
};
