/**
 * Skill development roadmap component
 */
export default function SkillRoadmap({ roadmap }) {
    if (!roadmap) return null;

    const { critical_skills = [], recommended_skills = [], beneficial_skills = [], timeline_overview } = roadmap;

    const getPriorityStyle = (priority) => {
        switch (priority?.toLowerCase()) {
            case 'high':
                return { badge: 'badge-high', icon: '🎯', border: 'border-red-500/30' };
            case 'medium':
                return { badge: 'badge-medium', icon: '📚', border: 'border-amber-500/30' };
            case 'low':
                return { badge: 'badge-low', icon: '💡', border: 'border-green-500/30' };
            default:
                return { badge: 'badge-medium', icon: '📌', border: 'border-slate-500/30' };
        }
    };

    const SkillCard = ({ skill, index }) => {
        const style = getPriorityStyle(skill.priority);

        return (
            <div
                className={`card border-l-4 ${style.border} animate-fade-in-up`}
                style={{ animationDelay: `${index * 100}ms` }}
            >
                <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <span className="text-xl">{style.icon}</span>
                        <h4 className="text-lg font-semibold text-slate-200">{skill.skill}</h4>
                    </div>
                    <span className={`badge ${style.badge}`}>{skill.priority}</span>
                </div>

                {skill.timeline && (
                    <div className="flex items-center gap-2 text-sm text-slate-400 mb-3">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{skill.timeline}</span>
                    </div>
                )}

                {skill.resources && skill.resources.length > 0 && (
                    <div className="mb-3">
                        <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Resources</p>
                        <ul className="space-y-1">
                            {skill.resources.slice(0, 3).map((resource, idx) => {
                                const isUrl = resource.startsWith('http');
                                const href = isUrl ? resource : `https://www.google.com/search?q=${encodeURIComponent(resource + ' learning')}`;

                                return (
                                    <li key={idx} className="text-sm flex items-center gap-2">
                                        <span className="w-1 h-1 rounded-full bg-purple-400 flex-shrink-0"></span>
                                        <a
                                            href={href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-purple-400 hover:text-purple-300 hover:underline truncate"
                                        >
                                            {resource}
                                        </a>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                )}

                {skill.projects && skill.projects.length > 0 && (
                    <div>
                        <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Project Ideas</p>
                        <ul className="space-y-1">
                            {skill.projects.slice(0, 2).map((project, idx) => (
                                <li key={idx} className="text-sm text-slate-400 flex items-center gap-2">
                                    <span className="w-1 h-1 rounded-full bg-slate-400"></span>
                                    {project}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        );
    };

    const SkillSection = ({ title, skills, emptyMessage }) => {
        if (!skills || skills.length === 0) return null;

        return (
            <div className="mb-8">
                <h3 className="text-xl font-bold mb-4 gradient-text">{title}</h3>
                <div className="grid gap-4 md:grid-cols-2">
                    {skills.map((skill, idx) => (
                        <SkillCard key={idx} skill={skill} index={idx} />
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-3">
                    <span className="text-3xl">🗺️</span>
                    Skill Development Roadmap
                </h2>
            </div>

            {/* Timeline overview */}
            {timeline_overview && (
                <div className="glass p-4 rounded-xl border-l-4 border-purple-500/50">
                    <div className="flex items-center gap-2 text-purple-400 mb-1">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                        <span className="font-semibold">Timeline Overview</span>
                    </div>
                    <p className="text-slate-300">{timeline_overview}</p>
                </div>
            )}

            {/* Critical Skills */}
            <SkillSection
                title="🎯 Critical Skills (Start Immediately)"
                skills={critical_skills}
            />

            {/* Recommended Skills */}
            <SkillSection
                title="📚 Important Skills (Next 2 months)"
                skills={recommended_skills}
            />

            {/* Beneficial Skills */}
            <SkillSection
                title="💡 Beneficial Skills (3+ months)"
                skills={beneficial_skills}
            />

            {/* Empty state */}
            {critical_skills.length === 0 && recommended_skills.length === 0 && beneficial_skills.length === 0 && (
                <div className="text-center py-8 text-slate-500">
                    <p>No skill gaps identified. Your resume matches the job requirements well!</p>
                </div>
            )}
        </div>
    );
}
