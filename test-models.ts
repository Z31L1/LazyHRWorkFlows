import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();

async function test() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("No GEMINI_API_KEY found.");
    return;
  }
  const ai = new GoogleGenAI({ apiKey });
  
  const modelsToTest = [
    "gemini-3.5-flash",
    "gemini-3.1-pro-preview"
  ];
  
  for (const model of modelsToTest) {
    try {
      console.log(`\n--- Testing ${model} ---`);
      const response = await ai.models.generateContent({
        model: model,
        contents: "Hi, please reply with a single word: Success."
      });
      console.log(`Success with ${model}:`, response.text);
    } catch (err: any) {
      console.error(`Failed with ${model}:`, err.message || err);
    }
  }
}

test();
