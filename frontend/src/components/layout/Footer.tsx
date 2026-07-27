import { Link } from "react-router-dom";
import { MapPin, Phone, Mail } from "lucide-react";
import { FaFacebookF, FaYoutube, FaInstagram } from "react-icons/fa";
import { useSettings } from "../../context/SettingsContext";

export default function Footer() {
  const { settings } = useSettings();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-maroon-700 bg-maroon-600 text-cream-100">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-3 lg:px-8">
        
        {/* College Info */}
        <div>
          <h3 className="font-display text-lg font-semibold text-cream-50">
            {settings?.collegeName || "College Name"}
          </h3>

          <p className="mt-3 text-sm leading-relaxed text-maroon-100">
            {settings?.tagline || ""}
          </p>

          <div className="mt-4 flex gap-3">
            {settings?.socialLinks?.facebook && (
              <a
                href={settings.socialLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-maroon-500 p-2 transition-colors hover:bg-gold-500"
                aria-label="Facebook"
              >
                <FaFacebookF size={16} />
              </a>
            )}

            {settings?.socialLinks?.youtube && (
              <a
                href={settings.socialLinks.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-maroon-500 p-2 transition-colors hover:bg-gold-500"
                aria-label="YouTube"
              >
                <FaYoutube size={16} />
              </a>
            )}

            {settings?.socialLinks?.instagram && (
              <a
                href={settings.socialLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-maroon-500 p-2 transition-colors hover:bg-gold-500"
                aria-label="Instagram"
              >
                <FaInstagram size={16} />
              </a>
            )}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wide text-gold-400">
            Quick Links
          </h4>

          <ul className="mt-3 space-y-2 text-sm text-maroon-100">
            <li>
              <Link to="/about" className="hover:text-cream-50">
                About Us
              </Link>
            </li>

            <li>
              <Link to="/courses" className="hover:text-cream-50">
                Courses Offered
              </Link>
            </li>

            <li>
              <Link to="/admission" className="hover:text-cream-50">
                Admissions
              </Link>
            </li>

            <li>
              <Link to="/notices" className="hover:text-cream-50">
                Notice Board
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wide text-gold-400">
            Contact
          </h4>

          <ul className="mt-3 space-y-3 text-sm text-maroon-100">
            <li className="flex items-start gap-2">
              <MapPin size={16} className="mt-0.5 shrink-0" />
              <span>{settings?.address || "—"}</span>
            </li>

            <li className="flex items-center gap-2">
              <Phone size={16} className="shrink-0" />
              <span>{settings?.phone || "—"}</span>
            </li>

            <li className="flex items-center gap-2">
              <Mail size={16} className="shrink-0" />
              <span>{settings?.email || "—"}</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-maroon-500 px-4 py-4 text-center text-xs text-maroon-200">
        © {year} {settings?.collegeName || "College Name"}. All rights
        reserved.
      </div>
    </footer>
  );
}