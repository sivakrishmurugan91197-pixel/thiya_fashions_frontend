import { useState } from 'react';
import { useRouter } from 'next/router';

export default function AdminLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleLogin = (e) => {
        e.preventDefault();
        if (email === 'admin@gmail.com' && password === 'password') {
            // Simple client-side auth for demo
            localStorage.setItem('thiya_admin_auth', 'true');
            router.push('/admin/products');
        } else {
            setError('Invalid email or password');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-neutral-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-6 sm:p-10 rounded-xl shadow-lg border border-neutral-200">
                <div className="flex flex-col items-center">
                    <img 
                        src="/images/thiya_logo.png" 
                        alt="Thiya Fashions Logo" 
                        className="h-20 w-20 object-cover rounded-full shadow-md border-2 border-pink-500/20 mb-4" 
                    />
                    <h2 className="mt-2 text-center text-3xl font-black tracking-tight text-gray-900 uppercase">
                        Thiya<span className="text-pink-600">Fashions</span>
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600 font-bold tracking-widest uppercase">
                        Admin Portal
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleLogin}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <label htmlFor="email-address" className="sr-only">Email address</label>
                            <input
                                id="email-address"
                                name="email"
                                type="email"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-black focus:border-black focus:z-10 sm:text-sm"
                                placeholder="Email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">Password</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-black focus:border-black focus:z-10 sm:text-sm"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="text-red-500 text-sm text-center font-bold">
                            {error}
                        </div>
                    )}

                    <div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-md text-white bg-black hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-colors uppercase tracking-wider"
                        >
                            Sign in
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
