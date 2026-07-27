import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X, GraduationCap } from "lucide-react";
import { useSettings } from "../../context/SettingsContext";
import { useAuth } from "../../context/AuthContext";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/courses", label: "Courses" },
  { to: "/faculty", label: "Faculty" },
  { to: "/notices", label: "Notices" },
  { to: "/gallery", label: "Gallery" },
  { to: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { settings } = useSettings();
  const { user } = useAuth();

  // College name seedhai backend-controlled settings bata aaउँछ.
  // Admin ले dashboard बाट college ko naam change garyo bhane,
  // yo automatically next load ma update huncha — code change pardैन.
  const collegeName = settings?.shortName || "College";

  return (
    <header className="sticky top-0 z-50 border-b border-maroon-100 bg-cream-50/95 backdrop-blur-sm">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2.5" onClick={() => setIsMenuOpen(false)}>
  {settings?.logoUrl ? (
    <img
      src={settings.logoUrl}
      alt={collegeName}
      className="h-12 w-12 object-contain"
    />
  ) : (
    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-maroon-500 text-cream-50">
      <GraduationCap size={22} strokeWidth={2} />
    </span>
  )}
  <span className="font-display text-xl font-semibold text-maroon-600">{collegeName}</span>
</Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  isActive ? "text-maroon-600" : "text-ink-700 hover:text-maroon-500"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <Link
            to="/admission"
            className="rounded-md bg-gold-500 px-4 py-2 text-sm font-semibold text-ink-900 transition-colors hover:bg-gold-400"
          >
            Apply now
          </Link>
          <Link
            to={user ? "/dashboard" : "/login"}
            className="rounded-md border border-maroon-500 px-4 py-2 text-sm font-semibold text-maroon-600 transition-colors hover:bg-maroon-50"
          >
            {user ? "Dashboard" : "Login"}
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <button
          className="rounded-md p-2 text-maroon-600 lg:hidden"
          onClick={() => setIsMenuOpen((open) => !open)}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile nav panel */}
      {isMenuOpen && (
        <div className="border-t border-maroon-100 bg-cream-50 lg:hidden">
          <div className="flex flex-col gap-1 px-4 py-3">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) =>
                  `rounded-md px-3 py-2.5 text-sm font-medium ${
                    isActive ? "bg-maroon-50 text-maroon-600" : "text-ink-700"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
            <Link
              to="/admission"
              onClick={() => setIsMenuOpen(false)}
              className="mt-2 rounded-md bg-gold-500 px-3 py-2.5 text-center text-sm font-semibold text-ink-900"
            >
             Apply Now
            </Link>
            <Link
              to={user ? "/dashboard" : "/login"}
              onClick={() => setIsMenuOpen(false)}
              className="rounded-md border border-maroon-500 px-3 py-2.5 text-center text-sm font-semibold text-maroon-600"
            >
              {user ? "Dashboard" : "Login"}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}