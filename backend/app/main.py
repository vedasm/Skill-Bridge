"""
SkillBridge API - FastAPI Application
"""
import os
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan manager"""
    logger.info("Starting SkillBridge API...")
    
    # Check for API keys
    gemini_key = os.getenv("GEMINI_API_KEY")
    groq_key = os.getenv("GROQ_API_KEY")
    
    if gemini_key:
        logger.info("✓ Gemini API key configured")
    else:
        logger.warning("✗ Gemini API key not found")
    
    if groq_key:
        logger.info("✓ Groq API key configured (fallback)")
    else:
        logger.warning("✗ Groq API key not found (fallback unavailable)")
    
    if not gemini_key and not groq_key:
        logger.error("No AI API keys configured! Set GEMINI_API_KEY or GROQ_API_KEY")
    
    yield
    
    logger.info("Shutting down SkillBridge API...")


# Create FastAPI app
app = FastAPI(
    title="SkillBridge API",
    description="AI-Powered ATS Resume Analyzer with Skill Development Roadmaps",
    version="1.0.0",
    lifespan=lifespan,
)

# Configure CORS
cors_origins = os.getenv(
    "CORS_ORIGINS",
    "http://localhost:5173,http://localhost:3000"
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Import and include routes
from app.routes.analyze import router as analyze_router
app.include_router(analyze_router)


@app.get("/")
async def root():
    """Root endpoint with API info"""
    return {
        "name": "SkillBridge API",
        "version": "1.0.0",
        "description": "AI-Powered ATS Resume Analyzer",
        "endpoints": {
            "analyze": "POST /api/analyze",
            "health": "GET /api/health"
        }
    }


# For Vercel serverless deployment
handler = app
