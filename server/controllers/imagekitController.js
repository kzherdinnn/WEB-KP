import imagekit from "../config/imagekit.js";

export const getAuth = (req, res) => {
  try {
    const auth = imagekit.getAuthenticationParameters();
    return res.json({ success: true, auth });
  } catch (err) {
    console.error("Failed to get ImageKit auth:", err.message || err);
    return res.status(500).json({ success: false, message: "Failed to generate auth" });
  }
};
