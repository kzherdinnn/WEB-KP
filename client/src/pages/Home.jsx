import React, { useEffect, useState } from "react";
import {
  Hero,
  Featured,
  Testimonial,
  Newsletter,
  Footer,
  AboutUs,
  Facilities,
  Gallery,
  ContactLocation,
  Partners,
  Promos,
  Articles,
} from "../components";

const Home = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-sm tracking-widest text-gray-700 uppercase">
            Loading...
          </p>
        </div>
      </div>
    );
  }

  // Main Page Content - Professional Flow
  return (
    <div>
      {/* 1. Hero Section - First Impression & Booking */}
      <Hero />

      {/* 2. About Us Section - Introduction to Bengkel */}
      <AboutUs />

      {/* 3. Facilities Section - What We Offer */}
      <Facilities />

      {/* 4. Featured Rooms Section - Our Products */}
      <Featured />

      {/* 5. Promos Section - Special Offers */}
      <Promos />

      {/* 6. Gallery Section - Visual Showcase */}
      <Gallery />

      {/* 7. Partners Carousel - Trust Indicators */}
      <Partners />

      {/* 8. Testimonials Section - Social Proof */}
      <div className="bg-gray-100">
        <Testimonial />
      </div>

      {/* 9. Articles Section - Content & Tips */}
      <Articles />

      {/* 10. Contact & Location Section - Get in Touch */}
      <ContactLocation />

      {/* 11. Newsletter Section - Stay Connected */}
      <Newsletter />

      {/* 12. Footer */}
      <Footer />
    </div>
  );
};

export default Home;
