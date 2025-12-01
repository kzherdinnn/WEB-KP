import workshopModel from "../models/workshop.models.js";

// ===== GET WORKSHOP INFO =====
export const getWorkshopInfo = async (req, res) => {
  try {
    const workshop = await workshopModel.findOne().populate("admin");
    
    if (!workshop) {
      return res.status(404).json({ success: false, message: "Workshop not found" });
    }
    
    res.status(200).json({ success: true, data: workshop });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ===== UPDATE WORKSHOP INFO (ADMIN) =====
export const updateWorkshopInfo = async (req, res) => {
  try {
    const workshop = await workshopModel.findOneAndUpdate(
      {},
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!workshop) {
      return res.status(404).json({ success: false, message: "Workshop not found" });
    }
    
    res.status(200).json({
      success: true,
      message: "Workshop info updated successfully",
      data: workshop
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ===== GET AVAILABLE TIME SLOTS =====
export const getAvailableTimeSlots = async (req, res) => {
  try {
    const { date } = req.query;
    
    if (!date) {
      return res.status(400).json({ success: false, message: "Date is required" });
    }
    
    const workshop = await workshopModel.findOne();
    
    if (!workshop) {
      return res.status(404).json({ success: false, message: "Workshop not found" });
    }
    
    // Import booking model
    const bookingModel = (await import("../models/booking.models.js")).default;
    
    // Get all time slots
    const allSlots = workshop.timeSlots || [];
    
    // Get bookings for that date
    const bookingsOnDate = await bookingModel.aggregate([
      {
        $match: {
          scheduledDate: new Date(date),
          bookingStatus: { $nin: ["cancelled", "completed"] }
        }
      },
      {
        $group: {
          _id: "$scheduledTime",
          count: { $sum: 1 }
        }
      }
    ]);
    
    // Create a map of time -> booking count
    const bookingCountMap = {};
    bookingsOnDate.forEach(b => {
      bookingCountMap[b._id] = b.count;
    });
    
    // Mark slots as available or full
    const slotsWithAvailability = allSlots.map(slot => ({
      time: slot,
      bookingsCount: bookingCountMap[slot] || 0,
      maxBookings: workshop.maxBookingsPerSlot,
      isAvailable: (bookingCountMap[slot] || 0) < workshop.maxBookingsPerSlot
    }));
    
    res.status(200).json({
      success: true,
      data: slotsWithAvailability
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
