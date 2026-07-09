import express from "express";
import path from "path";
import { GoogleGenAI, Type } from "@google/genai";
import multer from "multer";

const upload = multer({ storage: multer.memoryStorage() });

function sanitizeJsonString(jsonStr: string): string {
  let inString = false;
  let escaped = false;
  let result = "";

  for (let i = 0; i < jsonStr.length; i++) {
    const char = jsonStr[i];

    if (escaped) {
      result += char;
      escaped = false;
      continue;
    }

    if (char === "\\") {
      result += char;
      escaped = true;
      continue;
    }

    if (char === '"') {
      inString = !inString;
      result += char;
      continue;
    }

    if (inString && char === "\n") {
      result += "\\n";
    } else if (inString && char === "\r") {
      // ignore carriage return inside strings or convert to nothing
    } else {
      result += char;
    }
  }

  return result;
}

function robustExtractRedesignJson(rawText: string): any {
  const result: any = {
    resume: { html: "", css: "" },
    cover_letter: { html: "", css: "" }
  };

  // Helper to extract text between specified start and end tags (extremely immune to quote/escapes)
  const extractWithTags = (text: string, possibleStarts: string[], possibleEnds: string[]): string => {
    for (const start of possibleStarts) {
      const startIdx = text.indexOf(start);
      if (startIdx !== -1) {
        const contentStart = startIdx + start.length;
        for (const end of possibleEnds) {
          const endIdx = text.indexOf(end, contentStart);
          if (endIdx !== -1) {
            return text.substring(contentStart, endIdx).trim();
          }
        }
        // Fallback: if start tag is found but no end tag, look for the next start tag or extract to end
        let endIdx = text.length;
        const otherStarts = [
          "[START_RESUME_HTML]", "[START_RESUME_CSS]", "[START_COVER_LETTER_HTML]", "[START_COVER_LETTER_CSS]",
          "[RESUME_HTML_START]", "[RESUME_CSS_START]", "[COVER_LETTER_HTML_START]", "[COVER_LETTER_CSS_START]",
          "[START_LETTER_HTML]", "[START_LETTER_CSS]", "```"
        ];
        for (const otherStart of otherStarts) {
          if (otherStart === start) continue;
          const nextStartIdx = text.indexOf(otherStart, contentStart);
          if (nextStartIdx !== -1 && nextStartIdx < endIdx) {
            endIdx = nextStartIdx;
          }
        }
        return text.substring(contentStart, endIdx).trim();
      }
    }
    return "";
  };

  let extractedViaTags = false;

  // Extract Resume HTML using custom tags
  const resHtml = extractWithTags(rawText, 
    ["[START_RESUME_HTML]", "[RESUME_HTML_START]", "<resume_html>", "resume_html:"],
    ["[END_RESUME_HTML]", "[RESUME_HTML_END]", "</resume_html>"]
  );

  // Extract Resume CSS using custom tags
  const resCss = extractWithTags(rawText, 
    ["[START_RESUME_CSS]", "[RESUME_CSS_START]", "<resume_css>", "resume_css:"],
    ["[END_RESUME_CSS]", "[RESUME_CSS_END]", "</resume_css>"]
  );

  // Extract Cover Letter HTML using custom tags
  const letterHtml = extractWithTags(rawText, 
    ["[START_COVER_LETTER_HTML]", "[COVER_LETTER_HTML_START]", "<cover_letter_html>", "cover_letter_html:", "[START_LETTER_HTML]", "[LETTER_HTML_START]"],
    ["[END_COVER_LETTER_HTML]", "[COVER_LETTER_HTML_END]", "</resume_html>", "</cover_letter_html>", "[END_LETTER_HTML]", "[LETTER_HTML_END]"]
  );

  // Extract Cover Letter CSS using custom tags
  const letterCss = extractWithTags(rawText, 
    ["[START_COVER_LETTER_CSS]", "[COVER_LETTER_CSS_START]", "<resume_css>", "<cover_letter_css>", "cover_letter_css:", "[START_LETTER_CSS]", "[LETTER_CSS_START]"],
    ["[END_COVER_LETTER_CSS]", "[COVER_LETTER_CSS_END]", "</resume_css>", "</cover_letter_css>", "[END_LETTER_CSS]", "[LETTER_CSS_END]"]
  );

  if (resHtml || resCss || letterHtml || letterCss) {
    result.resume.html = resHtml;
    result.resume.css = resCss;
    result.cover_letter.html = letterHtml;
    result.cover_letter.css = letterCss;
    extractedViaTags = true;
    console.log("[Robust JSON] Successfully located CV elements using custom tag parser.");
  }

  if (!extractedViaTags) {
    // Fallback 1: Try standard JSON parsing
    let cleanText = rawText.trim();
    if (cleanText.includes("```json")) {
      cleanText = cleanText.substring(cleanText.indexOf("```json") + 7);
      const endIdx = cleanText.lastIndexOf("```");
      if (endIdx !== -1) {
        cleanText = cleanText.substring(0, endIdx);
      }
    } else if (cleanText.includes("```")) {
      cleanText = cleanText.substring(cleanText.indexOf("```") + 3);
      const endIdx = cleanText.lastIndexOf("```");
      if (endIdx !== -1) {
        cleanText = cleanText.substring(0, endIdx);
      }
    }
    cleanText = cleanText.trim();

    let parsedSuccess = false;
    try {
      const parsed = JSON.parse(cleanText);
      if (parsed && (parsed.resume || parsed.cover_letter)) {
        result.resume.html = parsed.resume?.html || "";
        result.resume.css = parsed.resume?.css || "";
        result.cover_letter.html = parsed.cover_letter?.html || "";
        result.cover_letter.css = parsed.cover_letter?.css || "";
        parsedSuccess = true;
      }
    } catch (err) {
      console.warn("[Robust JSON] Standard JSON parsing failed, trying sanitized parsing...", err);
    }

    // Fallback 2: Try sanitizeJsonString parsing
    if (!parsedSuccess) {
      try {
        const parsed = JSON.parse(sanitizeJsonString(cleanText));
        if (parsed && (parsed.resume || parsed.cover_letter)) {
          result.resume.html = parsed.resume?.html || "";
          result.resume.css = parsed.resume?.css || "";
          result.cover_letter.html = parsed.cover_letter?.html || "";
          result.cover_letter.css = parsed.cover_letter?.css || "";
          parsedSuccess = true;
        }
      } catch (err) {
        console.warn("[Robust JSON] Sanitized JSON parsing also failed. Proceeding with robust regex-based slice extraction.", err);
      }
    }

    // Fallback 3: Robust Regex-based Slice Extraction
    if (!parsedSuccess) {
      const extractSection = (secKey: string) => {
        // Look for key "resume" or "cover_letter" with flexible quotes & spacing
        const secRegex = new RegExp(`['"]${secKey}['"]\\s*:\\s*\\{`, "i");
        const secMatch = cleanText.match(secRegex);
        if (!secMatch) return null;

        const secStartIdx = secMatch.index! + secMatch[0].length;
        
        // Find next section or end of text to bound this section's search area
        let secEndIdx = cleanText.length;
        if (secKey === "resume") {
          const nextSecRegex = /['"]cover_letter['"]\s*:\s*\{/i;
          const nextSecMatch = cleanText.match(nextSecRegex);
          if (nextSecMatch) {
            secEndIdx = nextSecMatch.index!;
          }
        }
        const secText = cleanText.substring(secStartIdx, secEndIdx);

        // Now extract html
        const htmlRegexFlexible = /['"]html['"]\s*:\s*(['"])/i;
        const htmlMatch = secText.match(htmlRegexFlexible);
        let htmlVal = "";
        let cssStartSearchFrom = 0;

        if (htmlMatch) {
          const quoteChar = htmlMatch[1];
          const startHtmlIdx = htmlMatch.index! + htmlMatch[0].length;
          
          // Find where CSS starts to bound the HTML value
          const cssRegex = /['"]css['"]\s*:/i;
          const cssMatch = secText.match(cssRegex);
          
          let endHtmlIdx = secText.length;
          if (cssMatch) {
            endHtmlIdx = cssMatch.index!;
            cssStartSearchFrom = cssMatch.index! + cssMatch[0].length;
          }
          
          const rawHtmlSub = secText.substring(startHtmlIdx, endHtmlIdx);
          const lastQuoteIdx = rawHtmlSub.lastIndexOf(quoteChar);
          if (lastQuoteIdx !== -1) {
            htmlVal = rawHtmlSub.substring(0, lastQuoteIdx);
          } else {
            htmlVal = rawHtmlSub;
          }
        }

        // Now extract css
        let cssVal = "";
        if (cssStartSearchFrom > 0) {
          const remainingSecText = secText.substring(cssStartSearchFrom);
          const quoteMatch = remainingSecText.match(/^\s*(['"])/);
          if (quoteMatch) {
            const quoteChar = quoteMatch[1];
            const startCssIdx = remainingSecText.indexOf(quoteChar) + 1;
            const rawCssSub = remainingSecText.substring(startCssIdx);
            
            // Find the last quoteChar in rawCssSub (which is usually followed by closing curly/comma/spacing)
            let cleanCssSub = rawCssSub.trim();
            if (cleanCssSub.endsWith("}")) {
              const lastQuoteIdx = cleanCssSub.lastIndexOf(quoteChar);
              if (lastQuoteIdx !== -1) {
                cssVal = cleanCssSub.substring(0, lastQuoteIdx);
              } else {
                cssVal = cleanCssSub;
              }
            } else {
              const lastQuoteIdx = rawCssSub.lastIndexOf(quoteChar);
              if (lastQuoteIdx !== -1) {
                cssVal = rawCssSub.substring(0, lastQuoteIdx);
              } else {
                cssVal = rawCssSub;
              }
            }
          }
        }

        return { html: htmlVal, css: cssVal };
      };

      const resumeData = extractSection("resume");
      if (resumeData) {
        result.resume = resumeData;
      }
      const coverLetterData = extractSection("cover_letter");
      if (coverLetterData) {
        result.cover_letter = coverLetterData;
      }
    }
  }

  // Unified cleanup & manual unescaping pass to completely resolve literal "\n", escaped double quotes, etc.
  const cleanAndUnescape = (str: string, possibleStarts: string[], possibleEnds: string[]): string => {
    if (!str) return "";
    let cleanStr = str.trim();

    // Remove outermost quotes if the string was extracted from raw JSON fields as a string slice
    if (cleanStr.startsWith('"') && cleanStr.endsWith('"') && cleanStr.length > 1) {
      cleanStr = cleanStr.substring(1, cleanStr.length - 1);
    } else if (cleanStr.startsWith("'") && cleanStr.endsWith("'") && cleanStr.length > 1) {
      cleanStr = cleanStr.substring(1, cleanStr.length - 1);
    }

    // Unescape common JSON/JS string escape characters (order of operations matters!)
    cleanStr = cleanStr
      .replace(/\\r/g, "\r")
      .replace(/\\t/g, "\t")
      .replace(/\\"/g, '"')
      .replace(/\\'/g, "'")
      .replace(/\\n/g, "\n") // Converts literal "\n" sequence to real newline
      .replace(/\\\\/g, "\\");

    // After unescaping, find and strip out any wrapped custom tags if present
    for (const start of possibleStarts) {
      const startIdx = cleanStr.indexOf(start);
      if (startIdx !== -1) {
        const contentStart = startIdx + start.length;
        for (const end of possibleEnds) {
          const endIdx = cleanStr.indexOf(end, contentStart);
          if (endIdx !== -1) {
            cleanStr = cleanStr.substring(contentStart, endIdx);
            break;
          }
        }
        // If start tag is found but no end tag, strip everything before the start tag
        if (cleanStr.indexOf(start) !== -1) {
          cleanStr = cleanStr.substring(contentStart);
        }
        break;
      }
    }

    // Double check and strip any leftover instances of start/end tags
    for (const start of possibleStarts) {
      cleanStr = cleanStr.split(start).join("");
    }
    for (const end of possibleEnds) {
      cleanStr = cleanStr.split(end).join("");
    }

    return cleanStr.trim();
  };

  const resumeStarts = ["[START_RESUME_HTML]", "[RESUME_HTML_START]", "<resume_html>"];
  const resumeEnds = ["[END_RESUME_HTML]", "[RESUME_HTML_END]", "</resume_html>"];
  const resumeCssStarts = ["[START_RESUME_CSS]", "[RESUME_CSS_START]", "<resume_css>"];
  const resumeCssEnds = ["[END_RESUME_CSS]", "[RESUME_CSS_END]", "</resume_css>"];

  const letterStarts = ["[START_COVER_LETTER_HTML]", "[COVER_LETTER_HTML_START]", "<cover_letter_html>", "[START_LETTER_HTML]", "[LETTER_HTML_START]"];
  const letterEnds = ["[END_COVER_LETTER_HTML]", "[COVER_LETTER_HTML_END]", "</cover_letter_html>", "[END_LETTER_HTML]", "[LETTER_HTML_END]"];
  const letterCssStarts = ["[START_COVER_LETTER_CSS]", "[COVER_LETTER_CSS_START]", "<cover_letter_css>", "[START_LETTER_CSS]", "[LETTER_CSS_START]"];
  const letterCssEnds = ["[END_COVER_LETTER_CSS]", "[COVER_LETTER_CSS_END]", "</cover_letter_css>", "[END_LETTER_CSS]", "[LETTER_CSS_END]"];

  result.resume.html = cleanAndUnescape(result.resume.html, resumeStarts, resumeEnds);
  result.resume.css = cleanAndUnescape(result.resume.css, resumeCssStarts, resumeCssEnds);
  result.cover_letter.html = cleanAndUnescape(result.cover_letter.html, letterStarts, letterEnds);
  result.cover_letter.css = cleanAndUnescape(result.cover_letter.css, letterCssStarts, letterCssEnds);

  return result;
}

export const app = express();

// Body parser with 10mb limit for pasting long resumes/jobs
app.use(express.json({ limit: "10mb" }));

  // Initialize Gemini client lazily/safely
  const getGeminiClient = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
      throw new Error("GEMINI_API_KEY is missing. Please configure it in Settings > Secrets.");
    }
    return new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  };

  // Helper to run a resilient model request across fallback models
  const generateResilientContent = async (ai: any, model: string, contents: any, config: any): Promise<string> => {
    // Check if contents contains any inlineData (multimodal content like PDF or image)
    let hasInlineData = false;
    let filePart: any = null;
    let textPrompt = "";

    if (Array.isArray(contents)) {
      for (const part of contents) {
        if (typeof part === "string") {
          textPrompt += (textPrompt ? "\n" : "") + part;
        } else if (part && typeof part === "object") {
          if (part.inlineData) {
            hasInlineData = true;
            filePart = part;
          } else if (typeof part.text === "string") {
            textPrompt += (textPrompt ? "\n" : "") + part.text;
          }
        }
      }
    } else if (contents && typeof contents === "object") {
      if (contents.inlineData) {
        hasInlineData = true;
        filePart = contents;
      } else if (typeof contents.text === "string") {
        textPrompt = contents.text;
      }
    } else if (typeof contents === "string") {
      textPrompt = contents;
    }

    if (hasInlineData && filePart) {
      console.log(`[Resilient API] Input contains file data. Extracting text using multimodal gemma-4-31b-it first...`);
      try {
        const extractPrompt = "Lies das folgende Dokument vollständig aus und erstelle eine fehlerfreie, strukturierte, vollständige Textversion des Inhalts auf Deutsch. Gib nur den extrahierten Text zurück.";
        const extractResponse = await ai.models.generateContent({
          model: "gemma-4-31b-it",
          contents: [
            extractPrompt,
            filePart
          ],
          config: {
            temperature: 0.1
          }
        });

        const extractedText = extractResponse?.text;
        if (!extractedText) {
          throw new Error("Fehler bei der Textextraktion mit gemma-4-31b-it.");
        }

        console.log(`[Resilient API] Successfully extracted ${extractedText.length} characters from file. Proceeding with text-based model.`);

        // If the request is just simple text extraction (no structured schema or config), we can return the extracted text directly
        if (!config.responseSchema && !config.responseMimeType && (!textPrompt || textPrompt.includes("Lies das beigefügte Dokument vollständig aus"))) {
          return extractedText;
        }

        // Otherwise, run the extracted text through the primary model
        const textBasedPrompt = `${textPrompt}\n\nDokumenten-Inhalt:\n${extractedText}`;
        return await generateResilientContent(ai, model, textBasedPrompt, config);

      } catch (err: any) {
        console.error("[Resilient API] Multimodal text extraction failed:", err.message || err);
        throw new Error("Fehler bei der Dokumentenanalyse: Das Dokument konnte nicht verarbeitet werden.");
      }
    }

    // Fallback chain of models to guarantee success (with gemma-4-31b-it as the ultimate reliable fallback)
    const modelChain = [];
    if (model) {
      modelChain.push(model);
    }
    // Always include gemma-4-31b-it as a fallback
    modelChain.push("gemma-4-31b-it");

    // Remove duplicates from the chain
    const uniqueModelChain = Array.from(new Set(modelChain));

    // Helper to safely prep and strip configurations for Gemma models
    const prepareGemmaRequest = (conts: any, conf: any) => {
      const cleanConf = { ...conf };
      
      // Gemma does not support structured output formats, search grounding, thinking budgets, or systemInstruction inside config
      delete cleanConf.responseMimeType;
      delete cleanConf.responseSchema;
      delete cleanConf.thinkingConfig;
      delete cleanConf.tools;
      
      const sysInst = cleanConf.systemInstruction;
      delete cleanConf.systemInstruction;
      
      let cleanConts = conts;
      
      if (sysInst) {
        const sysInstructionPrefix = `System-Anweisungen:\n${sysInst}\n\nBitte beachte diese System-Anweisungen strikt bei deiner Antwort.\n\nNutzer-Anfrage:\n`;
        
        if (typeof conts === "string") {
          cleanConts = `${sysInstructionPrefix}${conts}`;
        } else if (Array.isArray(conts)) {
          const contentsCopy = JSON.parse(JSON.stringify(conts)); // deep copy safely
          if (contentsCopy.length > 0) {
            if (typeof contentsCopy[0] === "string") {
              contentsCopy[0] = `${sysInstructionPrefix}${contentsCopy[0]}`;
            } else if (contentsCopy[0] && typeof contentsCopy[0] === "object") {
              if (Array.isArray(contentsCopy[0].parts) && contentsCopy[0].parts.length > 0) {
                const firstPart = contentsCopy[0].parts[0];
                if (typeof firstPart === "string") {
                  contentsCopy[0].parts[0] = `${sysInstructionPrefix}${firstPart}`;
                } else if (firstPart && typeof firstPart.text === "string") {
                  firstPart.text = `${sysInstructionPrefix}${firstPart.text}`;
                }
              } else if (typeof contentsCopy[0].text === "string") {
                contentsCopy[0].text = `${sysInstructionPrefix}${contentsCopy[0].text}`;
              }
            }
          }
          cleanConts = contentsCopy;
        }
      }
      
      return { cleanConts, cleanConf };
    };

    // Try each model in the chain
    for (const currentModel of uniqueModelChain) {
      try {
        console.log(`[Resilient API] Trying model in chain: ${currentModel}`);
        
        const isGemma = currentModel.toLowerCase().includes("gemma");
        let finalContents = contents;
        let finalConfig = config;

        if (isGemma) {
          const { cleanConts, cleanConf } = prepareGemmaRequest(contents, config);
          finalContents = cleanConts;
          finalConfig = cleanConf;
        }

        const response = await ai.models.generateContent({
          model: currentModel,
          contents: finalContents,
          config: finalConfig
        });

        if (response.text) {
          console.log(`[Resilient API] Success with model: ${currentModel}`);
          return response.text;
        }
      } catch (err: any) {
        console.warn(`[Resilient API] Model ${currentModel} failed:`, err.message || err);
      }
    }

    throw new Error("Fehler beim Abrufen der KI-Antwort: Die KI-Engine ist derzeit voll ausgelastet oder nicht erreichbar.");
  };

  // Helper to convert structured CVData to a clean text representation
  const formatCVDataToText = (data: any): string => {
    if (!data) return "";
    let text = "";
    
    if (data.personalInfo) {
      const p = data.personalInfo;
      text += `KONTAKTINFORMATIONEN:\n`;
      if (p.fullName) text += `Name: ${p.fullName}\n`;
      if (p.email) text += `E-Mail: ${p.email}\n`;
      if (p.phone) text += `Telefon: ${p.phone}\n`;
      if (p.location) text += `Ort: ${p.location}\n`;
      if (p.linkedin) text += `LinkedIn: ${p.linkedin}\n`;
      if (p.website) text += `Webseite: ${p.website}\n`;
      text += `\n`;
    }

    if (data.summary) {
      text += `ZUSAMMENFASSUNG / PROFIL:\n${data.summary}\n\n`;
    }

    if (data.experience && data.experience.length > 0) {
      text += `BERUFSERFAHRUNG:\n`;
      data.experience.forEach((exp: any) => {
        text += `- ${exp.jobTitle} bei ${exp.company} (${exp.location || ""})\n`;
        text += `  Zeitraum: ${exp.startDate} bis ${exp.current ? "Heute" : exp.endDate}\n`;
        if (exp.description) text += `  Beschreibung:\n  ${exp.description}\n`;
        text += `\n`;
      });
    }

    if (data.education && data.education.length > 0) {
      text += `AUSBILDUNG:\n`;
      data.education.forEach((edu: any) => {
        text += `- ${edu.degree} - ${edu.institution} (${edu.location || ""})\n`;
        text += `  Zeitraum: ${edu.startDate} bis ${edu.current ? "Heute" : edu.endDate}\n`;
        if (edu.description) text += `  Details: ${edu.description}\n`;
        text += `\n`;
      });
    }

    if (data.skills && data.skills.length > 0) {
      text += `KENNTNISSE / SKILLS:\n`;
      text += data.skills.filter(Boolean).join(", ") + "\n\n";
    }

    if (data.languages && data.languages.length > 0) {
      text += `SPRACHEN:\n`;
      text += data.languages.filter(Boolean).join(", ") + "\n\n";
    }

    return text;
  };

  // --- API Endpoints ---

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", time: new Date().toISOString() });
  });

  // 0. Privacy-First GDPR Process Resume (handles both 'lebenslauf' and 'matching' modes)
  app.post("/api/process-resume", async (req, res) => {
    try {
      const { text, mode, model } = req.body;
      if (!text || !text.trim()) {
        return res.status(400).json({ error: "Kein Text zum Verarbeiten angegeben." });
      }

      // Default model to gemma-4-31b-it
      const selectedModel = model || "gemma-4-31b-it";
      const ai = getGeminiClient();

      if (mode === "lebenslauf") {
        let resultText = "";
        
        const responseSchema = {
          type: Type.OBJECT,
          required: ["basics", "work", "education", "skills"],
          properties: {
            basics: {
              type: Type.OBJECT,
              required: ["name", "email", "phone", "address"],
              properties: {
                name: { type: Type.STRING },
                email: { type: Type.STRING },
                phone: { type: Type.STRING },
                address: { type: Type.STRING },
              },
            },
            work: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  position: { type: Type.STRING },
                  startDate: { type: Type.STRING },
                  endDate: { type: Type.STRING },
                  highlights: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                },
              },
            },
            education: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  institution: { type: Type.STRING },
                  title: { type: Type.STRING },
                  period: { type: Type.STRING },
                },
              },
            },
            skills: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
        };

        const systemInstructionText = `Du bist ein ATS-Daten-Experte. Wandle den Lebenslauf-Text in ein exaktes JSON-Objekt um.

SCHEMA-VORGABE:
{ 
  "basics": { "name": "[NAME_MASKED]", "email": "[EMAIL_MASKED]", "phone": "[PHONE_MASKED]", "address": "Echte Adresse aus dem Text" }, 
  "work": [ 
    { "name": "", "position": "", "startDate": "", "endDate": "", "highlights": [] } 
  ], 
  "education": [ 
    { "institution": "", "title": "", "period": "" } 
  ],
  "skills": [] 
}.

ANWEISUNGEN:
1. "work": Übernimm die von dir erkannten Felder. Stelle sicher, dass Aufgaben als Liste im "highlights"-Array landen.
2. "education": Nutze deine erkannten Felder "institution", "title" (Degree) und "period".
3. "skills": Extrahiere ALLE technischen Kenntnisse (Hard Skills, Frameworks, Software) aus dem Text in ein flaches Array.
4. Platzhalter: Ersetze gefundene Kontaktdaten strikt durch [NAME_MASKED], [EMAIL_MASKED], [PHONE_MASKED]. Die Adresse (address) wird NICHT maskiert, extrahiere sie genau so, wie sie im Text steht!
5. Ausgabe: Gib NUR das JSON aus. Keine Erklärungen.

Lebenslauf: ${text}`;

        resultText = await generateResilientContent(ai, selectedModel, text, {
          temperature: 0.1,
          thinkingConfig: {
            thinkingLevel: "HIGH" as any,
          },
          tools: [{ googleSearch: {} }],
          responseMimeType: "application/json",
          responseSchema: responseSchema,
          systemInstruction: systemInstructionText,
        });

        if (!resultText) {
          throw new Error("Keine Antwort von der KI-API erhalten.");
        }

        // Robust parsing logic
        let parsed;
        let cleanText = resultText.trim();
        if (cleanText.includes("```json")) {
          cleanText = cleanText.substring(cleanText.indexOf("```json") + 7);
          const endIdx = cleanText.lastIndexOf("```");
          if (endIdx !== -1) {
            cleanText = cleanText.substring(0, endIdx);
          }
        } else if (cleanText.includes("```")) {
          cleanText = cleanText.substring(cleanText.indexOf("```") + 3);
          const endIdx = cleanText.lastIndexOf("```");
          if (endIdx !== -1) {
            cleanText = cleanText.substring(0, endIdx);
          }
        }
        cleanText = cleanText.trim();

        try {
          parsed = JSON.parse(cleanText);
        } catch (parseErr) {
          console.warn("Direct JSON parsing failed, attempting brace substring fallback:", parseErr);
          const firstBracket = cleanText.indexOf('{');
          const lastBracket = cleanText.lastIndexOf('}');
          if (firstBracket !== -1 && lastBracket !== -1) {
            parsed = JSON.parse(cleanText.substring(firstBracket, lastBracket + 1));
          } else {
            throw new Error("Das Modell hat kein gültiges JSON-Format zurückgegeben. Text: " + resultText);
          }
        }

        res.json({ data: parsed });

      } else if (mode === "matching") {
        let resultText = "";
        const todayFormatted = new Date().toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });

        const responseSchema = {
          type: Type.OBJECT,
          required: ["matchScore", "details", "senderAddress", "recipientAddress", "date", "subject", "jobTitle", "salutation", "introduction", "mainBody", "closing", "signoff", "signature"],
          properties: {
            matchScore: { type: Type.INTEGER },
            details: {
              type: Type.OBJECT,
              required: ["skills", "experience", "education"],
              properties: {
                skills: { type: Type.INTEGER },
                experience: { type: Type.INTEGER },
                education: { type: Type.INTEGER }
              }
            },
            senderAddress: { type: Type.STRING },
            recipientAddress: { type: Type.STRING },
            date: { type: Type.STRING },
            subject: { type: Type.STRING },
            jobTitle: { type: Type.STRING },
            salutation: { type: Type.STRING, description: "Anrede (z.B. Sehr geehrte Damen und Herren,)" },
            introduction: { type: Type.STRING, description: "Einleitung" },
            mainBody: { type: Type.STRING, description: "Hauptteil - zusammenhängender Text, KEINE Aufzählungen" },
            closing: { type: Type.STRING, description: "Schlusssatz (z.B. Ich freue mich auf ein Gespräch)" },
            signoff: { type: Type.STRING, description: "Grußformel (z.B. Mit freundlichen Grüßen)" },
            signature: { type: Type.STRING, description: "Unterschrift/Name" }
          }
        };

        resultText = await generateResilientContent(ai, "gemma-4-31b-it", text, {
          temperature: 0.7,
          thinkingConfig: {
            thinkingLevel: "HIGH" as any
          },
          tools: [{ googleSearch: {} }],
          responseMimeType: "application/json",
          responseSchema: responseSchema,
          systemInstruction: `Du bist ein Senior Recruiter und ATS-Experte. Du vergleichst Bewerberprofile haargenau mit Stellenprofilen.
        
Analysiere die Eingabe. Ermittle einen Match-Score (0-100), gefundene Skills und fehlende Skills.

WICHTIG ZUR EMPFÄNGER-ADRESSE (ABSOLUTE PFLICHT):
Überprüfe, ob die Adresse des Arbeitgebers in der Stellenausschreibung korrekt, vollständig und verifizierbar ist.
1. Wenn die vollständige Adresse (Straße, PLZ, Ort) in der Stellenausschreibung steht (oder durch Websuche eindeutig verifizierbar ist), nimm diese.
2. Wenn die Adresse unvollständig ist, fehlt, oder du sie nicht eindeutig verifizieren kannst, MÜSSEN die Empfängerdaten (recipientAddress) LEER BLEIBEN! Schreibe auf keinen Fall eine unvollständige oder erfundene Adresse. Wenn unklar, nimm nur den Firmennamen oder lasse das Feld komplett leer.

Erstelle dann ein hochprofessionelles, maßgeschneidertes Motivationsschreiben (Anschreiben) auf Deutsch.

WICHTIGE VORGABEN FÜR DEN INHALT (SEHR KURZ & PRÄGNANT):
- Das Anschreiben MUSS zwingend auf EINE DIN A4 Seite passen!
- Webe maximal die 3 besten Überschneidungspunkte zwischen Lebenslauf und Stellenausschreibung flüssig in den Hauptteil (mainBody) ein. 
- ABSOLUTES VERBOT FÜR AUFZÄHLUNGEN: Erstelle KEINE Aufzählung / Bullet-Points (keine Listen), sondern schreibe einen zusammenhängenden Fließtext!
- Schreibe auf keinen Fall Romane. Formuliere sehr kurz, präzise und überzeugend. Weniger ist mehr!

FORMATIERUNGS-REGELN:
1. Verwende die tatsächlichen Kontaktdaten (Name, Adresse, Email, Telefon) des Bewerbers aus dem Lebenslauf für die Absenderdaten (senderAddress).
2. Für die Empfängerdaten (recipientAddress): Verwende den Firmennamen und die exakte Firmenadresse, sofern vorhanden und verifiziert, sonst leer.
3. DATUM: Verwende zwingend das aktuelle heutige Datum "${todayFormatted}" für das Feld 'date'.
4. BETREFF (subject): Klarer, ansprechender Betreff.
5. ANREDE (salutation): Z.B. "Sehr geehrte..."
6. INHALT: Aufgeteilt in Einleitung (introduction), Hauptteil (mainBody) und Schluss (closing).
7. GRUSSFORMEL (signoff): Z.B. "Mit freundlichen Grüßen"
8. UNTERSCHRIFT (signature): Name des Bewerbers

Antworte AUSSCHLIESSLICH im JSON-Format gemäß dieses exakten Schemas (inklusive aller Keys). Achte darauf, dass innerhalb der JSON-Strings Zeilenumbrüche korrekt als escaped \\n und nicht als echte Zeilenumbrüche vorliegen:
{
  "matchScore": 85,
  "details": {
    "skills": 80,
    "experience": 90,
    "education": 100
  },
  "senderAddress": "Max Mustermann\\nMusterstraße 1\\n12345 Musterstadt",
  "recipientAddress": "Beispielfirma GmbH\\nBeispielstraße 2\\n54321 Beispielstadt",
  "date": "${todayFormatted}",
  "subject": "Bewerbung als...",
  "jobTitle": "...",
  "salutation": "Sehr geehrte Damen und Herren,",
  "introduction": "...",
  "mainBody": "...",
  "closing": "...",
  "signoff": "Mit freundlichen Grüßen",
  "signature": "Max Mustermann"
}`,
        });

        if (!resultText) {
          throw new Error("Fehler bei der Motivationsschreiben-Generierung.");
        }

        // Robust parsing
        let parsed;
        let cleanText = resultText.trim();
        if (cleanText.includes("```json")) {
          cleanText = cleanText.substring(cleanText.indexOf("```json") + 7);
          const endIdx = cleanText.lastIndexOf("```");
          if (endIdx !== -1) cleanText = cleanText.substring(0, endIdx);
        } else if (cleanText.includes("```")) {
          cleanText = cleanText.substring(cleanText.indexOf("```") + 3);
          const endIdx = cleanText.lastIndexOf("```");
          if (endIdx !== -1) cleanText = cleanText.substring(0, endIdx);
        }
        cleanText = cleanText.trim();

        // Extract JSON block if surrounded by conversational text
        const firstBracket = cleanText.indexOf('{');
        const lastBracket = cleanText.lastIndexOf('}');
        if (firstBracket !== -1 && lastBracket !== -1) {
          cleanText = cleanText.substring(firstBracket, lastBracket + 1);
        }

        // Sanitize string (escapes literal newlines inside double-quotes)
        cleanText = sanitizeJsonString(cleanText);

        try {
          parsed = JSON.parse(cleanText);
        } catch (e: any) {
          console.error("[JSON Parse Error] Raw text:", resultText);
          console.error("[JSON Parse Error] Sanitized text:", cleanText);
          throw new Error("Fehler beim Parsen der KI-Antwort als JSON: " + e.message);
        }

        res.json({ data: parsed });
      } else {
        res.status(400).json({ error: "Ungültiger Modus angegeben." });
      }
    } catch (error: any) {
      console.error("Fehler in /api/process-resume:", error);
      res.status(500).json({ error: error.message || "Interner Serverfehler" });
    }
  });

  // Generate styled letter HTML
app.post("/api/generate-styled-letter", upload.fields([{ name: "resume", maxCount: 1 }]), async (req, res) => {
  try {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const resumeFile = files.resume?.[0];
    const resumeText = req.body.resumeText || "";
    const letterData = JSON.parse(req.body.letterData || "{}");

    if (!resumeFile && !resumeText) {
      return res.status(400).json({ error: "Lebenslauf-Datei oder Lebenslauf-Text fehlt." });
    }

    const ai = getGeminiClient();
    const todayFormatted = new Date().toLocaleDateString('de-DE', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' });

    // System-Instruktion und strukturierter Prompt zur Maximierung des Layout-Determinismus
    const prompt = `Du bist ein hochpräziser Code-Synthesizer für Web-Technologien. 
Deine Aufgabe ist es, ein erstklassiges, modernes, valides und druckfertiges HTML/CSS-Dokument im A4-Briefformat zu generieren.

<ANWEISUNG_STIL>
- Analysiere den folgenden Lebenslauf-Text ausschließlich auf farbliche Akzente (z. B. Corporate-Identity-Farben, dominierende Grautöne, Smaragdgrün, Marineblau) und typografische Muster.
- Spiegele diesen visuellen Stil im CSS des Anschreibens wider, um ein konsistentes Gesamtbild zu erzeugen.
- Nutze für alle CSS-Farbwerte AUSSCHLIESSLICH klassische HEX-Codes (#FFFFFF) oder RGB(A)-Werte. 
- Verwendungsausschluss: Nutze KEINESFALLS moderne CSS-Farb-Funktionen wie oklch(), oklab(), lch() oder color(), da die nachgelagerte PDF-Rendering-Engine diese nicht interpretieren kann!
- Kontrast-Zwang: Die Schriftfarbe MUSS komplementär und kontraststark zum Hintergrund sein (z. B. primärer Text in #1A1A1A auf rein weißem Grund), um absolute Barrierefreiheit zu garantieren.
</ANWEISUNG_STIL>

<ANWEISUNG_LAYOUT>
- Standard-A4-Erzwingung: Setze das Dokument starr auf: width: 210mm; height: 297mm; box-sizing: border-box;. Das Anschreiben MUSS zwingend auf exakt EINE DIN A4 Seite passen.
- Nutze das '@media print'-Stylesheet, um Ränder und Hintergrundfarben beim Druckprozess zu fixieren (-webkit-print-color-adjust: exact;).
- Briefkopf & Absender: Platziere die Absenderdaten elegant im oberen Segment.
- Empfänger-Anschrift: Linksbündig, exakt positioniert für Fensterumschläge (DIN 5008 konform).
- Datum: Rechtsbündig, horizontal ausgerichtet auf der Höhe der ersten Textzeile nach der Empfängeradresse. Nutze exakt diesen String: ${todayFormatted}.
- Betreffzeile: Unmissverständlich hervorgehoben (font-weight: bold; font-size: 1.15rem;), linksbündig.
- Textkörper: Strukturierte Absätze für Einleitung, Hauptteil, Schluss, Grußformel und Name.
</ANWEISUNG_LAYOUT>

<DATEN_INPUT>
<ANSCHREIBEN_DATA>
${JSON.stringify(letterData, null, 2)}
</ANSCHREIBEN_DATA>

<LEBENSLAUF_TEXT>
${resumeText}
</LEBENSLAUF_TEXT>
</DATEN_INPUT>

Ausgabe-Regel: Generiere ein einziges, valides HTML-Dokument mit eingebettetem CSS im <style>-Tag. Generiere KEINE Erklärungen, KEINEN Fließtext vor oder nach dem Code und KEINE Markdown-Wrapper (\`\`\`html). Starte deine Antwort direkt mit der Doctype-Deklaration: <!DOCTYPE html>`;

    // Modell-Aufruf mit reduzierter Temperatur zur Minimierung stochastischer Ausreißer
    let html = await generateResilientContent(ai, "gemma-4-31b-it", prompt, { temperature: 0.1 });
    
    // Robuste Bereinigung von potentiellen Markdown-Artefakten mittels Regulärer Ausdrücke
    html = html.replace(/^```html\s*/i, "").replace(/```\s*$/, "").trim();

    // Fallback-Parsing: Falls das Modell dennoch Text vorangestellt hat
    const doctypeIndex = html.toLowerCase().indexOf("<!doctype html>");
    const htmlTagIndex = html.toLowerCase().indexOf("<html");
    
    let startIndex = -1;
    if (doctypeIndex !== -1) {
      startIndex = doctypeIndex;
    } else if (htmlTagIndex !== -1) {
      startIndex = htmlTagIndex;
    }

    if (startIndex !== -1) {
      html = html.substring(startIndex);
    }

    res.setHeader("Content-Type", "text/html");
    res.send(html);
  } catch (error: any) {
    console.error("Fehler in /api/generate-styled-letter:", error);
    res.status(500).json({ error: error.message || "Interner Serverfehler" });
  }
});

  // 1. Analyze CV for ATS compatibility
  app.post("/api/analyze-cv", async (req, res) => {
    try {
      const { cvText, cvData } = req.body;
      let textToAnalyze = cvText || "";
      if (cvData) {
        textToAnalyze += "\n" + formatCVDataToText(cvData);
      }

      if (!textToAnalyze.trim()) {
        return res.status(400).json({ error: "Bitte geben Sie einen Lebenslauf-Text ein oder füllen Sie das Formular aus." });
      }

      const ai = getGeminiClient();

      const resultText = await generateResilientContent(ai, "gemma-4-31b-it", `Analysiere den folgenden Lebenslauf auf seine ATS-Freundlichkeit (Applicant Tracking System).
Achte besonders auf Struktur, Formatierung, Standard-Überschriften und wichtige Abschnitte.
Gib konkrete Verbesserungsvorschläge auf Deutsch.

Lebenslauf-Inhalt:
"""
${textToAnalyze}
"""`, {
        systemInstruction: "Du bist ein führender HR-Experte und Recruiter, der sich auf Applicant Tracking Systeme (ATS) spezialisiert hat. Analysiere Lebensläufe präzise auf Lesbarkeit durch Parser, Strukturfehler und Keyword-Dichte. Antworte immer auf Deutsch im vorgegebenen JSON-Format.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.INTEGER, description: "ATS-Score von 0 bis 100, wobei 100 perfekt ATS-konform ist." },
            structureCheck: {
              type: Type.OBJECT,
              properties: {
                hasContactInfo: { type: Type.BOOLEAN, description: "Enthält E-Mail, Telefon und Name." },
                hasWorkExperience: { type: Type.BOOLEAN, description: "Enthält einen klaren Abschnitt zur Berufserfahrung." },
                hasEducation: { type: Type.BOOLEAN, description: "Enthält einen klaren Ausbildungs-Abschnitt." },
                hasSkills: { type: Type.BOOLEAN, description: "Enthält eine Liste an Fähigkeiten / Kenntnissen." },
                hasClearSections: { type: Type.BOOLEAN, description: "Benutzt Standard-Überschriften, die von ATS erkannt werden." }
              },
              required: ["hasContactInfo", "hasWorkExperience", "hasEducation", "hasSkills", "hasClearSections"]
            },
            formattingIssues: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  severity: { type: Type.STRING, description: "critical, warning, oder good" },
                  issue: { type: Type.STRING, description: "Beschreibung des Formatierungsproblems (z.B. Tabellen, Spalten, Icons)." },
                  fix: { type: Type.STRING, description: "Konkrete Anleitung, wie der Fehler behoben wird." }
                },
                required: ["severity", "issue", "fix"]
              }
            },
            keywordAnalysis: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  keyword: { type: Type.STRING, description: "Das identifizierte Keyword (z.B. Scrum, TypeScript, Teamleitung)." },
                  status: { type: Type.STRING, description: "found, missing, oder excessive" },
                  importance: { type: Type.STRING, description: "high, medium, oder low" },
                  recommendation: { type: Type.STRING, description: "Wie oder wo dieses Keyword eingebaut/optimiert werden sollte." }
                },
                required: ["keyword", "status", "importance", "recommendation"]
              }
            },
            sectionFeedback: {
              type: Type.OBJECT,
              properties: {
                contact: { type: Type.STRING, description: "Feedback zum Kontakt-Abschnitt." },
                summary: { type: Type.STRING, description: "Feedback zum Kurzprofil oder der Zusammenfassung." },
                experience: { type: Type.STRING, description: "Feedback zur Berufserfahrung (Format, Bullet-Points, Action-Verbs)." },
                education: { type: Type.STRING, description: "Feedback zur Ausbildung." },
                skills: { type: Type.STRING, description: "Feedback zum Skills-Bereich." }
              },
              required: ["contact", "summary", "experience", "education", "skills"]
            },
            atsOptimizedText: { type: Type.STRING, description: "Eine strukturierte, chronologische und rein textbasierte Version des Lebenslaufs ohne störende Formatierungen, perfekt optimiert für Copy-Paste in ATS-Masken." }
          },
          required: ["score", "structureCheck", "formattingIssues", "keywordAnalysis", "sectionFeedback", "atsOptimizedText"]
        }
      });
      if (!resultText) {
        throw new Error("Fehler bei der Generierung durch Gemini API.");
      }
      
      const parsed = JSON.parse(resultText);
      res.json(parsed);

    } catch (error: any) {
      console.error("Fehler in /api/analyze-cv:", error);
      res.status(500).json({ error: error.message || "Interner Serverfehler" });
    }
  });

  // 2. Compare CV against Job Description (Stellenausschreibung Gegenüberstellung)
  app.post("/api/compare-job", async (req, res) => {
    try {
      const { cvText, cvData, jobDescription } = req.body;
      let textToAnalyze = cvText || "";
      if (cvData) {
        textToAnalyze += "\n" + formatCVDataToText(cvData);
      }

      if (!textToAnalyze.trim()) {
        return res.status(400).json({ error: "Bitte geben Sie einen Lebenslauf ein." });
      }
      if (!jobDescription || !jobDescription.trim()) {
        return res.status(400).json({ error: "Bitte geben Sie die Stellenausschreibung ein." });
      }

      const ai = getGeminiClient();

      const resultText = await generateResilientContent(ai, "gemma-4-31b-it", `Vergleiche den folgenden Lebenslauf (CV) direkt mit der bereitgestellten Stellenausschreibung.
Führe eine präzise Gap-Analyse (Gegenüberstellung) durch. Identifiziere fehlende Keywords, kritische Lücken in Anforderungen sowie Optimierungspotenzial.

Lebenslauf:
"""
${textToAnalyze}
"""

Stellenausschreibung:
"""
${jobDescription}
"""`, {
        systemInstruction: "Du bist ein Senior Recruiter und ATS-Experte. Du vergleichst Bewerberprofile haargenau mit Stellenprofilen, berechnest einen prozentualen Match-Score basierend auf harten Anforderungen und weichen Kriterien, und gibst Entwicklungs- und Formulierungsvorschläge. Antworte auf Deutsch im vorgegebenen JSON-Format.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            matchPercentage: { type: Type.INTEGER, description: "Übereinstimmungs-Score von 0 bis 100 % basierend auf der Eignung für diese Stelle." },
            matchedKeywords: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Wichtige Keywords der Ausschreibung, die im Lebenslauf bereits vorkommen." },
            missingKeywords: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Schlüsselbegriffe und Fähigkeiten aus der Stellenausschreibung, die im Lebenslauf FEHLEN." },
            criticalGaps: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  gap: { type: Type.STRING, description: "Welche Anforderung (z.B. Ausbildung, Programmiersprache, 5 Jahre Erfahrung) fehlt." },
                  recommendation: { type: Type.STRING, description: "Wie der Bewerber diese Lücke schließen oder argumentieren kann (z.B. durch ähnliche Projekte)." }
                },
                required: ["gap", "recommendation"]
              }
            },
            tailoringSuggestions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  section: { type: Type.STRING, description: "Der betroffene Abschnitt des Lebenslaufs (Zusammenfassung, Erfahrung, etc.)." },
                  originalText: { type: Type.STRING, description: "Der aktuelle Text aus dem Lebenslauf des Bewerbers." },
                  suggestedText: { type: Type.STRING, description: "Der umformulierte, ATS-konforme und auf die Stelle zugeschnittene Text." },
                  reason: { type: Type.STRING, description: "Warum diese Anpassung die Chancen beim ATS-Parser erhöht." }
                },
                required: ["section", "originalText", "suggestedText", "reason"]
              }
            },
            roleRelevanceSummary: { type: Type.STRING, description: "Eine kurze, prägnante Zusammenfassung (2-3 Sätze) über die Eignung des Profils für diese spezifische Stelle." }
          },
          required: ["matchPercentage", "matchedKeywords", "missingKeywords", "criticalGaps", "tailoringSuggestions", "roleRelevanceSummary"]
        }
      });
      if (!resultText) {
        throw new Error("Fehler bei der Generierung durch Gemini API.");
      }
      
      const parsed = JSON.parse(resultText);
      res.json(parsed);

    } catch (error: any) {
      console.error("Fehler in /api/compare-job:", error);
      res.status(500).json({ error: error.message || "Interner Serverfehler" });
    }
  });

  // 3. Generate Cover Letter (Anschreiben Generierung)
  app.post("/api/generate-cover-letter", async (req, res) => {
    try {
      const { cvText, cvData, jobDescription, tone, length, customFocus } = req.body;
      let textToAnalyze = cvText || "";
      if (cvData) {
        textToAnalyze += "\n" + formatCVDataToText(cvData);
      }

      if (!textToAnalyze.trim()) {
        return res.status(400).json({ error: "Bitte geben Sie einen Lebenslauf ein." });
      }
      if (!jobDescription || !jobDescription.trim()) {
        return res.status(400).json({ error: "Bitte geben Sie die Stellenausschreibung ein." });
      }

      const ai = getGeminiClient();

      const resultText = await generateResilientContent(ai, "gemma-4-31b-it", `Generiere ein maßgeschneidertes, hochprofessionelles und ATS-freundliches Anschreiben (Cover Letter) auf Deutsch basierend auf dem Lebenslauf und der Stellenausschreibung.

Lebenslauf:
"""
${textToAnalyze}
"""

Stellenausschreibung:
"""
${jobDescription}
"""

Präferenzen:
- Tonfall: ${tone || "professionell und selbstbewusst"}
- Länge: ${length || "Standard (ca. 1 DIN A4 Seite)"}
- Besonderer Fokus: ${customFocus || "Kein spezieller Fokus, ganzheitlich überzeugend"}`, {
        systemInstruction: "Du bist ein renommierter Karriere-Coach und Copywriter. Du schreibst packende, moderne und extrem wirksame Anschreiben für Bewerbungen, die langweilige Floskeln vermeiden und die Stärken des Bewerbers mit den Bedürfnissen des Arbeitgebers verknüpfen. Antworte auf Deutsch im vorgegebenen JSON-Format.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            subjectLine: { type: Type.STRING, description: "Betreffzeile für das Anschreiben (z.B. Bewerbung als X - Referenznummer Y)." },
            salutation: { type: Type.STRING, description: "Anrede (z.B. 'Sehr geehrte Frau Müller,' falls Name in Ausschreibung vorhanden, sonst 'Sehr geehrte Damen und Herren,')." },
            bodyParagraphs: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Eine Liste von Absätzen (Einleitung, Motivation, Eignung/Beispiele, Mehrwert für Firma, Schlusssatz). Jeder Absatz sollte flüssig zu lesen und überzeugend sein." },
            signoff: { type: Type.STRING, description: "Schlussformel (z.B. 'Mit freundlichen Grüßen')." },
            atsTips: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Tipps, warum dieses Anschreiben ATS-optimiert ist (z.B. welche Keywords integriert wurden)." }
          },
          required: ["subjectLine", "salutation", "bodyParagraphs", "signoff", "atsTips"]
        }
      });
      if (!resultText) {
        throw new Error("Fehler bei der Anschreiben-Generierung.");
      }
      
      const parsed = JSON.parse(resultText);
      res.json(parsed);

    } catch (error: any) {
      console.error("Fehler in /api/generate-cover-letter:", error);
      res.status(500).json({ error: error.message || "Interner Serverfehler" });
    }
  });

  // 3b. Redesign CV & Cover Letter in Gelb-Schwarz using Gemma model
  app.post("/api/redesign-cv", async (req, res) => {
    try {
      const {
        cvText,
        style,
        palette,
        primary,
        secondary,
        accent,
        primary_light,
        primary_dark,
        secondary_light,
        secondary_dark,
        manualSketchGrid,
        backgroundType
      } = req.body;
      if (!cvText || !cvText.trim()) {
        return res.status(400).json({ error: "Bitte geben Sie einen Lebenslauf-Text an." });
      }

      const ai = getGeminiClient();

      const isLightBg = backgroundType === "light";
      const actualBgColor = isLightBg ? "#FFFFFF" : "#000000";
      const actualTextColor = isLightBg ? "#1E293B" : "#F8FAFC";

      // 5-color palette details to inject
      const pLight = primary_light || primary || "#FACC15";
      const pDark = primary_dark || primary || "#1E3A8A";
      const sLight = secondary_light || secondary || "#818CF8";
      const sDark = secondary_dark || secondary || "#312E81";
      const acc = accent || "#EC4899";

      const paletteDescription = `Farbpalette: 5-Farben-Harmonie (Farbrad-basiert).
Die exakten harmonischen CSS-Hex-Farbcodes, die du zwingend im Design verwenden MUSST, um erstklassigen, barrierefreien Kontrast (mindestens 4.5:1) auf JEDEM Hintergrundbereich (schwarz oder weiß) zu gewährleisten:
1. Primärfarbe HELL (primary_light): ${pLight} -> Zu verwenden für Texte, Titel oder wichtige Angaben, die auf DUNKLEN oder SCHWARZEN Hintergrundbereichen platziert sind.
2. Primärfarbe DUNKEL (primary_dark): ${pDark} -> Zu verwenden für Texte, Titel oder wichtige Angaben, die auf HELLEN oder WEISSEN Hintergrundbereichen platziert sind.
3. Sekundärfarbe HELL (secondary_light): ${sLight} -> Zu verwenden für sekundäre Angaben, Linien, Beschriftungen oder Akzente auf DUNKLEN oder SCHWARZEN Hintergrundbereichen.
4. Sekundärfarbe DUNKEL (secondary_dark): ${sDark} -> Zu verwenden für sekundäre Angaben, Linien, Beschriftungen oder Akzente auf HELLEN oder WEISSEN Hintergrundbereichen.
5. Akzentfarbe (accent): ${acc} -> Ein flexibler, lebendiger Highlight-Farbcode für besondere Badges, kleine Markierungen oder Hervorhebungen.
- Hintergrundfarbe des Haupt-Dokuments (body background): ${actualBgColor}
- Textfarbe des Haupt-Dokuments (default text color): ${actualTextColor}`;

      const contrastInstruction = `KONTRAST-SZENARIO & LOKALE HINTERGRUND-AUSRICHTUNG (ÄUSSERST WICHTIG):
- Haupt-Hintergrundfarbe (body background): ${actualBgColor}
- Haupt-Textfarbe (default text color): ${actualTextColor}
- Jede Sektion, Spalte oder Zone MUSS die Farben strikt basierend auf ihrem EIGENEN, LOKALEN Hintergrund zuweisen, nicht nach dem globalen Modus!
- Falls das Layout mehrspaltig ist und z. B. eine schwarze/dunkle Spalte (Sidebar) neben einer weißen/hellen Spalte hat:
  * In der DUNKLEN Spalte dürfen AUSSCHLIESSLICH die hellen Farbcodes verwendet werden (primary_light: ${pLight}, secondary_light: ${sLight}, Akzent: ${acc}, helle Textfarbe: ${actualTextColor}). Dunkle Schrift oder dunkle Trennlinien sind dort strengstens verboten (Unleserlichkeit!).
  * In der HELLEN Spalte dürfen AUSSCHLIESSLICH die dunklen Farbcodes verwendet werden (primary_dark: ${pDark}, secondary_dark: ${sDark}, Akzent: ${acc}, dunkle Textfarbe: ${actualTextColor}). Gelbe/orangefarbene oder weiße Titel auf hellem/weißem Grund sind absolut verboten!
- REGEL FÜR BADGES, PILLS, CARDS (z. B. im Bereich Fähigkeiten/Kenntnisse):
  * Jedes Badge, jede Pille oder Karte (alle Elemente mit Umrandung, Rand oder Hintergrund) MUSS zwingend so gestaltet sein, dass die UMRANDUNG (border-color) und der TEXTINHALT (color) die exakt identische Farbe verwenden! (z. B. \`border: 1px solid ${pLight}; color: ${pLight};\` in einer dunklen Sektion oder \`border: 1px solid ${pDark}; color: ${pDark};\` in einer hellen Sektion).
  * Der Hintergrund solcher Badges/Pills darf NIEMALS eine kontrastarme, vollflächige Farbe besitzen (z. B. KEIN hellblaues Badge mit violetter Schrift!). Nutze stattdessen entweder einen transparenten Hintergrund (\`background: transparent;\`) oder eine dezent mit Opazität abgetönte Version der Randfarbe (z. B. \`background: rgba(..., 0.05);\`), damit der Sektionshintergrund durchscheint und der Kontrast gewahrt bleibt.
- STRENGSTES HOVER-VERBOT:
  * Du darfst im gesamten CSS absolut KEINE :hover Styles definieren, die bei Mausberührung (Mouse Over) die Textfarbe, Hintergrundfarbe oder Rahmenfarbe von Textelementen, Boxen, Badges oder Spalten verändern. Ein Hover-Effekt darf die Farben des Dokuments niemals manipulieren, da dies beim interaktiven Betrachten oder beim PDF-Export zu unlesbarem Text führt.`;

      // Setup system instructions matching the user requirements
      const systemInstruction = `Du agierst als mathematischer CSS-Architekt. Deine Aufgabe ist es, ein perfekt aufeinander abgestimmtes Set aus Lebenslauf und Motivationsschreiben als reines JSON auszugeben. 

WICHTIGSTE DESIGN-VORGABE:
Das Design MUSS die im Folgenden beschriebenen Farben des FARB-KONZEPTS verwenden. Die Farben müssen perfekt aufeinander abgestimmt sein. Nutze eine feste, solide Hintergrundfarbe (z. B. ein tiefes, sattes Schwarz oder Anthrazit wie #121212 oder #000000 bei dunklem Hintergrund bzw. #FFFFFF oder #F8FAFC bei hellem Hintergrund, und Akzente in den unten definierten Primär-, Sekundär- und Akzentfarben). Ganzflächige Hintergrund-Verläufe sind strikt verboten. Verläufe dürfen ausschließlich als punktuelle Akzente in geometrischen Elementen verwendet werden.

FARB-KONZEPT:
${paletteDescription}

${contrastInstruction}

Schreibe den Code so, dass der Text direkt in die farbliche und geometrische Gestaltung einbezogen wird (Schlüsselbegriffe in Akzentfarben, Einrückungen entlang der Design-Kanten). Die definierten Farbcodes MÜSSEN im CSS verwendet werden.

Beschränke dich bei der visuellen Strukturierung auf exakt ZWEI umschaltbare Phänotypen (Stil-Variationen), basierend auf der Ziel-Persona: 

### STIL 1: "ORTHOGONAL / ANALYTISCH" (Für Prüfer, Ingenieure, Manager)
- Geometrie: Strikte gerade Linien, 90-Grad-Winkel, messerscharfe Trennlinien und quadratische/rechteckige Box-Strukturen via CSS-Grid und Flexbox.
- Text-Integration: Der Text blockt sich exakt bündig an den vertikalen und horizontalen Linien auf. Keine Kurven. Perfekte Symmetrie und mathematische Strenge.

### STIL 2: "KURVLINEAR / ORGANISCH" (Für Kreative, Raumausstatter, Designer)
- Geometrie: Flüssige, asymmetrische Kurven mittels CSS \`clip-path: path('M...')\` (SVG-Pfad-Syntax nativer Kurven).
- Text-Integration: Zwingender Einsatz von \`shape-outside: polygon(...)\` oder \`ellipse()\` mit \`float: left/right\` und \`shape-margin\`. Der Fließtext muss dynamisch und nahtlos an der Kurve entlanggleiten und sich ihrer Geometrie anpassen.

### DOKUMENTEN-STRUKTUR & OUTPUT
Generiere immer ein Set (Motivationsschreiben + Lebenslauf) in der identischen Design-DNA. Das Motivationsschreiben nutzt das primäre Geometrie-Element (Linie oder Kurve), der Lebenslauf erweitert dies modular in ein mehrspaltiges Layout.

WICHTIGE STRUKTURVORGABEN FÜR DAS MOTIVATIONSSCHREIBEN (cover_letter):
1. Das Motivationsschreiben MUSS zwingend auf exakt eine einzige DIN A4 Seite passen. Vermeide jeglichen Textüberlauf auf eine zweite Seite!
2. KEIN FOTO IM MOTIVATIONSSCHREIBEN: Im Motivationsschreiben darf absolut NIEMALS ein Foto, Porträt, Bildrahmen oder der Avatar-Platzhalter ([AVATAR_PLACEHOLDER]) integriert sein! Das Foto ist ausschließlich für den Lebenslauf gedacht.
3. TEXTKÜRZUNG AUF 3 ABSÄTZE: Um sicherzustellen, dass alles perfekt auf eine einzige A4-Seite passt, MUSS der Text des Motivationsschreibens auf genau drei kurze, prägnante Absätze aufgeteilt und gekürzt werden:
   - Absatz 1 (Einleitung): Kurze Vorstellung und Interesse bekunden.
   - Absatz 2 (Hauptteil): Stärken, relevante Erfahrung und Motivation auf den Punkt gebracht.
   - Absatz 3 (Verabschiedung/Schlusssatz): Ausblick auf das Kennenlernen/Gespräch.
4. Der formale Briefkopf und das Layout des Motivationsschreibens MÜSSEN je nach Spalten-Design des Lebenslaufs wie folgt gestaltet werden:
   - OPTION A: Falls beim Lebenslauf 2 Spalten generiert werden (z. B. mit einer Seitenleiste), kann das Motivationsschreiben wie in beispiel1.pdf ebenfalls ein zweispaltiges Design with einer Seitenleiste links haben:
     * Der Absender-Block (Name, Anschrift, E-Mail, Telefon) steht links in der schmalen Seitenleiste.
     * Die rechte Hauptspalte enthält: Empfänger-Anschrift (linksbündig), Ort & Datum (rechtsbündig platziert), die fette Betreffzeile (linksbündig), gefolgt von Anrede, Fließtext (3 kurze Absätze), Grußformel und Unterschrift.
   - OPTION B (Standard & Standard-Klassisch): Falls KEINE 2 Spalten bzw. Seitenleisten verwendet werden, MUSS das Layout exakt wie in beispiel2.pdf aufgebaut sein:
     * Absender-Block (Vorname, Nachname, Anschrift, Telefon, E-Mail) ganz oben, linksbündig platziert.
     * Darunter (mit passendem Abstand) die Empfänger-Anschrift linksbündig platziert (passend für Sichtfenster).
     * Das Datum (z. B. "Ort, Datum" / "Frankfurt, 20.11.20XX") MUSS zwingend auf der rechten Seite (rechtsbündig) genau eine Zeile ÜBER der Betreffzeile platziert sein!
     * Direkt darunter linksbündig die aussagekräftige, fette Betreffzeile (z. B. "Bewerbung als [Stellenbezeichnung]").
     * Formelle, höfliche Anrede (z. B. "Sehr geehrte Damen und Herren," oder konkreter Name).
     * Ein professioneller, auf den Punkt formulierter Fließtext aus genau 3 kurzen, prägnanten Absätzen, der mitsamt Briefkopf und Grußformel perfekt auf die eine A4-Seite passt.
     * Professionelle Grußformel (z. B. "Mit freundlichen Grüßen") und Platz für die Unterschrift.
5. Der gesamte Text in beiden Dokumenten (Sowohl Lebenslauf als auch Motivationsschreiben) MUSS für den Nutzer editierbar sein. Verwende daher im HTML-Code für das Haupt-Wrapper-Element oder den body das Attribut contenteditable="true" (z. B. <div class="..." contenteditable="true"> oder <body contenteditable="true">).

Du fungierst als reine API. Du darfst AUSSCHLIESSLICH ein valides, parsebares JSON-Objekt ausgeben (KEIN Intro/Outro, KEINE Markdown-Code-Ticks).

WICHTIG (Prävention von JSON-Parse-Fehlern):
Da HTML- und CSS-Inhalte viele Gänsefüßchen (") und Zeilenumbrüche enthalten, MÜSSEN die Code-Strings in deiner JSON-Antwort zwingend zusätzlich in diese Custom-Tags eingebettet sein. Dies verhindert jegliche Parse-Fehler:

Für den Lebenslauf (resume):
- HTML-Inhalt zwingend umschließen mit: [START_RESUME_HTML]...DEIN_HTML_CODE...[END_RESUME_HTML]
- CSS-Inhalt zwingend umschließen mit: [START_RESUME_CSS]...DEIN_CSS_CODE...[END_RESUME_CSS]

Für das Motivationsschreiben (cover_letter):
- HTML-Inhalt zwingend umschließen mit: [START_COVER_LETTER_HTML]...DEIN_HTML_CODE...[END_COVER_LETTER_HTML]
- CSS-Inhalt zwingend umschließen mit: [START_COVER_LETTER_CSS]...DEIN_CSS_CODE...[END_COVER_LETTER_CSS]

Nutze exakt dieses Schema als Antwortstruktur:
{
  "resume": {
    "html": "[START_RESUME_HTML]\\nDEIN_HTML_CODE_HIER\\n[END_RESUME_HTML]",
    "css": "[START_RESUME_CSS]\\nDEIN_CSS_CODE_HIER\\n[END_RESUME_CSS]"
  },
  "cover_letter": {
    "html": "[START_COVER_LETTER_HTML]\\nDEIN_HTML_CODE_HIER\\n[END_COVER_LETTER_HTML]",
    "css": "[START_COVER_LETTER_CSS]\\nDEIN_CSS_CODE_HIER\\n[END_COVER_LETTER_CSS]"
  }
}`;

      let promptText = `Bitte erstelle das harmonische Design für diesen Lebenslauf im folgenden Stil: ${style === "kurvlinear" ? "KURVLINEAR / ORGANISCH" : "ORTHOGONAL / ANALYTISCH"}.
Nutze das folgende Farb-Harmonie-Konzept: ${palette}.

Lebenslauf-Inhalt:
"""
${cvText}
"""`;

      if (manualSketchGrid) {
        promptText += `\n\nACHTUNG - MANUELLE DESIGN-SKIZZE VOM BENUTZER:
Der Benutzer hat eine manuelle Layout-Skizze für das Dokument gezeichnet. Verwende diese Struktur exakt für dein generiertes HTML und CSS!
Jeder Buchstabe repräsentiert eine Zone auf dem DIN A4 Blatt (Grid von 15 Spalten x 20 Zeilen):
- 'B' steht für: Blaue Zone (Persönliche Daten, Name, E-Mail, Telefon, Anschrift)
- 'Y' steht für: Gelbe Zone (Fähigkeiten, Kenntnisse, Programmiersprachen, Zertifikate)
- 'R' steht für: Rote Zone (Berufserfahrung, Arbeitgeber, Zeiträume, Projektdetails)
- 'I' steht für: Schwarze Zone (Bild / Foto-Platzhalter)
- 'G' steht für: Grüne Zone (Ausbildung, Schule, Studium, Abschlüsse, Weiterbildungen)
- 'P' steht für: Lila Zone (Style-Aufteilung, gerade Trennlinien, dekorative Wellen, grafische Trenner etc.)
- '.' steht für: Leere Zone (Hintergrund / Leerraum)

WICHTIG ZUR SKIZZEN-INTERPRETATION:
Die Skizze soll als übergeordnete Orientierung verstanden werden und muss nicht auf den Punkt präzise im Raster abgebildet werden. Wenn der Benutzer z.B. 2 viereckige Zonen direkt untereinander zeichnet, sollten diese im generierten Design sauber vertikal gefluchtet und gerade ausgerichtet sein (gerade Kanten), solange sie nicht an einer Kurve hängen. Nutze die Skizze als grobe Aufteilungsvorlage, sorge aber im CSS für mathematisch exakte Ausrichtungen, gerade verlaufende Fluchten für untereinander liegende Boxen und ein harmonisches Gesamtbild.

Hier ist die gezeichnete Style-Skizze des Benutzers:
[START_SKETCH]
${manualSketchGrid}
[END_SKETCH]

Bitte richte dein CSS (z.B. Grid-Zonen, Flexbox-Ausrichtung, Spaltenaufteilung) und deine HTML-Elemente exakt an dieser Zonenaufteilung aus! Wenn 'I' (Bild) oben rechts gezeichnet ist, platziere das Bild oben rechts. Wenn 'B' (Persönliche Daten) links als Spalte gezeichnet ist, erstelle eine linke Seitenleiste für die persönlichen Daten. Wenn 'Y' (Fähigkeiten) unten quer verläuft, platziere Fähigkeiten am unteren Seitenrand, etc.`;
      }

      promptText += `\n\nACHTUNG - BENUTZER-BILD (PORTRAIT FOTO) / PLATZHALTER:
Die KI soll einen definierten Rahmen/Platzhalter positionieren, in dem das Portrait-Foto des Benutzers später eingefügt wird. 
Dieses Bild/Foto darf NUR im Lebenslauf (resume) verwendet werden!
Im Motivationsschreiben (cover_letter) darf absolut NIEMALS ein Foto, Bild, Porträt oder der Avatar-Platzhalter ([AVATAR_PLACEHOLDER]) eingebaut werden. Das Motivationsschreiben enthält kein Foto!
Wenn du im HTML des Lebenslaufs ein Bild (Foto-Platzhalter, Zone 'I' oder einen generellen Profilbild-Platzhalter) erstellst, MUSST du im src-Attribut exakt folgenden String verwenden:
src="[AVATAR_PLACEHOLDER]"
Damit kann das System das Foto später dynamisch einfügen. Nutze keine Platzhalter-Bilder aus dem Internet (wie via.placeholder.com). Gestalte den Container für dieses Bild per CSS so, dass er auch leer gut aussieht (z.B. mit passender Hintergrundfarbe oder Rand).

ZUSÄTZLICHE BEWERBUNGS-KÜRZUNG:
Kürze das Motivationsschreiben zwingend auf genau drei kurze Absätze (Einleitung, Hauptteil, Schlusssatz/Verabschiedung). Es ist ansonsten zu lang für eine A4-Seite.`;

      // Use the gemma model as strictly requested
      const resultText = await generateResilientContent(ai, "gemma-4-31b-it", promptText, {
        temperature: 0.2,
        systemInstruction,
      });

      if (!resultText) {
        throw new Error("Fehler bei der Redesign-Generierung.");
      }

      const parsed = robustExtractRedesignJson(resultText);

      res.json(parsed);
    } catch (error: any) {
      console.error("Fehler in /api/redesign-cv:", error);
      res.status(500).json({ error: error.message || "Interner Serverfehler" });
    }
  });

  // 4. Process scanned PDFs or images directly by sending them to the model (when GDPR constraints are relaxed)
  app.post("/api/process-direct-pdf", async (req, res) => {
    try {
      const { pdfBase64, mode, model } = req.body;
      if (!pdfBase64) {
        return res.status(400).json({ error: "Keine Datei im Base64-Format übergeben." });
      }

      const selectedModel = model || "gemma-4-31b-it";
      const ai = getGeminiClient();

      let mimeType = "application/pdf";
      let base64Data = pdfBase64;
      if (pdfBase64.startsWith("data:")) {
        const match = pdfBase64.match(/^data:([^;]+);base64,(.*)$/);
        if (match) {
          mimeType = match[1];
          base64Data = match[2];
        }
      }

      let prompt = "";
      let config: any = {
        temperature: 0.2,
      };

      if (mode === "ats") {
        prompt = `Du bist ein hochpräziser ATS-Lebenslauf-Parser. 
Analysiere das beigefügte Dokument (Lebenslauf) vollständig und strukturiere alle Informationen exakt in das folgende JSON-Format.

WICHTIG: Da der Nutzer die DSGVO-Beschränkungen explizit gelockert hat, sollst du die echten Kontaktdaten (Name, Adresse, E-Mail, Telefon) aus dem Lebenslauf direkt extrahieren und eintragen (NICHT maskieren!).

SCHEMA-VORGABE:
{ 
  "basics": { "name": "Vollständiger Name", "address": "Adresse", "email": "E-Mail-Adresse", "phone": "Telefonnummer" }, 
  "work": [ 
    { "name": "Firmenname", "position": "Position/Rolle", "startDate": "Startdatum", "endDate": "Enddatum oder 'Heute'", "highlights": ["Aufgabe 1", "Aufgabe 2"] } 
  ], 
  "education": [ 
    { "institution": "Schule/Universität", "title": "Abschluss/Grad", "period": "Zeitraum" } 
  ],
  "skills": ["Skill 1", "Skill 2"] 
}

Gib AUSSCHLIESSLICH das bereinigte JSON-Objekt zurück. Keine Erklärungen, kein Markdown-Wrapper (oder wenn doch, achte darauf, dass es sauber als JSON geparst werden kann).`;

        config.responseMimeType = "application/json";
        config.responseSchema = {
          type: Type.OBJECT,
          required: ["basics", "work", "education", "skills"],
          properties: {
            basics: {
              type: Type.OBJECT,
              required: ["name", "email", "phone", "address"],
              properties: {
                name: { type: Type.STRING },
                email: { type: Type.STRING },
                phone: { type: Type.STRING },
                address: { type: Type.STRING },
              },
            },
            work: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  position: { type: Type.STRING },
                  startDate: { type: Type.STRING },
                  endDate: { type: Type.STRING },
                  highlights: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                },
              },
            },
            education: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  institution: { type: Type.STRING },
                  title: { type: Type.STRING },
                  period: { type: Type.STRING },
                },
              },
            },
            skills: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
        };
      } else {
        // Mode is "text" (for raw extraction of resume or job description)
        prompt = `Lies das beigefügte Dokument vollständig aus und erstelle eine perfekt strukturierte, fehlerfreie und vollständige Textversion des Inhalts auf Deutsch.
Rekonstruiere den Text chronologisch und übersichtlich, sodass alle Abschnitte (Berufserfahrung, Ausbildung, Fähigkeiten etc.) klar lesbar sind.
Gib nur den extrahierten, formatierten Text zurück, ohne Kommentare oder Einleitungen.`;
      }

      console.log(`[Direct PDF Engine] Processing file (${mimeType}, size: ${base64Data.length} chars) with model ${selectedModel} in mode ${mode}...`);

      const contents = [
        prompt,
        {
          inlineData: {
            mimeType: mimeType,
            data: base64Data
          }
        }
      ];

      let resultText = await generateResilientContent(ai, selectedModel, contents, config);

      if (!resultText) {
        throw new Error("Keine Antwort vom Modell erhalten.");
      }

      // Cleanup some weird unicode literals if the model generated them literally
      resultText = resultText.replace(/\\u([0-9a-fA-F]{4})/g, (match, grp) => String.fromCharCode(parseInt(grp, 16)));
      resultText = resultText.replace(/u25[a-fA-F0-9]{2}/gi, "-").replace(/[●•·]/g, "-");

      console.log(`[Direct PDF Engine] Successfully processed. Output length: ${resultText.length}`);

      if (mode === "ats") {
        let parsed;
        let cleanText = resultText.trim();
        if (cleanText.includes("```json")) {
          cleanText = cleanText.substring(cleanText.indexOf("```json") + 7);
          const endIdx = cleanText.lastIndexOf("```");
          if (endIdx !== -1) {
            cleanText = cleanText.substring(0, endIdx);
          }
        } else if (cleanText.includes("```")) {
          cleanText = cleanText.substring(cleanText.indexOf("```") + 3);
          const endIdx = cleanText.lastIndexOf("```");
          if (endIdx !== -1) {
            cleanText = cleanText.substring(0, endIdx);
          }
        }
        cleanText = cleanText.trim();

        try {
          parsed = JSON.parse(cleanText);
        } catch (parseErr) {
          console.warn("Direct JSON parsing failed, attempting brace substring fallback:", parseErr);
          const firstBracket = cleanText.indexOf('{');
          const lastBracket = cleanText.lastIndexOf('}');
          if (firstBracket !== -1 && lastBracket !== -1) {
            parsed = JSON.parse(cleanText.substring(firstBracket, lastBracket + 1));
          } else {
            throw new Error("Das Modell hat kein gültiges JSON-Format zurückgegeben. Text: " + resultText);
          }
        }
        res.json({ data: parsed });
      } else {
        res.json({ text: resultText });
      }
    } catch (error: any) {
      console.error("Fehler in /api/process-direct-pdf:", error);
      res.status(500).json({ error: error.message || "Interner Serverfehler beim direkten Analysieren der Datei." });
    }
  });

// Function to start server in non-serverless environments
async function startServer() {
  const PORT = 3000;

  // --- Serve Vite App / Production Static Files ---
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[ATS Builder Server] running on http://localhost:${PORT}`);
  });
}

if (!process.env.VERCEL) {
  startServer();
}
