import React from "react";
import { MdPets } from "react-icons/md";
import { Link } from "react-router";

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-base-200 dark:bg-gray-900 px-4 py-10">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="text-center mb-12">
          <MdPets className="mx-auto text-indigo-600 dark:text-indigo-400 text-6xl" />
          <h1 className="text-4xl font-bold text-indigo-600 dark:text-gray-200 mt-4">
            About PawMart
          </h1>
          <p className="mt-3 text-gray-500 dark:text-gray-300 max-w-2xl mx-auto">
            PawMart is your one-stop platform for everything pets – from adoption to food, accessories, and pet care products. 
            We connect pet lovers with their furry friends and ensure a happy, healthy life for pets everywhere.
          </p>
        </div>

        {/* Our Mission */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-center text-indigo-600 dark:text-indigo-400 mb-4">
            Our Mission
          </h2>
          <p className="text-gray-500 dark:text-gray-200 leading-relaxed">
            At PawMart, our mission is to make pet ownership easier, enjoyable, and responsible. 
            We provide a trusted space for pet adoption, high-quality pet food, and all necessary accessories for happy and healthy pets. 
            We believe every pet deserves love, care, and a safe home.
          </p>
        </section>

        {/* What We Offer */}
        <section className="mb-12 grid gap-6 md:grid-cols-3">
          <div className="bg-white hover:bg-indigo-50 dark:bg-gray-800 p-6 rounded-xl shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold text-indigo-600 dark:text-indigo-400 mb-2">Pet Adoption</h3>
            <p className="text-gray-700 dark:text-gray-300">
              Find your perfect furry friend! Our adoption service connects pets with loving families, making the adoption process easy and safe.
            </p>
          </div>
          <div className="bg-white hover:bg-indigo-50 dark:bg-gray-800 p-6 rounded-xl shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold text-indigo-600 dark:text-indigo-400 mb-2">Pet Food</h3>
            <p className="text-gray-700 dark:text-gray-300">
              Explore a wide range of nutritious and high-quality food options for cats, dogs, birds, and other pets to keep them healthy and happy.
            </p>
          </div>
          <div className="bg-white hover:bg-indigo-50 dark:bg-gray-800 p-6 rounded-xl shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold text-indigo-600 dark:text-indigo-400 mb-2">Pet Accessories</h3>
            <p className="text-gray-700 dark:text-gray-300">
              Stylish collars, beds, toys, and grooming essentials – we provide everything your pet needs to thrive.
            </p>
          </div>
        </section>

        

        {/* Call to Action */}
        <section className="text-center mt-12">
          <h2 className="text-3xl font-bold text-indigo-600 dark:text-gray-200 mb-4">
            Join the PawMart Family Today!
          </h2>
          <p className="text-gray-500 dark:text-gray-300 mb-6">
            Whether you’re adopting a pet, shopping for their needs, or just exploring, PawMart is here to support every paw in your life.
          </p>
          
          <Link
          to="/register"
          className="btn btn-sm btn-outline font-bold text-lg btn-primary"
        >
          Get Started
        </Link>
        </section>

      </div>
    </div>
  );
};

export default AboutUs;
