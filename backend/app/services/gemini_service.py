"""
AI Service with Gemini (primary) and Groq (fallback) integration
"""
import os
import json
import logging
from typing import Dict, Any, Optional
import re

logger = logging.getLogger(__name__)

# Analysis prompt template
ANALYSIS_PROMPT = """You are an expert ATS (Applicant Tracking System) analyzer and career development advisor with deep knowledge of recruitment technology and hiring processes.

TASK: Analyze the following resume against the job description and provide a comprehensive analysis.

RESUME:
{resume_text}

JOB DESCRIPTION:
{job_description}

Provide your analysis in the following JSON format (no markdown, just pure JSON):
{{
    "ats_score": <integer 0-100>,
    "keyword_match_rate": <integer 0-100>,
    "analysis": {{
        "strengths": ["list of resume strengths related to the job"],
        "weaknesses": ["list of areas needing improvement"],
        "missing_keywords": ["critical keywords from JD missing in resume"],
        "section_scores": {{
            "contact_info": <0-100>,
            "summary": <0-100>,
            "experience": <0-100>,
            "skills": <0-100>,
            "education": <0-100>,
            "certifications": <0-100>,
            "achievements": <0-100>
        }},
        "format_score": <0-100>
    }},
    "skill_roadmap": {{
        "critical_skills": [
            {{
                "skill": "skill name",
                "priority": "High",
                "timeline": "X-Y weeks",
                "resources": ["learning resource 1", "learning resource 2"],
                "projects": ["project idea 1", "project idea 2"]
            }}
        ],
        "recommended_skills": [
            {{
                "skill": "skill name",
                "priority": "Medium",
                "timeline": "X-Y weeks",
                "resources": ["learning resource"],
                "projects": ["project idea"]
            }}
        ],
        "beneficial_skills": [
            {{
                "skill": "skill name",
                "priority": "Low",
                "timeline": "X-Y months",
                "resources": ["learning resource"],
                "projects": ["project idea"]
            }}
        ],
        "timeline_overview": "Overall estimated time to significantly improve ATS score"
    }},
    "recommendations": ["specific actionable recommendation 1", "recommendation 2", "etc"]
}}

IMPORTANT GUIDELINES:
1. ATS Score should reflect how well the resume would perform in automated screening
2. Be specific with missing keywords - use exact terms from the job description
3. Skill roadmap should prioritize skills that will have the most impact on ATS score
4. Include specific, actionable learning resources (course platforms, documentation, etc.). If possible, provide direct URLs.
5. Project ideas should demonstrate the skill in a tangible way
6. Timeline should be realistic for someone learning while working
7. Provide at least 3-5 recommendations that are immediately actionable

Respond ONLY with the JSON object, no additional text or markdown formatting."""


class GeminiService:
    """Primary AI service using Google Gemini"""
    
    def __init__(self):
        self._model = None
    
    @property
    def api_key(self):
        """Load API key at runtime"""
        return os.getenv("GEMINI_API_KEY")
    
    @property
    def model(self):
        if self._model is None:
            import google.generativeai as genai
            genai.configure(api_key=self.api_key)
            self._model = genai.GenerativeModel(
                model_name="gemini-pro",
                generation_config={
                    "temperature": 0.7,
                    "max_output_tokens": 2048,
                    "top_p": 0.95,
                }
            )
        return self._model
    
    def is_available(self) -> bool:
        return bool(self.api_key)
    
    async def analyze(self, resume_text: str, job_description: str) -> Dict[str, Any]:
        """Analyze resume using Gemini"""
        prompt = ANALYSIS_PROMPT.format(
            resume_text=resume_text,
            job_description=job_description
        )
        
        try:
            response = self.model.generate_content(prompt)
            return self._parse_response(response.text)
        except Exception as e:
            logger.error(f"Gemini API error: {e}")
            raise
    
    def _parse_response(self, text: str) -> Dict[str, Any]:
        """Parse JSON response from AI"""
        # Clean up response - remove markdown code blocks if present
        text = text.strip()
        if text.startswith("```"):
            text = re.sub(r'^```(?:json)?\n?', '', text)
            text = re.sub(r'\n?```$', '', text)
        
        try:
            return json.loads(text)
        except json.JSONDecodeError as e:
            logger.error(f"Failed to parse AI response: {e}")
            logger.debug(f"Response text: {text[:500]}")
            raise ValueError("Failed to parse AI response as JSON")


class GroqService:
    """Fallback AI service using Groq (Llama 3.3 70B)"""
    
    def __init__(self):
        self._client = None
    
    @property
    def api_key(self):
        """Load API key at runtime"""
        return os.getenv("GROQ_API_KEY")
    
    @property
    def client(self):
        if self._client is None:
            from groq import Groq
            self._client = Groq(api_key=self.api_key)
        return self._client
    
    def is_available(self) -> bool:
        return bool(self.api_key)
    
    async def analyze(self, resume_text: str, job_description: str) -> Dict[str, Any]:
        """Analyze resume using Groq"""
        prompt = ANALYSIS_PROMPT.format(
            resume_text=resume_text,
            job_description=job_description
        )
        
        try:
            response = self.client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages=[
                    {
                        "role": "system",
                        "content": "You are an expert ATS analyzer. Respond only with valid JSON."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                temperature=0.7,
                max_tokens=4096,
            )
            return self._parse_response(response.choices[0].message.content)
        except Exception as e:
            logger.error(f"Groq API error: {e}")
            raise
    
    def _parse_response(self, text: str) -> Dict[str, Any]:
        """Parse JSON response from AI"""
        text = text.strip()
        if text.startswith("```"):
            text = re.sub(r'^```(?:json)?\n?', '', text)
            text = re.sub(r'\n?```$', '', text)
        
        try:
            return json.loads(text)
        except json.JSONDecodeError as e:
            logger.error(f"Failed to parse Groq response: {e}")
            raise ValueError("Failed to parse AI response as JSON")


class AIService:
    """
    Unified AI service with automatic fallback
    Primary: Gemini
    Fallback: Groq (Llama 3.1 70B)
    """
    
    def __init__(self):
        self.gemini = GeminiService()
        self.groq = GroqService()
    
    async def analyze(self, resume_text: str, job_description: str) -> tuple[Dict[str, Any], str]:
        """
        Analyze resume with automatic fallback
        
        Returns:
            Tuple of (analysis_result, model_used)
        """
        # Debug log API key availability
        gemini_available = self.gemini.is_available()
        groq_available = self.groq.is_available()
        logger.info(f"API key status - Gemini: {gemini_available}, Groq: {groq_available}")
        
        if not gemini_available and not groq_available:
            raise ValueError("No AI service available. Please configure GEMINI_API_KEY or GROQ_API_KEY in your .env file.")
        
        # Try Gemini first
        if gemini_available:
            try:
                logger.info("Attempting analysis with Gemini")
                result = await self.gemini.analyze(resume_text, job_description)
                return result, "gemini"
            except Exception as e:
                logger.warning(f"Gemini failed: {type(e).__name__}: {e}")
                if not groq_available:
                    raise
        
        # Fallback to Groq
        if groq_available:
            try:
                logger.info("Attempting analysis with Groq (fallback)")
                result = await self.groq.analyze(resume_text, job_description)
                return result, "groq"
            except Exception as e:
                logger.error(f"Groq also failed: {type(e).__name__}: {e}")
                raise
        
        raise ValueError("All AI services failed.")


# Singleton instance
ai_service = AIService()
