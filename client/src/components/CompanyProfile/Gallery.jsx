import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState(null);

  const galleryImages = [
    {
      url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
      title: "Hotel Exterior",
      category: "Building",
    },
    {
      url: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800",
      title: "Luxury Suite",
      category: "Rooms",
    },
    {
      url: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800",
      title: "Deluxe Room",
      category: "Rooms",
    },
    {
      url: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800",
      title: "Hotel Lobby",
      category: "Interior",
    },
    {
      url: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800",
      title: "Swimming Pool",
      category: "Facilities",
    },
    {
      url: "https://images.unsplash.com/photo-1517840901100-8179e982acb7?w=800",
      title: "Restaurant",
      category: "Dining",
    },
    {
      url: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800",
      title: "Spa & Wellness",
      category: "Facilities",
    },
    {
      url: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800",
      title: "Conference Room",
      category: "Business",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <section id="gallery" className="pt-12 pb-12 bg-white">
      <div className="container mx-auto px-4 md:px-8 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Our Gallery
          </h2>
          <div className="w-24 h-1 bg-blue-600 mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Take a visual tour of our beautiful hotel and facilities
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {galleryImages.map((image, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className={`relative group cursor-pointer overflow-hidden rounded-lg shadow-lg ${
                index === 0 || index === 5 ? "lg:col-span-2 lg:row-span-2" : ""
              }`}
              onClick={() => setSelectedImage(image)}
            >
              <div
                className={`relative ${
                  index === 0 || index === 5 ? "h-[400px]" : "h-[200px]"
                } overflow-hidden`}
              >
                <img
                  src={image.url}
                  alt={image.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <p className="text-xs text-blue-300 font-semibold mb-1">
                      {image.category}
                    </p>
                    <p className="text-white text-lg font-bold">
                      {image.title}
                    </p>
                  </div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="w-12 h-12 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Lightbox Modal */}
        <AnimatePresence>
          {selectedImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
              onClick={() => setSelectedImage(null)}
            >
              <button
                className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
                onClick={() => setSelectedImage(null)}
              >
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="max-w-5xl w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <img
                  src={selectedImage.url}
                  alt={selectedImage.title}
                  className="w-full h-auto rounded-lg shadow-2xl"
                />
                <div className="mt-4 text-center">
                  <p className="text-blue-400 text-sm font-semibold mb-1">
                    {selectedImage.category}
                  </p>
                  <p className="text-white text-xl font-bold">
                    {selectedImage.title}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default Gallery;
