import ThiyaLayout from '@/components/ThiyaLayout';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export default function CheckoutPage() {
    const router = useRouter();
    const { productId, quantity: qtyParam, size, color } = router.query;

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [purchasing, setPurchasing] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [checkoutForm, setCheckoutForm] = useState({
        customer_name: '', customer_email: '', phone: '', alt_phone: '',
        door_no: '', street: '', landmark: '', city: '', district: '', pincode: '', state: ''
    });

    useEffect(() => {
        if (qtyParam) {
            setQuantity(parseInt(qtyParam) || 1);
        }
    }, [qtyParam]);

    useEffect(() => {
        if (!productId) return;
        const fetchProduct = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/thiya/products/${productId}`);
                if (response.data.is_success) {
                    setProduct(response.data.data);
                }
            } catch (error) {
                console.error("Error fetching product details:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [productId]);

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
                quantity,
                size: size || 'Standard',
                color: color || 'Default'
            });

            if (!orderResponse.data.is_success) {
                alert("Failed to create order");
                setPurchasing(false);
                return;
            }

            const { order_id, razorpay_order_id, amount, currency, key_id } = orderResponse.data.data;

            // Handle mock orders locally without launching Razorpay widget
            if (razorpay_order_id.startsWith('mock_')) {
                const mockPaymentId = 'mock_payment_' + Date.now();
                const verifyRes = await axios.post(`${API_URL}/api/thiya/orders/verify`, {
                    razorpay_payment_id: mockPaymentId,
                    razorpay_order_id: razorpay_order_id,
                    razorpay_signature: 'mock_signature',
                    order_id: order_id
                });

                if (verifyRes.data.is_success) {
                    router.push(`/order-success?transactionId=${mockPaymentId}&title=${encodeURIComponent(product.title)}&quantity=${quantity}&amount=${totalAmount}`);
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
                            router.push(`/order-success?transactionId=${response.razorpay_payment_id}&title=${encodeURIComponent(product.title)}&quantity=${quantity}&amount=${totalAmount}`);
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
                theme: { color: "#ec4899" } // Pink accent color
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
        return (
            <ThiyaLayout>
                <div className="flex justify-center items-center min-h-[60vh] bg-white">
                    <div className="w-16 h-16 border-t-2 border-pink-500 rounded-full animate-spin"></div>
                </div>
            </ThiyaLayout>
        );
    }

    if (!product) {
        return (
            <ThiyaLayout>
                <div className="text-center py-32 bg-white min-h-[60vh]">
                    <h2 className="text-xl font-bold text-neutral-800">Checkout parameters are invalid or product was not found</h2>
                    <button onClick={() => router.push('/products')} className="mt-4 py-2 px-6 bg-pink-600 text-white rounded font-bold uppercase tracking-wider text-sm hover:bg-pink-700 transition-colors">
                        Back to Shop
                    </button>
                </div>
            </ThiyaLayout>
        );
    }

    const unitPrice = parseFloat(product.price) - parseFloat(product.discount_amount || 0);
    const subtotal = unitPrice * quantity;
    const gstAmount = subtotal * 0.05;
    const totalAmount = subtotal + gstAmount;

    return (
        <ThiyaLayout>
            <div className="bg-neutral-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto">
                    
                    {/* Header */}
                    <div className="mb-10 text-center sm:text-left">
                        <h2 className="text-3xl font-black text-neutral-900 tracking-tight uppercase">
                            Secure Checkout
                        </h2>
                        <p className="text-sm text-neutral-500 font-bold uppercase tracking-wider mt-1">
                            Complete your details below to place the order
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                        
                        {/* Form Section */}
                        <div className="lg:col-span-7 bg-white p-6 sm:p-10 rounded-2xl border border-neutral-200 shadow-sm">
                            <form onSubmit={handleProceedToPayment} className="space-y-8">
                                
                                {/* Personal Info */}
                                <div>
                                    <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest border-b border-neutral-200 pb-3 mb-5 flex items-center gap-2">
                                        <svg className="w-4 h-4 text-pink-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path></svg>
                                        Personal Information
                                    </h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                        <div>
                                            <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">Full Name</label>
                                            <input type="text" name="customer_name" required placeholder="Enter full name" onChange={handleFormChange} className="block w-full rounded-lg border-0 py-3 px-4 text-neutral-900 ring-1 ring-inset ring-neutral-300 text-sm focus:ring-2 focus:ring-pink-500 bg-neutral-50" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">Email Address</label>
                                            <input type="email" name="customer_email" required placeholder="Enter email address" onChange={handleFormChange} className="block w-full rounded-lg border-0 py-3 px-4 text-neutral-900 ring-1 ring-inset ring-neutral-300 text-sm focus:ring-2 focus:ring-pink-500 bg-neutral-50" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">Phone Number</label>
                                            <input type="tel" name="phone" required placeholder="10-digit mobile number" onChange={handleFormChange} className="block w-full rounded-lg border-0 py-3 px-4 text-neutral-900 ring-1 ring-inset ring-neutral-300 text-sm focus:ring-2 focus:ring-pink-500 bg-neutral-50" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">Alternative Phone (Optional)</label>
                                            <input type="tel" name="alt_phone" placeholder="Alt phone number" onChange={handleFormChange} className="block w-full rounded-lg border-0 py-3 px-4 text-neutral-900 ring-1 ring-inset ring-neutral-300 text-sm focus:ring-2 focus:ring-pink-500 bg-neutral-50" />
                                        </div>
                                    </div>
                                </div>

                                {/* Delivery Address */}
                                <div>
                                    <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest border-b border-neutral-200 pb-3 mb-5 flex items-center gap-2">
                                        <svg className="w-4 h-4 text-pink-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path></svg>
                                        Delivery Address
                                    </h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                        <div>
                                            <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">Door No / House No</label>
                                            <input type="text" name="door_no" required placeholder="Door/Flat/House No" onChange={handleFormChange} className="block w-full rounded-lg border-0 py-3 px-4 text-neutral-900 ring-1 ring-inset ring-neutral-300 text-sm focus:ring-2 focus:ring-pink-500 bg-neutral-50" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">Street Name</label>
                                            <input type="text" name="street" required placeholder="Street / Area Name" onChange={handleFormChange} className="block w-full rounded-lg border-0 py-3 px-4 text-neutral-900 ring-1 ring-inset ring-neutral-300 text-sm focus:ring-2 focus:ring-pink-500 bg-neutral-50" />
                                        </div>
                                        <div className="sm:col-span-2">
                                            <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">Landmark</label>
                                            <input type="text" name="landmark" placeholder="e.g. Near bus stop" onChange={handleFormChange} className="block w-full rounded-lg border-0 py-3 px-4 text-neutral-900 ring-1 ring-inset ring-neutral-300 text-sm focus:ring-2 focus:ring-pink-500 bg-neutral-50" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">City</label>
                                            <input type="text" name="city" required placeholder="City name" onChange={handleFormChange} className="block w-full rounded-lg border-0 py-3 px-4 text-neutral-900 ring-1 ring-inset ring-neutral-300 text-sm focus:ring-2 focus:ring-pink-500 bg-neutral-50" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">District</label>
                                            <input type="text" name="district" required placeholder="District" onChange={handleFormChange} className="block w-full rounded-lg border-0 py-3 px-4 text-neutral-900 ring-1 ring-inset ring-neutral-300 text-sm focus:ring-2 focus:ring-pink-500 bg-neutral-50" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">Pin Code</label>
                                            <input type="text" name="pincode" required placeholder="6-digit pincode" onChange={handleFormChange} className="block w-full rounded-lg border-0 py-3 px-4 text-neutral-900 ring-1 ring-inset ring-neutral-300 text-sm focus:ring-2 focus:ring-pink-500 bg-neutral-50" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">State</label>
                                            <input type="text" name="state" required placeholder="State name" onChange={handleFormChange} className="block w-full rounded-lg border-0 py-3 px-4 text-neutral-900 ring-1 ring-inset ring-neutral-300 text-sm focus:ring-2 focus:ring-pink-500 bg-neutral-50" />
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4">
                                    <button
                                        type="submit"
                                        disabled={purchasing}
                                        className="w-full py-4 bg-pink-600 hover:bg-pink-700 text-white rounded-xl text-sm font-bold uppercase tracking-wider transition-colors disabled:bg-neutral-400 shadow-lg shadow-pink-500/20 active:scale-[0.98] transform duration-700 flex justify-center items-center"
                                    >
                                        {purchasing ? (
                                            <>
                                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Processing Order...
                                            </>
                                        ) : "Proceed to Payment"}
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Order Summary Section */}
                        <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-2xl border border-neutral-200 shadow-sm sticky top-6">
                            <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest border-b border-neutral-200 pb-3 mb-5">
                                Order Summary
                            </h3>

                            {/* Product Card */}
                            <div className="flex gap-4 border-b border-neutral-100 pb-5 mb-5">
                                <div className="w-20 h-20 bg-neutral-100 rounded-lg overflow-hidden border border-neutral-200 flex-shrink-0">
                                    <img 
                                        src={product.images?.[0]?.url || "https://via.placeholder.com/150?text=Thiya"} 
                                        alt={product.title} 
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <h4 className="text-sm font-bold text-neutral-900 truncate" title={product.title}>
                                        {product.title}
                                    </h4>
                                    <div className="flex flex-wrap gap-x-3 text-xs text-neutral-500 mt-1 font-semibold">
                                        {size && (
                                            <span>Size: <span className="text-neutral-900">{size}</span></span>
                                        )}
                                        {color && (
                                            <span>Color: <span className="text-neutral-900">{color}</span></span>
                                        )}
                                        <span>Qty: <span className="text-neutral-900">{quantity}</span></span>
                                    </div>
                                </div>
                            </div>

                            {/* Calculation Details */}
                            <div className="space-y-3.5 text-sm text-neutral-600 border-b border-neutral-100 pb-5 mb-5 font-semibold">
                                <div className="flex justify-between">
                                    <span>Price per unit:</span>
                                    <span className="text-neutral-900">₹{unitPrice.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Subtotal:</span>
                                    <span className="text-neutral-900">₹{subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>GST (5%):</span>
                                    <span className="text-neutral-900">₹{gstAmount.toFixed(2)}</span>
                                </div>
                            </div>

                            {/* Total Price */}
                            <div className="flex justify-between items-center">
                                <span className="text-base font-bold text-neutral-900 uppercase">Total Amount:</span>
                                <span className="text-2xl font-black text-neutral-900">₹{totalAmount.toFixed(2)}</span>
                            </div>

                            {/* Trust Indicator */}
                            <div className="mt-8 flex items-center justify-center text-xs text-green-700 bg-green-50/50 border border-green-200/50 rounded-xl py-3.5 font-bold uppercase tracking-wider">
                                <svg className="w-4 h-4 mr-1.5 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path></svg>
                                Verified SSL Secure Checkout
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </ThiyaLayout>
    );
}
