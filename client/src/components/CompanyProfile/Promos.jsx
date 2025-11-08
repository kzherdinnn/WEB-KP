import React from "react";
import { motion } from "framer-motion";
import { FaPercent, FaCalendarAlt, FaTag, FaArrowRight } from "react-icons/fa";

const Promos = () => {
  const promos = [
    {
      id: 1,
      title: "Early Bird Special",
      discount: "30% OFF",
      description: "Book 30 days in advance and save big on your stay",
      validUntil: "Dec 31, 2024",
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=400&fit=crop",
      badge: "Popular",
      color: "from-blue-500 to-blue-700",
      features: ["Free Breakfast", "Late Checkout", "Airport Transfer"],
    },
    {
      id: 2,
      title: "Weekend Getaway",
      discount: "25% OFF",
      description: "Perfect weekend escape with exclusive amenities included",
      validUntil: "Jan 15, 2025",
      image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&h=400&fit=crop",
      badge: "Hot Deal",
      color: "from-orange-500 to-red-600",
      features: ["Spa Access", "Welcome Drink", "Room Upgrade"],
    },
    {
      id: 3,
      title: "Long Stay Package",
      discount: "40% OFF",
      description: "Stay 7 nights or more and enjoy exclusive long-term rates",
      validUntil: "Feb 28, 2025",
      image: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=600&h=400&fit=crop",
      badge: "Best Value",
      color: "from-emerald-500 to-teal-700",
      features: ["Weekly Cleaning", "Laundry Service", "Kitchen Access"],
    },
    {
      id: 4,
      title: "Honeymoon Package",
      discount: "35% OFF",
      description: "Celebrate your love with romantic amenities and surprises",
      validUntil: "Mar 31, 2025",
      image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&h=400&fit=crop",
      badge: "Romantic",
      color: "from-pink-500 to-rose-700",
      features: ["Champagne", "Couples Massage", "Candlelit Dinner"],
    },
  ];

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
      },
    },
  };

  return (
    <section id="promos" className="pt-12 pb-12 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4 md:px-8 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 outfit">
            Special Offers & Packages
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-red-600 mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto outfit">
            Don't miss out on our exclusive deals and packages designed to make your stay unforgettable
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {promos.map((promo) => (
            <motion.div
              key={promo.id}
              variants={itemVariants}
              className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
            >
              {/* Badge */}
              <div className="absolute top-4 right-4 z-10">
                <span className={`bg-gradient-to-r ${promo.color} text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg outfit`}>
                  {promo.badge}
                </span>
              </div>

              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={promo.image}
                  alt={promo.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

                {/* Discount Badge on Image */}
                <div className="absolute bottom-4 left-4">
                  <div className={`bg-gradient-to-r ${promo.color} text-white px-4 py-2 rounded-xl shadow-xl`}>
                    <p className="text-2xl font-bold outfit">{promo.discount}</p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                <h3 className="text-xl font-bold text-gray-900 outfit group-hover:text-teal-600 transition-colors duration-300">
                  {promo.title}
                </h3>

                <p className="text-sm text-gray-600 outfit leading-relaxed">
                  {promo.description}
                </p>

                {/* Features */}
                <div className="space-y-2">
                  {promo.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm text-gray-700">
                      <div className="w-1.5 h-1.5 bg-teal-500 rounded-full"></div>
                      <span className="outfit">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Valid Until */}
                <div className="flex items-center gap-2 text-xs text-gray-500 pt-3 border-t border-gray-100">
                  <FaCalendarAlt className="w-3 h-3" />
                  <span className="outfit">Valid until {promo.validUntil}</span>
                </div>

                {/* CTA Button */}
                <button className={`w-full flex items-center justify-center gap-2 bg-gradient-to-r ${promo.color} text-white py-3 rounded-xl font-semibold outfit hover:shadow-xl transition-all duration-300 group-hover:scale-105`}>
                  <span>Book Now</span>
                  <FaArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA Banner */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-16 bg-gradient-to-r from-teal-600 via-emerald-600 to-teal-700 rounded-3xl p-8 md:p-12 text-white text-center relative overflow-hidden"
        >
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>

          <div className="relative z-10">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <FaTag className="w-8 h-8 text-white" />
              </div>
            </div>
            <h3 className="text-3xl md:text-4xl font-bold mb-4 outfit">
              Want More Exclusive Deals?
            </h3>
            <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto outfit">
              Subscribe to our newsletter and get notified about special offers, seasonal packages, and member-only discounts
            </p>
            <a
              href="#contact"
              className="inline-flex items-center gap-3 bg-white text-teal-700 px-8 py-4 rounded-xl font-bold text-lg outfit hover:bg-gray-100 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105"
            >
              <FaPercent className="w-5 h-5" />
              <span>Get Exclusive Offers</span>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Promos;
