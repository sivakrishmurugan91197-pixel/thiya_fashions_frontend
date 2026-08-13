import AdminLayout from '@/components/AdminLayout';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import LogoLoader from '@/components/LogoLoader';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export default function AdminFeedbacks() {
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [formData, setFormData] = useState({
        customer_name: '',
        rating: '5',
        comment: '',
        status: 'active'
    });
    const [editFeedback, setEditFeedback] = useState(null);
    const router = useRouter();

    const fetchFeedbacks = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/thiya/feedbacks`);
            if (response.data.is_success) {
                setFeedbacks(response.data.data);
            }
        } catch (error) {
            console.error("Error fetching feedbacks:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const auth = localStorage.getItem('thiya_admin_auth');
        if (!auth) {
            router.push('/admin/login');
        } else {
            fetchFeedbacks();
        }
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const auth = localStorage.getItem('thiya_admin_auth');
            const headers = { 
                headers: { 
                    Authorization: `Bearer ${auth}`,
                    'Content-Type': 'multipart/form-data'
                } 
            };

            const data = new FormData();
            if (imageFile) {
                data.append('image', imageFile);
            }
            data.append('customer_name', formData.customer_name);
            data.append('rating', formData.rating);
            data.append('comment', formData.comment);
            data.append('status', formData.status);

            let response;
            if (editFeedback) {
                response = await axios.put(`${API_URL}/api/thiya/feedbacks/${editFeedback.id}`, data, headers);
            } else {
                if (!imageFile) {
                    alert("Please select a feedback image to upload");
                    return;
                }
                response = await axios.post(`${API_URL}/api/thiya/feedbacks`, data, headers);
            }
            
            if (response.data.is_success) {
                alert(editFeedback ? 'Feedback updated successfully!' : 'Feedback added successfully!');
                resetForm();
                setIsModalOpen(false);
                fetchFeedbacks();
            }
        } catch (error) {
            console.error("Error saving feedback:", error);
            if (error.response && error.response.status === 401) {
                localStorage.removeItem('thiya_admin_auth');
                router.push('/admin/login');
            } else {
                alert("Failed to save feedback");
            }
        }
    };

    const resetForm = () => {
        setFormData({ customer_name: '', rating: '5', comment: '', status: 'active' });
        setImageFile(null);
        setImagePreview(null);
        setEditFeedback(null);
    };

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this feedback? This will delete the image file too.")) return;
        try {
            const auth = localStorage.getItem('thiya_admin_auth');
            const headers = { headers: { Authorization: `Bearer ${auth}` } };
            const response = await axios.delete(`${API_URL}/api/thiya/feedbacks/${id}`, headers);
            if (response.data.is_success) {
                alert("Feedback deleted successfully");
                fetchFeedbacks();
            }
        } catch (error) {
            console.error("Error deleting feedback:", error);
            alert("Failed to delete feedback");
        }
    };

    const handleToggleStatus = async (fb) => {
        try {
            const auth = localStorage.getItem('thiya_admin_auth');
            const headers = { headers: { Authorization: `Bearer ${auth}` } };
            const newStatus = fb.status === 'active' ? 'inactive' : 'active';
            const response = await axios.put(`${API_URL}/api/thiya/feedbacks/${fb.id}`, { status: newStatus }, headers);
            if (response.data.is_success) {
                fetchFeedbacks();
            }
        } catch (error) {
            console.error("Error toggling status:", error);
            alert("Failed to update status");
        }
    };

    const formatImageUrl = (url) => {
        if (!url) return '';
        if (url.startsWith('http') && url.includes('localhost:3000')) {
            return url.replace('http://localhost:3000', API_URL);
        }
        return url;
    };

    return (
        <AdminLayout title="Feedback Management">
            {/* Header section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h2 className="text-lg font-black tracking-tight text-neutral-900 uppercase">Customer Feedbacks</h2>
                <button 
                    onClick={() => {
                        resetForm();
                        setIsModalOpen(true);
                    }}
                    className="flex items-center justify-center py-2.5 px-5 border border-transparent rounded-md shadow-sm text-sm font-bold text-white bg-black hover:bg-neutral-800 transition-colors uppercase tracking-widest"
                >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                    Add Feedback
                </button>
            </div>

            {/* Feedback Grid/List */}
            <div className="bg-white p-4 sm:p-8 rounded-xl shadow-sm border border-neutral-200">
                {loading ? (
                    <LogoLoader text="Loading Feedbacks..." />
                ) : feedbacks.length === 0 ? (
                    <div className="text-center py-20">
                        <svg className="mx-auto h-12 w-12 text-neutral-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
                        <p className="text-neutral-500 font-medium text-lg">No customer feedbacks added yet.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {feedbacks.map((fb) => (
                            <div key={fb.id} className="border border-neutral-200 rounded-xl overflow-hidden bg-white shadow-sm flex flex-col group hover:shadow-md transition-shadow">
                                <div className="aspect-[4/5] bg-neutral-100 relative overflow-hidden flex items-center justify-center">
                                    <img 
                                        src={formatImageUrl(fb.image_url)} 
                                        alt={fb.customer_name || 'Customer Feedback'} 
                                        className="object-contain w-full h-full max-h-[300px]"
                                    />
                                    <span className={`absolute top-2 right-2 text-[10px] font-black px-2 py-0.5 rounded tracking-wider uppercase ${
                                        fb.status === 'active' ? 'bg-green-150 text-green-800 border border-green-200' : 'bg-red-150 text-red-800 border border-red-200'
                                    }`}>
                                        {fb.status}
                                    </span>
                                </div>
                                <div className="p-4 flex flex-col flex-grow">
                                    <div className="flex items-center gap-1 text-amber-500 mb-2">
                                        {Array.from({ length: 5 }).map((_, idx) => (
                                            <svg key={idx} className={`w-4 h-4 ${idx < (fb.rating || 5) ? 'fill-current' : 'text-neutral-200'}`} viewBox="0 0 20 20">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                        ))}
                                    </div>
                                    <h4 className="font-bold text-neutral-900 text-sm mb-1 truncate">
                                        {fb.customer_name || 'Anonymous Customer'}
                                    </h4>
                                    <p className="text-xs text-neutral-500 line-clamp-3 mb-4 flex-grow italic">
                                        "{fb.comment || 'No comment provided.'}"
                                    </p>
                                    <div className="mt-auto border-t border-neutral-100 pt-3 flex items-center justify-between">
                                        <button 
                                            onClick={() => handleToggleStatus(fb)}
                                            className={`text-xs font-bold uppercase tracking-wider transition-colors ${
                                                fb.status === 'active' ? 'text-amber-600 hover:text-amber-800' : 'text-green-600 hover:text-green-800'
                                            }`}
                                        >
                                            {fb.status === 'active' ? 'Deactivate' : 'Activate'}
                                        </button>
                                        <div className="flex gap-2">
                                            <button 
                                                onClick={() => {
                                                    setEditFeedback(fb);
                                                    setFormData({
                                                        customer_name: fb.customer_name || '',
                                                        rating: String(fb.rating || 5),
                                                        comment: fb.comment || '',
                                                        status: fb.status
                                                    });
                                                    setIsModalOpen(true);
                                                }}
                                                className="text-xs text-neutral-600 hover:text-black font-bold uppercase tracking-wider"
                                            >
                                                Edit
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(fb.id)}
                                                className="text-xs text-red-600 hover:text-red-800 font-bold uppercase tracking-wider"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Add / Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 bg-neutral-900 bg-opacity-70 transition-opacity" onClick={() => setIsModalOpen(false)}></div>
                        
                        {/* Center modal */}
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                        <div className="inline-block align-middle bg-white rounded-xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full border border-neutral-200">
                            <form onSubmit={handleSubmit}>
                                <div className="bg-white px-6 pt-6 pb-4 sm:p-6 sm:pb-4">
                                    <div className="flex justify-between items-center pb-4 border-b border-neutral-100">
                                        <h3 className="text-lg font-black text-neutral-900 uppercase">
                                            {editFeedback ? 'Edit Feedback Details' : 'Add New Feedback'}
                                        </h3>
                                        <button 
                                            type="button"
                                            onClick={() => setIsModalOpen(false)}
                                            className="text-neutral-400 hover:text-neutral-500"
                                        >
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                        </button>
                                    </div>

                                    <div className="mt-4 space-y-4">
                                        {/* Image Upload */}
                                        <div>
                                            <label className="block text-xs font-bold text-neutral-500 uppercase tracking-widest mb-2">
                                                {editFeedback ? 'Feedback Image (Leave empty to keep current)' : 'Feedback Image *'}
                                            </label>
                                            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-neutral-300 border-dashed rounded-lg hover:border-neutral-400 transition-colors">
                                                <div className="space-y-1 text-center">
                                                    {(imagePreview || (editFeedback && editFeedback.image_url)) ? (
                                                        <div className="mb-3 max-h-48 overflow-hidden rounded border border-neutral-200">
                                                            <img 
                                                                src={imagePreview || formatImageUrl(editFeedback.image_url)} 
                                                                alt="Preview" 
                                                                className="mx-auto max-h-44 object-contain" 
                                                            />
                                                        </div>
                                                    ) : (
                                                        <svg className="mx-auto h-12 w-12 text-neutral-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                                                            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                        </svg>
                                                    )}
                                                    <div className="flex text-sm text-neutral-600 justify-center">
                                                        <label htmlFor="image" className="relative cursor-pointer bg-white rounded-md font-bold text-blue-600 hover:text-blue-500 focus-within:outline-none">
                                                            <span>{editFeedback ? 'Change image' : 'Upload a file'}</span>
                                                            <input id="image" name="image" type="file" accept="image/*" onChange={handleFileChange} className="sr-only" />
                                                        </label>
                                                    </div>
                                                    <p className="text-xs text-neutral-500">PNG, JPG, GIF up to 10MB</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Customer Name */}
                                        <div>
                                            <label htmlFor="customer_name" className="block text-xs font-bold text-neutral-500 uppercase tracking-widest mb-2">Customer Name</label>
                                            <input
                                                type="text"
                                                name="customer_name"
                                                id="customer_name"
                                                value={formData.customer_name}
                                                onChange={handleChange}
                                                placeholder="e.g. Anjali Devi"
                                                className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-black focus:ring-black sm:text-sm p-2.5 border"
                                            />
                                        </div>

                                        {/* Stars Selection */}
                                        <div>
                                            <label htmlFor="rating" className="block text-xs font-bold text-neutral-500 uppercase tracking-widest mb-2">Rating</label>
                                            <select
                                                id="rating"
                                                name="rating"
                                                value={formData.rating}
                                                onChange={handleChange}
                                                className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-black focus:ring-black sm:text-sm p-2.5 border bg-white"
                                            >
                                                <option value="5">⭐⭐⭐⭐⭐ (5 Stars)</option>
                                                <option value="4">⭐⭐⭐⭐ (4 Stars)</option>
                                                <option value="3">⭐⭐⭐ (3 Stars)</option>
                                                <option value="2">⭐⭐ (2 Stars)</option>
                                                <option value="1">⭐ (1 Star)</option>
                                            </select>
                                        </div>

                                        {/* Comment */}
                                        <div>
                                            <label htmlFor="comment" className="block text-xs font-bold text-neutral-500 uppercase tracking-widest mb-2">Review Comment</label>
                                            <textarea
                                                id="comment"
                                                name="comment"
                                                rows="3"
                                                value={formData.comment}
                                                onChange={handleChange}
                                                placeholder="e.g. Saree color and fabric quality are absolutely stunning!..."
                                                className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-black focus:ring-black sm:text-sm p-2.5 border"
                                            />
                                        </div>

                                        {/* Status */}
                                        <div>
                                            <label htmlFor="status" className="block text-xs font-bold text-neutral-500 uppercase tracking-widest mb-2">Display Status</label>
                                            <select
                                                id="status"
                                                name="status"
                                                value={formData.status}
                                                onChange={handleChange}
                                                className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-black focus:ring-black sm:text-sm p-2.5 border bg-white"
                                            >
                                                <option value="active">Active (Show on Homepage)</option>
                                                <option value="inactive">Inactive (Hide)</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-neutral-50 px-6 py-4 flex flex-row-reverse gap-3 border-t border-neutral-100">
                                    <button
                                        type="submit"
                                        className="inline-flex justify-center rounded-md border border-transparent shadow-sm px-5 py-2 bg-black text-sm font-bold text-white hover:bg-neutral-800 focus:outline-none uppercase tracking-widest"
                                    >
                                        Save
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="inline-flex justify-center rounded-md border border-neutral-350 shadow-sm px-5 py-2 bg-white text-sm font-bold text-neutral-700 hover:bg-neutral-50 focus:outline-none uppercase tracking-widest"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
