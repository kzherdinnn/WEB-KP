import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaStar, FaChevronLeft, FaChevronRight } from "react-icons/fa";

const testimonials = [
  {
    id: 1,
    name: "Emma Rodriguez",
    address: "Barcelona, Spain",
    image:
      "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200",
    rating: 5,
    review:
      "Exceptional service and attention to detail. Everything was handled professionally and efficiently from start to finish. Highly recommended!",
  },
  {
    id: 2,
    name: "Liam Johnson",
    address: "New York, USA",
    image:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200",
    rating: 5,
    review:
      "I'm truly impressed by the quality and consistency. The entire process was smooth, and the results exceeded all expectations. Thank you!",
  },
  {
    id: 3,
    name: "Sophia Lee",
    address: "Seoul, South Korea",
    image:
      "https://images.unsplash.com/photo-1701615004837-40d8573b6652?q=80&w=200",
    rating: 5,
    review:
      "Fantastic experience! From start to finish, the team was professional, responsive, and genuinely cared about delivering great results.",
  },
  {
    id: 4,
    name: "Michael Chen",
    address: "Singapore",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200",
    rating: 5,
    review:
      "Outstanding hotel! The rooms are spacious and clean, staff is incredibly friendly, and the location is perfect. Will definitely return!",
  },
  {
    id: 5,
    name: "Isabella Martinez",
    address: "Madrid, Spain",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200",
    rating: 5,
    review:
      "Best hotel experience ever! The spa facilities are amazing, and the breakfast buffet exceeded all expectations. Truly a 5-star experience.",
  },
  {
    id: 6,
    name: "James Wilson",
    address: "London, UK",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200",
    rating: 4,
    review:
      "Wonderful stay with my family. The kids loved the pool area, and we appreciated the family-friendly amenities. Great value for money!",
  },
  {
    id: 7,
    name: "Yuki Tanaka",
    address: "Tokyo, Japan",
    image:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200",
    rating: 5,
    review:
      "Impeccable cleanliness and attention to detail. The concierge team went above and beyond to make our honeymoon special. Highly recommend!",
  },
  {
    id: 8,
    name: "David Brown",
    address: "Sydney, Australia",
    image:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200",
    rating: 5,
    review:
      "Perfect for business travel. The conference facilities are top-notch, and the fast WiFi throughout the hotel made working remotely seamless.",
  },
  {
    id: 9,
    name: "Olivia Anderson",
    address: "Toronto, Canada",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200",
    rating: 5,
    review:
      "The rooftop restaurant offers stunning views and delicious cuisine. The entire staff made us feel like VIPs. Can't wait to come back!",
  },
];

const Testimonial = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Number of testimonials to show at once based on screen size
  const testimonialsPerView = 3;
  const totalSlides = Math.ceil(testimonials.length / testimonialsPerView);

  const nextSlide = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  // Auto-rotate every 5 seconds
  useEffect(() => {
    if (!isPaused) {
      const interval = setInterval(() => {
        setDirection(1);
        setCurrentIndex((prev) => (prev + 1) % totalSlides);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [currentIndex, isPaused, totalSlides]);

  const goToSlide = (index) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  // Get current testimonials to display
  const getCurrentTestimonials = () => {
    const start = currentIndex * testimonialsPerView;
    const end = start + testimonialsPerView;
    return testimonials.slice(start, end);
  };

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      x: direction > 0 ? -1000 : 1000,
      opacity: 0,
    }),
  };

  return (
    <div className="w-full px-4 sm:px-8 lg:px-16 pt-12 pb-12">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 playfair">
          What Our Guests Say
        </h2>
        <div className="w-24 h-1 bg-blue-600 mx-auto mb-6"></div>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto outfit">
          Discover what makes us the go-to option for those who demand only the
          best. Our guests trust us to provide exceptional stays that exceed
          expectations at every turn.
        </p>
      </motion.div>

      <div
        className="relative max-w-7xl mx-auto"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white rounded-full p-3 shadow-lg hover:bg-blue-600 hover:text-white transition-all duration-300 group"
          aria-label="Previous testimonials"
        >
          <FaChevronLeft className="w-5 h-5" />
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white rounded-full p-3 shadow-lg hover:bg-blue-600 hover:text-white transition-all duration-300 group"
          aria-label="Next testimonials"
        >
          <FaChevronRight className="w-5 h-5" />
        </button>

        {/* Carousel Container */}
        <div className="overflow-hidden">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
              }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {getCurrentTestimonials().map((testimonial, index) => (
                <motion.div
                  key={testimonial.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 border border-gray-100"
                >
                  {/* Quote Icon */}
                  <div className="text-blue-600 mb-4">
                    <svg
                      className="w-10 h-10 opacity-50"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M6.5 10c-.223 0-.437.034-.65.065.069-.232.14-.468.254-.68.114-.308.292-.575.469-.844.148-.291.409-.488.601-.737.201-.242.475-.403.692-.604.213-.21.492-.315.714-.463.232-.133.434-.28.65-.35.208-.086.39-.16.539-.222.302-.125.474-.197.474-.197L9.758 4.03c0 0-.218.052-.597.144C8.97 4.222 8.737 4.278 8.472 4.345c-.271.05-.56.187-.882.312C7.272 4.799 6.904 4.895 6.562 5.123c-.344.218-.741.4-1.091.692C5.132 6.116 4.723 6.377 4.421 6.76c-.33.358-.656.734-.909 1.162C3.219 8.33 3.02 8.778 2.81 9.221c-.19.443-.343.896-.468 1.336-.237.882-.343 1.72-.384 2.437-.034.718-.014 1.315.028 1.747.015.204.043.402.063.539.017.109.025.168.025.168l.026-.006C2.535 17.474 4.338 19 6.5 19c2.485 0 4.5-2.015 4.5-4.5S8.985 10 6.5 10zM17.5 10c-.223 0-.437.034-.65.065.069-.232.14-.468.254-.68.114-.308.292-.575.469-.844.148-.291.409-.488.601-.737.201-.242.475-.403.692-.604.213-.21.492-.315.714-.463.232-.133.434-.28.65-.35.208-.086.39-.16.539-.222.302-.125.474-.197.474-.197L20.758 4.03c0 0-.218.052-.597.144-.191.048-.424.104-.689.171-.271.05-.56.187-.882.312-.317.143-.685.239-1.027.467-.344.218-.741.4-1.091.692-.339.301-.748.562-1.05.944-.33.358-.656.734-.909 1.162C14.219 8.33 14.02 8.778 13.81 9.221c-.19.443-.343.896-.468 1.336-.237.882-.343 1.72-.384 2.437-.034.718-.014 1.315.028 1.747.015.204.043.402.063.539.017.109.025.168.025.168l.026-.006C13.535 17.474 15.338 19 17.5 19c2.485 0 4.5-2.015 4.5-4.5S19.985 10 17.5 10z" />
                    </svg>
                  </div>

                  {/* Review Text */}
                  <p className="text-gray-600 mb-6 outfit leading-relaxed">
                    {testimonial.review}
                  </p>

                  {/* Star Rating */}
                  <div className="flex items-center gap-1 mb-6">
                    {Array.from({ length: 5 }).map((_, starIndex) => (
                      <FaStar
                        key={starIndex}
                        className={
                          starIndex < testimonial.rating
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }
                      />
                    ))}
                  </div>

                  {/* User Info */}
                  <div className="flex items-center gap-4 pt-6 border-t border-gray-200">
                    <img
                      loading="lazy"
                      className="w-14 h-14 rounded-full object-cover border-2 border-blue-100"
                      src={testimonial.image}
                      alt={testimonial.name}
                    />
                    <div>
                      <p className="font-bold text-gray-900 playfair">
                        {testimonial.name}
                      </p>
                      <p className="text-sm text-gray-500 outfit">
                        {testimonial.address}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Dots Navigation */}
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: totalSlides }).map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? "w-8 bg-blue-600"
                  : "w-2 bg-gray-300 hover:bg-gray-400"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Testimonial;
