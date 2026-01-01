"""
Validation utilities for file uploads and inputs
"""
import os
from typing import Tuple
import base64

# Configuration
MAX_FILE_SIZE = int(os.getenv("MAX_FILE_SIZE", 5242880))  # 5MB default
ALLOWED_EXTENSIONS = os.getenv("ALLOWED_EXTENSIONS", "pdf,docx,txt").split(",")


class ValidationError(Exception):
    """Custom validation error"""
    def __init__(self, message: str, code: str = "VALIDATION_ERROR"):
        self.message = message
        self.code = code
        super().__init__(self.message)


def validate_file_type(file_type: str) -> bool:
    """Validate that file type is allowed"""
    if file_type.lower() not in ALLOWED_EXTENSIONS:
        raise ValidationError(
            f"Unsupported file type: {file_type}. Allowed types: {', '.join(ALLOWED_EXTENSIONS)}",
            "INVALID_FILE_TYPE"
        )
    return True


def validate_file_size(content: str) -> bool:
    """Validate that decoded file content doesn't exceed size limit"""
    try:
        # If it's base64, decode to check actual size
        decoded = base64.b64decode(content)
        size = len(decoded)
    except Exception:
        # If not base64, check string length (text content)
        size = len(content.encode('utf-8'))
    
    if size > MAX_FILE_SIZE:
        max_mb = MAX_FILE_SIZE / (1024 * 1024)
        raise ValidationError(
            f"File size exceeds maximum limit of {max_mb:.1f}MB",
            "FILE_TOO_LARGE"
        )
    return True


def validate_job_description(job_description: str) -> bool:
    """Validate job description has sufficient content"""
    word_count = len(job_description.split())
    
    if word_count < 20:
        raise ValidationError(
            "Job description is too short. Please provide more details (at least 20 words).",
            "JD_TOO_SHORT"
        )
    
    if word_count > 3000:
        raise ValidationError(
            "Job description is too long. Please limit to 3000 words.",
            "JD_TOO_LONG"
        )
    
    return True


def validate_request(resume: str, job_description: str, file_type: str) -> Tuple[bool, str]:
    """
    Validate complete analysis request
    Returns (is_valid, error_message)
    """
    try:
        validate_file_type(file_type)
        validate_file_size(resume)
        validate_job_description(job_description)
        return True, ""
    except ValidationError as e:
        return False, e.message
