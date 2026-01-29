import React from "react";
import { FaFacebook, FaInstagram } from "react-icons/fa";
import { BsTwitterX } from "react-icons/bs";
import { Link } from "react-router-dom";
import { MdPets } from "react-icons/md";

const Footer = () => {
  return (
    <footer className="bg-indigo-50 dark:bg-neutral text-neutral dark:text-white py-10">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">

        {/* Website Logo & Description */}
        <div className="text-center md:text-left">
          <Link
            to="/"
            className="flex items-center justify-center md:justify-start text-4xl font-bold text-indigo-600 dark:text-indigo-400 gap-2 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
          >
            <MdPets size={30} /> PawMart
          </Link>
          <p className="mt-3 max-w-xs mx-auto md:mx-0 text-gray-600 dark:text-gray-300">
            PawMart connects local pet owners and buyers for adoption and pet care products.
          </p>
        </div>

        {/* Quick Links */}
        <div className="text-center">
          <h3 className="text-lg font-bold mb-3">Quick Links</h3>
          <ul className="space-y-2 font-semibold">
            {["Home", "Services", "Contact", "Terms & Conditions"].map((link, i) => (
              <li key={i}>
                <Link
                  to={link === "Home" ? "/" : `/${link.toLowerCase().replace(/\s+/g, "-")}`}
                  className="hover:border-b-2 hover:text-indigo-600 dark:hover:text-indigo-400 inline-block transform hover:scale-105 transition duration-300"
                >
                  {link}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact & Social */}
        <div className="text-center">
          <h3 className="text-lg font-bold mb-3">Contact</h3>
          <p className="font-semibold text-gray-600 dark:text-gray-300">Email: pawmart@gmail.com</p>
          <p className="font-semibold text-gray-600 dark:text-gray-300">Phone: 01336458100</p>

          <div className="flex justify-center mt-4 gap-5">
            <a
              href="#"
              className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-200 transform hover:scale-102 transition duration-200"
            >
              <FaFacebook size={30} />
            </a>
            <a
              href="#"
              className="text-pink-500 hover:text-pink-700 transform hover:scale-102 transition duration-200"
            >
              <FaInstagram size={30} />
            </a>
            <a
              href="#"
              className="text-gray-800 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white transform hover:scale-102 transition duration-200"
            >
              <BsTwitterX size={30} />
            </a>
          </div>
        </div>
      </div>

      <div className="mt-10 text-center text-gray-600 dark:text-gray-400 text-sm">
        &copy; 2026 PawMart. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
