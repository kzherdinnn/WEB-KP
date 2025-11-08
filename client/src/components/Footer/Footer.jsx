import React from "react";
import { motion } from "framer-motion";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaArrowRight,
} from "react-icons/fa";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    company: [
      { name: "Tentang Kami", path: "/#about" },
      { name: "Kamar & Harga", path: "/hotels" },
      { name: "Promo Special", path: "/#promos" },
      { name: "Galeri", path: "/#gallery" },
      { name: "Artikel", path: "/articles" },
    ],
    support: [
      { name: "Pusat Bantuan", path: "#" },
      { name: "Syarat & Ketentuan", path: "#" },
      { name: "Kebijakan Privasi", path: "#" },
      { name: "FAQ", path: "#" },
      { name: "Hubungi Kami", path: "/#contact" },
    ],
    services: [
      { name: "Reservasi Online", path: "/hotels" },
      { name: "Pembayaran Aman", path: "#" },
      { name: "Fasilitas Hotel", path: "/#facilities" },
      { name: "Paket Wisata", path: "/#promos" },
      { name: "Layanan Pelanggan 24/7", path: "/#contact" },
    ],
  };

  const socialLinks = [
    {
      name: "Facebook",
      icon: <FaFacebookF />,
      url: "https://facebook.com",
      color: "hover:bg-blue-600",
    },
    {
      name: "Twitter",
      icon: <FaTwitter />,
      url: "https://twitter.com",
      color: "hover:bg-sky-500",
    },
    {
      name: "Instagram",
      icon: <FaInstagram />,
      url: "https://instagram.com",
      color: "hover:bg-pink-600",
    },
    {
      name: "LinkedIn",
      icon: <FaLinkedinIn />,
      url: "https://linkedin.com",
      color: "hover:bg-blue-700",
    },
    {
      name: "YouTube",
      icon: <FaYoutube />,
      url: "https://youtube.com",
      color: "hover:bg-red-600",
    },
  ];

  const contactInfo = [
    {
      icon: <FaMapMarkerAlt />,
      text: "Jl. Hotel Mewah No. 123, Jakarta 12345",
    },
    {
      icon: <FaPhone />,
      text: "+62 21 1234 5678",
    },
    {
      icon: <FaEnvelope />,
      text: "info@stayza.com",
    },
  ];

  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"></div>

      <div className="relative z-10">
        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 pt-16 pb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
            {/* Brand Column */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-teal-400 to-emerald-400 rounded-full blur-lg opacity-50"></div>
                    <img
                      src="/favicon.svg"
                      alt="StayZa Logo"
                      className="h-12 relative z-10"
                    />
                  </div>
                  <span className="text-3xl font-bold outfit bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent">
                    StayZa
                  </span>
                </div>

                <p className="text-gray-400 mb-6 leading-relaxed outfit">
                  Pengalaman menginap terbaik dengan layanan premium dan
                  fasilitas modern. Temukan kenyamanan yang Anda cari bersama
                  kami.
                </p>

                {/* Contact Info */}
                <div className="space-y-3">
                  {contactInfo.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 text-gray-400 hover:text-teal-400 transition-colors duration-300 group"
                    >
                      <div className="w-5 h-5 mt-0.5 text-teal-400 group-hover:scale-110 transition-transform duration-300">
                        {item.icon}
                      </div>
                      <span className="text-sm outfit">{item.text}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Company Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <h3 className="text-lg font-bold mb-6 outfit">Perusahaan</h3>
              <ul className="space-y-3">
                {footerLinks.company.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.path}
                      className="text-gray-400 hover:text-teal-400 transition-colors duration-300 text-sm outfit flex items-center gap-2 group"
                    >
                      <span className="w-0 group-hover:w-2 h-0.5 bg-teal-400 transition-all duration-300"></span>
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Support Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h3 className="text-lg font-bold mb-6 outfit">Dukungan</h3>
              <ul className="space-y-3">
                {footerLinks.support.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.path}
                      className="text-gray-400 hover:text-teal-400 transition-colors duration-300 text-sm outfit flex items-center gap-2 group"
                    >
                      <span className="w-0 group-hover:w-2 h-0.5 bg-teal-400 transition-all duration-300"></span>
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Services Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <h3 className="text-lg font-bold mb-6 outfit">Layanan</h3>
              <ul className="space-y-3">
                {footerLinks.services.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.path}
                      className="text-gray-400 hover:text-teal-400 transition-colors duration-300 text-sm outfit flex items-center gap-2 group"
                    >
                      <span className="w-0 group-hover:w-2 h-0.5 bg-teal-400 transition-all duration-300"></span>
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Newsletter Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-teal-600/20 to-emerald-600/20 backdrop-blur-sm border border-teal-500/20 rounded-2xl p-8 mb-12"
          >
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-bold mb-2 outfit">
                  Dapatkan Penawaran Terbaik
                </h3>
                <p className="text-gray-400 outfit">
                  Berlangganan newsletter kami untuk mendapatkan promo eksklusif
                  dan update terbaru.
                </p>
              </div>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Masukkan email Anda"
                  className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 transition-all duration-300 outfit backdrop-blur-sm"
                />
                <button className="bg-gradient-to-r from-teal-600 to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold outfit hover:from-teal-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-2xl hover:scale-105 flex items-center gap-2 group">
                  <span>Subscribe</span>
                  <FaArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                </button>
              </div>
            </div>
          </motion.div>

          {/* Social Media & Bottom Bar */}
          <div className="border-t border-gray-700/50 pt-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              {/* Social Media Links */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                viewport={{ once: true }}
                className="flex items-center gap-4"
              >
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:text-white transition-all duration-300 ${social.color} hover:scale-110 hover:shadow-lg`}
                    aria-label={social.name}
                  >
                    <span className="text-lg">{social.icon}</span>
                  </a>
                ))}
              </motion.div>

              {/* Copyright */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                viewport={{ once: true }}
                className="text-center md:text-right"
              >
                <p className="text-gray-400 text-sm outfit">
                  © {currentYear} StayZa. All rights reserved.
                </p>
                <p className="text-gray-500 text-xs mt-1 outfit">
                  Made with ❤️ in Indonesia
                </p>
              </motion.div>
            </div>
          </div>

          {/* Additional Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            viewport={{ once: true }}
            className="flex flex-wrap justify-center gap-6 mt-6 pt-6 border-t border-gray-700/50"
          >
            <a
              href="#"
              className="text-gray-400 hover:text-teal-400 text-sm outfit transition-colors duration-300"
            >
              Kebijakan Privasi
            </a>
            <span className="text-gray-700">•</span>
            <a
              href="#"
              className="text-gray-400 hover:text-teal-400 text-sm outfit transition-colors duration-300"
            >
              Syarat & Ketentuan
            </a>
            <span className="text-gray-700">•</span>
            <a
              href="#"
              className="text-gray-400 hover:text-teal-400 text-sm outfit transition-colors duration-300"
            >
              Sitemap
            </a>
            <span className="text-gray-700">•</span>
            <a
              href="#"
              className="text-gray-400 hover:text-teal-400 text-sm outfit transition-colors duration-300"
            >
              Aksesibilitas
            </a>
          </motion.div>
        </div>
      </div>

      {/* Bottom Gradient Line */}
      <div className="h-1 bg-gradient-to-r from-teal-600 via-emerald-500 to-teal-600"></div>
    </footer>
  );
};

export default Footer;
