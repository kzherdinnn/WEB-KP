import { useState, useEffect } from "react";
import { FaTimes, FaDoorOpen, FaCheckCircle } from "react-icons/fa";
import { MdMeetingRoom } from "react-icons/md";

const UpdateCapacityModal = ({ room, onClose, onUpdate, loading }) => {
  const [totalRooms, setTotalRooms] = useState("");
  const [availableRooms, setAvailableRooms] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (room) {
      setTotalRooms(room.totalRooms?.toString() || "1");
      setAvailableRooms(room.availableRooms?.toString() || "1");
    }
  }, [room]);

  const validate = () => {
    const newErrors = {};
    const total = parseInt(totalRooms);
    const available = parseInt(availableRooms);

    if (!totalRooms || isNaN(total) || total < 1) {
      newErrors.totalRooms = "Total rooms harus minimal 1";
    }

    if (!availableRooms || isNaN(available) || available < 0) {
      newErrors.availableRooms = "Available rooms tidak boleh negatif";
    }

    if (!isNaN(total) && !isNaN(available) && available > total) {
      newErrors.availableRooms = `Tidak boleh melebihi total (${total})`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onUpdate({
        totalRooms: parseInt(totalRooms),
        availableRooms: parseInt(availableRooms),
      });
    }
  };

  const handleTotalChange = (value) => {
    // Allow empty string for deletion
    if (value === "") {
      setTotalRooms("");
      return;
    }

    // Only allow positive numbers
    const numValue = parseInt(value);
    if (!isNaN(numValue) && numValue >= 0) {
      setTotalRooms(value);

      // Auto-adjust available if it exceeds new total
      const currentAvailable = parseInt(availableRooms);
      if (!isNaN(currentAvailable) && currentAvailable > numValue) {
        setAvailableRooms(numValue.toString());
      }
    }
  };

  const handleAvailableChange = (value) => {
    // Allow empty string for deletion
    if (value === "") {
      setAvailableRooms("");
      return;
    }

    // Only allow positive numbers
    const numValue = parseInt(value);
    if (!isNaN(numValue) && numValue >= 0) {
      setAvailableRooms(value);
    }
  };

  const total = parseInt(totalRooms) || 0;
  const available = parseInt(availableRooms) || 0;
  const occupiedRooms = total - available;
  const occupancyRate =
    total > 0 ? ((occupiedRooms / total) * 100).toFixed(0) : 0;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg transform transition-all animate-slideUp">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-t-2xl px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <MdMeetingRoom className="text-2xl text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white playfair">
                Update Room Capacity
              </h2>
              <p className="text-blue-100 text-sm outfit">{room?.type}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={loading}
            className="text-white/80 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
          >
            <FaTimes className="text-xl" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Current Status Card */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
            <h3 className="text-sm font-semibold text-gray-700 mb-3 outfit flex items-center gap-2">
              <FaDoorOpen className="text-gray-600" />
              Current Status
            </h3>
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white rounded-lg p-3 text-center shadow-sm">
                <p className="text-xs text-gray-500 outfit">Total</p>
                <p className="text-2xl font-bold text-gray-800">
                  {room?.totalRooms || 0}
                </p>
              </div>
              <div className="bg-white rounded-lg p-3 text-center shadow-sm">
                <p className="text-xs text-gray-500 outfit">Available</p>
                <p className="text-2xl font-bold text-green-600">
                  {room?.availableRooms || 0}
                </p>
              </div>
              <div className="bg-white rounded-lg p-3 text-center shadow-sm">
                <p className="text-xs text-gray-500 outfit">Occupied</p>
                <p className="text-2xl font-bold text-orange-600">
                  {(room?.totalRooms || 0) - (room?.availableRooms || 0)}
                </p>
              </div>
            </div>
          </div>

          {/* Total Rooms Input */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 outfit">
              Total Rooms Capacity
              <span className="text-red-500 ml-1">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={totalRooms}
                onChange={(e) => handleTotalChange(e.target.value)}
                className={`w-full px-4 py-3 border-2 rounded-xl outline-none transition-all outfit text-lg font-medium ${
                  errors.totalRooms
                    ? "border-red-400 focus:border-red-500 bg-red-50"
                    : "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                }`}
                placeholder="e.g., 10"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <MdMeetingRoom className="text-gray-400 text-xl" />
              </div>
            </div>
            {errors.totalRooms && (
              <p className="text-red-500 text-xs mt-1 outfit flex items-center gap-1">
                <span>⚠️</span> {errors.totalRooms}
              </p>
            )}
            <p className="text-gray-500 text-xs mt-1 outfit">
              Maximum number of rooms of this type
            </p>
          </div>

          {/* Available Rooms Input */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 outfit">
              Available Rooms
              <span className="text-red-500 ml-1">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={availableRooms}
                onChange={(e) => handleAvailableChange(e.target.value)}
                className={`w-full px-4 py-3 border-2 rounded-xl outline-none transition-all outfit text-lg font-medium ${
                  errors.availableRooms
                    ? "border-red-400 focus:border-red-500 bg-red-50"
                    : "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                }`}
                placeholder="e.g., 7"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <FaCheckCircle
                  className={`text-xl ${
                    availableRooms > 0 ? "text-green-500" : "text-gray-400"
                  }`}
                />
              </div>
            </div>
            {errors.availableRooms && (
              <p className="text-red-500 text-xs mt-1 outfit flex items-center gap-1">
                <span>⚠️</span> {errors.availableRooms}
              </p>
            )}
            <p className="text-gray-500 text-xs mt-1 outfit">
              Rooms currently available for booking (max: {totalRooms || 0})
            </p>
          </div>

          {/* Preview Card */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border-2 border-blue-200">
            <h3 className="text-sm font-semibold text-blue-800 mb-3 outfit">
              📊 Preview After Update
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-blue-600 outfit">Occupancy Rate</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex-1 bg-blue-200 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-blue-600 h-full transition-all duration-300"
                      style={{ width: `${occupancyRate}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-bold text-blue-700 outfit">
                    {occupancyRate}%
                  </span>
                </div>
              </div>
              <div>
                <p className="text-xs text-blue-600 outfit">Status</p>
                <p className="text-sm font-bold mt-1 outfit">
                  {available === 0 ? (
                    <span className="text-red-600">🔴 Full</span>
                  ) : available <= 3 ? (
                    <span className="text-orange-600">🟠 Low Stock</span>
                  ) : (
                    <span className="text-green-600">🟢 Available</span>
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all outfit font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all outfit font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Updating...
                </>
              ) : (
                <>
                  <FaCheckCircle />
                  Update Capacity
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      ` }} />
    </div>
  );
};

export default UpdateCapacityModal;
