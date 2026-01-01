"""
Pydantic models for request/response validation
"""
from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, List, Dict, Any


class SkillItem(BaseModel):
    """Individual skill with learning recommendations"""
    skill: str
    priority: str  # High, Medium, Low
    timeline: str
    resources: List[str] = []
    projects: List[str] = []


class SkillRoadmap(BaseModel):
    """Structured skill development roadmap"""
    critical_skills: List[SkillItem] = []
    recommended_skills: List[SkillItem] = []
    beneficial_skills: List[SkillItem] = []
    timeline_overview: str = ""


class SectionScores(BaseModel):
    """Scores for individual resume sections"""
    contact_info: int = Field(ge=0, le=100, default=0)
    summary: int = Field(ge=0, le=100, default=0)
    experience: int = Field(ge=0, le=100, default=0)
    skills: int = Field(ge=0, le=100, default=0)
    education: int = Field(ge=0, le=100, default=0)
    certifications: int = Field(ge=0, le=100, default=0)
    achievements: int = Field(ge=0, le=100, default=0)


class Analysis(BaseModel):
    """Detailed analysis breakdown"""
    strengths: List[str] = []
    weaknesses: List[str] = []
    missing_keywords: List[str] = []
    section_scores: SectionScores = SectionScores()
    format_score: int = Field(ge=0, le=100, default=0)


class AnalyzeRequest(BaseModel):
    """Request model for resume analysis"""
    resume: str  # Base64 encoded file or plain text
    job_description: str = Field(min_length=50, max_length=10000)
    file_type: str = Field(pattern="^(pdf|docx|txt)$")
    file_name: Optional[str] = None


class AnalyzeResponse(BaseModel):
    """Response model for resume analysis"""
    model_config = ConfigDict(protected_namespaces=())
    
    ats_score: int = Field(ge=0, le=100)
    keyword_match_rate: int = Field(ge=0, le=100)
    analysis: Analysis
    skill_roadmap: SkillRoadmap
    recommendations: List[str] = []
    model_used: str = "gemini"  # Track which AI model was used


class ErrorResponse(BaseModel):
    """Standard error response"""
    error: str
    detail: Optional[str] = None
    code: str = "UNKNOWN_ERROR"
