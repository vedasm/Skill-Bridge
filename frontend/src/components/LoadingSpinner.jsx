/**
 * Loading spinner component with pulsing animation
 */
export default function LoadingSpinner({ message = 'Analyzing your resume...' }) {
    return (
        <div className="flex flex-col items-center justify-center py-12">
            {/* Animated circles */}
            <div className="relative w-24 h-24 mb-6">
                <div className="absolute inset-0 rounded-full border-4 border-sky-500/20"></div>
                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-sky-500 animate-spin"></div>
                <div className="absolute inset-2 rounded-full border-4 border-transparent border-t-green-500 animate-spin" style={{ animationDuration: '0.8s', animationDirection: 'reverse' }}></div>
                <div className="absolute inset-4 rounded-full border-4 border-transparent border-t-teal-400 animate-spin" style={{ animationDuration: '1.2s' }}></div>

                {/* Center glow */}
                <div className="absolute inset-6 rounded-full bg-gradient-to-br from-sky-500/30 to-green-500/30 animate-pulse"></div>
            </div>

            {/* Message */}
            <p className="text-lg text-slate-700 font-medium">{message}</p>
            <p className="text-sm text-slate-500 mt-2">This may take a few seconds...</p>

            {/* Progress dots */}
            <div className="flex gap-2 mt-4">
                {[0, 1, 2].map((i) => (
                    <div
                        key={i}
                        className="w-2 h-2 rounded-full bg-sky-500"
                        style={{
                            animation: 'pulse 1s ease-in-out infinite',
                            animationDelay: `${i * 0.2}s`,
                        }}
                    ></div>
                ))}
            </div>
        </div>
    );
}
