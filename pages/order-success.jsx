import ThiyaLayout from '@/components/ThiyaLayout';
import { useRouter } from 'next/router';

export default function OrderSuccess() {
    const router = useRouter();
    const { transactionId, title, quantity, amount } = router.query;

    const formattedAmount = amount ? parseFloat(amount).toFixed(2) : '0.00';

    return (
        <ThiyaLayout>
            <div className="min-h-[70vh] flex items-center justify-center bg-neutral-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-3xl shadow-xl max-w-md w-full p-8 border border-neutral-200 text-center relative overflow-hidden animate-in fade-in zoom-in-95 duration-300">
                    {/* Confetti / Sparkle top accent */}
                    <div className="absolute top-0 inset-x-0 h-2.5 bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600"></div>
                    
                    {/* Animated Popping Icon */}
                    <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-emerald-100 text-emerald-600 mb-6 relative">
                        {/* Bouncing checkmark */}
                        <svg className="h-10 w-10 stroke-[3.5] animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-20 animate-ping"></span>
                    </div>
                    
                    <h2 className="text-3xl font-black text-neutral-900 tracking-tight mb-2 uppercase">
                        Congratulations!
                    </h2>
                    <p className="text-sm font-semibold text-neutral-500 mb-8 leading-relaxed">
                        Your order has been placed successfully.<br/>Thank you for shopping with Thiya Fashions!
                    </p>
                    
                    {/* Order Details Card */}
                    <div className="bg-neutral-50 rounded-2xl p-6 border border-neutral-150 text-left space-y-4 mb-8">
                        <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest border-b border-neutral-200 pb-2">
                            Order Summary
                        </h3>
                        <div className="text-sm text-neutral-700 space-y-2.5">
                            <div className="flex justify-between items-start">
                                <span className="text-neutral-500 font-medium">Item:</span>
                                <span className="font-bold text-neutral-900 text-right max-w-[200px] truncate" title={title}>{title || 'Product'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-neutral-500 font-medium">Quantity:</span>
                                <span className="font-bold text-neutral-900">{quantity || 1}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-neutral-500 font-medium">Amount Paid:</span>
                                <span className="font-black text-neutral-900">₹{formattedAmount}</span>
                            </div>
                            {transactionId && (
                                <div className="flex flex-col pt-3 border-t border-neutral-200 gap-1.5">
                                    <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Transaction ID</span>
                                    <span className="font-mono text-[11px] sm:text-xs text-neutral-700 bg-white border border-neutral-200 px-3 py-2.5 rounded-lg flex items-center justify-between select-all leading-none font-bold">
                                        {transactionId}
                                        <svg className="w-4 h-4 text-neutral-400 ml-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path></svg>
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                    
                    {/* Actions */}
                    <div>
                        <button
                            onClick={() => router.push('/products')}
                            className="w-full py-4 bg-pink-600 text-white rounded-xl text-sm font-bold uppercase tracking-widest hover:bg-pink-700 transition-colors shadow-lg shadow-pink-600/20 active:scale-[0.98] transform duration-100"
                        >
                            Continue Shopping
                        </button>
                    </div>
                </div>
            </div>
        </ThiyaLayout>
    );
}
