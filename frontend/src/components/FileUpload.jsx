import { useCallback, useState } from 'react';
import { MAX_FILE_SIZE, ALLOWED_EXTENSIONS } from '../utils/constants';

/**
 * Drag and drop file upload component
 */
export default function FileUpload({ file, onFileChange }) {
    const [isDragging, setIsDragging] = useState(false);
    const [error, setError] = useState(null);

    const validateFile = (file) => {
        const extension = file.name.split('.').pop().toLowerCase();

        if (!ALLOWED_EXTENSIONS.includes(extension)) {
            return `Invalid file type. Allowed: ${ALLOWED_EXTENSIONS.join(', ').toUpperCase()}`;
        }

        if (file.size > MAX_FILE_SIZE) {
            return `File too large. Maximum size: ${MAX_FILE_SIZE / (1024 * 1024)}MB`;
        }

        return null;
    };

    const handleFile = useCallback((selectedFile) => {
        const validationError = validateFile(selectedFile);

        if (validationError) {
            setError(validationError);
            return;
        }

        setError(null);
        onFileChange(selectedFile);
    }, [onFileChange]);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        setIsDragging(false);

        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile) {
            handleFile(droppedFile);
        }
    }, [handleFile]);

    const handleDragOver = useCallback((e) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleInputChange = useCallback((e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            handleFile(selectedFile);
        }
    }, [handleFile]);

    const removeFile = useCallback(() => {
        onFileChange(null);
        setError(null);
    }, [onFileChange]);

    const formatFileSize = (bytes) => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

    return (
        <div className="w-full">
            <label className="block text-lg font-semibold mb-3 gradient-text">
                📄 Upload Resume
            </label>

            {!file ? (
                <div
                    className={`dropzone ${isDragging ? 'active' : ''}`}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onClick={() => document.getElementById('file-input').click()}
                >
                    <input
                        id="file-input"
                        type="file"
                        accept=".pdf,.docx,.txt"
                        onChange={handleInputChange}
                        className="hidden"
                    />

                    <div className="space-y-4">
                        {/* Upload icon */}
                        <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-sky-500/20 to-green-500/20 flex items-center justify-center">
                            <svg className="w-8 h-8 text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                        </div>

                        <div>
                            <p className="text-slate-700 font-medium">
                                {isDragging ? 'Drop your file here' : 'Drag & drop your resume'}
                            </p>
                            <p className="text-slate-500 text-sm mt-1">
                                or <span className="text-sky-500 underline cursor-pointer hover:text-sky-600">browse files</span>
                            </p>
                        </div>

                        <p className="text-slate-500 text-xs">
                            Supports PDF, DOCX, TXT (Max 5MB)
                        </p>
                    </div>
                </div>
            ) : (
                <div className="dropzone has-file">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            {/* File type icon */}
                            <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center">
                                <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>

                            <div className="text-left">
                                <p className="text-slate-800 font-medium truncate max-w-[200px] sm:max-w-[300px]">
                                    {file.name}
                                </p>
                                <p className="text-slate-500 text-sm">
                                    {formatFileSize(file.size)}
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                removeFile();
                            }}
                            className="p-2 rounded-lg hover:bg-red-100 text-slate-400 hover:text-red-500 transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
            )}

            {error && (
                <p className="mt-2 text-red-500 text-sm flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {error}
                </p>
            )}
        </div>
    );
}
