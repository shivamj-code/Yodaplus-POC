import { Loader2 } from "lucide-react";

const Loader = ({ label = "Loading" }) => (
  <div className="flex items-center justify-center gap-3 py-8 text-sm font-medium text-slate-600">
    <Loader2 className="h-5 w-5 animate-spin text-primary-600" aria-hidden="true" />
    <span>{label}</span>
  </div>
);

export default Loader;
