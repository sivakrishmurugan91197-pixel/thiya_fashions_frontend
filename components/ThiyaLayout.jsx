import Link from 'next/link';

export default function ThiyaLayout({ children }) {
    return (
        <div className="min-h-screen bg-neutral-50 flex flex-col font-sans text-neutral-900">
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
                        <div className="md:hidden">
                            <Link href="/" className="flex items-center">
                                <img src="/images/thiya_logo.png" alt="Thiya Fashions Logo" className="h-10 w-10 object-cover rounded-full shadow-md" />
                            </Link>
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
                {/* Pulsing ring */}
                <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-30 group-hover:animate-ping"></span>
                
                {/* SVG WhatsApp Icon */}
                <svg className="w-8 h-8 relative z-10" fill="currentColor" viewBox="0 0 448 512">
                    <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
                </svg>
            </a>
        </div>
    );
}
