const ProgressBar = ({ value }) => (
  <div className="space-y-2" aria-live="polite">
    <div className="h-2 overflow-hidden rounded-full bg-slate-100">
      <div
        className="h-full rounded-full bg-primary-600 transition-all"
        style={{ width: `${Math.min(Math.max(value, 0), 100)}%` }}
      />
    </div>
    <p className="text-xs font-medium text-slate-500">{value}% uploaded</p>
  </div>
);

export default ProgressBar;
