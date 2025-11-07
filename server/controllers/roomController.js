import hotelModel from "../models/hotel.models.js";
import roomModel from "../models/room.models.js";
import auditLogModel from "../models/auditLog.models.js";
import { v2 as cloudinary } from "cloudinary";

//Create a new room
export const createRoom = async (req, res) => {
  try {
    const { type, pricePerNight, amenities, totalRooms } = req.body;

    const userId = req.auth?.userId || req.user?._id;
    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: "Not authenticated" });
    }

    // Find hotel by admin user ID
    const hotel = await hotelModel.findOne({ admin: userId });
    if (!hotel) {
      return res
        .status(404)
        .json({ success: false, message: "No hotel found for this admin" });
    }

    // Ensure images are uploaded
    if (!req.files || req.files.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Please upload at least one image" });
    }

    let images = [];

    // Check if Cloudinary is configured
    const hasCloudinary =
      process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET &&
      process.env.CLOUDINARY_CLOUD_NAME !== "your_cloud_name";

    if (hasCloudinary) {
      // Upload images to Cloudinary
      try {
        const uploadImages = req.files.map(async (file) => {
          const result = await cloudinary.uploader.upload(file.path);
          return result.secure_url;
        });
        images = await Promise.all(uploadImages);
        console.log("✅ Images uploaded to Cloudinary");
      } catch (cloudinaryError) {
        console.error("❌ Cloudinary upload failed:", cloudinaryError.message);
        return res.status(500).json({
          success: false,
          message:
            "Failed to upload images. Please check Cloudinary configuration.",
        });
      }
    } else {
      // Fallback: Use placeholder images for testing
      console.warn("⚠️ Cloudinary not configured. Using placeholder images.");
      images = req.files.map(
        (file, index) =>
          `https://via.placeholder.com/600x400?text=Room+Image+${index + 1}`,
      );
    }

    // Create new room
    const roomCapacity = totalRooms ? parseInt(totalRooms) : 1;
    const newRoom = await roomModel.create({
      hotel: hotel._id,
      type,
      pricePerNight,
      amenities: JSON.parse(amenities),
      images,
      totalRooms: roomCapacity,
      availableRooms: roomCapacity, // Set available sama dengan total saat create
    });

    // Create audit log
    await auditLogModel.createLog({
      action: "ROOM_CREATE",
      performedBy: userId,
      resourceType: "ROOM",
      resourceId: newRoom._id,
      newData: {
        type: newRoom.type,
        pricePerNight: newRoom.pricePerNight,
        totalRooms: newRoom.totalRooms,
        availableRooms: newRoom.availableRooms,
      },
      description: `Created new room type "${type}" with ${roomCapacity} rooms`,
      metadata: {
        ip: req.ip,
        userAgent: req.headers["user-agent"],
        method: req.method,
        endpoint: req.originalUrl,
      },
    });

    return res.status(201).json({
      success: true,
      message: hasCloudinary
        ? "Room created successfully"
        : "Room created with placeholder images (Configure Cloudinary for real images)",
      room: newRoom,
    });
  } catch (error) {
    console.error("Error creating room:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

//Get All Rooms (including unavailable ones for user to see)
export const getAllRooms = async (req, res) => {
  try {
    const rooms = await roomModel
      .find({}) // Remove isAvailable filter to show all rooms
      .populate({
        path: "hotel",
        populate: {
          path: "admin",
          select: "image",
        },
      })
      .sort({ createdAt: -1 });
    return res.json({ success: true, rooms });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

//All rooms for a specific hotel
export const getAdminRooms = async (req, res) => {
  try {
    const hotelData = await hotelModel.findOne({ admin: req.auth.userId });
    const rooms = await roomModel
      .find({ hotel: hotelData._id })
      .populate("hotel");

    return res.json({ success: true, rooms });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

//Toggle availability of a room
export const toggleRoomAvailability = async (req, res) => {
  try {
    const { roomId } = req.body;
    const roomData = await roomModel.findById(roomId);

    if (!roomData) {
      return res
        .status(404)
        .json({ success: false, message: "Room not found" });
    }

    const previousAvailability = roomData.isAvailable;
    roomData.isAvailable = !roomData.isAvailable;
    await roomData.save();

    // Create audit log
    const userId = req.auth?.userId || req.user?._id;
    if (userId) {
      await auditLogModel.createLog({
        action: "ROOM_UPDATE",
        performedBy: userId,
        resourceType: "ROOM",
        resourceId: roomData._id,
        previousData: { isAvailable: previousAvailability },
        newData: { isAvailable: roomData.isAvailable },
        description: `Toggled room availability to ${roomData.isAvailable ? "available" : "unavailable"}`,
        metadata: {
          ip: req.ip,
          userAgent: req.headers["user-agent"],
          method: req.method,
          endpoint: req.originalUrl,
        },
      });
    }

    res.json({
      success: true,
      message: `Room is now ${roomData.isAvailable ? "available" : "unavailable"}`,
      room: roomData,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

//Delete a room
export const deleteRoom = async (req, res) => {
  try {
    const { roomId } = req.params;
    const userId = req.auth?.userId || req.user?._id;

    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: "Not authenticated" });
    }

    // Find hotel by admin user ID
    const hotel = await hotelModel.findOne({ admin: userId });
    if (!hotel) {
      return res
        .status(404)
        .json({ success: false, message: "No hotel found for this admin" });
    }

    // Find room and verify it belongs to admin's hotel
    const room = await roomModel.findById(roomId);
    if (!room) {
      return res
        .status(404)
        .json({ success: false, message: "Room not found" });
    }

    if (room.hotel.toString() !== hotel._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You don't have permission to delete this room",
      });
    }

    // Create audit log before deletion
    await auditLogModel.createLog({
      action: "ROOM_DELETE",
      performedBy: userId,
      resourceType: "ROOM",
      resourceId: room._id,
      previousData: {
        type: room.type,
        pricePerNight: room.pricePerNight,
        totalRooms: room.totalRooms,
        availableRooms: room.availableRooms,
      },
      description: `Deleted room type "${room.type}"`,
      metadata: {
        ip: req.ip,
        userAgent: req.headers["user-agent"],
        method: req.method,
        endpoint: req.originalUrl,
      },
    });

    // Delete the room
    await roomModel.findByIdAndDelete(roomId);

    // Remove room from hotel's rooms array
    hotel.rooms = hotel.rooms.filter((r) => r.toString() !== roomId);
    await hotel.save();

    res.json({ success: true, message: "Room deleted successfully" });
  } catch (error) {
    console.error("Error deleting room:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

//Update room capacity (for admin to manually adjust)
export const updateRoomCapacity = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { totalRooms, availableRooms } = req.body;
    const userId = req.auth?.userId || req.user?._id;

    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: "Not authenticated" });
    }

    // Find hotel by admin user ID
    const hotel = await hotelModel.findOne({ admin: userId });
    if (!hotel) {
      return res
        .status(404)
        .json({ success: false, message: "No hotel found for this admin" });
    }

    // Find room and verify it belongs to admin's hotel
    const room = await roomModel.findById(roomId);
    if (!room) {
      return res
        .status(404)
        .json({ success: false, message: "Room not found" });
    }

    if (room.hotel.toString() !== hotel._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You don't have permission to update this room",
      });
    }

    // Store previous data for audit log
    const previousData = {
      totalRooms: room.totalRooms,
      availableRooms: room.availableRooms,
    };

    // Parse and validate inputs
    const newTotalRooms = parseInt(totalRooms);
    const newAvailableRooms = parseInt(availableRooms);

    if (isNaN(newTotalRooms) || newTotalRooms < 1) {
      return res.status(400).json({
        success: false,
        message: "Total rooms must be at least 1",
      });
    }

    if (isNaN(newAvailableRooms) || newAvailableRooms < 0) {
      return res.status(400).json({
        success: false,
        message: "Available rooms cannot be negative",
      });
    }

    if (newAvailableRooms > newTotalRooms) {
      return res.status(400).json({
        success: false,
        message: "Available rooms cannot exceed total rooms",
      });
    }

    // Calculate how many rooms are currently booked
    const currentlyBooked = room.totalRooms - room.availableRooms;

    // Update total rooms
    room.totalRooms = newTotalRooms;

    // Set available rooms directly as specified by admin
    // This gives admin full control over availability
    room.availableRooms = newAvailableRooms;

    // Sanity check: make sure we don't have negative bookings
    const newBooked = room.totalRooms - room.availableRooms;
    if (newBooked < 0) {
      room.availableRooms = room.totalRooms;
    }

    await room.save();

    // Create audit log
    await auditLogModel.createLog({
      action: "CAPACITY_UPDATE",
      performedBy: userId,
      resourceType: "ROOM",
      resourceId: room._id,
      previousData,
      newData: {
        totalRooms: room.totalRooms,
        availableRooms: room.availableRooms,
      },
      description: `Updated room capacity: Total ${previousData.totalRooms} → ${room.totalRooms}, Available ${previousData.availableRooms} → ${room.availableRooms}`,
      metadata: {
        ip: req.ip,
        userAgent: req.headers["user-agent"],
        method: req.method,
        endpoint: req.originalUrl,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Room capacity updated successfully",
      room,
    });
  } catch (error) {
    console.error("Error updating room capacity:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

//Update a room
export const updateRoom = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { type, pricePerNight, amenities, totalRooms } = req.body;
    const userId = req.auth?.userId || req.user?._id;

    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: "Not authenticated" });
    }

    // Find hotel by admin user ID
    const hotel = await hotelModel.findOne({ admin: userId });
    if (!hotel) {
      return res
        .status(404)
        .json({ success: false, message: "No hotel found for this admin" });
    }

    // Find room and verify it belongs to admin's hotel
    const room = await roomModel.findById(roomId);
    if (!room) {
      return res
        .status(404)
        .json({ success: false, message: "Room not found" });
    }

    if (room.hotel.toString() !== hotel._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You don't have permission to update this room",
      });
    }

    // Store previous data for audit log
    const previousData = {
      type: room.type,
      pricePerNight: room.pricePerNight,
      amenities: room.amenities,
      totalRooms: room.totalRooms,
      availableRooms: room.availableRooms,
    };

    // Update room data
    room.type = type || room.type;
    room.pricePerNight = pricePerNight || room.pricePerNight;
    room.amenities = amenities ? JSON.parse(amenities) : room.amenities;

    // Update kapasitas kamar jika diberikan
    if (totalRooms) {
      const newTotal = parseInt(totalRooms);
      const difference = newTotal - room.totalRooms;
      room.totalRooms = newTotal;
      // Adjust availableRooms based on difference
      room.availableRooms = Math.max(0, room.availableRooms + difference);
    }

    // Handle new images if uploaded
    if (req.files && req.files.length > 0) {
      let newImages = [];

      // Check if Cloudinary is configured
      const hasCloudinary =
        process.env.CLOUDINARY_CLOUD_NAME &&
        process.env.CLOUDINARY_API_KEY &&
        process.env.CLOUDINARY_API_SECRET &&
        process.env.CLOUDINARY_CLOUD_NAME !== "your_cloud_name";

      if (hasCloudinary) {
        // Delete old images from Cloudinary
        if (room.images && room.images.length > 0) {
          const deletePromises = room.images.map((imageUrl) => {
            const publicIdMatch = imageUrl.match(/\/v\d+\/(.+?)\.\w+$/);
            if (publicIdMatch && publicIdMatch[1]) {
              return cloudinary.uploader.destroy(publicIdMatch[1]);
            }
          });
          await Promise.all(deletePromises.filter(Boolean));
        }

        try {
          const uploadImages = req.files.map(async (file) => {
            const result = await cloudinary.uploader.upload(file.path);
            return result.secure_url;
          });
          newImages = await Promise.all(uploadImages);
          console.log("✅ New images uploaded to Cloudinary");
        } catch (cloudinaryError) {
          console.error(
            "❌ Cloudinary upload failed:",
            cloudinaryError.message,
          );
          return res.status(500).json({
            success: false,
            message:
              "Failed to upload images. Please check Cloudinary configuration.",
          });
        }
      } else {
        console.warn("⚠️ Cloudinary not configured. Using placeholder images.");
        newImages = req.files.map(
          (file, index) =>
            `https://via.placeholder.com/600x400?text=Room+Image+${index + 1}`,
        );
      }

      // Replace old images with new ones
      room.images = newImages;
    }

    await room.save();

    // Create audit log
    await auditLogModel.createLog({
      action: "ROOM_UPDATE",
      performedBy: userId,
      resourceType: "ROOM",
      resourceId: room._id,
      previousData,
      newData: {
        type: room.type,
        pricePerNight: room.pricePerNight,
        amenities: room.amenities,
        totalRooms: room.totalRooms,
        availableRooms: room.availableRooms,
      },
      description: `Updated room "${room.type}" information`,
      metadata: {
        ip: req.ip,
        userAgent: req.headers["user-agent"],
        method: req.method,
        endpoint: req.originalUrl,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Room updated successfully",
      room,
    });
  } catch (error) {
    console.error("Error updating room:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
