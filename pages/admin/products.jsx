import AdminLayout from '@/components/AdminLayout';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

export default function AdminProducts() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    // Form State
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [discountAmount, setDiscountAmount] = useState('');
    const [size, setSize] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [status, setStatus] = useState('active');
    
    // Color Picker State
    const [colorList, setColorList] = useState([]);
    const [currentColor, setCurrentColor] = useState('#000000');

    const [details, setDetails] = useState('');
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [previewUrls, setPreviewUrls] = useState([]);
    const [imageColors, setImageColors] = useState({});
    
    const router = useRouter();

    const fetchData = async () => {
        setLoading(true);
        try {
            const [prodRes, catRes] = await Promise.all([
                axios.get('http://localhost:3000/api/thiya/products'),
                axios.get('http://localhost:3000/api/thiya/categories/active')
            ]);
            
            if (prodRes.data.is_success) setProducts(prodRes.data.data);
            if (catRes.data.is_success) setCategories(catRes.data.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const auth = localStorage.getItem('thiya_admin_auth');
        if (!auth) {
            router.push('/admin/login');
        } else {
            fetchData();
        }
    }, []);

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setSelectedFiles(files);
        
        // Generate previews
        const urls = files.map(file => URL.createObjectURL(file));
        setPreviewUrls(urls);
        
        // Initialize default colors
        const initialColors = {};
        files.forEach((_, index) => {
            initialColors[index] = 'default';
        });
        setImageColors(initialColors);
    };

    const handleImageColorChange = (index, color) => {
        setImageColors(prev => ({
            ...prev,
            [index]: color
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('price', price);
        formData.append('discount_amount', discountAmount);
        formData.append('size', size);
        formData.append('status', status);
        formData.append('colors', JSON.stringify(colorList));
        formData.append('details', details);
        if (categoryId) formData.append('category_id', categoryId);
        
        selectedFiles.forEach((file, index) => {
            const color = imageColors[index] || 'default';
            formData.append(`images_${color}`, file);
        });

        try {
            const response = await axios.post('http://localhost:3000/api/thiya/products', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            
            if (response.data.is_success) {
                alert('Product added successfully!');
                // Reset form
                setColorList([]); setStatus('active'); setDetails('');
                setSelectedFiles([]); setPreviewUrls([]); setImageColors({});
                setIsModalOpen(false);
                fetchData(); // Refresh the list
            }
        } catch (error) {
            console.error("Error adding product:", error);
            alert("Failed to add product");
        }
    };

    return (
        <AdminLayout title="Product Management">
            {/* Header section */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-black tracking-tight text-neutral-900 uppercase">Current Catalog</h2>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center justify-center py-2.5 px-5 border border-transparent rounded-md shadow-sm text-sm font-bold text-white bg-black hover:bg-neutral-800 transition-colors uppercase tracking-widest"
                >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                    Add Product
                </button>
            </div>

            {/* Product List */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-neutral-200">
                {loading ? (
                    <div className="flex justify-center py-12">
                        <div className="w-8 h-8 border-t-2 border-black border-solid rounded-full animate-spin"></div>
                    </div>
                ) : products.length === 0 ? (
                    <div className="text-center py-20">
                        <svg className="mx-auto h-12 w-12 text-neutral-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
                        <p className="text-neutral-500 font-medium text-lg">No products added yet.</p>
                        <p className="text-neutral-400 text-sm mt-1">Get started by adding your first product to the catalog.</p>
                    </div>
                ) : (
                    <div className="overflow-hidden ring-1 ring-neutral-200 rounded-lg">
                        <table className="min-w-full divide-y divide-neutral-200">
                            <thead className="bg-neutral-50">
                                <tr>
                                    <th scope="col" className="py-4 pl-6 pr-3 text-left text-xs font-bold text-neutral-500 uppercase tracking-wider">Item</th>
                                    <th scope="col" className="px-3 py-4 text-left text-xs font-bold text-neutral-500 uppercase tracking-wider">Category</th>
                                    <th scope="col" className="px-3 py-4 text-left text-xs font-bold text-neutral-500 uppercase tracking-wider">Price</th>
                                    <th scope="col" className="px-3 py-4 text-left text-xs font-bold text-neutral-500 uppercase tracking-wider">Status</th>
                                    <th scope="col" className="px-3 py-4 text-left text-xs font-bold text-neutral-500 uppercase tracking-wider">Size</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-200 bg-white">
                                {products.map((product) => (
                                    <tr key={product.id} className="hover:bg-neutral-50 transition-colors">
                                        <td className="whitespace-nowrap py-4 pl-6 pr-3">
                                            <div className="flex items-center">
                                                <div className="h-16 w-16 flex-shrink-0 bg-neutral-100 rounded-md overflow-hidden border border-neutral-200">
                                                    <img 
                                                        src={product.images && product.images.length > 0 ? product.images[0]?.url : 'https://via.placeholder.com/64'} 
                                                        alt="" 
                                                        className="h-full w-full object-cover" 
                                                    />
                                                </div>
                                                <div className="ml-4">
                                                    <div className="font-bold text-neutral-900 text-base">{product.title}</div>
                                                    <div className="text-xs text-neutral-500 mt-1 max-w-sm truncate">{product.description || "No description provided"}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm font-medium text-neutral-500">
                                            {product.category?.name || 'Uncategorized'}
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm font-black text-neutral-900">
                                            ₹{parseFloat(product.price).toFixed(2)}
                                            {parseFloat(product.discount_amount) > 0 && (
                                                <span className="ml-2 text-xs text-green-600 font-bold bg-green-50 px-2 py-0.5 rounded">
                                                    -₹{parseFloat(product.discount_amount).toFixed(2)}
                                                </span>
                                            )}
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm">
                                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider ${
                                                product.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                            }`}>
                                                {product.status || 'active'}
                                            </span>
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-neutral-500 font-medium">
                                            <span className="inline-flex items-center rounded bg-neutral-100 px-2.5 py-1 text-xs font-bold text-neutral-700 ring-1 ring-inset ring-neutral-300">
                                                {product.size || 'STD'}
                                            </span>
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
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200 border border-neutral-200 max-h-[90vh] flex flex-col">
                        
                        <div className="bg-neutral-50 px-8 py-6 border-b border-neutral-200 flex justify-between items-center flex-shrink-0">
                            <div>
                                <h3 className="text-xl font-black text-neutral-900 uppercase tracking-tight">Add New Product</h3>
                                <p className="text-xs text-neutral-500 mt-1 font-medium">Upload images and assign to a category</p>
                            </div>
                            <button 
                                onClick={() => setIsModalOpen(false)}
                                className="text-neutral-400 hover:text-black transition-colors rounded-full p-1 hover:bg-neutral-200"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </button>
                        </div>

                        <div className="p-8 overflow-y-auto">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-xs font-bold text-neutral-500 uppercase tracking-widest mb-2">Category</label>
                                    <select 
                                        value={categoryId} 
                                        onChange={(e) => setCategoryId(e.target.value)} 
                                        className="block w-full rounded-md border-0 py-3 px-4 text-neutral-900 ring-1 ring-inset ring-neutral-300 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm transition-all bg-neutral-50 uppercase tracking-wider font-bold"
                                    >
                                        <option value="">Select a Category</option>
                                        {categories.map(c => (
                                            <option key={c.id} value={c.id}>{c.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-neutral-500 uppercase tracking-widest mb-2">Product Title</label>
                                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="e.g., Premium Cotton T-Shirt" className="block w-full rounded-md border-0 py-3 px-4 text-neutral-900 ring-1 ring-inset ring-neutral-300 placeholder:text-neutral-400 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm transition-all bg-neutral-50" />
                                </div>
                                
                                <div>
                                    <label className="block text-xs font-bold text-neutral-500 uppercase tracking-widest mb-2">Description</label>
                                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} placeholder="Describe the material, fit, and style..." className="block w-full rounded-md border-0 py-3 px-4 text-neutral-900 ring-1 ring-inset ring-neutral-300 placeholder:text-neutral-400 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm transition-all bg-neutral-50 resize-none" />
                                </div>
                                
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-xs font-bold text-neutral-500 uppercase tracking-widest mb-2">Regular Price (₹)</label>
                                        <input type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} required placeholder="0.00" className="block w-full rounded-md border-0 py-3 px-4 text-neutral-900 ring-1 ring-inset ring-neutral-300 placeholder:text-neutral-400 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm transition-all bg-neutral-50 font-mono" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-neutral-500 uppercase tracking-widest mb-2">Discount (₹)</label>
                                        <input type="number" step="0.01" value={discountAmount} onChange={(e) => setDiscountAmount(e.target.value)} placeholder="0.00" className="block w-full rounded-md border-0 py-3 px-4 text-neutral-900 ring-1 ring-inset ring-neutral-300 placeholder:text-neutral-400 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm transition-all bg-neutral-50 font-mono" />
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-xs font-bold text-neutral-500 uppercase tracking-widest mb-2">Status</label>
                                        <select value={status} onChange={(e) => setStatus(e.target.value)} className="block w-full rounded-md border-0 py-3 px-4 text-neutral-900 ring-1 ring-inset ring-neutral-300 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm transition-all bg-neutral-50 font-bold uppercase">
                                            <option value="active">Active</option>
                                            <option value="inactive">Inactive</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-neutral-500 uppercase tracking-widest mb-2">Size Variants</label>
                                        <input type="text" value={size} onChange={(e) => setSize(e.target.value)} placeholder="e.g. S, M, L, XL" className="block w-full rounded-md border-0 py-3 px-4 text-neutral-900 ring-1 ring-inset ring-neutral-300 placeholder:text-neutral-400 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm transition-all bg-neutral-50" />
                                    </div>
                                </div>
                                
                                <div className="border-t border-neutral-200 pt-6">
                                    <label className="block text-sm font-black text-neutral-900 uppercase tracking-widest mb-2">Product Images</label>
                                    <p className="text-xs text-neutral-500 mb-4 font-medium">Upload all product images here. Once uploaded, you can assign each image to a specific color from your list below, or leave it as Default.</p>
                                    
                                    <input 
                                        type="file" 
                                        multiple 
                                        accept="image/jpeg, image/png, image/webp"
                                        onChange={handleFileChange}
                                        className="block w-full text-sm text-neutral-500 file:mr-4 file:py-3 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-bold file:bg-neutral-100 file:text-neutral-700 hover:file:bg-neutral-200 transition-all border border-neutral-300 rounded-md bg-neutral-50"
                                    />
                                    
                                    {previewUrls.length > 0 && (
                                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-6 bg-neutral-50 p-4 rounded-lg border border-neutral-200">
                                            {previewUrls.map((url, index) => (
                                                <div key={index} className="bg-white border border-neutral-200 rounded-lg p-3 flex flex-col items-center shadow-sm">
                                                    <div className="w-full aspect-[3/4] mb-3 rounded-md overflow-hidden bg-neutral-100 ring-1 ring-neutral-200">
                                                        <img src={url} alt={`Preview ${index}`} className="w-full h-full object-cover" />
                                                    </div>
                                                    <label className="text-[10px] font-bold text-neutral-500 uppercase w-full mb-1.5 tracking-wider">Map to Color</label>
                                                    <select 
                                                        value={imageColors[index] || 'default'} 
                                                        onChange={(e) => handleImageColorChange(index, e.target.value)}
                                                        className="block w-full text-xs rounded border-neutral-300 py-1.5 px-2 bg-neutral-50 font-mono font-bold focus:ring-1 focus:ring-black focus:border-black"
                                                    >
                                                        <option value="default">Default</option>
                                                        {colorList.map(c => (
                                                            <option key={c} value={c}>{c}</option>
                                                        ))}
                                                    </select>
                                                    {imageColors[index] !== 'default' && (
                                                        <div className="w-full mt-2 flex items-center justify-center gap-1 bg-neutral-100 py-1 rounded">
                                                            <span className="w-3 h-3 rounded-full border border-black/10" style={{backgroundColor: imageColors[index]}}></span>
                                                            <span className="text-[10px] font-bold text-neutral-600">{imageColors[index]}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="border-t border-neutral-200 pt-6">
                                    <label className="block text-xs font-bold text-neutral-500 uppercase tracking-widest mb-2">Colors (Select & Add)</label>
                                    <div className="flex gap-4 items-center">
                                        <input type="color" value={currentColor} onChange={(e) => setCurrentColor(e.target.value)} className="h-12 w-12 rounded cursor-pointer border-0 p-0" />
                                        <button type="button" onClick={() => {
                                            if (!colorList.includes(currentColor)) setColorList([...colorList, currentColor]);
                                        }} className="px-4 py-2 bg-neutral-200 hover:bg-neutral-300 text-sm font-bold rounded">Add Color</button>
                                    </div>
                                    {colorList.length > 0 && (
                                        <div className="flex flex-wrap gap-3 mt-4">
                                            {colorList.map((c, i) => (
                                                <div key={i} className="flex items-center gap-2 bg-neutral-50 p-2 rounded-md border border-neutral-200">
                                                    <span className="w-5 h-5 rounded-full border border-black/10" style={{backgroundColor: c}}></span>
                                                    <span className="text-xs font-mono font-bold uppercase">{c}</span>
                                                    <button type="button" onClick={() => {
                                                        setColorList(colorList.filter(color => color !== c));
                                                    }} className="text-red-500 hover:text-red-700 ml-1">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                
                                <div>
                                    <label className="block text-xs font-bold text-neutral-500 uppercase tracking-widest mb-2">Product Details (JSON format)</label>
                                    <textarea value={details} onChange={(e) => setDetails(e.target.value)} rows={3} placeholder='{"Fabric": "Silk", "Length": "Maxi"}' className="block w-full rounded-md border-0 py-3 px-4 text-neutral-900 ring-1 ring-inset ring-neutral-300 placeholder:text-neutral-400 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm transition-all bg-neutral-50 font-mono resize-none" />
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
                                        Publish
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
