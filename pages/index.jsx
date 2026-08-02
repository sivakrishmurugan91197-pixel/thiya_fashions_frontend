import ThiyaLayout from '@/components/ThiyaLayout';
import Link from 'next/link';

export default function Home() {
    return (
        <ThiyaLayout>
            {/* Hero Section */}
            <div className="relative isolate overflow-hidden bg-gray-900">
                <img
                    src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
                    alt="Premium Fashion Background"
                    className="absolute inset-0 -z-10 h-full w-full object-cover opacity-40 mix-blend-multiply"
                />
                
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56 text-center">
                        <div className="hidden sm:mb-8 sm:flex sm:justify-center">
                            <div className="relative rounded-full px-3 py-1 text-sm leading-6 text-gray-300 ring-1 ring-white/10 hover:ring-white/20 transition-all cursor-pointer bg-white/5 backdrop-blur-sm">
                                Announcing our new Summer Collection. <Link href="/products" className="font-semibold text-white"><span className="absolute inset-0" aria-hidden="true" />View collection <span aria-hidden="true">&rarr;</span></Link>
                            </div>
                        </div>
                        <h1 className="text-5xl font-black tracking-tighter text-white sm:text-7xl drop-shadow-lg">
                            Elevate Your Style with Thiya Fashions
                        </h1>
                        <p className="mt-6 text-lg leading-8 text-gray-300 drop-shadow-md font-medium">
                            Premium Wholesale, Retail & Manufactured Clothing. Discover the perfect blend of elegance, comfort, and state-of-the-art design for every occasion.
                        </p>
                        <div className="mt-10 flex items-center justify-center gap-x-6">
                            <Link
                                href="/products"
                                className="rounded-md bg-white px-8 py-3.5 text-sm font-black text-gray-900 shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white transition-transform hover:scale-105"
                            >
                                Shop the Collection
                            </Link>
                            <Link href="/about" className="text-sm font-bold leading-6 text-white hover:text-gray-300 transition-colors">
                                Learn more about us <span aria-hidden="true">→</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Premium Features Section */}
            <div className="bg-white py-24 sm:py-32">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto max-w-2xl lg:text-center">
                        <h2 className="text-base font-bold leading-7 text-pink-600 uppercase tracking-widest">Thiya Fashions Exclusive</h2>
                        <p className="mt-2 text-3xl font-black tracking-tight text-gray-900 sm:text-4xl">
                            Everything you need to look your best
                        </p>
                        <p className="mt-6 text-lg leading-8 text-gray-600">
                            From manufacturing raw materials to the final stitch, we ensure every piece that leaves our facility meets the highest standards of luxury and durability.
                        </p>
                    </div>
                    
                    <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
                        <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
                            <div className="relative pl-16 group">
                                <dt className="text-xl font-bold leading-7 text-gray-900">
                                    <div className="absolute left-0 top-0 flex h-12 w-12 items-center justify-center rounded-lg bg-black text-white group-hover:bg-pink-600 transition-colors">
                                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                                        </svg>
                                    </div>
                                    Wholesale Ordering
                                </dt>
                                <dd className="mt-2 text-base leading-7 text-gray-600">Unbeatable bulk prices for businesses and boutiques. High margins, incredible quality.</dd>
                            </div>
                            <div className="relative pl-16 group">
                                <dt className="text-xl font-bold leading-7 text-gray-900">
                                    <div className="absolute left-0 top-0 flex h-12 w-12 items-center justify-center rounded-lg bg-black text-white group-hover:bg-pink-600 transition-colors">
                                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                                        </svg>
                                    </div>
                                    Direct Retail
                                </dt>
                                <dd className="mt-2 text-base leading-7 text-gray-600">Shop individual pieces directly from our curated collections, straight from the source.</dd>
                            </div>
                            <div className="relative pl-16 group">
                                <dt className="text-xl font-bold leading-7 text-gray-900">
                                    <div className="absolute left-0 top-0 flex h-12 w-12 items-center justify-center rounded-lg bg-black text-white group-hover:bg-pink-600 transition-colors">
                                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                                          <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
                                        </svg>
                                    </div>
                                    In-house Manufacturing
                                </dt>
                                <dd className="mt-2 text-base leading-7 text-gray-600">We produce our own garments using state-of-the-art machinery and skilled artisans.</dd>
                            </div>
                            <div className="relative pl-16 group">
                                <dt className="text-xl font-bold leading-7 text-gray-900">
                                    <div className="absolute left-0 top-0 flex h-12 w-12 items-center justify-center rounded-lg bg-black text-white group-hover:bg-pink-600 transition-colors">
                                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
                                        </svg>
                                    </div>
                                    Premium Materials
                                </dt>
                                <dd className="mt-2 text-base leading-7 text-gray-600">Sourced from the finest providers across the globe to ensure comfort and longevity.</dd>
                            </div>
                        </dl>
                    </div>
                </div>
            </div>
            
            {/* CTA Section */}
            <div className="bg-gray-50">
              <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:flex lg:items-center lg:justify-between lg:px-8">
                <h2 className="text-3xl font-black tracking-tight text-gray-900 sm:text-4xl">
                  Ready to upgrade your wardrobe?
                  <br />
                  <span className="text-pink-600">Start exploring our collection today.</span>
                </h2>
                <div className="mt-10 flex items-center gap-x-6 lg:mt-0 lg:flex-shrink-0">
                  <Link
                    href="/products"
                    className="rounded-md bg-black px-8 py-3.5 text-sm font-bold text-white shadow-sm hover:bg-neutral-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black transition-transform hover:scale-105"
                  >
                    View All Products
                  </Link>
                  <Link href="/contact" className="text-sm font-bold leading-6 text-gray-900 hover:text-pink-600 transition-colors">
                    Contact Sales <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </div>
            </div>
        </ThiyaLayout>
    );
}
