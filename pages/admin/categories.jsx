import AdminLayout from '@/components/AdminLayout';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export default function AdminCategories() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        status: 'active',
        menu: 'women',
        size_status: true
    });
    const [editCategory, setEditCategory] = useState(null);
    const router = useRouter();

    const fetchCategories = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/thiya/categories`);
            if (response.data.is_success) {
                setCategories(response.data.data);
            }
        } catch (error) {
            console.error("Error fetching categories:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const auth = localStorage.getItem('thiya_admin_auth');
        if (!auth) {
            router.push('/admin/login');
        } else {
            fetchCategories();
        }
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let response;
            if (editCategory) {
                response = await axios.put(`${API_URL}/api/thiya/categories/${editCategory.id}`, formData);
            } else {
                response = await axios.post(`${API_URL}/api/thiya/categories`, formData);
            }
            
            if (response.data.is_success) {
                alert(editCategory ? 'Category updated successfully!' : 'Category added successfully!');
                setFormData({ name: '', status: 'active', menu: 'women', size_status: true });
                setEditCategory(null);
                setIsModalOpen(false);
                fetchCategories();
            }
        } catch (error) {
            console.error("Error saving category:", error);
            alert("Failed to save category");
        }
    };

    return (
        <AdminLayout title="Category Management">
            {/* Header section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h2 className="text-lg font-black tracking-tight text-neutral-900 uppercase">All Categories</h2>
                <button 
                    onClick={() => {
                        setFormData({ name: '', status: 'active', menu: 'women', size_status: true });
                        setEditCategory(null);
                        setIsModalOpen(true);
                    }}
                    className="flex items-center justify-center py-2.5 px-5 border border-transparent rounded-md shadow-sm text-sm font-bold text-white bg-black hover:bg-neutral-800 transition-colors uppercase tracking-widest"
                >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                    Add Category
                </button>
            </div>

            {/* Category List */}
            <div className="bg-white p-4 sm:p-8 rounded-xl shadow-sm border border-neutral-200">
                {loading ? (
                    <div className="flex justify-center py-12">
                        <div className="w-8 h-8 border-t-2 border-black border-solid rounded-full animate-spin"></div>
                    </div>
                ) : categories.length === 0 ? (
                    <div className="text-center py-20">
                        <svg className="mx-auto h-12 w-12 text-neutral-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                        <p className="text-neutral-500 font-medium text-lg">No categories added yet.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto ring-1 ring-neutral-200 rounded-lg">
                        <table className="min-w-full divide-y divide-neutral-200">
                            <thead className="bg-neutral-50">
                                <tr>
                                    <th scope="col" className="py-4 pl-6 pr-3 text-left text-xs font-bold text-neutral-500 uppercase tracking-wider">Category Name</th>
                                    <th scope="col" className="px-3 py-4 text-left text-xs font-bold text-neutral-500 uppercase tracking-wider">Menu</th>
                                    <th scope="col" className="px-3 py-4 text-left text-xs font-bold text-neutral-500 uppercase tracking-wider">Status</th>
                                    <th scope="col" className="px-3 py-4 text-left text-xs font-bold text-neutral-500 uppercase tracking-wider">Sizes Enabled</th>
                                    <th scope="col" className="px-3 py-4 text-left text-xs font-bold text-neutral-500 uppercase tracking-wider">Added On</th>
                                    <th scope="col" className="relative py-4 pl-3 pr-6 text-right text-xs font-bold text-neutral-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-200 bg-white">
                                {categories.map((cat) => (
                                    <tr key={cat.id} className="hover:bg-neutral-50 transition-colors">
                                        <td className="whitespace-nowrap py-4 pl-6 pr-3 text-sm font-bold text-neutral-900">
                                            {cat.name}
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm">
                                            <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider bg-blue-100 text-blue-800">
                                                {cat.menu || 'women'}
                                            </span>
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm">
                                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider ${
                                                cat.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                            }`}>
                                                {cat.status}
                                            </span>
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm">
                                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider ${
                                                cat.size_status === false ? 'bg-amber-100 text-amber-800' : 'bg-pink-100 text-pink-800'
                                            }`}>
                                                {cat.size_status === false ? 'No' : 'Yes'}
                                            </span>
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-neutral-500">
                                            {new Date(cat.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="whitespace-nowrap py-4 pl-3 pr-6 text-right text-sm font-bold">
                                            <button
                                                onClick={() => {
                                                    setEditCategory(cat);
                                                    setFormData({
                                                        name: cat.name,
                                                        status: cat.status,
                                                        menu: cat.menu || 'women',
                                                        size_status: cat.size_status !== false
                                                    });
                                                    setIsModalOpen(true);
                                                }}
                                                className="text-pink-600 hover:text-pink-950 font-bold uppercase tracking-wider text-xs border border-pink-200 hover:border-pink-500 px-3 py-1.5 rounded transition-all bg-pink-50/50"
                                            >
                                                Edit
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Premium Modal Overlay */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/60 backdrop-blur-sm p-4 sm:p-0">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200 border border-neutral-200">
                        <div className="bg-neutral-50 px-8 py-6 border-b border-neutral-200 flex justify-between items-center">
                            <div>
                                <h3 className="text-xl font-black text-neutral-900 uppercase tracking-tight">{editCategory ? "Edit Category" : "Add Category"}</h3>
                            </div>
                            <button 
                                onClick={() => setIsModalOpen(false)}
                                className="text-neutral-400 hover:text-black transition-colors rounded-full p-1 hover:bg-neutral-200"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </button>
                        </div>
                        <div className="p-8">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-xs font-bold text-neutral-500 uppercase tracking-widest mb-2">Category Name</label>
                                    <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="e.g. Men's Wear" className="block w-full rounded-md border-0 py-3 px-4 text-neutral-900 ring-1 ring-inset ring-neutral-300 placeholder:text-neutral-400 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm transition-all bg-neutral-50" />
                                </div>
                                <div>
                                                    <label className="block text-xs font-bold text-neutral-500 uppercase tracking-widest mb-2">Menu Section</label>
                                                    <select name="menu" value={formData.menu} onChange={handleChange} className="block w-full rounded-md border-0 py-3 px-4 text-neutral-900 ring-1 ring-inset ring-neutral-300 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm transition-all bg-neutral-50 uppercase tracking-wider font-bold">
                                                        <option value="women">Women</option>
                                                        <option value="men">Men</option>
                                                        <option value="kids">Kids</option>
                                                    </select>
                                                </div>
                                                <div>
                                    <label className="block text-xs font-bold text-neutral-500 uppercase tracking-widest mb-2">Status</label>
                                    <select name="status" value={formData.status} onChange={handleChange} className="block w-full rounded-md border-0 py-3 px-4 text-neutral-900 ring-1 ring-inset ring-neutral-300 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm transition-all bg-neutral-50 uppercase tracking-wider font-bold">
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-neutral-500 uppercase tracking-widest mb-2">Sizes Enabled</label>
                                    <select name="size_status" value={formData.size_status.toString()} onChange={(e) => setFormData({ ...formData, size_status: e.target.value === 'true' })} className="block w-full rounded-md border-0 py-3 px-4 text-neutral-900 ring-1 ring-inset ring-neutral-300 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm transition-all bg-neutral-50 uppercase tracking-wider font-bold">
                                        <option value="true">Yes (Sizing Required)</option>
                                        <option value="false">No (One Size/e.g. Sarees)</option>
                                    </select>
                                </div>
                                <div className="pt-6 mt-2 border-t border-neutral-100 flex justify-end gap-3">
                                    <button 
                                        type="button" 
                                        onClick={() => setIsModalOpen(false)}
                                        className="py-3 px-6 rounded-md text-sm font-bold text-neutral-700 bg-white border border-neutral-300 hover:bg-neutral-50 transition-colors uppercase tracking-wider"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        type="submit" 
                                        className="py-3 px-8 border border-transparent rounded-md shadow-md text-sm font-bold text-white bg-black hover:bg-neutral-800 transition-colors uppercase tracking-widest"
                                    >
                                        Save
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
