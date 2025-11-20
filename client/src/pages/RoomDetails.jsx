import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Footer } from "../components";
import {
  FaLocationArrow,
  FaStar,
  FaCalendarAlt,
  FaSearch,
  FaBan,
} from "react-icons/fa";
import { amenityIcons } from "../data/data";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const RoomDetails = () => {
  const { rooms, axios } = useAppContext();
  const navigate = useNavigate();
  const { id } = useParams();

  const [room, setRoom] = useState(null);
  const [mainImage, setMainImage] = useState(null);
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [guests, setGuests] = useState(1);
  const [numberOfRooms, setNumberOfRooms] = useState(1);
  const [isAvailable, setIsAvailable] = useState(false);
  const [availabilityInfo, setAvailabilityInfo] = useState(null);

  useEffect(() => {
    const foundRoom = rooms.find((room) => room._id === id);
    if (foundRoom) {
      setRoom(foundRoom);
      setMainImage(foundRoom.images[0]);
    }
  }, [id, rooms]);

  const checkAvailability = async () => {
    if (!checkInDate || !checkOutDate) {
      toast.error(
        "Harap pilih tanggal check-in dan check-out terlebih dahulu.",
      );
      return;
    }
    if (numberOfRooms < 1) {
      toast.error("Jumlah kamar harus minimal 1.");
      return;
    }

    try {
      const { data } = await axios.post("/api/bookings/check-availability", {
        room: id,
        checkInDate,
        checkOutDate,
        numberOfRooms,
      });

      if (data.success) {
        setIsAvailable(data.available);
        setAvailabilityInfo({
          available: data.available,
          message: data.message,
          availableRooms: data.availableRooms,
        });

        if (data.available) {
          toast.success(data.message);
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      const message =
        error.response?.data?.message || "Gagal memeriksa ketersediaan.";
      toast.error(message);
    }
  };

  const createBooking = async () => {
    if (!checkInDate || !checkOutDate || !guests || !numberOfRooms) {
      toast.error("Harap lengkapi semua detail booking.");
      return null;
    }
    if (guests < 1) {
      toast.error("Jumlah tamu harus minimal 1.");
      return null;
    }
    if (numberOfRooms < 1) {
      toast.error("Jumlah kamar harus minimal 1.");
      return null;
    }
    if (room.availableRooms && numberOfRooms > room.availableRooms) {
      toast.error(`Hanya tersedia ${room.availableRooms} kamar.`);
      return null;
    }
    if (!isAvailable) {
      toast("Harap periksa ketersediaan terlebih dahulu.", { icon: "👆" });
      return null;
    }

    try {
      const { data } = await axios.post("/api/bookings/book", {
        room: id,
        checkInDate,
        checkOutDate,
        guests,
        numberOfRooms,
      });

      if (data.success && data.token) {
        // Navigate to custom payment page with booking data
        const nights = Math.max(
          1,
          Math.ceil(
            (new Date(checkOutDate) - new Date(checkInDate)) /
              (1000 * 60 * 60 * 24),
          ),
        );

        const bookingData = {
          bengkelName: room.hotel.name,
          bengkelAddress: room.hotel.address,
          roomType: room.type,
          roomImage: room.images[0],
          checkInDate,
          checkOutDate,
          guests,
          numberOfRooms,
          pricePerNight: room.pricePerNight,
          totalPrice: numberOfRooms * nights * room.pricePerNight,
        };

        navigate("/payment", {
          state: {
            bookingData,
            snapToken: data.token,
            bookingId: data.bookingId,
          },
        });

        return data.token;
      } else {
        toast.error(data.message || "Gagal mendapatkan token pembayaran.");
        return null;
      }
    } catch (error) {
      const message =
        error.response?.data?.message || "Permintaan booking gagal.";
      toast.error(message);
      return null;
    }
  };

  if (!room) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-sm tracking-widest text-gray-700 uppercase">
            Loading...
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="py-28 md:py-36 px-4 md:px-16 lg:px-24 xl:px-32 outfit">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <h1 className="text-3xl md:text-4xl playfair">
            {room.hotel.name}{" "}
            <span className="text-base font-light outfit">({room.type})</span>
          </h1>
          <div className="flex gap-2 flex-wrap">
            <span className="bg-orange-500 text-white rounded-full px-3 py-1.5 text-xs max-w-fit outfit">
              DISKON 20%
            </span>
            {room.availableRooms !== undefined && (
              <span
                className={`${
                  room.availableRooms > 0 ? "bg-green-500" : "bg-red-500"
                } text-white rounded-full px-3 py-1.5 text-xs max-w-fit outfit font-semibold`}
              >
                {room.availableRooms > 0
                  ? `${room.availableRooms}/${room.totalRooms} Tersedia`
                  : "PENUH"}
              </span>
            )}
          </div>
        </div>

        {/* Info Rating & Lokasi */}
        <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-gray-600 outfit">
          <div className="flex items-center gap-1">
            <FaStar className="text-yellow-500" />
            {room.rating} <span className="ml-1 text-xs">(300+ Ulasan)</span>
          </div>
          <div className="flex items-center gap-1">
            <FaLocationArrow />
            <span>{room.hotel.address}</span>
          </div>
        </div>

        {/* Galeri Gambar */}
        <div className="flex flex-col lg:flex-row mt-6 gap-6">
          <div className="lg:w-1/2 w-full relative">
            <img
              loading="lazy"
              src={mainImage}
              alt="Gambar utama kamar"
              className="w-full h-full rounded-xl shadow-lg object-cover max-h-[500px]"
            />
          </div>
          <div className="grid grid-cols-2 gap-4 lg:w-1/2 w-full">
            {room.images?.slice(0, 4).map((image, index) => (
              <img
                loading="lazy"
                key={index}
                src={image}
                alt={`Pratinjau kamar ${index + 1}`}
                onClick={() => setMainImage(image)}
                className={`w-full h-32 object-cover rounded-lg shadow-md cursor-pointer transition duration-200 hover:opacity-80 ${
                  mainImage === image ? "ring-4 ring-orange-500" : ""
                }`}
              />
            ))}
          </div>
        </div>

        {/* Info & Harga */}
        <div className="flex flex-col md:flex-row justify-between mt-10 gap-8 outfit">
          <div>
            <h2 className="text-2xl md:text-3xl outfit mb-4">
              Rasakan Kemewahan Terbaik
            </h2>
            <div className="flex flex-wrap gap-3">
              {room.amenities?.map((tag, idx) => (
                <span
                  key={idx}
                  className="flex items-center gap-1 bg-gray-100 text-sm text-gray-700 px-3 py-1 rounded-full"
                >
                  {amenityIcons[tag]} {tag}
                </span>
              ))}
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="text-xs text-gray-500 uppercase tracking-wide">
              Harga Dasar
            </div>
            <div className="text-3xl font-bold text-gray-900">
              Rp{room.pricePerNight.toLocaleString("id-ID")}
            </div>
            <div className="text-xs text-gray-600 -mt-1">
              per malam / per kamar
            </div>
            {room.availableRooms !== undefined && room.isAvailable && (
              <div className="text-sm text-gray-600">
                {room.availableRooms > 0 ? (
                  <span className="text-green-600 font-medium">
                    ✓ {room.availableRooms} kamar tersedia
                  </span>
                ) : (
                  <span className="text-red-600 font-semibold">
                    ✗ Kamar sudah penuh
                  </span>
                )}
              </div>
            )}
            {!room.isAvailable && (
              <div className="flex items-center gap-2 bg-red-100 text-red-700 px-4 py-2 rounded-lg">
                <FaBan />
                <span className="text-sm font-semibold">
                  Tidak dapat dipesan saat ini
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Form Booking */}
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            await createBooking();
          }}
          className={`bg-white text-gray-700 rounded-lg px-6 py-6 mt-10 shadow-xl border border-black/10 grid gap-6 md:grid-cols-5 ${!room.isAvailable ? "opacity-60 pointer-events-none" : ""}`}
        >
          {!room.isAvailable && (
            <div className="md:col-span-5 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
              <FaBan className="text-red-600 text-xl" />
              <p className="text-red-700 font-medium">
                Form booking tidak tersedia karena kamar sedang tidak tersedia
              </p>
            </div>
          )}
          <div className="flex flex-col">
            <label className="mb-2 font-semibold text-gray-700 flex items-center gap-2">
              <FaCalendarAlt className="text-blue-600" /> Tanggal Check-in
            </label>
            <input
              id="checkInDate"
              name="checkInDate"
              value={checkInDate}
              onChange={(e) => setCheckInDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              type="date"
              disabled={!room.isAvailable}
              className="border-2 border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-2 font-semibold text-gray-700 flex items-center gap-2">
              <FaCalendarAlt className="text-blue-600" /> Tanggal Check-out
            </label>
            <input
              id="checkOutDate"
              name="checkOutDate"
              value={checkOutDate}
              disabled={!checkInDate || !room.isAvailable}
              min={checkInDate}
              onChange={(e) => setCheckOutDate(e.target.value)}
              type="date"
              className="border-2 border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="numberOfRooms"
              className="mb-2 font-semibold text-gray-700"
            >
              Berapa Kamar?
            </label>
            <input
              id="numberOfRooms"
              value={numberOfRooms}
              name="numberOfRooms"
              onChange={(e) => setNumberOfRooms(parseInt(e.target.value) || 1)}
              type="number"
              min="1"
              max={room?.availableRooms || 10}
              placeholder="1"
              disabled={!room.isAvailable}
              className="border-2 border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
            <p className="text-xs text-gray-500 mt-1">
              Maksimal {room?.availableRooms || 10} kamar tersedia
            </p>
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="guests"
              className="mb-2 font-semibold text-gray-700"
            >
              Jumlah Tamu
            </label>
            <input
              id="guests"
              value={guests}
              name="guests"
              onChange={(e) => setGuests(parseInt(e.target.value) || 1)}
              type="number"
              min="1"
              placeholder="1"
              disabled={!room.isAvailable}
              className="border-2 border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
            <p className="text-xs text-gray-500 mt-1">
              Total tamu untuk semua kamar
            </p>
          </div>

          {/* Price Preview */}
          {checkInDate && checkOutDate && (
            <div className="col-span-full bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl px-6 py-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-blue-600 font-medium uppercase tracking-wide mb-1">
                    Total Pembayaran
                  </p>
                  <p className="text-3xl font-bold text-blue-900">
                    Rp
                    {(
                      numberOfRooms *
                      Math.max(
                        1,
                        Math.ceil(
                          (new Date(checkOutDate) - new Date(checkInDate)) /
                            (1000 * 60 * 60 * 24),
                        ),
                      ) *
                      room.pricePerNight
                    ).toLocaleString("id-ID")}
                  </p>
                  <p className="text-xs text-blue-700 mt-1">
                    {numberOfRooms} kamar •{" "}
                    {Math.max(
                      1,
                      Math.ceil(
                        (new Date(checkOutDate) - new Date(checkInDate)) /
                          (1000 * 60 * 60 * 24),
                      ),
                    )}{" "}
                    malam
                  </p>
                </div>
                <div className="text-5xl">💰</div>
              </div>
            </div>
          )}

          {/* Tombol Aksi */}
          <div className="col-span-full md:col-span-2 flex flex-col gap-3 self-end">
            {availabilityInfo && (
              <div
                className={`text-sm px-4 py-2 rounded-md ${
                  availabilityInfo.available
                    ? "bg-green-50 text-green-700 border border-green-200"
                    : "bg-red-50 text-red-700 border border-red-200"
                }`}
              >
                {availabilityInfo.message}
                {availabilityInfo.available &&
                  availabilityInfo.availableRooms && (
                    <span className="font-semibold ml-1">
                      ({availabilityInfo.availableRooms} kamar tersedia)
                    </span>
                  )}
              </div>
            )}
            <div className="flex flex-col md:flex-row gap-2">
              <button
                type="button"
                onClick={checkAvailability}
                disabled={!room.isAvailable}
                className="w-full bg-gray-800 text-white flex items-center justify-center gap-2 px-6 py-2 rounded-md hover:bg-gray-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                <FaSearch />
                Cek Ketersediaan
              </button>
              <button
                type="submit"
                disabled={
                  !room.isAvailable ||
                  !isAvailable ||
                  (room.availableRooms !== undefined &&
                    room.availableRooms <= 0)
                }
                className="w-full bg-orange-500 text-white flex items-center justify-center gap-2 px-10 py-2 rounded-md transition disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-orange-600"
              >
                {!room.isAvailable ? "Tidak Tersedia" : "Booking Sekarang"}
              </button>
            </div>
          </div>
        </form>
      </div>

      <div className="pt-15 bg-gray-100 w-full">
        <Footer />
      </div>
    </>
  );
};

export default RoomDetails;
