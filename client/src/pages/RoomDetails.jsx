import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Footer } from "../components";
import { FaLocationArrow, FaStar, FaCalendarAlt, FaSearch } from "react-icons/fa";
import { amenityIcons } from "../data/data";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

// URL skrip Midtrans Snap (gunakan sandbox untuk development)
const MIDTRANS_SNAP_URL = "https://app.sandbox.midtrans.com/snap/snap.js";
// Ambil Client Key dari file .env di folder client
const MIDTRANS_CLIENT_KEY = import.meta.env.VITE_MIDTRANS_CLIENT_KEY;

const RoomDetails = () => {
  const { rooms, axios } = useAppContext();
  const navigate = useNavigate();
  const { id } = useParams();

  // State Anda tidak berubah
  const [room, setRoom] = useState(null);
  const [mainImage, setMainImage] = useState(null);
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [guests, setGuests] = useState(1);
  const [isAvailable, setIsAvailable] = useState(false);

  // ✅ Muat skrip Midtrans Snap secara dinamis saat komponen dimuat
  useEffect(() => {
    const script = document.createElement("script");
    script.src = MIDTRANS_SNAP_URL;
    script.setAttribute("data-client-key", MIDTRANS_CLIENT_KEY);
    script.async = true;

    document.body.appendChild(script);

    return () => {
      // Cleanup: hapus skrip saat komponen di-unmount
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    const foundRoom = rooms.find((room) => room._id === id);
    if (foundRoom) {
      setRoom(foundRoom);
      setMainImage(foundRoom.images?.[0]);
    }
  }, [id, rooms]);

  const checkAvailability = async () => {
    if (!checkInDate || !checkOutDate) {
      toast.error("Silakan pilih tanggal check-in dan check-out.");
      return;
    }
    if (new Date(checkInDate) >= new Date(checkOutDate)) {
      toast.error("Tanggal check-out harus setelah tanggal check-in.");
      return;
    }

    try {
      const { data } = await axios.post("/api/bookings/check-availability", {
        room: id,
        checkInDate,
        checkOutDate,
      });

      if (data.isAvailable) {
        setIsAvailable(true);
        toast.success("Kamar tersedia untuk tanggal yang dipilih!");
      } else {
        setIsAvailable(false);
        toast.error("Kamar tidak tersedia.");
      }
    } catch (error) {
      const message =
        error.response?.data?.message || "Gagal memeriksa ketersediaan.";
      toast.error(message);
    }
  };

  // ✅ FUNGSI onSubmit SEKARANG MEMICU PEMBAYARAN
  const onSubmit = async (e) => {
    e.preventDefault();

    if (!checkInDate || !checkOutDate || !guests) {
      toast.error("Harap lengkapi semua detail booking.");
      return;
    }
    if (guests < 1 || guests > 4) {
      toast.error("Jumlah tamu harus antara 1 dan 4.");
      return;
    }
    if (!isAvailable) {
      toast("Harap periksa ketersediaan terlebih dahulu.", { icon: "👆" });
      return;
    }

    try {
      // 1. Minta token pembayaran dari backend
      const { data } = await axios.post("/api/bookings/book", {
        room: id,
        checkInDate,
        checkOutDate,
        guests,
      });

      if (data.success && data.token) {
        // 2. Jika token diterima, buka popup pembayaran Midtrans Snap
        window.snap.pay(data.token, {
          onSuccess: (result) => {
            console.log("Pembayaran berhasil:", result);
            toast.success("Pembayaran berhasil! Booking Anda telah dikonfirmasi.");
            navigate("/my-bookings");
          },
          onPending: (result) => {
            console.log("Pembayaran tertunda:", result);
            toast("Pembayaran Anda sedang diproses.", { icon: "⏳" });
            navigate("/my-bookings");
          },
          onError: (error) => {
            console.error("Error pembayaran:", error);
            toast.error("Terjadi kesalahan saat pembayaran.");
          },
          onClose: () => {
            toast("Anda menutup popup pembayaran.");
          },
        });
      } else {
        toast.error(data.message || "Gagal mendapatkan token pembayaran.");
      }
    } catch (error) {
      const message = error.response?.data?.message || "Permintaan booking gagal.";
      toast.error(message);
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
        {/* ... Sisa kode JSX Anda tidak perlu diubah ... */}
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <h1 className="text-3xl md:text-4xl playfair">
            {room.hotel.name}{" "}
            <span className="text-base font-light outfit">({room.type})</span>
          </h1>
          <span className="bg-orange-500 text-white rounded-full px-3 py-1.5 text-xs max-w-fit outfit">
            DISKON 20%
          </span>
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
          <div className="lg:w-1/2 w-full">
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
          <div className="text-2xl font-semibold text-right">
            Rp{room.pricePerNight.toLocaleString("id-ID")}/malam
          </div>
        </div>

        {/* Form Booking */}
        <form
          className="bg-white text-gray-700 rounded-lg px-6 py-6 mt-10 shadow-xl border border-black/10 grid gap-6 md:grid-cols-5"
          onSubmit={onSubmit}
        >
          <div className="flex flex-col">
            <label className="mb-1 font-medium flex items-center gap-2">
              <FaCalendarAlt /> Check-in
            </label>
            <input
              id="checkInDate"
              name="checkInDate"
              value={checkInDate}
              onChange={(e) => setCheckInDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              type="date"
              className="border border-gray-200 rounded px-3 py-2 text-sm"
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-1 font-medium flex items-center gap-2">
              <FaCalendarAlt /> Check-out
            </label>
            <input
              id="checkOutDate"
              name="checkOutDate"
              value={checkOutDate}
              disabled={!checkInDate}
              min={checkInDate}
              onChange={(e) => setCheckOutDate(e.target.value)}
              type="date"
              className="border border-gray-200 rounded px-3 py-2 text-sm"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="guests" className="mb-1 font-medium">
              Tamu
            </label>
            <input
              id="guests"
              value={guests}
              name="guests"
              onChange={(e) => setGuests(e.target.value)}
              type="number"
              min="1"
              max="4"
              placeholder="1"
              className="border border-gray-200 rounded px-3 py-2 text-sm"
            />
          </div>

          {/* Tombol Aksi */}
          <div className="col-span-full md:col-span-2 flex flex-col md:flex-row gap-2 self-end">
            <button
              type="button"
              onClick={checkAvailability}
              className="w-full bg-gray-800 text-white flex items-center justify-center gap-2 px-6 py-2 rounded-md hover:bg-gray-700 transition"
            >
              <FaSearch />
              Cek Ketersediaan
            </button>
            <button
              type="submit"
              disabled={!isAvailable}
              className="w-full bg-orange-500 text-white flex items-center justify-center gap-2 px-10 py-2 rounded-md transition disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-orange-600"
            >
              Booking Sekarang
            </button>
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