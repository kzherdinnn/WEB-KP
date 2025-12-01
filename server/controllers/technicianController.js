import technicianModel from "../models/technician.models.js";
import bookingModel from "../models/booking.models.js";

// ===== GET ALL TECHNICIANS =====
export const getAllTechnicians = async (req, res) => {
  try {
    const { available, specialization } = req.query;
    
    let filter = {};
    
    if (available === "true") filter.isAvailable = true;
    if (specialization) filter.specialization = { $in: [specialization] };
    
    const technicians = await technicianModel.find(filter).sort({ rating: -1 });
    
    res.status(200).json({
      success: true,
      data: technicians,
      total: technicians.length
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ===== GET TECHNICIAN BY ID =====
export const getTechnicianById = async (req, res) => {
  try {
    const technician = await technicianModel.findById(req.params.id);
    
    if (!technician) {
      return res.status(404).json({ success: false, message: "Technician not found" });
    }
    
    res.status(200).json({ success: true, data: technician });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ===== CREATE TECHNICIAN (ADMIN) =====
export const createTechnician = async (req, res) => {
  try {
    const newTechnician = await technicianModel.create(req.body);
    
    res.status(201).json({
      success: true,
      message: "Technician created successfully",
      data: newTechnician
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ===== UPDATE TECHNICIAN (ADMIN) =====
export const updateTechnician = async (req, res) => {
  try {
    const updatedTechnician = await technicianModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!updatedTechnician) {
      return res.status(404).json({ success: false, message: "Technician not found" });
    }
    
    res.status(200).json({
      success: true,
      message: "Technician updated successfully",
      data: updatedTechnician
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ===== DELETE TECHNICIAN (ADMIN) =====
export const deleteTechnician = async (req, res) => {
  try {
    const deletedTechnician = await technicianModel.findByIdAndDelete(req.params.id);
    
    if (!deletedTechnician) {
      return res.status(404).json({ success: false, message: "Technician not found" });
    }
    
    res.status(200).json({
      success: true,
      message: "Technician deleted successfully"
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ===== GET AVAILABLE TECHNICIANS FOR DATE =====
export const getAvailableTechnicians = async (req, res) => {
  try {
    const { date, time } = req.query;
    
    if (!date || !time) {
      return res.status(400).json({ 
        success: false, 
        message: "Date and time are required" 
      });
    }
    
    // Find all technicians
    const allTechnicians = await technicianModel.find({ isAvailable: true });
    
    // Find bookings on that date and time
    const bookingsOnDateTime = await bookingModel.find({
      scheduledDate: new Date(date),
      scheduledTime: time,
      bookingStatus: { $nin: ["cancelled", "completed"] }
    }).populate("technician");
    
    // Get IDs of busy technicians
    const busyTechnicianIds = bookingsOnDateTime.map(b => b.technician?._id.toString());
    
    // Filter available technicians
    const availableTechnicians = allTechnicians.filter(
      tech => !busyTechnicianIds.includes(tech._id.toString())
    );
    
    res.status(200).json({
      success: true,
      data: availableTechnicians,
      total: availableTechnicians.length
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
