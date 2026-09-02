#!/bin/bash
sed -i '335,348c\
  // Initialize Gemini client lazily/safely (Enterprise-Ready PoC)\
  const getGeminiClient = () => {\
    const apiKey = process.env.GEMINI_API_KEY;\
    if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {\
      throw new Error("GEMINI_API_KEY is missing. Please configure it in Settings > Secrets.");\
    }\
    // Modular initialization: allows seamless switch to Vertex AI later\
    const isVertex = process.env.USE_VERTEX_AI === "true";\
    if (isVertex) {\
      return new GoogleGenAI({\
        vertexai: {\
          project: process.env.GOOGLE_CLOUD_PROJECT || "",\
          location: process.env.GOOGLE_CLOUD_LOCATION || "europe-west3"\
        }\
      });\
    }\
    return new GoogleGenAI({\
      apiKey,\
      httpOptions: {\
        headers: {\
          "User-Agent": "aistudio-build",\
        },\
      },\
    });\
  };' server.ts
