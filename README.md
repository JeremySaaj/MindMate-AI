# MindMate AI

An AI-powered learning and wellness platform for students and teachers, built with React, TypeScript, and the Gemini API.

🌐 **Live Demo:** [mind-mate-ai-nine.vercel.app](https://mind-mate-ai-nine.vercel.app)

---

## Features

- **Students** — Access courses, view learning materials, and get AI-generated breakdowns of content
- **Teachers** — Manage courses, monitor student progress, and view analytics via a dedicated dashboard
- **AI-powered** — Gemini API integration for intelligent content breakdowns and assistance
- **Modern UI** — Smooth animations, 3D visuals, and a clean responsive interface

## Tech Stack

- **Frontend:** React 19, TypeScript, Tailwind CSS, Vite
- **Backend:** Express, Node.js
- **AI:** Google Gemini API (`@google/genai`)
- **3D / Animation:** Three.js, React Three Fiber, Motion
- **State Management:** Zustand

## Getting Started Locally

### Prerequisites
- Node.js
- A Gemini API key (get one free at [aistudio.google.com](https://aistudio.google.com))

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/JeremySaaj/MindMate-AI.git
   cd MindMate-AI
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file and add your Gemini API key:
   ```
   GEMINI_API_KEY=your_api_key_here
   ```

4. Run the app:
   ```bash
   npm run dev
   ```

## Deployment

This project is deployed on [Vercel](https://vercel.com). To deploy your own instance, import the repository into Vercel and add `GEMINI_API_KEY` as an environment variable.

## License

Apache 2.0
