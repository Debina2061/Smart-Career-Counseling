import { Link } from "react-router-dom";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#process" },
  { label: "Outcomes", href: "#outcomes" },
];

function Header() {
  return (
    <header className="landing-header sticky top-0 z-50">
      <div className="landing-container flex h-16 items-center justify-between sm:h-20">
        <Link to="/" className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#155b9a] text-sm font-extrabold text-white">
            SC
          </span>
          <span className="landing-display text-lg font-bold tracking-tight text-[#112845] sm:text-xl">Smart Career</span>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm font-semibold text-[#425471] transition hover:text-[#112845]"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            to="/signin"
            className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-[#425471] transition hover:border-slate-400 hover:bg-slate-50 sm:px-4 sm:text-sm"
          >
            Sign In
          </Link>
          <Link
            to="/signup"
            className="rounded-xl bg-[#155b9a] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#124b80] sm:px-5 sm:text-sm"
          >
            Start Free
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Header;
