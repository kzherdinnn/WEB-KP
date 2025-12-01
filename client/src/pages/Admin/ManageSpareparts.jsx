import { useState, useEffect } from "react";
import { useAppContext } from "../../context/AppContext";
import {
    FaPlus,
    FaEdit,
    FaTrash,
    FaSearch,
    FaBox,
    FaExclamationTriangle,
    FaMoneyBillWave,
    FaTags,
    FaBoxOpen,
    FaChartLine,
    FaWarehouse,
    FaImage
} from "react-icons/fa";
import toast from "react-hot-toast";

const ManageSpareparts = () => {
    const { axios } = useAppContext();
    const [spareparts, setSpareparts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        brand: "",
        category: "accessory",
        price: 0,
        discount: 0,
        stock: 0,
        description: "",
        images: [], // Array of strings (URLs)
        isAvailable: true,
    });
    const [selectedFiles, setSelectedFiles] = useState([]);

    const [searchQuery, setSearchQuery] = useState("");

    const fetchSpareparts = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get("/api/spareparts");
            if (data.success) {
                setSpareparts(data.data);
            }
        } catch (error) {
            toast.error("Gagal memuat data sparepart");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSpareparts();
    }, []);

    const handleFileChange = (e) => {
        if (e.target.files) {
            setSelectedFiles(Array.from(e.target.files));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = new FormData();
            data.append("name", formData.name);
            data.append("brand", formData.brand);
            data.append("category", formData.category);
            data.append("price", formData.price);
            data.append("discount", formData.discount);
            data.append("stock", formData.stock);
            data.append("description", formData.description);
            data.append("isAvailable", formData.isAvailable);

            // Append existing images (URLs)
            if (formData.images && formData.images.length > 0) {
                formData.images.forEach((url) => {
                    data.append("images", url);
                });
            }

            // Append new files
            selectedFiles.forEach((file) => {
                data.append("images", file);
            });

            if (editingId) {
                await axios.put(`/api/spareparts/${editingId}`, data);
                toast.success("Sparepart berhasil diperbarui");
            } else {
                await axios.post("/api/spareparts", data);
                toast.success("Sparepart berhasil ditambahkan");
            }
            setIsModalOpen(false);
            resetForm();
            fetchSpareparts();
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Gagal menyimpan data");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Yakin ingin menghapus sparepart ini?")) return;
        try {
            await axios.delete(`/api/spareparts/${id}`);
            toast.success("Sparepart berhasil dihapus");
            fetchSpareparts();
        } catch (error) {
            toast.error("Gagal menghapus sparepart");
        }
    };

    const resetForm = () => {
        setFormData({
            name: "",
            brand: "",
            category: "accessory",
            price: 0,
            discount: 0,
            stock: 0,
            description: "",
            images: [],
            isAvailable: true,
        });
        setSelectedFiles([]);
        setEditingId(null);
    };

    const handleEdit = (item) => {
        setFormData({
            name: item.name,
            brand: item.brand,
            category: item.category,
            price: item.price,
            discount: item.discount || 0,
            stock: item.stock,
            description: item.description,
            images: item.images || [],
            isAvailable: item.isAvailable,
        });
        setSelectedFiles([]);
        setEditingId(item._id);
        setIsModalOpen(true);
    };

    // Calculate stats
    const stats = {
        totalItems: spareparts.length,
        lowStock: spareparts.filter(i => i.stock < 5 && i.stock > 0).length,
        outOfStock: spareparts.filter(i => i.stock === 0).length,
        totalValue: spareparts.reduce((acc, curr) => acc + (curr.price * curr.stock), 0),
        categories: new Set(spareparts.map(i => i.category)).size,
        totalPhysicalStock: spareparts.reduce((acc, curr) => acc + curr.stock, 0),
        avgPrice: spareparts.length ? spareparts.reduce((acc, curr) => acc + curr.price, 0) / spareparts.length : 0
    };

    const filteredSpareparts = spareparts.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="px-4 sm:px-6 lg:px-8 py-8 bg-gray-50 min-h-screen">
            <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 font-playfair">Manajemen Sparepart</h1>
                    <p className="text-gray-600 mt-2">Kelola inventaris dan stok barang</p>
                </div>
                <div className="flex gap-3 w-full sm:w-auto">
                    <div className="relative flex-grow sm:flex-grow-0">
                        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Cari sparepart..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 w-full sm:w-64"
                        />
                    </div>
                    <button
                        onClick={() => { resetForm(); setIsModalOpen(true); }}
                        className="bg-teal-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-teal-700 transition shadow-sm whitespace-nowrap"
                    >
                        <FaPlus /> Tambah
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-gray-600 uppercase">Total Item</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalItems}</p>
                        </div>
                        <div className="bg-blue-100 p-3 rounded-lg text-blue-600"><FaBox className="text-2xl" /></div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-gray-600 uppercase">Total Stok Fisik</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalPhysicalStock}</p>
                        </div>
                        <div className="bg-indigo-100 p-3 rounded-lg text-indigo-600"><FaWarehouse className="text-2xl" /></div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-gray-600 uppercase">Total Nilai Aset</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">Rp {stats.totalValue.toLocaleString()}</p>
                        </div>
                        <div className="bg-green-100 p-3 rounded-lg text-green-600"><FaMoneyBillWave className="text-2xl" /></div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-gray-600 uppercase">Rata-rata Harga</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">Rp {Math.round(stats.avgPrice).toLocaleString()}</p>
                        </div>
                        <div className="bg-teal-100 p-3 rounded-lg text-teal-600"><FaChartLine className="text-2xl" /></div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-gray-600 uppercase">Stok Menipis</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">{stats.lowStock}</p>
                        </div>
                        <div className="bg-yellow-100 p-3 rounded-lg text-yellow-600"><FaExclamationTriangle className="text-2xl" /></div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-gray-600 uppercase">Stok Habis</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">{stats.outOfStock}</p>
                        </div>
                        <div className="bg-red-100 p-3 rounded-lg text-red-600"><FaBoxOpen className="text-2xl" /></div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-gray-600 uppercase">Kategori</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">{stats.categories}</p>
                        </div>
                        <div className="bg-purple-100 p-3 rounded-lg text-purple-600"><FaTags className="text-2xl" /></div>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 text-gray-600 uppercase text-xs font-semibold">
                        <tr>
                            <th className="p-4">Nama</th>
                            <th className="p-4">Kategori</th>
                            <th className="p-4">Harga</th>
                            <th className="p-4">Diskon</th>
                            <th className="p-4">Stok</th>
                            <th className="p-4">Status</th>
                            <th className="p-4 text-center">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {loading ? (
                            <tr><td colSpan="7" className="p-4 text-center">Loading...</td></tr>
                        ) : filteredSpareparts.length === 0 ? (
                            <tr><td colSpan="7" className="p-4 text-center">Belum ada data</td></tr>
                        ) : (
                            filteredSpareparts.map((item) => (
                                <tr key={item._id} className="hover:bg-gray-50">
                                    <td className="p-4 font-medium text-gray-800">
                                        <div className="flex items-center gap-3">
                                            {item.images && item.images.length > 0 ? (
                                                <img src={item.images[0]} alt={item.name} className="w-10 h-10 object-cover rounded-md" />
                                            ) : (
                                                <div className="w-10 h-10 bg-gray-200 rounded-md flex items-center justify-center text-gray-400">
                                                    <FaImage />
                                                </div>
                                            )}
                                            {item.name}
                                        </div>
                                    </td>
                                    <td className="p-4 text-gray-600">{item.category}</td>
                                    <td className="p-4">
                                        <div className="flex flex-col">
                                            <span className={item.discount > 0 ? "line-through text-gray-400 text-xs" : "text-gray-800"}>
                                                Rp {item.price.toLocaleString()}
                                            </span>
                                            {item.discount > 0 && (
                                                <span className="text-teal-600 font-bold">
                                                    Rp {(item.price * (1 - item.discount / 100)).toLocaleString()}
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        {item.discount > 0 ? (
                                            <span className="bg-red-100 text-red-600 px-2 py-1 rounded-full text-xs font-bold">
                                                {item.discount}%
                                            </span>
                                        ) : "-"}
                                    </td>
                                    <td className="p-4 text-gray-600">{item.stock}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${item.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {item.isAvailable ? 'Tersedia' : 'Tidak Tersedia'}
                                        </span>
                                    </td>
                                    <td className="p-4 flex justify-center gap-2">
                                        <button onClick={() => handleEdit(item)} className="text-blue-600 hover:text-blue-800 p-2"><FaEdit /></button>
                                        <button onClick={() => handleDelete(item._id)} className="text-red-600 hover:text-red-800 p-2"><FaTrash /></button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
                        <h2 className="text-xl font-bold mb-4">{editingId ? "Edit Sparepart" : "Tambah Sparepart"}</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Nama</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-teal-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.brand}
                                        onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                                        className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-teal-500"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-teal-500"
                                    >
                                        <option value="accessory">Accessory</option>
                                        <option value="speaker">Speaker</option>
                                        <option value="amplifier">Amplifier</option>
                                        <option value="subwoofer">Subwoofer</option>
                                        <option value="headunit">Headunit</option>
                                        <option value="kabel">Kabel</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Stok</label>
                                    <input
                                        type="number"
                                        required
                                        min="0"
                                        value={formData.stock}
                                        onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) })}
                                        className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-teal-500"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Harga (Rp)</label>
                                    <input
                                        type="number"
                                        required
                                        min="0"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) })}
                                        className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-teal-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Diskon (%)</label>
                                    <input
                                        type="number"
                                        min="0"
                                        max="100"
                                        value={formData.discount}
                                        onChange={(e) => setFormData({ ...formData, discount: parseInt(e.target.value) })}
                                        className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-teal-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Status Ketersediaan</label>
                                <select
                                    value={formData.isAvailable}
                                    onChange={(e) => setFormData({ ...formData, isAvailable: e.target.value === 'true' })}
                                    className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-teal-500"
                                >
                                    <option value="true">Tersedia</option>
                                    <option value="false">Tidak Tersedia</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
                                <textarea
                                    rows="3"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-teal-500"
                                ></textarea>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Gambar</label>
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-teal-500"
                                />
                                <p className="text-xs text-gray-500 mt-1">Pilih satu atau lebih gambar. Gambar baru akan ditambahkan ke gambar yang sudah ada.</p>

                                {/* Preview Existing Images */}
                                {formData.images && formData.images.length > 0 && (
                                    <div className="mt-2">
                                        <p className="text-xs font-medium text-gray-700 mb-1">Gambar Saat Ini:</p>
                                        <div className="flex gap-2 flex-wrap">
                                            {formData.images.map((url, index) => (
                                                <div key={index} className="relative group">
                                                    <img src={url} alt={`Preview ${index}`} className="w-20 h-20 object-cover rounded-lg border border-gray-200" />
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            const newImages = formData.images.filter((_, i) => i !== index);
                                                            setFormData({ ...formData, images: newImages });
                                                        }}
                                                        className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        <FaTrash size={10} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition"
                                >
                                    Simpan
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageSpareparts;
