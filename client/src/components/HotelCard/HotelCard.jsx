import React from "react";
import { Link } from "react-router-dom";
import { IoLocationOutline } from "react-icons/io5";
import { FaStar } from "react-icons/fa";

const HotelCard = ({ room }) => {
  const ratingStars = 4;
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition hover:shadow-xl duration-300 max-w-xs w-full">
      <Link
        to={`/bengkel/${room._id}`}
        onClick={() => scrollTo(0, 0)}
        className="relative block"
      >
        <img
          loading="lazy"
          src={room.images[0]}
          alt={room.type}
          className="w-full h-48 object-cover rounded-t-lg"
        />
        {/* Availability Badge */}
        {room.availableRooms !== undefined && (
          <div className="absolute top-2 right-2">
            <span
              className={`${
                room.availableRooms > 0
                  ? room.availableRooms <= 3
                    ? "bg-orange-500"
                    : "bg-green-500"
                  : "bg-red-500"
              } text-white text-xs font-semibold px-2 py-1 rounded-full shadow-lg`}
            >
              {room.availableRooms > 0
                ? `${room.availableRooms} Tersedia`
                : "PENUH"}
            </span>
          </div>
        )}
      </Link>

      <div className="p-4 outfit">
        <div className="flex justify-between items-center">
          {/* Bengkel Name */}
          <h3 className="text-xl font-semibold text-gray-800">
            {room.hotel.name}
          </h3>

          {/* Ratings */}
          <div className="flex items-center gap-1 text-yellow-400 text-sm">
            {[...Array(5)].map((_, index) => (
              <FaStar
                key={index}
                className={
                  index < ratingStars ? "text-yellow-400" : "text-gray-300"
                }
              />
            ))}
          </div>
          <span className="text-sm text-gray-600">(4.5)</span>
        </div>

        {/* Location */}
        <div className="flex gap-1 items-center text-sm text-gray-500 mt-2">
          <IoLocationOutline className="w-5 h-5 text-gray-800" />
          <p>{room.hotel.address}</p>
        </div>

        {/* Availability Info */}
        {room.availableRooms !== undefined && (
          <div className="mt-2 text-xs text-gray-600">
            {room.availableRooms > 0 ? (
              <span className="text-green-600 font-medium">
                ✓ {room.availableRooms}/{room.totalRooms} kamar tersedia
              </span>
            ) : (
              <span className="text-red-600 font-semibold">
                ✗ Tidak ada kamar tersedia
              </span>
            )}
          </div>
        )}

        {/* Price and Booking Button */}
        <div className="flex items-center justify-between mt-4 outfit">
          <p className="text-lg font-semibold text-gray-900">
            ${room.pricePerNight}{" "}
            <span className="text-lg font-normal text-gray-500">/ night</span>
          </p>

          <Link
            to={`/bengkel/${room._id}`}
            className={`px-4 py-2 text-sm rounded-lg transition duration-300 ${
              room.availableRooms !== undefined && room.availableRooms <= 0
                ? "bg-gray-400 text-white cursor-not-allowed pointer-events-none"
                : "bg-gray-700 text-white hover:bg-gray-600"
            }`}
          >
            {room.availableRooms !== undefined && room.availableRooms <= 0
              ? "Penuh"
              : "Pesan Sekarang"}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HotelCard;
