import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import {
  FaCalendarAlt,
  FaClock,
  FaUser,
  FaArrowLeft,
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaWhatsapp,
} from "react-icons/fa";

const ArticleDetail = () => {
  const { id } = useParams(); // This is actually the slug based on how we link to it
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const { data } = await axios.get(
          `/api/articles/${id}`
        );
        if (data.success) {
          setArticle(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch article", error);
        setError("Artikel tidak ditemukan");
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <h2 className="text-2xl font-bold text-gray-800">
          {error || "Artikel tidak ditemukan"}
        </h2>
        <Link
          to="/articles"
          className="text-teal-600 hover:text-teal-700 font-semibold flex items-center gap-2"
        >
          <FaArrowLeft /> Kembali ke Daftar Artikel
        </Link>
      </div>
    );
  }

  const shareUrl = window.location.href;
  const shareTitle = article.title;

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`,
    twitter: `https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareTitle}`,
    linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${shareUrl}&title=${shareTitle}`,
    whatsapp: `https://wa.me/?text=${shareTitle} ${shareUrl}`,
  };

  // Helper to get category color (fallback if not stored in DB, or we can just use a default)
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
    <div className="min-h-screen bg-white">
      {/* Hero Image */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative h-[60vh] md:h-[70vh] overflow-hidden"
      >
        <img
          src={article.image}
          alt={article.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

        {/* Back Button */}
        <div className="absolute top-24 left-4 md:left-8 lg:left-16 z-10">
          <Link
            to="/articles"
            className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-full font-semibold outfit hover:bg-white/30 transition-all duration-300 border border-white/30"
          >
            <FaArrowLeft className="w-4 h-4" />
            <span>Kembali</span>
          </Link>
        </div>


        {/* Title Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <span
                className={`${getCategoryColor(
                  article.category
                )} text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg outfit inline-block mb-6`}
              >
                {article.category}
              </span>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 outfit leading-tight">
                {article.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 md:gap-6 text-white/90 text-sm outfit">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center flex-shrink-0">
                    <FaUser className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col">
                    <p className="font-semibold text-white leading-tight">{article.author}</p>
                    <p className="text-xs text-white/70 leading-tight">Penulis</p>
                  </div>
                </div>
                <div className="h-6 w-px bg-white/30 hidden md:block"></div>
                <span className="flex items-center gap-2">
                  <FaCalendarAlt className="w-4 h-4 flex-shrink-0" />
                  <span className="leading-tight">
                    {new Date(article.createdAt).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </span>
                <div className="h-6 w-px bg-white/30 hidden md:block"></div>
                <span className="flex items-center gap-2">
                  <FaClock className="w-4 h-4 flex-shrink-0" />
                  <span className="leading-tight">{article.readTime || "5 menit baca"}</span>
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Article Content */}
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col lg:flex-row items-start gap-12"
        >
          {/* Main Content - Wider */}
          <div className="lg:w-4/5">
            <div
              className="article-content prose prose-lg max-w-none text-gray-700 outfit leading-relaxed"
              dangerouslySetInnerHTML={{ __html: article.content }}
            ></div>

            {/* Share Section */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <p className="text-center text-gray-500 font-semibold mb-4 outfit">
                Bagikan artikel ini:
              </p>
              <div className="flex justify-center gap-4">
                <a
                  href={shareLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition"
                >
                  <FaFacebookF />
                </a>
                <a
                  href={shareLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-sky-500 text-white flex items-center justify-center hover:bg-sky-600 transition"
                >
                  <FaTwitter />
                </a>
                <a
                  href={shareLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-blue-700 text-white flex items-center justify-center hover:bg-blue-800 transition"
                >
                  <FaLinkedinIn />
                </a>
                <a
                  href={shareLinks.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center hover:bg-green-600 transition"
                >
                  <FaWhatsapp />
                </a>
              </div>
            </div>
          </div>

          {/* Sidebar - Smaller */}
          <div className="lg:w-1/5 space-y-8">
            <div className="bg-gradient-to-br from-teal-50 to-cyan-50 p-6 rounded-xl border border-teal-100 sticky top-24 shadow-lg shadow-teal-600/10">
              <h3 className="text-lg font-bold text-gray-900 mb-3 outfit">
                Butuh Bantuan Audio?
              </h3>
              <p className="text-sm text-gray-600 mb-6 outfit">
                Konsultasikan kebutuhan audio mobil Anda dengan teknisi
                berpengalaman kami.
              </p>
              <Link
                to="/booking"
                className="block w-full bg-teal-600 text-white text-center py-3 rounded-lg font-semibold hover:bg-teal-700 transition shadow-lg shadow-teal-600/20"
              >
                Booking Sekarang
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ArticleDetail;
