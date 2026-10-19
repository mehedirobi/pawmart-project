
import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { FaPaw } from "react-icons/fa";
import { AuthContext } from "../context/AuthContext";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  // Wait until Firebase determines the current authentication state.
  if (loading) {
    return (
      <main
        className="flex min-h-screen flex-col items-center justify-center gap-4 bg-base-100 px-4"
        role="status"
        aria-live="polite"
        aria-label="Checking authentication"
      >
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <FaPaw className="text-3xl" aria-hidden="true" />
        </div>

        <span className="loading loading-dots loading-lg text-primary" />

        <p className="text-sm font-medium text-base-content/60">
          Verifying your account...
        </p>
      </main>
    );
  }

  // Redirect unauthenticated users to login.
  // Preserve the requested destination for post-login navigation.
  if (!user) {
    return (
      <Navigate
        to="/login"
        state={{ from: location }}
        replace
      />
    );
  }

  // Render protected content for authenticated users.
  return children;
};

export default PrivateRoute;
