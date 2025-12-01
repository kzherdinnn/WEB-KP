import mongoose from "mongoose";
import "dotenv/config";
import sparepartModel from "../models/sparepart.models.js";
import serviceModel from "../models/service.models.js";
import technicianModel from "../models/technician.models.js";
import workshopModel from "../models/workshop.models.js";

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error);
    process.exit(1);
  }
};

// Seed Spareparts
const seedSpareparts = async () => {
  const spareparts = [
    {
      name: "Pioneer TS-G1620F 6.5\" Speaker",
      category: "speaker",
      brand: "Pioneer",
      price: 500000,
      stock: 15,
      lowStockThreshold: 5,
      description: "2-Way Coaxial Speaker 300W",
      specifications: {
        power: "300W",
        impedance: "4 ohm",
        size: "6.5 inch"
      },
      compatibleVehicles: [
        { brand: "Toyota", model: "Avanza", year: "2012-2023" },
        { brand: "Honda", model: "Jazz", year: "2014-2023" }
      ],
      warranty: 12,
      isAvailable: true
    },
    {
      name: "JBL GT7-96 6x9\" Speaker",
      category: "speaker",
      brand: "JBL",
      price: 800000,
      stock: 8,
      lowStockThreshold: 3,
      description: "3-Way Coaxial Speaker 420W",
      specifications: {
        power: "420W",
        impedance: "4 ohm",
        size: "6x9 inch"
      },
      compatibleVehicles: [
        { brand: "Toyota", model: "Innova", year: "2015-2023" },
        { brand: "Mitsubishi", model: "Pajero", year: "2016-2023" }
      ],
      warranty: 12,
      isAvailable: true
    },
    {
      name: "Alpine MRV-F300 Amplifier",
      category: "amplifier",
      brand: "Alpine",
      price: 1500000,
      stock: 5,
      lowStockThreshold: 2,
      description: "4-Channel Car Amplifier 50W x 4",
      specifications: {
        channels: "4",
        power: "50W x 4",
        class: "AB"
      },
      compatibleVehicles: [
        { brand: "All", model: "All", year: "2010-2023" }
      ],
      warranty: 24,
      isAvailable: true
    },
    {
      name: "Rockford Fosgate P3D4-12 Subwoofer",
      category: "subwoofer",
      brand: "Rockford Fosgate",
      price: 2500000,
      stock: 3,
      lowStockThreshold: 2,
      description: "12\" Punch P3 Subwoofer 600W RMS",
      specifications: {
        power: "600W RMS",
        impedance: "4 ohm",
        size: "12 inch"
      },
      compatibleVehicles: [
        { brand: "All", model: "All", year: "2010-2023" }
      ],
      warranty: 12,
      isAvailable: true
    },
    {
      name: "Sony XAV-AX5500 Head Unit",
      category: "headunit",
      brand: "Sony",
      price: 3500000,
      stock: 10,
      lowStockThreshold: 3,
      description: "6.95\" Touch Screen with Apple CarPlay & Android Auto",
      specifications: {
        screenSize: "6.95 inch",
        bluetooth: "Yes",
        carplay: "Yes",
        androidAuto: "Yes"
      },
      compatibleVehicles: [
        { brand: "All", model: "All", year: "2015-2023" }
      ],
      warranty: 12,
      isAvailable: true
    }
  ];

  // Drop old indexes from hotel system
  try {
    await sparepartModel.collection.dropIndexes();
    console.log("✅ Old indexes dropped");
  } catch (error) {
    console.log("ℹ️ No indexes to drop or error dropping indexes");
  }

  await sparepartModel.deleteMany({});
  const createdSpareparts = await sparepartModel.insertMany(spareparts);
  console.log(`✅ ${createdSpareparts.length} Spareparts created`);
};

// Seed Services
const seedServices = async () => {
  const services = [
    {
      name: "Pasang Speaker (Depan + Belakang)",
      category: "installation",
      description: "Instalasi speaker depan dan belakang termasuk kabel dan bracket",
      price: 300000,
      estimatedDuration: 120,
      isAvailable: true
    },
    {
      name: "Pasang Head Unit + Steering Control",
      category: "installation",
      description: "Instalasi head unit lengkap dengan steering wheel control adapter",
      price: 500000,
      estimatedDuration: 180,
      isAvailable: true
    },
    {
      name: "Pasang Amplifier + Subwoofer",
      category: "installation",
      description: "Instalasi amplifier dan subwoofer termasuk power cable dan box",
      price: 800000,
      estimatedDuration: 240,
      isAvailable: true
    },
    {
      name: "Sound System Upgrade Package",
      category: "package",
      description: "Paket upgrade complete: Head unit, speaker, amplifier, subwoofer",
      price: 2000000,
      estimatedDuration: 480,
      isAvailable: true,
      includedItems: ["Head unit installation", "4 speakers installation", "Amplifier + subwoofer", "Sound tuning"]
    },
    {
      name: "Perbaikan Speaker/Amplifier",
      category: "repair",
      description: "Diagnosa dan perbaikan speaker atau amplifier yang rusak",
      price: 200000,
      estimatedDuration: 90,
      isAvailable: true
    },
    {
      name: "Sound Tuning & Optimization",
      category: "consultation",
      description: "Tuning audio system untuk hasil suara optimal",
      price: 150000,
      estimatedDuration: 60,
      isAvailable: true
    }
  ];

  await serviceModel.deleteMany({});
  const createdServices = await serviceModel.insertMany(services);
  console.log(`✅ ${createdServices.length} Services created`);
};

// Seed Technicians
const seedTechnicians = async () => {
  const technicians = [
    {
      name: "Budi Santoso",
      phone: "081234567890",
      email: "budi@workshop.com",
      specialization: ["audio", "installation"],
      isAvailable: true,
      rating: 4.8,
      totalJobs: 150
    },
    {
      name: "Ahmad Wijaya",
      phone: "081234567891",
      email: "ahmad@workshop.com",
      specialization: ["audio", "repair", "tuning"],
      isAvailable: true,
      rating: 4.9,
      totalJobs: 200
    },
    {
      name: "Rudi Hermawan",
      phone: "081234567892",
      email: "rudi@workshop.com",
      specialization: ["installation", "security"],
      isAvailable: true,
      rating: 4.7,
      totalJobs: 120
    }
  ];

  await technicianModel.deleteMany({});
  const createdTechnicians = await technicianModel.insertMany(technicians);
  console.log(`✅ ${createdTechnicians.length} Technicians created`);
};

// Seed Workshop Info
const seedWorkshop = async () => {
  const workshop = {
    name: "AutoSound Workshop",
    address: "Jl. Raya Audio No. 123, Jakarta Selatan",
    contact: "021-12345678",
    city: "Jakarta",
    email: "info@autosound.com",
    description: "Workshop spesialis audio mobil terpercaya sejak 2010",
    openingHours: {
      monday: { open: "09:00", close: "18:00" },
      tuesday: { open: "09:00", close: "18:00" },
      wednesday: { open: "09:00", close: "18:00" },
      thursday: { open: "09:00", close: "18:00" },
      friday: { open: "09:00", close: "18:00" },
      saturday: { open: "09:00", close: "15:00" },
      sunday: { open: "Closed", close: "Closed" }
    },
    timeSlots: ["09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00"],
    maxBookingsPerSlot: 3,
    admin: "user_admin_clerk_id", // Replace with actual Clerk admin ID
    coordinates: {
      lat: -6.2088,
      lng: 106.8456
    },
    isActive: true
  };

  await workshopModel.deleteMany({});
  const createdWorkshop = await workshopModel.create(workshop);
  console.log(`✅ Workshop created: ${createdWorkshop.name}`);
};

// Main Seed Function
const seedAll = async () => {
  console.log("🌱 Starting database seeding...\n");
  
  await connectDB();
  
  try {
    await seedSpareparts();
    await seedServices();
    await seedTechnicians();
    await seedWorkshop();
    
    console.log("\n✅ Database seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("\n❌ Error seeding database:", error);
    process.exit(1);
  }
};

// Run seeder
seedAll();
