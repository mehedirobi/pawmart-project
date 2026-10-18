
import { useContext, useEffect, useRef, useState } from "react";
import {
  Link,
  NavLink,
  useLocation,
  useNavigate,
} from "react-router-dom";
import {
  MdAddCircleOutline,
  MdClose,
  MdDashboard,
  MdHome,
  MdInfoOutline,
  MdKeyboardArrowDown,
  MdLogout,
  MdLogin,
  MdMenu,
  MdPersonAddAlt1,
  MdPets,
  MdContactSupport,
} from "react-icons/md";
import toast from "react-hot-toast";

import { AuthContext } from "../../context/AuthContext";
import DarkModeToggle from "../DarkModeToggle";

const DEFAULT_AVATAR = "https://i.ibb.co/Fx2g3mD/user.png";

const NAV_ITEMS = [
  { label: "Home", path: "/", icon: MdHome, end: true },
  {
    label: "Pets & Supplies",
    path: "/pets&Supplies",
    icon: MdPets,
  },
  {
    label: "About Us",
    path: "/about-us",
    icon: MdInfoOutline,
  },
  {
    label: "Contact",
    path: "/contact",
    icon: MdContactSupport,
  },
];

const USER_ITEMS = [
  {
    label: "Add Listing",
    path: "/add-listing",
    icon: MdAddCircleOutline,
  },
  {
    label: "My Dashboard",
    path: "/my-dashboard",
    icon: MdDashboard,
  },
];

const DESKTOP_LINK =
  "inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-full px-3 py-2.5 text-sm font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 2xl:px-4";

const MOBILE_LINK =
  "flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500";

const ACTION_LINK =
  "inline-flex shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-full px-3 py-2.5 text-sm font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500";

function getUserName(user) {
  return (
    user?.displayName ||
    user?.name ||
    user?.email?.split("@")[0] ||
    "My Account"
  );
}

function getUserAvatar(user) {
  return (
    user?.photoURL ||
    user?.photoUrl ||
    user?.avatar ||
    DEFAULT_AVATAR
  );
}

function NavigationLink({ item, mobile = false, onNavigate }) {
  const Icon = item.icon;

  return (
    <NavLink
      to={item.path}
      end={item.end}
      onClick={onNavigate}
      className={({ isActive }) => {
        const base = mobile ? MOBILE_LINK : DESKTOP_LINK;

        const active = mobile
          ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300"
          : "bg-indigo-600 text-white shadow-sm shadow-indigo-600/20 dark:bg-indigo-500";

        const inactive = mobile
          ? "text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
          : "text-slate-600 hover:bg-indigo-50 hover:text-indigo-700 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-indigo-300";

        return `${base} ${isActive ? active : inactive}`;
      }}
    >
      <Icon className="shrink-0 text-lg" aria-hidden="true" />
      <span>{item.label}</span>
    </NavLink>
  );
}

function Navbar() {
  const auth = useContext(AuthContext);
  const user = auth?.user;
  const signOut = auth?.logOut || auth?.logout;

  const navigate = useNavigate();
  const location = useLocation();

  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const menuRef = useRef(null);
  const menuButtonRef = useRef(null);
  const profileRef = useRef(null);
  const profileButtonRef = useRef(null);

  const userName = getUserName(user);
  const userAvatar = getUserAvatar(user);

  function closeMenus() {
    setMenuOpen(false);
    setProfileOpen(false);
  }

  useEffect(() => {
    closeMenus();
  }, [location.pathname, location.search]);

  useEffect(() => {
    function handlePointerDown(event) {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target) &&
        !profileButtonRef.current?.contains(event.target)
      ) {
        setProfileOpen(false);
      }

      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        !menuButtonRef.current?.contains(event.target)
      ) {
        setMenuOpen(false);
      }
    }

    function handleKeyDown(event) {
      if (event.key !== "Escape") return;

      const shouldFocusMenu = menuOpen;
      const shouldFocusProfile = profileOpen;

      closeMenus();

      if (shouldFocusMenu) {
        menuButtonRef.current?.focus();
      } else if (shouldFocusProfile) {
        profileButtonRef.current?.focus();
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [menuOpen, profileOpen]);

  async function handleLogout() {
    if (typeof signOut !== "function") {
      toast.error("Logout function is not configured.");
      return;
    }

    try {
      setLoggingOut(true);
      closeMenus();

      await signOut();

      toast.success("Logged out successfully.");
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Unable to log out. Please try again.");
    } finally {
      setLoggingOut(false);
    }
  }

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur-xl transition-colors duration-300 dark:border-slate-800 dark:bg-slate-950/95">
      <nav
        aria-label="Main navigation"
        className="mx-auto grid min-h-[72px] w-full max-w-[1440px] grid-cols-[1fr_auto] items-center gap-x-3 px-4 sm:px-6 lg:grid-cols-[minmax(180px,1fr)_auto_minmax(220px,1fr)] lg:gap-x-4 lg:px-6 2xl:px-8"
      >
        {/* Left: Brand */}
        <Link
          to="/"
          onClick={closeMenus}
          aria-label="PawMart home"
          className="group flex min-w-0 items-center gap-2.5 justify-self-start rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-sm shadow-indigo-600/20 transition-transform duration-200 group-hover:scale-105 dark:bg-indigo-500">
            <MdPets className="text-2xl" aria-hidden="true" />
          </span>

          <span className="text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl dark:text-white">
            Paw<span className="text-indigo-600 dark:text-indigo-400">Mart</span>
          </span>
        </Link>

        {/* Center: Desktop navigation */}
        <div className="hidden items-center justify-center gap-1 lg:flex">
          {NAV_ITEMS.map((item) => (
            <NavigationLink key={item.path} item={item} />
          ))}
        </div>

        {/* Right: Account actions + theme toggle */}
        <div className="hidden min-w-0 items-center justify-self-end gap-2 lg:flex">
          {user ? (
            <>
              <Link
                to="/add-listing"
                className={`${ACTION_LINK} bg-indigo-600 text-white shadow-sm hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-400`}
              >
                <MdAddCircleOutline className="text-lg" aria-hidden="true" />
                <span>Add Listing</span>
              </Link>

              <div className="relative" ref={profileRef}>
                <button
                  ref={profileButtonRef}
                  type="button"
                  onClick={() => setProfileOpen((open) => !open)}
                  aria-label={`Account menu for ${userName}`}
                  aria-expanded={profileOpen}
                  aria-haspopup="true"
                  className="flex shrink-0 items-center gap-2 rounded-full border border-slate-200 bg-white py-1 pl-1 pr-2.5 transition-colors hover:border-indigo-300 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-indigo-500 dark:hover:bg-slate-800"
                >
                  <img
                    src={userAvatar}
                    alt=""
                    onError={(event) => {
                      event.currentTarget.onerror = null;
                      event.currentTarget.src = DEFAULT_AVATAR;
                    }}
                    className="h-9 w-9 rounded-full object-cover"
                  />

                  <MdKeyboardArrowDown
                    className={`text-xl text-slate-500 transition-transform duration-200 dark:text-slate-300 ${
                      profileOpen ? "rotate-180" : ""
                    }`}
                    aria-hidden="true"
                  />
                </button>

                {profileOpen && (
                  <div className="absolute right-0 top-full mt-3 w-64 overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-xl shadow-slate-900/10 dark:border-slate-700 dark:bg-slate-900 dark:shadow-black/30">
                    <div className="border-b border-slate-100 px-3 py-3 dark:border-slate-800">
                      <p className="truncate text-sm font-bold text-slate-900 dark:text-white">
                        {userName}
                      </p>
                      <p className="mt-1 truncate text-xs text-slate-500 dark:text-slate-400">
                        {user?.email || "Signed in"}
                      </p>
                    </div>

                    <div className="py-2">
                      {USER_ITEMS.map((item) => {
                        const Icon = item.icon;

                        return (
                          <Link
                            key={item.path}
                            to={item.path}
                            onClick={closeMenus}
                            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-indigo-50 hover:text-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-indigo-300"
                          >
                            <Icon className="text-lg" aria-hidden="true" />
                            {item.label}
                          </Link>
                        );
                      })}
                    </div>

                    <div className="border-t border-slate-100 pt-2 dark:border-slate-800">
                      <button
                        type="button"
                        onClick={handleLogout}
                        disabled={loggingOut}
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-rose-600 transition-colors hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60 dark:text-rose-400 dark:hover:bg-rose-500/10"
                      >
                        <MdLogout className="text-lg" aria-hidden="true" />
                        {loggingOut ? "Logging out..." : "Logout"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className={`${ACTION_LINK} text-slate-700 hover:bg-slate-100 hover:text-indigo-700 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-indigo-300`}
              >
                <MdLogin className="text-lg" aria-hidden="true" />
                Login
              </Link>

              <Link
                to="/register"
                className={`${ACTION_LINK} bg-indigo-600 text-white shadow-sm hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-400`}
              >
                <MdPersonAddAlt1 className="text-lg" aria-hidden="true" />
                Sign Up
              </Link>
            </>
          )}

          <span
            aria-hidden="true"
            className="mx-0.5 h-7 w-px shrink-0 bg-slate-200 dark:bg-slate-700"
          />

          <DarkModeToggle />
        </div>

        {/* Mobile/tablet controls */}
        <div className="flex shrink-0 items-center justify-self-end gap-1 lg:hidden">
          <DarkModeToggle />

          <button
            ref={menuButtonRef}
            type="button"
            onClick={() => {
              setMenuOpen((open) => !open);
              setProfileOpen(false);
            }}
            aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-slate-700 transition-colors hover:bg-slate-100 hover:text-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-indigo-300"
          >
            {menuOpen ? (
              <MdClose className="text-2xl" aria-hidden="true" />
            ) : (
              <MdMenu className="text-2xl" aria-hidden="true" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile/tablet dropdown navigation */}
      {menuOpen && (
        <div
          id="mobile-navigation"
          ref={menuRef}
          className="border-t border-slate-200 bg-white px-4 pb-5 pt-4 shadow-lg shadow-slate-900/5 dark:border-slate-800 dark:bg-slate-950 sm:px-6 lg:hidden"
        >
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col gap-1.5">
              {NAV_ITEMS.map((item) => (
                <NavigationLink
                  key={item.path}
                  item={item}
                  mobile
                  onNavigate={closeMenus}
                />
              ))}
            </div>

            <div className="my-4 border-t border-slate-200 dark:border-slate-800" />

            {user ? (
              <>
                <div className="mb-4 flex items-center gap-3 rounded-2xl bg-slate-50 p-3 dark:bg-slate-900">
                  <img
                    src={userAvatar}
                    alt=""
                    onError={(event) => {
                      event.currentTarget.onerror = null;
                      event.currentTarget.src = DEFAULT_AVATAR;
                    }}
                    className="h-11 w-11 shrink-0 rounded-full border border-slate-200 object-cover dark:border-slate-700"
                  />

                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-slate-900 dark:text-white">
                      {userName}
                    </p>
                    <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                      {user?.email || "Signed in"}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  {USER_ITEMS.map((item) => (
                    <NavigationLink
                      key={item.path}
                      item={item}
                      mobile
                      onNavigate={closeMenus}
                    />
                  ))}

                  <button
                    type="button"
                    onClick={handleLogout}
                    disabled={loggingOut}
                    className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold text-rose-600 transition-colors hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60 dark:text-rose-400 dark:hover:bg-rose-500/10"
                  >
                    <MdLogout className="text-lg" aria-hidden="true" />
                    {loggingOut ? "Logging out..." : "Logout"}
                  </button>
                </div>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <Link
                  to="/login"
                  onClick={closeMenus}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition-colors hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  <MdLogin className="text-lg" aria-hidden="true" />
                  Login
                </Link>

                <Link
                  to="/register"
                  onClick={closeMenus}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-400"
                >
                  <MdPersonAddAlt1 className="text-lg" aria-hidden="true" />
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
