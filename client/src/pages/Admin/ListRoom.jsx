import React, { useState, useEffect, useCallback } from "react";
import { FaEdit, FaTrash, FaSync } from "react-icons/fa";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";
import EditRoomModal from "../../components/admin/EditRoomModal";
import UpdateCapacityModal from "../../components/admin/UpdateCapacityModal";

const ListRoom = () => {
  const { axios, user } = useAppContext();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [capacityRoom, setCapacityRoom] = useState(null);
  const [updatingCapacity, setUpdatingCapacity] = useState(false);

  const fetchRooms = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/room/admin");
      if (data.success) {
        setRooms(data.rooms);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  }, [axios]);

  useEffect(() => {
    if (user) {
      fetchRooms();
    }
  }, [user, fetchRooms]);

  const toggleAvailable = async (roomId) => {
    try {
      const { data } = await axios.post("/api/room/toggle-availability", {
        roomId,
      });
      if (data.success) {
        toast.success(data.message);
        fetchRooms();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const deleteRoom = async (roomId, roomType) => {
    const confirmDelete = window.confirm(
      `Apakah Anda yakin ingin menghapus room "${roomType}"?\n\nTindakan ini tidak dapat dibatalkan!`,
    );

    if (!confirmDelete) return;

    try {
      const { data } = await axios.delete(`/api/room/${roomId}`);
      if (data.success) {
        toast.success(data.message);
        fetchRooms();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Gagal menghapus room");
    }
  };

  const handleEditRoom = (room) => {
    setEditingRoom(room);
  };

  const handleCloseEditModal = () => {
    setEditingRoom(null);
  };

  const handleEditSuccess = () => {
    fetchRooms();
  };

  const handleOpenCapacityModal = (room) => {
    setCapacityRoom(room);
  };

  const handleCloseCapacityModal = () => {
    setCapacityRoom(null);
  };

  const handleUpdateCapacity = async (capacityData) => {
    try {
      setUpdatingCapacity(true);
      const { data } = await axios.patch(
        `/api/room/${capacityRoom._id}/capacity`,
        capacityData,
      );

      if (data.success) {
        toast.success(data.message);
        fetchRooms();
        handleCloseCapacityModal();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update capacity");
    } finally {
      setUpdatingCapacity(false);
    }
  };

  return (
    <>
      {editingRoom && (
        <EditRoomModal
          room={editingRoom}
          onClose={handleCloseEditModal}
          onSuccess={handleEditSuccess}
        />
      )}
      {capacityRoom && (
        <UpdateCapacityModal
          room={capacityRoom}
          onClose={handleCloseCapacityModal}
          onUpdate={handleUpdateCapacity}
          loading={updatingCapacity}
        />
      )}
      <div className="px-4 sm:px-6 lg:px-8 py-8 bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 playfair">
                  Room Lists
                </h1>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                  {rooms.length} Rooms
                </span>
              </div>
              <p className="text-sm md:text-base text-gray-600 mt-2 outfit">
                Monitor your room listings, track bookings and manage
                availability
              </p>
            </div>
            <button
              onClick={fetchRooms}
              disabled={loading}
              className={`px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all flex items-center gap-2 outfit font-medium ${
                loading ? "opacity-50" : ""
              }`}
              title="Refresh data"
            >
              <FaSync
                className={`text-gray-600 ${loading ? "animate-spin" : ""}`}
              />
              <span className="hidden md:inline">Refresh</span>
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        {!loading && rooms.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* Total Rooms */}
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-5 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-xs font-medium uppercase tracking-wide outfit">
                    Total Rooms
                  </p>
                  <p className="text-3xl font-bold mt-1">
                    {rooms.reduce(
                      (sum, room) => sum + (room.totalRooms || 0),
                      0,
                    )}
                  </p>
                </div>
                <div className="bg-white/20 p-3 rounded-lg">
                  <svg
                    className="w-8 h-8"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Available Rooms */}
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-5 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-xs font-medium uppercase tracking-wide outfit">
                    Available
                  </p>
                  <p className="text-3xl font-bold mt-1">
                    {rooms.reduce(
                      (sum, room) => sum + (room.availableRooms || 0),
                      0,
                    )}
                  </p>
                </div>
                <div className="bg-white/20 p-3 rounded-lg">
                  <svg
                    className="w-8 h-8"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Occupied Rooms */}
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-5 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-xs font-medium uppercase tracking-wide outfit">
                    Occupied
                  </p>
                  <p className="text-3xl font-bold mt-1">
                    {rooms.reduce(
                      (sum, room) =>
                        sum +
                        ((room.totalRooms || 0) - (room.availableRooms || 0)),
                      0,
                    )}
                  </p>
                </div>
                <div className="bg-white/20 p-3 rounded-lg">
                  <svg
                    className="w-8 h-8"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Occupancy Rate */}
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-5 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-xs font-medium uppercase tracking-wide outfit">
                    Occupancy Rate
                  </p>
                  <p className="text-3xl font-bold mt-1">
                    {(() => {
                      const totalRooms = rooms.reduce(
                        (sum, room) => sum + (room.totalRooms || 0),
                        0,
                      );
                      const occupiedRooms = rooms.reduce(
                        (sum, room) =>
                          sum +
                          ((room.totalRooms || 0) - (room.availableRooms || 0)),
                        0,
                      );
                      return totalRooms > 0
                        ? Math.round((occupiedRooms / totalRooms) * 100)
                        : 0;
                    })()}
                    %
                  </p>
                </div>
                <div className="bg-white/20 p-3 rounded-lg">
                  <svg
                    className="w-8 h-8"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 outfit">
              All Rooms
            </h2>
            <p className="text-sm text-gray-600 mt-1 outfit">
              Manage room types, capacity, and availability
            </p>
          </div>
          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600"></div>
                <p className="mt-4 text-gray-600 outfit font-medium">
                  Loading rooms...
                </p>
              </div>
            ) : rooms.length === 0 ? (
              <div className="text-center py-16">
                <svg
                  className="mx-auto h-16 w-16 text-gray-300 mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
                <p className="text-xl font-semibold text-gray-700 playfair">
                  No rooms yet
                </p>
                <p className="text-sm text-gray-500 mt-2 outfit">
                  Add your first room type to start accepting bookings
                </p>
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Room Type
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Facilities
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Price/Night
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Capacity
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-700 uppercase tracking-wider text-center">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {rooms.map((room, index) => (
                    <tr
                      key={room._id}
                      className={`border-b hover:bg-blue-50/30 transition-colors ${
                        index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                      }`}
                    >
                      <td className="px-6 py-4">
                        <span className="font-semibold text-gray-900">
                          {room.type}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {room.amenities.slice(0, 3).map((a, i) => (
                            <span
                              key={i}
                              className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-md border border-blue-200"
                            >
                              {a}
                            </span>
                          ))}
                          {room.amenities.length > 3 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">
                              +{room.amenities.length - 3}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-bold text-gray-900 text-base">
                          Rp{room.pricePerNight?.toLocaleString("id-ID")}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-2 min-w-[180px]">
                          {/* Capacity Numbers with Badge */}
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-bold text-gray-800">
                              {room.availableRooms || 0}/{room.totalRooms || 1}
                            </span>
                            {room.availableRooms === 0 && (
                              <span className="px-2 py-0.5 bg-red-100 text-red-600 text-xs font-bold rounded-full animate-pulse">
                                FULL
                              </span>
                            )}
                            {room.availableRooms > 0 &&
                              room.availableRooms <= 3 && (
                                <span className="px-2 py-0.5 bg-orange-100 text-orange-600 text-xs font-semibold rounded-full">
                                  LOW
                                </span>
                              )}
                            {room.availableRooms > 3 && (
                              <span className="px-2 py-0.5 bg-green-100 text-green-600 text-xs font-semibold rounded-full">
                                OK
                              </span>
                            )}
                          </div>

                          {/* Progress Bar */}
                          <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${
                                room.availableRooms === 0
                                  ? "bg-red-500"
                                  : room.availableRooms <= 3
                                    ? "bg-orange-500"
                                    : "bg-green-500"
                              }`}
                              style={{
                                width: `${
                                  ((room.availableRooms || 0) /
                                    (room.totalRooms || 1)) *
                                  100
                                }%`,
                              }}
                            ></div>
                          </div>

                          {/* Manage Button */}
                          <button
                            onClick={() => handleOpenCapacityModal(room)}
                            className="text-xs text-blue-600 hover:text-blue-800 hover:bg-blue-50 font-medium transition-all py-1 px-2 rounded-md border border-transparent hover:border-blue-200"
                            title="Update room capacity"
                          >
                            📊 Manage Capacity
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <label
                          className="inline-flex items-center cursor-pointer gap-2"
                          title={
                            room.isAvailable
                              ? "Click to mark as unavailable"
                              : "Click to mark as available"
                          }
                        >
                          <input
                            type="checkbox"
                            className="sr-only"
                            checked={room.isAvailable}
                            onChange={() => toggleAvailable(room._id)}
                          />
                          <div className="relative">
                            <div
                              className={`w-12 h-6 rounded-full shadow-inner transition-all duration-300 ease-in-out ${
                                room.isAvailable
                                  ? "bg-green-500"
                                  : "bg-gray-300"
                              }`}
                            >
                              <div
                                className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 ease-in-out ${
                                  room.isAvailable
                                    ? "translate-x-6"
                                    : "translate-x-0.5"
                                }`}
                              ></div>
                            </div>
                          </div>
                          <span
                            className={`text-xs font-semibold ${
                              room.isAvailable
                                ? "text-green-600"
                                : "text-gray-500"
                            }`}
                          >
                            {room.isAvailable ? "✓ Active" : "✗ Inactive"}
                          </span>
                        </label>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleEditRoom(room)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                            title="Edit room"
                          >
                            <FaEdit className="text-lg" />
                          </button>
                          <button
                            onClick={() => deleteRoom(room._id, room.type)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                            title="Delete room"
                          >
                            <FaTrash className="text-lg" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ListRoom;
