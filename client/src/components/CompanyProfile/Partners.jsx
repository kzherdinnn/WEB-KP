import React from "react";
import { motion } from "framer-motion";

const Partners = () => {
  // Partner logos - replace with actual logo URLs
  const partners = [
    {
      id: 1,
      name: "Venom",
      logo: "https://ik.imagekit.io/dzlzhxcdo/download_7_u2wklr.png?updatedAt=1763701230924",
    },
    {
      id: 2,
      name: "Sony",
      logo: "https://ik.imagekit.io/dzlzhxcdo/Tidak_dipastikan_53020_xextiy.png?updatedAt=1763701230874",
    },
    {
      id: 3,
      name: "Audison",
      logo: "https://ik.imagekit.io/dzlzhxcdo/download_8_t69uzm.png?updatedAt=1763701230815",
    },
    {
      id: 4,
      name: "Kenwood",
      logo: "https://ik.imagekit.io/dzlzhxcdo/download__11_-removebg-preview_vx3syl.png?updatedAt=1763701230744",
    },
    {
      id: 5,
      name: "3M",
      logo: "https://ik.imagekit.io/dzlzhxcdo/3M-Emblem_fn4fww.png?updatedAt=1763701230963",
    },
    {
      id: 6,
      name: "Pioneer",
      logo: "https://ik.imagekit.io/dzlzhxcdo/Pioneer-Logo-PNG-Transparent_bmgg6u.png?updatedAt=1763701230743",
    },
    {
      id: 7,
      name: "Focal",
      logo: "https://ik.imagekit.io/dzlzhxcdo/download__10_-removebg-preview_biiigk.png?updatedAt=1763701230692",
    },
    {
      id: 8,
      name: "JBL",
      logo: "https://ik.imagekit.io/dzlzhxcdo/JBL-Emblema_cdcpfv.png?updatedAt=1763701230843",
    },
    {
      id: 9,
      name: "Osram",
      logo: "https://ik.imagekit.io/dzlzhxcdo/osram-logo_h1f1bf.png?updatedAt=1763701230663",
    },
    {
      id: 10,
      name: "Alpine",
      logo: "https://ik.imagekit.io/dzlzhxcdo/Alpine-Logo_c2j4fv.png?updatedAt=1763701230866",
    },
  ];

  // Duplicate partners for seamless infinite scroll
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
            Partner Terpercaya Kami
          </h3>
          <p className="text-gray-600 outfit">
            Bermitra dengan brand audio mobil terkemuka di dunia
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

        {/* Optional: Stats or CTA below */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <p className="text-sm text-gray-500 outfit">
            Dipercaya oleh lebih dari{" "}
            <span className="font-bold text-blue-600">1000+</span> penggemar audio mobil
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Partners;
