const Card = ({ children, className = "" }) => (
  <div className={`rounded-lg border border-slate-200 bg-white shadow-soft ${className}`}>
    {children}
  </div>
);

export default Card;
