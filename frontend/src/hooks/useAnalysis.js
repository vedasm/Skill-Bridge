import { useState, useCallback } from 'react';
import { analyzeResume } from '../services/api';

/**
 * Hook for managing resume analysis state and actions
 */
export function useAnalysis() {
    const [file, setFile] = useState(null);
    const [jobDescription, setJobDescription] = useState('');
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const analyze = useCallback(async () => {
        if (!file || !jobDescription.trim()) {
            setError('Please provide both a resume and job description');
            return;
        }

        setLoading(true);
        setError(null);
        setResults(null);

        try {
            const data = await analyzeResume(file, jobDescription);
            setResults(data);
        } catch (err) {
            setError(err.message || 'Analysis failed. Please try again.');
        } finally {
            setLoading(false);
        }
    }, [file, jobDescription]);

    const reset = useCallback(() => {
        setFile(null);
        setJobDescription('');
        setResults(null);
        setError(null);
    }, []);

    const clearResults = useCallback(() => {
        setResults(null);
        setError(null);
    }, []);

    return {
        file,
        setFile,
        jobDescription,
        setJobDescription,
        results,
        loading,
        error,
        analyze,
        reset,
        clearResults,
    };
}
