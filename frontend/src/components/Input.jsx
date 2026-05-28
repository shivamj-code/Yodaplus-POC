const Input = ({
  label,
  id,
  error,
  helperText,
  className = "",
  ...props
}) => (
  <div className="space-y-2">
    {label ? (
      <label htmlFor={id} className="block text-sm font-medium text-slate-700">
        {label}
      </label>
    ) : null}
    <input
      id={id}
      className={`w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 ${className}`}
      aria-invalid={Boolean(error)}
      aria-describedby={error ? `${id}-error` : helperText ? `${id}-help` : undefined}
      {...props}
    />
    {helperText ? (
      <p id={`${id}-help`} className="text-xs text-slate-500">
        {helperText}
      </p>
    ) : null}
    {error ? (
      <p id={`${id}-error`} className="text-sm text-red-600">
        {error}
      </p>
    ) : null}
  </div>
);

export default Input;
