export default function LogoLoader({ text = "Loading Collection..." }) {
    return (
        <div className="flex flex-col justify-center items-center py-20 w-full select-none">
            <div className="relative">
                {/* Pulsing ring */}
                <div className="absolute inset-0 rounded-full bg-pink-500/20 animate-ping"></div>
                {/* Spinning border */}
                <div className="absolute -inset-1.5 rounded-full border-2 border-dashed border-pink-600 animate-spin"></div>
                {/* Logo */}
                <img 
                    src="/images/thiya_logo.png" 
                    alt="Loading..." 
                    className="relative h-16 w-16 object-cover rounded-full shadow-lg border-2 border-pink-500/50 bg-white"
                />
            </div>
            {text && (
                <span className="mt-6 text-xs font-black tracking-widest text-neutral-400 uppercase animate-pulse">
                    {text}
                </span>
            )}
        </div>
    );
}
