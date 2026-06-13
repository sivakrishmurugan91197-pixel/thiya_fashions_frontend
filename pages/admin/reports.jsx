import AdminLayout from '@/components/AdminLayout';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

export default function AdminReports() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const router = useRouter();

    const fetchOrders = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/thiya/reports');
            if (response.data.is_success) {
                setOrders(response.data.data);
            }
        } catch (error) {
            console.error("Error fetching reports:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const auth = localStorage.getItem('thiya_admin_auth');
        if (!auth) {
            router.push('/admin/login');
        } else {
            fetchOrders();
        }
    }, []);

    // Calculate totals
    const totalRevenue = orders.reduce((sum, order) => sum + parseFloat(order.amount_paid), 0);
    const completedOrders = orders.filter(o => o.payment_status === 'completed').length;

    return (
        <AdminLayout title="Order Reports">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6 flex items-center justify-between">
                    <div>
                        <p className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-1">Total Revenue</p>
                        <p className="text-3xl font-black text-neutral-900">₹{totalRevenue.toFixed(2)}</p>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6 flex items-center justify-between">
                    <div>
                        <p className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-1">Total Orders</p>
                        <p className="text-3xl font-black text-neutral-900">{orders.length}</p>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6 flex items-center justify-between">
                    <div>
                        <p className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-1">Success Rate</p>
                        <p className="text-3xl font-black text-neutral-900">
                            {orders.length > 0 ? Math.round((completedOrders / orders.length) * 100) : 0}%
                        </p>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    </div>
                </div>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-neutral-200">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-black tracking-tight text-neutral-900 uppercase">Recent Transactions</h2>
                </div>

                {loading ? (
                    <div className="flex justify-center py-12">
                        <div className="w-8 h-8 border-t-2 border-black border-solid rounded-full animate-spin"></div>
                    </div>
                ) : orders.length === 0 ? (
                    <p className="text-neutral-500 text-center py-12 font-medium">No orders found.</p>
                ) : (
                    <div className="overflow-hidden ring-1 ring-neutral-200 rounded-lg">
                        <table className="min-w-full divide-y divide-neutral-200">
                            <thead className="bg-neutral-50">
                                <tr>
                                    <th scope="col" className="py-4 pl-6 pr-3 text-left text-xs font-bold text-neutral-500 uppercase tracking-wider">Customer</th>
                                    <th scope="col" className="px-3 py-4 text-left text-xs font-bold text-neutral-500 uppercase tracking-wider">Address</th>
                                    <th scope="col" className="px-3 py-4 text-left text-xs font-bold text-neutral-500 uppercase tracking-wider">Product</th>
                                    <th scope="col" className="px-3 py-4 text-left text-xs font-bold text-neutral-500 uppercase tracking-wider">Amount</th>
                                    <th scope="col" className="px-3 py-4 text-left text-xs font-bold text-neutral-500 uppercase tracking-wider">Status</th>
                                    <th scope="col" className="px-3 py-4 text-left text-xs font-bold text-neutral-500 uppercase tracking-wider">Payment ID</th>
                                    <th scope="col" className="px-3 py-4 text-right text-xs font-bold text-neutral-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-200 bg-white">
                                {orders.map((order) => (
                                    <tr key={order.id} className="hover:bg-neutral-50 transition-colors">
                                        <td className="whitespace-nowrap py-4 pl-6 pr-3">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-neutral-900">{order.customer_name}</span>
                                                <span className="text-xs text-neutral-500">{order.customer_email}</span>
                                                <span className="text-xs text-neutral-500">{order.phone || 'N/A'}</span>
                                                <span className="text-xs text-neutral-400 mt-1">
                                                    {new Date(order.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-3 py-4 text-xs text-neutral-600 max-w-[200px] truncate">
                                            {order.city ? `${order.door_no}, ${order.street}, ${order.city}, ${order.state} - ${order.pincode}` : 'N/A'}
                                        </td>
                                        <td className="px-3 py-4 text-sm text-neutral-700 font-medium max-w-[200px] truncate">
                                            {order.product?.title || `Product ID: ${order.product_id}`}
                                            <div className="text-xs text-neutral-500 mt-1">Qty: {order.quantity || 1}</div>
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4">
                                            <div className="text-sm font-black text-neutral-900">₹{parseFloat(order.total_amount || order.amount_paid).toFixed(2)}</div>
                                            {(order.gst_amount > 0) && <div className="text-xs text-neutral-400">Incl. ₹{parseFloat(order.gst_amount).toFixed(2)} GST</div>}
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm">
                                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider ${
                                                order.payment_status === 'completed' 
                                                    ? 'bg-green-100 text-green-800' 
                                                    : order.payment_status === 'failed'
                                                    ? 'bg-red-100 text-red-800'
                                                    : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                                {order.payment_status}
                                            </span>
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-xs font-mono text-neutral-500">
                                            {order.payment_id || 'N/A'}
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-right text-sm font-medium">
                                            <button 
                                                onClick={() => setSelectedOrder(order)}
                                                className="text-black bg-neutral-100 hover:bg-neutral-200 px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider transition-colors"
                                            >
                                                View
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Order Details Modal */}
            {selectedOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/60 backdrop-blur-sm p-4 sm:p-0">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden animate-in fade-in zoom-in duration-200 border border-neutral-200 max-h-[90vh] flex flex-col">
                        <div className="bg-neutral-50 px-8 py-6 border-b border-neutral-200 flex justify-between items-center flex-shrink-0">
                            <div>
                                <h3 className="text-xl font-black text-neutral-900 uppercase tracking-tight">Order Details</h3>
                                <p className="text-xs text-neutral-500 mt-1 font-medium">Order ID: {selectedOrder.id} • {new Date(selectedOrder.createdAt).toLocaleString()}</p>
                            </div>
                            <button onClick={() => setSelectedOrder(null)} className="text-neutral-400 hover:text-black transition-colors rounded-full p-1 hover:bg-neutral-200">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </button>
                        </div>
                        <div className="p-8 overflow-y-auto bg-white">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <h4 className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-4 border-b border-neutral-100 pb-2">Customer Info</h4>
                                    <div className="space-y-3 text-sm">
                                        <div className="flex justify-between"><span className="text-neutral-500">Name:</span> <span className="font-medium text-neutral-900">{selectedOrder.customer_name}</span></div>
                                        <div className="flex justify-between"><span className="text-neutral-500">Email:</span> <span className="font-medium text-neutral-900">{selectedOrder.customer_email}</span></div>
                                        <div className="flex justify-between"><span className="text-neutral-500">Phone:</span> <span className="font-medium text-neutral-900">{selectedOrder.phone}</span></div>
                                        {selectedOrder.alt_phone && <div className="flex justify-between"><span className="text-neutral-500">Alt Phone:</span> <span className="font-medium text-neutral-900">{selectedOrder.alt_phone}</span></div>}
                                    </div>
                                    
                                    <h4 className="text-xs font-bold text-neutral-500 uppercase tracking-widest mt-8 mb-4 border-b border-neutral-100 pb-2">Delivery Address</h4>
                                    <div className="text-sm text-neutral-700 leading-relaxed bg-neutral-50 p-4 rounded-lg border border-neutral-100">
                                        <p className="font-bold text-neutral-900 mb-1">{selectedOrder.customer_name}</p>
                                        <p>{selectedOrder.door_no}, {selectedOrder.street}</p>
                                        {selectedOrder.landmark && <p>Landmark: {selectedOrder.landmark}</p>}
                                        <p>{selectedOrder.city}, {selectedOrder.district}</p>
                                        <p>{selectedOrder.state} - <span className="font-bold">{selectedOrder.pincode}</span></p>
                                    </div>
                                </div>
                                
                                <div>
                                    <h4 className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-4 border-b border-neutral-100 pb-2">Product Details</h4>
                                    <div className="flex gap-4 items-center bg-neutral-50 p-4 rounded-lg border border-neutral-100 mb-6">
                                        <div className="h-16 w-16 bg-white rounded border border-neutral-200 overflow-hidden flex-shrink-0">
                                            <img src={selectedOrder.product?.images?.[0]?.url || 'https://via.placeholder.com/64'} className="w-full h-full object-cover" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-neutral-900 text-sm line-clamp-2">{selectedOrder.product?.title || `Product ID: ${selectedOrder.product_id}`}</p>
                                            <p className="text-xs text-neutral-500 mt-1">Qty: {selectedOrder.quantity || 1} × ₹{parseFloat(selectedOrder.amount_paid).toFixed(2)}</p>
                                        </div>
                                    </div>

                                    <h4 className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-4 border-b border-neutral-100 pb-2">Payment Summary</h4>
                                    <div className="space-y-3 text-sm">
                                        <div className="flex justify-between"><span className="text-neutral-500">Status:</span> 
                                            <span className={`font-bold uppercase text-xs ${selectedOrder.payment_status === 'completed' ? 'text-green-600' : 'text-yellow-600'}`}>
                                                {selectedOrder.payment_status}
                                            </span>
                                        </div>
                                        <div className="flex justify-between"><span className="text-neutral-500">Transaction ID:</span> <span className="font-mono text-xs">{selectedOrder.payment_id}</span></div>
                                        <div className="flex justify-between pt-2"><span className="text-neutral-500">Subtotal:</span> <span className="font-medium text-neutral-900">₹{(parseFloat(selectedOrder.amount_paid) * (selectedOrder.quantity || 1)).toFixed(2)}</span></div>
                                        <div className="flex justify-between"><span className="text-neutral-500">GST (5%):</span> <span className="font-medium text-neutral-900">₹{parseFloat(selectedOrder.gst_amount || 0).toFixed(2)}</span></div>
                                        <div className="flex justify-between border-t border-neutral-200 pt-3 mt-2">
                                            <span className="font-bold text-neutral-900">Total Paid:</span> 
                                            <span className="font-black text-lg text-neutral-900">₹{parseFloat(selectedOrder.total_amount || selectedOrder.amount_paid).toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
