import { truncateMiddle } from "../utils/formatters";

const DetailRow = ({ label, value, truncate = false }) => (
  <div className="border-b border-slate-100 py-3 last:border-0">
    <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
      {label}
    </dt>
    <dd className="mt-1 break-words text-sm font-medium text-slate-900">
      {truncate ? truncateMiddle(String(value || "Not available")) : value || "Not available"}
    </dd>
  </div>
);

export default DetailRow;
