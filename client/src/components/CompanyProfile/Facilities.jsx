import React from "react";
import { motion } from "framer-motion";
import {
  FaTools,
  FaVolumeUp,
  FaShieldAlt,
  FaBox,
  FaSlidersH,
  FaCamera,
  FaCar,
  FaComments,
  FaArrowRight
} from "react-icons/fa";

const Facilities = () => {
  const facilities = [
    {
      icon: <FaTools className="w-8 h-8" />,
      title: "Pemasangan Audio Mobil",
      description:
        "Pemasangan head unit, speaker, subwoofer, dan power dengan instalasi rapi & profesional."
    },
    {
      icon: <FaVolumeUp className="w-8 h-8" />,
      title: "Upgrade Sistem Audio",
      description:
        "Upgrade kualitas suara kendaraan Anda dengan tuning profesional dan perangkat premium."
    },
    {
      icon: <FaShieldAlt className="w-8 h-8" />,
      title: "Peredam Suara",
      description:
        "Pemasangan peredam pintu, lantai, dan bagasi untuk suara lebih solid dan bebas noise."
    },
    {
      icon: <FaBox className="w-8 h-8" />,
      title: "Custom Box Subwoofer",
      description:
        "Pembuatan box custom sesuai ukuran bagasi dan karakter suara yang diinginkan."
    },
    {
      icon: <FaSlidersH className="w-8 h-8" />,
      title: "Tuning & Setting Audio",
      description:
        "Proses tuning untuk mendapatkan staging, imaging, dan kejernihan suara maksimal."
    },
    {
      icon: <FaCamera className="w-8 h-8" />,
      title: "Instalasi Kamera",
      description:
        "Pemasangan kamera mundur dan kamera 360 untuk kenyamanan berkendara."
    },
    {
      icon: <FaCar className="w-8 h-8" />,
      title: "Aksesoris Mobil",
      description:
        "Tersedia berbagai aksesoris interior & eksterior yang dapat dipasang langsung di tempat."
    },
    {
      icon: <FaComments className="w-8 h-8" />,
      title: "Konsultasi Audio Gratis",
      description:
        "Butuh rekomendasi? Kami bantu pilihkan perangkat paling cocok sesuai kebutuhan dan budget."
    }
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
    <section id="facilities" className="pt-12 pb-12 bg-gray-50">
      <div className="container mx-auto px-4 md:px-8 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Layanan & Fasilitas Kami
          </h2>
          <div className="w-24 h-1 bg-teal-600 mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Semua yang dibutuhkan kendaraan Anda untuk kinerja yang andal dan optimal.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {facilities.map((facility, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group"
            >
              <div className="w-16 h-16 bg-teal-100 rounded-lg flex items-center justify-center text-teal-600 mb-6 group-hover:bg-teal-600 group-hover:text-white transition-colors duration-300">
                {facility.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {facility.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {facility.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Additional Info Banner */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-16 bg-gradient-to-r from-teal-600 to-emerald-800 rounded-2xl p-8 md:p-12 text-white text-center"
        >
          <h3 className="text-3xl font-bold mb-4">Butuh Informasi Lebih Lanjut ?</h3>
          <p className="text-teal-100 mb-8 max-w-2xl mx-auto">
            Tim kami siap membantu Anda mendapatkan kualitas audio mobil terbaik.
            Hubungi kami untuk konsultasi, pemasangan, atau layanan tambahan.
          </p>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 bg-white text-teal-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-300 shadow-lg"
          >
            Hubungi Kami
            <FaArrowRight className="w-4 h-4" />
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default Facilities;
