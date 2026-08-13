import AdminLayout from '@/components/AdminLayout';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import LogoLoader from '@/components/LogoLoader';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export default function AdminVideoBanner() {
    const [banners, setBanners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        subtitle: '',
        status: 'active'
    });
    const [editBanner, setEditBanner] = useState(null);
    const router = useRouter();

    const fetchBanners = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/thiya/video-banners`);
            if (response.data.is_success) {
                setBanners(response.data.data);
            }
        } catch (error) {
            console.error("Error fetching video banners:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const auth = localStorage.getItem('thiya_admin_auth');
        if (!auth) {
            router.push('/admin/login');
        } else {
            fetchBanners();
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
            data.append('title', formData.title);
            data.append('subtitle', formData.subtitle);
            data.append('status', formData.status);

            let response;
            if (editBanner) {
                response = await axios.put(`${API_URL}/api/thiya/video-banners/${editBanner.id}`, data, headers);
            } else {
                if (!imageFile) {
                    alert("Please select a showcase banner image to upload");
                    return;
                }
                response = await axios.post(`${API_URL}/api/thiya/video-banners`, data, headers);
            }
            
            if (response.data.is_success) {
                alert(editBanner ? 'Video banner updated successfully!' : 'Video banner uploaded successfully!');
                resetForm();
                setIsModalOpen(false);
                fetchBanners();
            }
        } catch (error) {
            console.error("Error saving video banner:", error);
            if (error.response && error.response.status === 401) {
                localStorage.removeItem('thiya_admin_auth');
                router.push('/admin/login');
            } else {
                alert("Failed to save video banner");
            }
        }
    };

    const resetForm = () => {
        setFormData({ title: '', subtitle: '', status: 'active' });
        setImageFile(null);
        setImagePreview(null);
        setEditBanner(null);
    };

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this showcase banner?")) return;
        try {
            const auth = localStorage.getItem('thiya_admin_auth');
            const headers = { headers: { Authorization: `Bearer ${auth}` } };
            const response = await axios.delete(`${API_URL}/api/thiya/video-banners/${id}`, headers);
            if (response.data.is_success) {
                alert("Video banner deleted successfully");
                fetchBanners();
            }
        } catch (error) {
            console.error("Error deleting video banner:", error);
            alert("Failed to delete video banner");
        }
    };

    const handleToggleStatus = async (banner) => {
        try {
            const auth = localStorage.getItem('thiya_admin_auth');
            const headers = { headers: { Authorization: `Bearer ${auth}` } };
            const newStatus = banner.status === 'active' ? 'inactive' : 'active';
            const response = await axios.put(`${API_URL}/api/thiya/video-banners/${banner.id}`, { status: newStatus }, headers);
            if (response.data.is_success) {
                fetchBanners();
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
        <AdminLayout title="Video Banner Showcase">
            {/* Header section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h2 className="text-lg font-black tracking-tight text-neutral-900 uppercase">Showcase Banner List</h2>
                <button 
                    onClick={() => {
                        resetForm();
                        setIsModalOpen(true);
                    }}
                    className="flex items-center justify-center py-2.5 px-5 border border-transparent rounded-md shadow-sm text-sm font-bold text-white bg-black hover:bg-neutral-800 transition-colors uppercase tracking-widest"
                >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                    Upload Showcase Image
                </button>
            </div>

            {/* Showcase Grid */}
            <div className="bg-white p-4 sm:p-8 rounded-xl shadow-sm border border-neutral-200">
                {loading ? (
                    <LogoLoader text="Loading Video Banners..." />
                ) : banners.length === 0 ? (
                    <div className="text-center py-20">
                        <svg className="mx-auto h-12 w-12 text-neutral-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-.553.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                        <p className="text-neutral-500 font-medium text-lg">No 3D showcase banners added yet.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {banners.map((banner) => (
                            <div key={banner.id} className="border border-neutral-200 rounded-xl overflow-hidden bg-white shadow-sm flex flex-col hover:shadow-md transition-shadow">
                                <div className="aspect-[16/9] bg-neutral-100 relative overflow-hidden flex items-center justify-center">
                                    <img 
                                        src={formatImageUrl(banner.image_url)} 
                                        alt={banner.title || 'Video Showcase'} 
                                        className="object-cover w-full h-full"
                                    />
                                    <span className={`absolute top-3 right-3 text-[10px] font-black px-2.5 py-1 rounded tracking-wider uppercase shadow-sm ${
                                        banner.status === 'active' ? 'bg-green-600 text-white' : 'bg-neutral-500 text-white'
                                    }`}>
                                        {banner.status === 'active' ? 'Active on Homepage' : 'Inactive'}
                                    </span>
                                </div>
                                <div className="p-5 flex flex-col flex-grow">
                                    <h4 className="font-bold text-neutral-900 text-lg mb-1 truncate">
                                        {banner.title || 'Untitled Banner'}
                                    </h4>
                                    <p className="text-sm text-neutral-500 mb-6 line-clamp-2">
                                        {banner.subtitle || 'No subtitle provided.'}
                                    </p>
                                    <div className="mt-auto border-t border-neutral-100 pt-4 flex items-center justify-between">
                                        <button 
                                            onClick={() => handleToggleStatus(banner)}
                                            className={`text-xs font-bold uppercase tracking-wider transition-colors ${
                                                banner.status === 'active' ? 'text-amber-600 hover:text-amber-800' : 'text-green-600 hover:text-green-800'
                                            }`}
                                        >
                                            {banner.status === 'active' ? 'Deactivate' : 'Set Active'}
                                        </button>
                                        <div className="flex gap-4">
                                            <button 
                                                onClick={() => {
                                                    setEditBanner(banner);
                                                    setFormData({
                                                        title: banner.title || '',
                                                        subtitle: banner.subtitle || '',
                                                        status: banner.status
                                                    });
                                                    setIsModalOpen(true);
                                                }}
                                                className="text-xs text-neutral-600 hover:text-black font-bold uppercase tracking-wider"
                                            >
                                                Edit
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(banner.id)}
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
                                            {editBanner ? 'Edit Showcase Details' : 'Upload Showcase Banner'}
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
                                                {editBanner ? 'Showcase Image (Leave empty to keep current)' : 'Showcase Image *'}
                                            </label>
                                            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-neutral-300 border-dashed rounded-lg hover:border-neutral-400 transition-colors">
                                                <div className="space-y-1 text-center">
                                                    {(imagePreview || (editBanner && editBanner.image_url)) ? (
                                                        <div className="mb-3 max-h-48 overflow-hidden rounded border border-neutral-200">
                                                            <img 
                                                                src={imagePreview || formatImageUrl(editBanner.image_url)} 
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
                                                            <span>{editBanner ? 'Change image' : 'Upload a file'}</span>
                                                            <input id="image" name="image" type="file" accept="image/*" onChange={handleFileChange} className="sr-only" />
                                                        </label>
                                                    </div>
                                                    <p className="text-xs text-neutral-500">PNG, JPG, GIF up to 10MB</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Title */}
                                        <div>
                                            <label htmlFor="title" className="block text-xs font-bold text-neutral-500 uppercase tracking-widest mb-2">Showcase Title</label>
                                            <input
                                                type="text"
                                                name="title"
                                                id="title"
                                                value={formData.title}
                                                onChange={handleChange}
                                                placeholder="e.g. Royal Silk Couture"
                                                className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-black focus:ring-black sm:text-sm p-2.5 border"
                                            />
                                        </div>

                                        {/* Subtitle */}
                                        <div>
                                            <label htmlFor="subtitle" className="block text-xs font-bold text-neutral-500 uppercase tracking-widest mb-2">Showcase Description</label>
                                            <textarea
                                                id="subtitle"
                                                name="subtitle"
                                                rows="3"
                                                value={formData.subtitle}
                                                onChange={handleChange}
                                                placeholder="e.g. Sourced from authentic weavers, experience the 3D elegance of raw fabrics..."
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
                                                <option value="inactive">Inactive</option>
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
