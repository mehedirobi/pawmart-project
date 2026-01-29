import React, { useState, useEffect } from "react";
import { FaPaw, FaBone, FaShoppingBag, FaMedkit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import RecentListings from "../components/RecentListings";
import { Typewriter } from "react-simple-typewriter";
import { motion } from "framer-motion";
import FAQ from "./FAQ";
import Newsletter from "./Newsletter";

const banners = [
  "https://i.ibb.co/JRQYnsJy/Happy-owners.jpg",
  "https://i.ibb.co/S4Dj7J1B/Pets-adoptions.jpg",
  "https://i.ibb.co/B2LbJcHV/Petss.jpg",
];

const taglines = [
  "Find Your Furry Friend Today!",
  "Adopt, Don’t Shop — Give a Pet a Home.",
  "Because Every Pet Deserves Love and Care.",
];

const categories = [
  { name: "Pets", icon: <FaPaw size={40} className="text-indigo-500" /> },
  { name: "Pet Food", icon: <FaBone size={40} className="text-indigo-500" /> },
  { name: "Accessories", icon: <FaShoppingBag size={40} className="text-indigo-500" /> },
  { name: "Pet Care Products", icon: <FaMedkit size={40} className="text-indigo-500" /> },
];

const petHeroes = [
  { name: "Alice Johnson", role: "Pet Adopter", image: "https://i.ibb.co/zWSPbBwg/images.jpg" },
  { name: "Michael Smith", role: "Pet Caregiver", image: "https://i.ibb.co/79RDnmf/download-2.jpg" },
  { name: "Sophie Lee", role: "Pet Adopter", image: "https://i.ibb.co/zVLgmKcJ/download-1.jpg" },
  { name: "David Kim", role: "Pet Caregiver", image: "https://i.ibb.co/CK4rB2zD/download.jpg" },
];

const Home = () => {
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Home | PawMart";
  }, []);

  // Auto slide
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const prevSlide = () => setCurrent((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
  const nextSlide = () => setCurrent((prev) => (prev + 1) % banners.length);

  const handleCategoryClick = (categoryName) => {
    navigate(`/category-filtered-product/${encodeURIComponent(categoryName)}`);
  };

  const scrollToCategories = () => {
    const el = document.getElementById("categories");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="bg-base-200 dark:bg-neutral pb-20 transition-colors duration-500">

     <h2 className="text-3xl mt-10 font-bold text-center text-indigo-600 dark:text-indigo-400">
          Find Your Furry Friend Today!
        </h2>
        
      {/* Hero / Carousel */}
      <div className="relative mt-5 w-full h-[60vh] md:h-[70vh] overflow-hidden">
        {banners.map((img, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: index === current ? 1 : 0 }}
            transition={{ duration: 1 }}
            className={`absolute w-full h-full top-0 left-0 ${index === current ? "z-10" : "z-0"}`}
          >
            <img src={img} alt={`Banner ${index}`} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/20 to-transparent"></div>

            {index === current && (
              <div className="absolute inset-0 flex flex-col justify-center md:pl-20 px-6 text-white space-y-5">
                <motion.h2
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.7 }}
                  className="text-3xl md:text-5xl font-bold drop-shadow-lg"
                >
                  <Typewriter
                    words={[taglines[index]]}
                    loop={0}
                    cursor
                    cursorStyle="|"
                    typeSpeed={70}
                    deleteSpeed={50}
                    delaySpeed={1000}
                  />
                </motion.h2>
               
              </div>
            )}
          </motion.div>
        ))}

        {/* Slide Controls */}
        <button
          onClick={prevSlide}
          className="absolute top-1/2 left-5 transform -translate-y-1/2 bg-indigo-500 hover:scale-110 transition-transform text-white rounded-full p-2 hover:bg-indigo-700 z-20"
        >
          &#10094;
        </button>
        <button
          onClick={nextSlide}
          className="absolute top-1/2 right-5 transform -translate-y-1/2 bg-indigo-500/70 text-white rounded-full p-2 hover:bg-indigo-700 z-20"
        >
          &#10095;
        </button>

        {/* Indicator Dots */}
        <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrent(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === current ? "bg-indigo-600 scale-125" : "bg-gray-400 dark:bg-gray-500"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Categories */}
      <div id="categories" className="my-30 container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-indigo-600 dark:text-indigo-400 mb-10">
          Explore Categories
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.08 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="flex flex-col items-center justify-center p-6 rounded-xl shadow-md bg-white dark:bg-neutral hover:bg-indigo-50 dark:hover:bg-neutral/70 cursor-pointer transition-colors"
              onClick={() => handleCategoryClick(category.name)}
            >
              {category.icon}
              <h3 className="mt-4 text-lg font-semibold text-gray-700 dark:text-gray-200 text-center">
                {category.name}
              </h3>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Recent Listings */}
      <div className="my-30">
        <RecentListings />
      </div>

      {/* Why Adopt Section */}
      <div className="py-20 container mx-auto px-4 bg-white hover:bg-indigo-50 transition-colors dark:bg-neutral rounded-xl shadow-lg mt-20">
        <h2 className="text-3xl font-bold text-indigo-600 dark:text-gray-200 mb-6 text-center">
          Why Adopt from PawMart?
        </h2>
        <p className="text-gray-700 dark:text-gray-300 text-lg text-center max-w-3xl mx-auto">
          Adopting pets helps save lives, reduces stray animals, and gives loving homes to pets in need.
          Every adoption makes a difference — be a hero for a furry friend!
        </p>
      </div>

      {/* Pet Heroes */}
      <div className="my-20 container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-indigo-600 dark:text-gray-200 mb-10 text-center">
          Meet Our Pet Heroes
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {petHeroes.map((hero, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 100 }}
              className="flex flex-col items-center bg-white dark:bg-neutral hover:bg-indigo-50 dark:hover:bg-neutral/70 p-6 rounded-xl shadow-lg transition-colors"
            >
              <img
                src={hero.image}
                alt={hero.name}
                className="w-32 h-32 object-cover rounded-full mb-4"
              />
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">{hero.name}</h3>
              <p className="text-gray-600 dark:text-gray-300">{hero.role}</p>
            </motion.div>
          ))}
        </div>

        {/* FAQ */}
        <div className="my-10">
          <FAQ />
        </div>

        {/* News latter */}
        <div>
        <Newsletter />
        </div>
      </div>
    </div>
  );
};

export default Home;
