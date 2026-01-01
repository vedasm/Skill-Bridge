/**
 * Application constants
 */

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ALLOWED_EXTENSIONS = ['pdf', 'docx', 'txt'];
export const MIN_JOB_DESCRIPTION_LENGTH = 50;
export const MAX_JOB_DESCRIPTION_LENGTH = 10000;

export const SCORE_COLORS = {
    excellent: { bg: 'rgba(34, 197, 94, 0.2)', stroke: '#22c55e', text: '#4ade80' },
    good: { bg: 'rgba(132, 204, 22, 0.2)', stroke: '#84cc16', text: '#a3e635' },
    average: { bg: 'rgba(251, 191, 36, 0.2)', stroke: '#fbbf24', text: '#fbbf24' },
    poor: { bg: 'rgba(249, 115, 22, 0.2)', stroke: '#f97316', text: '#fb923c' },
    critical: { bg: 'rgba(239, 68, 68, 0.2)', stroke: '#ef4444', text: '#f87171' },
};

export const getScoreColor = (score) => {
    if (score >= 80) return SCORE_COLORS.excellent;
    if (score >= 65) return SCORE_COLORS.good;
    if (score >= 50) return SCORE_COLORS.average;
    if (score >= 35) return SCORE_COLORS.poor;
    return SCORE_COLORS.critical;
};

export const getScoreLabel = (score) => {
    if (score >= 80) return 'Excellent';
    if (score >= 65) return 'Good';
    if (score >= 50) return 'Average';
    if (score >= 35) return 'Needs Work';
    return 'Critical';
};

export const PRIORITY_LABELS = {
    High: 'Critical',
    Medium: 'Important',
    Low: 'Beneficial',
};
