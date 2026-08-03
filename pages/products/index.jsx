import ThiyaLayout from '@/components/ThiyaLayout';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

const formatImageUrl = (url) => {
    if (!url) return 'https://via.placeholder.com/400x500?text=Premium+Collection';
    if (url.startsWith('http') && url.includes('localhost:3000')) {
        return url.replace('http://localhost:3000', API_URL);
    }
    if (url.startsWith('/uploads')) {
        return `${API_URL}${url}`;
    }
    return url;
};

export default function Products() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Navigation States
    const [activeMenu, setActiveMenu] = useState('women'); // 'women', 'men', 'kids'
    const [activeCategory, setActiveCategory] = useState(null); // category object or null

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [prodRes, catRes] = await Promise.all([
                    axios.get(`${API_URL}/api/thiya/products?activeOnly=true`),
                    axios.get(`${API_URL}/api/thiya/categories/active`)
                ]);
                
                if (prodRes.data.is_success) {
                    setProducts(prodRes.data.data);
                }
                if (catRes.data.is_success) {
                    setCategories(catRes.data.data);
                }
            } catch (error) {
                console.error("Error fetching shop data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Filter categories that belong to the active menu
    const filteredCategories = categories.filter(
        (cat) => (cat.menu || 'women').toLowerCase() === activeMenu.toLowerCase()
    );

    // Filter products that belong to the selected category
    const filteredProducts = activeCategory
        ? products.filter((p) => p.category_id === activeCategory.id)
        : [];

    // Helper to get image for a category
    const getCategoryImage = (category) => {
        // 1. Try to find the first product in this category
        const firstProd = products.find((p) => p.category_id === category.id);
        if (firstProd && firstProd.images && firstProd.images.length > 0) {
            return formatImageUrl(firstProd.images[0].url);
        }
        
        // 2. Return high-quality Unsplash fallbacks based on menu/category
        const fallbacks = {
            women: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
            men: 'https://images.unsplash.com/photo-1490367532201-b9bc1dc483f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
            kids: 'https://images.unsplash.com/photo-1519457431-44ccd64a579b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
            general: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
        };
        
        return fallbacks[activeMenu] || fallbacks.general;
    };

    return (
        <ThiyaLayout title="Shop Collection" description="Explore our exclusive collection of premium sarees, cottons, silks, and trending designs direct from our in-house manufacturing units.">
            <div className="bg-neutral-50 min-h-screen pb-20">
                
                {/* Hero Banner / Subheader */}
                <div className="bg-black text-white py-12 px-6 text-center select-none shadow-inner bg-gradient-to-r from-neutral-900 via-black to-neutral-900 border-b border-neutral-800">
                    <h1 className="text-4xl sm:text-5xl font-black tracking-tight uppercase">Shop the Collection</h1>
                    <p className="text-neutral-400 mt-2 text-sm max-w-xl mx-auto font-medium">Discover premium materials, master manufacturing, and curated fashion lines built for you.</p>
                </div>

                {/* Main Shop Navigation Tabs */}
                <div className="bg-white border-b border-neutral-200 sticky top-20 z-40 shadow-sm">
                    <div className="max-w-7xl mx-auto px-4">
                        <div className="flex justify-center space-x-12 sm:space-x-20">
                            {['women', 'men', 'kids'].map((menu) => (
                                <button
                                    key={menu}
                                    onClick={() => {
                                        setActiveMenu(menu);
                                        setActiveCategory(null); // Reset category selection on menu change
                                    }}
                                    className={`py-5 text-sm font-black uppercase tracking-widest border-b-2 transition-all relative ${
                                        activeMenu === menu
                                            ? 'border-black text-black'
                                            : 'border-transparent text-neutral-400 hover:text-neutral-700'
                                    }`}
                                >
                                    {menu}
                                    {activeMenu === menu && (
                                        <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-black animate-pulse"></span>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
                    
                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="w-10 h-10 border-t-2 border-black border-solid rounded-full animate-spin"></div>
                        </div>
                    ) : !activeCategory ? (
                        
                        /* VIEW 1: CATEGORIES GRID */
                        <div>
                            <div className="flex justify-between items-center mb-8 pb-3 border-b border-neutral-200">
                                <h2 className="text-xl sm:text-2xl font-black text-neutral-900 uppercase tracking-tight">
                                    Browse by Category ({activeMenu})
                                </h2>
                                <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">
                                    {filteredCategories.length} Categories
                                </span>
                            </div>

                            {filteredCategories.length === 0 ? (
                                <div className="text-center py-20 bg-white rounded-xl border border-neutral-200">
                                    <svg className="mx-auto h-12 w-12 text-neutral-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                    </svg>
                                    <p className="text-neutral-500 font-bold uppercase tracking-wider text-sm">No categories available in this menu yet.</p>
                                    <p className="text-neutral-400 text-xs mt-1">Please add them from the admin panel.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                                    {filteredCategories.map((category) => (
                                        <div
                                            key={category.id}
                                            onClick={() => setActiveCategory(category)}
                                            className="group relative cursor-pointer overflow-hidden rounded-xl bg-neutral-200 aspect-[3/4] shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
                                        >
                                            {/* Category Cover Image */}
                                            <img
                                                src={getCategoryImage(category)}
                                                alt={category.name}
                                                className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                                            />
                                            
                                            {/* Translucent Dark Overlay with Glassmorphism */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/5 flex flex-col justify-end p-6">
                                                <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight drop-shadow-md">
                                                    {category.name}
                                                </h3>
                                                <span className="text-[10px] font-bold tracking-widest text-neutral-300 uppercase mt-1.5 flex items-center gap-1">
                                                    Explore Collection 
                                                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ) : (
                        
                        /* VIEW 2: PRODUCTS IN CATEGORY */
                        <div>
                            {/* Header and Back navigation */}
                            <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200">
                                <div>
                                    <button
                                        onClick={() => setActiveCategory(null)}
                                        className="inline-flex items-center text-xs font-bold text-neutral-500 hover:text-black uppercase tracking-wider transition-colors mb-2 gap-1.5"
                                    >
                                        ← Back to Categories
                                    </button>
                                    <h2 className="text-2xl sm:text-3xl font-black text-neutral-900 uppercase tracking-tight">
                                        {activeCategory.name}
                                    </h2>
                                </div>
                                <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest bg-neutral-100 py-1.5 px-3 rounded-full border border-neutral-200">
                                    {activeMenu} / {activeCategory.name} ({filteredProducts.length} items)
                                </span>
                            </div>

                            {filteredProducts.length === 0 ? (
                                <div className="text-center py-20 bg-white rounded-xl border border-neutral-200">
                                    <svg className="mx-auto h-12 w-12 text-neutral-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                                    </svg>
                                    <p className="text-neutral-500 font-bold uppercase tracking-wider text-sm">No products in this category yet.</p>
                                    <p className="text-neutral-400 text-xs mt-1">Please publish products in this category from the admin panel.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                                    {filteredProducts.map((product) => {
                                        const originalPrice = parseFloat(product.price);
                                        const discount = parseFloat(product.discount_amount || 0);
                                        const finalPrice = originalPrice - discount;
                                        
                                        return (
                                            <Link
                                                key={product.id}
                                                href={`/products/${product.id}`}
                                                className="group flex flex-col bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl border border-neutral-200 transition-all duration-300 hover:scale-[1.01]"
                                            >
                                                {/* Product Image */}
                                                <div className="aspect-[3/4] w-full overflow-hidden bg-neutral-100 relative">
                                                    <img
                                                        src={product.images && product.images.length > 0 ? formatImageUrl(product.images[0]?.url) : 'https://via.placeholder.com/400x500?text=Premium+Collection'}
                                                        alt={product.title}
                                                        className="h-full w-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                                                    />
                                                    {discount > 0 && (
                                                        <span className="absolute top-3 right-3 bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded tracking-wider uppercase">
                                                            Sale
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Product Body */}
                                                <div className="p-5 flex flex-col flex-grow">
                                                    <div className="flex justify-between items-start gap-2 mb-1">
                                                        <span className="text-[10px] font-bold text-neutral-400 tracking-widest uppercase">
                                                            {activeCategory.name}
                                                        </span>
                                                        {product.size && (
                                                            <span className="text-[10px] font-bold text-neutral-600 bg-neutral-100 px-1.5 py-0.5 rounded border border-neutral-200">
                                                                {product.size.split(',')[0]}
                                                            </span>
                                                        )}
                                                    </div>
                                                    
                                                    <h3 className="text-base font-bold text-neutral-900 truncate mb-3">
                                                        {product.title}
                                                    </h3>

                                                    {/* Price and Action */}
                                                    <div className="mt-auto pt-3 border-t border-neutral-100 flex items-center justify-between">
                                                        <div>
                                                            <p className="text-lg font-black text-neutral-900">
                                                                ₹{finalPrice.toFixed(2)}
                                                            </p>
                                                            {discount > 0 && (
                                                                <p className="text-xs text-neutral-400 line-through">
                                                                    ₹{originalPrice.toFixed(2)}
                                                                </p>
                                                            )}
                                                        </div>
                                                        <span className="bg-black text-white hover:bg-neutral-800 text-xs font-bold py-2 px-4 rounded transition-colors uppercase tracking-wider">
                                                            View
                                                        </span>
                                                    </div>
                                                </div>
                                            </Link>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </ThiyaLayout>
    );
}
