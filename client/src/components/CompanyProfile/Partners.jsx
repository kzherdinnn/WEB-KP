import React from "react";
import { motion } from "framer-motion";

const Partners = () => {
  // Logo mitra - ganti dengan URL logo yang sebenarnya
  const partners = [
    {
      id: 1,
      name: "Osram",
      logo: "https://res.cloudinary.com/dphondhvc/image/upload/v1763538427/osram-logo_h1f1bf.png",
    },
    {
      id: 2,
      name: "Sony",
      logo: "https://res.cloudinary.com/dphondhvc/image/upload/v1763538426/Tidak_dipastikan_53020_xextiy.png",
    },
    {
      id: 3,
      name: "JBL",
      logo: "https://res.cloudinary.com/dphondhvc/image/upload/v1763538426/JBL-Emblema_cdcpfv.png",
    },
    {
      id: 4,
      name: "3M Automotive",
      logo: "https://res.cloudinary.com/dphondhvc/image/upload/v1763538426/3M-Emblem_fn4fww.png",
    },
    {
      id: 5,
      name: "Pioneer",
      logo: "https://res.cloudinary.com/dphondhvc/image/upload/v1763538426/Pioneer-Logo-PNG-Transparent_bmgg6u.png",
    },
    {
      id: 6,
      name: "Venom",
      logo: "https://res.cloudinary.com/dphondhvc/image/upload/v1763614615/download_7_u2wklr.png",
    },
    {
      id: 7,
      name: "Alphine",
      logo: "https://res.cloudinary.com/dphondhvc/image/upload/v1763538426/Alpine-Logo_c2j4fv.png",
    },
    {
      id: 8,
      name: "Audison",
      logo: "https://res.cloudinary.com/dphondhvc/image/upload/v1763614791/download_8_t69uzm.png",
    },
    {
      id: 9,
      name: "Focal",
      logo: "https://res.cloudinary.com/dphondhvc/image/upload/v1763615277/download__10_-removebg-preview_biiigk.png",
    },
    {
      id: 10,
      name: "Kennwood",
      logo: "https://res.cloudinary.com/dphondhvc/image/upload/v1763615277/download__11_-removebg-preview_vx3syl.png",
    },
  ];

  // Gandakan daftar mitra untuk efek gulir tanpa batas
  const duplicatedPartners = [...partners, ...partners];

  return (
    <section id="partners" className="py-12 bg-white border-y border-gray-200">
      <div className="container mx-auto px-4 md:px-8 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 playfair">
            Mitra Bengkel & Penyedia Sparepart Audio Mobil
          </h3>
          <p className="text-gray-600 outfit">
            Bekerja sama dengan bengkel dan penyedia sparepart audio mobil
            terkemuka
          </p>
        </motion.div>

        {/* Infinite Scrolling Container */}
        <div className="relative overflow-hidden">
          {/* Gradient Overlays */}
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white to-transparent z-10"></div>
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white to-transparent z-10"></div>

          {/* Scrolling Logos */}
          <motion.div
            className="flex gap-12 items-center"
            animate={{
              x: [0, -100 * partners.length],
            }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 20,
                ease: "linear",
              },
            }}
          >
            {duplicatedPartners.map((partner, index) => (
              <div
                key={`${partner.id}-${index}`}
                className="flex-shrink-0 w-32 h-20 flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-300"
              >
                <img
                  src={partner.logo}
                  alt={partner.name}
                  className="max-w-full max-h-full object-contain opacity-60 hover:opacity-100 transition-opacity duration-300"
                  loading="lazy"
                />
              </div>
            ))}
          </motion.div>
        </div>

        {/* Opsional: Statistik atau CTA di bawah */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <p className="text-sm text-gray-500 outfit">
            Dipercaya oleh lebih dari <span className="font-bold text-blue-600">50.000+</span> pelanggan
            audio mobil di seluruh Indonesia
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Partners;
