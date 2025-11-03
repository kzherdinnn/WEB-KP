import React, { useState } from "react";
import toast from "react-hot-toast";
import { useAppContext } from "../../context/AppContext";
import {
  FaUpload,
  FaCheckCircle,
  FaTimesCircle,
  FaImage,
} from "react-icons/fa";

const AddRoom = () => {
  const { axios, getToken } = useAppContext();
  const [loading, setLoading] = useState(false);

  const [images, setImages] = useState({
    1: null,
    2: null,
    3: null,
    4: null,
  });

  const [inputs, setInputs] = useState({
    type: "",
    pricePerNight: "",
    totalRooms: "1",
    amenities: {
      "Free Wifi": false,
      "Pool Access": false,
      "Room Service": false,
      "Mountain View": false,
      "Free Breakfast": false,
    },
  });

  const handleImageChange = (e, index) => {
    const file = e.target.files[0];
    setImages((prev) => ({ ...prev, [index]: file }));
  };

  const handleInputChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAmenityToggle = (amenity) => {
    setInputs((prev) => ({
      ...prev,
      amenities: {
        ...prev.amenities,
        [amenity]: !prev.amenities[amenity],
      },
    }));
  };

  const resetForm = () => {
    setInputs({
      type: "",
      pricePerNight: "",
      totalRooms: "1",
      amenities: {
        "Free Wifi": false,
        "Pool Access": false,
        "Room Service": false,
        "Mountain View": false,
        "Free Breakfast": false,
      },
    });

    setImages({
      1: null,
      2: null,
      3: null,
      4: null,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!inputs.type || !inputs.pricePerNight) {
      toast.error("Please fill in all required fields.");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();

      formData.append("type", inputs.type);
      formData.append("pricePerNight", inputs.pricePerNight);
      formData.append("totalRooms", inputs.totalRooms);

      const amenities = Object.keys(inputs.amenities).filter(
        (key) => inputs.amenities[key],
      );
      formData.append("amenities", JSON.stringify(amenities));

      Object.keys(images).forEach((key) => {
        if (images[key]) {
          formData.append("images", images[key]);
        }
      });

      const { data } = await axios.post("/api/room", formData, {
        headers: {
          Authorization: `Bearer ${await getToken()}`,
        },
      });

      if (data.success) {
        toast.success(data.message);
        resetForm();
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  const selectedAmenitiesCount = Object.values(inputs.amenities).filter(
    Boolean,
  ).length;

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 playfair">
          Add New Room
        </h1>
        <p className="text-sm md:text-base text-gray-600 mt-2 outfit">
          Fill in the details to add a new room type to your hotel
        </p>
      </div>

      {/* Form Card */}
      <div className="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden">
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          {/* Form Content */}
          <div className="px-6 py-6 space-y-6">
            {/* Room Information Section */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4 outfit flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-blue-600 font-bold">1</span>
                </div>
                Room Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Room Type */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 outfit">
                    Room Type
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    type="text"
                    name="type"
                    value={inputs.type}
                    onChange={handleInputChange}
                    placeholder="e.g., Deluxe Suite, Standard Room"
                    className="w-full border-2 border-gray-300 px-4 py-2.5 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outfit"
                    required
                  />
                </div>

                {/* Price Per Night */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 outfit">
                    Price Per Night (Rp)
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    type="number"
                    name="pricePerNight"
                    value={inputs.pricePerNight}
                    onChange={handleInputChange}
                    placeholder="e.g., 500000"
                    className="w-full border-2 border-gray-300 px-4 py-2.5 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outfit"
                    min="0"
                    required
                  />
                  {inputs.pricePerNight && (
                    <p className="text-xs text-gray-500 mt-1 outfit">
                      Rp
                      {parseInt(inputs.pricePerNight || 0).toLocaleString(
                        "id-ID",
                      )}
                    </p>
                  )}
                </div>

                {/* Total Rooms Capacity */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 outfit">
                    Total Rooms Available
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    type="number"
                    name="totalRooms"
                    min="1"
                    value={inputs.totalRooms}
                    onChange={handleInputChange}
                    placeholder="e.g., 5"
                    className="w-full border-2 border-gray-300 px-4 py-2.5 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outfit"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1 outfit">
                    How many rooms of this type are available?
                  </p>
                </div>
              </div>
            </div>

            {/* Amenities Section */}
            <div className="border-t border-gray-200 pt-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 outfit flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-blue-600 font-bold">2</span>
                </div>
                Room Amenities
                {selectedAmenitiesCount > 0 && (
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-semibold">
                    {selectedAmenitiesCount} selected
                  </span>
                )}
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                {Object.keys(inputs.amenities).map((amenity) => (
                  <label
                    key={amenity}
                    className={`flex items-center gap-2 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                      inputs.amenities[amenity]
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300 bg-white"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={inputs.amenities[amenity]}
                      onChange={() => handleAmenityToggle(amenity)}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-200"
                    />
                    <span className="text-sm font-medium text-gray-700 outfit">
                      {amenity}
                    </span>
                    {inputs.amenities[amenity] && (
                      <FaCheckCircle className="text-blue-600 text-xs ml-auto" />
                    )}
                  </label>
                ))}
              </div>
            </div>

            {/* Images Section */}
            <div className="border-t border-gray-200 pt-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 outfit flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-blue-600 font-bold">3</span>
                </div>
                Room Images
                <span className="text-xs text-gray-500 font-normal">
                  (Maximum 4 images)
                </span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((index) => (
                  <div key={index} className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      name="images"
                      onChange={(e) => handleImageChange(e, index)}
                      className="hidden"
                      id={`image-${index}`}
                    />
                    <label
                      htmlFor={`image-${index}`}
                      className={`flex flex-col items-center justify-center h-40 border-2 border-dashed rounded-lg cursor-pointer transition-all ${
                        images[index]
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-300 hover:border-blue-400 bg-gray-50"
                      }`}
                    >
                      {images[index] ? (
                        <div className="text-center p-4">
                          <FaImage className="text-3xl text-blue-600 mx-auto mb-2" />
                          <p className="text-xs text-blue-700 font-medium break-all line-clamp-2 outfit">
                            {images[index].name}
                          </p>
                          <p className="text-xs text-green-600 mt-2 flex items-center justify-center gap-1">
                            <FaCheckCircle /> Uploaded
                          </p>
                        </div>
                      ) : (
                        <div className="text-center p-4">
                          <FaUpload className="text-3xl text-gray-400 mx-auto mb-2" />
                          <p className="text-xs text-gray-600 font-medium outfit">
                            Upload Image {index}
                          </p>
                          <p className="text-xs text-gray-400 mt-1 outfit">
                            Click to browse
                          </p>
                        </div>
                      )}
                    </label>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-3 outfit">
                Supported formats: JPG, PNG, WEBP. Maximum file size: 5MB per
                image.
              </p>
            </div>
          </div>

          {/* Form Footer */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-600 outfit">
              {!inputs.type || !inputs.pricePerNight ? (
                <span className="flex items-center gap-2 text-red-600">
                  <FaTimesCircle />
                  Please fill all required fields
                </span>
              ) : (
                <span className="flex items-center gap-2 text-green-600">
                  <FaCheckCircle />
                  Ready to submit
                </span>
              )}
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={resetForm}
                disabled={loading}
                className="px-6 py-2.5 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all outfit font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Reset
              </button>
              <button
                type="submit"
                disabled={loading || !inputs.type || !inputs.pricePerNight}
                className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all outfit font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-sm"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <FaCheckCircle />
                    Add Room
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddRoom;
