import express from "express";
import axios from "axios";
import { GoogleGenerativeAI } from "@google/generative-ai"; // placeholder SDK import

const app = express();
app.use(express.json());

// Initialize Gemini
const genAI = new GoogleGenerativeAI({ apiKey: process.env.GEMINI_API_KEY });

// Endpoint to query Gemini + scraping
app.post("/api/chat", async (req, res) => {
  try {
    const { userMessage, heartRate } = req.body;

    // 1. Get supplemental data from scraping service
    const scrapedTips = await getExerciseTips();

    // 2. Compose prompt with scraped info and heart-rate context
    const prompt = `
You are a supportive health information assistant.
User's latest heart rate: ${heartRate} bpm.
Supplemental guideline from external source: ${scrapedTips}.

User: ${userMessage}
`;

    // 3. Call Gemini
    const response = await genAI.generateText({
      model: "gemini-pro",
      prompt
    });

    res.json({ reply: response.data.text });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to get AI response" });
  }
});

// Scraper function PLACEHOLDER!!!
async function getExerciseTips() {
  // In production, keep scraping in a separate micro-service
  // Here just mock:
  return "Latest public exercise guideline suggests moderate aerobic activity for 30 min/day.";
}

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
