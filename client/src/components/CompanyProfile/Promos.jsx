import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useUser, SignInButton } from "@clerk/clerk-react";
import { FaPercent, FaCalendarAlt, FaTag, FaArrowRight, FaLock } from "react-icons/fa";
import { sparepartsAPI, servicesAPI } from "../../utils/api";
import { formatCurrency } from "../../utils/payment";

const Promos = () => {
  const { isSignedIn, isLoaded } = useUser();
  const [promos, setPromos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      loadPromos();
    } else if (isLoaded) {
      setLoading(false);
    }
  }, [isLoaded, isSignedIn]);

  const loadPromos = async () => {
    try {
      setLoading(true);

      // Fetch spareparts and services with discounts
      const [sparepartsRes, servicesRes] = await Promise.all([
        sparepartsAPI.getAll(),
        servicesAPI.getAll()
      ]);

      const spareparts = sparepartsRes.data || [];
      const services = servicesRes.data || [];

      // Filter items with discounts
      const sparepartsWithDiscount = spareparts
        .filter(item => item.discount > 0 && item.isAvailable)
        .map(item => ({
          id: `sparepart-${item._id}`,
          type: 'sparepart',
          itemId: item._id,
          name: item.name,
          discount: item.discount,
          price: item.price,
          originalPrice: item.price,
          finalPrice: item.price * (1 - item.discount / 100),
          description: item.description || `${item.brand} - ${item.category}`,
          image: item.images?.[0] || null,
          category: item.category,
          brand: item.brand,
        }));

      const servicesWithDiscount = services
        .filter(item => item.discount > 0 && item.isAvailable)
        .map(item => ({
          id: `service-${item._id}`,
          type: 'service',
          itemId: item._id,
          name: item.name,
          discount: item.discount,
          price: item.price,
          originalPrice: item.price,
          finalPrice: item.price * (1 - item.discount / 100),
          description: item.description || item.category,
          image: item.images?.[0] || null,
          category: item.category,
          duration: item.estimatedDuration,
        }));

      // Combine and sort by discount (highest first)
      const allPromos = [...sparepartsWithDiscount, ...servicesWithDiscount]
        .sort((a, b) => b.discount - a.discount)
        .slice(0, 8); // Limit to 8 items

      setPromos(allPromos);
    } catch (error) {
      console.error('Error loading promos:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPromoColor = (discount) => {
    if (discount >= 30) return "from-red-500 to-pink-600";
    if (discount >= 20) return "from-orange-500 to-amber-600";
    if (discount >= 10) return "from-teal-500 to-emerald-600";
    return "from-blue-500 to-cyan-600";
  };

  const getPromoBadge = (discount) => {
    if (discount >= 30) return "Super Hemat!";
    if (discount >= 20) return "Promo Spesial";
    if (discount >= 10) return "Harga Terbaik";
    return "Diskon";
  };

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
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  // Loading State
  if (!isLoaded || loading) {
    return (
      <section id="promos" className="pt-12 pb-12 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4 md:px-8 lg:px-16">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
            <p className="mt-4 text-gray-500">Memuat promo...</p>
          </div>
        </div>
      </section>
    );
  }

  // Not Logged In State
  if (!isSignedIn) {
    return (
      <section id="promos" className="pt-12 pb-12 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4 md:px-8 lg:px-16">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 outfit">
              Penawaran Khusus & Promo
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-teal-500 to-emerald-600 mx-auto mb-6"></div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto bg-white rounded-3xl shadow-xl p-12 text-center border-2 border-teal-100"
          >
            <div className="w-20 h-20 bg-gradient-to-br from-teal-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaLock className="w-10 h-10 text-teal-600" />
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 outfit">
              Login untuk Melihat Promo
            </h3>
            <p className="text-lg text-gray-600 mb-8 outfit">
              Dapatkan akses ke penawaran eksklusif dan diskon spesial untuk sparepart audio dan layanan bengkel kami.
            </p>
            <SignInButton mode="modal">
              <button className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-xl font-bold text-lg outfit hover:shadow-xl transition-all duration-300 hover:scale-105">
                <FaLock className="w-5 h-5" />
                <span>Login Sekarang</span>
              </button>
            </SignInButton>
          </motion.div>
        </div>
      </section>
    );
  }

  // No Promos Available State
  if (promos.length === 0) {
    return (
      <section id="promos" className="pt-12 pb-12 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4 md:px-8 lg:px-16">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 outfit">
              Penawaran Khusus & Promo
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-teal-500 to-emerald-600 mx-auto mb-6"></div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto bg-gradient-to-br from-teal-50 to-emerald-50 rounded-3xl shadow-lg p-12 text-center border border-teal-200"
          >
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-md">
              <FaTag className="w-10 h-10 text-teal-600" />
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 outfit">
              Belum Ada Promo Saat Ini
            </h3>
            <p className="text-lg text-gray-700 mb-6 outfit">
              Kami sedang menyiapkan penawaran menarik untuk Anda. Tunggu promo spesial kami selanjutnya!
            </p>
            <p className="text-sm text-gray-600 outfit">
              💡 <strong>Tips:</strong> Bookmark halaman ini dan kunjungi kembali untuk mendapatkan penawaran terbaik.
            </p>
            <div className="mt-8">
              <Link
                to="/spareparts"
                className="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 text-white rounded-xl font-bold outfit hover:bg-teal-700 transition-all duration-300 hover:shadow-lg"
              >
                Lihat Semua Produk
                <FaArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    );
  }

  // Promos Available - Display Them
  return (
    <section
      id="promos"
      className="pt-12 pb-12 bg-gradient-to-b from-white to-gray-50"
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
            Penawaran Khusus & Promo
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-teal-500 to-emerald-600 mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto outfit">
            Dapatkan diskon spesial untuk sparepart audio dan layanan bengkel terbaik kami.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-8"
        >
          {promos.map((promo) => {
            const color = getPromoColor(promo.discount);
            const badge = getPromoBadge(promo.discount);
            const linkTo = promo.type === 'sparepart'
              ? `/spareparts/${promo.itemId}`
              : `/services`;

            return (
              <motion.div
                key={promo.id}
                variants={itemVariants}
                className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 w-full md:w-[calc(50%-1rem)] lg:w-[calc(25%-1.5rem)] max-w-sm"
              >
                {/* Badge */}
                <div className="absolute top-4 right-4 z-10">
                  <span
                    className={`bg-gradient-to-r ${color} text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg outfit uppercase tracking-wider`}
                  >
                    {badge}
                  </span>
                </div>

                {/* Image */}
                <div className="relative h-56 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
                  {promo.image ? (
                    <img
                      src={promo.image}
                      alt={promo.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FaTag className="w-16 h-16 text-gray-300" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

                  {/* Discount Badge on Image */}
                  <div className="absolute bottom-4 left-4">
                    <div
                      className={`bg-gradient-to-r ${color} text-white px-5 py-2.5 rounded-xl shadow-xl`}
                    >
                      <p className="text-2xl font-bold outfit">-{promo.discount}%</p>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                  {/* Category Badge */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-teal-600 uppercase tracking-wider outfit">
                      {promo.type === 'sparepart' ? promo.category : 'Layanan'}
                    </span>
                    {promo.brand && (
                      <>
                        <span className="text-gray-300">•</span>
                        <span className="text-xs text-gray-500 outfit">{promo.brand}</span>
                      </>
                    )}
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 outfit group-hover:text-teal-600 transition-colors duration-300 line-clamp-2 leading-tight">
                    {promo.name}
                  </h3>

                  <p className="text-sm text-gray-600 outfit leading-relaxed line-clamp-2">
                    {promo.description}
                  </p>

                  {/* Pricing */}
                  <div className="pt-3 border-t border-gray-100">
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="text-sm text-gray-400 line-through outfit">
                        {formatCurrency(promo.originalPrice)}
                      </span>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-teal-600 outfit">
                        {formatCurrency(promo.finalPrice)}
                      </span>
                      <span className="text-sm text-gray-500 outfit">
                        Hemat {formatCurrency(promo.originalPrice - promo.finalPrice)}
                      </span>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <Link
                    to={linkTo}
                    className={`w-full flex items-center justify-center gap-2 bg-gradient-to-r ${color} text-white py-3 rounded-xl font-bold outfit hover:shadow-xl transition-all duration-300 group-hover:scale-105`}
                  >
                    <span>Lihat Detail</span>
                    <FaArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Bottom Info Banner */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-16 bg-gradient-to-r from-teal-600 via-emerald-600 to-teal-700 rounded-3xl p-8 md:p-12 text-white text-center relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>

          <div className="relative z-10">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <FaPercent className="w-8 h-8 text-white" />
              </div>
            </div>
            <h3 className="text-3xl md:text-4xl font-bold mb-4 outfit">
              Jangan Lewatkan Promo Terbatas!
            </h3>
            <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto outfit">
              Promo dapat berubah sewaktu-waktu. Segera pesan sebelum penawaran berakhir!
            </p>
            <Link
              to="/booking"
              className="inline-flex items-center gap-3 bg-white text-teal-700 px-8 py-4 rounded-xl font-bold text-lg outfit hover:bg-gray-100 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105"
            >
              <FaTag className="w-5 h-5" />
              <span>Booking Sekarang</span>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Promos;
