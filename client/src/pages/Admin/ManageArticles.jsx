import { useState, useEffect } from "react";
import { useAppContext } from "../../context/AppContext";
import {
    FaPlus,
    FaEdit,
    FaTrash,
    FaSearch,
    FaNewspaper,
    FaEye,
    FaEyeSlash,
    FaImage,
} from "react-icons/fa";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const ManageArticles = () => {
    const { axios } = useAppContext();
    const navigate = useNavigate();
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    const fetchArticles = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get("/api/articles?limit=100");
            if (data.success) {
                setArticles(data.data);
            }
        } catch (error) {
            toast.error("Gagal memuat artikel");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchArticles();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("Yakin ingin menghapus artikel ini?")) return;
        try {
            await axios.delete(`/api/articles/${id}`);
            toast.success("Artikel berhasil dihapus");
            fetchArticles();
        } catch (error) {
            toast.error("Gagal menghapus artikel");
        }
    };

    const filteredArticles = articles.filter(
        (item) =>
            item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="px-4 sm:px-6 lg:px-8 py-8 bg-gray-50 min-h-screen">
            <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 font-playfair">
                        Manajemen Artikel
                    </h1>
                    <p className="text-gray-600 mt-2">
                        Buat, edit, dan kelola artikel blog
                    </p>
                </div>
                <div className="flex gap-3 w-full sm:w-auto">
                    <div className="relative flex-grow sm:flex-grow-0">
                        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Cari artikel..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 w-full sm:w-64"
                        />
                    </div>
                    <button
                        onClick={() => navigate("/admin/articles/new")}
                        className="bg-teal-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-teal-700 transition shadow-sm whitespace-nowrap"
                    >
                        <FaPlus /> Tulis Artikel
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 text-gray-600 uppercase text-xs font-semibold">
                        <tr>
                            <th className="p-4">Judul</th>
                            <th className="p-4">Kategori</th>
                            <th className="p-4">Penulis</th>
                            <th className="p-4">Tanggal</th>
                            <th className="p-4">Status</th>
                            <th className="p-4 text-center">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {loading ? (
                            <tr>
                                <td colSpan="6" className="p-4 text-center">
                                    Loading...
                                </td>
                            </tr>
                        ) : filteredArticles.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="p-4 text-center">
                                    Belum ada artikel
                                </td>
                            </tr>
                        ) : (
                            filteredArticles.map((item) => (
                                <tr key={item._id} className="hover:bg-gray-50">
                                    <td className="p-4 font-medium text-gray-800">
                                        <div className="flex items-center gap-3">
                                            {item.image ? (
                                                <img
                                                    src={item.image}
                                                    alt={item.title}
                                                    className="w-12 h-12 object-cover rounded-md"
                                                />
                                            ) : (
                                                <div className="w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center text-gray-400">
                                                    <FaImage />
                                                </div>
                                            )}
                                            <span className="line-clamp-2 max-w-xs">
                                                {item.title}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="p-4 text-gray-600">
                                        <span className="bg-gray-100 px-2 py-1 rounded text-xs font-medium">
                                            {item.category}
                                        </span>
                                    </td>
                                    <td className="p-4 text-gray-600">{item.author}</td>
                                    <td className="p-4 text-gray-600 text-sm">
                                        {new Date(item.createdAt).toLocaleDateString("id-ID", {
                                            day: "numeric",
                                            month: "short",
                                            year: "numeric",
                                        })}
                                    </td>
                                    <td className="p-4">
                                        <span
                                            className={`px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1 w-fit ${item.isPublished
                                                    ? "bg-green-100 text-green-800"
                                                    : "bg-yellow-100 text-yellow-800"
                                                }`}
                                        >
                                            {item.isPublished ? (
                                                <>
                                                    <FaEye size={10} /> Published
                                                </>
                                            ) : (
                                                <>
                                                    <FaEyeSlash size={10} /> Draft
                                                </>
                                            )}
                                        </span>
                                    </td>
                                    <td className="p-4 flex justify-center gap-2">
                                        <button
                                            onClick={() => navigate(`/admin/articles/edit/${item._id}`)}
                                            className="text-blue-600 hover:text-blue-800 p-2"
                                            title="Edit"
                                        >
                                            <FaEdit />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(item._id)}
                                            className="text-red-600 hover:text-red-800 p-2"
                                            title="Hapus"
                                        >
                                            <FaTrash />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageArticles;
