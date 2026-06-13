import Link from 'next/link';
import { useRouter } from 'next/router';

export default function AdminLayout({ children, title }) {
    const router = useRouter();
    const currentPath = router.pathname;

    const handleLogout = () => {
        localStorage.removeItem('thiya_admin_auth');
        router.push('/admin/login');
    };

    return (
        <div className="flex h-screen bg-neutral-100 font-sans text-neutral-900 overflow-hidden">
            {/* Sidebar */}
            <aside className="w-64 bg-black text-white flex flex-col hidden md:flex flex-shrink-0 shadow-2xl">
                <div className="h-20 flex items-center px-8 border-b border-neutral-800">
                    <Link href="/" className="text-2xl font-black tracking-tighter uppercase">
                        Thiya<span className="text-blue-500">Admin</span>
                    </Link>
                </div>
                
                <div className="px-6 py-8 flex-1">
                    <p className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-6">Menu</p>
                    <nav className="space-y-2">
                        <Link 
                            href="/admin/categories" 
                            className={`flex items-center px-4 py-3 rounded-md transition-all duration-200 group ${currentPath === '/admin/categories' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'text-neutral-400 hover:bg-neutral-900 hover:text-white'}`}
                        >
                            <svg className={`w-5 h-5 mr-3 transition-colors ${currentPath === '/admin/categories' ? 'text-white' : 'text-neutral-500 group-hover:text-white'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                            <span className="font-bold text-sm tracking-wide">Categories</span>
                        </Link>
                        <Link 
                            href="/admin/products" 
                            className={`flex items-center px-4 py-3 rounded-md transition-all duration-200 group ${currentPath === '/admin/products' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'text-neutral-400 hover:bg-neutral-900 hover:text-white'}`}
                        >
                            <svg className={`w-5 h-5 mr-3 transition-colors ${currentPath === '/admin/products' ? 'text-white' : 'text-neutral-500 group-hover:text-white'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
                            <span className="font-bold text-sm tracking-wide">Products</span>
                        </Link>
                        
                        <Link 
                            href="/admin/reports" 
                            className={`flex items-center px-4 py-3 rounded-md transition-all duration-200 group ${currentPath === '/admin/reports' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'text-neutral-400 hover:bg-neutral-900 hover:text-white'}`}
                        >
                            <svg className={`w-5 h-5 mr-3 transition-colors ${currentPath === '/admin/reports' ? 'text-white' : 'text-neutral-500 group-hover:text-white'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                            <span className="font-bold text-sm tracking-wide">Reports</span>
                        </Link>
                    </nav>
                </div>

                <div className="p-6 border-t border-neutral-800">
                    <button 
                        onClick={handleLogout}
                        className="flex w-full items-center px-4 py-3 text-sm font-bold text-neutral-400 hover:text-white hover:bg-neutral-900 rounded-md transition-all group"
                    >
                        <svg className="w-5 h-5 mr-3 text-neutral-500 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main content */}
            <main className="flex-1 flex flex-col h-screen overflow-hidden bg-neutral-50">
                {/* Top header */}
                <header className="h-20 bg-white border-b border-neutral-200 flex items-center justify-between px-8 shadow-sm z-10 flex-shrink-0">
                    <div>
                        <h1 className="text-2xl font-black text-neutral-900 tracking-tight">{title}</h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="hidden sm:flex items-center gap-3">
                            <div className="text-right">
                                <p className="text-sm font-bold text-neutral-900 leading-tight">Admin User</p>
                                <p className="text-xs text-neutral-500 font-medium">admin@gmail.com</p>
                            </div>
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-black border border-blue-200">
                                A
                            </div>
                        </div>
                    </div>
                </header>

                {/* Content area */}
                <div className="flex-1 overflow-auto p-8">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
}
