import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { sparepartsAPI, servicesAPI } from '../utils/api';
import { formatCurrency } from '../utils/payment';
import { FiTrash2, FiMinus, FiPlus, FiArrowRight, FiShoppingBag, FiTool, FiPackage, FiArrowLeft } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function Cart() {
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState({ spareparts: [], services: [] });
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadCart();
        loadRecommendations();
    }, []);

    const loadCart = () => {
        const bookingData = JSON.parse(localStorage.getItem('bookingData') || '{}');
        setCartItems({
            spareparts: bookingData.spareparts || [],
            services: bookingData.services || []
        });
    };

    const loadRecommendations = async () => {
        try {
            setLoading(true);
            // Fetch both to mix, or decide based on cart content
            const [sparepartsRes, servicesRes] = await Promise.all([
                sparepartsAPI.getAll({ limit: 4 }),
                servicesAPI.getAll({ limit: 4 })
            ]);

            const allRecommendations = [
                ...(sparepartsRes.data || []).map(item => ({ ...item, type: 'sparepart' })),
                ...(servicesRes.data || []).map(item => ({ ...item, type: 'service' }))
            ];

            // Shuffle and pick 4
            const shuffled = allRecommendations.sort(() => 0.5 - Math.random()).slice(0, 4);
            setRecommendations(shuffled);
        } catch (error) {
            console.error('Error loading recommendations:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateQuantity = (index, change) => {
        const newSpareparts = [...cartItems.spareparts];
        const item = newSpareparts[index];
        const newQuantity = item.quantity + change;

        if (newQuantity < 1) return;

        item.quantity = newQuantity;
        setCartItems(prev => ({ ...prev, spareparts: newSpareparts }));
        saveCart({ ...cartItems, spareparts: newSpareparts });
    };

    const removeItem = (type, index) => {
        const newItems = { ...cartItems };
        if (type === 'sparepart') {
            newItems.spareparts.splice(index, 1);
        } else {
            newItems.services.splice(index, 1);
        }
        setCartItems(newItems);
        saveCart(newItems);
        toast.success('Item dihapus');
    };

    const saveCart = (items) => {
        const bookingData = JSON.parse(localStorage.getItem('bookingData') || '{}');
        bookingData.spareparts = items.spareparts;
        bookingData.services = items.services;
        localStorage.setItem('bookingData', JSON.stringify(bookingData));
    };

    const addToCart = (item) => {
        const newItems = { ...cartItems };

        // Calculate discounted price if applicable
        const finalPrice = item.discount > 0
            ? item.price * (1 - item.discount / 100)
            : item.price;

        if (item.type === 'sparepart') {
            const existingIndex = newItems.spareparts.findIndex(s => s.sparepartId === item._id);
            if (existingIndex >= 0) {
                newItems.spareparts[existingIndex].quantity += 1;
                newItems.spareparts[existingIndex].price = finalPrice;
            } else {
                newItems.spareparts.push({
                    sparepartId: item._id,
                    name: item.name,
                    price: finalPrice,
                    quantity: 1,
                    image: item.images?.[0]
                });
            }
        } else {
            const existingIndex = newItems.services.findIndex(s => s.serviceId === item._id);
            if (existingIndex >= 0) {
                toast.error('Layanan sudah ada di keranjang');
                return;
            }
            newItems.services.push({
                serviceId: item._id,
                name: item.name,
                price: finalPrice,
                image: item.images?.[0]
            });
        }

        setCartItems(newItems);
        saveCart(newItems);
        toast.success('Item ditambahkan');
    };

    const calculateTotal = () => {
        const sparepartsTotal = cartItems.spareparts.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const servicesTotal = cartItems.services.reduce((sum, item) => sum + item.price, 0);
        return sparepartsTotal + servicesTotal;
    };

    const isEmpty = cartItems.spareparts.length === 0 && cartItems.services.length === 0;

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-12 font-outfit">
            <div className="container mx-auto px-4 max-w-6xl">
                <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <FiShoppingBag className="text-teal-600" /> Keranjang Pesanan
                </h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items List */}
                    <div className="lg:col-span-2 space-y-6">
                        {isEmpty ? (
                            <div className="bg-white rounded-xl p-10 text-center border border-gray-200 shadow-sm">
                                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <FiShoppingBag className="w-10 h-10 text-gray-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Keranjang Masih Kosong</h3>
                                <p className="text-gray-500 mb-6">Yuk cari sparepart atau layanan yang kamu butuhkan!</p>
                                <Link to="/spareparts" className="inline-flex items-center justify-center px-6 py-2.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium">
                                    Mulai Belanja
                                </Link>
                            </div>
                        ) : (
                            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                                <div className="p-6 space-y-6">
                                    {/* Spareparts */}
                                    {cartItems.spareparts.map((item, idx) => (
                                        <div key={`sp-${idx}`} className="flex gap-4 py-4 border-b border-gray-100 last:border-0">
                                            <div className="w-20 h-20 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
                                                {item.image ? (
                                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                        <FiPackage className="w-8 h-8" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex justify-between items-start mb-2">
                                                    <h3 className="font-semibold text-gray-900 line-clamp-2">{item.name}</h3>
                                                    <button onClick={() => removeItem('sparepart', idx)} className="text-gray-400 hover:text-red-500 transition-colors">
                                                        <FiTrash2 />
                                                    </button>
                                                </div>
                                                <p className="text-teal-600 font-bold mb-3">{formatCurrency(item.price)}</p>
                                                <div className="flex items-center gap-3">
                                                    <button
                                                        onClick={() => updateQuantity(idx, -1)}
                                                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 text-gray-600"
                                                    >
                                                        <FiMinus className="w-3 h-3" />
                                                    </button>
                                                    <span className="font-medium text-gray-900 w-8 text-center">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(idx, 1)}
                                                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 text-gray-600"
                                                    >
                                                        <FiPlus className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    {/* Services */}
                                    {cartItems.services.map((item, idx) => (
                                        <div key={`sv-${idx}`} className="flex gap-4 py-4 border-b border-gray-100 last:border-0">
                                            <div className="w-20 h-20 bg-purple-50 rounded-lg flex-shrink-0 flex items-center justify-center text-purple-500">
                                                <FiTool className="w-8 h-8" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex justify-between items-start mb-2">
                                                    <h3 className="font-semibold text-gray-900 line-clamp-2">{item.name}</h3>
                                                    <button onClick={() => removeItem('service', idx)} className="text-gray-400 hover:text-red-500 transition-colors">
                                                        <FiTrash2 />
                                                    </button>
                                                </div>
                                                <p className="text-teal-600 font-bold mb-3">{formatCurrency(item.price)}</p>
                                                <span className="inline-block px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded">Layanan</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Recommendations Section */}
                        <div className="mt-8">
                            <h2 className="text-lg font-bold text-gray-900 mb-4">Rekomendasi Untuk Anda</h2>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                {recommendations.map((item) => {
                                    // Check if already in cart
                                    const inCart = item.type === 'sparepart'
                                        ? cartItems.spareparts.find(s => s.sparepartId === item._id)
                                        : cartItems.services.find(s => s.serviceId === item._id);

                                    if (inCart) return null;

                                    return (
                                        <div key={item._id} className="bg-white rounded-xl border border-gray-200 p-3 hover:shadow-md transition-all flex flex-col">
                                            <div className="h-32 bg-gray-100 rounded-lg mb-3 overflow-hidden flex items-center justify-center relative">
                                                {item.images && item.images.length > 0 ? (
                                                    <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    item.type === 'sparepart' ? <FiPackage className="text-gray-400 w-8 h-8" /> : <FiTool className="text-gray-400 w-8 h-8" />
                                                )}
                                                <span className={`absolute top-2 left-2 px-2 py-0.5 text-[10px] font-bold rounded-full uppercase ${item.type === 'sparepart' ? 'bg-teal-100 text-teal-700' : 'bg-purple-100 text-purple-700'}`}>
                                                    {item.type === 'sparepart' ? 'Barang' : 'Jasa'}
                                                </span>
                                            </div>
                                            <h4 className="font-medium text-gray-900 text-sm line-clamp-2 mb-1 flex-grow">
                                                {item.name}
                                            </h4>
                                            <p className="text-teal-600 font-bold text-sm mb-3">
                                                {formatCurrency(item.price)}
                                            </p>
                                            <button
                                                onClick={() => addToCart(item)}
                                                className="w-full py-2 bg-gray-900 text-white text-xs font-medium rounded-lg hover:bg-teal-600 transition-colors"
                                            >
                                                + Tambah
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Summary Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 sticky top-24">
                            <h3 className="font-bold text-gray-900 mb-4 text-lg">Ringkasan Belanja</h3>

                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-gray-600">
                                    <span>Total Item</span>
                                    <span>{cartItems.spareparts.reduce((sum, i) => sum + i.quantity, 0) + cartItems.services.length} barang</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Total Harga</span>
                                    <span className="font-bold text-gray-900">{formatCurrency(calculateTotal())}</span>
                                </div>
                            </div>

                            <div className="border-t border-gray-100 pt-4 mb-6">
                                <div className="flex justify-between items-center">
                                    <span className="font-bold text-gray-900 text-lg">Total Tagihan</span>
                                    <span className="font-bold text-teal-600 text-xl">{formatCurrency(calculateTotal())}</span>
                                </div>
                            </div>

                            <button
                                onClick={() => navigate('/booking')}
                                disabled={isEmpty}
                                className="w-full py-3.5 bg-teal-600 text-white rounded-xl font-bold shadow-lg hover:bg-teal-700 hover:shadow-teal-500/30 transition-all disabled:bg-gray-300 disabled:shadow-none disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                Checkout Booking <FiArrowRight />
                            </button>

                            <Link to="/spareparts" className="block text-center mt-4 text-sm text-gray-500 hover:text-teal-600 font-medium">
                                Lanjut Belanja
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
