import ThiyaLayout from '@/components/ThiyaLayout';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useCart } from '@/contexts/CartContext';
import LogoLoader from '@/components/LogoLoader';
import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

const formatImageUrl = (url) => {
    if (!url) return 'https://via.placeholder.com/800x1000?text=Premium+Collection';
    if (url.startsWith('http') && url.includes('localhost:3000')) {
        return url.replace('http://localhost:3000', API_URL);
    }
    if (url.startsWith('/uploads')) {
        return `${API_URL}${url}`;
    }
    return url;
};

const colorNameMap = {
    '#000000': 'Black',
    '#ffffff': 'White',
    '#ff0000': 'Red',
    '#00ff00': 'Lime',
    '#0000ff': 'Blue',
    '#ffff00': 'Yellow',
    '#00ffff': 'Cyan',
    '#ff00ff': 'Magenta',
    '#c0c0c0': 'Silver',
    '#808080': 'Gray',
    '#800000': 'Maroon',
    '#808000': 'Olive',
    '#008000': 'Green',
    '#800080': 'Purple',
    '#008080': 'Teal',
    '#000080': 'Navy',
    '#a52a2a': 'Brown',
    '#ff7f50': 'Coral',
    '#ff69b4': 'Hot Pink',
    '#ffd700': 'Gold',
    '#4b0082': 'Indigo',
    '#ffc0cb': 'Pink',
    '#dda0dd': 'Plum',
    '#40e0d0': 'Turquoise',
    '#ee82ee': 'Violet',
    '#821515': 'Deep Maroon',
    '#598554': 'Sage Green',
    '#e3788c': 'Rose Pink',
    '#f1ffe6': 'Mint Green',
};

const hexToRgb = (hex) => {
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    const fullHex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(fullHex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
};

const getColorName = (hex) => {
    if (!hex) return '';
    if (!hex.startsWith('#')) {
        return hex.charAt(0).toUpperCase() + hex.slice(1);
    }
    const target = hex.toLowerCase().trim();
    if (colorNameMap[target]) return colorNameMap[target];

    const targetRgb = hexToRgb(target);
    if (!targetRgb) return hex;

    let minDistance = Infinity;
    let closestName = hex;

    for (const [key, name] of Object.entries(colorNameMap)) {
        const rgb = hexToRgb(key);
        if (rgb) {
            const distance = Math.sqrt(
                Math.pow(targetRgb.r - rgb.r, 2) +
                Math.pow(targetRgb.g - rgb.g, 2) +
                Math.pow(targetRgb.b - rgb.b, 2)
            );
            if (distance < minDistance) {
                minDistance = distance;
                closestName = name;
            }
        }
    }
    return closestName;
};

const parseSizes = (sizeStr) => {
    if (!sizeStr || !sizeStr.trim()) return [];
    if (sizeStr.includes(',')) {
        return sizeStr.split(',').map(s => s.trim()).filter(Boolean);
    }
    const parts = sizeStr.split(/\s+/).map(s => s.trim()).filter(Boolean);
    if (parts.length > 1 && parts.every(p => p.length <= 5)) {
        return parts;
    }
    return [sizeStr.trim()];
};

export default function ProductDetails() {
    const router = useRouter();
    const { addToCart } = useCart();
    const { id } = router.query;
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [adjacentProducts, setAdjacentProducts] = useState({ prev: null, next: null });
    
    // UI State
    const [selectedImage, setSelectedImage] = useState(0);
    const [selectedSize, setSelectedSize] = useState('');
    const [selectedColor, setSelectedColor] = useState('');
    const [quantity, setQuantity] = useState(1);
    

    useEffect(() => {
        if (!id) return;
        const fetchProduct = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/thiya/products/${id}`);
                if (response.data.is_success) {
                    const prod = response.data.data;
                    setProduct(prod);
                    if (prod.colors && prod.colors.length > 0) {
                        setSelectedColor(prod.colors[0]);
                    }
                    const parsedSizes = parseSizes(prod.size);
                    if (parsedSizes.length > 0) {
                        setSelectedSize(parsedSizes[0]);
                    } else {
                        setSelectedSize('Standard');
                    }

                    // Fetch active products list to calculate adjacent IDs
                    const listResponse = await axios.get(`${API_URL}/api/thiya/products`);
                    if (listResponse.data.is_success) {
                        const allProds = listResponse.data.data.filter(p => p.status === 'active');
                        const currentIndex = allProds.findIndex(p => p.id.toString() === id.toString());
                        if (currentIndex !== -1) {
                            const prevProd = allProds[currentIndex - 1] || allProds[allProds.length - 1];
                            const nextProd = allProds[currentIndex + 1] || allProds[0];
                            setAdjacentProducts({ prev: prevProd, next: nextProd });
                        }
                    }
                }
            } catch (error) {
                console.error("Error fetching product:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    useEffect(() => {
        if (!product || !product.images || product.images.length <= 1) return;
        const interval = setInterval(() => {
            setSelectedImage((prev) => (prev + 1) % product.images.length);
        }, 4500);
        return () => clearInterval(interval);
    }, [product, selectedImage]);



    if (loading) {
        return (
            <ThiyaLayout title="Loading Product..." description="Loading premium products from Thiya Fashions.">
                <div className="flex items-center justify-center min-h-screen bg-white">
                    <LogoLoader text="Loading Saree Details..." />
                </div>
            </ThiyaLayout>
        );
    }

    if (!product) {
        return <ThiyaLayout title="Product Not Found" description="The requested product could not be found."><div className="text-center py-32 bg-white min-h-screen"><h2>Product not found</h2></div></ThiyaLayout>;
    }

    const unitPrice = parseFloat(product.price) - parseFloat(product.discount_amount || 0);
    const subtotal = unitPrice * quantity;
    const gstAmount = 0;
    const totalAmount = subtotal + gstAmount;

    // Default sizes if none provided
    const sizes = parseSizes(product.size);
    const detailsKeys = product.details ? Object.keys(product.details) : [];

    return (
        <ThiyaLayout title={product.title} description={product.description ? product.description.substring(0, 150) + "..." : `Buy ${product.title} at unbeatable direct manufacturing price.`}>
            <div className="bg-white min-h-screen">
                <div className="mx-auto max-w-screen-2xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
                    
                    {/* Previous/Next Saree Navigation (Top Bar, Mobile-Responsive) */}
                    <div className="flex justify-between items-center mb-8 border-b border-neutral-100 pb-4">
                        <Link href="/products" className="text-xs sm:text-sm text-neutral-500 hover:text-black transition-colors flex items-center font-bold uppercase tracking-wider">
                            <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7"></path></svg>
                            Back to Shop
                        </Link>
                        {adjacentProducts.prev && adjacentProducts.next && (
                            <div className="flex gap-2">
                                <Link 
                                    href={`/products/${adjacentProducts.prev.id}`}
                                    className="flex items-center justify-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-800 transition-all font-bold text-xs uppercase tracking-wider"
                                    title={`Previous: ${adjacentProducts.prev.title}`}
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7"></path></svg>
                                    Prev
                                </Link>
                                <Link 
                                    href={`/products/${adjacentProducts.next.id}`}
                                    className="flex items-center justify-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-800 transition-all font-bold text-xs uppercase tracking-wider"
                                    title={`Next: ${adjacentProducts.next.title}`}
                                >
                                    Next
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7"></path></svg>
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Desktop Viewport Floating Navigation Buttons */}
                    {adjacentProducts.prev && (
                        <Link 
                            href={`/products/${adjacentProducts.prev.id}`}
                            className="hidden xl:flex fixed left-8 top-1/2 -translate-y-1/2 z-40 bg-white hover:bg-black hover:text-white text-neutral-800 shadow-xl border border-neutral-200 h-14 w-14 rounded-full items-center justify-center transition-all group duration-300 hover:scale-105 active:scale-95"
                            title={`Previous: ${adjacentProducts.prev.title}`}
                        >
                            <svg className="w-6 h-6 transform group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7"></path></svg>
                        </Link>
                    )}
                    {adjacentProducts.next && (
                        <Link 
                            href={`/products/${adjacentProducts.next.id}`}
                            className="hidden xl:flex fixed right-8 top-1/2 -translate-y-1/2 z-40 bg-white hover:bg-black hover:text-white text-neutral-800 shadow-xl border border-neutral-200 h-14 w-14 rounded-full items-center justify-center transition-all group duration-300 hover:scale-105 active:scale-95"
                            title={`Next: ${adjacentProducts.next.title}`}
                        >
                            <svg className="w-6 h-6 transform group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7"></path></svg>
                        </Link>
                    )}

                    <div className="lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
                        
                        {/* LEFT COLUMN: Image Gallery Layout */}
                        <div className="lg:col-span-7 flex flex-col-reverse lg:flex-row gap-4">
                            {/* Vertical Thumbnails */}
                            {product.images && product.images.length > 1 && (
                                <div className="flex lg:flex-col gap-4 overflow-auto lg:w-24 shrink-0">
                                    {product.images.map((img, i) => (
                                        <button 
                                            key={i} 
                                            onClick={() => {
                                                setSelectedImage(i);
                                                if (img.color && img.color !== 'default') setSelectedColor(img.color);
                                            }}
                                            className={`aspect-[3/4] w-20 lg:w-full bg-neutral-100 overflow-hidden cursor-pointer rounded-sm hover:opacity-75 transition-opacity border-2 ${selectedImage === i ? 'border-black' : 'border-transparent'}`}
                                        >
                                            <img src={formatImageUrl(img.url)} className="w-full h-full object-cover" alt="Thumbnail" />
                                        </button>
                                    ))}
                                </div>
                            )}
                            {/* Main Image Slider with Premium Cross-fade Transition */}
                            <div className="aspect-[3/4] w-full overflow-hidden bg-neutral-100 rounded-sm flex-grow relative group">
                                {product.images && product.images.length > 0 ? (
                                    product.images.map((img, i) => (
                                        <img
                                            key={i}
                                            src={formatImageUrl(img.url)}
                                            alt={`${product.title} - View ${i + 1}`}
                                            className={`absolute inset-0 h-full w-full object-cover object-top transition-opacity duration-700 ease-in-out ${selectedImage === i ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                                        />
                                    ))
                                ) : (
                                    <img
                                        src="https://via.placeholder.com/800x1000?text=Premium+Collection"
                                        alt={product.title}
                                        className="h-full w-full object-cover object-top"
                                    />
                                )}
                                
                                {product.discount_amount > 0 && (
                                    <div className="absolute top-4 left-4 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded z-20">
                                        SALE
                                    </div>
                                )}

                                {/* Slider Navigation Arrow Buttons */}
                                {product.images && product.images.length > 1 && (
                                    <>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setSelectedImage((prev) => (prev - 1 + product.images.length) % product.images.length);
                                            }}
                                            className="absolute left-3 top-1/2 -translate-y-1/2 bg-white hover:bg-neutral-100 text-neutral-900 p-2.5 rounded-full shadow-lg border border-neutral-200 transition-all focus:outline-none z-30 active:scale-90 duration-200"
                                            aria-label="Previous image"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                                            </svg>
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setSelectedImage((prev) => (prev + 1) % product.images.length);
                                            }}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 bg-white hover:bg-neutral-100 text-neutral-900 p-2.5 rounded-full shadow-lg border border-neutral-200 transition-all focus:outline-none z-30 active:scale-90 duration-200"
                                            aria-label="Next image"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                            </svg>
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* RIGHT COLUMN: Product Info */}
                        <div className="lg:col-span-5 mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0 pt-2 lg:sticky lg:top-24">
                            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 leading-tight">
                                {product.title}
                            </h1>
                            
                            <div className="mt-4 flex items-end gap-3">
                                <p className="text-2xl font-bold text-neutral-900">₹{unitPrice.toFixed(2)}</p>
                                {parseFloat(product.discount_amount) > 0 && (
                                    <p className="text-sm text-neutral-500 line-through mb-1">₹{parseFloat(product.price).toFixed(2)}</p>
                                )}
                            </div>
                            
                            <div className="mt-4 prose prose-sm text-neutral-600 text-sm leading-relaxed">
                                <p>{product.description}</p>
                            </div>

                            {/* Color Selection */}
                            {product.colors && product.colors.length > 0 && (
                                <div className="mt-6">
                                    <h3 className="text-sm font-bold text-neutral-900 mb-3">Color: <span className="font-normal text-neutral-600">{getColorName(selectedColor)}</span></h3>
                                    <div className="flex flex-wrap gap-2">
                                        {product.colors.map(color => (
                                            <button
                                                key={color}
                                                onClick={() => {
                                                    setSelectedColor(color);
                                                    const idx = product.images?.findIndex(img => 
                                                        img.color && img.color.toLowerCase().trim() === color.toLowerCase().trim()
                                                    );
                                                    if (idx !== -1) setSelectedImage(idx);
                                                }}
                                                className={`px-3 py-2 text-xs font-bold uppercase transition-all rounded ${selectedColor === color ? 'bg-neutral-900 text-white' : 'bg-white text-neutral-900 border border-neutral-300 hover:border-black'}`}
                                            >
                                                {getColorName(color)}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Size Selection */}
                            {sizes.length > 0 && (
                                <div className="mt-6">
                                    <div className="flex items-center justify-between mb-3">
                                        <h3 className="text-sm font-bold text-neutral-900">Size: <span className="font-normal text-neutral-600">{selectedSize}</span></h3>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {sizes.map((s) => (
                                            <button 
                                                key={s} 
                                                onClick={() => setSelectedSize(s)}
                                                className={`min-w-[40px] px-3 py-2 text-xs font-bold uppercase transition-all rounded ${selectedSize === s ? 'bg-neutral-900 text-white' : 'bg-white text-neutral-900 border border-neutral-300 hover:border-black'}`}
                                            >
                                                {s}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Quantity Selector */}
                            <div className="mt-6">
                                <h3 className="text-sm font-bold text-neutral-900 mb-3">Quantity</h3>
                                <div className="flex items-center border border-neutral-300 rounded w-24">
                                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-3 py-1 text-neutral-500 hover:text-black">-</button>
                                    <input type="text" readOnly value={quantity} className="w-full text-center text-sm font-medium border-0 py-1" />
                                    <button onClick={() => setQuantity(quantity + 1)} className="px-3 py-1 text-neutral-500 hover:text-black">+</button>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="mt-8 flex flex-col gap-3">
                                <button
                                    type="button"
                                    onClick={() => addToCart(product, selectedSize, selectedColor, quantity)}
                                    className="w-full flex items-center justify-center bg-white border border-black px-8 py-3 text-sm font-bold text-black hover:bg-neutral-50 transition-colors"
                                >
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                                    Add to cart
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        router.push(`/checkout?productId=${product.id}&quantity=${quantity}&size=${selectedSize}&color=${selectedColor}`);
                                    }}
                                    className="w-full flex items-center justify-center bg-black px-8 py-4 text-sm font-bold uppercase tracking-wider text-white hover:bg-neutral-800 transition-colors"
                                >
                                    BUY IT NOW
                                </button>
                            </div>

                            <div className="mt-4 flex items-center text-xs text-green-700 font-medium">
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                In Stock - Free Delivery
                            </div>

                            {/* Product Details Table */}
                            {detailsKeys.length > 0 && (
                                <div className="mt-12">
                                    <h3 className="text-base font-bold text-neutral-900 mb-4 border-b border-neutral-200 pb-2">Product Details</h3>
                                    <div className="divide-y divide-neutral-100">
                                        {detailsKeys.map(key => (
                                            <div key={key} className="py-2 grid grid-cols-3 gap-4 text-sm">
                                                <div className="text-neutral-500 font-medium flex items-center gap-2">
                                                    <span className="text-blue-500">🔹</span> {key}
                                                </div>
                                                <div className="col-span-2 text-neutral-900">{product.details[key]}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>




        </ThiyaLayout>
    );
}
