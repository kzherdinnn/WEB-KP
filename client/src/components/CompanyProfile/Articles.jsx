import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaCalendarAlt, FaClock, FaUser, FaArrowRight, FaImage } from "react-icons/fa";
import axios from "axios";
import { Link } from "react-router-dom";

const Articles = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const { data } = await axios.get("/api/articles?limit=3");
        if (data.success) {
          setArticles(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch articles", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

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

  // Helper to get category color
  const getCategoryColor = (category) => {
    const colors = {
      "Tips Audio": "bg-teal-500",
      Perawatan: "bg-emerald-500",
      Modifikasi: "bg-cyan-500",
      Keamanan: "bg-amber-500",
      Berita: "bg-blue-500",
      "Review Produk": "bg-purple-500",
    };
    return colors[category] || "bg-gray-500";
  };

  return (
    <section
      id="articles"
      className="py-8 bg-gradient-to-b from-gray-50 to-white"
    >
      <div className="container mx-auto px-4 md:px-8 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2 outfit">
            Artikel & Panduan Audio Mobil
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-teal-500 to-emerald-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto outfit">
            Tips pemasangan, panduan pemilihan komponen, dan inspirasi modifikasi
            audio mobil dari para ahli kami
          </p>
        </motion.div>

        {/* Article Grid */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            Belum ada artikel.
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12"
          >
            {articles.map((article) => (
              <motion.div
                key={article._id}
                variants={itemVariants}
                className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 cursor-pointer flex flex-col h-full"
              >
                <Link to={`/articles/${article.slug}`} className="flex flex-col h-full">
                  {/* Image */}
                  <div className="relative h-56 overflow-hidden shrink-0">
                    {article.image ? (
                      <img
                        src={article.image}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
                        <FaImage size={40} />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute top-4 left-4">
                      <span
                        className={`${getCategoryColor(
                          article.category
                        )} text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg outfit`}
                      >
                        {article.category}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 space-y-4 flex flex-col flex-grow">
                    <div className="flex items-center gap-4 text-xs text-gray-500 outfit">
                      <span className="flex items-center gap-1">
                        <FaCalendarAlt className="w-3 h-3" />
                        {new Date(article.createdAt).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                      <span className="flex items-center gap-1">
                        <FaClock className="w-3 h-3" />
                        {article.readTime || "5 menit baca"}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 outfit group-hover:text-teal-600 transition-colors duration-300 line-clamp-2">
                      {article.title}
                    </h3>

                    <p className="text-sm text-gray-600 outfit leading-relaxed line-clamp-3">
                      {article.excerpt}
                    </p>

                    <div className="pt-4 border-t border-gray-100 flex items-center justify-between mt-auto">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                          <FaUser className="w-3 h-3 text-gray-600" />
                        </div>
                        <p className="text-xs font-semibold text-gray-700 outfit">
                          {article.author}
                        </p>
                      </div>

                      <span className="text-teal-600 hover:text-teal-700 font-semibold text-sm outfit flex items-center gap-1 group-hover:gap-2 transition-all duration-300">
                        Baca
                        <FaArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Selengkapnya Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Link
            to="/articles"
            className="inline-flex items-center gap-3 bg-gradient-to-r from-teal-600 to-emerald-600 text-white px-10 py-4 rounded-xl font-semibold text-lg outfit hover:from-teal-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1"
          >
            <span>Selengkapnya</span>
            <FaArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default Articles;
