
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { AuthContext } from "../context/AuthContext.jsx";

const Login = () => {
  const { signInWithGoogle, loginUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onTouched",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async ({ email, password }) => {
    if (loading) return;

    setLoading(true);

    try {
      await loginUser(email.trim(), password);
      toast.success("Login successful!");
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Login error:", error);

      toast.error(
        error?.code === "auth/invalid-credential"
          ? "Invalid email or password."
          : error?.code === "auth/too-many-requests"
            ? "Too many attempts. Please try again later."
            : error?.code === "auth/network-request-failed"
              ? "Network error. Please check your connection."
              : error?.message || "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (loading) return;

    setLoading(true);

    try {
      await signInWithGoogle();
      toast.success("Login successful!");
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Google sign-in error:", error);

      if (
        error?.code === "auth/popup-closed-by-user" ||
        error?.code === "auth/cancelled-popup-request"
      ) {
        return;
      }

      toast.error(
        error?.code === "auth/popup-blocked"
          ? "Pop-up blocked. Please allow pop-ups and try again."
          : error?.code === "auth/network-request-failed"
            ? "Network error. Please check your connection."
            : error?.message || "Google sign-in failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const inputClassName = (hasError) =>
    `input input-bordered min-h-12 w-full bg-white text-gray-900 placeholder:text-gray-400
    dark:bg-gray-700 dark:text-white dark:border-gray-600
    focus:outline-none focus:ring-2 focus:ring-indigo-500
    ${hasError ? "border-red-500 focus:ring-red-500" : ""}`;

  return (
    <main className="flex min-h-screen items-center justify-center bg-indigo-50 px-4 py-10 dark:bg-gray-950 sm:px-6">
      <section className="w-full max-w-md rounded-2xl border border-gray-100 bg-white p-6 shadow-xl dark:border-gray-700 dark:bg-gray-800 sm:p-8">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Welcome back
          </h1>

          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
            Sign in to continue to PawMart.
          </p>
        </header>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5"
          noValidate
        >
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-200"
            >
              Email address
            </label>

            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              disabled={loading}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? "email-error" : undefined}
              className={inputClassName(Boolean(errors.email))}
              {...register("email", {
                required: "Email address is required.",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Please enter a valid email address.",
                },
              })}
            />

            {errors.email && (
              <p
                id="email-error"
                role="alert"
                className="mt-1.5 text-sm text-red-600 dark:text-red-400"
              >
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between gap-3">
              <label
                htmlFor="password"
                className="text-sm font-semibold text-gray-700 dark:text-gray-200"
              >
                Password
              </label>
            </div>

            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="Enter your password"
                disabled={loading}
                aria-invalid={Boolean(errors.password)}
                aria-describedby={
                  errors.password ? "password-error" : undefined
                }
                className={`${inputClassName(Boolean(errors.password))} pr-20`}
                {...register("password", {
                  required: "Password is required.",
                })}
              />

              <button
                type="button"
                onClick={() => setShowPassword((previous) => !previous)}
                disabled={loading}
                aria-label={showPassword ? "Hide password" : "Show password"}
                aria-pressed={showPassword}
                className="absolute inset-y-0 right-3 my-auto h-8 rounded px-2 text-sm font-medium text-indigo-600 hover:text-indigo-800 focus-visible:outline-2 focus-visible:outline-indigo-600 disabled:opacity-50 dark:text-indigo-300"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            {errors.password && (
              <p
                id="password-error"
                role="alert"
                className="mt-1.5 text-sm text-red-600 dark:text-red-400"
              >
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex min-h-12 w-full items-center justify-center rounded-lg bg-indigo-600 px-4 py-3 font-semibold text-white transition-colors hover:bg-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <>
                <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                Signing in...
              </>
            ) : (
              "Sign in"
            )}
          </button>
        </form>

        <div className="my-6 flex items-center gap-4">
          <div className="h-px flex-1 bg-gray-200 dark:bg-gray-600" />
          <span className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Or continue with
          </span>
          <div className="h-px flex-1 bg-gray-200 dark:bg-gray-600" />
        </div>

        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="flex min-h-12 w-full items-center justify-center gap-3 rounded-lg border border-gray-300 bg-white px-4 py-3 font-semibold text-gray-700 transition-colors hover:bg-gray-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
        >
          <svg
            aria-hidden="true"
            width="20"
            height="20"
            viewBox="0 0 48 48"
          >
            <path
              fill="#EA4335"
              d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5Z"
              transform="translate(0 4)"
            />
            <path
              fill="#4285F4"
              d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.72 7.18l7.64 5.93c4.46-4.12 7.12-10.2 7.12-17.58Z"
            />
            <path
              fill="#FBBC05"
              d="M10.53 28.59A14.4 14.4 0 0 1 9.75 24c0-1.59.27-3.12.76-4.59l-7.98-6.19A23.9 23.9 0 0 0 0 24c0 3.87.93 7.52 2.56 10.78l7.97-6.19Z"
              transform="translate(0 4)"
            />
            <path
              fill="#34A853"
              d="M24 48c6.48 0 11.93-2.13 15.9-5.87l-7.64-5.93c-2.12 1.42-4.85 2.27-8.26 2.27-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48Z"
            />
          </svg>

          Continue with Google
        </button>

        <p className="mt-7 text-center text-sm text-gray-600 dark:text-gray-300">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="font-semibold text-indigo-600 hover:text-indigo-800 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:text-indigo-400"
          >
            Create an account
          </Link>
        </p>
      </section>
    </main>
  );
};

export default Login;
