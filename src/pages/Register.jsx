import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";

const Register = () => {
  const { createUser, signInWithGoogle } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // Password validation
  const validatePassword = (password) => {
    if (!/[A-Z]/.test(password))
      return "Password must have an uppercase letter.";
    if (!/[a-z]/.test(password))
      return "Password must have a lowercase letter.";
    if (!/\d/.test(password)) return "Password must have a number.";
    if (password.length < 6) return "Password must be at least 6 characters.";
    return true;
  };

  const onSubmit = async (data) => {
    const passwordCheck = validatePassword(data.password);
    if (passwordCheck !== true) return toast.error(passwordCheck);

    setLoading(true);
    try {
      await createUser(data.email, data.password, data.name, data.photo);
      toast.success("Registration successful!");
      navigate("/");
    } catch (err) {
      console.error(err);
      toast.error("Registration failed!");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await signInWithGoogle();
      toast.success("Registered with Google!");
      navigate("/");
    } catch (err) {
      console.error(err);
      toast.error("Google sign-in failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-indigo-50 dark:bg-gray-900 px-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 shadow-xl rounded-xl p-6">
        <h2 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 text-center mb-6">
          Register
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Name */}
          <div className="flex flex-col">
            <label className="mb-1 text-gray-700 dark:text-gray-200 font-semibold">
              Name
            </label>
            <input
              type="text"
              placeholder="Enter your name"
              disabled={loading}
              className={`input bg-gray-200 input-bordered w-full dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 ${
                errors.name ? "border-red-500" : ""
              }`}
              {...register("name", { required: "Name is required" })}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Email */}
          <div className="flex flex-col">
            <label className="mb-1 text-gray-700 dark:text-gray-200 font-semibold">
              Email
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              disabled={loading}
              className={`input bg-gray-200 input-bordered w-full dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 ${
                errors.email ? "border-red-500" : ""
              }`}
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: "Invalid email address",
                },
              })}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="flex flex-col">
            <label className="mb-1 text-gray-700 dark:text-gray-200 font-semibold">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              disabled={loading}
              className={`input bg-gray-200 input-bordered w-full dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 ${
                errors.password ? "border-red-500" : ""
              }`}
              {...register("password", { required: "Password is required" })}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Photo URL */}
          <div className="flex flex-col">
            <label className="mb-1 text-gray-700 dark:text-gray-200 font-semibold">
              Photo URL (optional)
            </label>
            <input
              type="text"
              placeholder="Photo URL"
              disabled={loading}
              className="input bg-gray-200 input-bordered w-full dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
              {...register("photo")}
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full btn btn-sm btn-outline font-bold text-lg btn-primary ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? (
              <span className="animate-pulse">Registering...</span>
            ) : (
              "Register"
            )}
          </button>
        </form>

        {/* OR Divider */}
        <div className="flex items-center my-4">
          <hr className="flex-1 border-gray-300 dark:border-gray-600" />
          <span className="px-2 text-gray-500 dark:text-gray-400">OR</span>
          <hr className="flex-1 border-gray-300 dark:border-gray-600" />
        </div>

        {/* Google Sign-in */}
        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className={`btn btn-sm btn-outline font-bold text-lg btn-primary w-full ${
            loading ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          <svg
            aria-label="Google logo"
            width="20"
            height="20"
            viewBox="0 0 512 512"
          >
            <g>
              <path d="M0 0H512V512H0z" fill="#fff" />
              <path
                fill="#34a853"
                d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"
              />
              <path
                fill="#4285f4"
                d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"
              />
              <path
                fill="#fbbc02"
                d="m90 341a208 200 0 010-171l63 49q-12 37 0 73"
              />
              <path
                fill="#ea4335"
                d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"
              />
            </g>
          </svg>
          {loading ? (
            <span className="animate-pulse">Processing...</span>
          ) : (
            "Register with Google"
          )}
        </button>
        {/* GitHub */}
        <button className="btn btn-sm btn-outline font-bold text-lg btn-primary w-full my-3">
          <svg className="bg-gray-800"
            aria-label="GitHub logo"
            width="16"
            height="16"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path
              fill="white"
              d="M12,2A10,10 0 0,0 2,12C2,16.42 4.87,20.17 8.84,21.5C9.34,21.58 9.5,21.27 9.5,21C9.5,20.77 9.5,20.14 9.5,19.31C6.73,19.91 6.14,17.97 6.14,17.97C5.68,16.81 5.03,16.5 5.03,16.5C4.12,15.88 5.1,15.9 5.1,15.9C6.1,15.97 6.63,16.93 6.63,16.93C7.5,18.45 8.97,18 9.54,17.76C9.63,17.11 9.89,16.67 10.17,16.42C7.95,16.17 5.62,15.31 5.62,11.5C5.62,10.39 6,9.5 6.65,8.79C6.55,8.54 6.2,7.5 6.75,6.15C6.75,6.15 7.59,5.88 9.5,7.17C10.29,6.95 11.15,6.84 12,6.84C12.85,6.84 13.71,6.95 14.5,7.17C16.41,5.88 17.25,6.15 17.25,6.15C17.8,7.5 17.45,8.54 17.35,8.79C18,9.5 18.38,10.39 18.38,11.5C18.38,15.32 16.04,16.16 13.81,16.41C14.17,16.72 14.5,17.33 14.5,18.26C14.5,19.6 14.5,20.68 14.5,21C14.5,21.27 14.66,21.59 15.17,21.5C19.14,20.16 22,16.42 22,12A10,10 0 0,0 12,2Z"
            ></path>
          </svg>
          Register with GitHub
        </button>

        <p className="text-center mt-4 text-gray-700 dark:text-gray-200">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-indigo-500 font-bold hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
