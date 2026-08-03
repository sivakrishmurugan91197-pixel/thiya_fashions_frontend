import ThiyaLayout from '@/components/ThiyaLayout';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useCart } from '@/contexts/CartContext';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export default function ProductDetails() {
    const router = useRouter();
    const { addToCart } = useCart();
    const { id } = router.query;
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    
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
                    if (prod.size && prod.size.trim()) {
                        setSelectedSize(prod.size.split(',')[0].trim());
                    } else {
                        setSelectedSize('Standard');
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



    if (loading) {
        return <ThiyaLayout><div className="flex justify-center items-center h-screen bg-white"><div className="w-16 h-16 border-t-2 border-black rounded-full animate-spin"></div></div></ThiyaLayout>;
    }

    if (!product) {
        return <ThiyaLayout><div className="text-center py-32 bg-white min-h-screen"><h2>Product not found</h2></div></ThiyaLayout>;
    }

    const unitPrice = parseFloat(product.price) - parseFloat(product.discount_amount || 0);
    const subtotal = unitPrice * quantity;
    const gstAmount = subtotal * 0.05;
    const totalAmount = subtotal + gstAmount;

    // Default sizes if none provided
    const sizes = product.size && product.size.trim() ? product.size.split(',').map(s => s.trim()).filter(Boolean) : [];
    const detailsKeys = product.details ? Object.keys(product.details) : [];

    return (
        <ThiyaLayout>
            <div className="bg-white min-h-screen">
                <div className="mx-auto max-w-screen-2xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
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
                                            <img src={img.url} className="w-full h-full object-cover" alt="Thumbnail" />
                                        </button>
                                    ))}
                                </div>
                            )}
                            {/* Main Image */}
                            <div className="aspect-[3/4] w-full overflow-hidden bg-neutral-100 rounded-sm flex-grow relative">
                                <img
                                    src={product.images && product.images.length > 0 ? product.images[selectedImage]?.url : 'https://via.placeholder.com/800x1000?text=Premium+Collection'}
                                    alt={product.title}
                                    className="h-full w-full object-cover object-top"
                                />
                                {product.discount_amount > 0 && (
                                    <div className="absolute top-4 left-4 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
                                        SALE
                                    </div>
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
                                    <h3 className="text-sm font-bold text-neutral-900 mb-3">Color: <span className="font-normal text-neutral-600">{selectedColor}</span></h3>
                                    <div className="flex items-center gap-3">
                                        {product.colors.map(color => {
                                            // Handle hex codes vs names
                                            const isHex = color.startsWith('#');
                                            const bgColor = isHex ? color : color.toLowerCase();
                                            return (
                                                <button
                                                    key={color}
                                                    onClick={() => {
                                                        setSelectedColor(color);
                                                        const idx = product.images?.findIndex(img => img.color === color);
                                                        if (idx !== -1) setSelectedImage(idx);
                                                    }}
                                                    className={`h-8 w-8 rounded-full border-2 flex items-center justify-center ${selectedColor === color ? 'border-black' : 'border-transparent ring-1 ring-neutral-200'}`}
                                                    title={color}
                                                >
                                                    <span className="h-6 w-6 rounded-full border border-black/10" style={{ backgroundColor: bgColor }}></span>
                                                </button>
                                            )
                                        })}
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
