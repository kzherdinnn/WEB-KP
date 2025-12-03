import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useUser } from '@clerk/clerk-react';
import { sparepartsAPI } from '../../utils/api';
import { formatCurrency } from '../../utils/payment';
import { FaSpeakerDeck, FaCompactDisc, FaMusic, FaMicrochip, FaTools, FaBolt } from 'react-icons/fa';

const FeaturedSpareparts = () => {
    const { isSignedIn, isLoaded } = useUser();
    const [spareparts, setSpareparts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Only load if user is signed in
        if (isLoaded && isSignedIn) {
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
        } else if (isLoaded && !isSignedIn) {
            // If not signed in, don't show loading, just hide component
            setLoading(false);
        }
    }, [isLoaded, isSignedIn]);

    // Don't render anything if not logged in
    if (!isLoaded || !isSignedIn) return null;

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

    const getCategoryIcon = (category) => {
        const iconClass = "w-16 h-16";
        switch (category) {
            case 'speaker': return <FaSpeakerDeck className={iconClass} />;
            case 'amplifier': return <FaMusic className={iconClass} />;
            case 'subwoofer': return <FaCompactDisc className={iconClass} />;
            case 'headunit': return <FaMicrochip className={iconClass} />;
            case 'kabel': return <FaBolt className={iconClass} />;
            default: return <FaTools className={iconClass} />;
        }
    };

    return (
        <section className="py-8 bg-white" id="services">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="text-center mb-8"
                >
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2 outfit">
                        Produk Unggulan
                    </h2>
                    <div className="w-24 h-1 bg-gradient-to-r from-teal-500 to-emerald-600 mx-auto mb-4"></div>
                    <p className="text-lg text-gray-600 max-w-3xl mx-auto outfit">
                        Pilihan sparepart audio mobil terbaik untuk meningkatkan kualitas suara kendaraan Anda.
                    </p>
                </motion.div>

                <div className="flex flex-wrap justify-center gap-6">
                    {spareparts.map((item) => (
                        <div
                            key={item._id}
                            className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 group w-full md:w-[calc(50%-1rem)] lg:w-[calc(25%-1.5rem)] max-w-sm"
                        >
                            {/* Image Area */}
                            <div className="h-64 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center relative overflow-hidden">
                                {item.images && item.images.length > 0 ? (
                                    <img
                                        src={item.images[0]}
                                        alt={item.name}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                ) : (
                                    <div className="text-gray-300 group-hover:text-teal-500 transition-colors transform group-hover:scale-110 duration-300">
                                        {getCategoryIcon(item.category)}
                                    </div>
                                )}

                                {/* Badge */}
                                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-bold text-teal-600 shadow-sm uppercase tracking-wider">
                                    {item.category}
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-5">
                                <p className="text-xs font-bold text-teal-500 uppercase tracking-wider mb-1">
                                    {item.brand}
                                </p>
                                <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-teal-600 transition-colors leading-tight">
                                    {item.name}
                                </h3>

                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-2xl font-bold text-teal-600">
                                        {formatCurrency(item.price)}
                                    </span>
                                </div>

                                <Link
                                    to={`/spareparts/${item._id}`}
                                    className="mt-3 block w-full py-2.5 px-4 bg-gray-900 text-white text-center rounded-xl font-bold hover:bg-gradient-to-r hover:from-teal-600 hover:to-emerald-600 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                                >
                                    Lihat Detail
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-8 text-center">
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
