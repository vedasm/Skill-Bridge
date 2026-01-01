# Simultaneous Deployment Guide (Vercel) 🚀

This guide explains how to deploy both the **Frontend** and **Backend** of SkillBridge at the same time using Vercel's **Monorepo** support.

**The Concept:**
You will connect your single GitHub repository to Vercel **twice**.
1.  One project for the **Backend** (Python API).
2.  One project for the **Frontend** (React UI).

**✨ The Magic:**
Once set up, every time you push code to GitHub (`git push`), Vercel will trigger deployments for **BOTH** projects simultaneously. They will stay in sync automatically!

---

## Part 1: Deploy the Backend (Base)

*We deploy this first to get the API URL needed for the frontend.*

1.  **Push to GitHub**: Ensure your latest code is on GitHub.
2.  **Login to Vercel**: Go to [vercel.com](https://vercel.com) and log in.
3.  **Create Project**: Click **"Add New..."** -> **"Project"**.
4.  **Import Repo**: Find your `skillbridge` repository and click **Import**.
5.  **Configure Backend**:
    *   **Project Name**: `skillbridge-api`
    *   **Framework Preset**: Select **FastAPI** (or Other).
    *   **Root Directory**: **IMPORTANT!** Click "Edit" and select `backend`.
    *   **Environment Variables**: Add your API keys:
        *   `GEMINI_API_KEY`: `...`
        *   `GROQ_API_KEY`: `...`
6.  **Deploy**: Click **Deploy**.
7.  **Copy Domain**: Once live, copy the URL (e.g., `https://skillbridge-api.vercel.app`).

---

## Part 2: Deploy the Frontend (UI)

*Now we deploy the UI and connect it to the Backend.*

1.  **Create Project**: Go back to Vercel Dashboard and click **"Add New..."** -> **"Project"**.
2.  **Import Repo**: Import the **SAME** `skillbridge` repository again.
3.  **Configure Frontend**:
    *   **Project Name**: `skillbridge-ui`
    *   **Framework Preset**: **Vite** (It should auto-detect).
    *   **Root Directory**: **IMPORTANT!** Click "Edit" and select `frontend`.
    *   **Environment Variables**:
        *   `VITE_API_URL`: Paste your backend URL + `/api`
        *   *Example*: `https://skillbridge-api.vercel.app/api`
        *   *(Note: Ensure you include `/api` at the end as our backend routes start with it)*
4.  **Deploy**: Click **Deploy**.

---

## 🎉 Success!

You now have a production-ready CI/CD pipeline:
*   **One Push**: `git push origin main` updates BOTH apps.
*   **Zero Downtime**: Vercel handles the switchover.

**Test it out:**
Open your Frontend URL (`https://skillbridge-ui.vercel.app`) and try analyzing a resume. It will communicate with your Backend URL automatically!
