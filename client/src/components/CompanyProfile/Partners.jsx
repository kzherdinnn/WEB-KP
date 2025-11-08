import React from "react";
import { motion } from "framer-motion";

const Partners = () => {
  // Partner logos - replace with actual logo URLs
  const partners = [
    {
      id: 1,
      name: "Booking.com",
      logo: "https://logo.clearbit.com/booking.com",
    },
    {
      id: 2,
      name: "Expedia",
      logo: "https://logo.clearbit.com/expedia.com",
    },
    {
      id: 3,
      name: "TripAdvisor",
      logo: "https://logo.clearbit.com/tripadvisor.com",
    },
    {
      id: 4,
      name: "Agoda",
      logo: "https://logo.clearbit.com/agoda.com",
    },
    {
      id: 5,
      name: "Hotels.com",
      logo: "https://logo.clearbit.com/hotels.com",
    },
    {
      id: 6,
      name: "Airbnb",
      logo: "https://logo.clearbit.com/airbnb.com",
    },
    {
      id: 7,
      name: "Priceline",
      logo: "https://logo.clearbit.com/priceline.com",
    },
    {
      id: 8,
      name: "Kayak",
      logo: "https://logo.clearbit.com/kayak.com",
    },
  ];

  // Duplicate partners for seamless infinite scroll
  const duplicatedPartners = [...partners, ...partners];

  return (
    <section id="partners" className="py-12 bg-white border-y border-gray-200">
      <div className="container mx-auto px-4 md:px-8 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 playfair">
            Our Trusted Partners
          </h3>
          <p className="text-gray-600 outfit">
            Partnering with the world's leading travel platforms
          </p>
        </motion.div>

        {/* Infinite Scrolling Container */}
        <div className="relative overflow-hidden">
          {/* Gradient Overlays */}
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white to-transparent z-10"></div>
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white to-transparent z-10"></div>

          {/* Scrolling Logos */}
          <motion.div
            className="flex gap-12 items-center"
            animate={{
              x: [0, -100 * partners.length],
            }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 20,
                ease: "linear",
              },
            }}
          >
            {duplicatedPartners.map((partner, index) => (
              <div
                key={`${partner.id}-${index}`}
                className="flex-shrink-0 w-32 h-20 flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-300"
              >
                <img
                  src={partner.logo}
                  alt={partner.name}
                  className="max-w-full max-h-full object-contain opacity-60 hover:opacity-100 transition-opacity duration-300"
                  loading="lazy"
                />
              </div>
            ))}
          </motion.div>
        </div>

        {/* Optional: Stats or CTA below */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <p className="text-sm text-gray-500 outfit">
            Trusted by over{" "}
            <span className="font-bold text-blue-600">50,000+</span> travelers
            worldwide
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Partners;
