import React from "react";
import { motion } from "framer-motion";
import HotelCard from "../HotelCard/HotelCard";
import { useAppContext } from "../../context/AppContext";

const Featured = () => {
  const { rooms } = useAppContext();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    rooms.length > 0 && (
      <section className="w-full pt-20 pb-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 outfit">
              Featured Destination
            </h2>
            <div className="w-24 h-1 bg-teal-600 mx-auto mb-6"></div>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed outfit">
              Discover our handpicked selection of exceptional properties around
              the world, offering unparalleled luxury and unforgettable
              experiences.
            </p>
          </motion.div>

          {/* Cards Grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {rooms.map((room, index) => {
              const isLast = index === rooms.length - 1;
              const isOddOut = rooms.length % 3 === 1 && isLast;

              return (
                <motion.div
                  key={room._id}
                  variants={itemVariants}
                  className={`${
                    isOddOut ? "lg:col-start-2" : ""
                  } flex justify-center`}
                >
                  <HotelCard room={room} />
                </motion.div>
              );
            })}
          </motion.div>

          {/* View All Button */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <a
              href="/hotels"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-teal-600 to-emerald-600 text-white px-8 py-4 rounded-xl font-semibold text-base outfit hover:from-teal-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 transform"
            >
              <span>View All Properties</span>
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </a>
          </motion.div>
        </div>
      </section>
    )
  );
};

export default Featured;
