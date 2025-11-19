import React from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
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
  const { id } = useParams();

  // Sample article data (in real app, fetch from API based on id)
  const articles = {
    1: {
      id: 1,
      title: "Panduan Memilih Speaker Mobil yang Tepat",
      image:
        "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=1200&h=600&fit=crop",
      author: "Aan Audio",
      authorBio: "Spesialis Audio Mobil di Aan Audio Solutions",
      date: "15 Des 2024",
      readTime: "6 menit baca",
      category: "Tips Audio",
      categoryColor: "bg-blue-500",
      content: `
        <p class="mb-6">Memilih speaker mobil yang tepat adalah langkah pertama untuk mendapatkan kualitas suara yang memuaskan. Artikel ini membahas perbedaan tipe speaker, ukuran, sensitivitas, dan hal-hal penting lainnya sebelum membeli.</p>

        <h2 class="text-2xl font-bold text-gray-900 mb-4 mt-8">Tipe Speaker: Coaxial vs Component</h2>
        <p class="mb-6">Speaker coaxial (full-range) praktis dan hemat ruang, sedangkan component speaker menawarkan kualitas suara lebih baik karena memiliki tweeter dan woofer terpisah. Pilih component jika Anda mengutamakan kejernihan vokal dan definisi instrumen.</p>

        <h2 class="text-2xl font-bold text-gray-900 mb-4 mt-8">Ukuran dan Desain</h2>
        <p class="mb-6">Ukuran umum speaker mobil adalah 6x9, 6.5, dan 5.25 inch. Pastikan ukuran yang dipilih kompatibel dengan panel pintu atau rak belakang mobil Anda. Perhatikan juga mounting depth agar tidak berbenturan dengan komponen pintu lain.</p>

        <h2 class="text-2xl font-bold text-gray-900 mb-4 mt-8">Sensitivitas dan Power Handling</h2>
        <p class="mb-6">Sensitivitas menentukan seberapa keras speaker berbunyi pada daya tertentu; semakin tinggi nilainya (dB), semakin efisien speaker. Periksa juga power handling (RMS dan peak) agar sesuai dengan output amplifier Anda.</p>

        <h2 class="text-2xl font-bold text-gray-900 mb-4 mt-8">Tips Pemasangan</h2>
        <p class="mb-6">Gunakan bracket adaptor jika diperlukan, segel lubang mounting dengan gasket untuk mengurangi getaran, dan hindari pemasangan yang longgar. Pemasangan yang rapi meningkatkan performa dan mengurangi kebocoran suara.</p>

        <img src="https://images.unsplash.com/photo-1518544889020-3c6c37b8c8f0?w=900&h=400&fit=crop" class="my-6 rounded-lg" alt="Contoh pemasangan speaker" />

        <h2 class="text-2xl font-bold text-gray-900 mb-4 mt-8">Kesimpulan</h2>
        <p class="mb-6">Pilih speaker berdasarkan kebutuhan audio Anda: kenyamanan pemasangan, anggaran, dan preferensi suara. Jika ragu, konsultasikan dengan teknisi kami di Aan Audio Solutions untuk rekomendasi yang sesuai dengan kendaraan Anda.</p>
      `,
    },
    2: {
      id: 2,
      title: "Cara Kalibrasi Subwoofer untuk Bass yang Seimbang",
      image:
        "https://images.unsplash.com/photo-1497294815431-9365093b7331?w=1200&h=600&fit=crop",
      author: "Teknisi Aan",
      authorBio: "Teknisi Audio & Bass Specialist",
      date: "10 Jan 2025",
      readTime: "8 menit baca",
      category: "Perawatan",
      categoryColor: "bg-emerald-500",
      content: `
        <p class="mb-6">Subwoofer yang diset dengan benar dapat menghasilkan bass yang kuat namun tetap seimbang. Panduan ini menjelaskan langkah kalibrasi level, fase, dan frekuensi crossover untuk hasil optimal.</p>

        <h2 class="text-2xl font-bold text-gray-900 mb-4 mt-8">Atur Level (Gain) dengan Benar</h2>
        <p class="mb-6">Mulailah dengan mengatur gain pada amplifier di posisi rendah, lalu naikkan secara bertahap sambil memeriksa distorsi. Tujuannya adalah mendapatkan response bass tanpa clipping.</p>

        <h2 class="text-2xl font-bold text-gray-900 mb-4 mt-8">Sesuaikan Crossover</h2>
        <p class="mb-6">Pilih frekuensi crossover yang sesuai (mis. 80-120Hz) agar subwoofer mengisi frekuensi rendah sementara speaker full-range tetap menangani mid dan treble.</p>

        <h2 class="text-2xl font-bold text-gray-900 mb-4 mt-8">Atur Fase dan Waktu</h2>
        <p class="mb-6">Jika subwoofer terdengar samar atau tenggelam, coba ubah phase 0/180 derajat atau atur delay untuk menyelaraskan waktu kedatangan suara antara subwoofer dan speaker lain.</p>

        <img src="https://images.unsplash.com/photo-1518544889020-3c6c37b8c8f0?w=900&h=400&fit=crop" class="my-6 rounded-lg" alt="Kalibrasi subwoofer" />

        <h2 class="text-2xl font-bold text-gray-900 mb-4 mt-8">Tes dengan Lagu Referensi</h2>
        <p class="mb-6">Gunakan lagu referensi dengan rentang frekuensi yang baik untuk menguji hasil kalibrasi. Dengarkan apakah bass terasa tight, tidak boomy, dan tetap detail.</p>

        <h2 class="text-2xl font-bold text-gray-900 mb-4 mt-8">Kesimpulan</h2>
        <p class="mb-6">Kalibrasi yang teliti membutuhkan waktu. Jika ingin hasil profesional, kunjungi bengkel kami untuk pengukuran dan tuning menggunakan alat ukur (RTA) dan ear calibration.</p>
      `,
    },
    3: {
      id: 3,
      title: "Upgrade Head Unit: Fitur, Kompatibilitas, dan Tips Pemasangan",
      image:
        "https://images.unsplash.com/photo-1518544889020-3c6c37b8c8f0?w=1200&h=600&fit=crop",
      author: "M. Hadi",
      authorBio: "Spesialis Instalasi Elektronik Mobil",
      date: "22 Feb 2025",
      readTime: "7 menit baca",
      category: "Modifikasi",
      categoryColor: "bg-purple-500",
      content: `
        <p class="mb-6">Mengganti head unit meningkatkan fungsi multimedia kendaraan Anda. Artikel ini membahas fitur penting, kompatibilitas kendaraan, dan tips pemasangan yang aman.</p>

        <h2 class="text-2xl font-bold text-gray-900 mb-4 mt-8">Fitur yang Perlu Dicari</h2>
        <p class="mb-6">Cari head unit dengan dukungan Bluetooth, CarPlay/Android Auto, output preamp, dan equalizer 5- or 7-band untuk fleksibilitas tuning.</p>

        <h2 class="text-2xl font-bold text-gray-900 mb-4 mt-8">Kompatibilitas dan Wiring</h2>
        <p class="mb-6">Pastikan harness kabel dan mounting plate kompatibel. Jika mobil memiliki CAN-bus atau steering control, gunakan adapter yang sesuai agar fungsi steering tetap berjalan.</p>

        <img src="https://images.unsplash.com/photo-1583337130417-1f3de34e6f2c?w=900&h=400&fit=crop" class="my-6 rounded-lg" alt="Upgrade head unit" />

        <h2 class="text-2xl font-bold text-gray-900 mb-4 mt-8">Tips Pemasangan Aman</h2>
        <p class="mb-6">Matikan sumber listrik sebelum pemasangan, gunakan konektor berkualitas, dan isolasi sambungan agar tidak terjadi korsleting. Jika ragu, serahkan pemasangan ke teknisi bersertifikat.</p>

        <h2 class="text-2xl font-bold text-gray-900 mb-4 mt-8">Kesimpulan</h2>
        <p class="mb-6">Upgrade head unit akan sangat meningkatkan kenyamanan dan kualitas audio. Pilih unit yang sesuai kebutuhan dan selalu pastikan pemasangan rapi untuk hasil terbaik.</p>
      `,
    },
    4: {
      id: 4,
      title: "Merawat Sistem Audio: Tips Perawatan Berkala",
      image:
        "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1200&h=600&fit=crop",
      author: "Rina Putri",
      authorBio: "Teknisi Perawatan Audio",
      date: "05 Mar 2025",
      readTime: "6 menit baca",
      category: "Perawatan",
      categoryColor: "bg-green-500",
      content: `
        <p class="mb-6">Perawatan rutin memperpanjang umur sistem audio dan menjaga kualitas suara. Berikut langkah-langkah sederhana yang bisa Anda lakukan secara berkala.</p>

        <h2 class="text-2xl font-bold text-gray-900 mb-4 mt-8">Periksa Kabel dan Konektor</h2>
        <p class="mb-6">Pastikan tidak ada kabel terkelupas atau konektor longgar. Konektor yang berkarat dapat menyebabkan noise atau kehilangan sinyal.</p>

        <h2 class="text-2xl font-bold text-gray-900 mb-4 mt-8">Bersihkan Speaker dari Debu</h2>
        <p class="mb-6">Debu dan kotoran dapat menempel pada cone speaker dan menyebabkan suara pecah. Bersihkan dengan kuas lembut atau blower udara pada sela-sela grill.</p>

        <img src="https://images.unsplash.com/photo-1590490360182-c33d57733427?w=900&h=400&fit=crop" class="my-6 rounded-lg" alt="Perawatan audio mobil" />

        <h2 class="text-2xl font-bold text-gray-900 mb-4 mt-8">Update Software Head Unit</h2>
        <p class="mb-6">Beberapa head unit modern menerima pembaruan firmware. Periksa situs resmi produsen untuk update yang dapat memperbaiki bug dan menambah fitur.</p>

        <h2 class="text-2xl font-bold text-gray-900 mb-4 mt-8">Kesimpulan</h2>
        <p class="mb-6">Perawatan sederhana namun konsisten akan menjaga performa sistem audio Anda. Jika menemukan masalah teknis, segera konsultasikan dengan bengkel profesional.</p>
      `,
    },
    5: {
      id: 5,
      title: "Pilihan Subwoofer untuk Ruang Kabin Kecil",
      image:
        "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1200&h=600&fit=crop",
      author: "Aan Audio",
      authorBio: "Konsultan Produk Audio",
      date: "18 Mar 2025",
      readTime: "7 menit baca",
      category: "Tips Audio",
      categoryColor: "bg-pink-500",
      content: `
        <p class="mb-6">Memilih subwoofer untuk kabin kecil memerlukan kompromi antara output bass dan kenyamanan penumpang. Berikut rekomendasi dan tips penempatan untuk hasil terbaik.</p>

        <h2 class="text-2xl font-bold text-gray-900 mb-4 mt-8">Pilih Ukuran yang Proporsional</h2>
        <p class="mb-6">Subwoofer 8" hingga 10" seringkali cukup untuk kabin kecil. Pilih enclosure sealed untuk bass yang lebih rapat dan tidak boomy.</p>

        <h2 class="text-2xl font-bold text-gray-900 mb-4 mt-8">Penempatan Ideal</h2>
        <p class="mb-6">Penempatan di bagasi dengan arah menghadap ke interior atau ke belakang kursi dapat memengaruhi karakter bass. Coba beberapa posisi untuk menemukan titik terbaik.</p>

        <img src="https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=900&h=400&fit=crop" class="my-6 rounded-lg" alt="Subwoofer mobil" />

        <h2 class="text-2xl font-bold text-gray-900 mb-4 mt-8">Kesimpulan</h2>
        <p class="mb-6">Untuk kabin kecil, prioritaskan kontrol (sealed enclosure) dan tuning yang hati-hati untuk menghasilkan bass yang memuaskan tanpa mengganggu kenyamanan.</p>
      `,
    },
    6: {
      id: 6,
      title: "Panduan Pemasangan Alarm Mobil yang Aman",
      image:
        "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1200&h=600&fit=crop",
      author: "Joko Wirawan",
      authorBio: "Teknisi Keamanan Kendaraan",
      date: "28 Mar 2025",
      readTime: "6 menit baca",
      category: "Keamanan",
      categoryColor: "bg-yellow-500",
      content: `
        <p class="mb-6">Pemasangan alarm meningkatkan keamanan kendaraan. Panduan ini menjelaskan langkah dasar pemasangan serta fitur tambahan yang direkomendasikan.</p>

        <h2 class="text-2xl font-bold text-gray-900 mb-4 mt-8">Komponen Utama Alarm</h2>
        <p class="mb-6">Sistem alarm biasanya terdiri dari sirene, sensor pintu, sensor getar, dan remote. Pastikan semua komponen ditempatkan dan dikabel dengan rapi untuk menghindari false alarm.</p>

        <h2 class="text-2xl font-bold text-gray-900 mb-4 mt-8">Integrasi dengan Sistem Lain</h2>
        <p class="mb-6">Pertimbangkan integrasi dengan GPS tracker atau immobilizer untuk keamanan maksimal. Pilih pemasangan yang memungkinkan monitoring real-time jika diperlukan.</p>

        <img src="https://images.unsplash.com/photo-1592194996308-7b43878e84a6?w=900&h=400&fit=crop" class="my-6 rounded-lg" alt="Pemasangan alarm mobil" />

        <h2 class="text-2xl font-bold text-gray-900 mb-4 mt-8">Kesimpulan</h2>
        <p class="mb-6">Pilih paket alarm sesuai kebutuhan dan serahkan pemasangan ke bengkel terpercaya agar sistem bekerja andal tanpa mengganggu fungsi kendaraan lain.</p>
      `,
    },
    7: {
      id: 7,
      title: "Tips Mengatur Equalizer untuk Suara Jernih",
      image:
        "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1200&h=600&fit=crop",
      author: "Dewi S",
      authorBio: "Audio Engineer",
      date: "02 Apr 2025",
      readTime: "5 menit baca",
      category: "Modifikasi",
      categoryColor: "bg-orange-500",
      content: `
        <p class="mb-6">Equalizer adalah alat penting untuk menyesuaikan karakter suara sesuai preferensi. Berikut strategi dasar untuk mengatur EQ pada head unit atau processor audio.</p>

        <h2 class="text-2xl font-bold text-gray-900 mb-4 mt-8">Mulai dari Flat</h2>
        <p class="mb-6">Setel semua band ke posisi flat sebagai titik awal. Dengarkan referensi lagu lalu lakukan penyesuaian kecil (±2-3 dB) pada frekuensi yang ingin ditonjolkan atau dikurangi.</p>

        <h2 class="text-2xl font-bold text-gray-900 mb-4 mt-8">Fokus pada Mid dan Vocal</h2>
        <p class="mb-6">Jika vokal terdengar tenggelam, naikkan frekuensi mid (sekitar 1-3 kHz). Jangan berlebihan agar suara tidak menjadi harsh.</p>

        <img src="https://images.unsplash.com/photo-1496318447583-f524534e9ce1?w=900&h=400&fit=crop" class="my-6 rounded-lg" alt="Mengatur equalizer" />

        <h2 class="text-2xl font-bold text-gray-900 mb-4 mt-8">Kesimpulan</h2>
        <p class="mb-6">Pengaturan EQ yang baik bergantung pada sistem audio dan preferensi musik. Lakukan penyesuaian bertahap dan gunakan lagu referensi untuk hasil terbaik.</p>
      `,
    },
    8: {
      id: 8,
      title: "Rekomendasi Aksesoris untuk Audio Mobil",
      image:
        "https://images.unsplash.com/photo-1583337130417-1f3de34e6f2c?w=1200&h=600&fit=crop",
      author: "Aan Audio",
      authorBio: "Tim Produk Aan Audio",
      date: "12 Apr 2025",
      readTime: "5 menit baca",
      category: "Tips",
      categoryColor: "bg-indigo-500",
      content: `
        <p class="mb-6">Aksesoris yang tepat dapat meningkatkan kualitas instalasi dan umur perangkat audio. Berikut daftar aksesori yang kami rekomendasikan.</p>

        <h2 class="text-2xl font-bold text-gray-900 mb-4 mt-8">Kabel Berkualitas</h2>
        <p class="mb-6">Gunakan kabel RCA dan power berkualitas untuk mengurangi noise dan kehilangan sinyal. Kabel berkualitas juga tahan terhadap suhu dan getaran kendaraan.</p>

        <h2 class="text-2xl font-bold text-gray-900 mb-4 mt-8">Isolator dan Peredam Suara</h2>
        <p class="mb-6">Peredam suara pada pintu dan bagasi mengurangi resonansi dan meningkatkan respons bass. Hasilnya suara lebih jelas dan rapat.</p>

        <img src="https://images.unsplash.com/photo-1518544889020-3c6c37b8c8f0?w=900&h=400&fit=crop" class="my-6 rounded-lg" alt="Aksesoris audio mobil" />

        <h2 class="text-2xl font-bold text-gray-900 mb-4 mt-8">Kesimpulan</h2>
        <p class="mb-6">Investasi pada aksesoris berkualitas kecil namun berdampak besar pada performa dan keandalan sistem audio mobil Anda.</p>
      `,
    },
    9: {
      id: 9,
      title: "Rencana Modifikasi Audio untuk Anggaran Terbatas",
      image:
        "https://images.unsplash.com/photo-1592194996308-7b43878e84a6?w=1200&h=600&fit=crop",
      author: "Arif Setiawan",
      authorBio: "Konsultan Modifikasi",
      date: "20 Apr 2025",
      readTime: "8 menit baca",
      category: "Modifikasi",
      categoryColor: "bg-red-500",
      content: `
        <p class="mb-6">Modifikasi audio tidak harus mahal. Dengan prioritas yang tepat, Anda bisa mendapatkan peningkatan suara yang signifikan tanpa melebihi anggaran.</p>

        <h2 class="text-2xl font-bold text-gray-900 mb-4 mt-8">Prioritaskan Komponen Inti</h2>
        <p class="mb-6">Mulailah dari speaker depan berkualitas, kemudian tambahkan amplifier untuk daya yang lebih bersih. Subwoofer dapat ditunda jika anggaran terbatas.</p>

        <h2 class="text-2xl font-bold text-gray-900 mb-4 mt-8">Beli yang Tepat, Bukan Paling Mahal</h2>
        <p class="mb-6">Cari produk dengan review bagus dan spesifikasi yang sesuai, bukan hanya merek mahal. Banyak produk entry-to-mid level menawarkan nilai sangat baik.</p>

        <img src="https://images.unsplash.com/photo-1592194996308-7b43878e84a6?w=900&h=400&fit=crop" class="my-6 rounded-lg" alt="Modifikasi audio ekonomis" />

        <h2 class="text-2xl font-bold text-gray-900 mb-4 mt-8">Kesimpulan</h2>
        <p class="mb-6">Rencanakan upgrade bertahap dan gunakan jasa bengkel untuk pemasangan profesional agar setiap komponen memberikan hasil maksimal sesuai anggaran.</p>
      `,
    },
  };

  const article = articles[id] || articles[1];

  const shareUrl = window.location.href;
  const shareTitle = article.title;

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`,
    twitter: `https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareTitle}`,
    linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${shareUrl}&title=${shareTitle}`,
    whatsapp: `https://wa.me/?text=${shareTitle} ${shareUrl}`,
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
          <a
            href="/articles"
            className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-full font-semibold outfit hover:bg-white/30 transition-all duration-300 border border-white/30"
          >
            <FaArrowLeft className="w-4 h-4" />
            <span>Kembali</span>
          </a>
        </div>

        {/* Title Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <span
                className={`${article.categoryColor} text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg outfit inline-block mb-4`}
              >
                {article.category}
              </span>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 outfit">
                {article.title}
              </h1>
              <div className="flex flex-wrap items-center gap-6 text-white/90 text-sm outfit">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <FaUser className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-semibold">{article.author}</p>
                    <p className="text-xs text-white/70">{article.authorBio}</p>
                  </div>
                </div>
                <span className="flex items-center gap-2">
                  <FaCalendarAlt className="w-4 h-4" />
                  {article.date}
                </span>
                <span className="flex items-center gap-2">
                  <FaClock className="w-4 h-4" />
                  {article.readTime}
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Article Content */}
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {/* Share Buttons */}
          <div className="flex items-center gap-4 mb-12 pb-8 border-b border-gray-200">
            <span className="text-sm font-semibold text-gray-700 outfit">
              Bagikan:
            </span>
            <div className="flex gap-3">
              <a
                href={shareLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center transition-colors duration-300"
              >
                <FaFacebookF className="w-4 h-4" />
              </a>
              <a
                href={shareLinks.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-sky-500 hover:bg-sky-600 text-white rounded-full flex items-center justify-center transition-colors duration-300"
              >
                <FaTwitter className="w-4 h-4" />
              </a>
              <a
                href={shareLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-blue-700 hover:bg-blue-800 text-white rounded-full flex items-center justify-center transition-colors duration-300"
              >
                <FaLinkedinIn className="w-4 h-4" />
              </a>
              <a
                href={shareLinks.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-green-500 hover:bg-green-600 text-white rounded-full flex items-center justify-center transition-colors duration-300"
              >
                <FaWhatsapp className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Article Body */}
          <div
            className="prose prose-lg max-w-none outfit"
            dangerouslySetInnerHTML={{ __html: article.content }}
            style={{
              color: "#4B5563",
              lineHeight: "1.8",
            }}
          />

          {/* Tags */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="flex flex-wrap items-center gap-3">
                <span className="text-sm font-semibold text-gray-700 outfit">
                Tags:
              </span>
              <span className="bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm outfit">
                {article.category}
              </span>
              <span className="bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm outfit">
                Audio Mobil
              </span>
              <span className="bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm outfit">
                Pemasangan
              </span>
            </div>
          </div>

          {/* Author Card */}
          <div className="mt-12 bg-gradient-to-r from-teal-50 to-emerald-50 rounded-2xl p-8">
            <div className="flex items-start gap-6">
              <div className="w-20 h-20 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
                <FaUser className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 outfit">
                  {article.author}
                </h3>
                <p className="text-sm text-gray-600 mb-4 outfit">
                  {article.authorBio}
                </p>
                <p className="text-gray-700 leading-relaxed outfit">
                  Berbagi pengetahuan tentang audio mobil, tips pemasangan, dan
                  rekomendasi produk. Tim kami berpengalaman dalam instalasi dan
                  tuning sistem audio kendaraan untuk hasil suara optimal.
                </p>
              </div>
            </div>
          </div>

          {/* Back to Articles */}
          <div className="mt-12 text-center">
            <a
              href="/articles"
              className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg outfit hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
            >
              <FaArrowLeft className="w-5 h-5" />
              <span>Lihat Artikel Lainnya</span>
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ArticleDetail;
