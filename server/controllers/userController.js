import userModel from "../models/user.models.js";

//Get User Data | /api/user |
export const getUserData = (req, res) => {
  try {
    const role = req.user.role;
    const recentSearchedCities = req.user.recentSearchedCities;
    return res.json({ success: true, role, recentSearchedCities });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

//Store recent searched cities
export const storeRecentSearchedCities = async (req, res) => {
  try {
    const { recentSearchedCities } = req.body;
    const user = await req.user;
    if (user.recentSearchedCities.length < 3) {
      user.recentSearchedCities.push(recentSearchedCities);
    } else {
      user.recentSearchedCities.shift();
      user.recentSearchedCities.push(recentSearchedCities);
    }

    await user.save();
    res.json({ success: true, message: "City Added" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// --------------------------------------------------
// 👥 ADMIN USER MANAGEMENT
// --------------------------------------------------

// Get all users (Admin only)
export const getAllUsers = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin only.",
      });
    }

    const users = await userModel.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      users,
      total: users.length,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Create new user (Admin only)
export const createUser = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin only.",
      });
    }

    const { _id, username, email, image, role } = req.body;

    // Validate required fields
    if (!_id || !username || !email) {
      return res.status(400).json({
        success: false,
        message: "User ID, username, and email are required",
      });
    }

    // Check if user already exists
    const existingUser = await userModel.findById(_id);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with this ID already exists",
      });
    }

    // Create new user
    const newUser = await userModel.create({
      _id,
      username,
      email,
      image: image || "https://via.placeholder.com/150",
      role: role || "user",
    });

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: newUser,
    });
  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Update user role (Admin only)
export const updateUserRole = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin only.",
      });
    }

    const { userId } = req.params;
    const { role } = req.body;

    // Validate role
    if (!["user", "admin"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role. Must be 'user' or 'admin'",
      });
    }

    // Find and update user
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Prevent admin from demoting themselves
    if (userId === req.user._id && role === "user") {
      return res.status(400).json({
        success: false,
        message: "You cannot demote yourself",
      });
    }

    user.role = role;
    await user.save();

    res.json({
      success: true,
      message: `User role updated to ${role}`,
      user,
    });
  } catch (error) {
    console.error("Error updating user role:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Delete user (Admin only)
export const deleteUser = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin only.",
      });
    }

    const { userId } = req.params;

    // Prevent admin from deleting themselves
    if (userId === req.user._id) {
      return res.status(400).json({
        success: false,
        message: "You cannot delete yourself",
      });
    }

    // Find and delete user
    const user = await userModel.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
