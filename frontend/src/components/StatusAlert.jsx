const styles = {
  success: "border-emerald-200 bg-emerald-50 text-emerald-800",
  error: "border-red-200 bg-red-50 text-red-800",
  info: "border-blue-200 bg-blue-50 text-blue-800"
};

const StatusAlert = ({ type = "info", title, message }) => (
  <div className={`rounded-lg border px-4 py-3 ${styles[type]}`} role="status">
    <p className="font-semibold">{title}</p>
    {message ? <p className="mt-1 text-sm opacity-90">{message}</p> : null}
  </div>
);

export default StatusAlert;
