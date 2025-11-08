import React from "react";
import { motion } from "framer-motion";
import { FaCalendarAlt, FaClock, FaUser, FaArrowLeft } from "react-icons/fa";

const ArticlesPage = () => {
  const articles = [
    {
      id: 1,
      title: "10 Tips for Choosing the Perfect Hotel Room",
      excerpt:
        "Discover essential factors to consider when booking your ideal hotel room for a memorable stay. From location to amenities, we cover everything you need to know.",
      image:
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=400&fit=crop",
      author: "Sarah Johnson",
      date: "Dec 15, 2024",
      readTime: "5 min read",
      category: "Travel Tips",
      categoryColor: "bg-blue-500",
    },
    {
      id: 2,
      title: "Hidden Gems: Exploring Local Attractions Near Your Hotel",
      excerpt:
        "Uncover secret spots and authentic experiences just steps away from popular hotel destinations. Your guide to local adventures.",
      image:
        "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&h=400&fit=crop",
      author: "Michael Chen",
      date: "Dec 12, 2024",
      readTime: "7 min read",
      category: "Destinations",
      categoryColor: "bg-emerald-500",
    },
    {
      id: 3,
      title: "Business Travel Made Easy: Productivity Hacks",
      excerpt:
        "Maximize your efficiency and comfort while traveling for work with these expert strategies and time-saving tips.",
      image:
        "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=600&h=400&fit=crop",
      author: "David Rodriguez",
      date: "Dec 10, 2024",
      readTime: "6 min read",
      category: "Business Travel",
      categoryColor: "bg-purple-500",
    },
    {
      id: 4,
      title: "Sustainable Travel: Eco-Friendly Hotel Practices",
      excerpt:
        "Learn how modern hotels are embracing sustainability and how you can travel more responsibly while enjoying luxury.",
      image:
        "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&h=400&fit=crop",
      author: "Emma Green",
      date: "Dec 8, 2024",
      readTime: "8 min read",
      category: "Sustainability",
      categoryColor: "bg-green-500",
    },
    {
      id: 5,
      title: "Family Vacation Planning: A Complete Guide",
      excerpt:
        "Everything you need to know to plan the perfect family getaway, from kid-friendly activities to accommodation tips.",
      image:
        "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=600&h=400&fit=crop",
      author: "Lisa Anderson",
      date: "Dec 5, 2024",
      readTime: "10 min read",
      category: "Family Travel",
      categoryColor: "bg-pink-500",
    },
    {
      id: 6,
      title: "Luxury Hotel Amenities Worth the Splurge",
      excerpt:
        "Explore premium services and features that elevate your hotel experience from good to unforgettable moments.",
      image:
        "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600&h=400&fit=crop",
      author: "James Wilson",
      date: "Dec 3, 2024",
      readTime: "6 min read",
      category: "Luxury",
      categoryColor: "bg-yellow-500",
    },
    {
      id: 7,
      title: "Best Hotel Breakfast Experiences Around the World",
      excerpt:
        "Start your day right with these exceptional hotel breakfast offerings that will make your mornings memorable.",
      image:
        "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=600&h=400&fit=crop",
      author: "Maria Santos",
      date: "Dec 1, 2024",
      readTime: "5 min read",
      category: "Food & Dining",
      categoryColor: "bg-orange-500",
    },
    {
      id: 8,
      title: "Hotel Room Photography Tips for Instagram",
      excerpt:
        "Capture stunning hotel photos for your social media with these professional photography tips and tricks.",
      image:
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=400&fit=crop",
      author: "Alex Turner",
      date: "Nov 28, 2024",
      readTime: "4 min read",
      category: "Photography",
      categoryColor: "bg-indigo-500",
    },
    {
      id: 9,
      title: "Weekend City Breaks: Top Destinations for 2025",
      excerpt:
        "Discover the best cities for quick weekend getaways and make the most of your short breaks.",
      image:
        "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=600&h=400&fit=crop",
      author: "Tom Bradley",
      date: "Nov 25, 2024",
      readTime: "9 min read",
      category: "Travel Planning",
      categoryColor: "bg-red-500",
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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-24 pb-16">
      <div className="container mx-auto px-4 md:px-8 lg:px-16">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <a
            href="/#articles"
            className="inline-flex items-center gap-2 text-teal-600 hover:text-teal-700 font-semibold outfit transition-colors duration-300"
          >
            <FaArrowLeft className="w-4 h-4" />
            <span>Kembali ke Beranda</span>
          </a>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 outfit">
            Travel Articles & Guides
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto mb-6"></div>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto outfit">
            Discover insider tips, destination guides, and travel inspiration from our experts
          </p>
        </motion.div>

        {/* Articles Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {articles.map((article) => (
            <motion.div
              key={article.id}
              variants={itemVariants}
              className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 cursor-pointer"
              onClick={() => (window.location.href = `/articles/${article.id}`)}
            >
              {/* Image */}
              <div className="relative h-56 overflow-hidden">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute top-4 left-4">
                  <span
                    className={`${article.categoryColor} text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg outfit`}
                  >
                    {article.category}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-4 text-xs text-gray-500 outfit">
                  <span className="flex items-center gap-1">
                    <FaCalendarAlt className="w-3 h-3" />
                    {article.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <FaClock className="w-3 h-3" />
                    {article.readTime}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-gray-900 outfit group-hover:text-teal-600 transition-colors duration-300 line-clamp-2">
                  {article.title}
                </h3>

                <p className="text-sm text-gray-600 outfit leading-relaxed line-clamp-3">
                  {article.excerpt}
                </p>

                <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                      <FaUser className="w-3 h-3 text-gray-600" />
                    </div>
                    <p className="text-xs font-semibold text-gray-700 outfit">
                      {article.author}
                    </p>
                  </div>

                  <button className="text-teal-600 hover:text-teal-700 font-semibold text-sm outfit flex items-center gap-1 group-hover:gap-2 transition-all duration-300">
                    Baca
                    <span>→</span>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default ArticlesPage;
