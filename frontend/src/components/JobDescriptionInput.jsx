import { useState, useCallback, useEffect } from 'react';
import { MIN_JOB_DESCRIPTION_LENGTH, MAX_JOB_DESCRIPTION_LENGTH } from '../utils/constants';

const STORAGE_KEY = 'skillbridge_recent_jd';

/**
 * Job description input with character counter and localStorage
 */
export default function JobDescriptionInput({ value, onChange }) {
    const [recentJDs, setRecentJDs] = useState([]);
    const [showRecent, setShowRecent] = useState(false);

    const characterCount = value.length;
    const isValid = characterCount >= MIN_JOB_DESCRIPTION_LENGTH;
    const isNearLimit = characterCount > MAX_JOB_DESCRIPTION_LENGTH * 0.9;

    // Load recent JDs from localStorage
    useEffect(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                setRecentJDs(JSON.parse(stored));
            }
        } catch (e) {
            console.error('Failed to load recent JDs:', e);
        }
    }, []);

    // Save to recent when value changes significantly
    const saveToRecent = useCallback((text) => {
        if (text.length < 100) return;

        try {
            const updated = [text, ...recentJDs.filter(jd => jd !== text)].slice(0, 5);
            setRecentJDs(updated);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        } catch (e) {
            console.error('Failed to save JD:', e);
        }
    }, [recentJDs]);

    const handleBlur = useCallback(() => {
        if (value.length >= 100) {
            saveToRecent(value);
        }
    }, [value, saveToRecent]);

    const loadRecent = useCallback((jd) => {
        onChange(jd);
        setShowRecent(false);
    }, [onChange]);

    const clearAll = useCallback(() => {
        onChange('');
        setShowRecent(false);
    }, [onChange]);

    return (
        <div className="w-full">
            <div className="flex items-center justify-between mb-3">
                <label className="text-lg font-semibold gradient-text">
                    💼 Job Description
                </label>

                <div className="flex items-center gap-3">
                    {recentJDs.length > 0 && (
                        <button
                            type="button"
                            onClick={() => setShowRecent(!showRecent)}
                            className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
                        >
                            Recent ({recentJDs.length})
                        </button>
                    )}

                    {value && (
                        <button
                            type="button"
                            onClick={clearAll}
                            className="text-sm text-slate-500 hover:text-slate-400 transition-colors"
                        >
                            Clear
                        </button>
                    )}
                </div>
            </div>

            {/* Recent JDs dropdown */}
            {showRecent && recentJDs.length > 0 && (
                <div className="mb-3 p-3 glass rounded-lg max-h-48 overflow-y-auto">
                    <p className="text-xs text-slate-500 mb-2">Click to load:</p>
                    {recentJDs.map((jd, idx) => (
                        <button
                            key={idx}
                            onClick={() => loadRecent(jd)}
                            className="w-full text-left p-2 rounded hover:bg-white/5 text-sm text-slate-400 truncate transition-colors"
                        >
                            {jd.substring(0, 80)}...
                        </button>
                    ))}
                </div>
            )}

            <div className="relative">
                <textarea
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onBlur={handleBlur}
                    placeholder="Paste the job description here. Include job title, requirements, responsibilities, and qualifications for the most accurate analysis..."
                    className="textarea"
                    maxLength={MAX_JOB_DESCRIPTION_LENGTH}
                />

                {/* Character counter */}
                <div className="absolute bottom-3 right-3 flex items-center gap-2">
                    <span className={`text-xs ${isNearLimit ? 'text-amber-400' :
                        isValid ? 'text-green-400' : 'text-slate-500'
                        }`}>
                        {characterCount.toLocaleString()} / {MAX_JOB_DESCRIPTION_LENGTH.toLocaleString()}
                    </span>
                </div>
            </div>

            {/* Validation hint */}
            {!isValid && characterCount > 0 && (
                <p className="mt-2 text-amber-400 text-sm flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Add at least {MIN_JOB_DESCRIPTION_LENGTH - characterCount} more characters
                </p>
            )}
        </div>
    );
}
