import { Link, NavLink } from "react-router-dom";
import { Award, Menu, X } from "lucide-react";
import { useState } from "react";
import Button from "./Button";

const navItems = [
  { label: "Home", path: "/" },
  { label: "Issue", path: "/issue" },
  { label: "Verify", path: "/verify" },
  { label: "Revoke", path: "/revoke" }
];

const linkClass = ({ isActive }) =>
  `rounded-lg px-3 py-2 text-sm font-semibold transition ${
    isActive
      ? "bg-primary-50 text-primary-700"
      : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
  }`;

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-600 text-white">
            <Award className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className="text-lg font-bold text-slate-950">CertChain</span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <NavLink key={item.path} to={item.path} className={linkClass}>
              {item.label}
            </NavLink>
          ))}
        </div>

        <Button
          variant="secondary"
          className="min-h-10 px-3 md:hidden"
          icon={open ? X : Menu}
          onClick={() => setOpen((value) => !value)}
          aria-label="Toggle navigation"
          aria-expanded={open}
        />
      </nav>

      {open ? (
        <div className="border-t border-slate-200 bg-white px-4 py-3 md:hidden">
          <div className="mx-auto grid max-w-6xl gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={linkClass}
                onClick={() => setOpen(false)}
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        </div>
      ) : null}
    </header>
  );
};

export default Navbar;
