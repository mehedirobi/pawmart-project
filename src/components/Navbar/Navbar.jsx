
import {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  Link,
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
  MdPerson,
  MdPersonAddAlt1,
  MdPets,
  MdContactSupport,
} from "react-icons/md";
import toast from "react-hot-toast";

import { AuthContext } from "../../context/AuthContext";
import DarkModeToggle from "../DarkModeToggle";

const DEFAULT_AVATAR = "https://i.ibb.co/Fx2g3mD/user.png";

const NAV_ITEMS = [
  {
    label: "Home",
    path: "/",
    icon: MdHome,
    exact: true,
  },
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
    exact: true,
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
  exact: false,
  requiresAuth: true,
  primary: true,
};

const PROFILE_ITEMS = [
  {
    label: "My Dashboard",
    path: "/my-dashboard",
    icon: MdDashboard,
    exact: true,
  },
  {
    label: "My Profile",
    path: "/my-dashboard/my-profile",
    icon: MdPerson,
    exact: true,
  },
];

const DESKTOP_LINK =
  "inline-flex min-h-10 items-center justify-center gap-1.5 whitespace-nowrap rounded-xl px-2.5 py-2 text-[13px] font-semibold transition-colors duration-200 xl:gap-2 xl:px-3 xl:text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500";

const MOBILE_LINK =
  "flex min-h-11 w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500";

const ACCOUNT_ACTION =
  "inline-flex min-h-10 shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-xl px-3 py-2 text-sm font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500";

function normalizePath(path = "/") {
  let normalized = path;

  try {
    normalized = decodeURIComponent(path);
  } catch {
    // Keep the original path if URL decoding fails.
  }

  if (normalized.length > 1) {
    normalized = normalized.replace(/\/+$/, "");
  }

  return normalized.toLowerCase();
}

function isRouteActive(currentPath, itemPath, exact = false) {
  const current = normalizePath(currentPath);
  const target = normalizePath(itemPath);

  if (exact) {
    return current === target;
  }

  return current === target || current.startsWith(`${target}/`);
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

  const isActive = isRouteActive(
    currentPath,
    item.path,
    item.exact ?? false
  );

  const baseClass = mobile ? MOBILE_LINK : DESKTOP_LINK;

  const activeClass = mobile
    ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300"
    : item.primary
      ? "bg-indigo-600 text-white shadow-sm shadow-indigo-600/20 dark:bg-indigo-500"
      : "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300";

  const inactiveClass = mobile
    ? "text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
    : item.primary
      ? "bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-400"
      : "text-slate-600 hover:bg-slate-100 hover:text-indigo-700 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-indigo-300";

  return (
    <Link
      to={item.path}
      onClick={onNavigate}
      aria-current={isActive ? "page" : undefined}
      className={`${baseClass} ${
        isActive ? activeClass : inactiveClass
      }`}
    >
      <Icon className="shrink-0 text-lg" aria-hidden="true" />
      <span>{item.label}</span>
    </Link>
  );
}

function ProfileMenuLink({ item, onNavigate, currentPath }) {
  const Icon = item.icon;

  const isActive = isRouteActive(
    currentPath,
    item.path,
    item.exact ?? true
  );

  return (
    <Link
      to={item.path}
      onClick={onNavigate}
      aria-current={isActive ? "page" : undefined}
      className={[
        "flex min-h-10 w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500",
        isActive
          ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300"
          : "text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800",
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

  const userName = getUserName(user);
  const userAvatar = getUserAvatar(user);
  const currentPath = location.pathname;

  const closeMenus = useCallback(() => {
    setMenuOpen(false);
    setProfileOpen(false);
  }, []);

  // Close open menus after route changes.
  useEffect(() => {
    closeMenus();
  }, [location.pathname, location.search, closeMenus]);

  // Close menus on outside click or Escape.
  useEffect(() => {
    const handlePointerDown = (event) => {
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
        onNavigate={mobile ? closeMenus : undefined}
        currentPath={currentPath}
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

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/95">
      <nav
        aria-label="Main navigation"
        className="mx-auto grid min-h-[68px] w-full max-w-[1440px] grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 sm:px-6 lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:gap-4 xl:gap-6 2xl:px-8"
      >
        {/* Brand */}
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

        {/* Desktop navigation */}
        <div className="hidden min-w-0 items-center justify-center gap-0.5 lg:flex xl:gap-1">
          {renderMainLinks()}
        </div>

        {/* Desktop account actions */}
        <div className="hidden shrink-0 items-center justify-self-end gap-2 lg:flex">
          {user ? (
            <div className="relative" ref={profileRef}>
              <button
                ref={profileButtonRef}
                type="button"
                onClick={() => setProfileOpen((open) => !open)}
                aria-label={`Account menu for ${userName}`}
                aria-expanded={profileOpen}
                aria-haspopup="true"
                className="flex min-h-11 max-w-[180px] items-center gap-2 rounded-full border border-slate-200 bg-white py-1 pl-1 pr-2.5 transition-colors hover:border-indigo-300 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-indigo-500 dark:hover:bg-slate-800"
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
                  ref={profileRef}
                  aria-label="Account menu"
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
                className={`${ACCOUNT_ACTION} text-slate-700 hover:bg-slate-100 hover:text-indigo-700 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-indigo-300`}
              >
                <MdLogin className="text-lg" aria-hidden="true" />
                Login
              </Link>

              <Link
                to="/register"
                className={`${ACCOUNT_ACTION} bg-indigo-600 text-white shadow-sm hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-400`}
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

        {/* Mobile and tablet controls */}
        <div className="flex shrink-0 items-center justify-self-end gap-1.5 lg:hidden">
          {user && (
            <Link
              to="/my-dashboard"
              onClick={closeMenus}
              aria-label="My Dashboard"
              className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900"
            >
              <img
                src={userAvatar}
                alt=""
                onError={handleAvatarError}
                className="h-full w-full object-cover"
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
            aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-slate-700 transition-colors hover:bg-slate-100 hover:text-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-indigo-300"
          >
            {menuOpen ? (
              <MdClose className="text-2xl" aria-hidden="true" />
            ) : (
              <MdMenu className="text-2xl" aria-hidden="true" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile navigation */}
      {menuOpen && (
        <div
          id="mobile-navigation"
          ref={menuRef}
          className="border-t border-slate-200 bg-white px-4 pb-5 pt-4 shadow-lg shadow-slate-900/5 dark:border-slate-800 dark:bg-slate-950 sm:px-6 lg:hidden"
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
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition-colors hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  <MdLogin className="text-lg" aria-hidden="true" />
                  Login
                </Link>

                <Link
                  to="/register"
                  onClick={closeMenus}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-400"
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
