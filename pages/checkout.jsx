import ThiyaLayout from '@/components/ThiyaLayout';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { useCart } from '@/contexts/CartContext';
import LogoLoader from '@/components/LogoLoader';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

const formatImageUrl = (url) => {
    if (!url) return 'https://via.placeholder.com/150?text=Thiya';
    if (url.startsWith('http') && url.includes('localhost:3000')) {
        return url.replace('http://localhost:3000', API_URL);
    }
    if (url.startsWith('/uploads')) {
        return `${API_URL}${url}`;
    }
    return url;
};

export default function CheckoutPage() {
    const router = useRouter();
    const { productId, quantity: qtyParam, size, color } = router.query;
    const { cart, clearCart } = useCart();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [purchasing, setPurchasing] = useState(false);
    const [quantity, setQuantity] = useState(1);
    
    // Multi-item cart states
    const [checkoutItems, setCheckoutItems] = useState([]);
    
    // Terms & Conditions States
    const [agreeTerms, setAgreeTerms] = useState(false);
    const [showTermsModal, setShowTermsModal] = useState(false);

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
        if (productId) {
            const fetchProduct = async () => {
                try {
                    const response = await axios.get(`${API_URL}/api/thiya/products/${productId}`);
                    if (response.data.is_success) {
                        const prod = response.data.data;
                        setProduct(prod);
                        const unitPrice = parseFloat(prod.price) - parseFloat(prod.discount_amount || 0);
                        const imgUrl = prod.images?.find(img => img.color === color)?.url || prod.images?.[0]?.url || '';
                        
                        setCheckoutItems([{
                            productId: prod.id,
                            title: prod.title,
                            price: unitPrice,
                            quantity: parseInt(qtyParam) || 1,
                            size: size || 'Standard',
                            color: color || 'Default',
                            image: imgUrl
                        }]);
                    }
                } catch (error) {
                    console.error("Error fetching product details:", error);
                } finally {
                    setLoading(false);
                }
            };
            fetchProduct();
        } else {
            // Load cart items
            if (cart && cart.length > 0) {
                setCheckoutItems(cart);
            } else {
                setCheckoutItems([]);
            }
            setLoading(false);
        }
    }, [productId, qtyParam, size, color, cart]);

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
        if (!agreeTerms) {
            alert("Please agree to the Terms & Conditions to proceed.");
            return;
        }
        
        setPurchasing(true);
        const res = await initializeRazorpay();

        if (!res) {
            alert("Razorpay SDK Failed to load");
            setPurchasing(false);
            return;
        }

        try {
            // Build payload supporting both single product direct and multiple items
            const orderPayload = {
                ...checkoutForm,
                items: checkoutItems.map(item => ({
                    product_id: item.productId,
                    quantity: item.quantity,
                    size: item.size || 'Standard',
                    color: item.color || 'Default'
                })),
                product_id: checkoutItems[0].productId,
                quantity: checkoutItems[0].quantity,
                size: checkoutItems[0].size || 'Standard',
                color: checkoutItems[0].color || 'Default'
            };

            const orderResponse = await axios.post(`${API_URL}/api/thiya/orders`, orderPayload);

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
                    if (!productId) {
                        clearCart();
                    }
                    const description = checkoutItems.map(item => `${item.title} (${item.quantity})`).join(', ');
                    router.push(`/order-success?transactionId=${mockPaymentId}&title=${encodeURIComponent(description)}&quantity=${checkoutItems.reduce((s, i) => s + i.quantity, 0)}&amount=${totalAmount}`);
                }
                return;
            }

            const options = {
                key: key_id,
                amount: amount.toString(),
                currency: currency,
                name: "Thiya Fashions",
                description: `Purchase of ${checkoutItems.length} item(s)`,
                image: checkoutItems[0].image || "https://via.placeholder.com/150?text=Thiya",
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
                            if (!productId) {
                                clearCart();
                            }
                            const description = checkoutItems.map(item => `${item.title} (${item.quantity})`).join(', ');
                            router.push(`/order-success?transactionId=${response.razorpay_payment_id}&title=${encodeURIComponent(description)}&quantity=${checkoutItems.reduce((s, i) => s + i.quantity, 0)}&amount=${totalAmount}`);
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
            <ThiyaLayout title="Secure Checkout" description="Complete your Thiya Fashions checkout details and pay securely using Razorpay.">
                <div className="flex justify-center items-center min-h-[60vh] bg-white">
                    <LogoLoader text="Loading Checkout Details..." />
                </div>
            </ThiyaLayout>
        );
    }

    if (checkoutItems.length === 0) {
        return (
            <ThiyaLayout title="Secure Checkout" description="Complete your Thiya Fashions checkout details and pay securely using Razorpay.">
                <div className="text-center py-32 bg-white min-h-[60vh]">
                    <h2 className="text-xl font-bold text-neutral-800">Checkout parameters are invalid or your cart is empty</h2>
                    <button onClick={() => router.push('/products')} className="mt-4 py-2 px-6 bg-pink-600 text-white rounded font-bold uppercase tracking-wider text-sm hover:bg-pink-700 transition-colors">
                        Back to Shop
                    </button>
                </div>
            </ThiyaLayout>
        );
    }

    const subtotal = checkoutItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const gstAmount = subtotal * 0.05;
    const totalAmount = subtotal + gstAmount;

    return (
        <ThiyaLayout title="Secure Checkout" description="Complete your Thiya Fashions checkout details and pay securely using Razorpay.">
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

                                {/* Terms & Conditions Checkbox */}
                                <div className="border-t border-neutral-100 pt-6">
                                    <div className="flex items-start">
                                        <div className="flex h-5 items-center">
                                            <input
                                                id="terms"
                                                name="terms"
                                                type="checkbox"
                                                required
                                                checked={agreeTerms}
                                                onChange={(e) => setAgreeTerms(e.target.checked)}
                                                className="h-4 w-4 rounded border-neutral-300 text-pink-600 focus:ring-pink-500 cursor-pointer"
                                            />
                                        </div>
                                        <div className="ml-3 text-sm">
                                            <label htmlFor="terms" className="font-semibold text-neutral-700 select-none">
                                                I confirm and agree to the{' '}
                                                <button
                                                    type="button"
                                                    onClick={() => setShowTermsModal(true)}
                                                    className="text-pink-600 hover:text-pink-700 underline font-bold focus:outline-none"
                                                >
                                                    Terms & Conditions
                                                </button>
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4">
                                    <button
                                        type="submit"
                                        disabled={purchasing || !agreeTerms}
                                        className="w-full py-4 bg-pink-600 hover:bg-pink-700 text-white rounded-xl text-sm font-bold uppercase tracking-wider transition-colors disabled:bg-neutral-300 disabled:text-neutral-500 shadow-lg shadow-pink-500/20 active:scale-[0.98] transform duration-700 flex justify-center items-center"
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

                            {/* Product List */}
                            <div className="divide-y divide-neutral-100 max-h-[40vh] overflow-y-auto pr-2 mb-5">
                                {checkoutItems.map((item) => (
                                    <div key={`${item.productId}-${item.size}-${item.color}`} className="flex gap-4 py-4 first:pt-0 last:pb-0">
                                        <div className="w-16 h-16 bg-neutral-100 rounded-lg overflow-hidden border border-neutral-200 flex-shrink-0">
                                            <img 
                                                src={formatImageUrl(item.image)} 
                                                alt={item.title} 
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <h4 className="text-sm font-bold text-neutral-900 truncate" title={item.title}>
                                                {item.title}
                                            </h4>
                                            <div className="flex flex-wrap gap-x-3 text-xs text-neutral-500 mt-1 font-semibold">
                                                {item.size && (
                                                    <span>Size: <span className="text-neutral-900">{item.size}</span></span>
                                                )}
                                                {item.color && (
                                                    <span>Color: <span className="text-neutral-900">{item.color}</span></span>
                                                )}
                                                <span>Qty: <span className="text-neutral-900">{item.quantity}</span></span>
                                            </div>
                                            <div className="text-xs font-bold text-neutral-900 mt-1">₹{item.price.toFixed(2)} each</div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Calculation Details */}
                            <div className="space-y-3.5 text-sm text-neutral-600 border-b border-neutral-100 pb-5 mb-5 font-semibold">
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

            {/* Terms & Conditions Modal */}
            {showTermsModal && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center bg-neutral-900/60 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-neutral-200 flex flex-col max-h-[85vh]">
                        {/* Header */}
                        <div className="bg-neutral-50 px-6 py-4 border-b border-neutral-200 flex justify-between items-center flex-shrink-0">
                            <h3 className="text-lg font-black text-neutral-900 uppercase tracking-tight">Terms & Conditions</h3>
                            <button 
                                onClick={() => setShowTermsModal(false)} 
                                className="text-neutral-400 hover:text-black transition-colors rounded-full p-1 hover:bg-neutral-200"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        {/* Body */}
                        <div className="p-6 overflow-y-auto bg-white text-sm text-neutral-600 space-y-4 leading-relaxed font-medium">
                            <p className="text-neutral-900 font-bold text-base">Welcome to Thiya Fashions!</p>
                            
                            <div className="bg-pink-50 border border-pink-100 rounded-xl p-4 text-pink-850 text-xs leading-normal">
                                Hai... This is thiya from ThiyaFashions. We sale an exclusive trending collection. We provide wholesale price and direct dealing with own manufacturers. Kindly subscribe for new exclusive collection 😍😍. Follow an insta <a href="https://www.instagram.com/invites/contact/?utm_source=ig_contact_invite&utm_medium=copy_link&utm_content=g5r9uaj" target="_blank" rel="noopener noreferrer" className="underline font-bold text-pink-700">@thiya_fashions_</a>.
                            </div>

                            <div className="space-y-4 divide-y divide-neutral-100">
                                <div className="pt-2">
                                    <p className="font-bold text-neutral-800 mb-1">WhatsApp Bookings Only</p>
                                    <p className="text-xs">Order through only for WhatsApp: <span className="font-bold text-neutral-950">93613 56409</span>.</p>
                                </div>
                                <div className="pt-3">
                                    <p className="font-bold text-neutral-850 mb-1 text-red-600">Cancellation & Return Policy</p>
                                    <p className="text-xs text-red-650 font-bold">No return / no exchange / No cancel for after booking.</p>
                                </div>
                                <div className="pt-3">
                                    <p className="font-bold text-neutral-850 mb-1">Delivery Time Period</p>
                                    <p className="text-xs">Minimum delivery period is 7-15 working days.</p>
                                    <p className="text-[11px] text-neutral-450 mt-1">Note: some time delivery period delay for weather conditions and delivery partner side. so delay reasons not claims for any issues.</p>
                                </div>
                                <div className="pt-3">
                                    <p className="font-bold text-neutral-850 mb-1">Our Pricing</p>
                                    <p className="text-xs">Don't compare other prices. bcoz our Margin very low.</p>
                                </div>
                                <div className="pt-3">
                                    <p className="font-bold text-neutral-850 mb-1">Delivery Partners</p>
                                    <p className="text-xs">Our delivery service also Meesho / Amazon / Flipkart / Resellme.</p>
                                </div>
                                <div className="pt-3">
                                    <p className="font-bold text-neutral-850 mb-1 text-red-650">Product Claims & Opening Video</p>
                                    <p className="text-xs text-red-650 font-bold">For product related issues Complete Opening video Must. without video can't do more anything. its not our response.</p>
                                    <p className="text-[11px] text-neutral-500 mt-1">thread removals / color variations/ designs change not applicable for any claims.</p>
                                </div>
                                <div className="pt-3">
                                    <p className="font-bold text-neutral-850 mb-1">Refund Process</p>
                                    <p className="text-xs">refund transaction time duration 10-15 working days must.</p>
                                </div>
                            </div>
                        </div>
                        {/* Footer */}
                        <div className="bg-neutral-50 px-6 py-4 border-t border-neutral-200 flex justify-end gap-2 flex-shrink-0">
                            <button
                                onClick={() => {
                                    setAgreeTerms(true);
                                    setShowTermsModal(false);
                                }}
                                className="px-5 py-2.5 bg-pink-600 hover:bg-pink-700 text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-colors"
                            >
                                I Agree
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </ThiyaLayout>
    );
}
