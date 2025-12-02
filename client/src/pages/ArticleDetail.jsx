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
        "https://ik.imagekit.io/dzlzhxcdo/Article1(2).png",
      author: "Aan Audio",
      authorBio: "Spesialis Audio Mobil di Aan Audio Solutions",
      date: "15 Des 2024",
      readTime: "6 menit baca",
      category: "Tips Audio",
      categoryColor: "bg-teal-500",
      content: `
        <p class="mb-6">
          Memilih speaker mobil yang tepat merupakan langkah penting bagi siapa pun yang ingin meningkatkan kualitas audio di kendaraannya. Banyak pemilik mobil merasa bahwa mengganti speaker standar bawaan pabrik sudah cukup untuk memberikan peningkatan besar, tetapi kenyataannya memilih speaker tidak bisa asal. Setiap tipe speaker memiliki karakter, performa, dan kebutuhan instalasi yang berbeda. Artikel ini akan memberikan panduan lengkap untuk membantu Anda memahami perbedaan tipe speaker, spesifikasi teknis, serta pertimbangan penting sebelum Anda memutuskan untuk membeli.
        </p>

        <p class="mb-6">
          Dengan perkembangan teknologi audio, kini tersedia berbagai pilihan speaker mulai dari model yang terjangkau hingga high-end dengan kualitas premium. Namun, harga bukan satu-satunya faktor penentu kualitas. Anda perlu memahami bagaimana setiap komponen bekerja, bagaimana mereka memproduksi suara, dan bagaimana kesesuaiannya dengan head unit atau amplifier yang Anda gunakan. Dengan mempertimbangkan semua aspek tersebut, Anda dapat memastikan audio mobil Anda bekerja optimal sesuai preferensi mendengarkan musik Anda.
        </p>

        <h2 class="text-2xl font-bold text-gray-900 mb-4 mt-8">Tipe Speaker: Coaxial vs Component</h2>
        <p class="mb-6">
          Secara umum, speaker mobil terbagi menjadi dua jenis: coaxial (full-range) dan component. Speaker coaxial adalah pilihan paling populer bagi pengguna yang menginginkan upgrade cepat dengan harga terjangkau. Speaker ini menggabungkan woofer dan tweeter dalam satu unit, sehingga mudah dipasang dan tidak memakan ruang tambahan. Kualitasnya pun cukup baik untuk kebutuhan harian, terutama jika Anda ingin peningkatan dari speaker bawaan pabrik.
        </p>

        <p class="mb-6">
          Sementara itu, speaker component adalah pilihan bagi Anda yang mengutamakan kualitas suara. Dengan pemisahan antara woofer, tweeter, dan crossover, speaker ini mampu menghasilkan detail vokal dan instrumen yang jauh lebih jelas. Suara treble lebih bersih, midrange lebih hidup, dan bass lebih terkontrol. Namun, perlu diketahui bahwa instalasi speaker component membutuhkan keahlian lebih karena setiap komponen harus ditempatkan pada posisi optimal untuk mendapatkan kualitas audio terbaik.
        </p>

        <h2 class="text-2xl font-bold text-gray-900 mb-4 mt-8">Ukuran dan Desain Speaker</h2>
        <p class="mb-6">
          Ukuran speaker sangat menentukan kompatibilitas dengan mobil Anda. Ukuran yang paling umum adalah 5.25 inci, 6.5 inci, dan 6x9 inci. Mobil kecil biasanya menggunakan 5.25 atau 6.5 inci, sementara mobil yang lebih besar dapat menggunakan 6x9 inci di rak belakang. Sebelum membeli, penting untuk mengetahui ukuran stok speaker mobil Anda agar tidak perlu melakukan modifikasi besar pada panel pintu.
        </p>

        <p class="mb-6">
          Selain diameter, Anda juga harus memperhatikan mounting depth atau kedalaman pemasangan. Beberapa mobil memiliki ruang pintu yang dangkal, sehingga speaker dengan magnet besar bisa berbenturan dengan kaca atau rangka pintu. Desain speaker juga memengaruhi kualitas suara; misalnya, cone berbahan polypropylene cenderung menghasilkan suara yang hangat dan tahan lama, sementara bahan seperti kevlar atau fiberglass memberikan respon yang lebih presisi.
        </p>

        <h2 class="text-2xl font-bold text-gray-900 mb-4 mt-8">Sensitivitas dan Power Handling</h2>
        <p class="mb-6">
          Dua hal penting dalam spesifikasi teknis speaker adalah sensitivitas dan power handling. Sensitivitas menunjukkan seberapa keras speaker dapat berbunyi dengan daya tertentu, diukur dalam desibel (dB). Speaker dengan sensitivitas tinggi cocok untuk head unit bawaan yang relatif rendah dayanya. Sebaliknya, jika Anda menggunakan amplifier, speaker dengan sensitivitas lebih rendah pun tetap bisa bekerja optimal.
        </p>

        <p class="mb-6">
          Power handling terdiri dari dua nilai RMS dan peak power. RMS menunjukkan daya yang dapat diterima speaker secara stabil, sedangkan peak menunjukkan daya maksimum yang bisa diterima dalam waktu singkat. Pastikan nilai RMS speaker sesuai atau sedikit di atas output amplifier Anda untuk menghindari distorsi dan kerusakan jangka panjang. Kombinasi yang tepat akan memberikan dinamika suara yang lebih baik, terutama pada volume tinggi.
        </p>

        <h2 class="text-2xl font-bold text-gray-900 mb-4 mt-8">Tips Pemasangan dan Optimasi</h2>
        <p class="mb-6">
          Pemasangan yang benar sangat menentukan performa speaker. Banyak orang mengabaikan detail kecil seperti posisi tweeter, penggunaan ring peredam (spacer), atau penyegelan panel pintu. Padahal, pemasangan yang rapi dapat meningkatkan kualitas suara secara signifikan. Jika panel pintu tidak kuat, getaran bisa muncul dan merusak kejernihan suara.
        </p>

        <p class="mb-6">
          Selain itu, penggunaan peredam pintu seperti STP atau Dynamat dapat mengurangi resonansi dan kebocoran suara. Dengan peredaman yang tepat, bahkan speaker kelas menengah dapat menghasilkan suara yang lebih jernih dan fokus. Untuk hasil maksimal, instalasi sebaiknya dilakukan oleh teknisi audio profesional yang memahami akustik kabin mobil.
        </p>

        <img src="https://ik.imagekit.io/dzlzhxcdo/Article1(3).png" class="my-6 rounded-lg" alt="Contoh pemasangan speaker" />

        <h2 class="text-2xl font-bold text-gray-900 mb-4 mt-8">Kesimpulan</h2>
        <p class="mb-6">
          Memilih speaker mobil yang tepat memerlukan pemahaman tentang kebutuhan audio pribadi, jenis musik yang sering didengar, serta kompatibilitas dengan kendaraan dan perangkat audio lainnya. Dengan mempertimbangkan tipe speaker, ukuran, sensitivitas, dan kualitas pemasangan, Anda bisa mendapatkan peningkatan audio yang signifikan. Jika masih bingung menentukan pilihan, konsultasikan kebutuhan Anda dengan tim profesional di Aan Audio Solutions untuk rekomendasi terbaik sesuai kendaraan dan anggaran Anda.
        </p>
      `,
    },

    2: {
      id: 2,
      title: "Cara Kalibrasi Subwoofer untuk Bass yang Seimbang",
      image:
        "https://ik.imagekit.io/dzlzhxcdo/Article2.png",
      author: "Teknisi Aan",
      authorBio: "Teknisi Audio & Bass Specialist",
      date: "10 Jan 2025",
      readTime: "8 menit baca",
      category: "Perawatan",
      categoryColor: "bg-emerald-500",
      content: `
        <p class="mb-6">
          Subwoofer adalah elemen penting dalam sistem audio mobil karena bertugas mengisi frekuensi rendah yang tidak mampu dijangkau speaker standar. Namun, banyak pengguna yang mengeluhkan bass terlalu boomy, kurang presisi, atau justru tidak terasa sama sekali. Masalah-masalah tersebut biasanya bukan berasal dari perangkatnya, tetapi dari kalibrasi yang kurang tepat. Melalui panduan lengkap ini, kami akan membahas cara melakukan kalibrasi subwoofer secara menyeluruh agar bass lebih halus, bertenaga, dan seimbang dengan keseluruhan sistem audio mobil Anda.
        </p>

        <p class="mb-6">
          Kalibrasi subwoofer bukan hanya soal menaikkan volume. Ia merupakan proses penyesuaian detail yang melibatkan gain, crossover, fase, hingga pemilihan lagu referensi. Dengan penyetelan yang benar, Anda tidak hanya mendapatkan bass yang kuat, tetapi juga nuansa suara yang lebih natural dan menyatu dengan speaker lainnya. Mari kita mulai dari bagian yang paling sering disalahpahami: pengaturan gain.
        </p>

        <h2 class="text-2xl font-bold text-gray-900 mb-4 mt-8">1. Atur Level (Gain) dengan Benar</h2>
        <p class="mb-6">
          Banyak orang mengira bahwa menaikkan gain sama seperti menaikkan volume subwoofer. Padahal, gain berfungsi sebagai penyesuaian sensitivitas agar sinyal dari head unit cocok dengan amplifier. Pengaturan gain yang terlalu tinggi akan menyebabkan distorsi dan clipping, sedangkan terlalu rendah membuat bass kurang bertenaga.
        </p>
        <p class="mb-6">
          Mulailah dari posisi terendah, kemudian naikkan perlahan sambil mendengarkan musik yang memiliki rentang bass dinamis. Fokuskan pendengaran Anda pada ketajaman bass jika mulai terdengar pecah atau “kotor”, turunkan sedikit. Pengaturan gain yang benar akan menghasilkan bass yang kuat namun tetap presisi.
        </p>

        <h2 class="text-2xl font-bold text-gray-900 mb-4 mt-8">2. Sesuaikan Crossover secara Akurat</h2>
        <p class="mb-6">
          Crossover menentukan frekuensi mana yang hanya dimainkan subwoofer dan mana yang tetap diserahkan kepada speaker midrange. Pengaturan yang tepat membuat suara tetap menyatu dan tidak tumpang tindih. Biasanya, rentang ideal untuk audio mobil berada di antara 80–120 Hz.
        </p>
        <p class="mb-6">
          Jika crossover terlalu tinggi, bass akan terdengar mendominasi dan mengganggu kejernihan suara vokal. Sebaliknya, jika terlalu rendah, subwoofer mungkin tidak menghasilkan cukup energi di frekuensi bawah. Lakukan penyesuaian secara perlahan sambil membandingkan beberapa jenis lagu: elektronik, akustik, dan pop.
        </p>

        <h2 class="text-2xl font-bold text-gray-900 mb-4 mt-8">3. Atur Fase dan Waktu agar Bass Lebih Menyatu</h2>
        <p class="mb-6">
          Fase bertugas memastikan gelombang suara subwoofer selaras dengan speaker lainnya. Jika salah fase, bass akan terdengar tipis, bergema, atau malah menghilang di beberapa titik. Fitur pengaturan phase (0°/180°) biasanya tersedia di amplifier atau head unit modern.
        </p>
        <p class="mb-6">
          Cobalah ubah fase sambil memutar lagu dengan bass konstan. Bila subwoofer terdengar lebih padat, berarti Anda menemukan setting yang tepat. Untuk sistem yang lebih kompleks, fitur time alignment dapat membantu menyamakan waktu tempuh suara dari seluruh speaker menuju telinga pengemudi sehingga hasilnya lebih presisi.
        </p>

        <img src="https://ik.imagekit.io/dzlzhxcdo/Article2(2).png" class="my-6 rounded-lg" alt="Kalibrasi subwoofer" />

        <h2 class="text-2xl font-bold text-gray-900 mb-4 mt-8">4. Gunakan Lagu Referensi untuk Final Check</h2>
        <p class="mb-6">
          Setelah semua pengaturan teknis dilakukan, langkah selanjutnya adalah melakukan pengujian menggunakan lagu referensi. Lagu dengan beat bass yang konsisten akan membantu Anda menentukan apakah subwoofer sudah “tight”, tidak boomy, dan tidak mendominasi suara lainnya.
        </p>
        <p class="mb-6">
          Anda bisa menggunakan beberapa rekomendasi lagu pengujian seperti musik elektronik, R&B, maupun instrumental dengan frekuensi bass rendah yang bersih. Pastikan bass terdengar natural, tidak menggema, dan tetap menjaga karakter musik aslinya tanpa menutupi vokal.
        </p>

        <h2 class="text-2xl font-bold text-gray-900 mb-4 mt-8">Kesimpulan</h2>
        <p class="mb-6">
          Kalibrasi subwoofer memerlukan ketelitian, tetapi hasilnya akan sangat terasa dalam kualitas audio mobil Anda. Gain, crossover, dan fase adalah tiga elemen utama yang harus diseimbangkan dengan baik. Dengan pengaturan yang tepat, Anda akan mendapatkan bass yang dalam, presisi, dan menyatu dengan keseluruhan sistem.
        </p>
        <p class="mb-6">
          Jika Anda menginginkan hasil yang lebih maksimal, Aan Audio menyediakan layanan tuning profesional menggunakan alat RTA, sound analyzer, dan teknik ear calibration untuk memastikan setiap frekuensi terdengar sempurna di dalam kabin mobil Anda.
        </p>
      `,
    },

    3: {
      id: 3,
      title: "Upgrade Head Unit: Fitur, Kompatibilitas, dan Tips Pemasangan",
      image:
        "https://ik.imagekit.io/dzlzhxcdo/Head-Unit-04_uwxb4b.jpg?updatedAt=1763701230737",
      author: "M. Hadi",
      authorBio: "Spesialis Instalasi Elektronik Mobil",
      date: "22 Feb 2025",
      readTime: "7 menit baca",
      category: "Modifikasi",
      categoryColor: "bg-cyan-500",
      content: `
        <p class="mb-6">
          Meng-upgrade head unit adalah salah satu langkah paling efektif untuk meningkatkan kenyamanan dan pengalaman berkendara. Selain memberikan tampilan lebih modern, head unit baru biasanya menawarkan fitur-fitur canggih yang tidak tersedia pada sistem standar bawaan mobil. 
        </p>

        <p class="mb-6">
          Namun, sebelum melakukan penggantian, sangat penting untuk memahami fitur apa saja yang perlu diprioritaskan, bagaimana memastikan kompatibilitas dengan kendaraan, dan apa saja langkah yang wajib diperhatikan agar proses pemasangan berjalan aman serta hasilnya optimal. Pada artikel ini, kita membahas semuanya secara detail.
        </p>

        <h2 class="text-2xl font-bold text-gray-900 mb-4 mt-8">Fitur yang Perlu Dicari pada Head Unit Modern</h2>

        <p class="mb-6">
          Dalam beberapa tahun terakhir, teknologi head unit berkembang sangat pesat. Fitur yang dulu hanya ada pada mobil premium kini sudah tersedia untuk berbagai kelas kendaraan. Salah satu fitur paling penting adalah dukungan Apple CarPlay dan Android Auto, yang memungkinkan Anda mengakses navigasi, musik, panggilan, hingga pesan tanpa menyentuh ponsel.
        </p>

        <p class="mb-6">
          Selain itu, pastikan head unit memiliki konektivitas Bluetooth stabil, terutama jika Anda sering melakukan panggilan telepon atau streaming musik. Untuk penggemar audio, fitur seperti equalizer 7–15 band, time alignment, dan DSP (Digital Signal Processor)</strong> adalah nilai tambah besar untuk tuning yang lebih presisi.
        </p>

        <p class="mb-6">
          Jangan lupakan fitur tambahan seperti dual USB, kamera belakang atau 360 support, fast charging, dan kompatibilitas format audio lossless seperti FLAC. Fitur-fitur tersebut memberikan pengalaman multimedia yang jauh lebih baik dibandingkan head unit standar.
        </p>

        <h2 class="text-2xl font-bold text-gray-900 mb-4 mt-8">Kompatibilitas dan Wiring: Hal yang Paling Sering Diabaikan</h2>

        <p class="mb-6">
          Bagian terpenting dalam upgrade head unit bukan hanya produk yang dipilih, tetapi bagaimana head unit tersebut terintegrasi dengan sistem mobil Anda. Setiap mobil memiliki desain dashboard dan jalur kabel berbeda, sehingga pemilihan frame panel dan harness kabel harus dilakukan dengan tepat.
        </p>

        <p class="mb-6">
          Jika mobil Anda menggunakan sistem CAN-bus (umum pada mobil keluaran terbaru), maka Anda membutuhkan CAN-bus decoder agar fitur seperti sensor parkir, notifikasi pintu, atau kontrol setir tetap berfungsi normal. Tanpa decoder yang sesuai, beberapa fitur bawaan mobil bisa tidak berfungsi.
        </p>

        <img src="https://ik.imagekit.io/dzlzhxcdo/Gps_wkzo2i.jpg?updatedAt=1763701230720" class="my-6 rounded-lg" alt="Upgrade head unit" />

        <p class="mb-6">
          Selain itu, wiring juga harus dipastikan aman dan rapi. Penggunaan kabel sembarangan atau sambungan asal-asalan bukan hanya membuat sistem tidak stabil, tetapi juga dapat menyebabkan korsleting yang berbahaya. Maka dari itu, pemilihan socket-to-socket harness sangat direkomendasikan agar proses pemasangan tidak perlu memotong kabel bawaan mobil.
        </p>

        <h2 class="text-2xl font-bold text-gray-900 mb-4 mt-8">Tips Pemasangan Aman dan Profesional</h2>

        <p class="mb-6">
          Sebelum memulai pemasangan, pastikan aki mobil dalam kondisi mati. Ini untuk mencegah korsleting atau kerusakan pada head unit baru. Gunakan selalu konektor berkualitas dan hindari sambungan tanpa solder atau tanpa isolasi yang tepat.
        </p>

        <p class="mb-6">
          Ketika memasang head unit, pastikan tidak ada kabel yang terjepit di bagian dalam dashboard. Banyak kasus kabel terkelupas akibat pemasangan kurang rapi, yang akhirnya membuat sistem mati-mati atau menimbulkan bau hangus. Hal-hal seperti ini sangat umum terjadi jika pemasangan dilakukan tanpa standar teknis.
        </p>

        <p class="mb-6">
          Jika Anda tidak yakin dengan wiring, software setting, atau kompatibilitas CAN-bus, lebih baik serahkan kepada teknisi profesional yang berpengalaman. Teknisi bersertifikat biasanya memiliki alat pengukur, knowledge wiring tiap merek mobil, serta prosedur pemasangan yang lebih aman.
        </p>

        <h2 class="text-2xl font-bold text-gray-900 mb-4 mt-8">Kesimpulan</h2>

        <p class="mb-6">
          Upgrade head unit bukan sekadar mengganti layar atau menambah fitur. Ini adalah proses meningkatkan pengalaman berkendara secara keseluruhan, mulai dari audio, navigasi, hingga integrasi kendaraan. Dengan memilih head unit yang tepat, memahami kompatibilitas, dan memastikan pemasangan dilakukan dengan standar profesional, Anda akan mendapatkan hasil maksimal dan kenyamanan yang jauh lebih baik.
        </p>

        <p class="mb-6">
          Jika dilakukan dengan benar, upgrade head unit adalah salah satu investasi terbaik untuk meningkatkan kualitas audio dan nilai estetika interior mobil Anda. Pastikan Anda memilih produk yang sesuai kebutuhan dan selalu prioritaskan pemasangan yang aman.
        </p>
      `,
    },

    4: {
      id: 4,
      title: "Merawat Sistem Audio: Tips Perawatan Berkala",
      image:
        "https://ik.imagekit.io/dzlzhxcdo/Article3.png",
      author: "Rina Putri",
      authorBio: "Teknisi Perawatan Audio",
      date: "05 Mar 2025",
      readTime: "6 menit baca",
      category: "Perawatan",
      categoryColor: "bg-green-500",
      content: `
        <p class="mb-6">
          Sistem audio mobil memerlukan perawatan rutin agar tetap menghasilkan suara yang jernih, kuat, dan stabil. Banyak pengguna hanya fokus pada upgrade perangkat seperti speaker, subwoofer, atau head unit, tanpa memperhatikan pentingnya perawatan berkala. Padahal, mesin audio yang kotor, kabel yang longgar, atau konektor berdebu dapat secara signifikan menurunkan kualitas suara.
        </p>

        <p class="mb-6">
          Dengan melakukan perawatan sederhana namun konsisten, Anda dapat memperpanjang umur perangkat audio, mencegah kerusakan dini, dan menjaga performanya tetap optimal. Berikut beberapa langkah perawatan yang bisa dilakukan secara rutin, baik untuk pemilik mobil harian maupun penggemar audio enthusiast.
        </p>

        <h2 class="text-2xl font-bold text-gray-900 mb-4 mt-8">Periksa Kabel dan Konektor</h2>

        <p class="mb-6">
          Kabel adalah tulang punggung dari seluruh sistem audio. Sedikit kerusakan pada kabel atau konektor dapat menyebabkan gangguan suara seperti noise, humming, atau bahkan hilangnya output total. Oleh karena itu, lakukan pemeriksaan visual setidaknya satu kali setiap bulan.
        </p>

        <p class="mb-6">
          Pastikan tidak ada bagian kabel yang terkelupas, patah, atau terjepit oleh bagian interior mobil. Konektor RCA, terminal subwoofer, dan sambungan head unit merupakan titik-titik yang paling sering mengalami masalah. Jika Anda melihat adanya karat atau oksidasi, bersihkan dengan contact cleaner untuk mengembalikan koneksi yang stabil.
        </p>

        <p class="mb-6">
          Selain itu, pastikan grounding (kabel massa) terpasang kuat dan tidak longgar. Grounding yang buruk dapat menyebabkan suara berdengung atau gangguan listrik lain yang cukup mengganggu.
        </p>

        <h2 class="text-2xl font-bold text-gray-900 mb-4 mt-8">Bersihkan Speaker dari Debu dan Kotoran</h2>

        <p class="mb-6">
          Speaker adalah komponen yang sangat sensitif terhadap debu, terutama pada bagian cone dan surround. Penumpukan debu dapat memengaruhi pergerakan cone, membuat suara menjadi kurang jernih, bahkan pecah pada volume tertentu. Untuk itu, bersihkan speaker secara berkala menggunakan kuas lembut atau blower udara yang aman.
        </p>

        <p class="mb-6">
          Jika speaker memiliki grill atau cover, buka secara hati-hati dan bersihkan bagian dalamnya. Hindari penggunaan lap basah atau cairan pembersih untuk menghindari kerusakan pada material speaker.  
        </p>

        <p class="mb-6">
          Untuk subwoofer, periksa juga enclosure (box) apakah ada celah atau bagian yang longgar. Getaran berlebih dapat menyebabkan suara tidak presisi.
        </p>

        <img src="https://ik.imagekit.io/dzlzhxcdo/Article3(2).png" class="my-6 rounded-lg" alt="Perawatan audio mobil" />

        <h2 class="text-2xl font-bold text-gray-900 mb-4 mt-8">Update Software Head Unit</h2>

        <p class="mb-6">
          Head unit modern dengan sistem operasi Android, Linux, atau OS proprietary biasanya menerima pembaruan firmware dari produsen. Firmware ini dapat meningkatkan performa, memperbaiki bug, atau menambah fitur baru seperti kompatibilitas aplikasi, peningkatan konektivitas Bluetooth, atau perbaikan kestabilan sistem.
        </p>

        <p class="mb-6">
          Lakukan pengecekan rutin pada situs resmi produsen head unit atau melalui menu pengaturan sistem jika tersedia fitur update online. Instal pembaruan firmware hanya dari sumber resmi untuk mencegah kerusakan sistem atau malfungsi.
        </p>

        <p class="mb-6">
          Selain firmware, Anda juga dapat mereset pengaturan audio secara berkala untuk menghapus cache atau bug kecil yang mungkin muncul setelah penggunaan intens.
        </p>

        <h2 class="text-2xl font-bold text-gray-900 mb-4 mt-8">Kesimpulan</h2>

        <p class="mb-6">
          Perawatan sistem audio tidak harus rumit. Dengan langkah sederhana seperti mengecek kabel, membersihkan speaker, dan memperbarui software head unit, Anda sudah bisa menjaga performa audio tetap optimal sepanjang waktu. Perawatan kecil namun konsisten jauh lebih efektif dibandingkan menunggu kerusakan besar yang membutuhkan biaya tinggi.
        </p>

        <p class="mb-6">
          Jika Anda menemukan masalah teknis seperti suara pecah, tidak ada output, atau gangguan sinyal yang tidak teratasi dengan langkah perawatan dasar, segera konsultasikan dengan bengkel audio profesional. Penanganan yang cepat dan tepat akan mencegah kerusakan menyebar ke komponen lain.
        </p>
      `,
    },

    5: {
      id: 5,
      title: "Pilihan Subwoofer untuk Ruang Kabin Kecil",
      image:
        "https://ik.imagekit.io/dzlzhxcdo/Article4(1).png",
      author: "Aan Audio",
      authorBio: "Konsultan Produk Audio",
      date: "18 Mar 2025",
      readTime: "7 menit baca",
      category: "Tips Audio",
      categoryColor: "bg-teal-600",
      content: `
        <p class="mb-6">
          Memilih subwoofer untuk ruang kabin mobil yang kecil bukanlah tugas yang mudah. Banyak pengemudi ingin mendapatkan bass yang dalam dan bertenaga, namun tetap mempertahankan kenyamanan berkendara tanpa memakan terlalu banyak ruang. Oleh karena itu, penting untuk memahami karakteristik subwoofer, ukuran yang paling tepat, serta jenis box yang sesuai agar hasil bass tetap optimal.
        </p>

        <p class="mb-6">
          Selain faktor ukuran, pengaturan lokasi dan jenis enclosure juga sangat menentukan kualitas bass. Kesalahan dalam memilih tipe subwoofer atau penempatan yang kurang tepat bisa menyebabkan bass menjadi boomy, bergetar berlebihan, atau bahkan tidak terdengar sama sekali. Artikel ini akan membahas tips lengkap untuk memilih subwoofer yang ideal bagi mobil dengan ruang kabin kecil.
        </p>

        <h2 class="text-2xl font-bold text-gray-900 mb-4 mt-8">Pilih Ukuran yang Proporsional</h2>

        <p class="mb-6">
          Untuk kabin kecil seperti city car atau hatchback, subwoofer ukuran 8 inci hingga 10 inci merupakan pilihan paling ideal. Ukuran ini mampu menghasilkan bass yang cukup dalam, namun tetap efisien dalam penggunaan ruang. Jika Anda memasang subwoofer terlalu besar seperti 12 inci atau 15 inci, risiko distorsi dan ketidakseimbangan suara akan meningkat, terutama jika ruang kabin tidak mampu mendukung resonansi frekuensi rendah.
        </p>

        <p class="mb-6">
          Selain ukuran, jenis enclosure juga memainkan peran penting. Untuk ruang kecil, sealed enclosure sangat direkomendasikan karena memberikan bass yang lebih rapat, presisi, dan tidak terlalu menggema. Berbeda dengan ported box yang biasanya menghasilkan bass lebih besar namun kurang cocok untuk ruang sempit.
        </p>

        <p class="mb-6">
          Jika Anda ingin kombinasi antara efisiensi ruang dan kualitas suara yang baik, pertimbangkan juga penggunaan subwoofer slim model (shallow mount). Tipe ini dirancang lebih tipis sehingga mudah dipasang di area sempit tanpa mengorbankan kualitas bass.
        </p>

        <h2 class="text-2xl font-bold text-gray-900 mb-4 mt-8">Penempatan Ideal</h2>

        <p class="mb-6">
          Lokasi subwoofer sangat memengaruhi karakteristik suara. Pada mobil dengan bagasi kecil, penempatan subwoofer di area cargo atau dekat bangku belakang adalah pilihan yang logis. Cobalah posisi menghadap ke interior kabin untuk mendapatkan hasil bass yang lebih merata dan tight.
        </p>

        <p class="mb-6">
          Anda juga bisa mencoba penempatan subwoofer menghadap ke pintu bagasi (rear firing). Pada beberapa mobil, pantulan suara dari permukaan pintu belakang justru memberikan efek bass yang lebih tebal dan dalam. Namun, ini sangat bergantung pada struktur mobil, sehingga diperlukan percobaan untuk menentukan posisi terbaik.
        </p>

        <p class="mb-6">
          Jika ruang sangat terbatas, pertimbangkan subwoofer aktif berukuran kecil atau underseat subwoofer. Walaupun tidak sekuat subwoofer box besar, model ini memberikan tambahan bass yang signifikan tanpa menghabiskan ruang bagasi.
        </p>

        <img src="https://ik.imagekit.io/dzlzhxcdo/Article4.png" class="my-6 rounded-lg" alt="Subwoofer mobil" />

        <h2 class="text-2xl font-bold text-gray-900 mb-4 mt-8">Tuning dan Pengaturan</h2>

        <p class="mb-6">
          Setelah memilih subwoofer yang tepat, tuning adalah langkah penting agar bass terasa seimbang dan tidak berlebihan. Atur gain pada amplifier secara bertahap agar menghasilkan bass yang kuat tetapi tetap bersih tanpa clipping. Hindari mengatur gain terlalu tinggi karena dapat menyebabkan kerusakan speaker.
        </p>

        <p class="mb-6">
          Selanjutnya, atur crossover pada rentang 70–100 Hz untuk menjaga agar subwoofer fokus pada frekuensi rendah, sementara speaker door handle frekuensi mid dan high. Pengaturan ini penting untuk menjaga kejernihan vokal dan instrumen.
        </p>

        <p class="mb-6">
          Pengaturan fase (phase) juga dapat membantu menyesuaikan waktu suara subwoofer agar sinkron dengan speaker lainnya. Jika bass terasa hilang atau tidak menyatu, coba ubah phase ke 0° atau 180° untuk menentukan setting yang paling pas.
        </p>

        <h2 class="text-2xl font-bold text-gray-900 mb-4 mt-8">Kesimpulan</h2>

        <p class="mb-6">
          Untuk ruang kabin yang kecil, fokus utama bukan pada ukuran subwoofer sebesar mungkin, tetapi pada keseimbangan antara efisiensi ruang dan kualitas bass. Pilih ukuran subwoofer yang proporsional, gunakan sealed enclosure, dan cari penempatan yang tepat untuk mendapatkan hasil terbaik.
        </p>

        <p class="mb-6">
          Jika Anda ingin hasil maksimal tanpa ribet, tim Aan Audio siap membantu memilihkan subwoofer terbaik berdasarkan jenis mobil, preferensi musik, hingga anggaran Anda. Dengan tuning yang tepat, subwoofer kecil pun bisa menghasilkan bass yang besar.
        </p>
      `,
    },

    6: {
      id: 6,
      title: "Panduan Pemasangan Alarm Mobil yang Aman",
      image:
        "https://ik.imagekit.io/dzlzhxcdo/Article6.png.jpg",
      author: "Joko Wirawan",
      authorBio: "Teknisi Keamanan Kendaraan",
      date: "28 Mar 2025",
      readTime: "6 menit baca",
      category: "Keamanan",
      categoryColor: "bg-amber-500",
      content: `
        <p class="mb-6">
          Pemasangan alarm mobil adalah langkah penting untuk meningkatkan keamanan kendaraan dari risiko pencurian 
          maupun tindakan merusak. Sistem alarm tidak hanya memberikan peringatan suara saat terjadi gangguan, tetapi 
          juga memberi perlindungan aktif melalui sensor-sensor yang bekerja secara otomatis. Panduan ini membahas 
          secara lengkap mulai dari komponen alarm, proses pemasangan, hingga integrasi fitur tambahan yang dapat 
          memperkuat sistem keamanan kendaraan Anda.
        </p>

        <p class="mb-6">
          Dalam dunia otomotif modern, kebutuhan akan sistem keamanan kian meningkat. Banyak pemilik kendaraan 
          memilih memasang alarm aftermarket karena fitur-fiturnya lebih lengkap dibanding alarm bawaan pabrik. 
          Namun, pemasangan yang sembarangan justru dapat menyebabkan alarm error, fitur mobil terganggu, atau 
          terjadi korsleting kelistrikan. Karena itu, pemilihan bengkel dan teknisi berpengalaman sangat berpengaruh 
          terhadap hasil akhir yang aman dan andal.
        </p>

        <h2 class="text-2xl font-bold text-gray-900 mb-4 mt-8">Komponen Utama Alarm</h2>
        <p class="mb-6">
          Setiap sistem alarm terdiri dari sejumlah komponen inti yang masing-masing memiliki peran penting. 
          Sirene berfungsi sebagai penghasil suara ketika alarm aktif, sensor pintu mendeteksi pembukaan paksa, 
          dan sensor getar mengirimkan sinyal ketika ada hentakan, benturan, atau getaran mencurigakan pada kendaraan. 
          Selain itu, unit control module menjadi pusat pengaturan yang mengkoordinasikan kerja seluruh komponen.
        </p>
        <p class="mb-6">
          Remote control atau smart key juga menjadi bagian penting yang memungkinkan pengguna mengaktifkan dan 
          menonaktifkan alarm dengan mudah. Beberapa model modern bahkan sudah mendukung sistem two-way pager, 
          memungkinkan pemilik menerima notifikasi jika alarm berbunyi walaupun berada jauh dari kendaraan.
        </p>
        <p class="mb-6">
          Semua komponen ini harus dipasang pada titik-titik yang tepat dan dirapikan dengan baik. Kabel yang 
          berantakan atau sambungan yang kurang kuat sering kali menjadi penyebab alarm berbunyi sendiri, 
          sehingga kenyamanan dan keamanan justru terganggu.
        </p>

        <h2 class="text-2xl font-bold text-gray-900 mb-4 mt-8">Integrasi dengan Sistem Lain</h2>
        <p class="mb-6">
          Untuk meningkatkan keamanan lebih jauh, sistem alarm dapat digabungkan dengan perangkat lain seperti 
          GPS tracker, immobilizer, dan sensor tambahan. Integrasi GPS memungkinkan pemilik melacak posisi kendaraan 
          secara real-time melalui aplikasi, berguna jika terjadi pencurian atau kehilangan.
        </p>
        <p class="mb-6">
          Sementara itu, immobilizer bekerja dengan cara mengunci sistem pengapian kendaraan. Mesin tidak akan 
          menyala meskipun pencuri berhasil masuk, kecuali menggunakan kunci asli atau otorisasi yang sah. 
          Kombinasi alarm, GPS, dan immobilizer menjadi sistem keamanan berlapis yang sangat sulit ditembus oleh pencuri.
        </p>
        <p class="mb-6">
          Di bengkel Aan Audio, pemasangan sistem integrasi selalu memperhatikan kondisi kelistrikan asli mobil. 
          Kami memastikan semua sambungan aman, tidak mengganggu fitur seperti central lock, power window, sensor 
          parkir, maupun head unit audio. Instalasi yang rapi dan aman adalah kunci dari sistem yang stabil dan 
          tahan lama.
        </p>

        <img 
          src="https://ik.imagekit.io/dzlzhxcdo/Article6(2).png" 
          class="my-6 rounded-lg" 
          alt="Pemasangan alarm mobil" 
        />

        <h2 class="text-2xl font-bold text-gray-900 mb-4 mt-8">Kesimpulan</h2>
        <p class="mb-6">
          Alarm mobil merupakan perlindungan penting untuk menjaga kendaraan tetap aman dari risiko pencurian dan 
          gangguan lainnya. Dengan memilih alarm yang tepat dan memastikan pemasangan dilakukan oleh teknisi 
          profesional, Anda dapat merasakan manfaat keamanan yang maksimal tanpa mengganggu fungsi bawaan kendaraan.
        </p>
        <p class="mb-6">
          Bengkel Aan Audio siap membantu Anda dalam konsultasi, pemilihan perangkat, dan pemasangan alarm mobil 
          yang aman, rapi, serta disesuaikan dengan kebutuhan kendaraan. Sistem keamanan yang baik akan memberikan 
          rasa tenang kapan pun dan di mana pun Anda parkir.
        </p>
      `,
    },

    7: {
      id: 7,
      title: "Tips Mengatur Equalizer untuk Suara Jernih",
      image:
        "https://ik.imagekit.io/dzlzhxcdo/Article7.png",
      author: "Dewi S",
      authorBio: "Audio Engineer",
      date: "02 Apr 2025",
      readTime: "5 menit baca",
      category: "Modifikasi",
      categoryColor: "bg-cyan-600",
      content: `
        <p class="mb-6">
          Equalizer (EQ) adalah salah satu fitur paling penting dalam sistem audio mobil. Dengan EQ, Anda dapat 
          menyesuaikan karakter suara agar sesuai dengan preferensi mendengarkan maupun karakteristik kabin kendaraan. 
          Setiap mobil memiliki akustik yang berbeda, sehingga pengaturan EQ yang tepat dapat membuat suara lebih 
          jernih, seimbang, dan nyaman didengar dalam berbagai genre musik.
        </p>

        <p class="mb-6">
          Banyak pengguna melakukan pengaturan EQ secara berlebihan, seperti menaikkan semua band sekaligus atau 
          meningkatkan bass tanpa mempertimbangkan frekuensi lain. Padahal, penyesuaian kecil yang dilakukan dengan 
          benar sering kali menghasilkan kualitas suara yang jauh lebih baik daripada boosting besar-besaran. 
          Panduan ini membantu Anda memahami langkah dasar dan strategi praktis untuk memperoleh suara yang optimal.
        </p>

        <h2 class="text-2xl font-bold text-gray-900 mb-4 mt-8">Mulai dari Flat</h2>
        <p class="mb-6">
          Langkah awal yang paling benar adalah mengatur semua band EQ ke posisi flat (0 dB). 
          Posisi ini menjadi titik netral untuk menilai karakter asli dari sistem audio Anda. Gunakan lagu referensi 
          berkualitas baik (format lossless atau minimal 320 kbps) untuk mendengarkan bagaimana suara keluar tanpa 
          perubahan apa pun.
        </p>
        <p class="mb-6">
          Setelah itu, lakukan penyesuaian kecil biasanya cukup ±2 hingga 3 dB pada frekuensi yang ingin Anda 
          tonjolkan atau kurangi. Perubahan besar jarang diperlukan, karena dapat membuat suara menjadi tidak natural 
          dan cepat membuat telinga lelah.
        </p>

        <h2 class="text-2xl font-bold text-gray-900 mb-4 mt-8">Fokus pada Mid dan Vocal</h2>
        <p class="mb-6">
          Banyak pendengar menganggap bass yang besar sebagai kunci kualitas audio. Namun sebenarnya, area yang paling 
          krusial untuk kejernihan adalah frekuensi mid dan vocal (sekitar 1–3 kHz). Frekuensi inilah 
          yang menentukan seberapa jelas suara vokal, gitar, piano, hingga detail instrumen lainnya.
        </p>
        <p class="mb-6">
          Jika vokal terdengar tenggelam di antara instrumen, naikkan sedikit frekuensi pada rentang mid tersebut. 
          Sebaliknya, jika suara terasa tajam atau menusuk telinga, turunkan 1–2 dB pada area yang sama. 
          Kuncinya adalah mendengarkan secara perlahan sambil membandingkan perubahan yang Anda lakukan.
        </p>

        <img 
          src="https://ik.imagekit.io/dzlzhxcdo/Article7(2).png"
          class="my-6 rounded-lg"
          alt="Mengatur equalizer"
        />

        <h2 class="text-2xl font-bold text-gray-900 mb-4 mt-8">Penyesuaian Bass dan Treble</h2>
        <p class="mb-6">
          Untuk bass, fokus pada frekuensi rendah sekitar 60–120 Hz. Jika bass terdengar boomy, coba kurangi sedikit 
          pada rentang tersebut. Untuk treble, frekuensi 8–12 kHz berpengaruh pada kejernihan detail seperti cymbal 
          atau ambience. Jangan menaikkannya terlalu tinggi agar tidak menghasilkan suara yang hissy atau terlalu tajam.
        </p>

        <h2 class="text-2xl font-bold text-gray-900 mb-4 mt-8">Gunakan Lagu Referensi</h2>
        <p class="mb-6">
          Selalu gunakan beberapa lagu referensi yang Anda kenal sangat baik. Pilih lagu dengan vokal jelas, bass 
          terkontrol, dan detail instrumen yang kaya. Proses ini membantu Anda mengevaluasi perubahan secara konsisten 
          dan menghindari bias dari satu genre saja.
        </p>

        <h2 class="text-2xl font-bold text-gray-900 mb-4 mt-8">Kesimpulan</h2>
        <p class="mb-6">
          Pengaturan EQ yang baik bergantung pada karakter sistem audio, kondisi kabin mobil, serta preferensi 
          mendengarkan masing-masing pengguna. Lakukan penyesuaian bertahap, hindari boosting berlebihan, dan gunakan 
          lagu referensi untuk menjaga konsistensi. Dengan pendekatan yang tepat, Anda bisa mendapatkan suara yang 
          lebih jernih, seimbang, dan menyenangkan dalam setiap perjalanan.
        </p>
      `,
    },

    8: {
      id: 8,
      title: "Rekomendasi Aksesoris untuk Audio Mobil",
      image:
        "https://ik.imagekit.io/dzlzhxcdo/Article8(2).png",
      author: "Aan Audio",
      authorBio: "Tim Produk Aan Audio",
      date: "12 Apr 2025",
      readTime: "5 menit baca",
      category: "Tips",
      categoryColor: "bg-emerald-600",
      content: `
        <p class="mb-6">
          Aksesoris audio mobil sering kali dianggap sebagai pelengkap saja, padahal kualitas aksesoris sangat 
          menentukan performa akhir dari sistem audio Anda. Pemilihan aksesoris yang tepat tidak hanya memengaruhi 
          kualitas suara, tetapi juga keawetan perangkat serta keamanan instalasi. Banyak masalah seperti noise, 
          suara mendengung, hingga komponen cepat rusak sering kali disebabkan oleh penggunaan aksesoris yang kurang 
          tepat atau berkualitas rendah.
        </p>

        <p class="mb-6">
          Dalam dunia car audio, detail kecil memiliki dampak besar. Mulai dari kualitas kabel, jenis peredam, hingga 
          konektor yang digunakan semuanya berpengaruh pada hasil akhir. Artikel ini memberikan rekomendasi 
          aksesoris penting yang sebaiknya dipertimbangkan ketika Anda melakukan upgrade atau instalasi baru pada 
          sistem audio mobil.
        </p>

        <h2 class="text-2xl font-bold text-gray-900 mb-4 mt-8">Kabel Berkualitas</h2>
        <p class="mb-6">
          Kabel adalah fondasi utama yang menghubungkan seluruh perangkat audio seperti head unit, amplifier, 
          subwoofer, hingga speaker. Menggunakan kabel RCA berkualitas membantu meminimalkan noise dan menjaga sinyal 
          tetap bersih sepanjang jalurnya. Sedangkan kabel power yang tebal dan tahan panas memastikan supply daya 
          stabil untuk amplifier, terutama pada sistem yang membutuhkan arus besar.
        </p>
        <p class="mb-6">
          Selain itu, kabel berkualitas biasanya memiliki lapisan shielding tambahan untuk mencegah interferensi dari 
          unit elektronik mobil lainnya seperti AC, alternator, atau sensor elektronik. Dengan begitu, suara yang 
          dihasilkan lebih jernih, stabil, dan bebas dengung.
        </p>

        <h2 class="text-2xl font-bold text-gray-900 mb-4 mt-8">Isolator dan Peredam Suara</h2>
        <p class="mb-6">
          Sistem audio tidak hanya bergantung pada perangkat elektronik, tetapi juga lingkungan akustik di dalam mobil. 
          Peredam suara seperti lembaran butyl, foam akustik, atau peredam berbahan rubber dapat mengurangi getaran 
          berlebih pada pintu, dashboard, dan bagasi. Pada pintu mobil, resonansi yang berlebihan sering membuat 
          midbass terdengar pecah atau tidak fokus.
        </p>
        <p class="mb-6">
          Dengan pemasangan peredam yang tepat, suara bass menjadi lebih padat dan terkontrol, sementara frekuensi 
          mid dan high terdengar lebih bersih tanpa distorsi dari getaran panel mobil. Tidak hanya meningkatkan kualitas 
          audio, peredam juga mengurangi kebisingan jalan, sehingga kenyamanan berkendara turut meningkat.
        </p>

        <img 
          src="https://ik.imagekit.io/dzlzhxcdo/Article8(3).png" 
          class="my-6 rounded-lg" 
          alt="Aksesoris audio mobil" 
        />

        <h2 class="text-2xl font-bold text-gray-900 mb-4 mt-8">Fuse, Holder, dan Konektor</h2>
        <p class="mb-6">
          Keamanan instalasi audio mobil sangat dipengaruhi oleh penggunaan fuse dan konektor yang berkualitas baik. 
          Fuse holder yang kokoh memastikan perlindungan maksimal jika terjadi arus pendek atau lonjakan listrik. 
          Sementara konektor yang presisi dan tidak mudah longgar menghindarkan dari potensi korsleting atau drop 
          tegangan yang dapat merusak amplifier.
        </p>

        <p class="mb-6">
          Pemilihan terminal speaker yang solid juga mempengaruhi kualitas suara. Konektor yang berkualitas memungkinkan 
          transfer arus lebih stabil ke speaker, menjaga reproduksi suara tetap konsisten, terutama pada volume tinggi.
        </p>

        <h2 class="text-2xl font-bold text-gray-900 mb-4 mt-8">Kesimpulan</h2>
        <p class="mb-6">
          Investasi pada aksesoris berkualitas mungkin terlihat kecil, tetapi dampaknya sangat besar pada performa 
          keseluruhan sistem audio mobil Anda. Mulai dari kabel, peredam, hingga konektor semua berperan penting 
          dalam menjaga kualitas suara tetap optimal sekaligus menambah umur perangkat. Jika Anda ingin mendapatkan 
          hasil terbaik, jangan ragu untuk memilih aksesoris premium dan lakukan pemasangan di bengkel yang berpengalaman.
        </p>
      `,
    },

    9: {
      id: 9,
      title: "Rencana Modifikasi Audio untuk Anggaran Terbatas",
      image:
        "https://ik.imagekit.io/dzlzhxcdo/Article9.png",
      author: "Arif Setiawan",
      authorBio: "Konsultan Modifikasi",
      date: "20 Apr 2025",
      readTime: "8 menit baca",
      category: "Modifikasi",
      categoryColor: "bg-cyan-700",
      content: `
        <p class="mb-6">
          Banyak orang ingin meningkatkan kualitas audio mobil mereka, tetapi terkendala oleh anggaran yang terbatas. 
          Faktanya, modifikasi audio tidak harus selalu mahal. Dengan strategi yang tepat dan pemilihan komponen yang 
          cerdas, Anda bisa mendapatkan peningkatan suara yang sangat signifikan tanpa harus mengganti seluruh sistem 
          atau membeli perangkat premium. Kuncinya adalah perencanaan yang matang dan fokus pada komponen yang 
          memberikan peningkatan terbesar.
        </p>

        <p class="mb-6">
          Dalam modifikasi audio dengan budget terbatas, langkah terbaik adalah menentukan prioritas. Tidak semua bagian 
          harus diganti sekaligus. Ada komponen yang memiliki pengaruh lebih besar terhadap kualitas suara dibanding 
          komponen lain. Dengan memulai dari aspek yang paling krusial, Anda bisa merasakan peningkatan maksimal sejak 
          tahap awal. Sisanya bisa ditingkatkan secara bertahap sesuai kemampuan anggaran.
        </p>

        <h2 class="text-2xl font-bold text-gray-900 mb-4 mt-8">Prioritaskan Komponen Inti</h2>
        <p class="mb-6">
          Komponen pertama yang hampir selalu memberikan peningkatan paling signifikan adalah speaker depan. Speaker 
          bawaan mobil umumnya memiliki kualitas standar dan kurang mampu menghasilkan detail vokal dan midrange yang 
          jernih. Mengganti speaker dengan model aftermarket yang lebih berkualitas adalah langkah awal terbaik dalam 
          modifikasi audio murah.
        </p>

        <p class="mb-6">
          Setelah speaker, tambahkan amplifier 2-channel atau 4-channel. Amplifier membuat suara lebih bersih, 
          bertenaga, dan bebas distorsi. Bahkan speaker standar pun dapat terdengar lebih baik ketika daya yang 
          masuk stabil dan berkualitas. Jika anggaran Anda sangat terbatas, Anda bisa memilih amplifier kelas entry 
          yang tetap mampu memberikan peningkatan signifikan.
        </p>

        <p class="mb-6">
          Subwoofer adalah komponen penting untuk menghasilkan bass dalam, namun bukan prioritas utama ketika budget 
          sangat terbatas. Anda dapat menundanya ke tahap berikutnya. Banyak pengguna audio memilih untuk menambahkan 
          subwoofer setelah speaker dan amplifier sudah terpasang karena karakter bass yang baik baru terasa maksimal 
          ketika mid dan high sudah bersih.
        </p>

        <h2 class="text-2xl font-bold text-gray-900 mb-4 mt-8">Beli yang Tepat, Bukan yang Paling Mahal</h2>
        <p class="mb-6">
          Kesalahan umum dalam modifikasi audio adalah mengejar merek mahal tanpa memahami spesifikasinya. Untuk anggaran 
          terbatas, Anda tidak perlu membeli perangkat premium. Banyak produk entry-level hingga mid-level yang 
          menawarkan kualitas suara luar biasa dengan harga jauh lebih bersahabat. Fokuslah pada spesifikasi seperti 
          sensitivitas speaker, RMS amplifier, dan frekuensi respons daripada hanya melihat branding.
        </p>

        <p class="mb-6">
          Selalu cari review dari pengguna lain atau rekomendasi dari teknisi profesional agar Anda mendapatkan produk 
          dengan reputasi bagus. Terkadang, kombinasi produk yang tepat lebih berpengaruh daripada membeli satu komponen 
          yang sangat mahal. Ingat, sistem audio yang seimbang jauh lebih penting daripada satu komponen premium yang 
          dipaksakan masuk ke dalam budget.
        </p>

        <img 
          src="https://ik.imagekit.io/dzlzhxcdo/Article9(1).png" 
          class="my-6 rounded-lg" 
          alt="Modifikasi audio ekonomis" 
        />

        <h2 class="text-2xl font-bold text-gray-900 mb-4 mt-8">Rencanakan Upgrade Bertahap</h2>
        <p class="mb-6">
          Jika budget benar-benar terbatas, lakukan upgrade secara bertahap. Misalnya, bulan ini ganti speaker, bulan 
          berikutnya tambah amplifier, dan setelah itu barulah memasang subwoofer. Cara ini membuat pengeluaran lebih 
          ringan tetapi tetap memberikan peningkatan kualitas suara secara konsisten dari waktu ke waktu.
        </p>

        <p class="mb-6">
          Upgrade bertahap juga memberi Anda waktu untuk memahami karakter sistem audio mobil Anda. Dengan begitu, Anda 
          bisa menentukan komponen apa yang benar-benar dibutuhkan selanjutnya tanpa terburu-buru membeli hal yang 
          sebenarnya kurang memberikan dampak besar.
        </p>

        <h2 class="text-2xl font-bold text-gray-900 mb-4 mt-8">Kesimpulan</h2>
        <p class="mb-6">
          Modifikasi audio dengan anggaran terbatas sangat memungkinkan jika dilakukan dengan strategi yang tepat. 
          Prioritaskan komponen inti seperti speaker dan amplifier, pilih produk berdasarkan kualitas bukan merek, dan 
          lakukan upgrade secara bertahap. Dengan pendekatan yang cerdas, Anda bisa mendapatkan sistem audio yang 
          berkualitas tinggi tanpa harus menguras kantong. Untuk pemasangan yang rapi dan hasil yang optimal, selalu 
          pertimbangkan menggunakan jasa bengkel profesional yang berpengalaman.
        </p>
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

          {/* Render Article HTML */}
          <div
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: article.content }}
          ></div>
        </motion.div>
      </div>
    </div>
  );
};

export default ArticleDetail;
