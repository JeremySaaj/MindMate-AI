/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Full-Stack Express Server with Gemini 3.5 AI APIs Integration
// Complies with @google/genai guidelines, lazy initializes keys, and handles Vite middleware cleanly.

import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialization client pattern for Gemini API Key security
let aiInstance: GoogleGenAI | null = null;

function getAi() {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("GEMINI_API_KEY is not defined. Falling back to high-fidelity simulated materials on frontend.");
      return null;
    }
    aiInstance = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });
  }
  return aiInstance;
}

// ==========================================
// API Endpoint: POST/api/ai/outline
// Generates exactly 10 distinct, logical learning topics
// ==========================================
app.post('/api/ai/outline', async (req, res) => {
  const { materialTitle, materialContent } = req.body;
  const ai = getAi();

  if (!ai) {
    return res.status(200).json({ topics: [] }); // Signal frontend to fallback gracefully
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: `Read the following learning material textbook and break it down into EXACTLY 10 distinct, logical sequential study topics.
For each topic, provide a short title (max 4 words) and a brief description (max 1 sentence).

MATERIAL TITLE: ${materialTitle}
CONTENT:
${materialContent}
`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            topics: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING, description: "Unique string id like t1, t2, t3..." },
                  title: { type: Type.STRING, description: "Short title of the topic (max 4 words)" },
                  description: { type: Type.STRING, description: "Detailed 1-sentence synopsis" }
                },
                required: ['id', 'title', 'description']
              }
            }
          },
          required: ['topics']
        }
      }
    });

    const bodyText = response.text || '';
    res.json(JSON.parse(bodyText.trim()));
  } catch (err) {
    console.error("Gemini outline generation error:", err);
    res.status(500).json({ error: 'Failed to break down curriculum outline' });
  }
});

// ==========================================
// API Endpoint: POST /api/ai/topic-content
// Generates leveled explanation, exactly 5 flashcards, and exactly 5 multiple choice questions
// ==========================================
app.post('/api/ai/topic-content', async (req, res) => {
  const { materialContent, topicTitle, topicDescription, level } = req.body;
  const ai = getAi();

  if (!ai) {
    return res.status(500).json({ error: 'AI Client not initialized' });
  }

  let levelLabel = "ELI5 (Explain Like I'm 5)";
  let levelDetail = "Use simple metaphors, visual analogies, Lego examples, and super friendly wording. Avoid complex jargon.";
  if (level === 2) {
    levelLabel = "High School Level";
    levelDetail = "Explain using basic algebra, structured analogies, clear biological or physical comparisons, and neat definitions.";
  } else if (level === 3) {
    levelLabel = "University / Graduate Level";
    levelDetail = "Explain with formal mathematics, rigorous formulations, matrix notations, calculus equations, and scientific theorems.";
  }

  try {
    const prompt = `You are a professional adaptive education tutor. Focus on this TOPIC node inside the complete textbook:
TOPIC TITLE: ${topicTitle}
TOPIC SYNOPSIS: ${topicDescription}

Based on this complete REFERENCE TEXT:
${materialContent}

Perform the following:
1. Generate an adaptive educational explanation for this topic written precisely at the "${levelLabel}" level. 
Guidelines: ${levelDetail}
Write in clear Markdown format. Provide helpful bullet points and structured details (approx 150-250 words total).

2. Generate EXACTLY 5 flashcards for study. Each flashcard must consist of a "front" (stimulating question) and "back" (concise clear answer).

3. Generate EXACTLY 5 Multiple Choice Question checkers.
- Each must have a "questionText", exactly 4 "options" to choose from, and a "correctOptionIndex" (0, 1, 2, or 3).
- Important: The questions must match the "${levelLabel}" difficulty, but avoid copying wording directly from the generated explanation.

Response MUST be returned in the defined JSON schema.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            explanation: { type: Type.STRING, description: "Structured markdown content matching level" },
            flashcards: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  front: { type: Type.STRING, description: "Stimulating question text" },
                  back: { type: Type.STRING, description: "Detailed summary answer" }
                },
                required: ['front', 'back']
              }
            },
            quiz: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  questionText: { type: Type.STRING, description: "Clear question matching target level" },
                  options: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "Exactly 4 options to choose"
                  },
                  correctOptionIndex: { type: Type.INTEGER, description: "Index of the correct choice (0-3)" }
                },
                required: ['questionText', 'options', 'correctOptionIndex']
              }
            }
          },
          required: ['explanation', 'flashcards', 'quiz']
        }
      }
    });

    const bodyText = response.text || '';
    res.json(JSON.parse(bodyText.trim()));
  } catch (err) {
    console.error("Gemini content generation error:", err);
    res.status(500).json({ error: 'Failed to generate topic adaptation details' });
  }
});

// ==========================================
// API Endpoint: POST /api/teacher/recommendations
// Generates teaching advices based on aggregated scores
// ==========================================
app.post('/api/teacher/recommendations', async (req, res) => {
  const { topicTitle, avgScore, aiQuestions, failureRate } = req.body;
  const ai = getAi();

  if (!ai) {
    return res.status(500).json({ error: 'AI Client not initialized' });
  }

  try {
    const prompt = `You are an expert AI Learning Scientist and Instructor coach.
Review the following learning parameters of a struggling class component on a specific topic:

TOPIC CONCEPT: "${topicTitle}"
AVERAGE QUIZ SCORE: ${avgScore} / 5
AI ASSISTANCE QUESTIONS LOGGED: ${aiQuestions} questions requested by students
FAILURE RATE: ${failureRate}% failure rate

Provide an analysis of the possible student misconceptions and exactly 3 highly actionable pedagogical recommendations to remediate this gap immediately (e.g. customized classroom exercises, physical analogies, textbook modifications).
Return exactly JSON matches schema.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            analysis: { type: Type.STRING, description: "misconception analysis paragraphs" },
            recommendations: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "exactly 3 recommendations"
            }
          },
          required: ['analysis', 'recommendations']
        }
      }
    });

    const bodyText = response.text || '';
    res.json(JSON.parse(bodyText.trim()));
  } catch (err) {
    console.error("Gemini teaching advice generation error:", err);
    res.status(500).json({ error: 'Failed to compile classroom recommendations' });
  }
});

// ==========================================
// Mounting Vite Middlewares / Production Static Handlers
// ==========================================
async function startApp() {
  if (process.env.NODE_ENV !== "production") {
    // Development mode
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production mode
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`LMS Server successfully booted. Running on http://localhost:${PORT}`);
  });
}

startApp().catch(err => {
  console.error("LMS Server boot failure:", err);
});
