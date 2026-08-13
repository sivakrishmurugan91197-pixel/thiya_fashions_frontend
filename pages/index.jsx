import ThiyaLayout from '@/components/ThiyaLayout';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import axios from 'axios';
import LogoLoader from '@/components/LogoLoader';

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

const ProductSection = ({ title, products }) => {
    if (products.length === 0) return null;
    return (
        <div className="bg-white py-16 border-t border-neutral-100 select-none">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl sm:text-3xl font-black text-neutral-900 uppercase tracking-tight relative">
                        {title}
                        <span className="absolute -bottom-1.5 left-0 w-12 h-1 bg-pink-600 rounded"></span>
                    </h2>
                    <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest bg-neutral-100 py-1 px-2.5 rounded border border-neutral-200">
                        {products.length} Items
                    </span>
                </div>

                <div className="relative">
                    <div className="flex overflow-x-auto gap-8 pb-4 scrollbar-none scroll-smooth">
                        {products.map((product) => {
                            const originalPrice = parseFloat(product.price);
                            const discount = parseFloat(product.discount_amount || 0);
                            const finalPrice = originalPrice - discount;
                            const discountPercent = discount > 0 ? Math.round((discount / originalPrice) * 100) : 0;

                            return (
                                <Link 
                                    key={product.id}
                                    href={`/products/${product.id}`}
                                    className="flex flex-col w-[260px] sm:w-[300px] shrink-0 bg-white rounded-xl overflow-hidden border border-neutral-200 shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-[1.01] group"
                                >
                                    <div className="aspect-[3/4] w-full bg-neutral-150 overflow-hidden relative">
                                        <img 
                                            src={product.images && product.images.length > 0 ? formatImageUrl(product.images[0]?.url) : 'https://via.placeholder.com/400x500?text=Premium+Saree'} 
                                            alt={product.title}
                                            className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                                        />
                                        {discountPercent > 0 && (
                                            <span className="absolute top-3 right-3 bg-red-600 text-white text-[9px] font-black px-2 py-0.5 rounded tracking-wider uppercase">
                                                {discountPercent}% OFF
                                            </span>
                                        )}
                                    </div>
                                    <div className="p-4 flex flex-col flex-grow">
                                        <h3 className="text-sm font-bold text-neutral-900 truncate uppercase tracking-wider mb-2">
                                            {product.title}
                                        </h3>
                                        <div className="mt-auto flex items-baseline gap-2">
                                            <span className="text-base font-black text-neutral-900">₹{finalPrice.toFixed(2)}</span>
                                            {discount > 0 && (
                                                <>
                                                    <span className="text-xs text-neutral-400 line-through">₹{originalPrice.toFixed(2)}</span>
                                                    <span className="text-xs text-green-600 font-bold bg-green-50 px-1.5 py-0.5 rounded leading-none">{discountPercent}% OFF</span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default function Home() {
    const [products, setProducts] = useState([]);
    const [feedbacks, setFeedbacks] = useState([]);
    const [videoBanners, setVideoBanners] = useState([]);
    const [selectedFeedback, setSelectedFeedback] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/thiya/products?activeOnly=true`);
                if (response.data.is_success) {
                    setProducts(response.data.data);
                }
            } catch (err) {
                console.error("Error fetching homepage products:", err);
            } finally {
                setLoading(false);
            }
        };
        const fetchFeedbacks = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/thiya/feedbacks?activeOnly=true`);
                if (response.data.is_success) {
                    setFeedbacks(response.data.data);
                }
            } catch (err) {
                console.error("Error fetching homepage feedbacks:", err);
            }
        };
        const fetchVideoBanners = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/thiya/video-banners?activeOnly=true`);
                if (response.data.is_success) {
                    setVideoBanners(response.data.data);
                }
            } catch (err) {
                console.error("Error fetching homepage video banners:", err);
            }
        };
        fetchProducts();
        fetchFeedbacks();
        fetchVideoBanners();
    }, []);

    const newArrivals = products.filter(p => p.is_new_arrival);
    const bestSellers = products.filter(p => p.is_best_seller);
    const trending = products.filter(p => p.is_trending);

    return (
        <ThiyaLayout title="Home" description="Elevate your style with Thiya Fashions. Sourcing directly from manufacturers to provide the latest premium wholesale collections at unbeatable rates.">
            {/* Hero Section */}
            <div className="relative isolate overflow-hidden bg-gray-900">
                <img
                    src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
                    alt="Premium Fashion Background"
                    className="absolute inset-0 -z-10 h-full w-full object-cover opacity-40 mix-blend-multiply"
                />
                
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56 text-center">
                        <div className="hidden sm:mb-8 sm:flex sm:justify-center">
                            <div className="relative rounded-full px-3 py-1 text-sm leading-6 text-gray-300 ring-1 ring-white/10 hover:ring-white/20 transition-all cursor-pointer bg-white/5 backdrop-blur-sm">
                                Announcing our new Summer Collection. <Link href="/products" className="font-semibold text-white"><span className="absolute inset-0" aria-hidden="true" />View collection <span aria-hidden="true">&rarr;</span></Link>
                            </div>
                        </div>
                        <h1 className="text-5xl font-black tracking-tighter text-white sm:text-7xl drop-shadow-lg">
                            Elevate Your Style with Thiya Fashions
                        </h1>
                        <p className="mt-6 text-lg leading-8 text-gray-300 drop-shadow-md font-medium">
                            Premium Wholesale, Retail & Manufactured Clothing. Discover the perfect blend of elegance, comfort, and state-of-the-art design for every occasion.
                        </p>
                        <div className="mt-10 flex items-center justify-center gap-x-6">
                            <Link
                                href="/products"
                                className="rounded-md bg-white px-8 py-3.5 text-sm font-black text-gray-900 shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white transition-transform hover:scale-105"
                            >
                                Shop the Collection
                            </Link>
                            <Link href="/about" className="text-sm font-bold leading-6 text-white hover:text-gray-300 transition-colors">
                                Learn more about us <span aria-hidden="true">→</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Featured Product Collection Sliders */}
            {loading ? (
                <div className="bg-white py-12">
                    <LogoLoader text="Loading Collections..." />
                </div>
            ) : (
                <>
                    {/* 3D Cinematic Showcase Section (Automatically plays like a video) */}
                    <div className="bg-neutral-950 py-16 sm:py-24 overflow-hidden relative select-none">
                        {/* Cinematic grid overlay and glowing colored ambient spots */}
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(219,39,119,0.08)_0%,rgba(0,0,0,0)_70%)] pointer-events-none"></div>
                        <div className="absolute top-10 left-10 w-72 h-72 bg-pink-700/10 rounded-full filter blur-3xl pointer-events-none"></div>
                        <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-900/10 rounded-full filter blur-3xl pointer-events-none"></div>
                        
                        <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
                            <div className="text-center mb-12">
                                <span className="text-xs font-black text-pink-500 uppercase tracking-widest bg-pink-950/40 px-3 py-1 rounded-full border border-pink-900/30">
                                    Thiya Couture in Motion
                                </span>
                                <h2 className="mt-4 text-3xl font-black tracking-tight text-white sm:text-4xl uppercase">
                                    Cinematic 3D Video Showcase
                                </h2>
                                <p className="mt-3 text-sm text-neutral-400 max-w-xl mx-auto">
                                    Experience the drape, texture, and elegant movement of our latest saree creations in a looping 3D simulation.
                                </p>
                            </div>

                            {/* 3D Screen Container */}
                            <div className="max-w-5xl mx-auto">
                                {(() => {
                                    const activeBanner = videoBanners.length > 0 ? videoBanners[0] : {
                                        title: "Royal Banarasi Silk Saree",
                                        subtitle: "Handcrafted borders woven with authentic gold thread. Experience the ultimate definition of heritage fashion.",
                                        image_url: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
                                    };

                                    return (
                                        <div className="animate-sway-3d relative w-full aspect-[16/9] rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.8)] border border-white/10 group bg-neutral-900">
                                            {/* Automaitcally played video format: Ken Burns panning + zoom + light leaks */}
                                            <div className="absolute inset-0 w-full h-full overflow-hidden">
                                                <img 
                                                    src={formatImageUrl(activeBanner.image_url)} 
                                                    alt={activeBanner.title} 
                                                    className="w-full h-full object-cover animate-ken-burns origin-center"
                                                />
                                            </div>

                                            {/* Cinematic Light Leak overlay sweep */}
                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full animate-light-leak pointer-events-none"></div>

                                            {/* Lens flare / gradient overlay */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/10 pointer-events-none"></div>

                                            {/* Live 3D Video status tag */}
                                            <div className="absolute top-4 left-4 sm:top-6 sm:left-6 flex items-center gap-2.5 bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 shadow-lg">
                                                <span className="w-2.5 h-2.5 bg-red-600 rounded-full animate-live-pulse"></span>
                                                <span className="text-[10px] font-black text-white tracking-widest uppercase">
                                                    AUTO-PLAY • LIVE 3D
                                                </span>
                                            </div>

                                            {/* Bottom info banner */}
                                            <div className="absolute bottom-0 inset-x-0 p-6 sm:p-10 flex flex-col justify-end">
                                                <h3 className="text-xl sm:text-3xl font-black text-white uppercase tracking-tight drop-shadow-md">
                                                    {activeBanner.title}
                                                </h3>
                                                <p className="mt-2 text-xs sm:text-sm text-neutral-300 max-w-2xl drop-shadow leading-relaxed">
                                                    {activeBanner.subtitle}
                                                </p>
                                                
                                                {/* Audio / Video controls simulation */}
                                                <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4 text-white/50 text-[10px] font-bold uppercase tracking-wider">
                                                    <div className="flex items-center gap-3">
                                                        <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/></svg>
                                                        <span>0:00 / 0:12 • LOOPING</span>
                                                    </div>
                                                    <span>1080P HD QUALITY</span>
                                                </div>
                                            </div>

                                            {/* Audio wave dynamic simulation to show it's playing */}
                                            <div className="absolute bottom-20 right-6 sm:right-10 flex items-end gap-0.5 h-6">
                                                <span className="w-0.5 bg-pink-500 rounded-t animate-[wave_1.2s_ease-in-out_infinite] h-4"></span>
                                                <span className="w-0.5 bg-pink-500 rounded-t animate-[wave_0.8s_ease-in-out_infinite_0.2s] h-6"></span>
                                                <span className="w-0.5 bg-pink-500 rounded-t animate-[wave_1.5s_ease-in-out_infinite_0.4s] h-3"></span>
                                                <span className="w-0.5 bg-pink-500 rounded-t animate-[wave_1s_ease-in-out_infinite_0.1s] h-5"></span>
                                            </div>

                                            {/* Video progress loader bar at the bottom */}
                                            <div className="absolute bottom-0 left-0 h-1 bg-pink-600 animate-timeline-crawl"></div>
                                        </div>
                                    );
                                })()}
                            </div>
                        </div>

                        {/* Audio waves keyframes */}
                        <style jsx global>{`
                            @keyframes wave {
                                0%, 100% { height: 4px; }
                                50% { height: 24px; }
                            }
                        `}</style>
                    </div>

                    <ProductSection title="Hot New Arrivals" products={newArrivals} />
                    <ProductSection title="Best Sellers" products={bestSellers} />
                    <ProductSection title="Trending Outfits" products={trending} />
                </>
            )}

            {/* Premium Features Section */}
            <div className="bg-white py-24 sm:py-32 border-t border-neutral-100">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto max-w-2xl lg:text-center">
                        <h2 className="text-base font-bold leading-7 text-pink-600 uppercase tracking-widest">Thiya Fashions Exclusive</h2>
                        <p className="mt-2 text-3xl font-black tracking-tight text-gray-900 sm:text-4xl">
                            Everything you need to look your best
                        </p>
                        <p className="mt-6 text-lg leading-8 text-gray-600">
                            From manufacturing raw materials to the final stitch, we ensure every piece that leaves our facility meets the highest standards of luxury and durability.
                        </p>
                    </div>
                    
                    <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
                        <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
                            <div className="relative pl-16 group">
                                <dt className="text-xl font-bold leading-7 text-gray-900">
                                    <div className="absolute left-0 top-0 flex h-12 w-12 items-center justify-center rounded-lg bg-black text-white group-hover:bg-pink-600 transition-colors">
                                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                                        </svg>
                                    </div>
                                    Wholesale Ordering
                                </dt>
                                <dd className="mt-2 text-base leading-7 text-gray-600">Unbeatable bulk prices for businesses and boutiques. High margins, incredible quality.</dd>
                            </div>
                            <div className="relative pl-16 group">
                                <dt className="text-xl font-bold leading-7 text-gray-900">
                                    <div className="absolute left-0 top-0 flex h-12 w-12 items-center justify-center rounded-lg bg-black text-white group-hover:bg-pink-600 transition-colors">
                                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                                        </svg>
                                    </div>
                                    Direct Retail
                                </dt>
                                <dd className="mt-2 text-base leading-7 text-gray-600">Shop individual pieces directly from our curated collections, straight from the source.</dd>
                            </div>
                            <div className="relative pl-16 group">
                                <dt className="text-xl font-bold leading-7 text-gray-900">
                                    <div className="absolute left-0 top-0 flex h-12 w-12 items-center justify-center rounded-lg bg-black text-white group-hover:bg-pink-600 transition-colors">
                                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                                          <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
                                        </svg>
                                    </div>
                                    In-house Manufacturing
                                </dt>
                                <dd className="mt-2 text-base leading-7 text-gray-600">We produce our own garments using state-of-the-art machinery and skilled artisans.</dd>
                            </div>
                            <div className="relative pl-16 group">
                                <dt className="text-xl font-bold leading-7 text-gray-900">
                                    <div className="absolute left-0 top-0 flex h-12 w-12 items-center justify-center rounded-lg bg-black text-white group-hover:bg-pink-600 transition-colors">
                                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
                                        </svg>
                                    </div>
                                    Premium Materials
                                </dt>
                                <dd className="mt-2 text-base leading-7 text-gray-600">Sourced from the finest providers across the globe to ensure comfort and longevity.</dd>
                            </div>
                        </dl>
                    </div>
                </div>
            </div>

            {/* Feedbacks of Our Happy Customers Section */}
            {feedbacks.length > 0 && (
                <div className="bg-neutral-50 py-24 border-t border-neutral-100 overflow-hidden select-none relative">
                    {/* Background soft glows */}
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-pink-100/50 rounded-full filter blur-3xl pointer-events-none"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-150/40 rounded-full filter blur-3xl pointer-events-none"></div>
                    
                    <div className="mx-auto max-w-7xl px-6 lg:px-8 mb-16 relative">
                        <div className="mx-auto max-w-2xl lg:text-center">
                            <h2 className="text-base font-bold leading-7 text-pink-600 uppercase tracking-widest">Voices of Elegance</h2>
                            <p className="mt-2 text-3xl font-black tracking-tight text-gray-900 sm:text-4xl">
                                Feedbacks of Our Happy Customers
                            </p>
                            <p className="mt-4 text-base leading-7 text-neutral-500">
                                See how our premium sarees and outfits bring style and smiles to our community around the globe.
                            </p>
                        </div>
                    </div>

                    {/* Infinite scrolling marquee wrapper */}
                    <div className="relative w-full flex items-center justify-start overflow-hidden py-6 border-y border-neutral-200 bg-white/40 backdrop-blur-sm">
                        <div className="animate-marquee-left flex gap-8">
                            {/* Duplicate mapping for smooth loop */}
                            {[...feedbacks, ...feedbacks].map((fb, index) => (
                                <div 
                                    key={`${fb.id}-${index}`}
                                    onClick={() => setSelectedFeedback(fb)}
                                    className="w-[280px] sm:w-[320px] shrink-0 bg-white rounded-2xl p-5 border border-neutral-200 shadow-sm hover:shadow-xl transition-all duration-300 hover:scale-[1.03] hover:-translate-y-1.5 cursor-pointer flex flex-col group"
                                >
                                    {/* Image inside card */}
                                    <div className="aspect-[4/5] rounded-xl overflow-hidden bg-neutral-100 border border-neutral-100 mb-4 relative">
                                        <img 
                                            src={formatImageUrl(fb.image_url)} 
                                            alt={fb.customer_name || 'Happy Customer'}
                                            className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                                            <span className="text-white text-xs font-bold uppercase tracking-widest bg-pink-600 px-3.5 py-1.5 rounded-full shadow-lg">
                                                View Details
                                            </span>
                                        </div>
                                    </div>

                                    {/* Header rating & verification */}
                                    <div className="flex justify-between items-center mb-2">
                                        <div className="flex items-center gap-0.5 text-amber-500">
                                            {Array.from({ length: 5 }).map((_, idx) => (
                                                <svg key={idx} className={`w-3.5 h-3.5 ${idx < (fb.rating || 5) ? 'fill-current' : 'text-neutral-200'}`} viewBox="0 0 20 20">
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                </svg>
                                            ))}
                                        </div>
                                        <span className="text-[9px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded border border-green-200 flex items-center gap-1 uppercase tracking-wide">
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path></svg>
                                            Verified Buyer
                                        </span>
                                    </div>

                                    {/* Name & comments */}
                                    <h4 className="font-bold text-neutral-900 text-sm mb-1">{fb.customer_name || 'Anonymous Customer'}</h4>
                                    {fb.comment && (
                                        <p className="text-xs text-neutral-500 italic line-clamp-2">
                                            "{fb.comment}"
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Lightbox Modal */}
            {selectedFeedback && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
                    <div className="relative max-w-4xl w-full bg-white rounded-2xl overflow-hidden shadow-2xl border border-neutral-100 flex flex-col md:flex-row animate-modalSlideIn max-h-[90vh] md:max-h-[80vh]">
                        {/* Close Button */}
                        <button 
                            onClick={() => setSelectedFeedback(null)}
                            className="absolute top-4 right-4 z-10 p-2.5 bg-black/60 hover:bg-black/80 text-white rounded-full transition-colors focus:outline-none shadow-md"
                            aria-label="Close Lightbox"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </button>

                        {/* Photo Area */}
                        <div className="flex-1 bg-neutral-950 flex items-center justify-center p-4 overflow-hidden relative min-h-[300px] md:min-h-0">
                            <img 
                                src={formatImageUrl(selectedFeedback.image_url)} 
                                alt={selectedFeedback.customer_name || 'Feedback'} 
                                className="max-w-full max-h-[40vh] md:max-h-[70vh] object-contain rounded-lg shadow-lg"
                            />
                        </div>

                        {/* Info Area */}
                        <div className="w-full md:w-[350px] p-6 sm:p-8 flex flex-col bg-white border-t md:border-t-0 md:border-l border-neutral-200 overflow-y-auto">
                            <span className="text-[10px] font-bold text-pink-650 uppercase tracking-widest bg-pink-50 border border-pink-100 self-start px-2 py-0.5 rounded-full mb-4">
                                Verified Review
                            </span>
                            
                            <h3 className="text-xl font-black text-neutral-900 tracking-tight mb-1 uppercase">
                                {selectedFeedback.customer_name || 'Verified Customer'}
                            </h3>
                            
                            <div className="flex items-center gap-1 text-amber-500 mb-6">
                                {Array.from({ length: 5 }).map((_, idx) => (
                                    <svg key={idx} className={`w-4 h-4 ${idx < (selectedFeedback.rating || 5) ? 'fill-current' : 'text-neutral-200'}`} viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                ))}
                            </div>

                            <div className="flex-grow border-t border-neutral-100 pt-6">
                                <p className="text-sm text-neutral-600 italic leading-relaxed mb-6 font-medium">
                                    "{selectedFeedback.comment || 'No text review left, but the photo looks wonderful!'}"
                                </p>
                            </div>

                            <div className="text-xs text-neutral-400 font-bold border-t border-neutral-100 pt-4 flex justify-between">
                                <span>VERIFIED BUYER</span>
                                <span>{selectedFeedback.createdAt ? new Date(selectedFeedback.createdAt).toLocaleDateString() : ''}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            
            {/* CTA Section */}
            <div className="bg-gray-50">
              <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:flex lg:items-center lg:justify-between lg:px-8">
                <h2 className="text-3xl font-black tracking-tight text-gray-900 sm:text-4xl">
                  Ready to upgrade your wardrobe?
                  <br />
                  <span className="text-pink-600">Start exploring our collection today.</span>
                </h2>
                <div className="mt-10 flex items-center gap-x-6 lg:mt-0 lg:flex-shrink-0">
                  <Link
                    href="/products"
                    className="rounded-md bg-black px-8 py-3.5 text-sm font-bold text-white shadow-sm hover:bg-neutral-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black transition-transform hover:scale-105"
                  >
                    View All Products
                  </Link>
                  <Link href="/contact" className="text-sm font-bold leading-6 text-gray-900 hover:text-pink-600 transition-colors">
                    Contact Sales <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </div>
            </div>
        </ThiyaLayout>
    );
}
