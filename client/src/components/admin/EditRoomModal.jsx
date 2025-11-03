import { useState, useEffect } from "react";
import { FaTimes, FaUpload } from "react-icons/fa";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const EditRoomModal = ({ room, onClose, onSuccess }) => {
  const { axios } = useAppContext();
  const [formData, setFormData] = useState({
    type: "",
    pricePerNight: "",
    totalRooms: "",
    amenities: [],
  });
  const [amenityInput, setAmenityInput] = useState("");
  const [images, setImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (room) {
      setFormData({
        type: room.type || "",
        pricePerNight: room.pricePerNight || "",
        totalRooms: room.totalRooms || 1,
        amenities: room.amenities || [],
      });
      setPreviewImages(room.images || []);
    }
  }, [room]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddAmenity = () => {
    if (
      amenityInput.trim() &&
      !formData.amenities.includes(amenityInput.trim())
    ) {
      setFormData({
        ...formData,
        amenities: [...formData.amenities, amenityInput.trim()],
      });
      setAmenityInput("");
    }
  };

  const handleRemoveAmenity = (index) => {
    setFormData({
      ...formData,
      amenities: formData.amenities.filter((_, i) => i !== index),
    });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 4) {
      toast.error("Maximum 4 images allowed");
      return;
    }

    setImages(files);

    // Create preview URLs
    const previews = files.map((file) => URL.createObjectURL(file));
    setPreviewImages(previews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.type || !formData.pricePerNight) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (formData.amenities.length === 0) {
      toast.error("Please add at least one amenity");
      return;
    }

    try {
      setLoading(true);

      const formDataToSend = new FormData();
      formDataToSend.append("type", formData.type);
      formDataToSend.append("pricePerNight", formData.pricePerNight);
      formDataToSend.append("totalRooms", formData.totalRooms);
      formDataToSend.append("amenities", JSON.stringify(formData.amenities));

      // Only append images if new ones are selected
      if (images.length > 0) {
        images.forEach((image) => {
          formDataToSend.append("images", image);
        });
      }

      const { data } = await axios.put(
        `/api/room/${room._id}`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (data.success) {
        toast.success(data.message);
        onSuccess();
        onClose();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error updating room:", error);
      toast.error(error.response?.data?.message || "Failed to update room");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-gray-900 playfair">
            Edit Room
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <FaTimes className="text-xl" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Room Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 outfit">
              Room Type <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              placeholder="e.g., Deluxe Suite, Standard Room"
              required
            />
          </div>

          {/* Price Per Night */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 outfit">
              Price Per Night (Rp) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="pricePerNight"
              value={formData.pricePerNight}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              placeholder="e.g., 500000"
              required
              min="0"
            />
          </div>

          {/* Total Rooms */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 outfit">
              Total Rooms Available <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="totalRooms"
              value={formData.totalRooms}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              placeholder="e.g., 5"
              required
              min="1"
            />
            <p className="text-xs text-gray-500 mt-1">
              Total capacity of this room type
            </p>
          </div>

          {/* Amenities */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 outfit">
              Amenities <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={amenityInput}
                onChange={(e) => setAmenityInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddAmenity();
                  }
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                placeholder="e.g., WiFi, AC, TV"
              />
              <button
                type="button"
                onClick={handleAddAmenity}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.amenities.map((amenity, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                >
                  {amenity}
                  <button
                    type="button"
                    onClick={() => handleRemoveAmenity(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FaTimes className="text-xs" />
                  </button>
                </span>
              ))}
            </div>
            {formData.amenities.length === 0 && (
              <p className="text-sm text-gray-500 mt-2">
                No amenities added yet
              </p>
            )}
          </div>

          {/* Images */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 outfit">
              Room Images (Optional - Leave empty to keep current images)
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="hidden"
                id="edit-room-images"
              />
              <label
                htmlFor="edit-room-images"
                className="cursor-pointer flex flex-col items-center"
              >
                <FaUpload className="text-4xl text-gray-400 mb-2" />
                <p className="text-sm text-gray-600">
                  Click to upload new images (Max 4)
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  PNG, JPG up to 10MB each
                </p>
              </label>
            </div>

            {/* Image Previews */}
            {previewImages.length > 0 && (
              <div className="mt-4 grid grid-cols-2 gap-4">
                {previewImages.map((preview, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg border border-gray-200"
                    />
                    {images.length > 0 && (
                      <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                        New
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition outfit"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition outfit disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Updating..." : "Update Room"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditRoomModal;
