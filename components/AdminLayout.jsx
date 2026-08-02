import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';

export default function AdminLayout({ children, title }) {
    const router = useRouter();
    const currentPath = router.pathname;
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem('thiya_admin_auth');
        router.push('/admin/login');
    };

    const navItems = [
        {
            href: '/admin/categories',
            label: 'Categories',
            icon: (
                <svg className="w-5 h-5 mr-3 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                </svg>
            )
        },
        {
            href: '/admin/products',
            label: 'Products',
            icon: (
                <svg className="w-5 h-5 mr-3 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                </svg>
            )
        },
        {
            href: '/admin/reports',
            label: 'Reports',
            icon: (
                <svg className="w-5 h-5 mr-3 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
            )
        }
    ];

    const sidebarContent = (
        <>
            <div className="h-20 flex items-center justify-between px-8 border-b border-neutral-800 flex-shrink-0">
                <Link href="/" className="text-2xl font-black tracking-tighter uppercase">
                    Thiya<span className="text-blue-500">Admin</span>
                </Link>
                {/* Mobile sidebar close button */}
                <button 
                    onClick={() => setIsMobileOpen(false)}
                    className="md:hidden text-neutral-400 hover:text-white p-1"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
            </div>
            
            <div className="px-6 py-8 flex-1 overflow-y-auto">
                <p className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-6">Menu</p>
                <nav className="space-y-2">
                    {navItems.map((item) => {
                        const isActive = currentPath === item.href;
                        return (
                            <Link 
                                key={item.href}
                                href={item.href} 
                                onClick={() => setIsMobileOpen(false)}
                                className={`flex items-center px-4 py-3 rounded-md transition-all duration-200 group ${isActive ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'text-neutral-400 hover:bg-neutral-900 hover:text-white'}`}
                            >
                                {item.icon}
                                <span className="font-bold text-sm tracking-wide">{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>
            </div>

            <div className="p-6 border-t border-neutral-800 flex-shrink-0">
                <button 
                    onClick={handleLogout}
                    className="flex w-full items-center px-4 py-3 text-sm font-bold text-neutral-400 hover:text-white hover:bg-neutral-900 rounded-md transition-all group"
                >
                    <svg className="w-5 h-5 mr-3 text-neutral-500 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                    </svg>
                    Logout
                </button>
            </div>
        </>
    );

    return (
        <div className="flex h-screen bg-neutral-100 font-sans text-neutral-900 overflow-hidden relative">
            {/* Desktop Sidebar */}
            <aside className="w-64 bg-black text-white flex flex-col hidden md:flex flex-shrink-0 shadow-2xl">
                {sidebarContent}
            </aside>

            {/* Mobile Sidebar Overlay */}
            {isMobileOpen && (
                <div 
                    className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden transition-opacity duration-300"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}

            {/* Mobile Sidebar Drawer */}
            <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-black text-white flex flex-col md:hidden transform transition-transform duration-300 ease-in-out shadow-2xl ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                {sidebarContent}
            </aside>

            {/* Main content */}
            <main className="flex-1 flex flex-col h-screen overflow-hidden bg-neutral-50 w-full">
                {/* Top header */}
                <header className="h-20 bg-white border-b border-neutral-200 flex items-center justify-between px-4 sm:px-8 shadow-sm z-10 flex-shrink-0">
                    <div className="flex items-center gap-3">
                        {/* Hamburger Button */}
                        <button 
                            onClick={() => setIsMobileOpen(true)}
                            className="md:hidden p-2 -ml-2 text-neutral-600 hover:text-black focus:outline-none"
                            aria-label="Open Sidebar"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                            </svg>
                        </button>
                        <h1 className="text-xl sm:text-2xl font-black text-neutral-900 tracking-tight">{title}</h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-3">
                            <div className="text-right hidden xs:block">
                                <p className="text-sm font-bold text-neutral-900 leading-tight">Admin User</p>
                                <p className="text-xs text-neutral-500 font-medium">admin@gmail.com</p>
                            </div>
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-black border border-blue-200 flex-shrink-0">
                                A
                            </div>
                        </div>
                    </div>
                </header>

                {/* Content area */}
                <div className="flex-1 overflow-auto p-4 sm:p-8">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
}
