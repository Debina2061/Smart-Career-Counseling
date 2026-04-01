import { FaGithub, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { Link } from "react-router-dom";

const quickLinks = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#process" },
  { label: "Outcomes", href: "#outcomes" },
];

const accountLinks = [
  { label: "Get Started", to: "/getstarted" },
  { label: "Sign Up", to: "/signup" },
  { label: "Sign In", to: "/signin" },
];

const socialLinks = [
  { label: "Instagram", href: "https://www.instagram.com/", icon: FaInstagram },
  { label: "LinkedIn", href: "https://www.linkedin.com/", icon: FaLinkedinIn },
  { label: "GitHub", href: "https://github.com/", icon: FaGithub },
];

function Footer() {
  return (
    <footer className="bg-[#0f243d] text-slate-200">
      <div className="landing-container py-16">
        <div className="grid gap-10 border-b border-[#1d3655] pb-10 lg:grid-cols-[1.25fr_0.75fr_0.75fr_1fr]">
          <div>
            <p className="landing-display text-2xl font-bold text-white">Smart Career</p>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-300">
              Practical, AI-powered career planning for students and fresh graduates ready to
              move from uncertainty to clear action.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-400">Product</h4>
            <ul className="mt-4 space-y-3 text-sm">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="transition hover:text-white">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-400">Account</h4>
            <ul className="mt-4 space-y-3 text-sm">
              {accountLinks.map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="transition hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-400">Connect</h4>
            <div className="mt-4 flex flex-wrap gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon;

                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 rounded-xl border border-[#1d3655] bg-[#132b46] px-3 py-2 text-sm transition hover:border-[#2e79ba] hover:text-white"
                  >
                    <Icon className="text-[#77b5f5]" />
                    <span>{social.label}</span>
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        <div className="pt-6 text-sm text-slate-400">
          <p>(c) {new Date().getFullYear()} Smart Career. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
