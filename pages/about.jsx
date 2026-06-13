import ThiyaLayout from '@/components/ThiyaLayout';

export default function About() {
    return (
        <ThiyaLayout>
            <div className="bg-white py-24 sm:py-32">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto max-w-2xl lg:mx-0">
                        <h2 className="text-4xl font-black tracking-tight text-gray-900 sm:text-6xl">About Thiya Fashions</h2>
                        <p className="mt-6 text-lg leading-8 text-gray-600">
                            Thiya Fashions is your premier destination for high-quality wholesale, retail, and manufactured clothing.
                            We pride ourselves on delivering premium fashion that speaks volumes about your style.
                        </p>
                    </div>
                    <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
                        <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
                            <div className="flex flex-col">
                                <dt className="text-xl font-bold leading-7 text-gray-900">Wholesale</dt>
                                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                                    <p className="flex-auto">We offer unbeatable wholesale prices for businesses looking to stock the latest trends in high-quality fashion.</p>
                                </dd>
                            </div>
                            <div className="flex flex-col">
                                <dt className="text-xl font-bold leading-7 text-gray-900">Retail</dt>
                                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                                    <p className="flex-auto">Shop directly with us for individual pieces. Our retail selection brings the runway straight to your wardrobe.</p>
                                </dd>
                            </div>
                            <div className="flex flex-col">
                                <dt className="text-xl font-bold leading-7 text-gray-900">Manufacture</dt>
                                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                                    <p className="flex-auto">As manufacturers, we control the quality from start to finish, ensuring every piece meets our exacting standards.</p>
                                </dd>
                            </div>
                        </dl>
                    </div>
                </div>
            </div>
        </ThiyaLayout>
    );
}
