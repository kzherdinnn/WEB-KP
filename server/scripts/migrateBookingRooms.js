import mongoose from "mongoose";
import dotenv from "dotenv";
import bookingModel from "../models/booking.models.js";

dotenv.config();

const migrateBookingRooms = async () => {
  try {
    console.log("🚀 Starting Booking numberOfRooms Migration...");
    console.log("=".repeat(60));

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    // Find all bookings that don't have numberOfRooms set
    const bookingsToUpdate = await bookingModel.find({
      $or: [
        { numberOfRooms: { $exists: false } },
        { numberOfRooms: null },
      ],
    });

    console.log(`\n📊 Found ${bookingsToUpdate.length} bookings to migrate\n`);

    if (bookingsToUpdate.length === 0) {
      console.log("✨ No bookings need migration. All bookings already have numberOfRooms set!");
      await mongoose.connection.close();
      return;
    }

    let successCount = 0;
    let failCount = 0;

    // Update each booking
    for (const booking of bookingsToUpdate) {
      try {
        booking.numberOfRooms = 1; // Default to 1 room
        await booking.save();

        console.log(`✅ Updated booking: ${booking._id}`);
        console.log(`   - User: ${booking.user}`);
        console.log(`   - Number of Rooms: ${booking.numberOfRooms}`);
        console.log(`   - Payment Status: ${booking.paymentStatus}\n`);
        successCount++;
      } catch (error) {
        console.error(`❌ Failed to update booking ${booking._id}:`, error.message);
        failCount++;
      }
    }

    console.log("=".repeat(60));
    console.log("📈 Migration Summary:");
    console.log(`   ✅ Successfully migrated: ${successCount} bookings`);
    console.log(`   ❌ Failed: ${failCount} bookings`);
    console.log("=".repeat(60));

    // Verify migration
    const verifyBookings = await bookingModel.find({});
    console.log("\n🔍 Verification:");
    console.log(`   Total bookings in database: ${verifyBookings.length}`);

    const bookingsWithRoomCount = verifyBookings.filter(
      (b) => b.numberOfRooms !== undefined && b.numberOfRooms !== null
    );
    console.log(`   Bookings with numberOfRooms set: ${bookingsWithRoomCount.length}`);

    if (bookingsWithRoomCount.length === verifyBookings.length) {
      console.log("\n✨ Migration completed successfully! All bookings now have numberOfRooms.\n");
    } else {
      console.log("\n⚠️  Some bookings still missing numberOfRooms. Please check manually.\n");
    }

    // Close connection
    await mongoose.connection.close();
    console.log("👋 Database connection closed");
  } catch (error) {
    console.error("\n🔥 Migration Error:", error);
    process.exit(1);
  }
};

// Run migration
migrateBookingRooms();
