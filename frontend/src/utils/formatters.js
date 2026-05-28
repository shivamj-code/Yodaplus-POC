export const truncateMiddle = (value = "", start = 12, end = 10) => {
  if (!value || value.length <= start + end + 3) return value;
  return `${value.slice(0, start)}...${value.slice(-end)}`;
};

export const formatDate = (value) => {
  if (!value) return "Not available";

  const numeric = Number(value);
  const date =
    Number.isFinite(numeric) && numeric > 0
      ? new Date(numeric < 10000000000 ? numeric * 1000 : numeric)
      : new Date(value);

  if (Number.isNaN(date.getTime())) return "Not available";

  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(date);
};

export const getCertificate = (payload = {}) =>
  payload.certificate || payload.data?.certificate || payload.data || payload;

export const isCertificateValid = (payload = {}) => {
  const certificate = getCertificate(payload);

  if (typeof payload.valid === "boolean") return payload.valid;
  if (typeof certificate.valid === "boolean") return certificate.valid;
  if (certificate.blockchain?.revoked === true) return false;
  if (certificate.revoked === true || certificate.revoked === 1) return false;
  if (payload.success === true) return true;

  return false;
};
