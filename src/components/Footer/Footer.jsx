
import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaInstagram,
} from "react-icons/fa";
import { BsTwitterX } from "react-icons/bs";
import {
  MdArrowOutward,
  MdEmail,
  MdLocationOn,
  MdPets,
  MdPhone,
} from "react-icons/md";

const FOOTER_LINKS = [
  { label: "Home", path: "/" },
  { label: "Pets & Supplies", path: "/pets&Supplies" },
  { label: "About Us", path: "/about-us" },
  { label: "Contact", path: "/contact" },
  { label: "Terms & Conditions", path: "/terms-and-conditions" },
];

const SOCIAL_LINKS = [
  {
    label: "Facebook",
    href: null,
    icon: FaFacebookF,
    className: "hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-500/10 dark:hover:text-blue-400",
  },
  {
    label: "Instagram",
    href: null,
    icon: FaInstagram,
    className: "hover:bg-pink-50 hover:text-pink-600 dark:hover:bg-pink-500/10 dark:hover:text-pink-400",
  },
  {
    label: "X",
    href: null,
    icon: BsTwitterX,
    className: "hover:bg-slate-100 hover:text-slate-950 dark:hover:bg-slate-800 dark:hover:text-white",
  },
];

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200 bg-slate-50 text-slate-700 transition-colors duration-300 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300">
      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-6 sm:py-14 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-12">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-2">
            <Link
              to="/"
              aria-label="PawMart home"
              className="group inline-flex items-center gap-2.5 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-sm shadow-indigo-600/20 transition-transform duration-200 group-hover:scale-105 motion-reduce:transform-none dark:bg-indigo-500">
                <MdPets className="text-2xl" aria-hidden="true" />
              </span>

              <span className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Paw<span className="text-indigo-600 dark:text-indigo-400">Mart</span>
              </span>
            </Link>

            <p className="mt-4 max-w-md text-sm leading-7 text-slate-600 dark:text-slate-400">
              Your trusted place to discover pets, support adoption, and
              find quality products for happier, healthier companions.
            </p>

            <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white px-3.5 py-2 text-xs font-semibold text-indigo-700 dark:border-indigo-500/20 dark:bg-slate-900 dark:text-indigo-300">
              <MdPets className="text-base" aria-hidden="true" />
              <span>Made for pets and the people who love them</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h2 className="text-sm font-bold uppercase tracking-[0.12em] text-slate-900 dark:text-white">
              Explore
            </h2>

            <ul className="mt-5 space-y-3">
              {FOOTER_LINKS.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className="group inline-flex items-center gap-1.5 text-sm text-slate-600 transition-colors duration-200 hover:text-indigo-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:text-slate-400 dark:hover:text-indigo-400"
                  >
                    <span>{item.label}</span>
                    <MdArrowOutward
                      className="text-sm opacity-0 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100 motion-reduce:transform-none"
                      aria-hidden="true"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Social */}
          <div>
            <h2 className="text-sm font-bold uppercase tracking-[0.12em] text-slate-900 dark:text-white">
              Get in touch
            </h2>

            <div className="mt-5 space-y-4">
              <a
                href="mailto:pawmart@gmail.com"
                className="group flex items-start gap-3 rounded-lg text-sm text-slate-600 transition-colors hover:text-indigo-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:text-slate-400 dark:hover:text-indigo-400"
              >
                <MdEmail
                  className="mt-0.5 shrink-0 text-lg text-indigo-600 dark:text-indigo-400"
                  aria-hidden="true"
                />
                <span className="break-all">pawmart@gmail.com</span>
              </a>

              <a
                href="tel:01336458100"
                className="flex items-center gap-3 text-sm text-slate-600 transition-colors hover:text-indigo-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:text-slate-400 dark:hover:text-indigo-400"
              >
                <MdPhone
                  className="shrink-0 text-lg text-indigo-600 dark:text-indigo-400"
                  aria-hidden="true"
                />
                <span>01336-458100</span>
              </a>

              <div className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-400">
                <MdLocationOn
                  className="mt-0.5 shrink-0 text-lg text-indigo-600 dark:text-indigo-400"
                  aria-hidden="true"
                />
                <span>Bangladesh</span>
              </div>
            </div>

            <h3 className="mt-7 text-sm font-semibold text-slate-900 dark:text-white">
              Follow us
            </h3>

            <div className="mt-3 flex items-center gap-2.5">
              {SOCIAL_LINKS.map((social) => {
                const Icon = social.icon;

                // Add the actual profile URL before enabling a social link.
                if (!social.href) {
                  return (
                    <span
                      key={social.label}
                      title={`${social.label} profile coming soon`}
                      aria-label={`${social.label} profile coming soon`}
                      className={`inline-flex h-10 w-10 cursor-default items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition-colors duration-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 ${social.className}`}
                    >
                      <Icon className="text-base" aria-hidden="true" />
                    </span>
                  );
                }

                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Visit PawMart on ${social.label}`}
                    className={`inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 ${social.className}`}
                  >
                    <Icon className="text-base" aria-hidden="true" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 border-t border-slate-200 pt-6 dark:border-slate-800 sm:mt-12">
          <div className="flex flex-col items-center justify-between gap-3 text-center sm:flex-row sm:text-left">
            <p className="text-xs leading-6 text-slate-500 dark:text-slate-400">
              © {currentYear} PawMart. All rights reserved.
            </p>

            <Link
              to="/"
              className="text-xs font-semibold text-slate-500 transition-colors hover:text-indigo-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:text-slate-400 dark:hover:text-indigo-400"
            >
              Pets deserve the best.
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
