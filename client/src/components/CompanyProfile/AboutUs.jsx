import React from "react";
import { motion } from "framer-motion";
import { FaCheck, FaArrowRight } from "react-icons/fa";

const AboutUs = () => {
  return (
    <section id="about" className="py-8 bg-white">
      <div className="container mx-auto px-4 md:px-8 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2 outfit">
            Aan Audio Solutions
          </h2>
          <div className="w-24 h-1 bg-teal-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto outfit">
            Bengkel audio mobil — pemasangan, tuning, dan perbaikan sistem audio kendaraan
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-16 items-center">
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
                src="https://ik.imagekit.io/dzlzhxcdo/WhatsApp_Image_2025-11-12_at_13.48.51_dd74069b_d3gxbj.jpg?updatedAt=1763701230685"
                alt="Contoh pemasangan audio mobil"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            </div>
            {/* Floating Card */}
            <div className="absolute -bottom-8 -right-8 bg-white p-6 rounded-lg shadow-xl border border-gray-100">
              <div className="flex items-center gap-8">
                <div className="text-center">
                  <p className="text-4xl font-bold text-teal-600 outfit">26+</p>
                  <p className="text-sm text-gray-600 outfit">
                    Tahun Pengalaman
                  </p>
                </div>
                <div className="h-16 w-px bg-gray-300"></div>
                <div className="text-center">
                  <p className="text-4xl font-bold text-teal-600 outfit">
                    1k+
                  </p>
                  <p className="text-sm text-gray-600 outfit">Pelanggan Puas</p>
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
            className="space-y-4"
          >
            <h3 className="text-3xl font-bold text-gray-900 outfit">
              Selamat Datang di Aan Audio Solutions
            </h3>
            <p className="text-gray-600 leading-relaxed outfit">
              Aan Audio Solutions adalah bengkel audio mobil profesional yang
              mengkhususkan diri pada pemasangan, tuning, dan perbaikan sistem
              audio kendaraan. Kami mengutamakan kualitas suara, keamanan, dan
              kepuasan pelanggan.
            </p>
            <p className="text-gray-600 leading-relaxed outfit">
              Terletak strategis dengan akses mudah, tim teknisi kami siap
              membantu mulai dari pemasangan speaker dan head unit hingga
              kalibrasi akhir untuk pengalaman audio terbaik di jalan.
            </p>

            {/* Features List */}
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-teal-100 flex items-center justify-center mt-1">
                  <FaCheck className="w-3 h-3 text-teal-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 outfit">
                    Pemasangan Profesional
                  </p>
                  <p className="text-sm text-gray-600 outfit">
                    Instalasi sistem audio kendaraan
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-teal-100 flex items-center justify-center mt-1">
                  <FaCheck className="w-3 h-3 text-teal-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 outfit">
                    Tuning & Kalibrasi
                  </p>
                  <p className="text-sm text-gray-600 outfit">
                    Optimasi suara sesuai kendaraan
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-teal-100 flex items-center justify-center mt-1">
                  <FaCheck className="w-3 h-3 text-teal-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 outfit">
                    Speaker Berkualitas
                  </p>
                  <p className="text-sm text-gray-600 outfit">
                    Produk dan merek teruji
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-teal-100 flex items-center justify-center mt-1">
                  <FaCheck className="w-3 h-3 text-teal-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 outfit">
                    Layanan Purna Jual
                  </p>
                  <p className="text-sm text-gray-600 outfit">
                    Garansi & servis berkala
                  </p>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <div className="pt-4">
              <a
                href="#contact"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-teal-600 to-emerald-600 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-teal-500/30 transition-all duration-300 hover:-translate-y-1 outfit"
              >
                Hubungi Kami
                <FaArrowRight className="w-4 h-4" />
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
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 pt-8 border-t border-gray-200"
        >
          <div className="text-center">
            <p className="text-4xl font-bold text-teal-600 mb-2 outfit">1k+</p>
            <p className="text-gray-600 outfit">Pemasangan Selesai</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold text-teal-600 mb-2 outfit">5+</p>
            <p className="text-gray-600 outfit">Teknisi Berpengalaman</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold text-teal-600 mb-2 outfit">98%</p>
            <p className="text-gray-600 outfit">Kepuasan Pelanggan</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold text-teal-600 mb-2 outfit">5+</p>
            <p className="text-gray-600 outfit">Penghargaan</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutUs;
