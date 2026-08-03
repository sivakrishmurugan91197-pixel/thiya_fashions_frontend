import ThiyaLayout from '@/components/ThiyaLayout';
import { useState } from 'react';

export default function Contact() {
    const [status, setStatus] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        setStatus('Message sent successfully!');
        e.target.reset();
        setTimeout(() => setStatus(''), 3000);
    };

    return (
        <ThiyaLayout title="Contact Us" description="Get in touch with Thiya Fashions. Sourcing trending designs and premium clothing at unbeatable rates. Send us a message or WhatsApp us at 9361356409.">
            <div className="isolate bg-white px-6 py-24 sm:py-32 lg:px-8">
                <div className="mx-auto max-w-2xl text-center">
                    <h2 className="text-3xl font-black tracking-tight text-gray-900 sm:text-5xl">Contact Us</h2>
                    <p className="mt-2 text-lg leading-8 text-gray-600">
                        Have questions about wholesale orders or our retail collection? Reach out to us.
                    </p>
                </div>
                <form onSubmit={handleSubmit} className="mx-auto mt-16 max-w-xl sm:mt-20">
                    <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
                        <div className="sm:col-span-2">
                            <label htmlFor="name" className="block text-sm font-bold leading-6 text-gray-900">Name</label>
                            <div className="mt-2">
                                <input type="text" name="name" id="name" required
                                    className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6" />
                            </div>
                        </div>
                        <div className="sm:col-span-2">
                            <label htmlFor="email" className="block text-sm font-bold leading-6 text-gray-900">Email</label>
                            <div className="mt-2">
                                <input type="email" name="email" id="email" required
                                    className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6" />
                            </div>
                        </div>
                        <div className="sm:col-span-2">
                            <label htmlFor="message" className="block text-sm font-bold leading-6 text-gray-900">Message</label>
                            <div className="mt-2">
                                <textarea name="message" id="message" rows={4} required
                                    className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6" />
                            </div>
                        </div>
                    </div>
                    <div className="mt-10">
                        <button type="submit"
                            className="block w-full rounded-md bg-blue-600 px-3.5 py-2.5 text-center text-sm font-bold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-colors">
                            Let's talk
                        </button>
                    </div>
                    {status && <p className="mt-4 text-center text-green-600 font-medium">{status}</p>}
                </form>
            </div>
        </ThiyaLayout>
    );
}
