import { getScoreColor, getScoreLabel } from '../utils/constants';

/**
 * Circular score display with animated progress ring
 */
export default function ScoreDisplay({ score, label = 'ATS Score', size = 'large' }) {
    const colors = getScoreColor(score);
    const scoreLabel = getScoreLabel(score);

    const sizes = {
        small: { container: 'w-24 h-24', text: 'text-2xl', label: 'text-xs' },
        medium: { container: 'w-32 h-32', text: 'text-3xl', label: 'text-sm' },
        large: { container: 'w-44 h-44', text: 'text-5xl', label: 'text-base' },
    };

    const currentSize = sizes[size] || sizes.large;

    // SVG circle calculations
    const radius = size === 'large' ? 54 : size === 'medium' ? 40 : 30;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (score / 100) * circumference;

    return (
        <div className="flex flex-col items-center">
            <div className={`relative ${currentSize.container}`}>
                {/* Background glow */}
                <div
                    className="absolute inset-0 rounded-full blur-xl opacity-30"
                    style={{ background: colors.stroke }}
                ></div>

                {/* SVG Ring */}
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                    {/* Background circle */}
                    <circle
                        cx="60"
                        cy="60"
                        r={radius}
                        fill="transparent"
                        stroke="rgba(148, 163, 184, 0.1)"
                        strokeWidth="8"
                    />

                    {/* Progress circle */}
                    <circle
                        cx="60"
                        cy="60"
                        r={radius}
                        fill="transparent"
                        stroke={colors.stroke}
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        style={{
                            transition: 'stroke-dashoffset 1s ease-out',
                            filter: `drop-shadow(0 0 8px ${colors.stroke})`,
                        }}
                    />
                </svg>

                {/* Center content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span
                        className={`font-bold ${currentSize.text}`}
                        style={{ color: colors.text }}
                    >
                        {score}
                    </span>
                    <span className="text-slate-400 text-sm">{scoreLabel}</span>
                </div>
            </div>

            <p className={`mt-3 text-slate-300 font-medium ${currentSize.label}`}>
                {label}
            </p>
        </div>
    );
}

/**
 * Mini score bar for section scores
 */
export function ScoreBar({ label, score, icon }) {
    const colors = getScoreColor(score);

    return (
        <div className="flex items-center gap-3">
            {icon && <span className="text-lg">{icon}</span>}
            <div className="flex-1">
                <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-300">{label}</span>
                    <span style={{ color: colors.text }}>{score}%</span>
                </div>
                <div className="progress-bar">
                    <div
                        className="progress-bar-fill"
                        style={{
                            width: `${score}%`,
                            background: `linear-gradient(90deg, ${colors.stroke}, ${colors.text})`,
                        }}
                    ></div>
                </div>
            </div>
        </div>
    );
}
