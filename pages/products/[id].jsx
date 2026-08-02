import ThiyaLayout from '@/components/ThiyaLayout';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export default function ProductDetails() {
    const router = useRouter();
    const { id } = router.query;
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    
    // UI State
    const [selectedImage, setSelectedImage] = useState(0);
    const [selectedSize, setSelectedSize] = useState('');
    const [selectedColor, setSelectedColor] = useState('');
    const [quantity, setQuantity] = useState(1);
    
    // Checkout State
    const [showCheckoutModal, setShowCheckoutModal] = useState(false);
    const [purchasing, setPurchasing] = useState(false);
    const [checkoutForm, setCheckoutForm] = useState({
        customer_name: '', customer_email: '', phone: '', alt_phone: '',
        door_no: '', street: '', landmark: '', city: '', district: '', pincode: '', state: ''
    });

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

    const handleFormChange = (e) => {
        setCheckoutForm({ ...checkoutForm, [e.target.name]: e.target.value });
    };

    const initializeRazorpay = () => {
        return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handleProceedToPayment = async (e) => {
        e.preventDefault();
        setPurchasing(true);
        const res = await initializeRazorpay();

        if (!res) {
            alert("Razorpay SDK Failed to load");
            setPurchasing(false);
            return;
        }

        try {
            const orderResponse = await axios.post(`${API_URL}/api/thiya/orders`, {
                product_id: product.id,
                ...checkoutForm,
                quantity
            });

            if (!orderResponse.data.is_success) {
                alert("Failed to create order");
                setPurchasing(false);
                return;
            }

            const { order_id, razorpay_order_id, amount, currency, key_id } = orderResponse.data.data;

            // Handle mock orders locally without launching Razorpay widget
            if (razorpay_order_id.startsWith('mock_')) {
                const verifyRes = await axios.post(`${API_URL}/api/thiya/orders/verify`, {
                    razorpay_payment_id: 'mock_payment_' + Date.now(),
                    razorpay_order_id: razorpay_order_id,
                    razorpay_signature: 'mock_signature',
                    order_id: order_id
                });

                if (verifyRes.data.is_success) {
                    alert("Mock Payment Successful! (Simulated local payment)");
                    setShowCheckoutModal(false);
                    router.push('/products');
                }
                return;
            }

            const options = {
                key: key_id,
                amount: amount.toString(),
                currency: currency,
                name: "Thiya Fashions",
                description: `Purchase of ${product.title}`,
                image: product.images?.[0]?.url || "https://via.placeholder.com/150?text=Thiya",
                order_id: razorpay_order_id,
                handler: async function (response) {
                    try {
                        const verifyRes = await axios.post(`${API_URL}/api/thiya/orders/verify`, {
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_signature: response.razorpay_signature,
                            order_id: order_id
                        });

                        if (verifyRes.data.is_success) {
                            alert("Payment Successful! Thank you for shopping with Thiya Fashions.");
                            setShowCheckoutModal(false);
                            router.push('/products');
                        }
                    } catch (error) {
                        alert("Payment verification failed");
                    }
                },
                prefill: {
                    name: checkoutForm.customer_name,
                    email: checkoutForm.customer_email,
                    contact: checkoutForm.phone
                },
                theme: { color: "#000000" }
            };

            const paymentObject = new window.Razorpay(options);
            paymentObject.on('payment.failed', function (response){
                alert("Payment failed: " + response.error.description);
            });
            paymentObject.open();

        } catch (error) {
            console.error("Error during purchase:", error);
            alert(`Something went wrong: ${error.response?.data?.message || error.message}`);
        } finally {
            setPurchasing(false);
        }
    };

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
                                    onClick={() => alert("Added to cart!")}
                                    className="w-full flex items-center justify-center bg-white border border-black px-8 py-3 text-sm font-bold text-black hover:bg-neutral-50 transition-colors"
                                >
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                                    Add to cart
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowCheckoutModal(true)}
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

            {/* Checkout Modal */}
            {showCheckoutModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-neutral-900/70 backdrop-blur-sm p-4 overflow-y-auto">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl my-8 animate-in fade-in zoom-in duration-200">
                        <div className="px-6 py-4 border-b border-neutral-200 flex justify-between items-center sticky top-0 bg-white z-10 rounded-t-xl">
                            <div>
                                <h2 className="text-xl font-bold text-neutral-900">Checkout Details</h2>
                                <p className="text-xs text-neutral-500">Please fill in your details to proceed with the purchase</p>
                            </div>
                            <button onClick={() => setShowCheckoutModal(false)} className="text-neutral-400 hover:text-black">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </button>
                        </div>

                        <form onSubmit={handleProceedToPayment} className="p-6 space-y-8">
                            
                            {/* Personal Info */}
                            <div>
                                <h3 className="text-sm font-bold text-neutral-800 flex items-center gap-2 mb-4">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path></svg>
                                    Personal Information
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input type="text" name="customer_name" required placeholder="Enter your full name" onChange={handleFormChange} className="block w-full rounded-md border-0 py-2.5 px-3 text-neutral-900 ring-1 ring-inset ring-neutral-300 text-sm focus:ring-2 focus:ring-black" />
                                    <input type="email" name="customer_email" required placeholder="Enter your email" onChange={handleFormChange} className="block w-full rounded-md border-0 py-2.5 px-3 text-neutral-900 ring-1 ring-inset ring-neutral-300 text-sm focus:ring-2 focus:ring-black" />
                                    <input type="tel" name="phone" required placeholder="Enter your phone number" onChange={handleFormChange} className="block w-full rounded-md border-0 py-2.5 px-3 text-neutral-900 ring-1 ring-inset ring-neutral-300 text-sm focus:ring-2 focus:ring-black" />
                                    <input type="tel" name="alt_phone" placeholder="Alternative Phone Number (Optional)" onChange={handleFormChange} className="block w-full rounded-md border-0 py-2.5 px-3 text-neutral-900 ring-1 ring-inset ring-neutral-300 text-sm focus:ring-2 focus:ring-black" />
                                </div>
                            </div>

                            {/* Delivery Address */}
                            <div>
                                <h3 className="text-sm font-bold text-neutral-800 flex items-center gap-2 mb-4">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path></svg>
                                    Delivery Address
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input type="text" name="door_no" required placeholder="Door No / House No" onChange={handleFormChange} className="block w-full rounded-md border-0 py-2.5 px-3 text-neutral-900 ring-1 ring-inset ring-neutral-300 text-sm focus:ring-2 focus:ring-black" />
                                    <input type="text" name="street" required placeholder="Street" onChange={handleFormChange} className="block w-full rounded-md border-0 py-2.5 px-3 text-neutral-900 ring-1 ring-inset ring-neutral-300 text-sm focus:ring-2 focus:ring-black" />
                                    <input type="text" name="landmark" placeholder="Landmark" onChange={handleFormChange} className="md:col-span-2 block w-full rounded-md border-0 py-2.5 px-3 text-neutral-900 ring-1 ring-inset ring-neutral-300 text-sm focus:ring-2 focus:ring-black" />
                                    <input type="text" name="city" required placeholder="City" onChange={handleFormChange} className="block w-full rounded-md border-0 py-2.5 px-3 text-neutral-900 ring-1 ring-inset ring-neutral-300 text-sm focus:ring-2 focus:ring-black" />
                                    <input type="text" name="district" required placeholder="District" onChange={handleFormChange} className="block w-full rounded-md border-0 py-2.5 px-3 text-neutral-900 ring-1 ring-inset ring-neutral-300 text-sm focus:ring-2 focus:ring-black" />
                                    <input type="text" name="pincode" required placeholder="Pin Code" onChange={handleFormChange} className="block w-full rounded-md border-0 py-2.5 px-3 text-neutral-900 ring-1 ring-inset ring-neutral-300 text-sm focus:ring-2 focus:ring-black" />
                                    <input type="text" name="state" required placeholder="State" onChange={handleFormChange} className="block w-full rounded-md border-0 py-2.5 px-3 text-neutral-900 ring-1 ring-inset ring-neutral-300 text-sm focus:ring-2 focus:ring-black" />
                                </div>
                            </div>

                            {/* Order Summary */}
                            <div className="bg-neutral-50 p-4 rounded-lg">
                                <h3 className="text-sm font-bold text-neutral-900 mb-3">Order Summary</h3>
                                <div className="space-y-2 text-sm text-neutral-600">
                                    <div className="flex justify-between">
                                        <span>Product:</span>
                                        <span className="font-medium text-right max-w-[250px] truncate" title={product.title}>{product.title}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Quantity:</span>
                                        <span className="font-medium">{quantity}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Price per unit:</span>
                                        <span className="font-medium">₹{unitPrice.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between border-b border-neutral-200 pb-2">
                                        <span>GST (5%):</span>
                                        <span className="font-medium">₹{gstAmount.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between pt-2 font-bold text-neutral-900">
                                        <span>Total:</span>
                                        <span>₹{totalAmount.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-neutral-200">
                                <button type="button" onClick={() => setShowCheckoutModal(false)} className="px-6 py-2.5 border border-neutral-300 rounded text-sm font-bold text-neutral-700 hover:bg-neutral-50 transition-colors">
                                    Cancel
                                </button>
                                <button type="submit" disabled={purchasing} className="px-6 py-2.5 bg-black rounded text-sm font-bold text-white hover:bg-neutral-800 transition-colors disabled:bg-neutral-400">
                                    {purchasing ? "Processing..." : "Proceed to Payment"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </ThiyaLayout>
    );
}
