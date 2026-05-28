import { Loader2 } from "lucide-react";

const variants = {
  primary:
    "bg-primary-600 text-white hover:bg-primary-700 focus-visible:ring-primary-500",
  secondary:
    "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 focus-visible:ring-primary-500",
  danger: "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500",
  ghost: "bg-transparent text-slate-700 hover:bg-slate-100 focus-visible:ring-primary-500"
};

const Button = ({
  children,
  as: Component = "button",
  type = "button",
  variant = "primary",
  loading = false,
  disabled = false,
  className = "",
  icon: Icon,
  ...props
}) => (
  <Component
    type={Component === "button" ? type : undefined}
    disabled={disabled || loading}
    aria-disabled={Component !== "button" ? disabled || loading : undefined}
    className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold shadow-sm transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${className}`}
    {...props}
  >
    {loading ? (
      <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
    ) : Icon ? (
      <Icon className="h-4 w-4" aria-hidden="true" />
    ) : null}
    {children}
  </Component>
);

export default Button;
