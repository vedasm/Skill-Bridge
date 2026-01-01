import { useAnalysis } from './hooks/useAnalysis';
import FileUpload from './components/FileUpload';
import JobDescriptionInput from './components/JobDescriptionInput';
import AnalysisResults from './components/AnalysisResults';
import LoadingSpinner from './components/LoadingSpinner';
import { MIN_JOB_DESCRIPTION_LENGTH } from './utils/constants';

import ParallaxBackground from './components/ParallaxBackground';

function App() {
    const {
        file,
        setFile,
        jobDescription,
        setJobDescription,
        results,
        loading,
        error,
        analyze,
        reset,
    } = useAnalysis();

    const canAnalyze = file && jobDescription.length >= MIN_JOB_DESCRIPTION_LENGTH && !loading;

    return (
        <div className="min-h-screen py-6 px-3 sm:px-6 lg:px-8 relative overflow-x-hidden">
            <ParallaxBackground />

            <div className="relative w-full max-w-7xl mx-auto z-10">
                {/* Header */}
                <header className="text-center mb-8 sm:mb-12">
                    <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold mb-4">
                        <span className="gradient-text">SkillBridge</span>
                    </h1>
                    <p className="text-base sm:text-xl text-slate-400 max-w-2xl mx-auto px-2">
                        AI-powered ATS resume analyzer with personalized skill development roadmaps
                    </p>

                    {/* Feature badges */}
                    <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mt-6">
                        {['ATS Scoring', 'Keyword Analysis', 'Skill Roadmap'].map((feature) => (
                            <span
                                key={feature}
                                className="px-3 py-1 sm:px-4 sm:py-1.5 rounded-full bg-white/5 border border-white/10 text-xs sm:text-sm text-slate-400"
                            >
                                {feature}
                            </span>
                        ))}
                    </div>
                </header>

                {/* Main content */}
                {!results ? (
                    <main className="space-y-8">
                        {/* Input section */}
                        <div className="glass p-6 sm:p-8 rounded-2xl space-y-8">
                            <FileUpload file={file} onFileChange={setFile} />
                            <JobDescriptionInput value={jobDescription} onChange={setJobDescription} />

                            {/* Error message */}
                            {error && (
                                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 flex items-start gap-3">
                                    <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span>{error}</span>
                                </div>
                            )}

                            {/* Analyze button */}
                            <div className="flex justify-center pt-4">
                                <button
                                    onClick={analyze}
                                    disabled={!canAnalyze}
                                    className="btn-primary text-lg px-12 py-4 animate-pulse-glow"
                                >
                                    {loading ? (
                                        <span className="flex items-center gap-2">
                                            <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Analyzing...
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-2">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                            </svg>
                                            Analyze Resume
                                        </span>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Loading state */}
                        {loading && (
                            <div className="glass p-8 rounded-2xl">
                                <LoadingSpinner />
                            </div>
                        )}

                        {/* How it works section */}
                        <section className="glass p-6 sm:p-8 rounded-2xl">
                            <h2 className="text-xl font-bold mb-6 gradient-text">How it works</h2>
                            <div className="grid sm:grid-cols-3 gap-6">
                                {[
                                    {
                                        icon: '📄',
                                        title: 'Upload Resume',
                                        description: 'Drop your PDF, DOCX, or TXT resume file',
                                    },
                                    {
                                        icon: '💼',
                                        title: 'Add Job Description',
                                        description: 'Paste the target job description',
                                    },
                                    {
                                        icon: '🎯',
                                        title: 'Get Analysis',
                                        description: 'Receive ATS score and skill roadmap',
                                    },
                                ].map((step, idx) => (
                                    <div key={idx} className="text-center">
                                        <div className="w-14 h-14 mx-auto mb-3 rounded-xl bg-gradient-to-br from-purple-500/20 to-indigo-500/20 flex items-center justify-center text-2xl">
                                            {step.icon}
                                        </div>
                                        <h3 className="font-semibold text-slate-200 mb-1">{step.title}</h3>
                                        <p className="text-sm text-slate-500">{step.description}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </main>
                ) : (
                    <AnalysisResults results={results} onReset={reset} />
                )}

                {/* Footer */}
                <footer className="mt-12 text-center text-slate-500 text-sm">
                    <p>
                        Built with ✨ Gemini AI & 🦙 Llama 3.1
                    </p>
                </footer>
            </div>
        </div>
    );
}

export default App;
