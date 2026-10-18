
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";

const HomeLayout = () => {
  const { pathname } = useLocation();

  const isDashboard = pathname.startsWith("/my-dashboard");

  return (
    <div className="flex min-h-screen flex-col bg-base-200 text-neutral transition-colors duration-200 dark:bg-neutral dark:text-white">
      <Navbar />

      <main id="main-content" className="min-w-0 flex-1">
        <Outlet />
      </main>

      {!isDashboard && <Footer />}
    </div>
  );
};

export default HomeLayout;
