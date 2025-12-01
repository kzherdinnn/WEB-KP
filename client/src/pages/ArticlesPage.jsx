import React from "react";
import { motion } from "framer-motion";
import { FaCalendarAlt, FaClock, FaUser, FaArrowLeft } from "react-icons/fa";

const ArticlesPage = () => {
  const articles = [
    {
      id: 1,
      title: "Panduan Memilih Speaker Mobil yang Tepat",
      excerpt:
        "Pelajari perbedaan tipe speaker, ukuran, dan spesifikasi yang cocok untuk mobil Anda agar mendapatkan kualitas suara optimal.",
      image:
        "https://ik.imagekit.io/dzlzhxcdo/Article1(2).png",
      author: "Aan Audio",
      date: "15 Des 2024",
      readTime: "5 menit baca",
      category: "Tips Audio",
      categoryColor: "bg-teal-500",
    },
    {
      id: 2,
      title: "Cara Kalibrasi Subwoofer untuk Bass yang Seimbang",
      excerpt:
        "Panduan langkah demi langkah untuk mengatur level, fase, dan frekuensi crossover sehingga bass terdengar kuat namun tidak mengganggu.",
      image:
        "https://ik.imagekit.io/dzlzhxcdo/Article2.png",
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
        "https://ik.imagekit.io/dzlzhxcdo/Head-Unit-04_uwxb4b.jpg?updatedAt=1763701230737",
      author: "M. Hadi",
      date: "22 Feb 2025",
      readTime: "6 menit baca",
      category: "Modifikasi",
      categoryColor: "bg-cyan-500",
    },
    {
      id: 4,
      title: "Merawat Sistem Audio: Tips Perawatan Berkala",
      excerpt:
        "Langkah sederhana untuk merawat kabel, konektor, dan komponen audio agar umur perangkat lebih panjang dan performa tetap stabil.",
      image:
        "https://ik.imagekit.io/dzlzhxcdo/Article3.png",
      author: "Rina Putri",
      date: "05 Mar 2025",
      readTime: "6 menit baca",
      category: "Perawatan",
      categoryColor: "bg-green-500",
    },
    {
      id: 5,
      title: "Pilihan Subwoofer untuk Ruang Kabin Kecil",
      excerpt:
        "Rekomendasi subwoofer yang cocok untuk mobil dengan kabin kecil dan tips penempatan agar tidak mengorbankan kenyamanan.",
      image:
        "https://ik.imagekit.io/dzlzhxcdo/Article4(1).png",
      author: "Aan Audio",
      date: "18 Mar 2025",
      readTime: "8 menit baca",
      category: "Tips Audio",
      categoryColor: "bg-teal-600",
    },
    {
      id: 6,
      title: "Panduan Pemasangan Alarm Mobil yang Aman",
      excerpt:
        "Langkah instalasi alarm dasar dan fitur keamanan tambahan yang direkomendasikan untuk meningkatkan perlindungan kendaraan.",
      image:
        "https://ik.imagekit.io/dzlzhxcdo/Article6.png.jpg",
      author: "Joko Wirawan",
      date: "28 Mar 2025",
      readTime: "6 menit baca",
      category: "Keamanan",
      categoryColor: "bg-amber-500",
    },
    {
      id: 7,
      title: "Tips Mengatur Equalizer untuk Suara Jernih",
      excerpt:
        "Cara menyetel equalizer untuk berbagai genre musik sehingga suara vokal dan instrumen seimbang.",
      image:
        "https://ik.imagekit.io/dzlzhxcdo/Article7.png",
      author: "Dewi S",
      date: "02 Apr 2025",
      readTime: "5 menit baca",
      category: "Modifikasi",
      categoryColor: "bg-cyan-600",
    },
    {
      id: 8,
      title: "Rekomendasi Aksesoris untuk Audio Mobil",
      excerpt:
        "Daftar aksesoris penting seperti kabel bermutu, isolator, dan peredam suara untuk meningkatkan kualitas instalasi.",
      image:
        "https://ik.imagekit.io/dzlzhxcdo/Article8(2).png",
      author: "Aan Audio",
      date: "12 Apr 2025",
      readTime: "4 menit baca",
      category: "Tips",
      categoryColor: "bg-emerald-600",
    },
    {
      id: 9,
      title: "Rencana Modifikasi Audio untuk Anggaran Terbatas",
      excerpt:
        "Ide dan prioritas upgrade audio yang memberikan peningkatan kualitas suara terbaik tanpa menguras anggaran.",
      image:
        "https://ik.imagekit.io/dzlzhxcdo/Article9.png",
      author: "Arif Setiawan",
      date: "20 Apr 2025",
      readTime: "9 menit baca",
      category: "Modifikasi",
      categoryColor: "bg-cyan-700",
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
            Artikel & Panduan Audio Mobil
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-teal-500 to-emerald-600 mx-auto mb-6"></div>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto outfit">
            Tips pemasangan, panduan produk, dan inspirasi modifikasi audio mobil dari para ahli kami
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
