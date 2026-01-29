import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";

const HomeLayout = () => {
  const location = useLocation();

  const isDashboard = location.pathname.startsWith("/my-dashboard");

  return (
    <div className="min-h-screen flex flex-col bg-base-200 dark:bg-neutral text-neutral dark:text-white">
      
      
      <Navbar />

      <main className="flex-1">
        <Outlet />
      </main>

      {!isDashboard && <Footer />}
    </div>
  );
};

export default HomeLayout;
