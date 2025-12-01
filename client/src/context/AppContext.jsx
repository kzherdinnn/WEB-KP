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

// Atur base URL secara global (remove trailing slash untuk avoid double slashes)
const baseURL = (import.meta.env.VITE_API_URL || 'http://localhost:3000').replace(/\/$/, '');
axios.defaults.baseURL = baseURL;

const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const navigate = useNavigate();
  const { user } = useUser();
  const { getToken } = useAuth(); // Dapatkan fungsi getToken dari Clerk

  const [isAdmin, setIsAdmin] = useState(false);
  const [userRole, setUserRole] = useState("user");
  const [searchedCities, setSearchedCities] = useState([]);
  // rooms dan showHotelReg dihapus karena tidak digunakan lagi

  // Dark/Light Mode State
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check localStorage or system preference
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      return savedTheme === "dark";
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  // Apply theme to document
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  // Toggle theme function
  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

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

  //Fetch Spareparts on load (Workshop System) - Optional global fetch
  const fetchSpareparts = useCallback(async () => {
    try {
      // Fetch spareparts instead of rooms
      // Note: We don't store it in global state anymore as pages fetch their own data
      // But we keep the function if needed for pre-fetching
      await axios.get("/api/spareparts");
    } catch (error) {
      // Silent fail - not critical for app to work
      console.log('Could not fetch spareparts:', error.message);
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
      fetchSpareparts();
    }
  }, [user, fetchUser, fetchSpareparts]);

  const value = {
    axios,
    navigate,
    user,
    getToken, // Tetap sediakan untuk kasus khusus jika diperlukan
    isAdmin,
    setIsAdmin,
    userRole,
    setUserRole,
    searchedCities,
    setSearchedCities,
    isDarkMode,
    setIsDarkMode,
    toggleTheme,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  return useContext(AppContext);
};
