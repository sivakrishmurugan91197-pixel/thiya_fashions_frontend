import AdminLayout from '@/components/AdminLayout';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export default function AdminTransactions() {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTx, setSelectedTx] = useState(null);
    const router = useRouter();

    const fetchTransactions = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/thiya/transactions`);
            if (response.data.is_success) {
                setTransactions(response.data.data);
            }
        } catch (error) {
            console.error("Error fetching transactions:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const auth = localStorage.getItem('thiya_admin_auth');
        if (!auth) {
            router.push('/admin/login');
        } else {
            fetchTransactions();
        }
    }, []);

    // Filters
    const filteredTransactions = transactions.filter(tx => {
        const term = searchTerm.toLowerCase();
        return (
            tx.customer_name?.toLowerCase().includes(term) ||
            tx.customer_email?.toLowerCase().includes(term) ||
            tx.phone?.toLowerCase().includes(term) ||
            tx.razorpay_order_id?.toLowerCase().includes(term) ||
            tx.razorpay_payment_id?.toLowerCase().includes(term)
        );
    });

    // Calculations
    const completedTx = transactions.filter(tx => tx.status === 'completed');
    const totalRevenue = completedTx.reduce((sum, tx) => sum + parseFloat(tx.amount || 0), 0);
    const successRate = transactions.length > 0 ? Math.round((completedTx.length / transactions.length) * 100) : 0;

    return (
        <AdminLayout title="Transaction Report">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6 flex items-center justify-between">
                    <div>
                        <p className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-1">Total Settled Volume</p>
                        <p className="text-3xl font-black text-neutral-900">₹{totalRevenue.toFixed(2)}</p>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6 flex items-center justify-between">
                    <div>
                        <p className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-1">Total Payment Attempts</p>
                        <p className="text-3xl font-black text-neutral-900">{transactions.length}</p>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path></svg>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6 flex items-center justify-between">
                    <div>
                        <p className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-1">Success Rate</p>
                        <p className="text-3xl font-black text-neutral-900">{successRate}%</p>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    </div>
                </div>
            </div>

            {/* Transactions Section */}
            <div className="bg-white p-4 sm:p-8 rounded-xl shadow-sm border border-neutral-200">
                <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-6">
                    <h2 className="text-lg font-black tracking-tight text-neutral-900 uppercase">Gateway Transactions</h2>
                    
                    {/* Search bar */}
                    <div className="w-full sm:w-80 relative">
                        <input
                            type="text"
                            placeholder="Filter by name, phone, or order ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full rounded-lg border-0 py-2.5 pl-10 pr-4 text-neutral-900 ring-1 ring-inset ring-neutral-300 placeholder:text-neutral-400 text-sm focus:ring-2 focus:ring-blue-600 bg-neutral-50"
                        />
                        <svg className="absolute left-3 top-3 h-4 w-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                        </svg>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center py-12">
                        <div className="w-8 h-8 border-t-2 border-black border-solid rounded-full animate-spin"></div>
                    </div>
                ) : filteredTransactions.length === 0 ? (
                    <p className="text-neutral-500 text-center py-12 font-medium">No transactions found matching your criteria.</p>
                ) : (
                    <div className="overflow-x-auto ring-1 ring-neutral-200 rounded-lg">
                        <table className="min-w-full divide-y divide-neutral-200">
                            <thead className="bg-neutral-50">
                                <tr>
                                    <th scope="col" className="py-3.5 pl-6 pr-3 text-left text-xs font-bold text-neutral-500 uppercase tracking-wider">Customer</th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-xs font-bold text-neutral-500 uppercase tracking-wider">Amount</th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-xs font-bold text-neutral-500 uppercase tracking-wider">Status</th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-xs font-bold text-neutral-500 uppercase tracking-wider">Razorpay Order ID</th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-xs font-bold text-neutral-500 uppercase tracking-wider">Payment ID</th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-xs font-bold text-neutral-500 uppercase tracking-wider">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-200 bg-white">
                                {filteredTransactions.map((tx) => (
                                    <tr 
                                        key={tx.id} 
                                        onClick={() => setSelectedTx(tx)}
                                        className="hover:bg-neutral-50 cursor-pointer transition-colors"
                                    >
                                        <td className="whitespace-nowrap py-4 pl-6 pr-3">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-neutral-900">{tx.customer_name}</span>
                                                <span className="text-xs text-neutral-500">{tx.customer_email}</span>
                                                <span className="text-xs text-neutral-500">{tx.phone}</span>
                                            </div>
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm font-black text-neutral-900">
                                            ₹{parseFloat(tx.amount || 0).toFixed(2)}
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-xs font-bold">
                                            <span className={`inline-flex rounded-full px-3 py-1 uppercase tracking-wide text-[10px] font-black leading-5 ${
                                                tx.status === 'completed'
                                                    ? 'bg-green-100 text-green-800'
                                                    : tx.status === 'failed'
                                                    ? 'bg-red-100 text-red-800'
                                                    : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                                {tx.status}
                                            </span>
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm font-semibold text-neutral-700 max-w-[150px] truncate">
                                            {tx.razorpay_order_id}
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm font-semibold text-neutral-500 max-w-[150px] truncate">
                                            {tx.razorpay_payment_id || 'N/A'}
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-xs font-semibold text-neutral-400">
                                            {new Date(tx.createdAt).toLocaleString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Transaction Details Modal */}
            {selectedTx && (
                <div className="fixed inset-0 bg-neutral-900/60 backdrop-blur-sm flex justify-center items-center z-50 p-4 transition-opacity">
                    <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden border border-neutral-200">
                        {/* Header */}
                        <div className="bg-neutral-950 text-white px-8 py-5 flex items-center justify-between border-b border-neutral-800">
                            <div>
                                <h3 className="text-lg font-black uppercase tracking-tight">Transaction details</h3>
                                <p className="text-xs text-neutral-400 mt-1 font-mono">ID: {selectedTx.id} • {new Date(selectedTx.createdAt).toLocaleString()}</p>
                            </div>
                            <button 
                                onClick={() => setSelectedTx(null)}
                                className="text-neutral-400 hover:text-white transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                </svg>
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-8 max-h-[70vh] overflow-y-auto">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <h4 className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-4 border-b border-neutral-100 pb-2">Customer Info</h4>
                                    <div className="space-y-3 text-sm">
                                        <div className="flex justify-between"><span className="text-neutral-500">Name:</span> <span className="font-medium text-neutral-900">{selectedTx.customer_name}</span></div>
                                        <div className="flex justify-between"><span className="text-neutral-500">Email:</span> <span className="font-medium text-neutral-900">{selectedTx.customer_email}</span></div>
                                        <div className="flex justify-between"><span className="text-neutral-500">Phone:</span> <span className="font-medium text-neutral-900">{selectedTx.phone}</span></div>
                                    </div>
                                </div>
                                
                                <div>
                                    <h4 className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-4 border-b border-neutral-100 pb-2">Status & Settled Volume</h4>
                                    <div className="space-y-3 text-sm">
                                        <div className="flex justify-between"><span className="text-neutral-500">Status:</span> 
                                            <span className={`font-black uppercase text-xs rounded-full px-2 py-0.5 ${
                                                selectedTx.status === 'completed'
                                                    ? 'bg-green-100 text-green-800'
                                                    : selectedTx.status === 'failed'
                                                    ? 'bg-red-100 text-red-800'
                                                    : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                                {selectedTx.status}
                                            </span>
                                        </div>
                                        <div className="flex justify-between"><span className="text-neutral-500">Total Volume:</span> <span className="font-black text-neutral-950">₹{parseFloat(selectedTx.amount || 0).toFixed(2)}</span></div>
                                    </div>
                                </div>
                            </div>

                            <h4 className="text-xs font-bold text-neutral-500 uppercase tracking-widest mt-8 mb-4 border-b border-neutral-100 pb-2">Razorpay Details</h4>
                            <div className="space-y-3 text-sm font-medium">
                                <div className="flex flex-col sm:flex-row justify-between gap-1">
                                    <span className="text-neutral-500">Order ID:</span> 
                                    <span className="font-mono text-xs text-neutral-900 bg-neutral-50 border border-neutral-200 px-2 py-0.5 rounded break-all">{selectedTx.razorpay_order_id}</span>
                                </div>
                                <div className="flex flex-col sm:flex-row justify-between gap-1">
                                    <span className="text-neutral-500">Payment ID:</span> 
                                    <span className="font-mono text-xs text-neutral-900 bg-neutral-50 border border-neutral-200 px-2 py-0.5 rounded break-all">{selectedTx.razorpay_payment_id || 'N/A'}</span>
                                </div>
                                {selectedTx.razorpay_signature && (
                                    <div className="flex flex-col justify-between gap-1">
                                        <span className="text-neutral-500">Signature:</span> 
                                        <span className="font-mono text-[10px] leading-relaxed text-neutral-900 bg-neutral-50 border border-neutral-200 p-2.5 rounded break-all mt-1">{selectedTx.razorpay_signature}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="bg-neutral-50 px-8 py-4 flex justify-end border-t border-neutral-200">
                            <button
                                onClick={() => setSelectedTx(null)}
                                className="bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs px-6 py-2.5 rounded transition-all uppercase tracking-wide"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
