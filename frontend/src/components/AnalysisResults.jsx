import { useRef, useState } from 'react';
import { toPng } from 'html-to-image';
import jsPDF from 'jspdf';
import ScoreDisplay, { ScoreBar } from './ScoreDisplay';
import SkillRoadmap from './SkillRoadmap';

/**
 * Complete analysis results display
 */
export default function AnalysisResults({ results, onReset }) {
    const resultsRef = useRef(null);
    const [isExporting, setIsExporting] = useState(false);

    if (!results) return null;

    const {
        ats_score,
        keyword_match_rate,
        analysis,
        skill_roadmap,
        recommendations,
        model_used
    } = results;

    const sectionScores = analysis?.section_scores || {};

    const sectionIcons = {
        contact_info: '📧',
        summary: '📝',
        experience: '💼',
        skills: '🛠️',
        education: '🎓',
        certifications: '📜',
        achievements: '🏆',
    };

    const handleExportPDF = async () => {
        if (!resultsRef.current) return;

        setIsExporting(true);
        try {
            const element = resultsRef.current;

            // Use html-to-image which supports modern CSS (oklab, etc)
            const dataUrl = await toPng(element, {
                cacheBust: true,
                backgroundColor: '#f0f9ff', // Enforce light blue background
                style: {
                    // Fix for margin issues in capture
                    margin: '0',
                    padding: '20px',
                }
            });

            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();

            const img = new Image();
            img.src = dataUrl;

            await new Promise((resolve) => {
                img.onload = resolve;
            });

            const imgWidth = pdfWidth;
            const imgHeight = (img.height * imgWidth) / img.width;

            let heightLeft = imgHeight;
            let position = 0;

            // First page
            pdf.addImage(dataUrl, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pdfHeight;

            // Extra pages
            while (heightLeft >= 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(dataUrl, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= pdfHeight;
            }

            pdf.save('SkillBridge-Analysis.pdf');
        } catch (error) {
            console.error('PDF Export failed:', error);
            alert(`Failed to export PDF: ${error.message || 'Unknown error'}`);
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <div className="space-y-8 animate-fade-in-up">
            {/* Header with actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
                <h2 className="text-2xl font-bold text-slate-900 text-center sm:text-left">Analysis Results</h2>

                <div className="flex flex-wrap items-center justify-center sm:justify-end gap-3 w-full sm:w-auto">
                    <button
                        onClick={handleExportPDF}
                        disabled={isExporting}
                        className="px-4 py-2 rounded-lg bg-emerald-100 text-emerald-600 hover:bg-emerald-200 border border-emerald-200 transition-all flex items-center gap-2 text-sm sm:text-base font-medium"
                    >
                        {isExporting ? (
                            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                        )}
                        {isExporting ? 'Exporting...' : 'Export PDF'}
                    </button>

                    <button
                        onClick={onReset}
                        className="px-4 py-2 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 transition-colors flex items-center gap-2 text-sm sm:text-base font-medium"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        New Analysis
                    </button>
                </div>
            </div>

            {/* Content to capture */}
            <div ref={resultsRef} className="space-y-8 p-4 rounded-xl bg-white/50 border border-slate-200/50">
                {/* Main scores section */}
                <div className="glass p-8 rounded-2xl relative overflow-hidden shadow-lg bg-white/80">
                    {/* Background Glow Effect */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-sky-500/10 blur-[80px] rounded-full pointer-events-none" />

                    <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8 items-center justify-items-center">
                        {/* Keyword Match - Left (Desktop) / 2nd (Mobile) */}
                        <div className="order-2 md:order-1">
                            <ScoreDisplay
                                score={keyword_match_rate}
                                label="Keyword Match"
                                size="medium"
                            />
                        </div>

                        {/* ATS Score - Center (Desktop) / 1st (Mobile) */}
                        <div className="order-1 md:order-2 transform scale-110 sm:scale-125 transition-transform duration-700 ease-out">
                            <ScoreDisplay
                                score={ats_score}
                                label="ATS Score"
                                size="large"
                            />
                        </div>

                        {/* Format Score - Right (Desktop) / 3rd (Mobile) */}
                        <div className="order-3 md:order-3">
                            <ScoreDisplay
                                score={analysis?.format_score || 0}
                                label="Format Score"
                                size="medium"
                            />
                        </div>
                    </div>

                    {/* Model indicator */}
                    {model_used && (
                        <div className="mt-8 text-center border-t border-slate-200 pt-4">
                            <span className="text-xs font-medium text-slate-500 flex items-center justify-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-emerald-500/50 animate-pulse"></span>
                                Analyzed with {model_used === 'gemini' ? '✨ Gemini AI' : '🦙 Llama 3.3 (Groq)'}
                            </span>
                        </div>
                    )}
                </div>

                {/* Section Scores */}
                <div className="glass p-6 rounded-2xl bg-white/60">
                    <h3 className="text-xl font-bold mb-6 gradient-text flex items-center gap-2">
                        <span>📊</span> Section Analysis
                    </h3>
                    <div className="grid gap-4 md:grid-cols-2">
                        {Object.entries(sectionScores).map(([key, score]) => (
                            <ScoreBar
                                key={key}
                                label={key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                                score={score}
                                icon={sectionIcons[key]}
                            />
                        ))}
                    </div>
                </div>

                {/* Strengths & Weaknesses */}
                <div className="grid gap-6 md:grid-cols-2">
                    {/* Strengths */}
                    <div className="card border-l-4 border-green-500/50 bg-white/60">
                        <h3 className="text-lg font-bold mb-4 text-green-600 flex items-center gap-2">
                            <span>✅</span> Strengths
                        </h3>
                        <ul className="space-y-2">
                            {(analysis?.strengths || []).map((strength, idx) => (
                                <li key={idx} className="text-slate-700 flex items-start gap-2">
                                    <span className="text-green-500 mt-1">•</span>
                                    <span>{strength}</span>
                                </li>
                            ))}
                            {(!analysis?.strengths || analysis.strengths.length === 0) && (
                                <li className="text-slate-500">No specific strengths identified</li>
                            )}
                        </ul>
                    </div>

                    {/* Weaknesses */}
                    <div className="card border-l-4 border-amber-500/50 bg-white/60">
                        <h3 className="text-lg font-bold mb-4 text-amber-600 flex items-center gap-2">
                            <span>⚠️</span> Areas to Improve
                        </h3>
                        <ul className="space-y-2">
                            {(analysis?.weaknesses || []).map((weakness, idx) => (
                                <li key={idx} className="text-slate-700 flex items-start gap-2">
                                    <span className="text-amber-500 mt-1">•</span>
                                    <span>{weakness}</span>
                                </li>
                            ))}
                            {(!analysis?.weaknesses || analysis.weaknesses.length === 0) && (
                                <li className="text-slate-500">No specific weaknesses identified</li>
                            )}
                        </ul>
                    </div>
                </div>

                {/* Missing Keywords */}
                {analysis?.missing_keywords && analysis.missing_keywords.length > 0 && (
                    <div className="glass p-6 rounded-2xl bg-white/60">
                        <h3 className="text-xl font-bold mb-4 gradient-text flex items-center gap-2">
                            <span>🔑</span> Missing Keywords
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {analysis.missing_keywords.map((keyword, idx) => (
                                <span
                                    key={idx}
                                    className="px-3 py-1.5 rounded-full bg-red-50 border border-red-200 text-red-600 text-sm"
                                >
                                    {keyword}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Recommendations */}
                {recommendations && recommendations.length > 0 && (
                    <div className="glass p-6 rounded-2xl bg-white/60">
                        <h3 className="text-xl font-bold mb-4 gradient-text flex items-center gap-2">
                            <span>💡</span> Immediate Actions
                        </h3>
                        <ol className="space-y-3">
                            {recommendations.map((rec, idx) => (
                                <li key={idx} className="flex items-start gap-3 text-slate-700">
                                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-sky-500/20 text-sky-600 text-sm flex items-center justify-center font-semibold">
                                        {idx + 1}
                                    </span>
                                    <span>{rec}</span>
                                </li>
                            ))}
                        </ol>
                    </div>
                )}

                {/* Skill Roadmap */}
                <div className="glass p-6 rounded-2xl bg-white/60">
                    <SkillRoadmap roadmap={skill_roadmap} />
                </div>
            </div>
        </div>
    );
}
