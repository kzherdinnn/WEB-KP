import React from "react";
import { motion } from "framer-motion";
import { FaCalendarAlt, FaClock, FaUser, FaArrowRight } from "react-icons/fa";

const Articles = () => {
  const articles = [
    {
      id: 1,
      title: "Panduan Memilih Speaker Mobil yang Tepat",
      excerpt:
        "Pelajari perbedaan tipe speaker, ukuran, dan spesifikasi yang cocok untuk mobil Anda agar mendapatkan kualitas suara optimal.",
      image:
        "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=600&h=400&fit=crop",
      author: "Aan Audio",
      date: "15 Des 2024",
      readTime: "5 menit baca",
      category: "Tips Audio",
      categoryColor: "bg-blue-500",
    },
    {
      id: 2,
      title: "Cara Kalibrasi Subwoofer untuk Bass yang Seimbang",
      excerpt:
        "Panduan langkah demi langkah untuk mengatur level, fase, dan frekuensi crossover sehingga bass terdengar kuat namun tidak mengganggu.",
      image:
        "https://images.unsplash.com/photo-1497294815431-9365093b7331?w=600&h=400&fit=crop",
      author: "Teknisi Aan",
      date: "10 Jan 2025",
      readTime: "7 menit baca",
      category: "Perawatan",
      categoryColor: "bg-emerald-500",
    },
    {
      id: 3,
      title: "Upgrade Head Unit: Fitur, Kompatibilitas, dan Tips Pemasangan",
      excerpt:
        "Panduan memilih head unit yang kompatibel dengan mobil Anda, fitur penting yang perlu dicari, dan tips pemasangan aman.",
      image:
        "https://images.unsplash.com/photo-1518544889020-3c6c37b8c8f0?w=600&h=400&fit=crop",
      author: "M. Hadi",
      date: "22 Feb 2025",
      readTime: "6 menit baca",
      category: "Modifikasi",
      categoryColor: "bg-purple-500",
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
    <section
      id="articles"
      className="pt-12 pb-12 bg-gradient-to-b from-gray-50 to-white"
    >
      <div className="container mx-auto px-4 md:px-8 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 outfit">
            Artikel & Panduan Audio Mobil
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto outfit">
            Tips pemasangan, panduan pemilihan komponen, dan inspirasi modifikasi
            audio mobil dari para ahli kami
          </p>
        </motion.div>

        {/* Article Grid - Show only 3 articles */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12"
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
                    <FaArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Selengkapnya Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <a
            href="/articles"
            className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-10 py-4 rounded-xl font-semibold text-lg outfit hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
          >
            <span>Selengkapnya</span>
            <FaArrowRight className="w-5 h-5" />
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default Articles;
