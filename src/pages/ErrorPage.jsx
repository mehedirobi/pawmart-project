import { Link } from "react-router-dom";
import { FaPaw } from "react-icons/fa";

const ErrorPage = () => {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-indigo-100 text-center px-5">

      <h1 className="text-9xl font-bold text-indigo-600 mt-5">404</h1>
      <h2 className="text-2xl md:text-3xl font-semibold mt-3 text-gray-800">
        Oops! Page Not Found
      </h2>

        <p className="text-gray-600 mt-3 ">
        Oops! Looks like this page got lost.  
        Let’s go back home to see all your pets!
        </p>

      <Link
        to="/"
        className="mt-6 inline-block bg-indigo-500 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-full transition duration-300"
      >
        Go Back Home
      </Link>
    </div>
  );
};

export default ErrorPage;
