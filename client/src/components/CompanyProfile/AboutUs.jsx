import React from "react";
import { motion } from "framer-motion";

const AboutUs = () => {
  return (
    <section id="about" className="pt-16 pb-12 bg-white">
      <div className="container mx-auto px-4 md:px-8 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 outfit">
            About Our Hotel
          </h2>
          <div className="w-24 h-1 bg-blue-600 mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto outfit">
            Experience luxury and comfort in the heart of the city
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Side - Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative h-[400px] md:h-[500px] rounded-lg overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800"
                alt="Hotel Exterior"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            </div>
            {/* Floating Card */}
            <div className="absolute -bottom-8 -right-8 bg-white p-6 rounded-lg shadow-xl border border-gray-100">
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <p className="text-4xl font-bold text-blue-600 outfit">25+</p>
                  <p className="text-sm text-gray-600 outfit">
                    Years Experience
                  </p>
                </div>
                <div className="h-16 w-px bg-gray-300"></div>
                <div className="text-center">
                  <p className="text-4xl font-bold text-blue-600 outfit">
                    10k+
                  </p>
                  <p className="text-sm text-gray-600 outfit">Happy Guests</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Side - Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h3 className="text-3xl font-bold text-gray-900 outfit">
              Welcome to Excellence in Hospitality
            </h3>
            <p className="text-gray-600 leading-relaxed outfit">
              Since 1999, we have been dedicated to providing exceptional
              hospitality services. Our hotel combines modern luxury with
              traditional warmth, creating an unforgettable experience for every
              guest.
            </p>
            <p className="text-gray-600 leading-relaxed outfit">
              Located in the prime area of the city, we offer easy access to
              business districts, shopping centers, and tourist attractions.
              Whether you're here for business or leisure, our team is committed
              to making your stay comfortable and memorable.
            </p>

            {/* Features List */}
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center mt-1">
                  <svg
                    className="w-4 h-4 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 outfit">
                    Prime Location
                  </p>
                  <p className="text-sm text-gray-600 outfit">
                    City center access
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center mt-1">
                  <svg
                    className="w-4 h-4 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 outfit">
                    24/7 Service
                  </p>
                  <p className="text-sm text-gray-600 outfit">
                    Always available
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center mt-1">
                  <svg
                    className="w-4 h-4 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 outfit">
                    Luxury Rooms
                  </p>
                  <p className="text-sm text-gray-600 outfit">
                    Modern amenities
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center mt-1">
                  <svg
                    className="w-4 h-4 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 outfit">
                    Fine Dining
                  </p>
                  <p className="text-sm text-gray-600 outfit">
                    Restaurant & bar
                  </p>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <div className="pt-6">
              <a
                href="#contact"
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-300 shadow-lg hover:shadow-xl outfit"
              >
                Contact Us
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
            </div>
          </motion.div>
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 pt-16 border-t border-gray-200"
        >
          <div className="text-center">
            <p className="text-4xl font-bold text-blue-600 mb-2 outfit">150+</p>
            <p className="text-gray-600 outfit">Luxury Rooms</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold text-blue-600 mb-2 outfit">50+</p>
            <p className="text-gray-600 outfit">Expert Staff</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold text-blue-600 mb-2 outfit">98%</p>
            <p className="text-gray-600 outfit">Satisfaction Rate</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold text-blue-600 mb-2 outfit">15+</p>
            <p className="text-gray-600 outfit">Awards Won</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutUs;
