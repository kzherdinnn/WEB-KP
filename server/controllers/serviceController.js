import serviceModel from "../models/service.models.js";
import imagekit from "../config/imagekit.js";

// ===== GET ALL SERVICES =====
export const getAllServices = async (req, res) => {
  try {
    const { category, search, available } = req.query;
    
    let filter = {};
    
    if (category) filter.category = category;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } }
      ];
    }
    if (available === "true") filter.isAvailable = true;
    
    const services = await serviceModel.find(filter).sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      data: services,
      total: services.length
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ===== GET SERVICE BY ID =====
export const getServiceById = async (req, res) => {
  try {
    const service = await serviceModel.findById(req.params.id);
    
    if (!service) {
      return res.status(404).json({ success: false, message: "Service not found" });
    }
    
    res.status(200).json({ success: true, data: service });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ===== CREATE SERVICE (ADMIN) =====
export const createService = async (req, res) => {
  try {
    let imageUrls = [];

    // Handle file uploads
    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map((file) => {
        return imagekit.upload({
          file: file.buffer,
          fileName: `service-${Date.now()}-${file.originalname}`,
          folder: "/services",
        });
      });

      const uploadResults = await Promise.all(uploadPromises);
      imageUrls = uploadResults.map((result) => result.url);
    }

    // Add images to body
    let finalImages = imageUrls;
    if (req.body.images) {
        const bodyImages = Array.isArray(req.body.images) ? req.body.images : [req.body.images];
        finalImages = [...finalImages, ...bodyImages];
    }

    const serviceData = {
        ...req.body,
        images: finalImages
    };

    const newService = await serviceModel.create(serviceData);
    
    res.status(201).json({
      success: true,
      message: "Service created successfully",
      data: newService
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ===== UPDATE SERVICE (ADMIN) =====
export const updateService = async (req, res) => {
  try {
    let newImageUrls = [];

    // Handle new file uploads
    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map((file) => {
        return imagekit.upload({
          file: file.buffer,
          fileName: `service-${Date.now()}-${file.originalname}`,
          folder: "/services",
        });
      });

      const uploadResults = await Promise.all(uploadPromises);
      newImageUrls = uploadResults.map((result) => result.url);
    }

    // Handle existing images passed in body
    let existingImages = [];
    if (req.body.images) {
        existingImages = Array.isArray(req.body.images) ? req.body.images : [req.body.images];
    }

    // Combine new and existing images
    const finalImages = [...existingImages, ...newImageUrls];

    const updateData = {
        ...req.body,
        images: finalImages
    };

    const updatedService = await serviceModel.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!updatedService) {
      return res.status(404).json({ success: false, message: "Service not found" });
    }
    
    res.status(200).json({
      success: true,
      message: "Service updated successfully",
      data: updatedService
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ===== DELETE SERVICE (ADMIN) =====
export const deleteService = async (req, res) => {
  try {
    const deletedService = await serviceModel.findByIdAndDelete(req.params.id);
    
    if (!deletedService) {
      return res.status(404).json({ success: false, message: "Service not found" });
    }
    
    res.status(200).json({
      success: true,
      message: "Service deleted successfully"
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
