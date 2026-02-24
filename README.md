# Assistant, PHD — The Possibility Engine

**Assistant, PHD** is a sovereign, privacy-first AI ecosystem designed to transform raw information and telemetry into actionable insights and real-world results. By applying the rigor of **Site Reliability Engineering (SRE)** to the human experience, Assistant, PHD helps you architect your future with 99.99% uptime on your personal goals.

## 🚀 The Three Tracks of "PHD"

The platform adapts its core intelligence based on your current stage of life:

1.  **Personal Homework Dashboard (For Teens & Students)**  
    A command center for academic excellence. Streamline assignments, leverage AI study partners, and build robust study habits.
2.  **Professional Help & Development (For Career Growth)**  
    The executive assistant for the modern professional. SRE-style observability for projects, networking, and skill acquisition.
3.  **Productivity, Habits, & Discipline (For Everyone)**  
    The optimization track. Refine the human algorithm by mastering daily loops that lead to long-term wealth, health, and success.

## 🛠️ Core Features

-   **SRE for Life**: Treat your habits and goals like a distributed system. Use private telemetry and observability to ensure your life "runs" at peak performance.
-   **Total Sovereignty**: Your data is yours. We prioritize local-first intelligence and end-to-end encrypted sync. No third parties, no tracking.
-   **Independent AI Integration**: Support for independent and open-source backends including **Groq**, **Hugging Face**, and **X.AI (Grok)**, alongside local-first models.
-   **The Creative Lab**: Integrated tools for professional media enhancement via `touchupmyphoto.com` and `touchupmyvideo.com`.

## 💻 Tech Stack

-   **Frontend**: React 19, Vite, Tailwind CSS v4, Framer Motion.
-   **Icons**: Lucide React.
-   **AI**: Gemini 2.5 Flash (via Google AI SDK).
-   **Backend**: Node.js (Static Shim for Cloud Run).

## 🛠️ Local Development

### Prerequisites
- Node.js (v20+)
- A Gemini API Key (from [Google AI Studio](https://aistudio.google.com/))

### Setup
1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root:
   ```env
   VITE_GEMINI_API_KEY=your_api_key_here
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
   The site will be available at `http://localhost:3000` (or `3001` if configured).

## ☁️ Deployment

This platform is optimized for **Google Cloud Run**.

1. Build the production assets:
   ```bash
   npm run build
   ```
2. Deploy using the gcloud CLI:
   ```bash
   gcloud run deploy assistant-phd-com --source . --project=<ProjectName> --region=us-west1 --allow-unauthenticated
   ```

## 📜 Roadmap & Planning
Detailed planning notes and strategy documents can be found in the `docs/planning/` and `conductor/` directories.

---
© 2026 Assistant, PHD. All Rights Reserved. Own Your Data.
