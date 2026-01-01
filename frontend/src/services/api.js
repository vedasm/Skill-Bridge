/**
 * API service for communicating with the SkillBridge backend
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

/**
 * Convert file to base64
 */
export const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            // Remove data URL prefix (e.g., "data:application/pdf;base64,")
            const base64 = reader.result.split(',')[1];
            resolve(base64);
        };
        reader.onerror = (error) => reject(error);
    });
};

/**
 * Get file extension from file name or type
 */
export const getFileType = (file) => {
    const extension = file.name.split('.').pop().toLowerCase();
    if (['pdf', 'docx', 'txt'].includes(extension)) {
        return extension;
    }
    // Fallback to mime type
    if (file.type === 'application/pdf') return 'pdf';
    if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') return 'docx';
    if (file.type === 'text/plain') return 'txt';
    return null;
};

/**
 * Analyze resume against job description
 */
export const analyzeResume = async (file, jobDescription) => {
    const fileType = getFileType(file);

    if (!fileType) {
        throw new Error('Unsupported file type. Please upload PDF, DOCX, or TXT files.');
    }

    const base64Content = await fileToBase64(file);

    const response = await fetch(`${API_BASE_URL}/analyze`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            resume: base64Content,
            job_description: jobDescription,
            file_type: fileType,
            file_name: file.name,
        }),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Analysis failed with status ${response.status}`);
    }

    return response.json();
};

/**
 * Health check for the API
 */
export const checkHealth = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/health`);
        return response.ok;
    } catch {
        return false;
    }
};
