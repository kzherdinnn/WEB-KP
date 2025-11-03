// client/src/context/AppContext.jsx

import axios from "axios";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { useNavigate } from "react-router-dom";
import { useUser, useAuth } from "@clerk/clerk-react";
import { toast } from "react-hot-toast";

// Atur base URL secara global
axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const navigate = useNavigate();
  const { user } = useUser();
  const { getToken } = useAuth(); // Dapatkan fungsi getToken dari Clerk

  const [isAdmin, setIsAdmin] = useState(false);
  const [userRole, setUserRole] = useState("user");
  const [showHotelReg, setShowHotelReg] = useState(false);
  const [searchedCities, setSearchedCities] = useState([]);
  const [rooms, setRooms] = useState([]);

  // ================== PERUBAHAN UTAMA DI SINI ==================
  // Setup Axios Interceptor. Ini akan berjalan sekali saat context dimuat.
  // Interceptor ini akan menambahkan token ke SEMUA request secara otomatis.
  useEffect(() => {
    const interceptor = axios.interceptors.request.use(
      async (config) => {
        // Ambil token dari Clerk sebelum setiap request dikirim
        const token = await getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      },
    );

    // Cleanup interceptor saat komponen di-unmount
    return () => {
      axios.interceptors.request.eject(interceptor);
    };
  }, [getToken]); // Dijalankan kembali jika fungsi getToken berubah
  // =============================================================

  //Fetch Rooms on load
  const fetchRooms = useCallback(async () => {
    try {
      // Tidak perlu header manual lagi, interceptor akan menanganinya
      const { data } = await axios.get("/api/room");
      if (data.success) {
        setRooms(data.rooms);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  }, []);

  //Fetch User Data on load
  const fetchUser = useCallback(async () => {
    try {
      // Tidak perlu header manual lagi, interceptor akan menanganinya
      const { data } = await axios.get("/api/user");
      if (data.success) {
        setUserRole(data.role);
        setIsAdmin(data.role === "admin");
        setSearchedCities(data.recentSearchedCities);
      } else {
        setTimeout(() => {
          fetchUser();
        }, 5000);
      }
    } catch (error) {
      toast.error(error.message);
    }
  }, [axios]); // Hapus getToken dari dependensi karena sudah ditangani interceptor

  useEffect(() => {
    if (user) {
      fetchUser();
      fetchRooms();
    }
  }, [user, fetchUser, fetchRooms]); // Tambahkan fetchRooms ke dependensi

  const value = {
    axios,
    navigate,
    user,
    getToken, // Tetap sediakan untuk kasus khusus jika diperlukan
    isAdmin,
    setIsAdmin,
    userRole,
    setUserRole,
    showHotelReg,
    setShowHotelReg,
    searchedCities,
    setSearchedCities,
    rooms,
    setRooms,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  return useContext(AppContext);
};
