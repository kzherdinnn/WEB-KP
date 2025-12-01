import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { sparepartsAPI } from '../../utils/api';
import { formatCurrency } from '../../utils/payment';

const FeaturedSpareparts = () => {
    const [spareparts, setSpareparts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadFeatured = async () => {
            try {
                // Get spareparts (limit to 4 for display)
                const response = await sparepartsAPI.getAll({ limit: 4 });
                // If API supports pagination/limit, good. If not, slice client side.
                const data = response.data || [];
                setSpareparts(data.slice(0, 4));
            } catch (error) {
                console.error('Error loading featured spareparts:', error);
            } finally {
                setLoading(false);
            }
        };

        loadFeatured();
    }, []);

    if (loading) {
        return (
            <div className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
                        <p className="mt-2 text-gray-500">Memuat produk unggulan...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (spareparts.length === 0) return null;

    return (
        <section className="py-16 bg-white" id="services">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 outfit">
                        Produk <span className="text-teal-600">Unggulan</span>
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Pilihan sparepart audio mobil terbaik untuk meningkatkan kualitas suara kendaraan Anda.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {spareparts.map((item) => (
                        <div
                            key={item._id}
                            className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 group"
                        >
                            {/* Image Area */}
                            <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center relative overflow-hidden">
                                <span className="text-6xl transform group-hover:scale-110 transition-transform duration-300">
                                    {item.category === 'speaker' && '🔊'}
                                    {item.category === 'amplifier' && '📻'}
                                    {item.category === 'subwoofer' && '🎵'}
                                    {item.category === 'headunit' && '📱'}
                                    {item.category === 'kabel' && '🔌'}
                                    {item.category === 'accessory' && '🛠️'}
                                </span>

                                {/* Badge */}
                                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-teal-600 shadow-sm">
                                    {item.category.toUpperCase()}
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6">
                                <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-teal-600 transition-colors">
                                    {item.name}
                                </h3>
                                <p className="text-gray-500 text-sm mb-4">
                                    {item.brand}
                                </p>

                                <div className="flex items-center justify-between mt-4">
                                    <span className="text-lg font-bold text-teal-600">
                                        {formatCurrency(item.price)}
                                    </span>
                                </div>

                                <Link
                                    to={`/spareparts/${item._id}`}
                                    className="mt-4 block w-full py-2.5 px-4 bg-gray-900 text-white text-center rounded-xl font-medium hover:bg-teal-600 transition-colors duration-300"
                                >
                                    Lihat Detail
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-12 text-center">
                    <Link
                        to="/spareparts"
                        className="inline-flex items-center gap-2 px-8 py-3 bg-white border-2 border-teal-600 text-teal-600 rounded-full font-bold hover:bg-teal-600 hover:text-white transition-all duration-300 shadow-lg hover:shadow-teal-500/30"
                    >
                        Lihat Semua Produk
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default FeaturedSpareparts;
