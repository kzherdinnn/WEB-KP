import sparepartModel from "../models/sparepart.models.js";
import imagekit from "../config/imagekit.js";

// ===== GET ALL SPAREPARTS =====
export const getAllSpareparts = async (req, res) => {
  try {
    const { category, brand, search, inStock } = req.query;
    
    let filter = {};
    
    if (category) filter.category = category;
    if (brand) filter.brand = brand;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } }
      ];
    }
    if (inStock === "true") filter.stock = { $gt: 0 };
    
    const spareparts = await sparepartModel.find(filter).sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      data: spareparts,
      total: spareparts.length
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ===== GET SPAREPART BY ID =====
export const getSparepartById = async (req, res) => {
  try {
    const sparepart = await sparepartModel.findById(req.params.id);
    
    if (!sparepart) {
      return res.status(404).json({ success: false, message: "Sparepart not found" });
    }
    
    res.status(200).json({ success: true, data: sparepart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ===== CREATE SPAREPART (ADMIN) =====
export const createSparepart = async (req, res) => {
  try {
    let imageUrls = [];

    // Handle file uploads
    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map((file) => {
        return imagekit.upload({
          file: file.buffer,
          fileName: `sparepart-${Date.now()}-${file.originalname}`,
          folder: "/spareparts",
        });
      });

      const uploadResults = await Promise.all(uploadPromises);
      imageUrls = uploadResults.map((result) => result.url);
    }

    // Add images to body
    // If images were passed as strings (e.g. from existing URLs), they might be in req.body.images
    // But for create, usually we just have new files. 
    // If the user allows entering URLs manually AND uploading, we should merge.
    // Assuming for now it's mostly uploads or manual URLs.
    
    let finalImages = imageUrls;
    if (req.body.images) {
        const bodyImages = Array.isArray(req.body.images) ? req.body.images : [req.body.images];
        finalImages = [...finalImages, ...bodyImages];
    }

    const sparepartData = {
        ...req.body,
        images: finalImages
    };

    const newSparepart = await sparepartModel.create(sparepartData);
    
    res.status(201).json({
      success: true,
      message: "Sparepart created successfully",
      data: newSparepart
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ===== UPDATE SPAREPART (ADMIN) =====
export const updateSparepart = async (req, res) => {
  try {
    let newImageUrls = [];

    // Handle new file uploads
    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map((file) => {
        return imagekit.upload({
          file: file.buffer,
          fileName: `sparepart-${Date.now()}-${file.originalname}`,
          folder: "/spareparts",
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

    // Update req.body with final images array
    // We need to make sure we don't overwrite other fields if they are not in req.body (PATCH vs PUT)
    // But this is PUT, so we expect full object or partial updates.
    // Mongoose findByIdAndUpdate with {new: true} handles partial updates if we pass an object.
    
    const updateData = {
        ...req.body,
        images: finalImages
    };

    const updatedSparepart = await sparepartModel.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!updatedSparepart) {
      return res.status(404).json({ success: false, message: "Sparepart not found" });
    }
    
    res.status(200).json({
      success: true,
      message: "Sparepart updated successfully",
      data: updatedSparepart
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ===== DELETE SPAREPART (ADMIN) =====
export const deleteSparepart = async (req, res) => {
  try {
    const deletedSparepart = await sparepartModel.findByIdAndDelete(req.params.id);
    
    if (!deletedSparepart) {
      return res.status(404).json({ success: false, message: "Sparepart not found" });
    }
    
    res.status(200).json({
      success: true,
      message: "Sparepart deleted successfully"
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ===== CHECK STOCK STATUS =====
export const checkStockStatus = async (req, res) => {
  try {
    const sparepart = await sparepartModel.findById(req.params.id);
    
    if (!sparepart) {
      return res.status(404).json({ success: false, message: "Sparepart not found" });
    }
    
    let status = "available";
    let message = "Stock available";
    
    if (sparepart.stock === 0) {
      status = "out_of_stock";
      message = "Out of stock";
    } else if (sparepart.stock <= sparepart.lowStockThreshold) {
      status = "low_stock";
      message = `Only ${sparepart.stock} items left`;
    }
    
    res.status(200).json({
      success: true,
      data: {
        sparepartId: sparepart._id,
        name: sparepart.name,
        stock: sparepart.stock,
        status,
        message,
        isPreOrderOnly: sparepart.isPreOrderOnly
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ===== UPDATE STOCK (ADMIN) =====
export const updateStock = async (req, res) => {
  try {
    const { quantity } = req.body;
    
    const sparepart = await sparepartModel.findById(req.params.id);
    
    if (!sparepart) {
      return res.status(404).json({ success: false, message: "Sparepart not found" });
    }
    
    sparepart.stock = quantity;
    await sparepart.save();
    
    res.status(200).json({
      success: true,
      message: "Stock updated successfully",
      data: sparepart
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ===== CHECK VEHICLE COMPATIBILITY =====
export const checkCompatibility = async (req, res) => {
  try {
    const { brand, model, year } = req.query;
    const sparepart = await sparepartModel.findById(req.params.id);
    
    if (!sparepart) {
      return res.status(404).json({ success: false, message: "Sparepart not found" });
    }
    
    // Check if vehicle is compatible
    const isCompatible = sparepart.compatibleVehicles.some(vehicle => {
      const brandMatch = vehicle.brand.toLowerCase() === brand.toLowerCase();
      const modelMatch = vehicle.model.toLowerCase() === model.toLowerCase();
      
      // Year check (handle ranges like "2015-2020")
      let yearMatch = false;
      if (vehicle.year.includes("-")) {
        const [startYear, endYear] = vehicle.year.split("-").map(y => parseInt(y));
        const checkYear = parseInt(year);
        yearMatch = checkYear >= startYear && checkYear <= endYear;
      } else {
        yearMatch = vehicle.year === year;
      }
      
      return brandMatch && modelMatch && yearMatch;
    });
    
    res.status(200).json({
      success: true,
      data: {
        isCompatible,
        message: isCompatible 
          ? "This sparepart is compatible with your vehicle" 
          : "This sparepart may not be compatible with your vehicle. Please consult with our technician."
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
