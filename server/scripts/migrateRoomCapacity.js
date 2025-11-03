import mongoose from "mongoose";
import dotenv from "dotenv";
import roomModel from "../models/room.models.js";

dotenv.config();

const migrateRoomCapacity = async () => {
  try {
    console.log("🚀 Starting Room Capacity Migration...");
    console.log("=" .repeat(60));

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    // Find all rooms that don't have totalRooms or availableRooms set
    const roomsToUpdate = await roomModel.find({
      $or: [
        { totalRooms: { $exists: false } },
        { availableRooms: { $exists: false } },
        { totalRooms: null },
        { availableRooms: null },
      ],
    });

    console.log(`\n📊 Found ${roomsToUpdate.length} rooms to migrate\n`);

    if (roomsToUpdate.length === 0) {
      console.log("✨ No rooms need migration. All rooms already have capacity set!");
      await mongoose.connection.close();
      return;
    }

    let successCount = 0;
    let failCount = 0;

    // Update each room
    for (const room of roomsToUpdate) {
      try {
        room.totalRooms = room.totalRooms || 1;
        room.availableRooms = room.availableRooms || 1;
        await room.save();

        console.log(`✅ Updated room: ${room.type} (${room._id})`);
        console.log(`   - Total Rooms: ${room.totalRooms}`);
        console.log(`   - Available Rooms: ${room.availableRooms}\n`);
        successCount++;
      } catch (error) {
        console.error(`❌ Failed to update room ${room._id}:`, error.message);
        failCount++;
      }
    }

    console.log("=" .repeat(60));
    console.log("📈 Migration Summary:");
    console.log(`   ✅ Successfully migrated: ${successCount} rooms`);
    console.log(`   ❌ Failed: ${failCount} rooms`);
    console.log("=" .repeat(60));

    // Verify migration
    const verifyRooms = await roomModel.find({});
    console.log("\n🔍 Verification:");
    console.log(`   Total rooms in database: ${verifyRooms.length}`);

    const roomsWithCapacity = verifyRooms.filter(
      (r) => r.totalRooms && r.availableRooms
    );
    console.log(`   Rooms with capacity set: ${roomsWithCapacity.length}`);

    if (roomsWithCapacity.length === verifyRooms.length) {
      console.log("\n✨ Migration completed successfully! All rooms now have capacity.\n");
    } else {
      console.log("\n⚠️  Some rooms still missing capacity. Please check manually.\n");
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
migrateRoomCapacity();
