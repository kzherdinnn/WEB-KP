import mongoose from "mongoose";
import dotenv from "dotenv";
import serviceModel from "./models/service.models.js";
import Article from "./models/article.model.js";
import sparepartModel from "./models/sparepart.models.js";

dotenv.config();

const spareparts = [
  // HEAD UNITS
  {
    name: "Pioneer DMH-ZF9350BT Android Auto Head Unit",
    category: "headunit",
    brand: "Pioneer",
    price: 4500000,
    discount: 10,
    stock: 5,
    lowStockThreshold: 2,
    description: "Head unit premium Pioneer dengan layar 9 inch, Android Auto, Apple CarPlay, Bluetooth, dan fitur voice control. Dilengkapi dengan 13-band EQ dan DSP untuk tuning audio maksimal.",
    specifications: {
      screenSize: "9 inch",
      resolution: "1280x720",
      bluetooth: "Yes",
      appleCarPlay: "Yes",
      androidAuto: "Yes",
      power: "50W x 4",
      preOut: "3 pairs (front, rear, sub)",
      usbPorts: 2,
      features: ["DSP", "13-band EQ", "Time Alignment", "Voice Control"]
    },
    images: [],
    compatibleVehicles: [
      { brand: "Universal", model: "Double DIN", year: "All" }
    ],
    warranty: 12,
    isAvailable: true,
    isPreOrderOnly: false
  },
  {
    name: "Kenwood DDX9907XR DVD Receiver",
    category: "headunit",
    brand: "Kenwood",
    price: 3200000,
    discount: 0,
    stock: 3,
    description: "DVD receiver Kenwood dengan layar HD 6.8 inch, wireless CarPlay/Android Auto, dan built-in WiFi untuk update firmware.",
    specifications: {
      screenSize: "6.8 inch",
      resolution: "800x480",
      bluetooth: "Yes",
      appleCarPlay: "Wireless",
      androidAuto: "Wireless",
      power: "50W x 4",
      preOut: "3 pairs",
      wifi: "Yes"
    },
    images: [],
    compatibleVehicles: [
      { brand: "Universal", model: "Double DIN", year: "All" }
    ],
    warranty: 12,
    isAvailable: true,
    isPreOrderOnly: false
  },
  {
    name: "Alpine iLX-F309 HALO9 Mech-Less System",
    category: "headunit",
    brand: "Alpine",
    price: 5800000,
    discount: 5,
    stock: 2,
    description: "Head unit flagship Alpine dengan floating design 9 inch anti-glare display, advanced DSP, dan Hi-Res audio support.",
    specifications: {
      screenSize: "9 inch",
      resolution: "1280x720",
      bluetooth: "Yes",
      appleCarPlay: "Yes",
      androidAuto: "Yes",
      power: "50W x 4",
      preOut: "3 pairs + center + subwoofer",
      hiResAudio: "Yes",
      dsp: "Advanced Alpine DSP"
    },
    images: [],
    compatibleVehicles: [
      { brand: "Universal", model: "Custom Install", year: "All" }
    ],
    warranty: 24,
    isAvailable: true,
    isPreOrderOnly: false
  },

  // SPEAKERS
  {
    name: "JBL GTO629 2-Way Coaxial Speaker 6.5 Inch",
    category: "speaker",
    brand: "JBL",
    price: 850000,
    discount: 15,
    stock: 12,
    description: "Speaker coaxial JBL dengan kualitas suara jernih, bass yang dalam, dan instalasi mudah. Cocok untuk upgrade speaker standar mobil.",
    specifications: {
      size: "6.5 inch",
      type: "2-way coaxial",
      powerHandling: "180W peak / 60W RMS",
      sensitivity: "93 dB",
      frequencyResponse: "53Hz - 21kHz",
      impedance: "4 ohm"
    },
    images: [],
    compatibleVehicles: [
      { brand: "Toyota", model: "Avanza, Innova, Fortuner", year: "2015-2024" },
      { brand: "Honda", model: "Jazz, City, Civic, CR-V", year: "2014-2024" },
      { brand: "Daihatsu", model: "Xenia, Terios", year: "2015-2024" }
    ],
    warranty: 12,
    isAvailable: true,
    isPreOrderOnly: false
  },
  {
    name: "Focal PS 165 F3 3-Way Component Speaker",
    category: "speaker",
    brand: "Focal",
    price: 4200000,
    discount: 0,
    stock: 4,
    description: "Speaker component premium Focal dengan 3-way design untuk soundstage yang luas dan detail suara yang presisi. Ideal untuk audiophile.",
    specifications: {
      size: "6.5 inch woofer + 3 inch midrange + tweeter",
      type: "3-way component",
      powerHandling: "160W RMS",
      sensitivity: "92.5 dB",
      frequencyResponse: "60Hz - 28kHz",
      impedance: "4 ohm",
      tweeterType: "Inverted dome aluminum"
    },
    images: [],
    compatibleVehicles: [
      { brand: "Universal", model: "Front doors", year: "All" }
    ],
    warranty: 24,
    isAvailable: true,
    isPreOrderOnly: false
  },
  {
    name: "Morel Maximo Ultra 602 MKII Component",
    category: "speaker",
    brand: "Morel",
    price: 3500000,
    discount: 10,
    stock: 6,
    description: "Speaker component Morel dengan teknologi hybrid magnet dan silk dome tweeter untuk vocal yang sangat natural.",
    specifications: {
      size: "6.5 inch",
      type: "2-way component",
      powerHandling: "100W RMS / 200W peak",
      sensitivity: "88 dB",
      frequencyResponse: "45Hz - 25kHz",
      impedance: "4 ohm"
    },
    images: [],
    compatibleVehicles: [
      { brand: "Universal", model: "All vehicles", year: "All" }
    ],
    warranty: 60,
    isAvailable: true,
    isPreOrderOnly: false
  },

  // SUBWOOFERS
  {
    name: "Rockford Fosgate P3D4-12 Punch 12 Inch Subwoofer",
    category: "subwoofer",
    brand: "Rockford Fosgate",
    price: 3200000,
    discount: 0,
    stock: 8,
    description: "Subwoofer 12 inch dari Rockford Fosgate dengan deep bass dan punch yang powerful. Dual 4-ohm voice coil untuk fleksibilitas wiring.",
    specifications: {
      size: "12 inch",
      voiceCoil: "Dual 4-ohm",
      powerHandling: "600W RMS / 1200W peak",
      sensitivity: "84.33 dB",
      frequencyResponse: "28Hz - 250Hz",
      impedance: "Dual 4-ohm (1 or 4 ohm final)",
      mounting: "10.5 inch"
    },
    images: [],
    compatibleVehicles: [
      { brand: "Universal", model: "Trunk/Custom box", year: "All" }
    ],
    warranty: 12,
    isAvailable: true,
    isPreOrderOnly: false
  },
  {
    name: "JL Audio 10W0v3-4 10 Inch Subwoofer",
    category: "subwoofer",
    brand: "JL Audio",
    price: 2100000,
    discount: 5,
    stock: 10,
    description: "Subwoofer compact 10 inch dari JL Audio dengan bass yang tight dan controlled. Perfect untuk sedan atau compact car.",
    specifications: {
      size: "10 inch",
      voiceCoil: "Single 4-ohm",
      powerHandling: "300W RMS / 600W peak",
      sensitivity: "85.8 dB",
      frequencyResponse: "28Hz - 200Hz",
      impedance: "4 ohm"
    },
    images: [],
    compatibleVehicles: [
      { brand: "Universal", model: "Compact/Sedan", year: "All" }
    ],
    warranty: 24,
    isAvailable: true,
    isPreOrderOnly: false
  },
  {
    name: "Kicker 44CWCS154 CompC 15 Inch Subwoofer",
    category: "subwoofer",
    brand: "Kicker",
    price: 2800000,
    discount: 10,
    stock: 5,
    description: "Subwoofer 15 inch dengan deep bass yang menggelegar. Cocok untuk bass head dan music competition.",
    specifications: {
      size: "15 inch",
      voiceCoil: "Single 4-ohm",
      powerHandling: "500W RMS / 1000W peak",
      sensitivity: "86.7 dB",
      frequencyResponse: "25Hz - 500Hz",
      impedance: "4 ohm"
    },
    images: [],
    compatibleVehicles: [
      { brand: "Universal", model: "Large trunk/SUV", year: "All" }
    ],
    warranty: 12,
    isAvailable: true,
    isPreOrderOnly: false
  },

  // AMPLIFIERS
  {
    name: "Audison Prima AP4.9 bit 4-Channel Amplifier with DSP",
    category: "amplifier",
    brand: "Audison",
    price: 6500000,
    discount: 0,
    stock: 3,
    description: "Amplifier 4-channel premium dengan built-in DSP 9-channel. Kontrol penuh untuk sound tuning dan time alignment.",
    specifications: {
      channels: "4 + 9 DSP channels",
      powerRating: "90W x 4 @ 4 ohm / 130W x 4 @ 2 ohm",
      bridgedPower: "260W x 2 @ 4 ohm",
      dsp: "9-channel DSP with PC software",
      snr: ">105 dB",
      distortion: "<0.02%"
    },
    images: [],
    compatibleVehicles: [
      { brand: "Universal", model: "All vehicles", year: "All" }
    ],
    warranty: 24,
    isAvailable: true,
    isPreOrderOnly: false
  },
  {
    name: "Venom V600.4 4-Channel Car Amplifier",
    category: "amplifier",
    brand: "Venom",
    price: 1800000,
    discount: 15,
    stock: 10,
    description: "Amplifier 4-channel dengan power solid dan harga terjangkau. Cocok untuk speaker component dan coaxial.",
    specifications: {
      channels: "4",
      powerRating: "75W x 4 @ 4 ohm / 150W x 4 @ 2 ohm",
      bridgedPower: "300W x 2 @ 4 ohm",
      frequencyResponse: "10Hz - 30kHz",
      snr: ">95 dB"
    },
    images: [],
    compatibleVehicles: [
      { brand: "Universal", model: "All vehicles", year: "All" }
    ],
    warranty: 12,
    isAvailable: true,
    isPreOrderOnly: false
  },
  {
    name: "Rockford Fosgate R500X1D Prime Monoblock",
    category: "amplifier",
    brand: "Rockford Fosgate",
    price: 2400000,
    discount: 0,
    stock: 7,
    description: "Monoblock amplifier khusus untuk subwoofer dengan 500W RMS power. Compact design dan efisien.",
    specifications: {
      channels: "1 (mono)",
      powerRating: "500W RMS @ 2 ohm / 300W @ 4 ohm",
      bridgedPower: "1-ohm stable",
      classType: "Class D",
      features: ["Variable low-pass crossover", "Bass boost", "Subsonic filter"]
    },
    images: [],
    compatibleVehicles: [
      { brand: "Universal", model: "Subwoofer amplifier", year: "All" }
    ],
    warranty: 12,
    isAvailable: true,
    isPreOrderOnly: false
  },

  // KABEL & WIRING
  {
    name: "Stinger SK4241 4 Gauge Amp Wiring Kit",
    category: "kabel",
    brand: "Stinger",
    price: 650000,
    discount: 0,
    stock: 15,
    description: "Complete wiring kit untuk instalasi amplifier 1000W. Termasuk power cable, ground cable, RCA, dan remote wire.",
    specifications: {
      gauge: "4 AWG",
      powerCable: "20 feet",
      groundCable: "3 feet",
      rca: "17 feet twisted pair",
      fuseholder: "AGU style with 100A fuse",
      maxPower: "1000W"
    },
    images: [],
    compatibleVehicles: [
      { brand: "Universal", model: "All vehicles", year: "All" }
    ],
    warranty: 6,
    isAvailable: true,
    isPreOrderOnly: false
  },
  {
    name: "KnuKonceptz Bassik 8 Gauge Amp Kit",
    category: "kabel",
    brand: "KnuKonceptz",
    price: 450000,
    discount: 10,
    stock: 20,
    description: "Budget-friendly amp kit dengan kualitas kabel yang baik. Cocok untuk sistem audio 500W.",
    specifications: {
      gauge: "8 AWG",
      powerCable: "17 feet",
      groundCable: "3 feet",
      rca: "17 feet",
      fuseholder: "AGU with 60A fuse",
      maxPower: "500W"
    },
    images: [],
    compatibleVehicles: [
      { brand: "Universal", model: "All vehicles", year: "All" }
    ],
    warranty: 6,
    isAvailable: true,
    isPreOrderOnly: false
  },
  {
    name: "Monster Cable XLN 1M Premium RCA Cable",
    category: "kabel",
    brand: "Monster",
    price: 350000,
    discount: 0,
    stock: 25,
    description: "RCA cable premium dengan triple shielding untuk noise rejection maksimal. Konektor gold-plated.",
    specifications: {
      length: "1 meter",
      shielding: "Triple layer",
      connector: "24k gold-plated",
      build: "Oxygen-free copper"
    },
    images: [],
    compatibleVehicles: [
      { brand: "Universal", model: "All vehicles", year: "All" }
    ],
    warranty: 12,
    isAvailable: true,
    isPreOrderOnly: false
  },

  // ACCESSORIES
  {
    name: "Dynamat Xtreme Sound Deadening Kit 9 Sheets",
    category: "accessory",
    brand: "Dynamat",
    price: 1200000,
    discount: 5,
    stock: 12,
    description: "Peredam suara premium Dynamat untuk 2 pintu mobil. Mengurangi road noise dan meningkatkan bass response.",
    specifications: {
      coverage: "9 sheets (36 sq ft)",
      thickness: "0.067 inch",
      coverage: "Approx 2 doors",
      material: "Butyl rubber with aluminum constraining layer"
    },
    images: [],
    compatibleVehicles: [
      { brand: "Universal", model: "Door deadening", year: "All" }
    ],
    warranty: 0,
    isAvailable: true,
    isPreOrderOnly: false
  },
  {
    name: "Stinger RoadKill Expert Series Dampening Material",
    category: "accessory",
    brand: "Stinger",
    price: 850000,
    discount: 10,
    stock: 18,
    description: "Sound dampening material dengan value for money terbaik. Setara Dynamat dengan harga lebih terjangkau.",
    specifications: {
      coverage: "16 sq ft",
      thickness: "60 mil",
      material: "Butyl based",
      application: "Doors, floor, trunk"
    },
    images: [],
    compatibleVehicles: [
      { brand: "Universal", model: "All vehicles", year: "All" }
    ],
    warranty: 0,
    isAvailable: true,
    isPreOrderOnly: false
  },
  {
    name: "PAC SNI-35 Variable LOC Line Output Converter",
    category: "accessory",
    brand: "PAC",
    price: 380000,
    discount: 0,
    stock: 15,
    description: "Line output converter untuk mobil yang belum punya pre-out.Konversi speaker level ke RCA output untuk amplifier.",
    specifications: {
      channels: "2-channel",
      inputRange: "Up to 400W",
      features: ["Auto turn-on", "Variable gain control", "Ground isolation"]
    },
    images: [],
    compatibleVehicles: [
      { brand: "Universal", model: "Factory stereo integration", year: "All" }
    ],
    warranty: 12,
    isAvailable: true,
    isPreOrderOnly: false
  },
  {
    name: "Alpine KTE-S710GR Bass Engine Package for HALO9",
    category: "accessory",
    brand: "Alpine",
    price: 4200000,
    discount: 0,
    stock: 2,
    description: "Bass engine package lengkap dari Alpine termasuk subwoofer 10 inch dan monoblock amplifier. Plug and play dengan Alpine HALO9.",
    specifications: {
      subwoofer: "10 inch Alpine sealed enclosure",
      amplifier: "S-A55V monoblock (550W)",
      type: "Powered subwoofer package",
      wiring: "All cables included"
    },
    images: [],
    compatibleVehicles: [
      { brand: "Universal", model: "Works with Alpine HALO9", year: "All" }
    ],
    warranty: 24,
    isAvailable: true,
    isPreOrderOnly: false
  },
  {
    name: "AudioControl LC2i PRO 2-Channel Line Output Converter",
    category: "accessory",
    brand: "AudioControl",
    price: 1800000,
    discount: 0,
    stock: 5,
    description: "High-level line output converter dengan AccuBASS untuk restore bass yang hilang di factory radio. Fitur GTO signal sensing.",
    specifications: {
      channels: "2-channel",
      inputPower: "Up to 400W per channel",
      features: ["AccuBASS restoration", "GTO signal sensing", "Pre-amp outputs"]
    },
    images: [],
    compatibleVehicles: [
      { brand: "Universal", model: "Factory integration", year: "All" }
    ],
    warranty: 36,
    isAvailable: true,
    isPreOrderOnly: false
  },
  {
    name: "Crunch GTi1200 Ground Pounder Monoblock",
    category: "amplifier",
    brand: "Crunch",
    price: 1600000,
    discount: 20,
    stock: 8,
    description: "Monoblock amplifier dengan power besar untuk subwoofer competition. 1200W RMS dengan harga sangat kompetitif.",
    specifications: {
      channels: "1 (mono)",
      powerRating: "1200W RMS @ 2 ohm",
      bridgedPower: "1-ohm stable (2400W max)",
      classType: "Class D",
      features: ["Variable low-pass", "Bass boost 0-18dB", "Subsonic filter"]
    },
    images: [],
    compatibleVehicles: [
      { brand: "Universal", model: "Competition subwoofer", year: "All" }
    ],
    warranty: 12,
    isAvailable: true,
    isPreOrderOnly: false
  }
];

const services = [
  {
    name: "Instalasi Head Unit Android",
    category: "installation",
    description: "Pemasangan head unit Android lengkap dengan konfigurasi dan setting awal. Termasuk pemasangan kabel, mounting, dan testing fungsi navigasi, musik, dan smartphone connectivity.",
    price: 350000,
    discount: 0,
    estimatedDuration: 120,
    isAvailable: true,
    includedItems: [
      "Pemasangan head unit",
      "Konfigurasi sistem",
      "Testing semua fungsi",
      "Panduan penggunaan"
    ],
    images: []
  },
  {
    name: "Instalasi Speaker Premium",
    category: "installation",
    description: "Pemasangan speaker premium dengan peredam suara untuk kualitas audio maksimal. Meliputi instalasi tweeter, woofer, dan crossover dengan setting acoustic yang tepat.",
    price: 450000,
    discount: 10,
    estimatedDuration: 180,
    isAvailable: true,
    includedItems: [
      "Pemasangan speaker set",
      "Instalasi peredam suara pintu",
      "Sound tuning",
      "Garansi instalasi 6 bulan"
    ],
    images: []
  },
  {
    name: "Instalasi Subwoofer & Amplifier",
    category: "installation",
    description: "Instalasi subwoofer dan power amplifier untuk bass yang lebih dalam dan powerful. Termasuk instalasi kabel power, grounding, dan RCA berkualitas tinggi.",
    price: 500000,
    discount: 0,
    estimatedDuration: 240,
    isAvailable: true,
    includedItems: [
      "Pemasangan subwoofer",
      "Instalasi amplifier",
      "Kabel power & RCA premium",
      "Bass tuning",
      "Garansi 1 tahun"
    ],
    images: []
  },
  {
    name: "Perbaikan Audio Mati Total",
    category: "repair",
    description: "Diagnosa dan perbaikan sistem audio yang mati total. Pengecekan menyeluruh dari head unit, wiring, fuse, hingga speaker untuk menemukan dan memperbaiki masalah.",
    price: 200000,
    discount: 0,
    estimatedDuration: 90,
    isAvailable: true,
    includedItems: [
      "Diagnosa lengkap",
      "Perbaikan kerusakan",
      "Penggantian komponen rusak (jika perlu)",
      "Testing akhir"
    ],
    images: []
  },
  {
    name: "Service & Maintenance Audio Rutin",
    category: "repair",
    description: "Perawatan rutin sistem audio mobil untuk memastikan performa optimal. Meliputi pembersihan, pengecekan koneksi, dan kalibrasi suara.",
    price: 150000,
    discount: 15,
    estimatedDuration: 60,
    isAvailable: true,
    includedItems: [
      "Pembersihan komponen audio",
      "Pengecekan kabel & koneksi",
      "Kalibrasi suara",
      "Rekomendasi perawatan"
    ],
    images: []
  },
  {
    name: "Upgrade Sound System Budget",
    category: "upgrade",
    description: "Paket upgrade audio mobil dengan budget terjangkau namun peningkatan kualitas suara yang signifikan. Cocok untuk pemula yang ingin merasakan audio lebih baik.",
    price: 1500000,
    discount: 5,
    estimatedDuration: 300,
    isAvailable: true,
    includedItems: [
      "Head unit touchscreen",
      "Speaker coaxial 2-way",
      "Instalasi lengkap",
      "Peredam pintu dasar",
      "Sound tuning"
    ],
    images: []
  },
  {
    name: "Upgrade Sound System Mid-Range",
    category: "upgrade",
    description: "Paket upgrade audio untuk kualitas suara yang jauh lebih jernih dan seimbang. Menggunakan komponen berkualitas mid-range dengan hasil maksimal.",
    price: 3500000,
    discount: 10,
    estimatedDuration: 420,
    isAvailable: true,
    includedItems: [
      "Head unit Android premium",
      "Speaker component 3-way",
      "Power amplifier 4 channel",
      "Peredam multi-layer",
      "Professional sound tuning",
      "Garansi 1 tahun"
    ],
    images: []
  },
  {
    name: "Upgrade Sound System Premium",
    category: "upgrade",
    description: "Paket upgrade audio kelas atas untuk pengalaman mendengarkan musik seperti di studio. Menggunakan brand ternama dengan kualitas audiophile grade.",
    price: 7500000,
    discount: 0,
    estimatedDuration: 600,
    isAvailable: true,
    includedItems: [
      "Head unit premium brand",
      "Speaker component high-end",
      "Subwoofer 12 inch",
      "Multi-channel amplifier",
      "DSP (Digital Sound Processor)",
      "Full peredam premium",
      "Professional installation & tuning",
      "Garansi 2 tahun"
    ],
    images: []
  },
  {
    name: "Konsultasi Audio System",
    category: "consultation",
    description: "Konsultasi lengkap mengenai sistem audio mobil yang sesuai dengan kebutuhan dan budget Anda. Termasuk rekomendasi produk dan estimasi biaya.",
    price: 0,
    discount: 0,
    estimatedDuration: 30,
    isAvailable: true,
    includedItems: [
      "Analisa kebutuhan audio",
      "Rekomendasi produk",
      "Estimasi budget",
      "Tips perawatan"
    ],
    images: []
  },
  {
    name: "Custom Audio Competition Build",
    category: "package",
    description: "Paket custom audio untuk kompetisi SPL atau SQ. Dirancang khusus sesuai kategori lomba dengan instalasi profesional dan tuning presisi.",
    price: 15000000,
    discount: 0,
    estimatedDuration: 1200,
    isAvailable: true,
    includedItems: [
      "Custom design box",
      "Competition grade equipment",
      "Multi-amplifier setup",
      "Advanced DSP tuning",
      "Full interior peredam",
      "Professional wiring",
      "Pre-competition testing",
      "Garansi spesial"
    ],
    images: []
  },
  {
    name: "Instalasi Kamera Parkir",
    category: "installation",
    description: "Pemasangan kamera parkir belakang atau 360 derajat untuk memudahkan parkir dan meningkatkan keselamatan berkendara.",
    price: 400000,
    discount: 0,
    estimatedDuration: 120,
    isAvailable: true,
    includedItems: [
      "Instalasi kamera parkir",
      "Pemasangan monitor/integrasi head unit",
      "Wiring rapi",
      "Testing & kalibrasi"
    ],
    images: []
  },
  {
    name: "Perbaikan Speaker Rusak",
    category: "repair",
    description: "Perbaikan speaker yang rusak atau suara pecah. Meliputi penggantian cone, voice coil, atau komponen lain yang rusak.",
    price: 250000,
    discount: 0,
    estimatedDuration: 90,
    isAvailable: true,
    includedItems: [
      "Diagnosa kerusakan speaker",
      "Perbaikan/penggantian komponen",
      "Testing kualitas suara",
      "Garansi perbaikan 3 bulan"
    ],
    images: []
  }
];

const articles = [
  {
    title: "Cara Merawat Audio Mobil Agar Awet dan Jernih",
    slug: "cara-merawat-audio-mobil-awet-jernih",
    excerpt: "Tips sederhana namun efektif untuk merawat sistem audio mobil Anda agar tetap awet dan menghasilkan suara berkualitas tinggi.",
    content: `
      <h2>Mengapa Perawatan Audio Mobil Penting?</h2>
      <p>Sistem audio mobil adalah investasi yang tidak murah. Dengan perawatan yang tepat, sistem audio Anda bisa bertahan bertahun-tahun dengan kualitas suara yang tetap optimal.</p>
      
      <h2>Tips Perawatan Audio Mobil</h2>
      
      <h3>1. Jaga Volume Selalu Proporsional</h3>
      <p>Hindari mendengarkan musik dengan volume maksimal dalam waktu lama. Volume yang terlalu keras dapat merusak speaker dan tweeter lebih cepat. Usahakan volume tidak lebih dari 75-80% kapasitas maksimal.</p>
      
      <h3>2. Bersihkan Komponen Secara Rutin</h3>
      <p>Debu dan kotoran bisa menumpuk pada speaker, tweeter, dan head unit. Bersihkan dengan kain mikrofiber lembut setiap 2 minggu sekali. Untuk speaker, gunakan vacuum cleaner dengan power rendah untuk menyedot debu.</p>
      
      <h3>3. Periksa Koneksi Kabel</h3>
      <p>Koneksi kabel yang longgar atau korosi bisa mengurangi kualitas suara. Periksa koneksi kabel setiap 3 bulan, pastikan semua konektor terpasang dengan kuat dan bersih dari korosi.</p>
      
      <h3>4. Hindari Air dan Kelembaban</h3>
      <p>Jangan biarkan air masuk ke komponen audio. Saat mencuci mobil, lindungi area audio dengan plastik. Kelembaban berlebih juga bisa merusak komponen elektronik.</p>
      
      <h3>5. Gunakan Equalizer dengan Bijak</h3>
      <p>Setting equalizer yang ekstrim bisa membebani speaker. Gunakan setting yang balance dan tidak terlalu boost pada frekuensi tertentu.</p>
      
      <h3>6. Service Rutin</h3>
      <p>Lakukan service rutin minimal 6 bulan sekali di bengkel audio terpercaya. Teknisi akan mengecek kondisi komponen dan melakukan tuning ulang jika diperlukan.</p>
      
      <h2>Tanda-Tanda Audio Perlu Service</h2>
      <ul>
        <li>Suara pecah atau distorsi pada volume normal</li>
        <li>Bass yang kurang nendang atau bergetar tidak normal</li>
        <li>Tweeter yang terdengar sibilant atau terlalu tajam</li>
        <li>Head unit hang atau restart sendiri</li>
        <li>Koneksi Bluetooth sering putus</li>
      </ul>
      
      <h2>Kesimpulan</h2>
      <p>Perawatan audio mobil sebenarnya tidak rumit. Dengan konsisten melakukan langkah-langkah di atas, sistem audio Anda akan awet dan tetap menghasilkan suara berkualitas tinggi untuk waktu yang lama.</p>
    `,
    image: "https://via.placeholder.com/800x400/0d9488/ffffff?text=Artikel+Audio+Mobil",
    category: "Perawatan",
    author: "Tim Aan Audio Solutions",
    readTime: "5 min read",
    isPublished: true
  },
  {
    title: "Panduan Memilih Head Unit yang Tepat untuk Mobil Anda",
    slug: "panduan-memilih-head-unit-mobil",
    excerpt: "Head unit adalah jantung dari sistem audio mobil. Pelajari cara memilih head unit yang sesuai dengan kebutuhan dan budget Anda.",
    content: `
      <h2>Apa itu Head Unit?</h2>
      <p>Head unit adalah pusat kontrol sistem audio mobil yang mengatur semua komponen audio lainnya. Memilih head unit yang tepat sangat penting untuk mendapatkan pengalaman audio yang maksimal.</p>
      
      <h2>Jenis-Jenis Head Unit</h2>
      
      <h3>1. Single DIN</h3>
      <p>Head unit dengan ukuran standar 180mm x 50mm. Cocok untuk mobil-mobil lama yang slot dashboardnya terbatas. Biasanya lebih affordable dan mudah instalasi.</p>
      
      <h3>2. Double DIN</h3>
      <p>Head unit berukuran 180mm x 100mm dengan layar lebih besar. Lebih banyak fitur dan tampilan yang lebih modern dengan touchscreen.</p>
      
      <h3>3. Head Unit Android</h3>
      <p>Head unit yang menggunakan sistem operasi Android, memungkinkan instalasi aplikasi seperti Spotify, Waze, YouTube, dan lainnya. Sangat populer karena versatile.</p>
      
      <h2>Fitur-Fitur Penting yang Perlu Dipertimbangkan</h2>
      
      <h3>Konektivitas</h3>
      <ul>
        <li><strong>Bluetooth:</strong> Wajib untuk hands-free calling dan wireless music streaming</li>
        <li><strong>USB:</strong> Untuk charging dan koneksi smartphone</li>
        <li><strong>Apple CarPlay/Android Auto:</strong> Integrasi smartphone yang seamless</li>
        <li><strong>WiFi:</strong> Untuk update software dan hotspot (pada head unit Android)</li>
      </ul>
      
      <h3>Kualitas Audio</h3>
      <ul>
        <li><strong>RMS Power:</strong> Minimal 50W x 4 channel</li>
        <li><strong>Pre-out:</strong> Untuk koneksi ke amplifier eksternal</li>
        <li><strong>Equalizer:</strong> Minimal 3-band, lebih baik 10-band atau lebih</li>
        <li><strong>DSP (Digital Sound Processor):</strong> Untuk tuning audio lebih advanced</li>
      </ul>
      
      <h3>Layar dan Interface</h3>
      <ul>
        <li>Resolusi layar minimal 800x480</li>
        <li>Touchscreen yang responsif</li>
        <li>User interface yang mudah digunakan</li>
        <li>Brightness yang adjustable untuk siang/malam</li>
      </ul>
      
      <h2>Brand Rekomendasi</h2>
      
      <h3>Budget (1-2 juta)</h3>
      <p>JVC, Kenwood, Pioneer seri entry-level - Fitur basic namun reliable</p>
      
      <h3>Mid-Range (2-4 juta)</h3>
      <p>Alpine, Kenwood, Pioneer seri menengah - Fitur lengkap dengan kualitas audio yang baik</p>
      
      <h3>Premium (4 juta ke atas)</h3>
      <p>Alpine F9, Pioneer Z-Series, Kenwood Excelon - Top-tier features dengan audio quality terbaik</p>
      
      <h2>Tips Memilih</h2>
      <ol>
        <li>Sesuaikan dengan ukuran dashboard mobil Anda</li>
        <li>Prioritaskan fitur yang benar-benar Anda butuhkan</li>
        <li>Pastikan kompatibel dengan smartphone Anda</li>
        <li>Pertimbangkan rencana upgrade audio di masa depan</li>
        <li>Beli dari toko terpercaya dengan garansi resmi</li>
      </ol>
      
      <h2>Kesimpulan</h2>
      <p>Head unit yang tepat bisa memberikan pengalaman berkendara yang jauh lebih menyenangkan. Jangan ragu untuk konsultasi dengan ahli audio sebelum membeli untuk memastikan pilihan Anda tepat.</p>
    `,
    image: "https://via.placeholder.com/800x400/0d9488/ffffff?text=Artikel+Audio+Mobil",
    category: "Tips Audio",
    author: "Tim Aan Audio Solutions",
    readTime: "7 min read",
    isPublished: true
  },
  {
    title: "Speaker Coaxial vs Component: Mana yang Lebih Baik?",
    slug: "speaker-coaxial-vs-component",
    excerpt: "Bingung memilih antara speaker coaxial dan component? Simak perbedaan, kelebihan, dan kekurangan masing-masing untuk menentukan yang terbaik untuk mobil Anda.",
    content: `
      <h2>Perbedaan Mendasar</h2>
      <p>Speaker coaxial dan component adalah dua jenis speaker yang paling umum digunakan pada sistem audio mobil. Masing-masing memiliki karakteristik yang berbeda.</p>
      
      <h2>Speaker Coaxial</h2>
      
      <h3>Apa itu Speaker Coaxial?</h3>
      <p>Speaker coaxial memiliki tweeter yang terintegrasi di tengah woofer, membentuk satu unit speaker yang compact. Semua driver suara berada dalam satu frame.</p>
      
      <h3>Kelebihan Speaker Coaxial:</h3>
      <ul>
        <li><strong>Lebih Murah:</strong> Harga lebih terjangkau dibanding component</li>
        <li><strong>Instalasi Mudah:</strong> Hanya perlu memasang satu unit speaker</li>
        <li><strong>Space Efficient:</strong> Tidak perlu ruang tambahan untuk tweeter</li>
        <li><strong>Cocok untuk Stock Audio:</strong> Upgrade mudah dari speaker bawaan</li>
      </ul>
      
      <h3>Kekurangan Speaker Coaxial:</h3>
      <ul>
        <li>Staging dan imaging kurang optimal</li>
        <li>Tweeter tidak bisa diarahkan</li>
        <li>Kualitas suara tidak sejernih component</li>
        <li>Terbatas untuk upgrade audio mid-high level</li>
      </ul>
      
      <h2>Speaker Component</h2>
      
      <h3>Apa itu Speaker Component?</h3>
      <p>Speaker component memisahkan tweeter dan woofer dalam unit terpisah, dilengkapi dengan crossover pasif untuk membagi frekuensi secara optimal.</p>
      
      <h3>Kelebihan Speaker Component:</h3>
      <ul>
        <li><strong>Kualitas Suara Superior:</strong> Separation yang lebih baik antara high dan mid frequency</li>
        <li><strong>Staging Lebih Baik:</strong> Tweeter bisa diposisikan untuk soundstage optimal</li>
        <li><strong>Imaging Presisi:</strong> Suara terdengar lebih 3D dan realistic</li>
        <li><strong>Upgrade Friendly:</strong> Bisa dikombinasi dengan amplifier dan DSP</li>
      </ul>
      
      <h3>Kekurangan Speaker Component:</h3>
      <ul>
        <li>Harga lebih mahal</li>
        <li>Instalasi lebih complex</li>
        <li>Butuh ruang untuk tweeter dan crossover</li>
        <li>Perlu tuning yang tepat untuk hasil maksimal</li>
      </ul>
      
      <h2>Perbandingan Langsung</h2>
      
      <table>
        <tr>
          <th>Aspek</th>
          <th>Coaxial</th>
          <th>Component</th>
        </tr>
        <tr>
          <td>Harga</td>
          <td>Rp 300rb - 1jt</td>
          <td>Rp 800rb - 10jt+</td>
        </tr>
        <tr>
          <td>Instalasi</td>
          <td>Mudah (30-60 menit)</td>
          <td>Complex (2-4 jam)</td>
        </tr>
        <tr>
          <td>Kualitas Suara</td>
          <td>Good</td>
          <td>Excellent</td>
        </tr>
        <tr>
          <td>Soundstage</td>
          <td>Average</td>
          <td>Superior</td>
        </tr>
      </table>
      
      <h2>Mana yang Sebaiknya Dipilih?</h2>
      
      <h3>Pilih Coaxial Jika:</h3>
      <ul>
        <li>Budget terbatas (di bawah 1 juta)</li>
        <li>Hanya ingin upgrade sederhana dari speaker stock</li>
        <li>Tidak ada rencana upgrade audio lebih lanjut</li>
        <li>Menginginkan instalasi cepat dan mudah</li>
      </ul>
      
      <h3>Pilih Component Jika:</h3>
      <ul>
        <li>Menginginkan kualitas audio terbaik</li>
        <li>Berencana build audio system yang serius</li>
        <li>Sudah memiliki atau akan menambahkan amplifier</li>
        <li>Audiophile yang senang dengan detail suara</li>
      </ul>
      
      <h2>Rekomendasi</h2>
      <p>Untuk hasil terbaik, kami merekomendasikan speaker component dengan power amplifier. Namun, jika budget terbatas, speaker coaxial berkualitas baik sudah cukup untuk upgrade dari speaker stock.</p>
      
      <h2>Kesimpulan</h2>
      <p>Tidak ada jawaban mutlak mana yang lebih baik. Semua tergantung kebutuhan, budget, dan ekspektasi Anda terhadap kualitas audio. Konsultasikan dengan ahli audio untuk rekomendasi yang sesuai dengan mobil dan budget Anda.</p>
    `,
    image: "https://via.placeholder.com/800x400/0d9488/ffffff?text=Artikel+Audio+Mobil",
    category: "Tips Audio",
    author: "Tim Aan Audio Solutions",
    readTime: "6 min read",
    isPublished: true
  },
  {
    title: "Pentingnya Peredam Suara untuk Audio Mobil",
    slug: "pentingnya-peredam-suara-audio-mobil",
    excerpt: "Peredam suara sering diabaikan, padahal sangat penting untuk kualitas audio mobil. Ketahui manfaat dan jenis-jenis peredam yang tepat.",
    content: `
      <h2>Mengapa Peredam Suara Penting?</h2>
      <p>Banyak orang fokus pada head unit, speaker, dan amplifier, tapi melupakan peredam suara. Padahal, peredam adalah foundation dari sistem audio berkualitas.</p>
      
      <h2>Masalah Tanpa Peredam Suara</h2>
      
      <h3>1. Resonansi Panel</h3>
      <p>Panel pintu dan dinding mobil yang tipis akan bergetar saat speaker bekerja, terutama pada bass. Ini menimbulkan bunyi berdengung yang mengganggu.</p>
      
      <h3>2. Road Noise</h3>
      <p>Suara dari luar seperti angin, ban, dan mesin masuk ke kabin, mengganggu kejernihan audio terutama pada volume rendah.</p>
      
      <h3>3. Bass Kurang Nendang</h3>
      <p>Tanpa peredam, energi bass banyak yang "bocor" keluar, membuat bass terasa kurang powerful dan dalam.</p>
      
      <h2>Manfaat Peredam Suara</h2>
      
      <h3>Untuk Audio:</h3>
      <ul>
        <li>Bass lebih dalam dan kontrol</li>
        <li>Midbass lebih bulat dan detail</li>
        <li>Vokal dan instrumen lebih jelas</li>
        <li>Soundstage lebih lebar</li>
        <li>Eliminasi resonansi dan distorsi</li>
      </ul>
      
      <h3>Untuk Kenyamanan Berkendara:</h3>
      <ul>
        <li>Kabin lebih senyap dari road noise</li>
        <li>Mengurangi kelelahan saat perjalanan jauh</li>
        <li>Percakapan lebih nyaman</li>
        <li>AC lebih dingin (insulasi thermal)</li>
      </ul>
      
      <h2>Jenis-Jenis Peredam Suara</h2>
      
      <h3>1. Deadening (Mass Loaded Vinyl)</h3>
      <p><strong>Fungsi:</strong> Menambah massa panel untuk mengurangi resonansi</p>
      <p><strong>Penempatan:</strong> Lapisan pertama di pintu, lantai, atap</p>
      <p><strong>Brand:</strong> Dynamat, Voodoo, Stinger</p>
      
      <h3>2. Sound Barrier (Foam Barrier)</h3>
      <p><strong>Fungsi:</strong> Memblokir noise dari luar masuk ke kabin</p>
      <p><strong>Penempatan:</strong> Lapisan kedua setelah deadening</p>
      <p><strong>Brand:</strong> B-Quiet, Silent Coat</p>
      
      <h3>3. Absorption (Acoustic Foam)</h3>
      <p><strong>Fungsi:</strong> Menyerap echo dan refleksi suara dalam kabin</p>
      <p><strong>Penempatan:</strong> Atap, pilar, panel samping</p>
      <p><strong>Brand:</strong> Focal BAM, Audison</p>
      
      <h2>Area yang Perlu Diredam</h2>
      
      <h3>Prioritas Tinggi:</h3>
      <ol>
        <li><strong>Pintu:</strong> Tempat speaker berada, paling krusial</li>
        <li><strong>Lantai:</strong> Sumber road noise terbesar</li>
        <li><strong>Firewall:</strong> Memblokir noise mesin</li>
      </ol>
      
      <h3>Prioritas Sedang:</h3>
      <ol>
        <li><strong>Atap:</strong> Mengurangi echo dan rain noise</li>
        <li><strong>Bagasi:</strong> Terutama jika ada subwoofer</li>
      </ol>
      
      <h3>Opsional (Premium Build):</h3>
      <ol>
        <li>Dashboard</li>
        <li>Pilar A, B, C</li>
        <li>Wheel well</li>
      </ol>
      
      <h2>Budget Peredam Suara</h2>
      
      <h3>Basic (Rp 500rb - 1jt)</h3>
      <p>Peredam 2 pintu depan dengan deadening layer. Sudah memberikan improvement signifikan.</p>
      
      <h3>Standard (Rp 1.5jt - 3jt)</h3>
      <p>Peredam 4 pintu + lantai dengan deadening dan barrier layer. Recommended untuk audio mid-range.</p>
      
      <h3>Premium (Rp 4jt - 8jt)</h3>
      <p>Full peredam termasuk atap, firewall, bagasi dengan multi-layer premium materials. Untuk audio competition atau enthusiast.</p>
      
      <h2>Tips Instalasi Peredam</h2>
      <ul>
        <li>Bersihkan permukaan panel sebelum menempel</li>
        <li>Gunakan roller untuk memastikan perekat menempel sempurna</li>
        <li>Tidak perlu menutup 100% area, 60-70% sudah efektif</li>
        <li>Fokus pada area yang paling bergetar</li>
        <li>Hindari instalasi saat hujan atau udara lembab</li>
      </ul>
      
      <h2>Kesimpulan</h2>
      <p>Peredam suara adalah investasi yang sangat worth it. Bahkan dengan sistem audio sederhana, penambahan peredam bisa memberikan peningkatan kualitas suara yang dramatis. Untuk hasil maksimal, kombinasikan dengan speaker dan amplifier berkualitas.</p>
    `,
    image: "https://via.placeholder.com/800x400/0d9488/ffffff?text=Artikel+Audio+Mobil",
    category: "Modifikasi",
    author: "Tim Aan Audio Solutions",
    readTime: "8 min read",
    isPublished: true
  },
  {
    title: "Subwoofer: Ukuran 10, 12, atau 15 Inch?",
    slug: "memilih-ukuran-subwoofer",
    excerpt: "Panduan lengkap memilih ukuran subwoofer yang tepat untuk karakter bass yang Anda inginkan dan sesuai dengan ruang bagasi mobil.",
    content: `
      <h2>Peran Subwoofer dalam Audio System</h2>
      <p>Subwoofer bertugas mereproduksi frekuensi rendah (bass) yang tidak bisa dijangkau oleh speaker biasa. Bass yang baik membuat musik terasa lebih hidup dan powerful.</p>
      
      <h2>Karakteristik Berdasarkan Ukuran</h2>
      
      <h3>Subwoofer 10 Inch</h3>
      <p><strong>Karakter Bass:</strong> Tight, cepat, dan punch</p>
      <p><strong>Cocok Untuk:</strong> Rock, metal, EDM upbeat, musik dengan tempo cepat</p>
      <p><strong>Kelebihan:</strong></p>
      <ul>
        <li>Respon bass lebih cepat dan artikulatif</li>
        <li>Box lebih compact, hemat ruang bagasi</li>
        <li>Power requirement lebih rendah</li>
        <li>Harga lebih terjangkau</li>
      </ul>
      <p><strong>Kekurangan:</strong></p>
      <ul>
        <li>Deep bass kurang dalam dibanding ukuran lebih besar</li>
        <li>SPL (sound pressure level) lebih rendah</li>
        <li>Kurang cocok untuk bass head</li>
      </ul>
      
      <h3>Subwoofer 12 Inch</h3>
      <p><strong>Karakter Bass:</strong> Balance antara punch dan depth</p>
      <p><strong>Cocok Untuk:</strong> Semua genre musik, paling versatile</p>
      <p><strong>Kelebihan:</strong></p>
      <ul>
        <li>Sweet spot antara kecepatan dan kedalaman bass</li>
        <li>Cocok untuk sebagian besar jenis musik</li>
        <li>Banyak pilihan produk dan harga</li>
        <li>Box size masih reasonable</li>
      </ul>
      <p><strong>Kekurangan:</strong></p>
      <ul>
        <li>Tidak excellent di satu karakteristik tertentu</li>
        <li>Power requirement lebih tinggi dari 10"</li>
      </ul>
      
      <h3>Subwoofer 15 Inch (atau lebih)</h3>
      <p><strong>Karakter Bass:</strong> Deep, rumbling, powerful</p>
      <p><strong>Cocok Untuk:</strong> Hip-hop, reggae, dubstep, bass head</p>
      <p><strong>Kelebihan:</strong></p>
      <ul>
        <li>Deep bass sangat dalam dan powerful</li>
        <li>SPL tinggi, bisa sangat loud</li>
        <li>Physical impact yang terasa</li>
        <li>Cocok untuk kompetisi SPL</li>
      </ul>
      <p><strong>Kekurangan:</strong></p>
      <ul>
        <li>Box sangat besar, makan banyak ruang bagasi</li>
        <li>Butuh amplifier powerful (500W+)</li>
        <li>Harga lebih mahal</li>
        <li>Bass bisa terasa boomy jika tidak di-tune dengan baik</li>
      </ul>
      
      <h2>Faktor Penentu Pilihan</h2>
      
      <h3>1. Genre Musik Favorit</h3>
      <blockquote>
        <p><strong>Jazz, Vocal, Acoustic:</strong> 10" sudah cukup</p>
        <p><strong>Pop, Rock, EDM:</strong> 12" paling cocok</p>
        <p><strong>Hip-hop, Reggae, Dubstep:</strong> 15" atau dual 12"</p>
      </blockquote>
      
      <h3>2. Ukuran Bagasi</h3>
      <p>Ukur ruang bagasi yang available. Jangan sampai subwoofer box terlalu besar dan mengganggu fungsi bagasi.</p>
      
      <h3>3. Budget</h3>
      <ul>
        <li>10" + Amp: Rp 1.5jt - 3jt</li>
        <li>12" + Amp: Rp 2.5jt - 5jt</li>
        <li>15" + Amp: Rp 4jt - 10jt+</li>
      </ul>
      
      <h3>4. Power Available</h3>
      <p>Pastikan amplifier Anda bisa deliver power yang cukup untuk subwoofer pilihan Anda.</p>
      
      <h2>Tipe Box Subwoofer</h2>
      
      <h3>Sealed Box</h3>
      <p><strong>Karakter:</strong> Bass tight, accurate, controlled</p>
      <p><strong>Cocok untuk:</strong> SQ (Sound Quality) oriented</p>
      <p><strong>Ukuran box:</strong> Lebih compact</p>
      
      <h3>Ported Box</h3>
      <p><strong>Karakter:</strong> Bass lebih loud, deep, powerful</p>
      <p><strong>Cocok untuk:</strong> SPL (Sound Pressure Level) oriented</p>
      <p><strong>Ukuran box:</strong> Lebih besar dari sealed</p>
      
      <h3>Bandpass Box</h3>
      <p><strong>Karakter:</strong> Sangat loud pada frekuensi tertentu</p>
      <p><strong>Cocok untuk:</strong> Kompetisi SPL</p>
      <p><strong>Ukuran box:</strong> Paling besar dan complex</p>
      
      <h2>Rekomendasi Setup</h2>
      
      <h3>Entry Level (Budget 2-3jt)</h3>
      <p>Single 10" + Monoblock 300W dalam sealed box</p>
      
      <h3>Mid Range (Budget 3-6jt)</h3>
      <p>Single 12" + Monoblock 500W dalam ported/sealed box</p>
      
      <h3>High End (Budget 7jt+)</h3>
      <p>Dual 12" atau Single 15" + Monoblock 1000W+ dalam custom box</p>
      
      <h2>Tips Memilih Subwoofer</h2>
      <ol>
        <li>Jangan hanya fokus pada ukuran, brand dan kualitas juga penting</li>
        <li>Match impedance subwoofer dengan amplifier</li>
        <li>Ukur ruang bagasi sebelum membeli</li>
        <li>Pertimbangkan instalasi profesional untuk hasil maksimal</li>
        <li>Budget untuk box berkualitas, jangan asal box murahan</li>
      </ol>
      
      <h2>Kesimpulan</h2>
      <p>Untuk mayoritas pengguna, subwoofer 12 inch adalah pilihan terbaik karena versatile dan balance. Namun, jika Anda punya preferensi musik atau karakteristik bass tertentu, sesuaikan dengan panduan di atas. Yang terpenting adalah matching dengan komponen lain dan instalasi yang benar.</p>
    `,
    image: "https://via.placeholder.com/800x400/0d9488/ffffff?text=Artikel+Audio+Mobil",
    category: "Tips Audio",
    author: "Tim Aan Audio Solutions",
    readTime: "7 min read",
    isPublished: true
  },
  {
    title: "5 Kesalahan Umum dalam Instalasi Audio Mobil",
    slug: "kesalahan-instalasi-audio-mobil",
    excerpt: "Hindari kesalahan-kesalahan yang sering terjadi saat instalasi audio mobil. Belajar dari pengalaman untuk hasil instalasi yang maksimal.",
    content: `
      <h2>Pendahuluan</h2>
      <p>Instalasi audio mobil yang salah tidak hanya menghasilkan kualitas suara yang buruk, tapi juga bisa merusak komponen atau bahkan menimbulkan bahaya. Berikut kesalahan yang sering terjadi dan cara menghindarinya.</p>
      
      <h2>1. Mengabaikan Grounding yang Proper</h2>
      
      <h3>Kesalahan:</h3>
      <p>Grounding amplifier atau komponen audio di lokasi yang tidak tepat, seperti di plastik, cat, atau area yang berkarat.</p>
      
      <h3>Dampak:</h3>
      <ul>
        <li>Noise dan hum pada audio</li>
        <li>Amplifier protect atau mati</li>
        <li>Komponen cepat rusak</li>
        <li>Potensial short circuit</li>
      </ul>
      
      <h3>Solusi:</h3>
      <ul>
        <li>Ground ke metal chassis langsung (bukan cat)</li>
        <li>Bersihkan area grounding hingga shiny metal</li>
        <li>Gunakan kabel ground yang tebal (minimal 8 AWG)</li>
        <li>Pastikan baut ground tertancap kuat</li>
        <li>Ground point se-dekat mungkin dengan amplifier</li>
      </ul>
      
      <h2>2. Kabel Power yang Undersized</h2>
      
      <h3>Kesalahan:</h3>
      <p>Menggunakan kabel power yang terlalu kecil untuk wattage amplifier yang digunakan.</p>
      
      <h3>Dampak:</h3>
      <ul>
        <li>Voltage drop, audio tidak maksimal</li>
        <li>Kabel panas, risiko kebakaran</li>
        <li>Amplifier tidak dapat full power</li>
        <li>Bass terdengar kurang punch</li>
      </ul>
      
      <h3>Solusi:</h3>
      <blockquote>
        <p><strong>0-500W:</strong> Kabel 8 AWG</p>
        <p><strong>501-1000W:</strong> Kabel 4 AWG</p>
        <p><strong>1001-1500W:</strong> Kabel 2 AWG</p>
        <p><strong>1500W+:</strong> Kabel 0 AWG atau lebih besar</p>
      </blockquote>
      <p>Tambahkan inline fuse di dekat battery (jarak max 45cm dari battery terminal).</p>
      
      <h2>3. Instalasi RCA yang Buruk</h2>
      
      <h3>Kesalahan:</h3>
      <p>Routing kabel RCA berdekatan atau sejajar dengan kabel power, menggunakan RCA murahan, atau koneksi yang longgar.</p>
      
      <h3>Dampak:</h3>
      <ul>
        <li>Engine whine atau alternator noise</li>
        <li>Static noise</li>
        <li>Kualitas audio menurun</li>
      </ul>
      
      <h3>Solusi:</h3>
      <ul>
        <li>Route RCA di sisi berlawanan dari kabel power</li>
        <li>Jika harus cross, lakukan dengan sudut 90 derajat</li>
        <li>Gunakan RCA berkualitas dengan shielding baik</li>
        <li>Pastikan koneksi RCA kencang dan bersih</li>
        <li>Pertimbangkan twisted pair atau differential RCA</li>
      </ul>
      
      <h2>4. Setting Gain yang Salah</h2>
      
      <h3>Kesalahan:</h3>
      <p>Mengira gain adalah volume control dan memutar gain amplifier maksimal untuk suara lebih keras.</p>
      
      <h3>Dampak:</h3>
      <ul>
        <li>Clipping dan distorsi</li>
        <li>Speaker atau tweeter terbakar</li>
        <li>Suara pecah dan tidak jernih</li>
      </ul>
      
      <h3>Cara Setting Gain yang Benar:</h3>
      <ol>
        <li>Set semua tone control (bass, treble, loudness) ke flat/off</li>
        <li>Putar volume head unit ke 75-80%</li>
        <li>Putar gain amplifier dari minimum sambil dengar musik</li>
        <li>Naikkan gain perlahan hingga tepat sebelum terdengar distorsi</li>
        <li>Turunkan sedikit dari titik tersebut</li>
        <li>Test dengan berbagai volume, pastikan tidak ada clipping</li>
      </ol>
      
      <h2>5. Mengabaikan Crossover Setting</h2>
      
      <h3>Kesalahan:</h3>
      <p>Membiarkan crossover di setting default atau asal setting tanpa memahami frequency response speaker.</p>
      
      <h3>Dampak:</h3>
      <ul>
        <li>Tweeter rusak karena kebagian bass</li>
        <li>Subwoofer main di mid frequency</li>
        <li>Suara tidak blend dengan baik</li>
        <li>Hole di frequency response</li>
      </ul>
      
      <h3>Solusi:</h3>
      <p><strong>Untuk Front Speaker (Component):</strong></p>
      <ul>
        <li>HPF (High Pass Filter): 60-80 Hz</li>
        <li>Tweeter: HPF 3.5-4 kHz (via passive crossover)</li>
      </ul>
      
      <p><strong>Untuk Subwoofer:</strong></p>
      <ul>
        <li>LPF (Low Pass Filter): 60-80 Hz</li>
        <li>Subsonic filter: 20-25 Hz (untuk ported box)</li>
      </ul>
      
      <p><strong>Tips:</strong> Overlap sedikit antara subwoofer dan front speaker untuk transition yang smooth.</p>
      
      <h2>Bonus: Kesalahan Lainnya</h2>
      
      <h3>6. Skip Peredam Suara</h3>
      <p>Menghabiskan jutaan untuk speaker tapi tidak pasang peredam = membuang uang. Minimal redam 2 pintu depan.</p>
      
      <h3>7. Instalasi Asal-asalan</h3>
      <p>Kabel berantakan, tidak di-loom, instalasi tidak rapi. Selain tidak aman, troubleshooting jadi susah.</p>
      
      <h3>8. Tidak Upgrade Electrical System</h3>
      <p>Sistem besar (1000W+) butuh upgrade alternator, battery, atau capacitor bank. Jangan paksa electrical stock.</p>
      
      <h2>Kesimpulan</h2>
      <p>Instalasi audio yang benar adalah fondasi dari sistem audio berkualitas. Lebih baik invest waktu dan usaha untuk instalasi yang proper daripada beli komponen mahal tapi instalasi sembarangan. Jika ragu, selalu gunakan jasa installer profesional.</p>
    `,
    image: "https://via.placeholder.com/800x400/0d9488/ffffff?text=Artikel+Audio+Mobil",
    category: "Tips Audio",
    author: "Tim Aan Audio Solutions",
    readTime: "9 min read",
    isPublished: true
  }
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    // Clear existing data
    console.log("🗑️  Clearing existing data...");
    await serviceModel.deleteMany({});
    await Article.deleteMany({});
    await sparepartModel.deleteMany({});
    console.log("✅ Existing data cleared");

    // Insert spareparts
    console.log("🔧 Inserting spareparts...");
    const insertedSpareparts = await sparepartModel.insertMany(spareparts);
    console.log(`✅ ${insertedSpareparts.length} spareparts inserted`);

    // Insert services
    console.log("📦 Inserting services...");
    const insertedServices = await serviceModel.insertMany(services);
    console.log(`✅ ${insertedServices.length} services inserted`);

    // Insert articles
    console.log("📝 Inserting articles...");
    const insertedArticles = await Article.insertMany(articles);
    console.log(`✅ ${insertedArticles.length} articles inserted`);

    console.log("\n🎉 Database seeding completed successfully!");
    console.log("\n📊 Summary:");
    console.log(`   - Spareparts: ${insertedSpareparts.length}`);
    console.log(`   - Services: ${insertedServices.length}`);
    console.log(`   - Articles: ${insertedArticles.length}`);
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
};

// Run the seeding
seedDatabase();
