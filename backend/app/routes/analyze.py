"""
API routes for resume analysis
"""
from fastapi import APIRouter, HTTPException, status
from app.models.schemas import AnalyzeRequest, AnalyzeResponse, ErrorResponse
from app.services.parser_service import ParserService
from app.services.gemini_service import ai_service
from app.utils.validators import validate_request, ValidationError
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api", tags=["analysis"])


@router.post(
    "/analyze",
    response_model=AnalyzeResponse,
    responses={
        400: {"model": ErrorResponse, "description": "Validation error"},
        500: {"model": ErrorResponse, "description": "Server error"},
    }
)
async def analyze_resume(request: AnalyzeRequest):
    """
    Analyze a resume against a job description
    
    - **resume**: Base64 encoded file content or plain text
    - **job_description**: The target job description text
    - **file_type**: File format (pdf, docx, txt)
    """
    try:
        # Validate request
        is_valid, error_msg = validate_request(
            request.resume,
            request.job_description,
            request.file_type
        )
        
        if not is_valid:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=error_msg
            )
        
        # Parse document
        logger.info(f"Parsing {request.file_type} document")
        try:
            resume_text = ParserService.parse(request.resume, request.file_type)
            resume_text = ParserService.clean_text(resume_text)
        except ValueError as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=str(e)
            )
        
        if not resume_text or len(resume_text) < 50:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Could not extract sufficient text from the resume. Please ensure the file is not empty or corrupted."
            )
        
        # Analyze with AI
        logger.info("Starting AI analysis")
        try:
            analysis_result, model_used = await ai_service.analyze(
                resume_text,
                request.job_description
            )
        except ValueError as e:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail=str(e)
            )
        except Exception as e:
            logger.error(f"AI analysis failed: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="AI analysis failed. Please try again later."
            )
        
        # Build response
        response = AnalyzeResponse(
            ats_score=analysis_result.get("ats_score", 0),
            keyword_match_rate=analysis_result.get("keyword_match_rate", 0),
            analysis=analysis_result.get("analysis", {}),
            skill_roadmap=analysis_result.get("skill_roadmap", {}),
            recommendations=analysis_result.get("recommendations", []),
            model_used=model_used
        )
        
        logger.info(f"Analysis complete. ATS Score: {response.ats_score}, Model: {model_used}")
        return response
        
    except HTTPException:
        raise
    except Exception as e:
        logger.exception("Unexpected error during analysis")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred"
        )


@router.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "skillbridge-api",
        "version": "1.0.0"
    }
