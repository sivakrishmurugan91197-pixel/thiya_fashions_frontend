import Link from 'next/link';

export default function ThiyaLayout({ children }) {
    return (
        <div className="min-h-screen bg-neutral-50 flex flex-col font-sans text-neutral-900">
            {/* Header */}
            <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-neutral-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        <div className="flex items-center">
                            <Link href="/products" className="text-3xl font-black tracking-tighter text-black uppercase">
                                Thiya<span className="text-blue-600">Fashions</span>
                            </Link>
                        </div>
                        <nav className="hidden md:flex space-x-8">
                            <Link href="/products" className="text-neutral-600 hover:text-black transition-colors font-medium">Shop</Link>
                            <Link href="/about" className="text-neutral-600 hover:text-black transition-colors font-medium">About Us</Link>
                            <Link href="/contact" className="text-neutral-600 hover:text-black transition-colors font-medium">Contact</Link>
                        </nav>
                        <div className="md:hidden">
                            {/* Mobile menu button could go here */}
                            <span className="text-xl font-bold">Thiya</span>
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
                            <h3 className="text-2xl font-black tracking-tighter uppercase mb-4">Thiya Fashions</h3>
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
                            <p className="text-neutral-400">Phone: +91 12345 67890</p>
                        </div>
                    </div>
                    <div className="mt-12 pt-8 border-t border-neutral-800 text-center text-neutral-500">
                        <p>&copy; {new Date().getFullYear()} Thiya Fashions. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
