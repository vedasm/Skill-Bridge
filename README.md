# SkillBridge: AI-Powered ATS Resume Analyzer 🚀

SkillBridge is a modern, full-stack application that helps users optimize their resumes for Applicant Tracking Systems (ATS). It uses advanced AI (Gemini Pro & Llama 3) to analyze resumes against job descriptions, providing detailed scoring, keyword analysis, and personalized skill development roadmaps.

## ✨ Features

-   **Deep AI Analysis**: detailed scoring based on ATS criteria.
-   **Multi-Model Support**: Powered by **Gemini Pro** with robust **Llama 3 (via Groq)** fallback.
-   **Skill Roadmaps**: Personalized learning paths with clickable resource links.
-   **PDF Export**: Download high-quality PDF reports of your analysis.
-   **Premium UI**: Glassmorphism design with "Aurora" parallax backgrounds.
-   **Secure**: API keys handled server-side; no data storage.

## 🛠️ Tech Stack

**Frontend:**
-   React 19 + Vite
-   Tailwind CSS v4
-   Framer Motion (Parallax & Animations)
-   html-to-image & jsPDF

**Backend:**
-   FastAPI (Python)
-   Google Gemini API
-   Groq API (Llama 3.3)
-   Uvicorn

## 🚀 Getting Started

### Prerequisites
-   Node.js 18+
-   Python 3.10+
-   API Keys for Gemini (Google AI Studio) and Groq.

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/skillbridge.git
    cd skillbridge
    ```

2.  **Setup Backend**
    ```bash
    cd backend
    python -m venv venv
    source venv/bin/activate  # On Windows: venv\Scripts\activate
    pip install -r requirements.txt
    
    # Create .env file
    cp .env.example .env
    # Add your GEMINI_API_KEY and GROQ_API_KEY to .env
    ```

3.  **Setup Frontend**
    ```bash
    cd ../frontend
    npm install
    ```

### Running Locally

1.  **Start Backend** (Terminal 1)
    ```bash
    cd backend
    uvicorn app.main:app --reload --port 5000
    ```

2.  **Start Frontend** (Terminal 2)
    ```bash
    cd frontend
    npm run dev
    ```
    Open http://localhost:5173 to view the app.

## 📦 Deployment

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for instructions on deploying to Vercel.
