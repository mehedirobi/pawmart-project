import {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import { Link, useLocation, useNavigate } from "react-router-dom";

import {
  MdAddCircleOutline,
  MdClose,
  MdContactSupport,
  MdDashboard,
  MdHome,
  MdInfoOutline,
  MdKeyboardArrowDown,
  MdLogin,
  MdLogout,
  MdMenu,
  MdPerson,
  MdPersonAddAlt1,
  MdPets,
} from "react-icons/md";

import toast from "react-hot-toast";

import { AuthContext } from "../../context/AuthContext";
import DarkModeToggle from "../DarkModeToggle";

const DEFAULT_AVATAR = "https://i.ibb.co/Fx2g3mD/user.png";

const NAV_ITEMS = [
  { label: "Home", path: "/", icon: MdHome },
  {
    label: "Pets & Supplies",
    path: "/pets&supplies",
    icon: MdPets,
  },
  {
    label: "About Us",
    path: "/about-us",
    icon: MdInfoOutline,
  },
  {
    label: "My Dashboard",
    path: "/my-dashboard",
    icon: MdDashboard,
    requiresAuth: true,
  },
  {
    label: "Contact",
    path: "/contact",
    icon: MdContactSupport,
  },
];

const ADD_LISTING_ITEM = {
  label: "Add Listing",
  path: "/add-listing",
  icon: MdAddCircleOutline,
  requiresAuth: true,
};

const PROFILE_ITEMS = [
  {
    label: "My Dashboard",
    path: "/my-dashboard",
    icon: MdDashboard,
  },
  {
    label: "My Profile",
    path: "/my-profile",
    icon: MdPerson,
  },
];

const DESKTOP_LINK =
  "inline-flex min-h-10 shrink-0 items-center justify-center gap-1.5 " +
  "whitespace-nowrap rounded-xl border border-transparent px-2.5 py-2 " +
  "text-[13px] transition-colors duration-200 " +
  "focus-visible:outline-none focus-visible:ring-2 " +
  "focus-visible:ring-slate-400 xl:gap-2 xl:px-3 xl:text-sm";

const MOBILE_LINK =
  "flex min-h-11 w-full items-center gap-3 rounded-xl px-4 py-3 " +
  "text-sm transition-colors duration-200 " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400";

const DEFAULT_NAV_STYLE =
  "bg-transparent font-medium text-slate-600 " +
  "dark:text-slate-300";

const ACTIVE_NAV_STYLE =
  "bg-indigo-500 text-white font-bold text-slate-900 " +
  "dark:text-white";

const ACCOUNT_ACTION =
  "inline-flex min-h-10 shrink-0 items-center justify-center gap-1.5 " +
  "whitespace-nowrap rounded-xl px-3 py-2 text-sm font-medium " +
  "transition-colors duration-200 focus-visible:outline-none " +
  "focus-visible:ring-2 focus-visible:ring-slate-400";

function normalizePath(path = "/") {
  let normalized = path;

  try {
    normalized = decodeURIComponent(path);
  } catch {
    // Keep the original path if decoding fails.
  }

  normalized = normalized.split("?")[0].split("#")[0].toLowerCase();

  if (normalized.length > 1) {
    normalized = normalized.replace(/\/+$/, "");
  }

  return normalized || "/";
}

function isPathActive(currentPath, item) {
  const current = normalizePath(currentPath);
  const target = normalizePath(item.path);

  if (target === "/") {
    return current === "/";
  }

  // All navigation items use exact matching.
  return current === target;
}

function getUserName(user) {
  return (
    user?.displayName?.trim() ||
    user?.name?.trim() ||
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

function NavigationLink({
  item,
  mobile = false,
  onNavigate,
  currentPath,
}) {
  const Icon = item.icon;
  const active = isPathActive(currentPath, item);
  const baseClass = mobile ? MOBILE_LINK : DESKTOP_LINK;

  return (
    <Link
      to={item.path}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      className={[
        baseClass,
        active ? ACTIVE_NAV_STYLE : DEFAULT_NAV_STYLE,
      ].join(" ")}
    >
      <Icon className="shrink-0 text-lg" aria-hidden="true" />
      <span>{item.label}</span>
    </Link>
  );
}

function ProfileMenuLink({ item, onNavigate, currentPath }) {
  const Icon = item.icon;
  const active = isPathActive(currentPath, item);

  return (
    <Link
      to={item.path}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      className={[
        "flex min-h-10 w-full items-center gap-3 rounded-xl px-3 py-2.5",
        "text-sm transition-colors duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400",
        active
          ? "font-bold text-slate-900 dark:text-white"
          : "font-medium text-slate-700 dark:text-slate-200",
      ].join(" ")}
    >
      <Icon className="shrink-0 text-lg" aria-hidden="true" />
      <span>{item.label}</span>
    </Link>
  );
}

function Navbar() {
  const authContext = useContext(AuthContext);
  const user = authContext?.user;
  const signOut = authContext?.logout || authContext?.logOut;

  const navigate = useNavigate();
  const location = useLocation();

  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const menuRef = useRef(null);
  const menuButtonRef = useRef(null);
  const profileRef = useRef(null);
  const profileButtonRef = useRef(null);

  const currentPath = location.pathname;
  const userName = getUserName(user);
  const userAvatar = getUserAvatar(user);

  const closeMenus = useCallback(() => {
    setMenuOpen(false);
    setProfileOpen(false);
  }, []);

  useEffect(() => {
    closeMenus();
  }, [location.pathname, location.search, location.hash, closeMenus]);

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target)
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
    };

    const handleKeyDown = (event) => {
      if (event.key !== "Escape") return;

      if (menuOpen) {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      }

      if (profileOpen) {
        setProfileOpen(false);
        profileButtonRef.current?.focus();
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [menuOpen, profileOpen]);

  const handleLogout = async () => {
    if (loggingOut) return;

    if (typeof signOut !== "function") {
      toast.error("Logout function is not configured.");
      return;
    }

    setLoggingOut(true);
    closeMenus();

    try {
      await signOut();
      toast.success("Logged out successfully.");
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Unable to log out. Please try again.");
    } finally {
      setLoggingOut(false);
    }
  };

  const handleAvatarError = (event) => {
    event.currentTarget.onerror = null;
    event.currentTarget.src = DEFAULT_AVATAR;
  };

  const renderMainLinks = (mobile = false) => {
    const items = user
      ? [
          NAV_ITEMS[0],
          NAV_ITEMS[1],
          ADD_LISTING_ITEM,
          NAV_ITEMS[2],
          NAV_ITEMS[3],
          NAV_ITEMS[4],
        ]
      : [
          NAV_ITEMS[0],
          NAV_ITEMS[1],
          NAV_ITEMS[2],
          NAV_ITEMS[4],
        ];

    return items.map((item) => (
      <NavigationLink
        key={item.path}
        item={item}
        mobile={mobile}
        currentPath={currentPath}
        onNavigate={mobile ? closeMenus : undefined}
      />
    ));
  };

  const renderProfileLinks = (mobile = false) =>
    PROFILE_ITEMS.map((item) => (
      <ProfileMenuLink
        key={item.path}
        item={item}
        currentPath={currentPath}
        onNavigate={mobile ? closeMenus : undefined}
      />
    ));

  const loginActive = normalizePath(currentPath) === "/login";
  const registerActive = normalizePath(currentPath) === "/register";

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/95">
      <nav
        aria-label="Main navigation"
        className="mx-auto grid min-h-[68px] w-full max-w-[1440px] grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 sm:px-6 xl:grid-cols-[auto_minmax(0,1fr)_auto] xl:gap-4 2xl:px-8"
      >
        <Link
          to="/"
          onClick={closeMenus}
          aria-label="PawMart home"
          className="group flex min-w-0 items-center gap-2.5 justify-self-start rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-indigo-600 text-white transition-transform duration-200 group-hover:scale-105 dark:bg-indigo-500">
            <MdPets className="text-2xl" aria-hidden="true" />
          </span>

          <span className="text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl dark:text-white">
            Paw<span className="text-indigo-600 dark:text-indigo-400">Mart</span>
          </span>
        </Link>

        <div className="hidden min-w-0 items-center justify-center gap-1 xl:flex">
          {renderMainLinks()}
        </div>

        <div className="hidden shrink-0 items-center justify-self-end gap-2 xl:flex">
          {user ? (
            <div className="relative" ref={profileRef}>
              <button
                ref={profileButtonRef}
                type="button"
                onClick={() => setProfileOpen((open) => !open)}
                aria-label={`Account menu for ${userName}`}
                aria-expanded={profileOpen}
                aria-controls="desktop-account-menu"
                className="flex min-h-11 max-w-[180px] items-center gap-2 rounded-full border border-slate-200 bg-white py-1 pl-1 pr-2.5 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800"
              >
                <img
                  src={userAvatar}
                  alt=""
                  onError={handleAvatarError}
                  className="h-9 w-9 shrink-0 rounded-full object-cover"
                />

                <span className="hidden max-w-[90px] truncate text-sm font-semibold text-slate-700 xl:block dark:text-slate-200">
                  {userName}
                </span>

                <MdKeyboardArrowDown
                  className={`shrink-0 text-xl text-slate-500 transition-transform duration-200 dark:text-slate-300 ${
                    profileOpen ? "rotate-180" : ""
                  }`}
                  aria-hidden="true"
                />
              </button>

              {profileOpen && (
                <div
                  id="desktop-account-menu"
                  className="absolute right-0 top-full mt-3 w-64 overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-xl shadow-slate-900/10 dark:border-slate-700 dark:bg-slate-900 dark:shadow-black/30"
                >
                  <div className="flex items-center gap-3 border-b border-slate-100 px-2 py-3 dark:border-slate-800">
                    <img
                      src={userAvatar}
                      alt=""
                      onError={handleAvatarError}
                      className="h-10 w-10 shrink-0 rounded-full object-cover"
                    />

                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-slate-900 dark:text-white">
                        {userName}
                      </p>
                      <p className="mt-1 truncate text-xs text-slate-500 dark:text-slate-400">
                        {user?.email || "Signed in"}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1 py-2">
                    {renderProfileLinks()}
                  </div>

                  <div className="border-t border-slate-100 pt-2 dark:border-slate-800">
                    <button
                      type="button"
                      onClick={handleLogout}
                      disabled={loggingOut}
                      className="flex min-h-10 w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-rose-600 transition-colors hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60 dark:text-rose-400 dark:hover:bg-rose-500/10"
                    >
                      <MdLogout className="text-lg" aria-hidden="true" />
                      {loggingOut ? "Logging out..." : "Logout"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                to="/login"
                onClick={closeMenus}
                aria-current={loginActive ? "page" : undefined}
                className={`${ACCOUNT_ACTION} ${
                  loginActive
                    ? "font-bold text-slate-900 dark:text-white"
                    : "text-slate-600 dark:text-slate-300"
                }`}
              >
                <MdLogin className="text-lg" aria-hidden="true" />
                Login
              </Link>

              <Link
                to="/register"
                onClick={closeMenus}
                aria-current={registerActive ? "page" : undefined}
                className={`${ACCOUNT_ACTION} ${
                  registerActive
                    ? "font-bold text-slate-900 dark:text-white"
                    : "text-slate-600 dark:text-slate-300"
                }`}
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

        <div className="flex shrink-0 items-center justify-self-end gap-1.5 xl:hidden">
          {user && (
            <Link
              to="/my-dashboard"
              onClick={closeMenus}
              aria-label="My Dashboard"
              aria-current={
                isPathActive(currentPath, PROFILE_ITEMS[0])
                  ? "page"
                  : undefined
              }
              className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
            >
              <img
                src={userAvatar}
                alt=""
                onError={handleAvatarError}
                className="h-full w-full rounded-full object-cover"
              />
            </Link>
          )}

          <DarkModeToggle />

          <button
            ref={menuButtonRef}
            type="button"
            onClick={() => {
              setMenuOpen((open) => !open);
              setProfileOpen(false);
            }}
            aria-label={
              menuOpen ? "Close navigation menu" : "Open navigation menu"
            }
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-slate-700 transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            {menuOpen ? (
              <MdClose className="text-2xl" aria-hidden="true" />
            ) : (
              <MdMenu className="text-2xl" aria-hidden="true" />
            )}
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div
          id="mobile-navigation"
          ref={menuRef}
          className="border-t border-slate-200 bg-white px-4 pb-5 pt-4 dark:border-slate-800 dark:bg-slate-950 sm:px-6 xl:hidden"
        >
          <div className="mx-auto max-w-2xl">
            <div className="flex flex-col gap-1">
              {renderMainLinks(true)}
            </div>

            <div className="my-4 border-t border-slate-200 dark:border-slate-800" />

            {user ? (
              <>
                <div className="mb-3 flex items-center gap-3 rounded-2xl bg-slate-50 p-3 dark:bg-slate-900">
                  <img
                    src={userAvatar}
                    alt=""
                    onError={handleAvatarError}
                    className="h-11 w-11 shrink-0 rounded-full object-cover"
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

                <div className="flex flex-col gap-1">
                  {renderProfileLinks(true)}

                  <button
                    type="button"
                    onClick={handleLogout}
                    disabled={loggingOut}
                    className="flex min-h-11 w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold text-rose-600 transition-colors hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60 dark:text-rose-400 dark:hover:bg-rose-500/10"
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
                  aria-current={loginActive ? "page" : undefined}
                  className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm ${
                    loginActive
                      ? "font-bold text-slate-900 dark:text-white"
                      : "font-medium text-slate-600 dark:text-slate-300"
                  }`}
                >
                  <MdLogin className="text-lg" aria-hidden="true" />
                  Login
                </Link>

                <Link
                  to="/register"
                  onClick={closeMenus}
                  aria-current={registerActive ? "page" : undefined}
                  className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm ${
                    registerActive
                      ? "font-bold text-slate-900 dark:text-white"
                      : "font-medium text-slate-600 dark:text-slate-300"
                  }`}
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