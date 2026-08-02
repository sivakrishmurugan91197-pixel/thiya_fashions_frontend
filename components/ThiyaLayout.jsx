import Link from 'next/link';

export default function ThiyaLayout({ children }) {
    return (
        <div className="min-h-screen bg-neutral-50 flex flex-col font-sans text-neutral-900">
            {/* Header */}
            <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-neutral-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        <div className="flex items-center">
                            <Link href="/products" className="flex items-center gap-3 group">
                                <img src="/images/thiya_logo.png" alt="Thiya Fashions Logo" className="h-12 w-12 object-cover rounded-full shadow-md border-2 border-pink-500/20 group-hover:scale-105 transition-transform duration-200" />
                                <span className="text-2xl font-black tracking-tighter text-black uppercase">
                                    Thiya<span className="text-pink-600">Fashions</span>
                                </span>
                            </Link>
                        </div>
                        <nav className="hidden md:flex space-x-8">
                            <Link href="/products" className="text-neutral-600 hover:text-black transition-colors font-medium">Shop</Link>
                            <Link href="/about" className="text-neutral-600 hover:text-black transition-colors font-medium">About Us</Link>
                            <Link href="/contact" className="text-neutral-600 hover:text-black transition-colors font-medium">Contact</Link>
                        </nav>
                        <div className="md:hidden">
                            <Link href="/products" className="flex items-center">
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
                <svg className="w-8 h-8 relative z-10" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.73-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.42 9.864-9.864.002-2.637-1.023-5.116-2.887-6.98C16.584 1.895 14.11 1.87 11.474 1.87c-5.437 0-9.862 4.421-9.865 9.866-.001 1.8.481 3.56 1.393 5.093l-.95 3.473 3.595-.944zm12.511-7.25c-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.569-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.124-.272-.198-.57-.347z"/>
                </svg>
            </a>
        </div>
    );
}
