import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';
import { useRouter } from 'next/router';
import Head from 'next/head';

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

export default function ThiyaLayout({ children, title, description }) {
    const { cart, cartCount, cartTotal, updateQuantity, removeFromCart, isCartOpen, setIsCartOpen } = useCart();
    const router = useRouter();

    return (
        <div className="min-h-screen bg-neutral-50 flex flex-col font-sans text-neutral-900">
            <Head>
                <title>{title ? `${title} | Thiya Fashions` : 'Thiya Fashions - Premium Trendsetting Collections'}</title>
                <meta name="description" content={description || "Wholesale & retail premium clothing direct from manufacturers. Follow us on Instagram @thiya_fashions_."} />
                <meta name="keywords" content="Thiya Fashions, premium clothing, sarees, dress material, wholesale fashion, manufacturing dress, online shopping" />
                <meta property="og:title" content={title ? `${title} | Thiya Fashions` : 'Thiya Fashions - Premium Trendsetting Collections'} />
                <meta property="og:description" content={description || "Wholesale & retail premium clothing direct from manufacturers."} />
                <meta property="og:image" content="/images/thiya_logo.png" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/images/thiya_logo.png" type="image/png" />
            </Head>
            {/* Header */}
            <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-neutral-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        <div className="flex items-center">
                            <Link href="/" className="flex items-center gap-3 group">
                                <img src="/images/thiya_logo.png" alt="Thiya Fashions Logo" className="h-12 w-12 object-cover rounded-full shadow-md border-2 border-pink-500/20 group-hover:scale-105 transition-transform duration-200" />
                                <span className="text-2xl font-black tracking-tighter text-black uppercase">
                                    Thiya<span className="text-pink-600">Fashions</span>
                                </span>
                            </Link>
                        </div>
                        <nav className="hidden md:flex space-x-8">
                            <Link href="/" className="text-neutral-600 hover:text-black transition-colors font-medium">Home</Link>
                            <Link href="/products" className="text-neutral-600 hover:text-black transition-colors font-medium">Shop</Link>
                            <Link href="/about" className="text-neutral-600 hover:text-black transition-colors font-medium">About Us</Link>
                            <Link href="/contact" className="text-neutral-600 hover:text-black transition-colors font-medium">Contact</Link>
                        </nav>
                        
                        <div className="flex items-center gap-4">
                            {/* Shopping Cart Trigger */}
                            <button 
                                onClick={() => setIsCartOpen(true)}
                                className="relative text-neutral-700 hover:text-pink-600 transition-colors p-2 focus:outline-none flex items-center justify-center rounded-full hover:bg-neutral-100/80"
                                aria-label="Open Cart"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                                {cartCount > 0 && (
                                    <span className="absolute top-1 right-1 bg-pink-600 text-white text-[9px] font-bold rounded-full w-4.5 h-4.5 flex items-center justify-center border border-white">
                                        {cartCount}
                                    </span>
                                )}
                            </button>
                            
                            <div className="md:hidden">
                                <Link href="/" className="flex items-center">
                                    <img src="/images/thiya_logo.png" alt="Thiya Fashions Logo" className="h-10 w-10 object-cover rounded-full shadow-md" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-grow">
                {children}
            </main>

            {/* Footer */}
            <footer className="bg-black text-white mt-auto">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <img src="/images/thiya_logo.png" alt="Thiya Fashions Logo" className="h-10 w-10 object-cover rounded-full bg-white p-0.5" />
                                <h3 className="text-2xl font-black tracking-tighter uppercase">Thiya Fashions</h3>
                            </div>
                            <p className="text-neutral-400">Wholesale, Retail & Manufacture.<br/>Premium fashion for everyone.</p>
                        </div>
                        <div>
                            <h4 className="text-lg font-bold mb-4">Quick Links</h4>
                            <ul className="space-y-2 text-neutral-400">
                                <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
                                <li><Link href="/products" className="hover:text-white transition-colors">Shop</Link></li>
                                <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
                                <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-lg font-bold mb-4">Contact</h4>
                            <p className="text-neutral-400">Email: info@thiyafashions.com</p>
                            <p className="text-neutral-400">Phone: +91 93613 56409</p>
                            
                            <h4 className="text-sm font-bold uppercase tracking-wider mt-6 mb-3 text-neutral-400">Follow Us</h4>
                            <div className="flex gap-4">
                                <a 
                                    href="https://www.instagram.com/invites/contact/?utm_source=ig_contact_invite&utm_medium=copy_link&utm_content=g5r9uaj" 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="text-neutral-400 hover:text-pink-500 transition-colors"
                                    title="Instagram"
                                >
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                                    </svg>
                                </a>
                                <a 
                                    href="https://www.youtube.com/@thiya_fashion" 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="text-neutral-400 hover:text-[#FF0000] transition-colors"
                                    title="YouTube"
                                >
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M23.498 6.163a3.003 3.003 0 00-2.11-2.11C19.518 3.545 12 3.545 12 3.545s-7.518 0-9.388.508a3.003 3.003 0 00-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 002.11 2.11c1.87.508 9.388.508 9.388.508s7.518 0 9.388-.508a3.003 3.003 0 002.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                                    </svg>
                                </a>
                                <a 
                                    href="https://www.facebook.com" 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="text-neutral-400 hover:text-blue-600 transition-colors"
                                    title="Facebook"
                                >
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className="mt-12 pt-8 border-t border-neutral-800 text-center text-neutral-500">
                        <p>&copy; {new Date().getFullYear()} Thiya Fashions. All rights reserved.</p>
                    </div>
                </div>
            </footer>

            {/* Floating WhatsApp Widget */}
            <a 
                href="https://wa.me/919361356409?text=Hello%20Thiya%20Fashions!%20I%20have%20a%20query%20about%20your%20products."
                target="_blank"
                rel="noopener noreferrer"
                className="fixed bottom-6 right-6 z-[90] flex items-center justify-center bg-[#25D366] hover:bg-[#20ba5a] text-white p-4 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 group"
                aria-label="Chat on WhatsApp"
            >
                <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-30 group-hover:animate-ping"></span>
                <svg className="w-8 h-8 relative z-10" fill="currentColor" viewBox="0 0 448 512">
                    <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
                </svg>
            </a>

            {/* Sliding Cart Drawer */}
            {isCartOpen && (
                <div className="fixed inset-0 z-[100] overflow-hidden">
                    <div 
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
                        onClick={() => setIsCartOpen(false)}
                    />
                    
                    <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                        <div className="pointer-events-auto w-screen max-w-md transform transition-transform duration-300 ease-in-out bg-white shadow-2xl flex flex-col h-full border-l border-neutral-200">
                            {/* Drawer Header */}
                            <div className="px-6 py-6 border-b border-neutral-200 flex justify-between items-center bg-neutral-50">
                                <h2 className="text-lg font-black tracking-tight text-neutral-900 uppercase flex items-center gap-2">
                                    <svg className="w-5 h-5 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                    </svg>
                                    Shopping Cart ({cartCount})
                                </h2>
                                <button 
                                    onClick={() => setIsCartOpen(false)} 
                                    className="text-neutral-400 hover:text-black transition-colors rounded-full p-1.5 hover:bg-neutral-200"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            
                            {/* Drawer Body - Scrollable Items */}
                            <div className="flex-1 overflow-y-auto px-6 py-6 divide-y divide-neutral-100">
                                {cart.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-full py-12 text-center">
                                        <div className="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center text-neutral-400 mb-4">
                                            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                            </svg>
                                        </div>
                                        <p className="text-neutral-500 font-bold uppercase tracking-wider text-sm mb-4">Your cart is empty</p>
                                        <button 
                                            onClick={() => {
                                                setIsCartOpen(false);
                                                router.push('/products');
                                            }}
                                            className="px-6 py-2.5 bg-black hover:bg-neutral-800 text-white rounded font-bold uppercase tracking-wider text-xs transition-colors"
                                        >
                                            Continue Shopping
                                        </button>
                                    </div>
                                ) : (
                                    cart.map((item) => (
                                        <div key={item.id} className="py-4 flex gap-4">
                                            <div className="w-20 h-20 bg-neutral-50 rounded-lg overflow-hidden border border-neutral-200 flex-shrink-0">
                                                <img src={formatImageUrl(item.image)} alt={item.title} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex-1 flex flex-col justify-between min-w-0">
                                                <div>
                                                    <h3 className="text-sm font-bold text-neutral-900 truncate" title={item.title}>
                                                        {item.title}
                                                    </h3>
                                                    <div className="flex flex-wrap gap-x-2.5 text-[11px] text-neutral-500 font-semibold mt-0.5">
                                                        {item.size && <span>Size: <span className="text-neutral-800">{item.size}</span></span>}
                                                        {item.color && <span>Color: <span className="text-neutral-800">{item.color}</span></span>}
                                                    </div>
                                                </div>
                                                <div className="flex justify-between items-center mt-2">
                                                    {/* Qty controller */}
                                                    <div className="flex items-center border border-neutral-200 rounded">
                                                        <button 
                                                            onClick={() => updateQuantity(item.productId, item.size, item.color, item.quantity - 1)}
                                                            className="px-2 py-0.5 text-neutral-500 hover:text-black text-xs font-bold"
                                                        >-</button>
                                                        <span className="px-2 text-xs font-semibold text-neutral-800 select-none">{item.quantity}</span>
                                                        <button 
                                                            onClick={() => updateQuantity(item.productId, item.size, item.color, item.quantity + 1)}
                                                            className="px-2 py-0.5 text-neutral-500 hover:text-black text-xs font-bold"
                                                        >+</button>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-sm font-black text-neutral-900">₹{(item.price * item.quantity).toFixed(2)}</span>
                                                        <button 
                                                            onClick={() => removeFromCart(item.productId, item.size, item.color)}
                                                            className="text-neutral-400 hover:text-red-600 transition-colors"
                                                            title="Remove item"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                            
                            {/* Drawer Footer */}
                            {cart.length > 0 && (
                                <div className="border-t border-neutral-200 px-6 py-6 bg-neutral-50 space-y-4">
                                    <div className="flex justify-between text-base font-bold text-neutral-900">
                                        <span>Subtotal</span>
                                        <span className="text-lg font-black">₹{cartTotal.toFixed(2)}</span>
                                    </div>
                                    <p className="text-[11px] text-neutral-500 font-medium">Shipping & 5% GST will be calculated at checkout.</p>
                                    <div className="grid grid-cols-1 gap-2">
                                        <button 
                                            onClick={() => {
                                                setIsCartOpen(false);
                                                router.push('/checkout');
                                            }}
                                            className="w-full py-3 bg-pink-600 hover:bg-pink-700 text-white rounded font-bold uppercase tracking-wider text-sm transition-colors text-center shadow-md shadow-pink-500/10"
                                        >
                                            Checkout Now
                                        </button>
                                        <button 
                                            onClick={() => setIsCartOpen(false)}
                                            className="w-full py-2 bg-transparent text-neutral-600 hover:text-black font-bold uppercase tracking-wider text-xs transition-colors text-center"
                                        >
                                            Keep Shopping
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
