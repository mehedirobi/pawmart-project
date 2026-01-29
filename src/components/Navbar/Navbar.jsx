import React, { useContext, useState, useRef, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { MdPets } from "react-icons/md";
import { toast } from "react-toastify";
import { AuthContext } from "../../context/AuthContext";
import DarkModeToggle from "../DarkModeToggle";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileDropdown, setProfileDropdown] = useState(false);
  const dropdownRef = useRef();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Successfully logged out", { autoClose: 2000 });
      setMenuOpen(false);
      navigate("/login");
    } catch {
      toast.error("Logout failed!");
    }
  };

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setProfileDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const desktopNavLink = ({ isActive }) =>
    `px-4 py-2 rounded-lg font-semibold transition-all
     hover:bg-indigo-100 hover:text-indigo-600
     dark:hover:bg-gray-700 dark:hover:text-indigo-400
     ${
       isActive
         ? "bg-indigo-100 text-indigo-600 dark:bg-gray-700 dark:text-indigo-400"
         : "text-gray-700 dark:text-gray-200"
     }`;

  const mobileNavLink = ({ isActive }) =>
    `block w-full px-4 py-3 rounded-md font-semibold transition-all
     hover:bg-indigo-100 hover:text-indigo-600
     dark:hover:bg-gray-700 dark:hover:text-indigo-400
     ${
       isActive
         ? "bg-indigo-100 text-indigo-600 dark:bg-gray-700 dark:text-indigo-400"
         : "text-gray-700 dark:text-gray-200"
     }`;

  return (
    <header className="sticky top-0 z-50 bg-indigo-50 dark:bg-neutral shadow-md">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* LOGO */}
        <Link
          to="/"
          className="flex items-center gap-2 text-3xl font-bold text-indigo-600 dark:text-indigo-400"
        >
          <MdPets size={28} />
          PawMart
        </Link>

        {/* DESKTOP NAV */}
        <nav className="hidden lg:flex flex-1 justify-center gap-2">
          <NavLink to="/" className={desktopNavLink}>
            Home
          </NavLink>
          <NavLink to="/pets&Supplies" className={desktopNavLink}>
            Pets & Supplies
          </NavLink>
          <NavLink to="/about-us" className={desktopNavLink}>
            About Us
          </NavLink>
          {user && (
            <>
              <NavLink to="/add-listing" className={desktopNavLink}>
                Add Listing
              </NavLink>
            </>
          )}
        </nav>

        {/* AUTH + DARKMODE */}
        <div className="hidden lg:flex items-center gap-3 relative">
          <DarkModeToggle />

          {user ? (
            <div ref={dropdownRef} className="relative">
              <img
                src={user.photoURL || "https://i.ibb.co/Fx2g3mD/user.png"}
                alt="user"
                className="w-10 h-10 rounded-full border-2 border-indigo-500 object-cover cursor-pointer"
                onClick={() => setProfileDropdown(!profileDropdown)}
              />
              {profileDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 shadow-lg rounded-md overflow-hidden z-50">
                  <div className="px-4 py-2 border-b dark:border-gray-700">
                    <p className="font-semibold text-gray-800 dark:text-gray-200">
                      {user.displayName || "User"}
                    </p>
                    <p className="text-sm text-gray-500">Logged in</p>
                  </div>
                  <div className="py-5 mx-2">
                    <NavLink to="/my-dashboard" className={desktopNavLink}>
                      My Dashboard
                    </NavLink>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-red-500 font-semibold hover:bg-red-50 dark:hover:bg-gray-700"
                  >
                    Log Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <NavLink
                to="/login"
                className="btn btn-sm font-bold text-lg btn-outline btn-primary"
              >
                Login
              </NavLink>

              <NavLink
                to="/register"
                className="btn btn-sm font-bold text-lg btn-outline btn-primary"
              >
                Register
              </NavLink>
            </>
          )}
        </div>

        {/* MOBILE BUTTON */}
        <div className="lg:hidden flex items-center gap-2">
          <DarkModeToggle />
          <button
            onClick={() => setMenuOpen(true)}
            className="min-w-[44px] min-h-[44px] text-2xl"
          >
            ☰
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {menuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/30 z-40"
            onClick={() => setMenuOpen(false)}
          />
          <div className="fixed top-[72px] left-4 right-4 z-50 bg-base-100 dark:bg-neutral rounded-xl shadow-xl p-4">
            {user && (
              <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-200 dark:border-gray-700">
                <img
                  src={user.photoURL || "https://i.ibb.co/Fx2g3mD/user.png"}
                  alt="user"
                  className="w-12 h-12 rounded-full border-2 border-indigo-500 object-cover"
                />
                <div>
                  <p className="font-semibold text-gray-800 dark:text-gray-200">
                    {user.displayName || "User"}
                  </p>
                  <p className="text-sm text-gray-500">Logged in</p>
                </div>
              </div>
            )}

            <nav className="flex flex-col gap-1">
              <NavLink
                to="/"
                className={mobileNavLink}
                onClick={() => setMenuOpen(false)}
              >
                Home
              </NavLink>
              <NavLink
                to="/pets&Supplies"
                className={mobileNavLink}
                onClick={() => setMenuOpen(false)}
              >
                Pets & Supplies
              </NavLink>
              <NavLink
                to="/about-us"
                className={mobileNavLink}
                onClick={() => setMenuOpen(false)}
              >
                About Us
              </NavLink>
              {user && (
                <>
                  <NavLink
                    to="/add-listing"
                    className={mobileNavLink}
                    onClick={() => setMenuOpen(false)}
                  >
                    Add Listing
                  </NavLink>

                  <NavLink
                    to="/my-dashboard"
                    className={mobileNavLink}
                    onClick={() => setMenuOpen(false)}
                  >
                    My Dashboard
                  </NavLink>
                </>
              )}
            </nav>

            <div className="mt-4 border-t pt-3">
              {user ? (
                <button
                  onClick={handleLogout}
                  className="w-full py-3 text-red-500 font-semibold rounded-md hover:bg-red-50 dark:hover:bg-gray-700"
                >
                  Log Out
                </button>
              ) : (
                <div className="flex flex-col gap-2">
                  <NavLink
                    to="/login"
                    className={mobileNavLink}
                    onClick={() => setMenuOpen(false)}
                  >
                    Login
                  </NavLink>
                  <NavLink
                    to="/register"
                    className={mobileNavLink}
                    onClick={() => setMenuOpen(false)}
                  >
                    Register
                  </NavLink>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </header>
  );
};

export default Navbar;
