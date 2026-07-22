import React, { useState, useEffect, useMemo, useRef } from "react";
import { motion } from "motion/react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import html2pdf from "html2pdf.js";
import { 
  FileText, 
  Briefcase, 
  ShieldCheck, 
  User, 
  Layers, 
  ArrowRight, 
  Copy, 
  Check, 
  Download, 
  Plus, 
  Trash2, 
  RefreshCw, 
  Eye, 
  Sparkles,
  Info,
  Lock,
  ChevronRight,
  FileCheck,
  AlertCircle,
  AlertTriangle,
  X,
  Gauge,
  Target,
  Wand2,
  Loader2,
  Printer,
  Mail,
  MapPin,
  Maximize2,
  Minimize2,
  Edit3,
  Settings,
  Home,
  Zap,
  HelpCircle,
  CheckCircle2
} from "lucide-react";
import { AtsGauge } from "./components/AtsGauge";
import logo from "./logo.png";

// Ensure window types are known
declare global {
  interface Window {
    pdfjsLib: any;
    PDFLib: any;
  }
}

interface MaskMap {
  name: string;
  email: string;
  phone: string;
  address?: string;
}

const InteractiveLoader = ({ mode }: { mode: "ats" | "motivation" | "redesign" }) => {
  const [loadingStep, setLoadingStep] = useState(0);
  const steps = mode === "ats" ? [
    "Sichere Verbindung zur KI-Schnittstelle wird hergestellt...",
    "DSGVO-konforme Anonymität der Daten wird verifiziert...",
    "Anonymisierter Text wird analysiert...",
    "Abschnitte (Kontakt, Werdegang, Kompetenzen) werden strukturiert...",
    "ATS-Kompatibilität wird bewertet...",
    "Strukturierte Daten werden für Ausgabe formatiert..."
  ] : mode === "motivation" ? [
    "Sichere Verbindung zur KI-Schnittstelle wird hergestellt...",
    "Lebenslauf und Stellenausschreibung werden abgeglichen...",
    "Lücken in Anforderungen werden identifiziert...",
    "Fehlende Keywords werden extrahiert...",
    "Formulierungsvorschläge werden berechnet...",
    "ATS-konformes Motivationsschreiben wird entworfen..."
  ] : [
    "Sichere Verbindung zur KI-Schnittstelle wird hergestellt...",
    "DSGVO-konforme Anonymität der Daten wird verifiziert...",
    "Lebenslauf wird auf chromatische Design-Konsistenz analysiert...",
    "Mathematische CSS-Geometrie (Grid, Flexbox & Clip-Paths) wird berechnet...",
    "Gegenüberstellung von Orthogonal- und Kurvlinear-DNA läuft...",
    "HTML- und CSS-Vektorgeometrien werden zusammengefügt..."
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 2000);
    return () => clearInterval(interval);
  }, [steps.length]);

  const colorClass = mode === "ats" 
    ? { glow: "bg-emerald-500/20", border: "border-emerald-500/20 border-t-emerald-500", textIcon: "text-emerald-400", textDesc: "text-emerald-400", progress: "bg-emerald-500" }
    : mode === "redesign"
    ? { glow: "bg-yellow-500/20", border: "border-yellow-500/20 border-t-yellow-500", textIcon: "text-yellow-400", textDesc: "text-yellow-400", progress: "bg-yellow-500" }
    : { glow: "bg-indigo-500/20", border: "border-indigo-500/20 border-t-indigo-500", textIcon: "text-indigo-400", textDesc: "text-indigo-400", progress: "bg-indigo-500" };

  return (
    <div className="h-full flex flex-col items-center justify-center text-center py-20 px-6 space-y-6">
      <div className="relative">
        {/* Glowing circle animation */}
        <div className={`absolute inset-0 rounded-full ${colorClass.glow} blur-xl animate-ping duration-1000`}></div>
        <div className={`w-16 h-16 rounded-full border-4 ${colorClass.border} animate-spin flex items-center justify-center relative z-10`}>
          <Sparkles className={`h-6 w-6 ${colorClass.textIcon} animate-pulse`} />
        </div>
      </div>
      <div className="space-y-3 max-w-sm">
        <h4 className="text-sm font-bold text-white tracking-wide uppercase">
          KI-Verarbeitung läuft
        </h4>
        <p className={`text-xs ${colorClass.textDesc} font-mono min-h-[32px] flex items-center justify-center leading-normal`}>
          {steps[loadingStep]}
        </p>
        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-3">
          <div 
            className={`${colorClass.progress} h-full transition-all duration-1000 ease-out`}
            style={{ width: `${((loadingStep + 1) / steps.length) * 100}%` }}
          />
        </div>
        <span className="text-[10px] text-slate-500 block pt-1 font-mono">
          Schritt {loadingStep + 1} von {steps.length}
        </span>
      </div>
    </div>
  );
};

const countGermanSyllables = (word: string): number => {
  word = word.toLowerCase().trim().replace(/[^a-zäöüß-]/g, "");
  if (!word) return 0;
  if (word.length <= 3) return 1;
  
  let temp = word;
  // Combine common German vowel clusters/diphthongs into a single representation for counting
  temp = temp.replace(/(ei|ie|au|eu|äu|ou|oe|ae|ue)/g, "a");
  
  const vowels = temp.match(/[aeiouäöüy]/gi);
  const count = vowels ? vowels.length : 0;
  
  return count > 0 ? count : 1;
};

const analyzeGermanCoverLetterText = (htmlString: string) => {
  const doc = new DOMParser().parseFromString(htmlString, 'text/html');
  const text = doc.body.textContent || "";
  
  const cleanText = text.trim();
  if (!cleanText) {
    return { 
      words: 0, 
      sentences: 0, 
      asl: 0, 
      asw: 0, 
      score: 0, 
      level: "Kein Text", 
      description: "Es wurde noch kein Text generiert.", 
      colorClass: "text-slate-400 bg-slate-500/10 border-slate-500/20" 
    };
  }
  
  const words = cleanText
    .split(/[\s,.;:!?()"-]+/)
    .filter(w => w.trim().length > 0 && /[a-zA-ZäöüÄÖÜß]/.test(w));
    
  const wordCount = words.length;
  
  const sentences = cleanText
    .split(/(?<![A-Z][a-z]\.)(?<![A-Z]\.)(?<!\b[zZ]\.[bB]\.)(?<!\b[uU]\.[aA]\.)(?<!\b[bB]zw\.)(?<!\b[cCc]a\.)(?<=[.!?])\s+/)
    .filter(s => s.trim().length > 0);
    
  const sentenceCount = Math.max(1, sentences.length);
  
  let totalSyllables = 0;
  words.forEach(word => {
    totalSyllables += countGermanSyllables(word);
  });
  
  const asl = wordCount / sentenceCount;
  const asw = wordCount > 0 ? totalSyllables / wordCount : 0;
  
  let score = 180 - asl - (58.5 * asw);
  score = Math.max(0, Math.min(100, Math.round(score)));
  
  let level = "Standard";
  let colorClass = "text-blue-400 bg-blue-500/10 border-blue-500/20";
  let description = "Ideale professionelle Verständlichkeit (vergleichbar mit Qualitätsmedien).";
  
  if (score >= 80) {
    level = "Sehr leicht";
    colorClass = "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
    description = "Besonders einfach und direkt formuliert.";
  } else if (score >= 65) {
    level = "Leicht";
    colorClass = "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
    description = "Flüssig und unkompliziert verständlich.";
  } else if (score >= 50) {
    level = "Standard";
    colorClass = "text-blue-400 bg-blue-500/10 border-blue-500/20";
    description = "Professioneller Ton, gut lesbar und strukturiert.";
  } else if (score >= 35) {
    level = "Anspruchsvoll";
    colorClass = "text-yellow-400 bg-yellow-500/10 border-yellow-500/20";
    description = "Satzstrukturen sind akademischer Natur. Eventuell kürzen.";
  } else {
    level = "Sehr anspruchsvoll";
    colorClass = "text-rose-400 bg-rose-500/10 border-rose-500/20";
    description = "Sehr lange Sätze oder schwere Begriffe. Für Personalentscheider schwer lesbar.";
  }
  
  return {
    words: wordCount,
    sentences: sentenceCount,
    asl: Math.round(asl * 10) / 10,
    asw: Math.round(asw * 10) / 10,
    score,
    level,
    description,
    colorClass
  };
};

interface ContrastIssue {
  idx: number;
  tagName: string;
  textSnippet: string;
  textColor: string;
  bgColor: string;
  ratio: number;
  requiredRatio: number;
  fontSize: string;
  isLargeText: boolean;
  passed: boolean;
}

const parseRgb = (rgbStr: string): { r: number; g: number; b: number } | null => {
  if (!rgbStr) return null;
  const match = rgbStr.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)$/);
  if (match) {
    return {
      r: parseInt(match[1], 10),
      g: parseInt(match[2], 10),
      b: parseInt(match[3], 10)
    };
  }
  if (rgbStr.startsWith("#")) {
    const hex = rgbStr.slice(1);
    if (hex.length === 3) {
      return {
        r: parseInt(hex[0] + hex[0], 16),
        g: parseInt(hex[1] + hex[1], 16),
        b: parseInt(hex[2] + hex[2], 16)
      };
    } else if (hex.length === 6) {
      return {
        r: parseInt(hex.substring(0, 2), 16),
        g: parseInt(hex.substring(2, 4), 16),
        b: parseInt(hex.substring(4, 6), 16)
      };
    }
  }
  return null;
};

const getRelativeLuminance = (r: number, g: number, b: number): number => {
  const a = [r, g, b].map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
};

const calculateContrastRatio = (color1: string, color2: string): number => {
  const rgb1 = parseRgb(color1);
  const rgb2 = parseRgb(color2);
  if (!rgb1 || !rgb2) return 1.0;

  const l1 = getRelativeLuminance(rgb1.r, rgb1.g, rgb1.b);
  const l2 = getRelativeLuminance(rgb2.r, rgb2.g, rgb2.b);

  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);

  return (lighter + 0.05) / (darker + 0.05);
};

const getActualBackgroundColor = (element: HTMLElement, win: Window): string => {
  let el: HTMLElement | null = element;
  while (el) {
    const style = win.getComputedStyle(el);
    const bg = style.backgroundColor;
    if (bg && bg !== "transparent" && bg !== "rgba(0, 0, 0, 0)" && !bg.endsWith(", 0)")) {
      return bg;
    }
    el = el.parentElement;
  }
  
  // Inspect HTML and Body
  const body = win.document.body;
  if (body) {
    const bodyStyle = win.getComputedStyle(body);
    const bodyBg = bodyStyle.backgroundColor;
    if (bodyBg && bodyBg !== "transparent" && bodyBg !== "rgba(0, 0, 0, 0)" && !bodyBg.endsWith(", 0)")) {
      return bodyBg;
    }
  }
  
  const html = win.document.documentElement;
  if (html) {
    const htmlStyle = win.getComputedStyle(html);
    const htmlBg = htmlStyle.backgroundColor;
    if (htmlBg && htmlBg !== "transparent" && htmlBg !== "rgba(0, 0, 0, 0)" && !htmlBg.endsWith(", 0)")) {
      return htmlBg;
    }
  }

  // If we couldn't find any background color, try to infer from body text color.
  // If the body text is dark, the background is probably light (white).
  // If the body text is light, the background is probably dark (black).
  if (body) {
    const bodyStyle = win.getComputedStyle(body);
    const color = bodyStyle.color;
    const rgb = parseRgb(color);
    if (rgb) {
      const textLuminance = getRelativeLuminance(rgb.r, rgb.g, rgb.b);
      if (textLuminance < 0.5) {
        // Dark text -> default background to white
        return "rgb(255, 255, 255)";
      }
    }
  }

  return "rgb(18, 18, 18)";
};

const checkIframeContrast = (iframe: HTMLIFrameElement): ContrastIssue[] => {
  const doc = iframe.contentDocument || iframe.contentWindow?.document;
  if (!doc) return [];

  const elements = doc.querySelectorAll("*");
  const issues: ContrastIssue[] = [];
  const win = iframe.contentWindow;
  if (!win) return [];

  let idx = 0;
  elements.forEach((el) => {
    const htmlEl = el as HTMLElement;
    
    let hasDirectText = false;
    for (let i = 0; i < htmlEl.childNodes.length; i++) {
      const child = htmlEl.childNodes[i];
      if (child.nodeType === Node.TEXT_NODE && child.textContent?.trim()) {
        hasDirectText = true;
        break;
      }
    }

    if (!hasDirectText) return;

    const tagName = htmlEl.tagName.toLowerCase();
    if (["script", "style", "noscript", "iframe", "svg", "hr", "br", "html", "body"].includes(tagName)) return;

    const style = win.getComputedStyle(htmlEl);
    
    if (style.display === "none" || style.visibility === "hidden" || style.opacity === "0") return;

    const textColor = style.color;
    const bgColor = getActualBackgroundColor(htmlEl, win);
    
    const ratio = calculateContrastRatio(textColor, bgColor);

    const fontSizeStr = style.fontSize;
    const fontWeightStr = style.fontWeight;
    const fontSize = parseFloat(fontSizeStr) || 12;
    const isBold = fontWeightStr === "bold" || parseInt(fontWeightStr, 10) >= 600;

    const isLargeText = fontSize >= 24 || (fontSize >= 18.67 && isBold);
    const requiredRatio = isLargeText ? 3.0 : 4.5;
    const passed = ratio >= requiredRatio;

    htmlEl.setAttribute("data-contrast-idx", idx.toString());

    issues.push({
      idx,
      tagName: htmlEl.tagName.toUpperCase(),
      textSnippet: htmlEl.textContent?.trim().substring(0, 50) || "",
      textColor,
      bgColor,
      ratio: Math.round(ratio * 100) / 100,
      requiredRatio,
      fontSize: `${Math.round(fontSize)}px`,
      isLargeText,
      passed
    });
    idx++;
  });

  return issues;
};

const injectHighlightStyles = (iframe: HTMLIFrameElement, failingIndices: number[]) => {
  const doc = iframe.contentDocument || iframe.contentWindow?.document;
  if (!doc) return;

  const existingStyle = doc.getElementById("contrast-highlight-style");
  if (existingStyle) {
    existingStyle.remove();
  }

  if (failingIndices.length === 0) return;

  const styleEl = doc.createElement("style");
  styleEl.id = "contrast-highlight-style";
  
  const selectors = failingIndices.map(idx => `[data-contrast-idx="${idx}"]`).join(", ");
  styleEl.innerHTML = `
    ${selectors} {
      outline: 2px dashed #f43f5e !important;
      outline-offset: 2px !important;
      background-color: rgba(244, 63, 94, 0.15) !important;
      position: relative !important;
      transition: all 0.2s ease !important;
    }
    ${selectors}:hover {
      outline: 2px solid #f43f5e !important;
      background-color: rgba(244, 63, 94, 0.3) !important;
    }
  `;
  doc.head.appendChild(styleEl);
};

const focusContrastElement = (iframe: HTMLIFrameElement, idx: number) => {
  const doc = iframe.contentDocument || iframe.contentWindow?.document;
  if (!doc) return;

  const el = doc.querySelector(`[data-contrast-idx="${idx}"]`) as HTMLElement;
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "center" });
    
    const originalTransition = el.style.transition;
    const originalOutline = el.style.outline;
    
    el.style.transition = "all 0.3s ease";
    el.style.outline = "4px solid #f43f5e";
    
    setTimeout(() => {
      el.style.outline = "2px dashed #f43f5e";
      setTimeout(() => {
        el.style.outline = "4px solid #f43f5e";
        setTimeout(() => {
          el.style.outline = originalOutline;
          el.style.transition = originalTransition;
        }, 300);
      }, 300);
    }, 300);
  }
};

export default function App() {
  // Navigation Tabs: "home" vs "ats" vs "motivation" vs "redesign"
  const [activeMode, setActiveMode] = useState<"home" | "ats" | "motivation" | "redesign">("home");

  // Scroll to top of window whenever workflow mode changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [activeMode]);

  // --- Contrast Check States ---
  const [contrastIssues, setContrastIssues] = useState<ContrastIssue[]>([]);
  const [isContrastChecking, setIsContrastChecking] = useState(false);
  const [highlightContrastFailures, setHighlightContrastFailures] = useState(false);
  const [hasCheckedContrast, setHasCheckedContrast] = useState(false);

  // --- Mode 3: Gelb-Schwarz-Redesign States ---
  const [redesignPdfFile, setRedesignPdfFile] = useState<File | null>(null);
  const [redesignAvatarFile, setRedesignAvatarFile] = useState<File | null>(null);
  const [redesignAvatarBase64, setRedesignAvatarBase64] = useState<string>("");
  const [redesignExtractedText, setRedesignExtractedText] = useState("");
  const [redesignMaskedText, setRedesignMaskedText] = useState("");
  const [isRedesignExtracting, setIsRedesignExtracting] = useState(false);
  const [isRedesignSending, setIsRedesignSending] = useState(false);
  const [redesignStyle, setRedesignStyle] = useState<"orthogonal" | "kurvlinear">("orthogonal");
  const [redesignPalette, setRedesignPalette] = useState<"monochromatic" | "split_complementary" | "triadic">("monochromatic");
  const [redesignBaseHue, setRedesignBaseHue] = useState<number>(45); // default bright golden-yellow
  const [customColors, setCustomColors] = useState<Record<string, string>>({});
  const [redesignBackgroundType, setRedesignBackgroundType] = useState<"dark" | "light">("dark");

  useEffect(() => {
    setCustomColors({});
  }, [redesignBaseHue, redesignPalette, redesignBackgroundType]);
  const [redesignSelectedStyle, setRedesignSelectedStyle] = useState<"orthogonal" | "kurvlinear">("orthogonal");
  const [isEditingEnabled, setIsEditingEnabled] = useState(false);
  const [isRedesignFullscreen, setIsRedesignFullscreen] = useState(false);
  const [redesignResult, setRedesignResult] = useState<{
    orthogonal: {
      resume: { html: string; css: string };
      cover_letter: { html: string; css: string };
    } | null;
    kurvlinear: {
      resume: { html: string; css: string };
      cover_letter: { html: string; css: string };
    } | null;
  } | null>(null);
  const [redesignSelectedDoc, setRedesignSelectedDoc] = useState<"resume" | "cover_letter">("resume");
  const [rawRedesignJsonText, setRawRedesignJsonText] = useState("");
  const [appliedColors, setAppliedColors] = useState<{
    resume: { primary: string; secondary: string; accent: string; bg: string; text: string };
    cover_letter: { primary: string; secondary: string; accent: string; bg: string; text: string };
  }>({
    resume: { primary: '#FACC15', secondary: '#78350F', accent: '#FEF08A', bg: '#000000', text: '#F8FAFC' },
    cover_letter: { primary: '#FACC15', secondary: '#78350F', accent: '#FEF08A', bg: '#000000', text: '#F8FAFC' }
  });

  // --- Manual Style Sketchpad States ---
  const [isManualSketchOpen, setIsManualSketchOpen] = useState(false);
  const [sketchColor, setSketchColor] = useState<string>("#2563EB"); // Default: Blue (Persönliche Daten)
  const [sketchBrushSize, setSketchBrushSize] = useState<number>(12);
  const [isDrawingSketch, setIsDrawingSketch] = useState(false);
  const [useSketchInAi, setUseSketchInAi] = useState(true);
  const [sketchGridString, setSketchGridString] = useState<string>("");
  const [sketchMode, setSketchMode] = useState<"grid" | "freehand">("grid");
  const [sketchPrompt, setSketchPrompt] = useState<string>("");
  const [sketchDataUrl, setSketchDataUrl] = useState<string>("");
  const sketchCanvasRef = useRef<HTMLCanvasElement>(null);
  const sketchStartPosRef = useRef<{ x: number; y: number } | null>(null);
  const sketchSnapshotRef = useRef<ImageData | null>(null);

  // Sampling pixel color helpers
  const parseRgb = (rgbStr: string): { r: number; g: number; b: number } | null => {
    const match = rgbStr.match(/\d+/g);
    if (!match || match.length < 3) return null;
    return {
      r: parseInt(match[0], 10),
      g: parseInt(match[1], 10),
      b: parseInt(match[2], 10),
    };
  };

  const sampleCanvasToGrid = (canvas: HTMLCanvasElement): string[][] => {
    const ctx = canvas.getContext("2d");
    if (!ctx) return [];
    const cols = 15;
    const rows = 20;
    const grid: string[][] = [];
    const cellW = canvas.width / cols;
    const cellH = canvas.height / rows;

    for (let r = 0; r < rows; r++) {
      const row: string[] = [];
      for (let c = 0; c < cols; c++) {
        // Sample pixel block centered inside each cell
        const imgData = ctx.getImageData(
          Math.floor(c * cellW + cellW / 4),
          Math.floor(r * cellH + cellH / 4),
          Math.max(1, Math.floor(cellW / 2)),
          Math.max(1, Math.floor(cellH / 2))
        );
        const pixels = imgData.data;

        let blueCount = 0;
        let yellowCount = 0;
        let redCount = 0;
        let blackCount = 0;
        let greenCount = 0;
        let purpleCount = 0;
        let transparentCount = 0;

        for (let i = 0; i < pixels.length; i += 4) {
          const rVal = pixels[i];
          const gVal = pixels[i + 1];
          const bVal = pixels[i + 2];
          const aVal = pixels[i + 3];

          if (aVal < 50) {
            transparentCount++;
            continue;
          }

          // Strict color boundaries to match exact brushes:
          // Blue: #2563EB (37, 99, 235)
          // Yellow: #FACC15 (250, 204, 21)
          // Red: #EF4444 (239, 68, 68)
          // Black: #000000 (0, 0, 0)
          // Green: #22C55E (34, 197, 94)
          // Purple: #A855F7 (168, 85, 247)
          if (rVal < 50 && gVal < 50 && bVal < 50) {
            blackCount++;
          } else if (rVal > 150 && gVal > 150 && bVal < 100) {
            yellowCount++;
          } else if (rVal > 150 && gVal < 100 && bVal < 100) {
            redCount++;
          } else if (rVal < 100 && gVal < 150 && bVal > 150) {
            blueCount++;
          } else if (rVal < 100 && gVal > 150 && bVal < 120) {
            greenCount++;
          } else if (rVal > 120 && gVal < 100 && bVal > 150) {
            purpleCount++;
          } else {
            transparentCount++;
          }
        }

        const max = Math.max(blueCount, yellowCount, redCount, blackCount, greenCount, purpleCount, transparentCount);
        if (max === 0 || max === transparentCount) {
          row.push(".");
        } else if (max === blueCount) {
          row.push("B"); // Blau: Persönliche Daten
        } else if (max === yellowCount) {
          row.push("Y"); // Gelb: Fähigkeiten
        } else if (max === redCount) {
          row.push("R"); // Rot: Arbeitgeber / Berufserfahrung
        } else if (max === blackCount) {
          row.push("I"); // Schwarz: Bild
        } else if (max === greenCount) {
          row.push("G"); // Grün: Ausbildung
        } else if (max === purpleCount) {
          row.push("P"); // Lila: Style-Aufteilung
        } else {
          row.push(".");
        }
      }
      grid.push(row);
    }
    return grid;
  };

  const updateSketchGrid = () => {
    const canvas = sketchCanvasRef.current;
    if (!canvas) return;
    const grid = sampleCanvasToGrid(canvas);
    if (!grid || grid.length === 0) return;
    const textRepr = grid.map(row => row.join(" ")).join("\n");
    setSketchGridString(textRepr);
  };

  const getEventPos = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>,
    canvas: HTMLCanvasElement
  ) => {
    const rect = canvas.getBoundingClientRect();
    const clientX = "touches" in e ? (e.touches[0]?.clientX ?? 0) : e.clientX;
    const clientY = "touches" in e ? (e.touches[0]?.clientY ?? 0) : e.clientY;
    
    // Scale precisely based on canvas actual resolution / layout size
    const x = ((clientX - rect.left) / rect.width) * canvas.width;
    const y = ((clientY - rect.top) / rect.height) * canvas.height;
    return { x, y };
  };

  const startDrawingSketch = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    const canvas = sketchCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    e.preventDefault();
    setIsDrawingSketch(true);
    const pos = getEventPos(e, canvas);

    sketchStartPosRef.current = pos;
    sketchSnapshotRef.current = ctx.getImageData(0, 0, canvas.width, canvas.height);

    if (sketchMode === "freehand") {
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);

      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.lineWidth = sketchBrushSize;

      if (sketchColor === "eraser") {
        ctx.globalCompositeOperation = "destination-out";
      } else {
        ctx.globalCompositeOperation = "source-over";
        ctx.strokeStyle = sketchColor;
      }

      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
    }
  };

  const drawSketch = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    const canvas = sketchCanvasRef.current;
    if (!canvas || !isDrawingSketch) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    e.preventDefault();
    const pos = getEventPos(e, canvas);

    if (sketchMode === "grid") {
      if (sketchStartPosRef.current && sketchSnapshotRef.current) {
        // Clear back to starting state of this stroke
        ctx.putImageData(sketchSnapshotRef.current, 0, 0);

        // Draw straight line from start to current
        ctx.beginPath();
        ctx.moveTo(sketchStartPosRef.current.x, sketchStartPosRef.current.y);
        ctx.lineTo(pos.x, pos.y);

        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.lineWidth = sketchBrushSize;

        if (sketchColor === "eraser") {
          ctx.globalCompositeOperation = "destination-out";
        } else {
          ctx.globalCompositeOperation = "source-over";
          ctx.strokeStyle = sketchColor;
        }
        ctx.stroke();
      }
    } else {
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
    }
  };

  const stopDrawingSketch = () => {
    setIsDrawingSketch(false);
    sketchStartPosRef.current = null;
    sketchSnapshotRef.current = null;
    const canvas = sketchCanvasRef.current;
    if (canvas) {
      setSketchDataUrl(canvas.toDataURL());
    }
    updateSketchGrid();
  };

  const clearSketchCanvas = () => {
    const canvas = sketchCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    sketchStartPosRef.current = null;
    sketchSnapshotRef.current = null;
    setSketchGridString("");
    setSketchDataUrl("");
  };

  // Restore sketch drawing onto canvas when canvas mounts or redesign generation finishes
  useEffect(() => {
    if (isManualSketchOpen && sketchCanvasRef.current && sketchDataUrl) {
      const canvas = sketchCanvasRef.current;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        const img = new Image();
        img.onload = () => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0);
        };
        img.src = sketchDataUrl;
      }
    }
  }, [isManualSketchOpen, isRedesignSending, sketchDataUrl]);

  // Helper to convert HSL to Hex
  const hslToHex = (h: number, s: number, l: number): string => {
    s /= 100;
    l /= 100;
    const k = (n: number) => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = (n: number) => {
      const color = l - a * Math.max(Math.min(k(n) - 3, 9 - k(n), 1), -1);
      return Math.round(255 * color).toString(16).padStart(2, "0");
    };
    return `#${f(0)}${f(8)}${f(4)}`.toUpperCase();
  };

  // Automatically adjust lightness of HSL color to guarantee contrast ratio >= targetRatio (e.g., 4.5)
  const adjustHslForContrast = (h: number, s: number, initialL: number, bgType: "dark" | "light", targetRatio: number = 4.52): number => {
    const isLightBg = bgType === "light";
    const bgRgb = isLightBg ? "#FFFFFF" : "#121212";
    
    // Check initial lightness first
    const initialHex = hslToHex(h, s, initialL);
    if (calculateContrastRatio(initialHex, bgRgb) >= targetRatio) {
      return initialL;
    }
    
    if (isLightBg) {
      // Light background: we need a darker color (lower L)
      for (let l = initialL - 1; l >= 0; l--) {
        const hex = hslToHex(h, s, l);
        if (calculateContrastRatio(hex, bgRgb) >= targetRatio) {
          return l;
        }
      }
      return 0; // Black fallback
    } else {
      // Dark background: we need a lighter color (higher L)
      for (let l = initialL + 1; l <= 100; l++) {
        const hex = hslToHex(h, s, l);
        if (calculateContrastRatio(hex, bgRgb) >= targetRatio) {
          return l;
        }
      }
      return 100; // White fallback
    }
  };

  // Compute active colors based on chosen palette, base hue, and background type
  const getPaletteColors = (
    hue: number, 
    paletteType: "monochromatic" | "split_complementary" | "triadic",
    bgType: "dark" | "light"
  ) => {
    const isLightBg = bgType === "light";
    
    // Default base lightness levels
    const primaryL_lightBg = 32;
    const secondaryL_lightBg = 30;
    const accentL_lightBg = 35;

    const primaryL_darkBg = 55;
    const secondaryL_darkBg = 45;
    const accentL_darkBg = 60;

    const targetRatio = 4.52; // slightly higher than 4.5 to ensure it passes the checker and is fully accessible

    let secondaryHue = hue;
    let accentHue = hue;
    let secSat_light = 95;
    let secSat_dark = 95;
    let accSat_light = 100;
    let accSat_dark = 100;

    if (paletteType === "split_complementary") {
      secondaryHue = (hue + 150) % 360;
      accentHue = (hue + 210) % 360;
      secSat_light = 90;
      secSat_dark = 90;
      accSat_light = 95;
      accSat_dark = 95;
    } else if (paletteType === "triadic") {
      secondaryHue = (hue + 120) % 360;
      accentHue = (hue + 240) % 360;
      secSat_light = 90;
      secSat_dark = 90;
      accSat_light = 95;
      accSat_dark = 95;
    }

    // Now calculate colors for both light background and dark background to offer all 5!
    // 1. Primary Light (optimized for dark/black backgrounds)
    const pL_light = adjustHslForContrast(hue, 100, primaryL_darkBg, "dark", targetRatio);
    const primary_light = hslToHex(hue, 100, pL_light);

    // 2. Primary Dark (optimized for light/white backgrounds)
    const pL_dark = adjustHslForContrast(hue, 100, primaryL_lightBg, "light", targetRatio);
    const primary_dark = hslToHex(hue, 100, pL_dark);

    // 3. Secondary Light (optimized for dark/black backgrounds)
    const sL_light = adjustHslForContrast(secondaryHue, secSat_dark, paletteType === "monochromatic" ? 30 : secondaryL_darkBg, "dark", targetRatio);
    const secondary_light = hslToHex(secondaryHue, secSat_dark, sL_light);

    // 4. Secondary Dark (optimized for light/white backgrounds)
    const sL_dark = adjustHslForContrast(secondaryHue, secSat_light, paletteType === "monochromatic" ? 20 : secondaryL_lightBg, "light", targetRatio);
    const secondary_dark = hslToHex(secondaryHue, secSat_light, sL_dark);

    // 5. Accent (adjusted dynamically for current background type)
    const aL = adjustHslForContrast(accentHue, accSat_light, isLightBg ? (paletteType === "monochromatic" ? 42 : accentL_lightBg) : (paletteType === "monochromatic" ? 75 : accentL_darkBg), bgType, targetRatio);
    const accent = hslToHex(accentHue, accSat_light, aL);

    // For compatibility with any legacy fields (primary, secondary mapping depending on current selected background type)
    const primary = isLightBg ? primary_dark : primary_light;
    const secondary = isLightBg ? secondary_dark : secondary_light;

    return {
      primary,
      secondary,
      accent,
      primary_light,
      primary_dark,
      secondary_light,
      secondary_dark
    };
  };

  const baseActiveColors = getPaletteColors(redesignBaseHue, redesignPalette, redesignBackgroundType);
  const activeColors = {
    ...baseActiveColors,
    ...customColors
  };
  
  // Re-evaluate primary/secondary aliases based on custom colors:
  const isLightBg = redesignBackgroundType === "light";
  activeColors.primary = isLightBg ? activeColors.primary_dark : activeColors.primary_light;
  activeColors.secondary = isLightBg ? activeColors.secondary_dark : activeColors.secondary_light;

  const redesignIframeRef = useRef<HTMLIFrameElement>(null);

  const [isDraggingWheel, setIsDraggingWheel] = useState(false);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    setIsDraggingWheel(true);
    handleWheelPointer(e);
  };
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDraggingWheel) {
      handleWheelPointer(e);
    }
  };
  const handlePointerUp = () => {
    setIsDraggingWheel(false);
  };

  const handleWheelPointer = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    let angle = Math.atan2(y, x) * (180 / Math.PI) + 90;
    if (angle < 0) angle += 360;
    if (angle >= 360) angle -= 360;
    setRedesignBaseHue(Math.round(angle));
  };

  // Custom Model Configuration (featured default is gemma-4-31b-it)
  const [modelName, setModelName] = useState("gemma-4-31b-it");
  const [onlyGemma, setOnlyGemma] = useState(true);

  // Resume edit helper functions
  const deMaskBasicsInObject = (data: any) => {
    if (!data) return data;
    const basics = { ...(data.basics || {}) };
    if (basics.name === "[NAME_MASKED]" || !basics.name) {
      basics.name = manualNames.split(',')[0]?.trim() || "Bewerber";
    }
    if (basics.email === "[EMAIL_MASKED]" || !basics.email) {
      basics.email = maskMap.email || "";
    }
    if (basics.phone === "[PHONE_MASKED]" || !basics.phone) {
      basics.phone = maskMap.phone || "";
    }
    if (basics.address === "[ADDRESS_MASKED]" || !basics.address) {
      basics.address = maskMap.address || "";
    }
    return { ...data, basics };
  };

  const updateBasics = (field: string, value: string) => {
    setParsedResumeData((prev: any) => {
      if (!prev) return prev;
      return {
        ...prev,
        basics: {
          ...(prev.basics || {}),
          [field]: value
        }
      };
    });
  };

  const handleSkillsChange = (skillsText: string) => {
    const newSkills = skillsText.split(',').map(s => s.trim()).filter(Boolean);
    setParsedResumeData((prev: any) => {
      if (!prev) return prev;
      return { ...prev, skills: newSkills };
    });
  };

  const updateEducation = (index: number, field: string, value: string) => {
    setParsedResumeData((prev: any) => {
      if (!prev) return prev;
      const newEdu = [...(prev.education || [])];
      if (newEdu[index]) {
        newEdu[index] = { ...newEdu[index], [field]: value };
      }
      return { ...prev, education: newEdu };
    });
  };

  const addEducationEntry = () => {
    setParsedResumeData((prev: any) => {
      if (!prev) return prev;
      const newEdu = [...(prev.education || [])];
      newEdu.push({ title: "Neue Ausbildung", institution: "Institution", period: "Zeitraum" });
      return { ...prev, education: newEdu };
    });
  };

  const deleteEducationEntry = (index: number) => {
    setParsedResumeData((prev: any) => {
      if (!prev) return prev;
      const newEdu = [...(prev.education || [])];
      newEdu.splice(index, 1);
      return { ...prev, education: newEdu };
    });
  };

  const updateWork = (index: number, field: string, value: any) => {
    setParsedResumeData((prev: any) => {
      if (!prev) return prev;
      const newWork = [...(prev.work || [])];
      if (newWork[index]) {
        newWork[index] = { ...newWork[index], [field]: value };
      }
      return { ...prev, work: newWork };
    });
  };

  const handleWorkHighlightsTextareaChange = (jobIdx: number, text: string) => {
    const newHighlights = text.split('\n').map(l => l.trim()).filter(Boolean);
    setParsedResumeData((prev: any) => {
      if (!prev) return prev;
      const newWork = [...(prev.work || [])];
      if (newWork[jobIdx]) {
        newWork[jobIdx] = { ...newWork[jobIdx], highlights: newHighlights };
      }
      return { ...prev, work: newWork };
    });
  };


  const deleteWorkEntry = (index: number) => {
    setParsedResumeData((prev: any) => {
      if (!prev) return prev;
      const newWork = [...(prev.work || [])];
      newWork.splice(index, 1);
      return { ...prev, work: newWork };
    });
  };

  // Mask Map for holding original sensitive data locally in state (Never sent to server)
  const [maskMap, setMaskMap] = useState<MaskMap>({
    name: "",
    email: "",
    phone: ""
  });

  // Manual Names to Mask (comma-separated, e.g., "Max Mustermann, Erika Musterfrau")
  const [manualNames, setManualNames] = useState("");
  const [appliedNames, setAppliedNames] = useState("");

  const handleConfirmNameMasking = (customName?: string) => {
    const nameToConfirm = (customName !== undefined ? customName : manualNames).trim();
    if (!nameToConfirm) {
      setApiError("Bitte gib zuerst einen Namen zum Anonymisieren ein.");
      return;
    }
    setAppliedNames(nameToConfirm);
    setManualNames(nameToConfirm);

    if (atsRawExtractedText) {
      performMasking(atsRawExtractedText, nameToConfirm, setAtsMaskedText, false);
    }
    if (motivationExtractedText) {
      performMasking(motivationExtractedText, nameToConfirm, setMotivationMaskedText, false);
    }
    if (jdExtractedText) {
      performMasking(jdExtractedText, nameToConfirm, setJdMaskedText, true);
    }
    if (redesignExtractedText) {
      performMasking(redesignExtractedText, nameToConfirm, setRedesignMaskedText, false);
    }
  };

  const handleResetNameMasking = () => {
    setAppliedNames("");
    if (atsRawExtractedText) {
      performMasking(atsRawExtractedText, "", setAtsMaskedText, false);
    }
    if (motivationExtractedText) {
      performMasking(motivationExtractedText, "", setMotivationMaskedText, false);
    }
    if (jdExtractedText) {
      performMasking(jdExtractedText, "", setJdMaskedText, true);
    }
    if (redesignExtractedText) {
      performMasking(redesignExtractedText, "", setRedesignMaskedText, false);
    }
  };

  // --- Mode 1: ATS Resume States ---
  const [atsPdfFile, setAtsPdfFile] = useState<File | null>(null);
  const [atsRawExtractedText, setAtsRawExtractedText] = useState("");
  const [atsMaskedText, setAtsMaskedText] = useState("");
  const [isAtsExtracting, setIsAtsExtracting] = useState(false);
  const [isAtsSending, setIsAtsSending] = useState(false);
  
  // KI JSON Response state
  const [kiResponseText, setKiResponseText] = useState("");
  const [parsedResumeData, setParsedResumeData] = useState<any>(null);

  // --- Mode 2: Motivationsschreiben States ---
  const [motivationPdfFile, setMotivationPdfFile] = useState<File | null>(null);
  const [motivationExtractedText, setMotivationExtractedText] = useState("");
  const [motivationMaskedText, setMotivationMaskedText] = useState("");
  const [isMotivationExtracting, setIsMotivationExtracting] = useState(false);

  const [jdPdfFile, setJdPdfFile] = useState<File | null>(null);
  const [jdExtractedText, setJdExtractedText] = useState("");
  const [jdMaskedText, setJdMaskedText] = useState("");
  const [isJdExtracting, setIsJdExtracting] = useState(false);

  const [isMatchSending, setIsMatchSending] = useState(false);
  const [generatedMatchingResult, setGeneratedMatchingResult] = useState("");
  const [deMaskedMatchingResult, setDeMaskedMatchingResult] = useState("");
  const [structuredLetter, setStructuredLetter] = useState<any>({
    senderAddress: '',
    recipientAddress: '',
    date: '',
    subject: '',
    jobTitle: '',
    introduction: '',
    mainBody: '',
    closing: '',
    salutation: '',
    signature: ''
  });
  const [activeLetterSection, setActiveLetterSection] = useState<'all' | 'briefkopf' | 'betreff' | 'anschreiben'>('all');
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const prevColorsRef = useRef({ primary: '#3b82f6', secondary: '#1e293b', accent: '#f59e0b' });
  const [generatedLetterHtml, setGeneratedLetterHtml] = useState("");

  const letterStats = useMemo(() => {
    return analyzeGermanCoverLetterText(generatedLetterHtml);
  }, [generatedLetterHtml]);

  const printLetterHtml = (htmlString: string) => {
    if (!htmlString) return;
    
    const iframe = document.createElement("iframe");
    iframe.style.position = "fixed";
    iframe.style.top = "-10000px";
    iframe.style.left = "-10000px";
    iframe.style.width = "210mm";
    iframe.style.height = "297mm";
    document.body.appendChild(iframe);
    
    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
    if (iframeDoc) {
      iframeDoc.open();
      iframeDoc.write(htmlString);
      iframeDoc.close();
      
      setTimeout(() => {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
        
        const targetIframe = iframe;
        setTimeout(() => {
          if (document.body.contains(targetIframe)) {
            document.body.removeChild(targetIframe);
          }
        }, 5000);
      }, 500);
    }
  };

  const downloadRedesignHtml = () => {
    let finalHtml = "";
    if (redesignIframeRef.current) {
      try {
        const iframeDoc = redesignIframeRef.current.contentDocument || redesignIframeRef.current.contentWindow?.document;
        if (iframeDoc) {
          finalHtml = iframeDoc.documentElement.outerHTML || iframeDoc.documentElement.innerHTML;
        }
      } catch (e) {
        console.warn("Iframe access failed:", e);
      }
    }
    if (!finalHtml) {
      const doc = redesignResult?.[redesignSelectedStyle]?.[redesignSelectedDoc];
      if (doc) {
        finalHtml = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>body { margin: 0; padding: 0; }\n${doc.css}</style></head><body>${doc.html}</body></html>`;
      }
    }
    if (finalHtml) {
      // Ensure the downloaded HTML is editable
      if (!/contenteditable/i.test(finalHtml)) {
        finalHtml = finalHtml.replace(/<body/i, '<body contenteditable="true"');
      }

      const blob = new Blob([finalHtml], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const docLabel = redesignSelectedDoc === "resume" ? "Lebenslauf" : "Motivationsschreiben";
      a.download = `Redesign_${docLabel}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const printRedesignHtml = () => {
    if (redesignIframeRef.current) {
      try {
        const iframeDoc = redesignIframeRef.current.contentDocument || redesignIframeRef.current.contentWindow?.document;
        if (iframeDoc) {
          const currentHtml = iframeDoc.documentElement.outerHTML || iframeDoc.documentElement.innerHTML;
          printLetterHtml(currentHtml);
          return;
        }
      } catch (e) {
        console.warn("Iframe print access failed, falling back to original code state:", e);
      }
    }
    const doc = redesignResult?.[redesignSelectedStyle]?.[redesignSelectedDoc];
    if (doc) {
      const previewHtml = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>body { margin: 0; padding: 0; }\n${doc.css}</style></head><body>${doc.html}</body></html>`;
      printLetterHtml(previewHtml);
    }
  };

  const generateStyledLetter = async () => {
    if (!motivationPdfFile) {
        alert("Bitte laden Sie zuerst einen Lebenslauf (oben unter 'PDFs oder Bilder einfügen') hoch, damit wir dessen Style übernehmen können.");
        return;
    }
    setIsGeneratingPdf(true);
    let iframe: HTMLIFrameElement | null = null;
    try {
        const formData = new FormData();
        formData.append("resume", motivationPdfFile);
        formData.append("resumeText", motivationExtractedText || "");
        formData.append("letterData", JSON.stringify(structuredLetter));

        const response = await fetch("/api/generate-styled-letter", {
            method: "POST",
            body: formData,
        });

        if (!response.ok) {
            throw new Error(await response.text());
        }

        const htmlContent = await response.text();
        
        // Post-sanitize the server-generated HTML to replace any accidental oklch/oklab/lch values with solid HEX colors
        const sanitizedHtmlContent = htmlContent
            .replace(/oklch\([^)]+\)/gi, "#3b82f6")
            .replace(/oklab\([^)]+\)/gi, "#3b82f6")
            .replace(/lch\([^)]+\)/gi, "#3b82f6");
        
        setGeneratedLetterHtml(sanitizedHtmlContent);
        
        // Create an isolated iframe to prevent styling leaks (like Tailwind v4's oklch variables)
        iframe = document.createElement("iframe");
        iframe.style.position = "fixed";
        iframe.style.top = "-10000px";
        iframe.style.left = "-10000px";
        iframe.style.width = "210mm";
        iframe.style.height = "297mm";
        document.body.appendChild(iframe);

        const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
        if (!iframeDoc) {
            throw new Error("Iframe-Dokument konnte nicht erstellt werden.");
        }

        iframeDoc.open();
        iframeDoc.write(sanitizedHtmlContent);
        iframeDoc.close();

        // Allow some time for styles to render inside the iframe
        await new Promise((resolve) => setTimeout(resolve, 500));
        
        const opt = {
          margin:       0,
          filename:     'Anschreiben.pdf',
          image:        { type: 'jpeg' as const, quality: 0.98 },
          html2canvas:  { 
            scale: 2, 
            useCORS: true,
            window: iframe.contentWindow || window,
            document: iframeDoc,
            onclone: (clonedDoc: Document) => {
              // Strip any style tags in the cloned document that might contain oklch/oklab/lch styles to bypass html2canvas crashes
              clonedDoc.querySelectorAll("style").forEach((style) => {
                if (style.textContent && (
                  style.textContent.includes("oklch") || 
                  style.textContent.includes("oklab") || 
                  style.textContent.includes("color-mix")
                )) {
                  style.remove();
                }
              });
            }
          },
          jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' as const }
        };

        // Temporarily disable parent stylesheets with oklch/oklab/color-mix to prevent html2canvas parsing crashes
        const disabledSheets: CSSStyleSheet[] = [];
        const originalStyleSheets = Array.from(document.styleSheets);
        
        for (const sheet of originalStyleSheets) {
          try {
            let hasOklch = false;
            const ownerNode = sheet.ownerNode as HTMLElement;
            
            if (ownerNode && ownerNode.textContent && (
              ownerNode.textContent.includes("oklch") ||
              ownerNode.textContent.includes("oklab") ||
              ownerNode.textContent.includes("color-mix")
            )) {
              hasOklch = true;
            }
            
            if (!hasOklch && sheet.cssRules) {
              for (let i = 0; i < sheet.cssRules.length; i++) {
                const ruleText = sheet.cssRules[i].cssText;
                if (
                  ruleText.includes("oklch") ||
                  ruleText.includes("oklab") ||
                  ruleText.includes("color-mix")
                ) {
                  hasOklch = true;
                  break;
                }
              }
            }
            
            if (!hasOklch && ownerNode && ownerNode.tagName === "LINK") {
              const href = (ownerNode as any).href || "";
              if (href.includes("index.css") || href.includes("main.css") || !href.includes("http")) {
                hasOklch = true;
              }
            }

            if (hasOklch) {
              sheet.disabled = true;
              disabledSheets.push(sheet);
            }
          } catch (e) {
            // Safe fallback for CORS-protected link stylesheets
            const ownerNode = sheet.ownerNode as HTMLElement;
            if (ownerNode) {
              const href = (ownerNode as any).href || "";
              if (href.includes("index.css") || href.includes("main.css") || !href.startsWith("http")) {
                sheet.disabled = true;
                disabledSheets.push(sheet);
              }
            }
          }
        }

        try {
          // Generate PDF and automatically download from the iframe body
          await html2pdf().set(opt).from(iframeDoc.body).save();
          
          // Clean up if successful
          if (iframe && document.body.contains(iframe)) {
              document.body.removeChild(iframe);
          }
        } catch (pdfErr: any) {
          console.warn("Direkte PDF-Generierung fehlgeschlagen, öffne stattdessen Druckansicht:", pdfErr);
          setApiError("Die automatische PDF-Generierung ist fehlgeschlagen. Wir öffnen stattdessen die Druckansicht des Browsers, damit Sie das Anschreiben drucken oder direkt als PDF speichern können.");
          
          if (iframe) {
              iframe.contentWindow?.focus();
              iframe.contentWindow?.print();
              
              // Clean up with delay to ensure browser print dialog can read the styles
              const targetIframe = iframe;
              setTimeout(() => {
                  if (document.body.contains(targetIframe)) {
                      document.body.removeChild(targetIframe);
                  }
              }, 5000);
          }
        } finally {
          // Restore all temporarily disabled stylesheets
          for (const sheet of disabledSheets) {
            sheet.disabled = false;
          }
        }
    } catch (err: any) {
        setApiError("Fehler beim Erzeugen des Anschreibens: " + err.message);
        if (iframe && document.body.contains(iframe)) {
            document.body.removeChild(iframe);
        }
    } finally {
        setIsGeneratingPdf(false);
    }
  };

  // File unreadability / direct processing states
  const [unreadableFile, setUnreadableFile] = useState<File | null>(null);
  const [unreadableType, setUnreadableType] = useState<"ats" | "motivation" | "jd" | "redesign" | null>(null);
  const [isProcessingDirectPdf, setIsProcessingDirectPdf] = useState(false);

  // Common UI feedback
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [showAtsSuggestions, setShowAtsSuggestions] = useState(false);

  // Trigger PDF.js loading state feedback if CDN fails or is slow
  const [pdfJsLoaded, setPdfJsLoaded] = useState(false);

  useEffect(() => {
    // Check if pdfjsLib is available
    const checkPdfJs = () => {
      if (window.pdfjsLib) {
        window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
        setPdfJsLoaded(true);
      }
    };
    checkPdfJs();
    const interval = setInterval(checkPdfJs, 500);
    return () => clearInterval(interval);
  }, []);

  const triggerCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(id);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  // --- Local Masking Logic (DSGVO / GDPR compliant) ---
  const performMasking = (text: string, namesInput: string, setMaskedText: (text: string) => void, onlyExplicitMasking: boolean = false) => {
    if (!text) return "";
    
    let tempText = text;
    let localEmail = "";
    let localPhone = "";

    if (!onlyExplicitMasking) {
      // 1. Email Regex Masking
      const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
      tempText = tempText.replace(emailRegex, (match) => {
        localEmail = match;
        return "[EMAIL_MASKED]";
      });

      // 2. Phone Regex Masking
      const phoneRegex = /(?:00\d{2}|\+\d{2}|06\d{2})(?:[\s\/\-\(\)]*\d){4,14}\b/g;
      tempText = tempText.replace(phoneRegex, (match) => {
        localPhone = match;
        return "[PHONE_MASKED]";
      });

      // Save found values locally in maskMap state
      setMaskMap(prev => ({
        ...prev,
        email: localEmail || prev.email,
        phone: localPhone || prev.phone
      }));
    }

    // 3. Name Manual Masking
    if (namesInput.trim()) {
      const STOP_WORDS = new Set(["von", "vom", "zu", "zum", "der", "die", "das", "dem", "den", "des", "und", "mit", "aus", "bei", "für", "dr", "prof", "ing", "mag", "ba", "ma", "phd", "mr", "mrs", "ms"]);
      
      const candidateSet = new Set<string>();
      
      // Split by comma for multiple distinct name entries
      const entries = namesInput.split(",").map(e => e.trim()).filter(Boolean);
      
      entries.forEach(entry => {
        candidateSet.add(entry);
        
        // Extract individual words (support German umlauts)
        const words = entry.split(/[\s,]+/).map(w => w.replace(/^[^\wäöüÄÖÜß]+|[^\wäöüÄÖÜß]+$/g, '').trim()).filter(Boolean);
        
        if (words.length > 1) {
          // Reversed full name: e.g. "Mustermann Max"
          const reversed = [...words].reverse().join(" ");
          candidateSet.add(reversed);
          
          // Comma inverted variants: "Mustermann, Max", "Max, Mustermann"
          candidateSet.add(`${words[words.length - 1]}, ${words.slice(0, -1).join(" ")}`);
          candidateSet.add(`${words.slice(0, -1).join(" ")}, ${words[words.length - 1]}`);
        }
        
        // Individual name components
        words.forEach(w => {
          const lower = w.toLowerCase();
          if (w.length >= 2 && !STOP_WORDS.has(lower)) {
            candidateSet.add(w);
          }
        });
      });

      // Sort candidates by length descending so longer phrases match first
      const sortedCandidates = Array.from(candidateSet)
        .filter(cand => cand.length >= 2)
        .sort((a, b) => b.length - a.length);

      sortedCandidates.forEach(cand => {
        try {
          const regex = new RegExp(`(?<![a-zA-ZäöüÄÖÜß0-9])${escapeRegExp(cand)}(?![a-zA-ZäöüÄÖÜß0-9])`, 'gi');
          tempText = tempText.replace(regex, "[NAME_MASKED]");
        } catch (e) {
          const regex = new RegExp(`\\b${escapeRegExp(cand)}\\b`, 'gi');
          tempText = tempText.replace(regex, "[NAME_MASKED]");
        }
      });
    }

    setMaskedText(tempText);
    return tempText;
  };

  // Helper utility to safely escape regex characters
  function escapeRegExp(string: string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  // Auto-masking synchronization whenever appliedNames or raw texts change
  useEffect(() => {
    if (appliedNames.trim()) {
      if (atsRawExtractedText) {
        performMasking(atsRawExtractedText, appliedNames, setAtsMaskedText, false);
      }
      if (motivationExtractedText) {
        performMasking(motivationExtractedText, appliedNames, setMotivationMaskedText, false);
      }
      if (jdExtractedText) {
        performMasking(jdExtractedText, appliedNames, setJdMaskedText, true);
      }
      if (redesignExtractedText) {
        performMasking(redesignExtractedText, appliedNames, setRedesignMaskedText, false);
      }
    }
  }, [appliedNames, atsRawExtractedText, motivationExtractedText, jdExtractedText, redesignExtractedText]);

  // --- ATS Compatibility & Metrics Calculator ---
  const getAtsMetrics = (text: string, parsedData: any) => {
    let textToAnalyze = text || "";
    
    // If we have parsedResumeData but no raw text (e.g., from direct PDF processing), reconstruct text
    if (!textToAnalyze && parsedData) {
      const basics = parsedData.basics || {};
      const workText = (parsedData.work || [])
        .map((w: any) => `${w.name || ""} ${w.position || ""} ${(w.highlights || []).join(" ")}`)
        .join(" ");
      const eduText = (parsedData.education || [])
        .map((e: any) => `${e.institution || ""} ${e.title || ""} ${e.period || ""}`)
        .join(" ");
      const skillsText = (parsedData.skills || []).join(" ");
      textToAnalyze = `${basics.name || ""} ${basics.email || ""} ${basics.phone || ""} ${basics.address || ""} ${workText} ${eduText} ${skillsText}`;
    }

    if (!textToAnalyze.trim()) {
      return {
        score: 0,
        keywordScore: 0,
        formattingScore: 0,
        structureScore: 0,
        foundKeywords: [],
        missingKeywords: [],
        suggestions: []
      };
    }

    const lowercaseText = textToAnalyze.toLowerCase();

    // 1. Keyword Score (max 35)
    const keywordPool = [
      "erfahrung", "studium", "management", "entwicklung", "projekt", "kenntnisse", 
      "sprachen", "software", "analyse", "design", "daten", "scrum", "agile", "git", 
      "cloud", "experience", "education", "skills", "languages", "development", 
      "project", "analysis", "leadership", "teamwork", "communication"
    ];

    const foundKeywords: string[] = [];
    keywordPool.forEach(kw => {
      if (lowercaseText.includes(kw)) {
        foundKeywords.push(kw);
      }
    });

    const keywordScore = Math.min(35, Math.round((foundKeywords.length / 8) * 35));

    // 2. Formatting Score (max 30)
    let formattingScore = 30;
    const charCount = textToAnalyze.length;
    
    if (charCount < 300) formattingScore -= 15;
    else if (charCount < 800) formattingScore -= 5;
    else if (charCount > 9000) formattingScore -= 8; // too long/verbose

    // Check for weird/excessive special chars indicating parsing errors
    const specialChars = (textToAnalyze.match(/[^a-zA-Z0-9\säöüÄÖÜß.,\-()@:/_]/g) || []).length;
    if (specialChars > charCount * 0.08) {
      formattingScore -= 10;
    }
    formattingScore = Math.max(5, formattingScore);

    // 3. Structure & Section Completeness (max 35)
    const sections = [
      { name: "Kontakt", keys: ["kontakt", "email", "telefon", "phone", "adresse", "e-mail"] },
      { name: "Berufserfahrung", keys: ["berufserfahrung", "work", "experience", "werdegang", "praxis", "beruflicher"] },
      { name: "Ausbildung", keys: ["ausbildung", "education", "studium", "schule", "universität", "bildung"] },
      { name: "Kenntnisse", keys: ["kenntnisse", "skills", "fähigkeiten", "qualifikationen", "technologien"] }
    ];

    let structurePoints = 0;
    sections.forEach(sec => {
      const hasSec = sec.keys.some(k => lowercaseText.includes(k));
      if (hasSec) structurePoints += 9;
    });
    
    // Additional points if we have a parsed JSON with work/education arrays populated
    if (parsedData) {
      if (parsedData.work && parsedData.work.length > 0) structurePoints += 4;
      if (parsedData.education && parsedData.education.length > 0) structurePoints += 4;
    }

    const structureScore = Math.min(35, structurePoints);
    const score = Math.min(100, keywordScore + formattingScore + structureScore);

    // Filter recommended keywords that are missing
    const recommendedKeywords = ["management", "projekt", "analyse", "git", "cloud", "agile", "entwicklung", "kenntnisse"];
    const missingKeywords = recommendedKeywords.filter(kw => !foundKeywords.includes(kw)).slice(0, 4);

    const suggestions: string[] = [];
    if (score < 50) {
      suggestions.push("⚠️ Dringend überarbeiten: Sehr geringe ATS-Kompatibilität festgestellt.");
    }
    if (foundKeywords.length < 5) {
      suggestions.push("🔑 Fehlende Schlüsselwörter: Integrieren Sie mehr fachspezifische Schlüsselbegriffe aus Ihrer Branche.");
    }
    if (formattingScore < 22) {
      suggestions.push("📝 Formatierung optimieren: Vermeiden Sie komplexe Sonderzeichen, Tabellen oder ungewöhnliche Schriftarten.");
    }
    if (structureScore < 25) {
      suggestions.push("📂 Struktur verbessern: Fügen Sie klare Abschnitte wie 'Berufserfahrung', 'Ausbildung' und 'Kenntnisse' hinzu.");
    }
    if (charCount < 500) {
      suggestions.push("📏 Zu kurz: Der Lebenslauf enthält sehr wenig Text. Fügen Sie detailliertere Projekt- oder Aufgabenbeschreibungen hinzu.");
    }
    if (suggestions.length === 0) {
      suggestions.push("✨ Hervorragend! Ihr Lebenslauf erfüllt alle wesentlichen ATS-Optimierungs-Kriterien.");
    }

    return {
      score,
      keywordScore,
      formattingScore,
      structureScore,
      foundKeywords,
      missingKeywords,
      suggestions
    };
  };

  // --- Mask Names manually trigger ---
  const handleManualNameMaskingJd = () => {
    if (!jdExtractedText) {
      setApiError("Kein Stellenausschreibungstext vorhanden.");
      return;
    }
    
    setMaskMap(prev => ({
      ...prev,
      name: manualNames
    }));
    
    performMasking(jdExtractedText, manualNames, setJdMaskedText, true);
    setApiError(null);
  };

  const handleManualNameMasking = (isAts: boolean) => {
    const rawText = isAts ? atsRawExtractedText : motivationExtractedText;
    if (!rawText) {
      setApiError("Bitte laden Sie zuerst eine PDF-Datei hoch oder stellen Sie sicher, dass Text vorhanden ist.");
      return;
    }
    
    // Save to maskMap name value
    setMaskMap(prev => ({
      ...prev,
      name: manualNames
    }));

    performMasking(rawText, manualNames, isAts ? setAtsMaskedText : setMotivationMaskedText, false);
    setApiError(null);
  };

  // --- Client Side PDF Text Extraction with sorting ---
  const extractTextFromPdf = async (file: File): Promise<string> => {
    if (!window.pdfjsLib) {
      throw new Error("PDF.js Bibliothek konnte nicht geladen werden. Bitte überprüfen Sie Ihre Internetverbindung.");
    }
    
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await window.pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) }).promise;
    let fullText = "";
    
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      
      const lines: { [key: number]: any[] } = {};
      content.items.forEach((item: any) => {
        const y = Math.round(item.transform[5] / 5) * 5;
        if (!lines[y]) lines[y] = [];
        lines[y].push(item);
      });

      const sortedY = Object.keys(lines).sort((a: any, b: any) => b - a);
      sortedY.forEach((y: any) => {
        lines[y].sort((a, b) => a.transform[4] - b.transform[4]);
        fullText += lines[y].map(item => item.str).join(" ") + " ";
      });
      fullText += "\n";
    }
    
    return fullText;
  };

  // --- File extraction logic without OCR ---
  const extractTextFromFile = async (file: File): Promise<string> => {
    if (file.type.startsWith("image/")) {
      throw new Error("UNREADABLE_FILE_RELAX_GDPR_REQUIRED");
    }

    let extracted = "";
    try {
      extracted = await extractTextFromPdf(file);
    } catch (e) {
      console.warn("Fehler bei normaler PDF-Textextraktion:", e);
      throw new Error("UNREADABLE_FILE_RELAX_GDPR_REQUIRED");
    }

    if (!extracted || extracted.trim().length < 150) {
      throw new Error("UNREADABLE_FILE_RELAX_GDPR_REQUIRED");
    }
    return extracted;
  };

  // --- Relax GDPR and send PDF directly to the Gemma model ---
  const handleRelaxGdprAndProcess = async () => {
    if (!unreadableFile || !unreadableType) return;
    
    setIsProcessingDirectPdf(true);
    setApiError(null);
    
    try {
      const fileBase64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (e) => reject(new Error("Fehler beim Lesen der Datei für den Direktversand: " + e));
        reader.readAsDataURL(unreadableFile);
      });

      const modeParam = unreadableType === "ats" ? "ats" : "text";
      const response = await fetch("/api/process-direct-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pdfBase64: fileBase64,
          mode: modeParam,
          model: modelName
        })
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `Server meldet Status ${response.status} beim Direktversand.`);
      }

      const result = await response.json();
      
      if (unreadableType === "ats") {
        const structData = result.data;
        setKiResponseText(JSON.stringify(structData, null, 2));
        setParsedResumeData(structData);
      } else if (unreadableType === "motivation") {
        setMotivationExtractedText(result.text || "");
        setMotivationMaskedText(result.text || "");
      } else if (unreadableType === "redesign") {
        setRedesignExtractedText(result.text || "");
        setRedesignMaskedText(result.text || "");
      } else if (unreadableType === "jd") {
        setJdExtractedText(result.text || "");
      }

      // Success: clear unreadable state
      setUnreadableFile(null);
      setUnreadableType(null);
    } catch (err: any) {
      setApiError("Fehler bei der direkten Analyse (DSGVO-gelockert): " + err.message);
    } finally {
      setIsProcessingDirectPdf(false);
    }
  };

  const handleCancelUnreadable = () => {
    if (unreadableType === "ats") {
      setAtsPdfFile(null);
      setAtsRawExtractedText("");
      setAtsMaskedText("");
    } else if (unreadableType === "motivation") {
      setMotivationPdfFile(null);
      setMotivationExtractedText("");
      setMotivationMaskedText("");
    } else if (unreadableType === "redesign") {
      setRedesignPdfFile(null);
      setRedesignExtractedText("");
      setRedesignMaskedText("");
    } else if (unreadableType === "jd") {
      setJdPdfFile(null);
      setJdExtractedText("");
    }
    setUnreadableFile(null);
    setUnreadableType(null);
  };

  // Handle ATS CV upload
  const handleAtsPdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAtsPdfFile(file);
    setIsAtsExtracting(true);
    setApiError(null);
    setUnreadableFile(null);
    setUnreadableType(null);

    try {
      const extracted = await extractTextFromFile(file);
      setAtsRawExtractedText(extracted);
      performMasking(extracted, appliedNames, setAtsMaskedText, false);
    } catch (err: any) {
      if (err.message === "UNREADABLE_FILE_RELAX_GDPR_REQUIRED") {
        setUnreadableFile(file);
        setUnreadableType("ats");
      } else {
        setApiError("Fehler beim Extrahieren der Datei: " + err.message);
      }
    } finally {
      setIsAtsExtracting(false);
    }
  };

  // Handle Motivation CV upload
  const handleMotivationPdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setMotivationPdfFile(file);
    setIsMotivationExtracting(true);
    setApiError(null);
    setUnreadableFile(null);
    setUnreadableType(null);

    try {
      const extracted = await extractTextFromFile(file);
      setMotivationExtractedText(extracted);
      performMasking(extracted, appliedNames, setMotivationMaskedText, false);
    } catch (err: any) {
      if (err.message === "UNREADABLE_FILE_RELAX_GDPR_REQUIRED") {
        setUnreadableFile(file);
        setUnreadableType("motivation");
      } else {
        setApiError("Fehler beim Extrahieren der Lebenslauf-Datei: " + err.message);
      }
    } finally {
      setIsMotivationExtracting(false);
    }
  };

  // Handle Job Description PDF upload
  const handleJdPdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setJdPdfFile(file);
    setIsJdExtracting(true);
    setApiError(null);
    setUnreadableFile(null);
    setUnreadableType(null);

    try {
      const extracted = await extractTextFromFile(file);
      setJdExtractedText(extracted);
    } catch (err: any) {
      if (err.message === "UNREADABLE_FILE_RELAX_GDPR_REQUIRED") {
        setUnreadableFile(file);
        setUnreadableType("jd");
      } else {
        setApiError("Fehler beim Extrahieren der Ausschreibungs-Datei: " + err.message);
      }
    } finally {
      setIsJdExtracting(false);
    }
  };

  // Handle Redesign CV upload
  const handleRedesignPdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setRedesignPdfFile(file);
    setIsRedesignExtracting(true);
    setApiError(null);
    setUnreadableFile(null);
    setUnreadableType(null);

    try {
      const extracted = await extractTextFromFile(file);
      setRedesignExtractedText(extracted);
      performMasking(extracted, appliedNames, setRedesignMaskedText, false);
    } catch (err: any) {
      if (err.message === "UNREADABLE_FILE_RELAX_GDPR_REQUIRED") {
        setUnreadableFile(file);
        setUnreadableType("redesign");
      } else {
        setApiError("Fehler beim Extrahieren der Datei: " + err.message);
      }
    } finally {
      setIsRedesignExtracting(false);
    }
  };

  const handleRedesignAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setRedesignAvatarFile(file);

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64String = event.target?.result as string;
      setRedesignAvatarBase64(base64String);
    };
    reader.readAsDataURL(file);
  };

  const runContrastCheck = () => {
    if (!redesignIframeRef.current) return;
    setIsContrastChecking(true);
    setTimeout(() => {
      try {
        const issues = checkIframeContrast(redesignIframeRef.current!);
        setContrastIssues(issues);
        setHasCheckedContrast(true);
        if (highlightContrastFailures) {
          const failingIndices = issues.filter(x => !x.passed).map(x => x.idx);
          injectHighlightStyles(redesignIframeRef.current!, failingIndices);
        } else {
          injectHighlightStyles(redesignIframeRef.current!, []);
        }
      } catch (err) {
        console.error("Fehler bei Kontrastprüfung:", err);
      } finally {
        setIsContrastChecking(false);
      }
    }, 450);
  };

  useEffect(() => {
    if (redesignIframeRef.current && hasCheckedContrast) {
      const failingIndices = highlightContrastFailures 
        ? contrastIssues.filter(x => !x.passed).map(x => x.idx) 
        : [];
      injectHighlightStyles(redesignIframeRef.current, failingIndices);
    }
  }, [highlightContrastFailures, contrastIssues, hasCheckedContrast]);

  const setupIframeListeners = () => {
    const iframe = redesignIframeRef.current;
    if (!iframe) return;

    try {
      const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
      if (!iframeDoc) return;

      const body = iframeDoc.body;
      if (!body) return;

      body.setAttribute("contenteditable", isEditingEnabled ? "true" : "false");

      const handleSync = () => {
        const updatedHtml = body.innerHTML;
        setRedesignResult(prev => {
          if (!prev) return prev;
          const currentStyle = prev[redesignSelectedStyle];
          if (!currentStyle) return prev;
          return {
            ...prev,
            [redesignSelectedStyle]: {
              ...currentStyle,
              [redesignSelectedDoc]: {
                ...currentStyle[redesignSelectedDoc],
                html: updatedHtml
              }
            }
          };
        });
      };

      body.removeEventListener("blur", handleSync);
      body.addEventListener("blur", handleSync);
    } catch (e) {
      console.warn("Iframe listener setup failed:", e);
    }
  };

  const handleIframeLoad = () => {
    runContrastCheck();
    setupIframeListeners();
  };

  // API Call for Gelb-Schwarz-Redesign using Gemma (Dual-Stil orthogonal + kurvlinear)
  const sendRedesignToAI = async () => {
    const textToSend = redesignMaskedText || redesignExtractedText;
    if (!textToSend.trim()) {
      setApiError("Bitte laden Sie einen Lebenslauf hoch oder geben Sie Lebenslauf-Inhalt ein.");
      return;
    }

    setIsRedesignSending(true);
    setApiError(null);

    try {
      const colors = getPaletteColors(redesignBaseHue, redesignPalette, redesignBackgroundType);

      // Sample sketch grid and image directly from canvas if open and sketch active
      let activeSketchGrid: string | undefined = undefined;
      let activeSketchImage: string | undefined = undefined;
      if (isManualSketchOpen && useSketchInAi) {
        if (sketchCanvasRef.current) {
          const grid = sampleCanvasToGrid(sketchCanvasRef.current);
          if (grid && grid.length > 0) {
            const textRepr = grid.map(row => row.join(" ")).join("\n");
            if (/[BYRIGP]/.test(textRepr)) {
              activeSketchGrid = textRepr;
            }
          }
          activeSketchImage = sketchCanvasRef.current.toDataURL("image/png");
        } else if (sketchDataUrl) {
          activeSketchImage = sketchDataUrl;
        }
      }
      if (!activeSketchGrid && isManualSketchOpen && useSketchInAi && sketchGridString.trim() && /[BYRIGP]/.test(sketchGridString)) {
        activeSketchGrid = sketchGridString;
      }

      // Fetch Single Style Redesign
      const result = await fetch("/api/redesign-cv", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cvText: textToSend,
          style: redesignStyle, // pass the user-selected style ("orthogonal" or "kurvlinear")
          palette: redesignPalette,
          primary: colors.primary,
          secondary: colors.secondary,
          accent: colors.accent,
          primary_light: colors.primary_light,
          primary_dark: colors.primary_dark,
          secondary_light: colors.secondary_light,
          secondary_dark: colors.secondary_dark,
          backgroundType: redesignBackgroundType,
          manualSketchGrid: activeSketchGrid,
          sketchImage: activeSketchImage,
          sketchMode: isManualSketchOpen ? sketchMode : undefined,
          sketchPrompt: (isManualSketchOpen && sketchPrompt.trim()) ? sketchPrompt.trim() : undefined
        })
      });
      if (!result.ok) {
        throw new Error(`Fehler beim Redesign: ${result.statusText}`);
      }
      const styleResult = await result.json();

      // De-mask placeholders in HTML/CSS before storing for final rendering
      const deMaskString = (str: string | undefined | null) => {
        if (!str) return "";
        let demasked = str;
        const realName = manualNames.split(',')[0] || "De-maskierter Name";
        demasked = demasked.replace(/\[NAME_MASKED\]/g, realName);
        demasked = demasked.replace(/\[EMAIL_MASKED\]/g, maskMap.email || "");
        demasked = demasked.replace(/\[PHONE_MASKED\]/g, maskMap.phone || "");
        demasked = demasked.replace(/\[LOGO_PLACEHOLDER\]/g, "/logo.png");
        
        // Inject avatar base64 if provided, otherwise use a default placeholder or empty string
        if (redesignAvatarBase64) {
          demasked = demasked.replace(/\[AVATAR_PLACEHOLDER\]/g, redesignAvatarBase64);
        } else {
          demasked = demasked.replace(/\[AVATAR_PLACEHOLDER\]/g, ""); // or leave it empty so it just shows the frame
        }
        return demasked;
      };

      const finalResult = {
        [redesignStyle]: {
          resume: {
            html: deMaskString(styleResult.resume?.html),
            css: deMaskString(styleResult.resume?.css)
          },
          cover_letter: {
            html: deMaskString(styleResult.cover_letter?.html),
            css: deMaskString(styleResult.cover_letter?.css)
          }
        }
      };

      setRedesignResult(finalResult);
      setRedesignSelectedStyle(redesignStyle);
      const isLightBg = redesignBackgroundType === "light";
      const actualBgColor = isLightBg ? "#FFFFFF" : "#000000";
      const actualTextColor = isLightBg ? "#1E293B" : "#F8FAFC";
      setAppliedColors({
        resume: { 
          primary: colors.primary, 
          secondary: colors.secondary, 
          accent: colors.accent,
          bg: actualBgColor,
          text: actualTextColor
        },
        cover_letter: { 
          primary: colors.primary, 
          secondary: colors.secondary, 
          accent: colors.accent,
          bg: actualBgColor,
          text: actualTextColor
        }
      });
      prevColorsRef.current = { ...colors };
      setRawRedesignJsonText(JSON.stringify(finalResult, null, 2));
    } catch (err: any) {
      setApiError("Fehler beim Erstellen des Redesigns: " + err.message);
    } finally {
      setIsRedesignSending(false);
    }
  };

  const applyColorWheelToCss = () => {
    const currentStyle = redesignResult?.[redesignSelectedStyle];
    if (!currentStyle) {
      alert("Bitte generieren Sie zuerst ein Design, bevor Sie Farben anpassen!");
      return;
    }

    const docType = redesignSelectedDoc; // "resume" or "cover_letter"
    const docData = currentStyle[docType];
    if (!docData) return;

    let updatedCss = docData.css;

    // Retrieve what was last applied (either initial or from previous adjustments)
    const oldPrimary = appliedColors[docType].primary;
    const oldSecondary = appliedColors[docType].secondary;
    const oldAccent = appliedColors[docType].accent;
    const oldBg = appliedColors[docType].bg;
    const oldText = appliedColors[docType].text;

    // Compute the new values selected from the wheel/palette
    const colors = getPaletteColors(redesignBaseHue, redesignPalette, redesignBackgroundType);
    const isLightBg = redesignBackgroundType === "light";
    const newBg = isLightBg ? "#FFFFFF" : "#000000";
    const newText = isLightBg ? "#1E293B" : "#F8FAFC";

    // Dynamic case-insensitive regex swaps for each color channel
    if (oldPrimary && oldPrimary.toLowerCase() !== colors.primary.toLowerCase()) {
      updatedCss = updatedCss.replace(new RegExp(oldPrimary, 'gi'), colors.primary);
    }
    if (oldSecondary && oldSecondary.toLowerCase() !== colors.secondary.toLowerCase()) {
      updatedCss = updatedCss.replace(new RegExp(oldSecondary, 'gi'), colors.secondary);
    }
    if (oldAccent && oldAccent.toLowerCase() !== colors.accent.toLowerCase()) {
      updatedCss = updatedCss.replace(new RegExp(oldAccent, 'gi'), colors.accent);
    }
    if (oldBg && oldBg.toLowerCase() !== newBg.toLowerCase()) {
      updatedCss = updatedCss.replace(new RegExp(oldBg, 'gi'), newBg);
    }
    if (oldText && oldText.toLowerCase() !== newText.toLowerCase()) {
      updatedCss = updatedCss.replace(new RegExp(oldText, 'gi'), newText);
    }

    // Update state so the view refreshes with the modified CSS
    setRedesignResult(prev => {
      if (!prev) return prev;
      const curStyle = prev[redesignSelectedStyle];
      if (!curStyle) return prev;
      return {
        ...prev,
        [redesignSelectedStyle]: {
          ...curStyle,
          [docType]: {
            ...curStyle[docType],
            css: updatedCss
          }
        }
      };
    });

    // Update applied colors tracking for this document
    setAppliedColors(prev => ({
      ...prev,
      [docType]: {
        primary: colors.primary,
        secondary: colors.secondary,
        accent: colors.accent,
        bg: newBg,
        text: newText
      }
    }));

    prevColorsRef.current = { ...colors };
    alert("Das neue mathematische Farbschema wurde erfolgreich in Ihren CSS-Quellcode injiziert!");
  };

  // --- API process-resume for ATS Mode ---
  const sendAtsToAI = async () => {
    const textToSend = atsMaskedText || atsRawExtractedText;
    if (!textToSend.trim()) {
      setApiError("Bitte laden Sie einen Lebenslauf hoch oder maskieren Sie die Daten.");
      return;
    }

    setIsAtsSending(true);
    setApiError(null);

    try {
      const response = await fetch("/api/process-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: textToSend,
          mode: "lebenslauf",
          model: modelName
        })
      });

      if (!response.ok) {
        throw new Error(`API returned error state: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      const structData = result.data;
      
      const deMaskedStructData = deMaskBasicsInObject(structData);
      setKiResponseText(JSON.stringify(deMaskedStructData, null, 2));
      setParsedResumeData(deMaskedStructData);
    } catch (err: any) {
      setApiError("Fehler bei der KI-Schnittstelle: " + err.message);
    } finally {
      setIsAtsSending(false);
    }
  };

  // Manual Trigger to render parsed JSON manually
  const handleManualResponseSubmit = () => {
    if (!kiResponseText.trim()) {
      setApiError("Das JSON-Antwortfeld ist leer!");
      return;
    }

    try {
      // Find brackets to clean JSON input
      const firstBracket = kiResponseText.indexOf('{');
      const lastBracket = kiResponseText.lastIndexOf('}');
      if (firstBracket === -1 || lastBracket === -1) {
        throw new Error("Klammern für JSON nicht gefunden.");
      }
      const cleanJson = kiResponseText.substring(firstBracket, lastBracket + 1);
      const parsed = JSON.parse(cleanJson);
      const deMaskedParsed = deMaskBasicsInObject(parsed);
      setParsedResumeData(deMaskedParsed);
      setApiError(null);
    } catch (err: any) {
      setApiError("Ungültiges JSON-Format. Bitte überprüfen Sie Ihre Eingabe: " + err.message);
    }
  };

  // --- PDF Generator using PDF-lib ---
  const generateAndDownloadATSResume = async () => {
    if (!parsedResumeData) {
      setApiError("Keine strukturierten Daten vorhanden, um den Lebenslauf zu generieren.");
      return;
    }
    if (!atsPdfFile) {
      setApiError("Ursprüngliche Lebenslauf-Datei fehlt.");
      return;
    }

    setApiError(null);
    try {
      const fileArrayBuffer = await atsPdfFile.arrayBuffer();
      const pdfBytes = new Uint8Array(fileArrayBuffer);
      const { PDFDocument, rgb, StandardFonts } = window.PDFLib;

      // Copy and de-mask the basics locally
      const deMaskedBasics = {
        name: parsedResumeData.basics?.name === "[NAME_MASKED]" ? (maskMap.name || "Bewerber") : (parsedResumeData.basics?.name || "Bewerber"),
        email: parsedResumeData.basics?.email === "[EMAIL_MASKED]" ? (maskMap.email || "") : (parsedResumeData.basics?.email || ""),
        phone: parsedResumeData.basics?.phone === "[PHONE_MASKED]" ? (maskMap.phone || "") : (parsedResumeData.basics?.phone || ""),
        address: parsedResumeData.basics?.address === "[ADDRESS_MASKED]" ? (maskMap.address || "") : (parsedResumeData.basics?.address || "")
      };

      // Load original PDF
      const pdfDoc = await PDFDocument.load(pdfBytes);
      const pages = pdfDoc.getPages();
      const firstPage = pages[0];

      // Inject clean ATS Metadata
      pdfDoc.setTitle('Lebenslauf ' + deMaskedBasics.name);
      pdfDoc.setSubject('Bewerbungsunterlagen - Qualifiziertes Profil');
      pdfDoc.setAuthor(deMaskedBasics.name);
      pdfDoc.setKeywords(parsedResumeData.skills || ['Lebenslauf', 'ATS Optimized']);
      pdfDoc.setCreator('Privacy-First ATS AI-Bridge');

      // Add a hidden text layer (Opacity 0.01) at the top containing high quality keyword-dense resume text
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      
      let atsTextStream = `LEBENSLAUF VON ${deMaskedBasics.name.toUpperCase()}\n`;
      atsTextStream += `KONTAKT: E-Mail: ${deMaskedBasics.email} | Tel: ${deMaskedBasics.phone}\n\n`;
      atsTextStream += `HAUPTQUALIFIKATIONEN / SKILLS:\n`;
      atsTextStream += `${parsedResumeData.skills ? parsedResumeData.skills.join(', ') : ''}\n\n`;
      
      if (parsedResumeData.work && Array.isArray(parsedResumeData.work)) {
        atsTextStream += `BERUFLICHER WERDEGANG (ATS READABLE):\n`;
        parsedResumeData.work.forEach((job: any) => {
          atsTextStream += `- ${job.position || ''} bei ${job.name || ''} (${job.startDate || ''} bis ${job.endDate || ''})\n`;
          if (job.highlights && Array.isArray(job.highlights)) {
            job.highlights.forEach((h: string) => {
              atsTextStream += `  * ${h}\n`;
            });
          }
        });
      }

      if (parsedResumeData.education && Array.isArray(parsedResumeData.education) && parsedResumeData.education.length > 0) {
        atsTextStream += `AUSBILDUNG & BILDUNGSWEG (ATS READABLE):\n`;
        parsedResumeData.education.forEach((edu: any) => {
          atsTextStream += `- ${edu.title || ''} an der ${edu.institution || ''} (${edu.period || ''})\n`;
        });
        atsTextStream += `\n`;
      }

      // Draw near-invisible text on the first page
      firstPage.drawText(atsTextStream, {
        x: 15,
        y: firstPage.getHeight() - 25,
        size: 5,
        font: font,
        color: rgb(0.01, 0.01, 0.01),
        opacity: 0.01, // Almost completely invisible to human eye, but 100% crawlable by ATS parsers!
        lineHeight: 7,
        maxWidth: firstPage.getWidth() - 30
      });

      // Save and trigger download
      const modifiedPdfBytes = await pdfDoc.save();
      const blob = new Blob([modifiedPdfBytes], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `ATS_Optimiert_${deMaskedBasics.name.replace(/\s+/g, '_')}.pdf`;
      link.click();
    } catch (err: any) {
      setApiError("Fehler beim Generieren der PDF: " + err.message);
    }
  };

  // --- Matching / Motivationsschreiben generation ---
  const sendMatchingToAI = async () => {
    const cvText = motivationMaskedText || motivationExtractedText;
    const jdText = jdMaskedText || jdExtractedText;

    if (!motivationExtractedText.trim() || !jdExtractedText.trim()) {
      setApiError("Bitte laden Sie sowohl die Lebenslauf-PDF als auch die Stellenausschreibung-PDF hoch.");
      return;
    }

    setIsMatchSending(true);
    setApiError(null);

    const combinedContent = `--- REPORT FÜR ATS VERGLEICH ---\n\n` +
                            `[Bewerber Lebenslauf]\n${cvText}\n\n` +
                            `[Ziel-Stellenausschreibung]\n${jdText}`;

    try {
      const response = await fetch("/api/process-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: combinedContent,
          mode: "matching",
          model: modelName
        })
      });

      if (!response.ok) {
        throw new Error(`API returned error state: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      const parsedData = result.data;
      
      // Store the full structured response
      setGeneratedMatchingResult(JSON.stringify(parsedData));
      
      const deMaskString = (str: string | undefined | null) => {
        if (!str) return "";
        let demasked = str;
        const realName = manualNames.split(',')[0] || "De-maskierter Name";
        demasked = demasked.replace(/\[NAME_MASKED\]/g, realName);
        demasked = demasked.replace(/\[EMAIL_MASKED\]/g, maskMap.email || "");
        demasked = demasked.replace(/\[PHONE_MASKED\]/g, maskMap.phone || "");
        return demasked;
      };

      // Use the structured data directly and DEMASK it
      const { senderAddress, recipientAddress, date, subject, jobTitle, introduction, mainBody, closing, salutation, signature } = parsedData;

      const fullLetter = {
        senderAddress: deMaskString(senderAddress),
        recipientAddress: deMaskString(recipientAddress),
        date: deMaskString(date),
        subject: deMaskString(subject),
        jobTitle: deMaskString(jobTitle),
        introduction: deMaskString(introduction),
        mainBody: deMaskString(mainBody),
        closing: deMaskString(closing),
        salutation: deMaskString(salutation),
        signature: deMaskString(signature)
      };

      setDeMaskedMatchingResult(JSON.stringify(fullLetter));
      setStructuredLetter(fullLetter);
    } catch (err: any) {
      setApiError("Fehler beim Generieren des Motivationsschreibens: " + err.message);
    } finally {
      setIsMatchSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-100 font-sans flex flex-col antialiased">
      
      {/* Background radial highlight */}
      <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-b from-blue-500/10 via-indigo-500/5 to-transparent pointer-events-none z-0"></div>

      {/* Navigation Header */}
      <header className="relative border-b border-slate-800 bg-slate-900/80 backdrop-blur-md z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="relative group z-50">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden border border-slate-700/80 bg-slate-950 flex items-center justify-center p-2 shadow-xl group-hover:border-yellow-500/60 transition-all relative z-10 cursor-pointer">
                <img 
                  src={logo} 
                  alt="Lazy-HR-Workaround Logo" 
                  className="w-full h-full object-contain relative z-10" 
                  onError={(e) => { 
                    e.currentTarget.src = "/logo.png"; 
                  }} 
                />
              </div>
              
              <div className="absolute top-full left-0 pt-2 w-80 sm:w-96 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 origin-top-left z-50">
                <div className="bg-slate-900 border border-slate-700 rounded-xl p-4 shadow-2xl">
                  <img 
                    src={logo} 
                    alt="Lazy-HR-Workaround Original" 
                    className="w-full h-auto max-h-36 object-contain rounded-lg mb-3 border border-slate-800 bg-slate-950 p-2" 
                    onError={(e) => { e.currentTarget.src = "/logo.png"; }} 
                  />
                  
                  <h4 className="font-bold text-slate-100 text-sm mb-2 leading-tight">Lazy-HR-Workaround: Intelligente Automatisierung für deinen Bewerbungserfolg</h4>
                  <div className="space-y-2 text-[11px] text-slate-300 leading-relaxed">
                    <p>Schluss mit frustrierenden Bewerbungsprozessen und ungesehenen Anschreiben! Moderne Unternehmen nutzen Algorithmen, um Profile zu filtern – oft auf Kosten der Menschlichkeit. Lazy-HR-Workaround dreht den Spieß um und schlägt die Systeme mit ihren eigenen Waffen.</p>
                    <p>Diese App ist die Brücke zwischen deinem Talent und den automatisierten Recruiting-Plattformen (ATS) der Konzerne. Statt unzählige Stunden in starre Formulare und künstlich wirkende Anschreiben zu stecken, optimiert und synchronisiert Lazy-HR-Workaround deine Daten im Hintergrund. Wir liefern den HR-Parsern exakt die strukturierten Payloads und Formate, nach denen sie suchen.</p>
                    <p className="font-semibold text-slate-200 mt-3 border-t border-slate-800 pt-2">Deine Vorteile auf einen Blick:</p>
                    <ul className="list-disc pl-4 space-y-1.5 text-slate-300">
                      <li><strong className="text-emerald-400">Maximale Effizienz:</strong> Überspringe den Ineffizienz-Ballast klassischer Online-Bewerbungen.</li>
                      <li><strong className="text-emerald-400">Perfekte Parser-Kompatibilität:</strong> Deine Daten kommen garantiert genau so an, dass der Algorithmus dich positiv bewertet.</li>
                      <li><strong className="text-emerald-400">Prozess-Optimierung:</strong> Überlass das fehleranfällige System-Füttern einer vollautomatischen Architektur und konzentriere dich auf das, was wirklich zählt: das persönliche Gespräch.</li>
                    </ul>
                    <p className="italic text-emerald-400 mt-3 pt-2 border-t border-slate-800 font-medium">Schluss mit dem HR-Frust. Lass die Maschinen für dich arbeiten!</p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight font-display text-white">
                Lazy-HR-Workaround
              </h1>
              <p className="text-xs text-slate-400">
                Intelligente Automatisierung für deinen Bewerbungserfolg
              </p>
            </div>
          </div>

          {activeMode !== "home" && (
            <button
              onClick={() => setActiveMode("home")}
              className="flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-slate-300 hover:text-white bg-slate-800/90 hover:bg-slate-700 rounded-xl border border-slate-700 transition shadow-sm"
            >
              <Home className="h-4 w-4 text-indigo-400" />
              <span>Startseite</span>
            </button>
          )}
        </div>
      </header>

      {/* Main Workspace */}
      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8 z-10 w-full">
        
        {activeMode === "home" ? (
            /* STARTSEITE & SZENARIEN-ÜBERSICHT */
            <div className="space-y-10 py-2">
              {/* Hero Banner with Large Logo Emblem */}
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative text-center space-y-6 max-w-4xl mx-auto"
              >
                {/* Background Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 sm:w-96 sm:h-96 bg-gradient-to-tr from-yellow-500/20 via-emerald-500/15 to-indigo-500/20 rounded-full blur-3xl pointer-events-none z-0" />

                {/* GROSSES WAPPEN LOGO */}
                <div className="inline-block relative z-10 cursor-default select-none my-2">
                  <div className="w-36 h-36 sm:w-48 sm:h-48 md:w-56 md:h-56 mx-auto rounded-3xl p-4 bg-slate-900/90 border-2 border-yellow-500/60 shadow-2xl shadow-yellow-500/20 flex items-center justify-center relative z-10 overflow-hidden backdrop-blur-md">
                    <div className="absolute inset-0 bg-gradient-to-tr from-yellow-500/10 via-transparent to-emerald-500/10 opacity-80 pointer-events-none z-0" />
                    <img 
                      src={logo} 
                      alt="Lazy-HR-Workaround Wappen Logo" 
                      className="w-full h-full object-contain relative z-20 drop-shadow-[0_10px_25px_rgba(0,0,0,0.8)]"
                      onError={(e) => { e.currentTarget.src = "/logo.png"; }}
                    />
                  </div>
                  <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-yellow-500 text-slate-950 font-black text-[11px] uppercase tracking-wider px-3.5 py-1 rounded-full shadow-lg border border-yellow-300 flex items-center gap-1.5 whitespace-nowrap z-30">
                    <ShieldCheck className="h-3.5 w-3.5" /> Lazy-HR-Workaround
                  </div>
                </div>

                {/* Hero Headline & Intro */}
                <div className="space-y-3 pt-3">
                  <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight font-display">
                    Schlage automatisierte HR-Filter mit ihren eigenen Waffen.
                  </h1>
                  <p className="text-sm sm:text-base text-slate-300 max-w-3xl mx-auto leading-relaxed">
                    Schluss mit ungesehenen Bewerbungen und kalten Standardabsagen. <strong className="text-yellow-400 font-semibold">Lazy-HR-Workaround</strong> führt dich Schritt für Schritt von der ATS-Konformitätsprüfung über das maßgeschneiderte Motivationsschreiben bis hin zum atemberaubenden, 100% editierbaren HTML/CSS-Redesign.
                  </p>
                </div>
              </motion.div>

              {/* Detail-Erklärungen der 3 Szenarien */}
                <div className="space-y-6 max-w-5xl mx-auto pt-4">
                  <div className="text-center space-y-1.5">
                    <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                      Die 3 Szenarien im Detail
                    </h2>
                    <p className="text-xs text-slate-400">
                      Klicke auf ein Szenario, um die Eingabemaske direkt zu öffnen.
                    </p>
                  </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
                  
                  {/* Szenario 1 Card */}
                  <motion.div 
                    whileHover={{ y: -4 }}
                    transition={{ duration: 0.2 }}
                    className="bg-slate-900/80 border border-emerald-500/30 rounded-2xl p-6 shadow-xl flex flex-col justify-between space-y-5 relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
                    
                    <div className="space-y-4 relative z-10">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-400 bg-emerald-950/80 border border-emerald-800/50 px-2.5 py-1 rounded-full">
                          Szenario 1
                        </span>
                        <Layers className="h-6 w-6 text-emerald-400" />
                      </div>

                      <h3 className="text-base font-bold text-white leading-tight">
                        ATS-Optimierung & Unsichtbare Textschicht
                      </h3>

                      <div className="space-y-2.5 text-xs text-slate-300 leading-relaxed">
                        <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800/80">
                          <strong className="text-emerald-400 font-semibold block mb-1">Was macht die Optimierung?</strong>
                          Wir analysieren deinen Lebenslauf nicht nur auf Parser-Fehler, sondern betten ein **0.05% transparentes Text-Layer** (unsichtbarer Volltext-Overlay für ATS-Parser wie Workday, Personio, SAP) ein.
                        </div>

                        <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800/80">
                          <strong className="text-emerald-400 font-semibold block mb-1">Volle ATS-Konformität ohne Design-Verlust:</strong>
                          Du musst dein schönes, individuelles Layout nicht opfern! Das unsichtbare 0.05%-Layer liefert dem ATS-System alle Schlüsselbegriffe, während das sichtbare Design 100% perfekt erhalten bleibt.
                        </div>

                        <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800/80">
                          <strong className="text-emerald-400 font-semibold block mb-1">Warum unschlagbar?</strong>
                          Kein mühsames Umformatieren in langweilige Standard-Vorlagen nötig. 100% Parser-Erfolg bei maximaler visueller Freiheit.
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => setActiveMode("ats")}
                      className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 mt-auto relative z-10 cursor-pointer"
                    >
                      <Layers className="h-4 w-4" />
                      ATS-Prüfung starten
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </motion.div>

                  {/* Szenario 2 Card */}
                  <motion.div 
                    whileHover={{ y: -4 }}
                    transition={{ duration: 0.2 }}
                    className="bg-slate-900/80 border border-indigo-500/30 rounded-2xl p-6 shadow-xl flex flex-col justify-between space-y-5 relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
                    
                    <div className="space-y-4 relative z-10">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-400 bg-indigo-950/80 border border-indigo-800/50 px-2.5 py-1 rounded-full">
                          Szenario 2
                        </span>
                        <Briefcase className="h-6 w-6 text-indigo-400" />
                      </div>

                      <h3 className="text-base font-bold text-white leading-tight">
                        Motivationsschreiben & Stellen-Matching
                      </h3>

                      <div className="space-y-2.5 text-xs text-slate-300 leading-relaxed">
                        <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800/80">
                          <strong className="text-indigo-400 font-semibold block mb-1">Wie sieht die Hilfe aus?</strong>
                          Die KI vergleicht deinen Lebenslauf mit den Anforderungen der Zielstelle und verfasst ein maßgeschneidertes Anschreiben in genau 3 Absätzen.
                        </div>

                        <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800/80">
                          <strong className="text-indigo-400 font-semibold block mb-1">Was wird gebraucht?</strong>
                          1. Dein Lebenslauf (PDF/Text).<br />
                          2. Die Stellenausschreibung (einfach im Browser als PDF drucken oder als Text einfügen).
                        </div>

                        <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800/80">
                          <strong className="text-indigo-400 font-semibold block mb-1">Keywords & Adressen:</strong>
                          Spezifische Keywords der Firma werden flüssig eingewoben. Fehlende Adressen kannst du bequem manuell ergänzen.
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => setActiveMode("motivation")}
                      className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs transition shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2 mt-auto relative z-10 cursor-pointer"
                    >
                      <Briefcase className="h-4 w-4" />
                      Anschreiben erstellen
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </motion.div>

                  {/* Szenario 3 Card */}
                  <motion.div 
                    whileHover={{ y: -4 }}
                    transition={{ duration: 0.2 }}
                    className="bg-slate-900/80 border border-yellow-500/30 rounded-2xl p-6 shadow-xl flex flex-col justify-between space-y-5 relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 rounded-full blur-2xl pointer-events-none" />
                    
                    <div className="space-y-4 relative z-10">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-extrabold uppercase tracking-widest text-yellow-400 bg-yellow-950/80 border border-yellow-800/50 px-2.5 py-1 rounded-full">
                          Szenario 3
                        </span>
                        <Sparkles className="h-6 w-6 text-yellow-400" />
                      </div>

                      <h3 className="text-base font-bold text-white leading-tight">
                        Harmonisches HTML & CSS Redesign
                      </h3>

                      <div className="space-y-2.5 text-xs text-slate-300 leading-relaxed">
                        <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800/80">
                          <strong className="text-yellow-400 font-semibold block mb-1">HTML Komplettüberarbeitung:</strong>
                          Erzeugt druckfertiges HTML/CSS. Der bereits installierte Webbrowser genügt völlig, um das Dokument vollumfänglich und betriebssystemunabhängig darzustellen, zu bearbeiten und zu drucken.
                        </div>

                        <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800/80">
                          <strong className="text-yellow-400 font-semibold block mb-1">Layout & Skizze:</strong>
                          Wähle zwischen <strong>Orthogonal</strong> (Raster) & <strong>Kurvlinear</strong> (Wellen) oder zeichne dein individuelles Layout auf dem DIN A4-Zeichenbrett.
                        </div>

                        <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800/80">
                          <strong className="text-yellow-400 font-semibold block mb-1">Live Edit & Farben im Browser:</strong>
                          Editiere alle Texte direkt im Vorschau-Dokument in Echtzeit und passe die 5-Farben-Harmonie inkl. WCAG-Kontrastprüfer individuell an.
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => setActiveMode("redesign")}
                      className="w-full py-3 bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-bold rounded-xl text-xs transition shadow-lg shadow-yellow-500/20 flex items-center justify-center gap-2 mt-auto relative z-10 cursor-pointer"
                    >
                      <Sparkles className="h-4 w-4" />
                      HTML-Redesign starten
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </motion.div>

                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Settings & Inputs */}
              <section className="w-full space-y-6">
                {/* Dynamic Content Forms according to Selected Mode */}
              {activeMode === "ats" ? (
            /* ATS Optimierung Upload & Workflow Card */
            <div className={`rounded-2xl border p-6 space-y-6 shadow-xl backdrop-blur-sm transition-all duration-300 ${
              unreadableType === "ats" 
                ? "bg-red-950/20 border-red-500/60 ring-2 ring-red-500/20 shadow-red-950/30" 
                : "bg-slate-900/60 border-slate-800"
            }`}>
              <div className="border-b border-slate-800 pb-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                    <Layers className={`h-4 w-4 ${unreadableType === "ats" ? "text-red-400 animate-pulse" : "text-emerald-400"}`} />
                    Szenario 1: ATS-Optimierung & Unsichtbare Textschicht
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Analyse und Optimierung deines Lebenslaufs für ATS-Parser.
                  </p>
                </div>
                <div className="bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 font-extrabold text-[10px] px-2.5 py-1 rounded-full flex items-center gap-1.5 shrink-0">
                  <ShieldCheck className="h-3.5 w-3.5" /> 0.05% Transparent-Layer Garantie
                </div>
              </div>

              {/* Notice Box: 0.05% Transparent Layer Explanation */}
              <div className="bg-emerald-950/30 border border-emerald-500/25 rounded-xl p-3.5 flex items-start gap-2.5 text-xs text-slate-300 shadow-inner">
                <ShieldCheck className="h-4.5 w-4.5 text-emerald-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="font-bold text-emerald-300 text-[11px] block">
                    Garantierte ATS-Lesbarkeit ohne Design-Kompromiss:
                  </span>
                  <p className="text-[10px] text-slate-300 leading-relaxed">
                    Bei der Aufbereitung fügt das System ein **0.05% transparentes Text-Layer** (unsichtbaren Volltext) ein. Personal-Parser (Workday, Personio, SAP) lesen alle Keywords 100% fehlerfrei aus, während dein optisches Layout unverändert bleibt!
                  </p>
                </div>
              </div>

              {/* LEBENSLAUF HOCHLADEN / EINFÜGEN */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold border ${
                      (atsRawExtractedText || parsedResumeData)
                        ? "bg-emerald-500 text-slate-950 border-emerald-400"
                        : unreadableType === "ats" 
                          ? "bg-red-600/20 text-red-400 border-red-500/30" 
                          : "bg-emerald-600/20 text-emerald-400 border-emerald-500/30"
                    }`}>
                      {(atsRawExtractedText || parsedResumeData) ? "✓" : "1"}
                    </span>
                    <label className="block text-xs font-semibold text-slate-300">
                      Punkt 1: Lebenslauf einfügen (PDF oder Bild)
                    </label>
                  </div>
                  {(atsRawExtractedText || parsedResumeData) && (
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
                      Punkt 1 abgeschlossen
                    </span>
                  )}
                </div>
                
                {unreadableType === "ats" && unreadableFile ? (
                  <div className="bg-red-950/50 border border-red-500/80 rounded-xl p-4 space-y-3 shadow-lg">
                    <div className="flex gap-2.5">
                      <AlertTriangle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
                      <div className="space-y-1">
                        <h4 className="text-xs font-bold text-red-200">
                          Textextraktion fehlgeschlagen
                        </h4>
                        <p className="text-[11px] text-red-300 leading-normal">
                          Die Datei <strong>"{unreadableFile.name}"</strong> enthält keinen direkt lesbaren Text (z.B. ein gescanntes PDF oder Bild).
                          <br />
                          Da die lokale Texterkennung (OCR) aus datenschutzrechtlichen Gründen (DSGVO) vollständig deaktiviert wurde, ist eine Extraktion im Browser unmöglich.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 pt-2 border-t border-red-900/40">
                      <button
                        type="button"
                        onClick={handleCancelUnreadable}
                        disabled={isProcessingDirectPdf}
                        className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-semibold transition flex-1"
                      >
                        Abbrechen
                      </button>
                      <button
                        type="button"
                        onClick={handleRelaxGdprAndProcess}
                        disabled={isProcessingDirectPdf}
                        className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white text-[11px] font-bold transition flex-1 flex items-center justify-center gap-1.5 shadow-md shadow-red-950"
                      >
                        {isProcessingDirectPdf ? (
                          <>
                            <RefreshCw className="h-3 w-3 animate-spin" />
                            Verarbeite...
                          </>
                        ) : (
                          "DSGVO lockern & direkt senden"
                        )}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-slate-700 hover:border-emerald-500/50 rounded-xl p-4 text-center transition bg-slate-950/40 relative cursor-pointer">
                    <input
                      type="file"
                      accept="application/pdf,image/*"
                      onChange={handleAtsPdfUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      id="ats-file-input"
                    />
                    <FileText className="h-8 w-8 text-slate-500 mx-auto mb-2" />
                    <span className="text-xs font-semibold text-slate-300 block">
                      {atsPdfFile ? atsPdfFile.name : "Lebenslauf PDF/Bild hierherziehen oder auswählen"}
                    </span>
                    <span className="text-[10px] text-slate-500 mt-1 block">
                      Max. 10MB • PDF-Format oder Bilder (PNG, JPG, WEBP)
                    </span>
                  </div>
                )}

                {isAtsExtracting && (
                  <div className="flex items-center justify-center gap-2 py-2 text-xs text-emerald-400">
                    <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                    Lese Lebenslauf ein...
                  </div>
                )}
                
                {atsRawExtractedText && !isAtsExtracting && (
                  <div className="text-emerald-400 text-[10px] flex items-center gap-1 px-1">
                    <Check className="h-3.5 w-3.5" /> Text erfolgreich extrahiert.
                  </div>
                )}

                {/* ATS Compliance Dashboard Widget with D3 Gauge */}
                {(!!atsRawExtractedText || !!parsedResumeData) && (
                  <div className="bg-slate-950/80 rounded-xl border border-slate-800 p-4 space-y-4 shadow-inner mt-2">
                    <div className="flex items-center justify-between border-b border-slate-800/60 pb-2">
                      <h4 className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                        <Gauge className="h-3.5 w-3.5 text-emerald-400 animate-pulse" />
                        ATS-Konformitäts-Analyse & Score
                      </h4>
                      <span className="text-[10px] text-slate-400 font-mono">Real-time D3 Engine</span>
                    </div>

                    {(() => {
                      const metrics = getAtsMetrics(atsRawExtractedText, parsedResumeData);
                      
                      return (
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                            {/* Left: D3 Gauge Chart */}
                            <div className="md:col-span-5 flex flex-col items-center justify-center bg-slate-900/40 rounded-lg p-2 border border-slate-800/30">
                              <AtsGauge score={metrics.score} width={150} height={90} />
                            </div>

                            {/* Right: Scores breakdown */}
                            <div className="md:col-span-7 space-y-2.5">
                              {/* Keyword Score progress */}
                              <div className="space-y-1">
                                <div className="flex justify-between text-[10px] font-medium">
                                  <span className="text-slate-400 flex items-center gap-1">
                                    <Target className="h-3 w-3 text-emerald-400" />
                                    Keyword-Dichte
                                  </span>
                                  <span className="text-slate-200 font-bold">{Math.round((metrics.keywordScore / 35) * 100)}%</span>
                                </div>
                                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                                  <div 
                                    className="bg-emerald-500 h-1.5 rounded-full transition-all duration-1000" 
                                    style={{ width: `${(metrics.keywordScore / 35) * 100}%` }}
                                  />
                                </div>
                              </div>

                              {/* Formatting Score progress */}
                              <div className="space-y-1">
                                <div className="flex justify-between text-[10px] font-medium">
                                  <span className="text-slate-400 flex items-center gap-1">
                                    <FileText className="h-3 w-3 text-purple-400" />
                                    Formatierung
                                  </span>
                                  <span className="text-slate-200 font-bold">{Math.round((metrics.formattingScore / 30) * 100)}%</span>
                                </div>
                                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                                  <div 
                                    className="bg-purple-500 h-1.5 rounded-full transition-all duration-1000" 
                                    style={{ width: `${(metrics.formattingScore / 30) * 100}%` }}
                                  />
                                </div>
                              </div>

                              {/* Structure Score progress */}
                              <div className="space-y-1">
                                <div className="flex justify-between text-[10px] font-medium">
                                  <span className="text-slate-400 flex items-center gap-1">
                                    <Layers className="h-3 w-3 text-amber-400" />
                                    Abschnitts-Struktur
                                  </span>
                                  <span className="text-slate-200 font-bold">{Math.round((metrics.structureScore / 35) * 100)}%</span>
                                </div>
                                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                                  <div 
                                    className="bg-amber-500 h-1.5 rounded-full transition-all duration-1000" 
                                    style={{ width: `${(metrics.structureScore / 35) * 100}%` }}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Keywords Found & Suggestions */}
                          <div className="border-t border-slate-800/80 pt-3 space-y-3">
                            <div className="flex flex-wrap gap-1.5">
                              <span className="text-[9px] font-bold text-slate-500 block uppercase w-full">Erkannte Keywords:</span>
                              {metrics.foundKeywords.length === 0 ? (
                                <span className="text-[10px] text-slate-500 italic">Keine Standard-Keywords erkannt.</span>
                              ) : (
                                metrics.foundKeywords.map((kw, idx) => (
                                  <span key={idx} className="bg-emerald-950/40 text-emerald-400 border border-emerald-900/30 rounded px-1.5 py-0.5 text-[9px] font-mono">
                                    {kw}
                                  </span>
                                ))
                              )}
                            </div>

                            {metrics.missingKeywords.length > 0 && (
                              <div className="flex flex-wrap gap-1.5">
                                <span className="text-[9px] font-bold text-slate-500 block uppercase w-full">Empfohlene Keywords (Fehlend):</span>
                                {metrics.missingKeywords.map((kw, idx) => (
                                  <span key={idx} className="bg-slate-900 text-slate-400 border border-slate-800 rounded px-1.5 py-0.5 text-[9px] font-mono">
                                    +{kw}
                                  </span>
                                ))}
                              </div>
                            )}

                            {/* Collapsible Actionable Recommendations */}
                            <div className="bg-slate-900/50 rounded-lg border border-slate-800/60 p-2.5">
                              <button
                                type="button"
                                onClick={() => setShowAtsSuggestions(!showAtsSuggestions)}
                                className="w-full flex items-center justify-between text-[11px] font-bold text-slate-300 hover:text-white transition"
                              >
                                <span className="flex items-center gap-1">
                                  <Info className="h-3.5 w-3.5 text-emerald-400 animate-pulse" />
                                  Detaillierte Optimierungsvorschläge ({metrics.suggestions.length})
                                </span>
                                <span className="text-[10px] text-emerald-400">
                                  {showAtsSuggestions ? "Ausblenden" : "Einblenden"}
                                </span>
                              </button>
                              
                              {showAtsSuggestions && (
                                <ul className="mt-2 space-y-1.5 border-t border-slate-800/60 pt-2 text-[10px] text-slate-400 list-none pl-0">
                                  {metrics.suggestions.map((sug, idx) => (
                                    <li key={idx} className="flex items-start gap-1.5 leading-relaxed">
                                      <span className="shrink-0 mt-0.5">•</span>
                                      <span>{sug}</span>
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                )}
              </div>

              {/* SCHRITT 2: ANONYMISIERUNG (WIRDT ERST FREIGESCHALTET, WENN SCHRITT 1 AUSGEFÜLLT IST) */}
              {(!!atsRawExtractedText || !!parsedResumeData) && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-3 pt-2 border-t border-slate-800/80"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-bold border border-emerald-400">
                        {appliedNames.trim() ? "✓" : "2"}
                      </span>
                      <label className="block text-xs font-semibold text-slate-300">
                        Punkt 2: Namen-Anonymisierung
                      </label>
                    </div>
                  </div>

                  {/* Falls Name bereits bestätigt wurde -> Fenster überspringen & unaufdringlichen Badge anzeigen */}
                  {appliedNames.trim() ? (
                    <div className="bg-slate-950/80 border border-emerald-500/30 rounded-xl p-3 flex items-center justify-between text-xs shadow-sm">
                      <div className="flex items-center gap-2 text-emerald-300 font-medium">
                        <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
                        <span>Name <strong>"{appliedNames}"</strong> wurde anonymisiert.</span>
                      </div>
                      <button
                        type="button"
                        onClick={handleResetNameMasking}
                        className="text-[10px] text-slate-400 hover:text-white underline shrink-0 ml-2 cursor-pointer"
                      >
                        Name ändern
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2.5 bg-slate-950/50 p-3.5 rounded-xl border border-slate-800">
                      <div className="relative">
                        <input
                          type="text"
                          value={manualNames}
                          onChange={(e) => setManualNames(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              handleConfirmNameMasking();
                            }
                          }}
                          placeholder="Vorname Nachname, z.B. Max Mustermann"
                          className="w-full text-xs bg-slate-950 border border-slate-700 rounded-lg px-3 py-2.5 text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                          id="manual-names-input"
                        />
                        <div className="absolute right-3 top-2.5 flex items-center text-slate-500">
                          <User className="h-3.5 w-3.5" />
                        </div>
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] text-slate-500 leading-relaxed">
                          Trage deinen Namen ein und klicke auf Anonymisieren, um ihn im Dokument zu maskieren.
                        </span>
                        <button
                          type="button"
                          onClick={() => handleConfirmNameMasking()}
                          disabled={!atsRawExtractedText && !parsedResumeData}
                          className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 text-white rounded-lg text-xs font-bold transition shadow-md shrink-0 cursor-pointer"
                          id="btn-mask-names-action"
                        >
                          Anonymisieren
                        </button>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {/* SCHRITT 3: VORSCHAU PAYLOAD & KI-ANALYSE */}
              {(!!atsRawExtractedText || !!parsedResumeData) && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-3 pt-3 border-t border-slate-800/80"
                >
                  <div className="flex items-center gap-2">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-600/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">3</span>
                    <label className="block text-xs font-semibold text-slate-300">
                      Punkt 3: Anonymisierte Vorschau &amp; KI-Strukturierung
                    </label>
                  </div>

                  {atsMaskedText && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-400 text-[11px]">Vorschau des anonymisierten Payloads:</span>
                        <button
                          onClick={() => triggerCopy(atsMaskedText, "masked-cv")}
                          className="text-emerald-400 hover:text-emerald-300 transition flex items-center gap-1 text-[10px]"
                        >
                          {copiedSection === "masked-cv" ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                          {copiedSection === "masked-cv" ? "Kopiert" : "Kopieren"}
                        </button>
                      </div>
                      <textarea
                        value={atsMaskedText}
                        onChange={(e) => setAtsMaskedText(e.target.value)}
                        className="w-full h-28 bg-slate-950 text-slate-300 border border-slate-800 rounded-lg p-2.5 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-emerald-500/50"
                        id="ai-cv-textarea"
                      />
                    </div>
                  )}

                  <div className="bg-slate-950/60 rounded-xl border border-slate-800/50 p-3 space-y-1.5">
                    <div className="flex items-center gap-1.5 text-slate-300">
                      <Sparkles className="h-3.5 w-3.5 text-emerald-400 animate-pulse" />
                      <span className="text-[11px] font-bold tracking-tight text-white">Gemma-KI-Engine (Aktiv)</span>
                    </div>
                    <p className="text-[10px] text-slate-400 leading-normal">
                      Ausfallsichere Gemma-Modellkette. Die Verarbeitung erfolgt DSGVO-konform mit automatischem Failover.
                    </p>
                  </div>

                  <button
                    onClick={sendAtsToAI}
                    disabled={isAtsSending || !atsRawExtractedText}
                    className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-850 disabled:text-slate-600 text-white font-bold rounded-xl text-xs transition shadow-lg shadow-emerald-600/15 flex items-center justify-center gap-2 cursor-pointer"
                    id="btn-process-cv-ai"
                  >
                    {isAtsSending ? (
                      <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Sparkles className="h-3.5 w-3.5" />
                    )}
                    {isAtsSending ? "KI analysiert und strukturiert..." : "Anonymisierten Text an KI senden"}
                  </button>
                </motion.div>
              )}
            </div>
          ) : activeMode === "motivation" ? (
            /* Motivationsschreiben Mode Inputs - Vertical Step Workflow */
            <div className={`rounded-2xl border p-6 space-y-6 shadow-xl backdrop-blur-sm transition-all duration-300 ${
              (unreadableType === "motivation" || unreadableType === "jd") 
                ? "bg-red-950/20 border-red-500/60 ring-2 ring-red-500/20 shadow-red-950/30" 
                : "bg-slate-900/60 border-slate-800"
            }`}>
              <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                    <Briefcase className={`h-4 w-4 ${(unreadableType === "motivation" || unreadableType === "jd") ? "text-red-400 animate-pulse" : "text-indigo-400"}`} />
                    Szenario 2: KI-Motivationsschreiben &amp; Abgleich
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Erstelle ein passgenaues Anschreiben für deine Zielstelle.
                  </p>
                </div>
              </div>

              {/* DOKUMENTE HOCHLADEN */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold border ${
                      (motivationExtractedText && jdExtractedText)
                        ? "bg-indigo-500 text-slate-950 border-indigo-400"
                        : (unreadableType === "motivation" || unreadableType === "jd") 
                          ? "bg-red-600/20 text-red-400 border-red-500/30" 
                          : "bg-indigo-600/20 text-indigo-400 border-indigo-500/30"
                    }`}>
                      {(motivationExtractedText && jdExtractedText) ? "✓" : "1"}
                    </span>
                    <label className="block text-xs font-semibold text-slate-300">
                      Punkt 1: Dokumente hochladen (Lebenslauf + Stellenausschreibung)
                    </label>
                  </div>
                  {(motivationExtractedText && jdExtractedText) && (
                    <span className="text-[10px] font-bold text-indigo-400 bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-800">
                      Punkt 1 abgeschlossen
                    </span>
                  )}
                </div>

                {(unreadableType === "motivation" || unreadableType === "jd") && unreadableFile ? (
                  <div className="bg-red-950/50 border border-red-500/80 rounded-xl p-4 space-y-3 shadow-lg">
                    <div className="flex gap-2.5">
                      <AlertTriangle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
                      <div className="space-y-1">
                        <h4 className="text-xs font-bold text-red-200">
                          Textextraktion fehlgeschlagen
                        </h4>
                        <p className="text-[11px] text-red-300 leading-normal">
                          Die Datei <strong>"{unreadableFile.name}"</strong> ({unreadableType === "motivation" ? "Lebenslauf" : "Stellenausschreibung"}) enthält keinen direkt lesbaren Text (z.B. ein gescanntes PDF oder Bild).
                          <br />
                          Da die lokale Texterkennung (OCR) aus datenschutzrechtlichen Gründen (DSGVO) vollständig deaktiviert wurde, ist eine Extraktion im Browser unmöglich.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 pt-2 border-t border-red-900/40">
                      <button
                        type="button"
                        onClick={handleCancelUnreadable}
                        disabled={isProcessingDirectPdf}
                        className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-semibold transition flex-1"
                      >
                        Abbrechen
                      </button>
                      <button
                        type="button"
                        onClick={handleRelaxGdprAndProcess}
                        disabled={isProcessingDirectPdf}
                        className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white text-[11px] font-bold transition flex-1 flex items-center justify-center gap-1.5 shadow-md shadow-red-950"
                      >
                        {isProcessingDirectPdf ? (
                          <>
                            <RefreshCw className="h-3 w-3 animate-spin" />
                            Verarbeite...
                          </>
                        ) : (
                          "DSGVO lockern & direkt senden"
                        )}
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="space-y-2">
                      <label className="block text-[10px] font-medium text-slate-400">Dein Lebenslauf PDF/Bild</label>
                      <div className="border-2 border-dashed border-slate-700 hover:border-blue-500/50 rounded-xl p-3 text-center transition bg-slate-950/40 relative cursor-pointer">
                        <input
                          type="file"
                          accept="application/pdf,image/*"
                          onChange={handleMotivationPdfUpload}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <span className="text-xs font-semibold text-slate-300 block">
                          {motivationPdfFile ? motivationPdfFile.name : "Lebenslauf PDF oder Bild auswählen"}
                        </span>
                      </div>
                      {isMotivationExtracting && (
                        <span className="text-[10px] text-blue-400 flex items-center gap-1 justify-center">
                          <RefreshCw className="h-3 w-3 animate-spin" /> Lebenslauf wird eingelesen...
                        </span>
                      )}
                      {motivationExtractedText && !isMotivationExtracting && (
                        <span className="text-emerald-400 text-[10px] block px-1">✓ Lebenslauf-Text geladen.</span>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="block text-[10px] font-medium text-slate-400">Stellenausschreibung PDF/Bild</label>
                      <div className="border-2 border-dashed border-slate-700 hover:border-blue-500/50 rounded-xl p-3 text-center transition bg-slate-950/40 relative cursor-pointer">
                        <input
                          type="file"
                          accept="application/pdf,image/*"
                          onChange={handleJdPdfUpload}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <span className="text-xs font-semibold text-slate-300 block">
                          {jdPdfFile ? jdPdfFile.name : "Stellenausschreibung PDF oder Bild auswählen"}
                        </span>
                      </div>
                      {isJdExtracting && (
                        <span className="text-[10px] text-blue-400 flex items-center gap-1 justify-center">
                          <RefreshCw className="h-3 w-3 animate-spin" /> Ausschreibung wird eingelesen...
                        </span>
                      )}
                      {jdExtractedText && !isJdExtracting && (
                        <span className="text-emerald-400 text-[10px] block px-1">✓ Stellenausschreibung geladen.</span>
                      )}
                    </div>
                  </>
                )}
              </div>

              {/* SCHRITT 2: ANONYMISIERUNG (FREIGESCHALTET SOBALD EIN TEXT GELADEN IST) */}
              {(!!motivationExtractedText || !!jdExtractedText) && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-3 pt-2 border-t border-slate-800/80"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-500 text-slate-950 text-[10px] font-bold border border-blue-400">
                        {appliedNames.trim() ? "✓" : "2"}
                      </span>
                      <label className="block text-xs font-semibold text-slate-300">
                        Punkt 2: Namen-Anonymisierung
                      </label>
                    </div>
                  </div>

                  {/* Falls Name bereits bestätigt wurde -> Fenster überspringen & unaufdringlichen Badge anzeigen */}
                  {appliedNames.trim() ? (
                    <div className="bg-slate-950/80 border border-blue-500/30 rounded-xl p-3 flex items-center justify-between text-xs shadow-sm">
                      <div className="flex items-center gap-2 text-blue-300 font-medium">
                        <ShieldCheck className="h-4 w-4 text-blue-400 shrink-0" />
                        <span>Name <strong>"{appliedNames}"</strong> wurde anonymisiert.</span>
                      </div>
                      <button
                        type="button"
                        onClick={handleResetNameMasking}
                        className="text-[10px] text-slate-400 hover:text-white underline shrink-0 ml-2 cursor-pointer"
                      >
                        Name ändern
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2.5 bg-slate-950/50 p-3.5 rounded-xl border border-slate-800">
                      <div className="relative">
                        <input
                          type="text"
                          value={manualNames}
                          onChange={(e) => setManualNames(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              handleConfirmNameMasking();
                            }
                          }}
                          placeholder="Vorname Nachname, z.B. Max Mustermann"
                          className="w-full text-xs bg-slate-950 border border-slate-700 rounded-lg px-3 py-2.5 text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                        />
                        <div className="absolute right-3 top-2.5 flex items-center text-slate-500">
                          <User className="h-3.5 w-3.5" />
                        </div>
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] text-slate-500 leading-relaxed">
                          Trage deinen Namen ein und klicke auf Anonymisieren, um ihn im Dokument zu maskieren.
                        </span>
                        <button
                          type="button"
                          onClick={() => handleConfirmNameMasking()}
                          disabled={!motivationExtractedText && !jdExtractedText}
                          className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 text-white rounded-lg text-xs font-bold transition shadow-md shrink-0 cursor-pointer"
                        >
                          Anonymisieren
                        </button>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {/* SCHRITT 3: VORSCHAU & KI MATCHING */}
              {(!!motivationExtractedText || !!jdExtractedText) && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-3 pt-3 border-t border-slate-800/80"
                >
                  <div className="flex items-center gap-2">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-600/20 text-blue-400 text-[10px] font-bold border border-blue-500/30">3</span>
                    <label className="block text-xs font-semibold text-slate-300">
                      Punkt 3: KI-Anschreiben &amp; Keyword-Gegenüberstellung
                    </label>
                  </div>

                  {motivationMaskedText && (
                    <div className="space-y-1.5 pt-1">
                      <span className="block text-[11px] font-semibold text-slate-400">Maskierter Lebenslauf Text:</span>
                      <textarea
                        value={motivationMaskedText}
                        onChange={(e) => setMotivationMaskedText(e.target.value)}
                        className="w-full h-24 bg-slate-950 border border-slate-800 rounded-lg p-2 text-[10px] font-mono text-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500/30"
                      />
                    </div>
                  )}

                  {jdExtractedText && (
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="block text-[11px] font-semibold text-slate-400">Stellenausschreibung Text:</span>
                        <button 
                          onClick={handleManualNameMaskingJd}
                          className="text-[10px] text-blue-400 hover:text-blue-300 font-bold"
                        >
                          Daten jetzt anonymisieren
                        </button>
                      </div>
                      <textarea
                        value={jdExtractedText}
                        onChange={(e) => setJdExtractedText(e.target.value)}
                        className="w-full h-24 bg-slate-950 border border-slate-800 rounded-lg p-2 text-[10px] font-mono text-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500/30"
                      />
                      {jdMaskedText && (
                        <div className="space-y-1.5 pt-1">
                          <span className="block text-[11px] font-semibold text-slate-400">Maskierter Stellenausschreibungs-Text:</span>
                          <textarea
                            value={jdMaskedText}
                            readOnly
                            className="w-full h-24 bg-slate-950 border border-slate-800 rounded-lg p-2 text-[10px] font-mono text-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-500/30"
                          />
                        </div>
                      )}
                    </div>
                  )}

                  <div className="bg-slate-950/60 rounded-xl border border-slate-800/50 p-3 space-y-1.5">
                    <div className="flex items-center gap-1.5 text-slate-300">
                      <Sparkles className="h-3.5 w-3.5 text-indigo-400 animate-pulse" />
                      <span className="text-[11px] font-bold tracking-tight text-white">Gemma-KI-Engine (Aktiv)</span>
                    </div>
                    <p className="text-[10px] text-slate-400 leading-normal">
                      Ausfallsichere Gemma-Modellkette. Die Verarbeitung erfolgt DSGVO-konform mit automatischem Failover.
                    </p>
                  </div>

                  <button
                    onClick={sendMatchingToAI}
                    disabled={isMatchSending || !motivationExtractedText || !jdExtractedText}
                    className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-850 disabled:text-slate-600 text-white font-bold rounded-xl text-xs transition flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/15 cursor-pointer"
                    id="btn-match-docs"
                  >
                    {isMatchSending ? (
                      <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Sparkles className="h-3.5 w-3.5" />
                    )}
                    {isMatchSending ? "Analysiere & Generiere..." : "Abgleich & Anschreiben erstellen"}
                  </button>
                </motion.div>
              )}
            </div>
          ) : (
            /* Redesign Mode Inputs */
            <div className={`rounded-2xl border p-6 space-y-6 shadow-xl backdrop-blur-sm transition-all duration-300 ${
              unreadableType === "redesign" 
                ? "bg-red-950/20 border-red-500/60 ring-2 ring-red-500/20 shadow-red-950/30" 
                : "bg-slate-900/60 border-slate-800"
            }`}>
              <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                    <Sparkles className={`h-4 w-4 ${unreadableType === "redesign" ? "text-red-400 animate-pulse" : "text-yellow-400"}`} />
                    Szenario 3: HTML-Redesign in Echtzeit
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Wandle deinen Lebenslauf in ein individuelles, druckfertiges HTML/CSS-Design um.
                  </p>
                </div>
              </div>

              {/* LEBENSLAUF HOCHLADEN ODER EINFÜGEN */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold border ${
                      redesignExtractedText
                        ? "bg-yellow-500 text-slate-950 border-yellow-400"
                        : unreadableType === "redesign" 
                          ? "bg-red-600/20 text-red-400 border-red-500/30" 
                          : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                    }`}>
                      {redesignExtractedText ? "✓" : "1"}
                    </span>
                    <label className="block text-xs font-semibold text-slate-300">
                      Punkt 1: Lebenslauf einfügen (PDF, Bild oder Text)
                    </label>
                  </div>
                  {redesignExtractedText && (
                    <span className="text-[10px] font-bold text-yellow-400 bg-yellow-950/60 px-2 py-0.5 rounded border border-yellow-800">
                      Punkt 1 abgeschlossen
                    </span>
                  )}
                </div>

                {unreadableType === "redesign" && unreadableFile ? (
                  <div className="bg-red-950/50 border border-red-500/80 rounded-xl p-4 space-y-3 shadow-lg">
                    <div className="flex gap-2.5">
                      <AlertTriangle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
                      <div className="space-y-1">
                        <h4 className="text-xs font-bold text-red-200">
                          Textextraktion fehlgeschlagen
                        </h4>
                        <p className="text-[11px] text-red-300 leading-normal">
                          Die Datei <strong>"{unreadableFile.name}"</strong> enthält keinen direkt lesbaren Text (z.B. ein gescanntes PDF oder Bild).
                          <br />
                          Da die lokale Texterkennung (OCR) aus Datenschutzgründen deaktiviert wurde, ist eine Extraktion im Browser unmöglich.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 pt-2 border-t border-red-900/40">
                      <button
                        type="button"
                        onClick={handleCancelUnreadable}
                        disabled={isProcessingDirectPdf}
                        className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-semibold transition flex-1"
                      >
                        Abbrechen
                      </button>
                      <button
                        type="button"
                        onClick={handleRelaxGdprAndProcess}
                        disabled={isProcessingDirectPdf}
                        className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white text-[11px] font-bold transition flex-1 flex items-center justify-center gap-1.5 shadow-md shadow-red-950"
                      >
                        {isProcessingDirectPdf ? (
                          <>
                            <RefreshCw className="h-3 w-3 animate-spin" />
                            Verarbeite...
                          </>
                        ) : (
                          "DSGVO lockern & direkt senden"
                        )}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="border-2 border-dashed border-slate-700 hover:border-yellow-500/50 rounded-xl p-4 text-center transition bg-slate-950/40 relative cursor-pointer">
                        <input
                          type="file"
                          accept="application/pdf,image/*"
                          onChange={handleRedesignPdfUpload}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <span className="text-xs font-semibold text-slate-300 block overflow-hidden text-ellipsis whitespace-nowrap">
                          {redesignPdfFile ? redesignPdfFile.name : "Lebenslauf PDF/Bild auswählen"}
                        </span>
                      </div>
                      
                      <div className="border-2 border-dashed border-slate-700 hover:border-yellow-500/50 rounded-xl p-4 text-center transition bg-slate-950/40 relative cursor-pointer">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleRedesignAvatarUpload}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <span className="text-xs font-semibold text-slate-300 block overflow-hidden text-ellipsis whitespace-nowrap">
                          {redesignAvatarFile ? redesignAvatarFile.name : "Portrait Foto (Optional)"}
                        </span>
                      </div>
                    </div>

                    <div className="bg-emerald-950/20 border border-emerald-500/20 rounded-xl p-3 flex items-start gap-2 shadow-sm">
                      <ShieldCheck className="h-4.5 w-4.5 text-emerald-400 shrink-0 mt-0.5" />
                      <p className="text-[10px] text-slate-400 leading-relaxed">
                        <strong>DSGVO-konform:</strong> Ihr Portrait-Foto wird ausschließlich lokal im Browser verarbeitet (Client-side Base64-Konvertierung) und niemals an externe KI-Server übertragen oder dort gespeichert.
                      </p>
                    </div>

                    {isRedesignExtracting && (
                      <span className="text-[10px] text-yellow-400 flex items-center gap-1 justify-center">
                        <RefreshCw className="h-3 w-3 animate-spin" /> Lebenslauf wird analysiert...
                      </span>
                    )}

                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-medium text-slate-400">
                        Vorhandener Lebenslauf Text (direkt einfügen oder bearbeiten):
                      </label>
                      <textarea
                        value={redesignExtractedText}
                        onChange={(e) => {
                          setRedesignExtractedText(e.target.value);
                          performMasking(e.target.value, appliedNames, setRedesignMaskedText, false);
                        }}
                        placeholder="Füge hier deinen Lebenslauf-Text ein oder lade oben eine Datei hoch..."
                        className="w-full h-32 bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs font-mono text-slate-300 focus:outline-none focus:ring-1 focus:ring-yellow-500/40"
                        id="redesign-extracted-textarea"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* SCHRITT 2: ANONYMISIERUNG (FREIGESCHALTET SOBALD TEXT GELADEN IST) */}
              {!!redesignExtractedText && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-3 pt-2 border-t border-slate-800/80"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="flex items-center justify-center w-5 h-5 rounded-full bg-yellow-500 text-slate-950 text-[10px] font-bold border border-yellow-400">
                        {appliedNames.trim() ? "✓" : "2"}
                      </span>
                      <label className="block text-xs font-semibold text-slate-300">
                        Punkt 2: Namen-Anonymisierung
                      </label>
                    </div>
                  </div>

                  {/* Falls Name bereits bestätigt wurde -> Fenster überspringen & unaufdringlichen Badge anzeigen */}
                  {appliedNames.trim() ? (
                    <div className="bg-slate-950/80 border border-yellow-500/30 rounded-xl p-3 flex items-center justify-between text-xs shadow-sm">
                      <div className="flex items-center gap-2 text-yellow-300 font-medium">
                        <ShieldCheck className="h-4 w-4 text-yellow-400 shrink-0" />
                        <span>Name <strong>"{appliedNames}"</strong> wurde anonymisiert.</span>
                      </div>
                      <button
                        type="button"
                        onClick={handleResetNameMasking}
                        className="text-[10px] text-slate-400 hover:text-white underline shrink-0 ml-2 cursor-pointer"
                      >
                        Name ändern
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2.5 bg-slate-950/50 p-3.5 rounded-xl border border-slate-800">
                      <div className="relative">
                        <input
                          type="text"
                          value={manualNames}
                          onChange={(e) => setManualNames(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              handleConfirmNameMasking();
                            }
                          }}
                          placeholder="Vorname Nachname, z.B. Max Mustermann"
                          className="w-full text-xs bg-slate-950 border border-slate-700 rounded-lg px-3 py-2.5 text-slate-100 focus:outline-none focus:ring-2 focus:ring-yellow-500/30"
                        />
                        <div className="absolute right-3 top-2.5 flex items-center text-slate-500">
                          <User className="h-3.5 w-3.5" />
                        </div>
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] text-slate-500 leading-relaxed">
                          Trage deinen Namen ein und klicke auf Anonymisieren, um ihn im Dokument zu maskieren.
                        </span>
                        <button
                          type="button"
                          onClick={() => handleConfirmNameMasking()}
                          disabled={!redesignExtractedText}
                          className="px-4 py-1.5 bg-yellow-500 hover:bg-yellow-400 disabled:bg-slate-800 text-slate-950 rounded-lg text-xs font-bold transition shadow-md shrink-0 cursor-pointer"
                        >
                          Anonymisieren
                        </button>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {/* SCHRITT 3: DESIGN-STIL & KI-GENERIERUNG (FREIGESCHALTET SOBALD TEXT GELADEN IST) */}
              {!!redesignExtractedText && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4 pt-3 border-t border-slate-800/80"
                >
                  <div className="flex items-center gap-2">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-yellow-500/20 text-yellow-400 text-[10px] font-bold border border-yellow-500/30">3</span>
                    <label className="block text-xs font-semibold text-slate-300">
                      Punkt 3: Design-Stil wählen &amp; HTML-Redesign generieren
                    </label>
                  </div>

                  {redesignMaskedText && (
                    <div className="space-y-1.5">
                      <span className="block text-[11px] font-semibold text-slate-400">Maskierter Lebenslauf Text für KI:</span>
                      <textarea
                        value={redesignMaskedText}
                        onChange={(e) => setRedesignMaskedText(e.target.value)}
                        className="w-full h-24 bg-slate-950 border border-slate-800 rounded-lg p-2 text-[10px] font-mono text-slate-300 focus:outline-none focus:ring-1 focus:ring-yellow-500/30"
                      />
                    </div>
                  )}

                  <div className="grid grid-cols-3 gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        setRedesignStyle("orthogonal");
                        setRedesignSelectedStyle("orthogonal");
                        setIsManualSketchOpen(false);
                      }}
                      className={`p-2.5 rounded-xl border text-left transition flex flex-col justify-between h-24 ${
                        (redesignStyle === "orthogonal" && !isManualSketchOpen)
                          ? "bg-yellow-500/10 border-yellow-500 text-yellow-400 shadow-md shadow-yellow-500/5"
                          : "bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700"
                      }`}
                    >
                      <span className="text-[9px] font-extrabold block leading-tight">STRUKTURIERT</span>
                      <span className="text-[8px] text-slate-400 leading-snug">
                        Geradlinig, orthogonal &amp; klar aufgeteilt.
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setRedesignStyle("kurvlinear");
                        setRedesignSelectedStyle("kurvlinear");
                        setIsManualSketchOpen(false);
                      }}
                      className={`p-2.5 rounded-xl border text-left transition flex flex-col justify-between h-24 ${
                        (redesignStyle === "kurvlinear" && !isManualSketchOpen)
                          ? "bg-yellow-500/10 border-yellow-500 text-yellow-400 shadow-md shadow-yellow-500/5"
                          : "bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700"
                      }`}
                    >
                      <span className="text-[9px] font-extrabold block leading-tight">KREATIV / CURVE</span>
                      <span className="text-[8px] text-slate-400 leading-snug">
                        Asymmetrisch, kurvig &amp; geschwungen.
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setIsManualSketchOpen(true);
                        setUseSketchInAi(true);
                      }}
                      className={`p-2.5 rounded-xl border text-left transition flex flex-col justify-between h-24 ${
                        isManualSketchOpen
                          ? "bg-yellow-500/10 border-yellow-500 text-yellow-400 shadow-md shadow-yellow-500/5"
                          : "bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700"
                      }`}
                    >
                      <span className="text-[9px] font-extrabold block leading-tight">MANUELLE SKIZZE</span>
                      <span className="text-[8px] text-slate-400 leading-snug">
                        Zeichnen Sie Ihre eigene Layout-Skizze.
                      </span>
                    </button>
                  </div>

                  <div className="pt-2 space-y-3">
                    <button
                      onClick={sendRedesignToAI}
                      disabled={isRedesignSending || !redesignExtractedText}
                      className="w-full py-3.5 bg-yellow-500 hover:bg-yellow-400 disabled:bg-slate-850 disabled:text-slate-600 text-slate-950 font-extrabold rounded-xl text-xs transition shadow-lg shadow-yellow-500/15 flex items-center justify-center gap-2 cursor-pointer"
                      id="btn-redesign-docs"
                    >
                      {isRedesignSending ? (
                        <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Wand2 className="h-3.5 w-3.5" />
                      )}
                      {isRedesignSending ? "Berechne harmonisches Design..." : "Harmonisches Design generieren"}
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          )}

        </section>

        {/* Output Area */}
        <section className="w-full space-y-6">

          {/* API Errors or Alerts */}
          {apiError && (
            <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-4 flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold text-red-300 block">Es ist ein Fehler aufgetreten:</span>
                <span className="text-xs text-red-400 leading-relaxed block mt-1">{apiError}</span>
              </div>
            </div>
          )}

          {/* Results Visualizer Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-lg font-bold tracking-tight text-white font-display flex items-center gap-2">
              Ausgabe & Ergebnisse
            </h2>
            <div className="flex items-center gap-1.5 text-slate-500 text-xs">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              Lokal de-maskiert
            </div>
          </div>

          {/* Output Card */}
          <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-6 min-h-[500px] flex flex-col justify-between shadow-2xl relative overflow-hidden">
            
            {/* Top glassmorphic gradient */}
            <div className={`absolute top-0 right-0 w-[200px] h-[200px] ${
              activeMode === "ats" ? "bg-emerald-500/5" : activeMode === "redesign" ? "bg-yellow-500/5" : "bg-blue-500/5"
            } rounded-full filter blur-2xl pointer-events-none`}></div>

            {activeMode === "ats" ? (
              // Mode 1 Output: ATS Resume structuring
              <div className="space-y-6 flex-1 flex flex-col justify-between">
                {isAtsSending ? (
                  <InteractiveLoader mode="ats" />
                ) : !parsedResumeData ? (
                  <div className="h-full flex flex-col items-center justify-center text-center py-20 space-y-4 my-auto">
                    <div className="bg-slate-800/80 p-4 rounded-full border border-slate-700">
                      <FileCheck className="h-8 w-8 text-slate-400" />
                    </div>
                    <div>
                      <span className="text-sm font-bold text-slate-300 block">Bereit für den ATS-Check</span>
                      <span className="text-xs text-slate-500 max-w-sm block mt-1 leading-relaxed">
                        Laden Sie links Ihren Lebenslauf als PDF hoch, tragen Sie optional Ihren Namen ein und klicken Sie auf &quot;Anonymisierten Text an KI senden&quot;.
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Header info bar */}
                    <div className="bg-emerald-950/40 border border-emerald-500/20 rounded-xl p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                      <div>
                        <span className="text-xs text-emerald-400 font-semibold block uppercase tracking-wider">Erfolgreich strukturiert</span>
                        <h4 className="text-sm font-bold text-white mt-1">
                          {parsedResumeData.basics?.name === "[NAME_MASKED]" ? (manualNames.split(',')[0] || "De-maskierter Name") : parsedResumeData.basics?.name}
                        </h4>
                      </div>
                      
                      <button
                        onClick={generateAndDownloadATSResume}
                        className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg transition shadow-lg shadow-emerald-600/10 shrink-0"
                        id="btn-download-ats-pdf"
                      >
                        <Download className="h-3.5 w-3.5" />
                        ATS PDF herunterladen
                      </button>
                    </div>

                    {/* Explanatory banner */}
                    <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 flex items-start gap-2.5">
                      <Info className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        <strong>Wie funktioniert der Download?</strong> Wir nehmen Ihre originale PDF-Datei und betten im Hintergrund ein 100% crawlbares, strukturiertes Text-Layer ein. Menschliche Recruiter sehen Ihr exakt gestaltetes Original-Design, während Applicant Tracking Systeme (ATS) die optimierten Daten perfekt auslesen können!
                      </p>
                    </div>

                    {/* Extracted Structured Sections - 2 Columns */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                      
                      {/* Left Column: Contact details, Skills & Education */}
                      <div className="md:col-span-5 space-y-6">
                        
                        {/* Personal Basics */}
                        <div className="space-y-2">
                          <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 border-b border-slate-800 pb-1">
                            <User className="h-3 w-3 text-emerald-400" />
                            Kontakt-Details (Direkt bearbeitbar)
                          </h5>
                          <div className="space-y-2">
                            <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-[11px] space-y-1">
                              <span className="text-slate-500 font-medium block">Name:</span>
                              <input
                                type="text"
                                value={parsedResumeData.basics?.name || ""}
                                onChange={(e) => updateBasics("name", e.target.value)}
                                className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-slate-200 font-semibold focus:outline-none focus:border-emerald-500"
                              />
                            </div>
                            <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-[11px] space-y-1">
                              <span className="text-slate-500 font-medium block">E-Mail:</span>
                              <input
                                type="text"
                                value={parsedResumeData.basics?.email || ""}
                                onChange={(e) => updateBasics("email", e.target.value)}
                                className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-slate-200 font-semibold focus:outline-none focus:border-emerald-500"
                              />
                            </div>
                            <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-[11px] space-y-1">
                              <span className="text-slate-500 font-medium block">Telefon:</span>
                              <input
                                type="text"
                                value={parsedResumeData.basics?.phone || ""}
                                onChange={(e) => updateBasics("phone", e.target.value)}
                                className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-slate-200 font-semibold focus:outline-none focus:border-emerald-500"
                              />
                            </div>
                            <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-[11px] space-y-1">
                              <span className="text-slate-500 font-medium block">Adresse:</span>
                              <input
                                type="text"
                                value={parsedResumeData.basics?.address || ""}
                                onChange={(e) => updateBasics("address", e.target.value)}
                                className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-slate-200 font-semibold focus:outline-none focus:border-emerald-500"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Skills List */}
                        <div className="space-y-2">
                          <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 border-b border-slate-800 pb-1">
                            <Layers className="h-3 w-3 text-emerald-400" />
                            Fähigkeiten / Hard Skills (Kommagetrennt)
                          </h5>
                          <div className="space-y-2">
                            <textarea
                              value={(parsedResumeData.skills || []).join(", ")}
                              onChange={(e) => handleSkillsChange(e.target.value)}
                              rows={2}
                              className="w-full text-xs bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-emerald-500 font-mono"
                              placeholder="z.B. React, TypeScript, Node.js"
                            />
                            <div className="flex flex-wrap gap-1 pt-1">
                              {(parsedResumeData.skills || []).map((s: string, index: number) => (
                                <span key={index} className="text-[9px] font-mono bg-slate-850 text-slate-400 px-2 py-0.5 rounded border border-slate-800">
                                  {s}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Education / Ausbildung */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between border-b border-slate-800 pb-1">
                            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                              <Layers className="h-3 w-3 text-emerald-400" />
                              Schule & Ausbildung
                            </h5>
                            <button
                              type="button"
                              onClick={addEducationEntry}
                              className="text-[10px] text-emerald-400 hover:text-emerald-300 font-bold animate-pulse"
                            >
                              + Hinzufügen
                            </button>
                          </div>
                          
                          <div className="space-y-3">
                            {parsedResumeData.education && parsedResumeData.education.length > 0 ? (
                              parsedResumeData.education.map((edu: any, index: number) => (
                                <div key={index} className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2 text-[11px] relative">
                                  <button
                                    type="button"
                                    onClick={() => deleteEducationEntry(index)}
                                    className="absolute right-2 top-2 text-slate-500 hover:text-red-400 transition"
                                    title="Eintrag löschen"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </button>
                                  
                                  <div className="space-y-1.5 pr-6">
                                    <div>
                                      <span className="text-[10px] text-slate-500">Titel / Abschluss:</span>
                                      <input
                                        type="text"
                                        value={edu.title || ""}
                                        onChange={(e) => updateEducation(index, "title", e.target.value)}
                                        className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-slate-200 font-bold focus:outline-none focus:border-emerald-500"
                                      />
                                    </div>
                                    <div>
                                      <span className="text-[10px] text-slate-500">Institution:</span>
                                      <input
                                        type="text"
                                        value={edu.institution || ""}
                                        onChange={(e) => updateEducation(index, "institution", e.target.value)}
                                        className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-slate-300 focus:outline-none focus:border-emerald-500"
                                      />
                                    </div>
                                    <div>
                                      <span className="text-[10px] text-slate-500">Zeitraum / Period:</span>
                                      <input
                                        type="text"
                                        value={edu.period || ""}
                                        onChange={(e) => updateEducation(index, "period", e.target.value)}
                                        className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-slate-300 font-mono focus:outline-none focus:border-emerald-500"
                                      />
                                    </div>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <div className="text-center py-4 text-xs text-slate-500 bg-slate-950/40 rounded-xl border border-slate-800/50">
                                Keine Bildungsdaten vorhanden. Klicken Sie auf + Hinzufügen.
                              </div>
                            )}
                          </div>
                        </div>

                      </div>

                      {/* Right Column: Work Experience */}
                      <div className="md:col-span-7 space-y-6">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between border-b border-slate-800 pb-1">
                            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                              <Briefcase className="h-3 w-3 text-emerald-400" />
                              Arbeitsstellen & Werdegang
                            </h5>
                          </div>
                          
                          <div className="space-y-4">
                            {parsedResumeData.work && parsedResumeData.work.length > 0 ? (
                              parsedResumeData.work.map((job: any, index: number) => (
                                <div key={index} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3 relative text-xs">
                                  <button
                                    type="button"
                                    onClick={() => deleteWorkEntry(index)}
                                    className="absolute right-3 top-3 text-slate-500 hover:text-red-400 transition"
                                    title="Stelle löschen"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                  
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pr-6">
                                    <div>
                                      <span className="text-[10px] text-slate-500 block mb-1">Rolle / Position:</span>
                                      <input
                                        type="text"
                                        value={job.position || ""}
                                        onChange={(e) => updateWork(index, "position", e.target.value)}
                                        className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1 text-slate-200 font-bold focus:outline-none focus:border-emerald-500"
                                      />
                                    </div>
                                    <div>
                                      <span className="text-[10px] text-slate-500 block mb-1">Unternehmen / Organisation:</span>
                                      <input
                                        type="text"
                                        value={job.name || ""}
                                        onChange={(e) => updateWork(index, "name", e.target.value)}
                                        className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1 text-slate-200 font-medium focus:outline-none focus:border-emerald-500"
                                      />
                                    </div>
                                    <div>
                                      <span className="text-[10px] text-slate-500 block mb-1">Startdatum:</span>
                                      <input
                                        type="text"
                                        value={job.startDate || ""}
                                        onChange={(e) => updateWork(index, "startDate", e.target.value)}
                                        className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1 text-slate-300 font-mono focus:outline-none focus:border-emerald-500"
                                      />
                                    </div>
                                    <div>
                                      <span className="text-[10px] text-slate-500 block mb-1">Enddatum:</span>
                                      <input
                                        type="text"
                                        value={job.endDate || ""}
                                        onChange={(e) => updateWork(index, "endDate", e.target.value)}
                                        className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1 text-slate-300 font-mono focus:outline-none focus:border-emerald-500"
                                      />
                                    </div>
                                  </div>

                                  <div>
                                    <span className="text-[10px] text-slate-500 block mb-1">Aufgaben &amp; Meilensteine (Ein Punkt pro Zeile):</span>
                                    <textarea
                                      value={(job.highlights || []).join("\n")}
                                      onChange={(e) => handleWorkHighlightsTextareaChange(index, e.target.value)}
                                      rows={3}
                                      className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-slate-300 text-xs focus:outline-none focus:border-emerald-500 font-sans"
                                      placeholder="Erfolge, Tätigkeiten und Errungenschaften..."
                                    />
                                  </div>
                                </div>
                              ))
                            ) : (
                              <div className="text-center py-6 text-xs text-slate-500 bg-slate-950/40 rounded-xl border border-slate-800/50">
                                Keine Arbeitserfahrung erfasst. Klicken Sie auf + Stelle hinzufügen.
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                    </div>

                  </div>
                )}
              </div>
            ) : activeMode === "motivation" ? (
              // Mode 2 Output: Motivationsschreiben Letter text
              <div className="space-y-6 flex-1 flex flex-col justify-between">
                {isMatchSending ? (
                  <InteractiveLoader mode="motivation" />
                ) : !generatedMatchingResult ? (
                  <div className="h-full flex flex-col items-center justify-center text-center py-20 space-y-4 my-auto">
                    <div className="bg-slate-800/80 p-4 rounded-full border border-slate-700">
                      <Briefcase className="h-8 w-8 text-slate-400" />
                    </div>
                    <div>
                      <span className="text-sm font-bold text-slate-300 block">Bereit für den Motivationsschreiben-Abgleich</span>
                      <span className="text-xs text-slate-500 max-w-sm block mt-1 leading-relaxed">
                        Laden Sie links Lebenslauf & Stellen-PDF hoch, tragen Sie Ihren Namen zur De-Maskierung ein und klicken Sie auf Generieren.
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="border-b border-slate-800 pb-2">
                      <div>
                        <span className="text-xs text-blue-400 font-semibold block uppercase tracking-wider">GENERIERTER ENTWURF</span>
                        <h4 className="text-sm font-bold text-white mt-0.5">Individuelles Anschreiben</h4>
                      </div>
                    </div>

                    {/* Visualization */}
                    {generatedMatchingResult && (
                      <div className="h-64 w-full bg-slate-950/50 rounded-xl border border-slate-800 p-2">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={(() => {
                            try {
                              const cleaned = generatedMatchingResult.replace(/```json\s*/, '').replace(/\s*```$/, '');
                              const data = JSON.parse(cleaned);
                              return [
                                { name: 'Skills', value: data.details?.skills || 0 },
                                { name: 'Erfahrung', value: data.details?.experience || 0 },
                                { name: 'Ausbildung', value: data.details?.education || 0 },
                              ];
                            } catch { return []; }
                          })()}>
                            <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis domain={[0, 100]} hide />
                            <Tooltip cursor={{fill: '#1e293b'}} contentStyle={{backgroundColor: '#0f172a', borderColor: '#334155'}} />
                            <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    )}

                    <div className="bg-slate-900 p-8 text-slate-200 font-serif min-h-[500px] rounded-lg border border-slate-800 space-y-4">
                      {structuredLetter && (
                        <>
                          {/* 1. Briefkopf */}
                          <div className="space-y-4 bg-slate-950/40 p-4 sm:p-6 rounded-xl border border-slate-800/60">
                            <div className="flex items-center gap-2 pb-2 border-b border-slate-850 font-sans">
                              <MapPin className="h-4 w-4 text-blue-500" />
                              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">1. Briefkopf (Absenderadresse, Empfängeradresse, Datum)</h4>
                            </div>
                            
                            <div className="flex flex-col md:flex-row justify-between gap-4">
                              <div className="w-full">
                                <label className="block text-[10px] text-slate-500 font-sans mb-1 uppercase tracking-wider">Absenderadresse</label>
                                <textarea
                                    value={structuredLetter.senderAddress || ''}
                                    onChange={(e) => setStructuredLetter({...structuredLetter, senderAddress: e.target.value})}
                                    className="w-full bg-slate-950 p-3 rounded-lg text-xs border border-slate-800 font-serif focus:outline-none focus:border-blue-500 transition"
                                    rows={4}
                                    placeholder="Name&#10;Straße Hausnummer&#10;PLZ Ort&#10;E-Mail / Telefon"
                                />
                              </div>
                              <div className="w-full">
                                <label className="block text-[10px] text-slate-500 font-sans mb-1 uppercase tracking-wider text-right">Empfängeradresse</label>
                                <textarea
                                    value={structuredLetter.recipientAddress || ''}
                                    onChange={(e) => setStructuredLetter({...structuredLetter, recipientAddress: e.target.value})}
                                    className="w-full bg-slate-950 p-3 rounded-lg text-xs text-right border border-slate-800 font-serif focus:outline-none focus:border-blue-500 transition"
                                    rows={4}
                                    placeholder="Firmenname&#10;z. Hd. Ansprechpartner&#10;Straße Hausnummer&#10;PLZ Ort"
                                />
                              </div>
                            </div>
                            
                            <div>
                              <label className="block text-[10px] text-slate-500 font-sans mb-1 uppercase tracking-wider text-right">Datum</label>
                              <input 
                                type="text" 
                                value={structuredLetter.date || ''} 
                                onChange={(e) => setStructuredLetter({...structuredLetter, date: e.target.value})} 
                                className="w-full bg-slate-950 p-2.5 rounded-lg text-xs text-right border border-slate-800 font-serif focus:outline-none focus:border-blue-500 transition" 
                              />
                            </div>
                          </div>

                          {/* 2. Betreff */}
                          <div className="space-y-4 bg-slate-950/40 p-4 sm:p-6 rounded-xl border border-slate-800/60">
                            <div className="flex items-center gap-2 pb-2 border-b border-slate-850 font-sans">
                              <FileText className="h-4 w-4 text-blue-500" />
                              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">2. Betreff</h4>
                            </div>
                            
                            <div>
                              <label className="block text-[10px] text-slate-500 font-sans mb-1 uppercase tracking-wider">Betreffzeile</label>
                              <input 
                                type="text" 
                                value={structuredLetter.subject || ''} 
                                onChange={(e) => setStructuredLetter({...structuredLetter, subject: e.target.value})} 
                                className="w-full bg-slate-950 p-2.5 rounded-lg text-xs font-bold border border-slate-850 font-serif focus:outline-none focus:border-blue-500 transition" 
                                placeholder="Bewerbung als..."
                              />
                            </div>
                          </div>

                          {/* 3. Anschreiben */}
                          <div className="space-y-4 bg-slate-950/40 p-4 sm:p-6 rounded-xl border border-slate-800/60">
                            <div className="flex items-center gap-2 pb-2 border-b border-slate-850 font-sans">
                              <Mail className="h-4 w-4 text-blue-500" />
                              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">3. Anschreiben (Anrede, Einleitung, Hauptteil, Schlussteil, Unterschrift)</h4>
                            </div>
                            
                            <div>
                              <label className="block text-[10px] text-slate-500 font-sans mb-1 uppercase tracking-wider">Anrede</label>
                              <input 
                                type="text" 
                                value={structuredLetter.salutation || ''} 
                                onChange={(e) => setStructuredLetter({...structuredLetter, salutation: e.target.value})} 
                                className="w-full bg-slate-950 p-2.5 rounded-lg text-xs border border-slate-800 font-serif focus:outline-none focus:border-blue-500 transition" 
                              />
                            </div>

                            <div>
                              <label className="block text-[10px] text-slate-500 font-sans mb-1 uppercase tracking-wider">Einleitung</label>
                              <textarea 
                                value={structuredLetter.introduction || ''} 
                                onChange={(e) => setStructuredLetter({...structuredLetter, introduction: e.target.value})} 
                                className="w-full bg-slate-950 p-3 rounded-lg text-xs border border-slate-800 font-serif focus:outline-none focus:border-blue-500 transition" 
                                rows={3} 
                              />
                            </div>

                            <div>
                              <label className="block text-[10px] text-slate-500 font-sans mb-1 uppercase tracking-wider">Hauptteil</label>
                              <textarea 
                                value={structuredLetter.mainBody || ''} 
                                onChange={(e) => setStructuredLetter({...structuredLetter, mainBody: e.target.value})} 
                                className="w-full bg-slate-950 p-3 rounded-lg text-xs min-h-[150px] border border-slate-800 font-serif focus:outline-none focus:border-blue-500 transition" 
                              />
                            </div>

                            <div>
                              <label className="block text-[10px] text-slate-500 font-sans mb-1 uppercase tracking-wider">Schlussteil</label>
                              <textarea 
                                value={structuredLetter.closing || ''} 
                                onChange={(e) => setStructuredLetter({...structuredLetter, closing: e.target.value})} 
                                className="w-full bg-slate-950 p-3 rounded-lg text-xs border border-slate-800 font-serif focus:outline-none focus:border-blue-500 transition" 
                                rows={3} 
                              />
                            </div>

                            <div>
                              <label className="block text-[10px] text-slate-500 font-sans mb-1 uppercase tracking-wider">Unterschrift (Name)</label>
                              <input 
                                type="text" 
                                value={structuredLetter.signature || ''} 
                                onChange={(e) => setStructuredLetter({...structuredLetter, signature: e.target.value})} 
                                className="w-full bg-slate-950 p-2.5 rounded-lg text-xs border border-slate-800 font-serif focus:outline-none focus:border-blue-500 transition" 
                              />
                            </div>
                          </div>

                          <div className="flex flex-col sm:flex-row gap-4 mt-4 pt-4 border-t border-slate-800">
                            <button
                              onClick={() => {
                                const text = `${structuredLetter.senderAddress}\n\n${structuredLetter.recipientAddress}\n\n${structuredLetter.date}\n\n${structuredLetter.subject}\n\n${structuredLetter.salutation}\n\n${structuredLetter.introduction}\n\n${structuredLetter.mainBody}\n\n${structuredLetter.closing}\n\nMit freundlichen Grüßen\n\n${structuredLetter.signature}`;
                                navigator.clipboard.writeText(text);
                                alert("Kopiert!");
                              }}
                              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-slate-800 hover:bg-slate-700 rounded-lg text-white font-bold text-xs"
                            >
                              <Copy className="h-4 w-4" />
                              Kopieren
                            </button>
                          </div>
                        </>
                      )}
                    </div>

                    {/* HTML Code Editor and Printing fallback option */}
                    {generatedLetterHtml && (
                      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                              <span className="text-xs text-emerald-400 font-semibold uppercase tracking-wider">HTML-CODE DES ANSCHREIBENS (DRUCK-FALLBACK)</span>
                            </div>
                            <span className="text-xs text-slate-400 block mt-1">
                              Sie können diesen HTML/CSS-Code hier direkt anpassen und über den Button rechts drucken oder als PDF sichern.
                            </span>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(generatedLetterHtml);
                                setCopiedSection("html_code");
                                setTimeout(() => setCopiedSection(null), 2000);
                              }}
                              className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition"
                            >
                              {copiedSection === "html_code" ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                              {copiedSection === "html_code" ? "Kopiert" : "Code kopieren"}
                            </button>
                            <button
                              onClick={() => printLetterHtml(generatedLetterHtml)}
                              className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg transition shadow-lg shadow-blue-500/20"
                            >
                              <Printer className="h-4 w-4" />
                              Druckansicht öffnen
                            </button>
                          </div>
                        </div>
                        <textarea
                          value={generatedLetterHtml}
                          onChange={(e) => setGeneratedLetterHtml(e.target.value)}
                          className="w-full h-80 bg-slate-950 border border-slate-800 rounded-lg p-3 text-slate-300 text-xs focus:outline-none focus:border-blue-500 font-mono leading-relaxed"
                          placeholder="HTML-Code des Anschreibens hier eingeben oder bearbeiten..."
                        />

                        {/* Wortzählung & Lesbarkeits-Statistik (Flesch-Reading-Ease) */}
                        <div className="space-y-3 mt-4 pt-4 border-t border-slate-800">
                          <h5 className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Echtzeit-Textanalyse & Lesbarkeit (Flesch-Sinde)</h5>
                          
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950 p-4 rounded-xl border border-slate-850">
                            {/* Flesch Score */}
                            <div className="flex flex-col justify-between">
                              <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Flesch-Wert</span>
                              <div className="flex items-baseline gap-1 mt-1">
                                <span className="text-xl font-mono font-bold text-blue-400">{letterStats.score}</span>
                                <span className="text-xs text-slate-500">/100</span>
                              </div>
                              <span className={`text-[9px] font-semibold mt-1.5 px-2 py-0.5 rounded border inline-block text-center shrink-0 leading-tight ${letterStats.colorClass}`}>
                                {letterStats.level}
                              </span>
                            </div>

                            {/* Word Count */}
                            <div className="flex flex-col justify-between">
                              <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Wortanzahl</span>
                              <span className="text-xl font-mono font-bold text-white mt-1">{letterStats.words}</span>
                              <span className="text-[10px] font-semibold mt-1.5">
                                {letterStats.words < 200 ? (
                                  <span className="text-yellow-400">⚠️ Sehr kurz (Ziel: 250-400)</span>
                                ) : letterStats.words > 450 ? (
                                  <span className="text-yellow-400">⚠️ Sehr lang (Ziel: 250-400)</span>
                                ) : (
                                  <span className="text-emerald-400">✅ Perfekte Länge</span>
                                )}
                              </span>
                            </div>

                            {/* Sentence Count */}
                            <div className="flex flex-col justify-between">
                              <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Sätze</span>
                              <span className="text-xl font-mono font-bold text-white mt-1">{letterStats.sentences}</span>
                              <span className="text-[10px] text-slate-500 mt-1.5 font-medium leading-tight">
                                Gesamtzahl der Sätze im Text.
                              </span>
                            </div>

                            {/* Avg Sentence Length */}
                            <div className="flex flex-col justify-between">
                              <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Wörter pro Satz</span>
                              <span className="text-xl font-mono font-bold text-white mt-1">{letterStats.asl}</span>
                              <span className="text-[10px] font-semibold mt-1.5">
                                {letterStats.asl > 18 ? (
                                  <span className="text-yellow-400">⚠️ Lange Sätze (Ziel &lt; 18)</span>
                                ) : (
                                  <span className="text-emerald-400">✅ Gut lesbar (flüssig)</span>
                                )}
                              </span>
                            </div>
                          </div>

                          <div className="text-[10px] text-slate-400 leading-relaxed bg-slate-950/40 p-3 rounded-lg border border-slate-850">
                            ℹ️ <strong>Erklärung des Flesch-Werts (Amstad-Index):</strong> {letterStats.description} Kürzere, prägnantere Sätze und allgemein verständlichere Begriffe erhöhen den Score. Das erleichtert Personalentscheidern und ATS-Systemen das schnelle Erfassen Ihres Anschreibens ungemein!
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Explanatory Footer for Anonymity */}
                    <div className="bg-blue-950/20 border border-blue-500/20 rounded-xl p-3 flex items-start gap-2">
                      <ShieldCheck className="h-4.5 w-4.5 text-emerald-400 shrink-0 mt-0.5" />
                      <p className="text-[10px] text-slate-400 leading-relaxed">
                        <strong>Echtzeit-Demaskierung erfolgreich:</strong> Alle Platzhalter wie <code>[NAME_MASKED]</code> wurden rein lokal im Browser mit Ihren echten Daten (<strong>{manualNames.split(',')[0] || "Kein Name eingetragen"}</strong>) befüllt. Die KI hat nur den anonymen Payload gesehen.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              // Mode 3 Output: Gelb-Schwarz-Redesign Output
              <div className="space-y-6 flex-1 flex flex-col justify-between">
                {isRedesignSending ? (
                  <InteractiveLoader mode="redesign" />
                ) : (
                  <div className="space-y-6">
                    {/* 1. TOP: Manual Style Skizze (DIN A4 Referenz) */}
                    {isManualSketchOpen && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-950/40 rounded-2xl border border-slate-800 p-4 animate-in fade-in duration-300">
                        {/* Left Column: Sketchboard DIN A4 Canvas */}
                        <div className="space-y-2 flex flex-col">
                          <span className="text-[10px] text-slate-500 font-sans uppercase tracking-wider block">Style-Skizze (A4 Referenz-Layout):</span>
                          <div className="bg-slate-950/80 rounded-xl border border-slate-800 p-3 shadow-inner flex flex-col items-center justify-center">
                            {/* Dot-Grid background container for DIN A4 ratio */}
                            <div 
                              className="relative border border-slate-850 rounded-lg bg-white overflow-hidden w-full max-w-[400px]" 
                              style={{ 
                                aspectRatio: "1 / 1.414", 
                                backgroundImage: "radial-gradient(#cbd5e1 1.5px, transparent 1.5px)", 
                                backgroundSize: "14px 14px" 
                              }}
                            >
                              <canvas
                                ref={sketchCanvasRef}
                                width={600}
                                height={848}
                                onMouseDown={startDrawingSketch}
                                onMouseMove={drawSketch}
                                onMouseUp={stopDrawingSketch}
                                onMouseLeave={stopDrawingSketch}
                                onTouchStart={startDrawingSketch}
                                onTouchMove={drawSketch}
                                onTouchEnd={stopDrawingSketch}
                                className="absolute inset-0 w-full h-full cursor-crosshair touch-none"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Right Column: Sketchboard Controls & Color legend */}
                        <div className="bg-slate-950/80 rounded-xl border border-slate-800 p-4 flex flex-col justify-between">
                          <div className="space-y-4">
                            <div>
                              <span className="text-xs text-yellow-400 font-bold uppercase tracking-wider block">Skizzen Werkzeuge & Optionen</span>
                              <span className="text-[10px] text-slate-400 mt-0.5 block">Farben, Stifte und KI-Anweisungen</span>
                            </div>
                            
                            <div className="flex flex-col gap-3">
                              <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block border-b border-slate-800 pb-1">KI Farbbedeutung / Legende:</span>
                              <div className="grid grid-cols-2 gap-1.5 text-[9px] font-bold">
                                <button
                                  type="button"
                                  onClick={() => setSketchColor("#2563EB")}
                                  className={`p-2 rounded-lg border text-left flex items-center gap-2 transition ${sketchColor === "#2563EB" ? "bg-blue-600/20 border-blue-500 text-blue-300" : "bg-slate-900 border-slate-850 text-slate-400"}`}
                                >
                                  <span className="w-3 h-3 rounded-full bg-blue-600 block shrink-0" />
                                  Blau: Kontaktdaten
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setSketchColor("#FACC15")}
                                  className={`p-2 rounded-lg border text-left flex items-center gap-2 transition ${sketchColor === "#FACC15" ? "bg-yellow-500/25 border-yellow-500 text-yellow-350" : "bg-slate-900 border-slate-850 text-slate-400"}`}
                                >
                                  <span className="w-3 h-3 rounded-full bg-yellow-400 block shrink-0" />
                                  Gelb: Fähigkeiten
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setSketchColor("#EF4444")}
                                  className={`p-2 rounded-lg border text-left flex items-center gap-2 transition ${sketchColor === "#EF4444" ? "bg-red-500/20 border-red-500 text-red-300" : "bg-slate-900 border-slate-850 text-slate-400"}`}
                                >
                                  <span className="w-3 h-3 rounded-full bg-red-500 block shrink-0" />
                                  Rot: Erfahrung
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setSketchColor("#000000")}
                                  className={`p-2 rounded-lg border text-left flex items-center gap-2 transition ${sketchColor === "#000000" ? "bg-slate-800 border-slate-650 text-white" : "bg-slate-900 border-slate-850 text-slate-400"}`}
                                >
                                  <span className="w-3 h-3 rounded-full bg-black border border-slate-600 block shrink-0" />
                                  Schwarz: Foto/Bild
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setSketchColor("#22C55E")}
                                  className={`p-2 rounded-lg border text-left flex items-center gap-2 transition ${sketchColor === "#22C55E" ? "bg-green-500/20 border-green-500 text-green-300" : "bg-slate-900 border-slate-850 text-slate-400"}`}
                                >
                                  <span className="w-3 h-3 rounded-full bg-green-500 block shrink-0" />
                                  Grün: Ausbildung
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setSketchColor("#A855F7")}
                                  className={`p-2 rounded-lg border text-left flex items-center gap-2 transition ${sketchColor === "#A855F7" ? "bg-purple-500/20 border-purple-500 text-purple-300" : "bg-slate-900 border-slate-850 text-slate-400"}`}
                                >
                                  <span className="w-3 h-3 rounded-full bg-purple-500 block shrink-0" />
                                  Lila: Style-Aufteilung
                                </button>
                              </div>

                              {/* Action Buttons */}
                              <div className="flex justify-between items-center gap-2 pt-1">
                                <button
                                  type="button"
                                  onClick={() => setSketchColor("eraser")}
                                  className={`px-2.5 py-1 text-[9px] font-extrabold rounded-lg border transition ${sketchColor === "eraser" ? "bg-purple-600/30 border-purple-500 text-purple-300" : "bg-slate-900 border-slate-850 text-slate-400"}`}
                                >
                                  🧹 Radierer
                                </button>
                                <button
                                  type="button"
                                  onClick={clearSketchCanvas}
                                  className="px-2.5 py-1 text-[9px] bg-slate-900 hover:bg-slate-850 text-slate-300 font-extrabold rounded-lg border border-slate-800 transition"
                                >
                                  Leeren
                                </button>
                              </div>

                              {/* Brush size choice */}
                              <div className="flex items-center justify-between text-[9px] font-medium pt-1">
                                <span className="text-slate-400">Pinselstärke:</span>
                                <div className="flex gap-1.5">
                                  {[6, 12, 24].map((size) => (
                                    <button
                                      key={size}
                                      type="button"
                                      onClick={() => setSketchBrushSize(size)}
                                      className={`px-2 py-0.5 rounded text-[8px] font-bold ${sketchBrushSize === size ? "bg-yellow-500 text-slate-950 font-extrabold" : "bg-slate-900 text-slate-400 hover:text-slate-200"}`}
                                    >
                                      {size === 6 ? "Dünn" : size === 12 ? "Mittel" : "Dick"}
                                    </button>
                                  ))}
                                </div>
                              </div>

                              {/* AI Layout use checkbox */}
                              <label className="flex items-center gap-2 cursor-pointer pt-2 border-t border-slate-850/60 select-none">
                                <input
                                  type="checkbox"
                                  checked={useSketchInAi}
                                  onChange={(e) => setUseSketchInAi(e.target.checked)}
                                  className="rounded border-slate-800 bg-slate-950 text-yellow-500 focus:ring-0 h-3.5 w-3.5"
                                />
                                <span className="text-[10px] text-slate-300 font-bold">
                                  Layoutvorlage für KI aktivieren
                                </span>
                              </label>

                              {/* Advanced Options for Sketch */}
                              {useSketchInAi && (
                                <div className="space-y-3 pt-2 border-t border-slate-850/60">
                                  {/* Sketch Mode Toggle */}
                                  <div className="flex flex-col gap-1.5">
                                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide block">Zeichenmodus / KI-Interpretation:</span>
                                    <div className="flex gap-2">
                                      <button
                                        type="button"
                                        onClick={() => setSketchMode("grid")}
                                        className={`flex-1 py-1 px-2 rounded-lg text-[9px] font-bold border transition ${sketchMode === "grid" ? "bg-emerald-600/20 border-emerald-500 text-emerald-400" : "bg-slate-900 border-slate-850 text-slate-400 hover:text-slate-200"}`}
                                      >
                                        Raster / Linear
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => setSketchMode("freehand")}
                                        className={`flex-1 py-1 px-2 rounded-lg text-[9px] font-bold border transition ${sketchMode === "freehand" ? "bg-amber-600/20 border-amber-500 text-amber-400" : "bg-slate-900 border-slate-850 text-slate-400 hover:text-slate-200"}`}
                                      >
                                        Freihand (1:1 Skizze folgen)
                                      </button>
                                    </div>
                                  </div>

                                  {/* Advanced Custom Prompt Input */}
                                  <div className="flex flex-col gap-1.5">
                                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide block flex items-center gap-1"><Settings className="h-3 w-3" /> Advanced: Eigene Anweisung (Style)</span>
                                    <textarea
                                      value={sketchPrompt}
                                      onChange={(e) => setSketchPrompt(e.target.value)}
                                      placeholder="Bsp.: Die Style Aufteilung sind Äste von Pflanzen mit Blättern am Ende..."
                                      className="w-full h-16 rounded-lg bg-slate-900 border border-slate-800 text-[10px] text-slate-300 placeholder:text-slate-600 p-2 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-colors resize-none"
                                    />
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* 2. MIDDLE: Toggle (Lebenslauf / Motivationsschreiben) & Action-Buttons (UNTER DER SKIZZE & ÜBER DER DOKUMENTENVORSCHAU) */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-y border-slate-800/80 py-3">
                      {/* Doc Switcher Toggle */}
                      <div className="flex gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800/85 shrink-0">
                        <button
                          type="button"
                          onClick={() => setRedesignSelectedDoc("resume")}
                          className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition flex items-center gap-1.5 ${
                            redesignSelectedDoc === "resume"
                              ? "bg-yellow-500 text-slate-950 shadow-sm"
                              : "text-slate-400 hover:text-slate-200"
                          }`}
                        >
                          <FileText className="h-3.5 w-3.5" />
                          Lebenslauf (CV)
                        </button>
                        <button
                          type="button"
                          onClick={() => setRedesignSelectedDoc("cover_letter")}
                          className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition flex items-center gap-1.5 ${
                            redesignSelectedDoc === "cover_letter"
                              ? "bg-yellow-500 text-slate-950 shadow-sm"
                              : "text-slate-400 hover:text-slate-200"
                          }`}
                        >
                          <Briefcase className="h-3.5 w-3.5" />
                          Motivationsschreiben
                        </button>
                      </div>

                      {/* Controls Row */}
                      <div className="flex flex-wrap items-center gap-2">
                        {/* Manual Style Skizze Button Toggle */}
                        <button
                          type="button"
                          onClick={() => setIsManualSketchOpen(!isManualSketchOpen)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition ${
                            isManualSketchOpen
                              ? "bg-blue-600/20 border-blue-500 text-blue-400"
                              : "bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200"
                          }`}
                          title="Manuelle A4-Design-Skizze für die KI zeichnen"
                        >
                          <Edit3 className="h-3.5 w-3.5 text-blue-400" />
                          {isManualSketchOpen ? "Skizze geöffnet" : "Manual Style-Skizze"}
                        </button>

                        {/* Inline Edit Toggle */}
                        {redesignResult && (
                          <button
                            type="button"
                            onClick={() => setIsEditingEnabled(!isEditingEnabled)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition ${
                              isEditingEnabled
                                ? "bg-yellow-500/20 border-yellow-500 text-yellow-400"
                                : "bg-slate-900 border-slate-850 text-slate-400 hover:text-slate-200"
                            }`}
                            title="Texte direkt im Dokument anklicken und editieren"
                          >
                            <Edit3 className="h-3.5 w-3.5" />
                            {isEditingEnabled ? "Editieren aktiv" : "Direkt bearbeiten"}
                          </button>
                        )}

                        {/* Fullscreen Toggle */}
                        {redesignResult && (
                          <button
                            type="button"
                            onClick={() => setIsRedesignFullscreen(true)}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-850 text-slate-300 text-xs font-bold rounded-lg border border-slate-800 transition"
                            title="Layout in Vollbild prüfen"
                          >
                            <Maximize2 className="h-3.5 w-3.5 text-yellow-500" />
                            Vollbild
                          </button>
                        )}

                        {/* Download & Print Buttons */}
                        {redesignResult && (
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={downloadRedesignHtml}
                              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-bold rounded-lg transition shadow-md"
                              id="btn-download-redesign"
                            >
                              <Download className="h-3.5 w-3.5" />
                              HTML Code
                            </button>
                            <button
                              type="button"
                              onClick={printRedesignHtml}
                              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-yellow-500 hover:bg-yellow-400 text-slate-950 text-xs font-extrabold rounded-lg transition shadow-md shadow-yellow-500/10"
                              id="btn-print-redesign"
                            >
                              <Printer className="h-3.5 w-3.5" />
                              Drucken
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* 3. BOTTOM GRID: Dokumentenvorschau (Left) & Farbenrad / WCAG Panel (Right, nur auf Höhe der Dokumentenvorschau) */}
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
                      {/* Left Column: Live Document Preview */}
                      <div className={`${redesignResult ? "xl:col-span-2" : "xl:col-span-3"} space-y-2 flex flex-col`}>
                        <span className="text-[10px] text-slate-500 font-sans uppercase tracking-wider block">Dokumenten-Vorschau (A4 Vollansicht):</span>
                        
                        {!redesignResult ? (
                          <div className="bg-slate-950/80 rounded-xl border border-slate-800 p-8 flex flex-col items-center justify-center text-center shadow-inner min-h-[500px]">
                            <div className="bg-slate-800/80 p-4 rounded-full border border-slate-700 mb-4">
                              <Sparkles className="h-8 w-8 text-yellow-500 animate-pulse" />
                            </div>
                            <span className="text-sm font-bold text-slate-300 block">Bereit für Ihr Redesign</span>
                            <span className="text-xs text-slate-500 max-w-xs block mt-1.5 leading-relaxed">
                              {isManualSketchOpen ? "Zeichnen Sie Ihre gewünschte Layout-Skizze oben auf das DIN A4 Blatt und klicken Sie links auf 'Harmonisches Design generieren'." : "Laden Sie links Ihren Lebenslauf hoch, wählen Sie Ihre Farbpalette und klicken Sie auf 'Harmonisches Design generieren'."}
                            </span>
                          </div>
                        ) : (
                          <div className="bg-slate-950/80 rounded-xl border border-slate-800 p-2 overflow-hidden shadow-inner relative">
                            {isEditingEnabled && (
                              <div className="absolute top-4 right-4 bg-yellow-500/90 text-slate-950 text-[10px] font-extrabold px-3 py-1 rounded-full shadow-md pointer-events-none z-10 animate-pulse">
                                ✍️ Bearbeitungsmodus aktiv (Direkt in den Text klicken & losschreiben)
                              </div>
                            )}
                            <iframe
                              title="Redesign Live Preview"
                              ref={redesignIframeRef}
                              srcDoc={`
                                <!DOCTYPE html>
                                <html>
                                  <head>
                                    <meta charset="utf-8">
                                    <style>
                                      html, body { 
                                        margin: 0; 
                                        padding: 0; 
                                        overflow: hidden !important; 
                                        width: 100%;
                                        box-sizing: border-box;
                                      }
                                      ${redesignSelectedDoc === "resume" ? redesignResult?.[redesignSelectedStyle]?.resume?.css : redesignResult?.[redesignSelectedStyle]?.cover_letter?.css}
                                      /* Custom editable element styling so they don't stand out when printed */
                                      [contenteditable="true"] {
                                        outline: none !important;
                                      }
                                      [contenteditable="true"]:focus {
                                        outline: 1px dashed rgba(250, 204, 21, 0.5) !important;
                                        outline-offset: 2px;
                                      }
                                    </style>
                                  </head>
                                  <body ${isEditingEnabled ? 'contenteditable="true"' : ''}>
                                    ${redesignSelectedDoc === "resume" ? redesignResult?.[redesignSelectedStyle]?.resume?.html : redesignResult?.[redesignSelectedStyle]?.cover_letter?.html}
                                  </body>
                                </html>
                              `}
                              onLoad={handleIframeLoad}
                              scrolling="no"
                              className="w-full h-[920px] bg-white rounded-lg border border-slate-900 overflow-hidden"
                              sandbox="allow-scripts allow-same-origin"
                            />
                          </div>
                        )}
                      </div>

                      {/* Right Column: Interaktive Farbanpassung & WCAG 2.1 Kontrast-Prüfung Sidebar (Schmal, nur auf Höhe der Dokumentenvorschau) */}
                      {redesignResult && (
                        <div className="xl:col-span-1 space-y-4 flex flex-col justify-start">
                          {false ? (
                             <div className="bg-slate-950/80 rounded-xl border border-slate-800 p-4 space-y-4">
                                <div className="flex items-center justify-between border-b border-slate-900 pb-2">
                                  <div>
                                    <span className="text-xs text-yellow-400 font-bold uppercase tracking-wider block">Skizzen Werkzeuge & Optionen</span>
                                    <span className="text-[10px] text-slate-400 mt-0.5 block">Farben, Stifte und KI-Anweisungen</span>
                                  </div>
                                </div>
                                <div className="flex flex-col space-y-4">
                                  <div className="w-full max-w-[420px] flex flex-col gap-2 mt-2 bg-slate-950 border border-slate-900 p-3 rounded-xl">
                                    <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block border-b border-slate-800 pb-1">KI Farbbedeutung / Legende:</span>
                                    <div className="grid grid-cols-2 gap-1.5 text-[9px] font-bold">
                                      <button
                                        type="button"
                                        onClick={() => setSketchColor("#2563EB")}
                                        className={`p-2 rounded-lg border text-left flex items-center gap-2 transition ${sketchColor === "#2563EB" ? "bg-blue-600/20 border-blue-500 text-blue-300" : "bg-slate-900 border-slate-850 text-slate-400"}`}
                                      >
                                        <span className="w-3 h-3 rounded-full bg-blue-600 block shrink-0" />
                                        Blau: Kontaktdaten
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => setSketchColor("#FACC15")}
                                        className={`p-2 rounded-lg border text-left flex items-center gap-2 transition ${sketchColor === "#FACC15" ? "bg-yellow-500/25 border-yellow-500 text-yellow-350" : "bg-slate-900 border-slate-850 text-slate-400"}`}
                                      >
                                        <span className="w-3 h-3 rounded-full bg-yellow-400 block shrink-0" />
                                        Gelb: Fähigkeiten
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => setSketchColor("#EF4444")}
                                        className={`p-2 rounded-lg border text-left flex items-center gap-2 transition ${sketchColor === "#EF4444" ? "bg-red-500/20 border-red-500 text-red-300" : "bg-slate-900 border-slate-850 text-slate-400"}`}
                                      >
                                        <span className="w-3 h-3 rounded-full bg-red-500 block shrink-0" />
                                        Rot: Erfahrung
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => setSketchColor("#000000")}
                                        className={`p-2 rounded-lg border text-left flex items-center gap-2 transition ${sketchColor === "#000000" ? "bg-slate-800 border-slate-650 text-white" : "bg-slate-900 border-slate-850 text-slate-400"}`}
                                      >
                                        <span className="w-3 h-3 rounded-full bg-black border border-slate-600 block shrink-0" />
                                        Schwarz: Foto/Bild
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => setSketchColor("#22C55E")}
                                        className={`p-2 rounded-lg border text-left flex items-center gap-2 transition ${sketchColor === "#22C55E" ? "bg-green-500/20 border-green-500 text-green-300" : "bg-slate-900 border-slate-850 text-slate-400"}`}
                                      >
                                        <span className="w-3 h-3 rounded-full bg-green-500 block shrink-0" />
                                        Grün: Ausbildung
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => setSketchColor("#A855F7")}
                                        className={`p-2 rounded-lg border text-left flex items-center gap-2 transition ${sketchColor === "#A855F7" ? "bg-purple-500/20 border-purple-500 text-purple-300" : "bg-slate-900 border-slate-850 text-slate-400"}`}
                                      >
                                        <span className="w-3 h-3 rounded-full bg-purple-500 block shrink-0" />
                                        Lila: Style-Aufteilung
                                      </button>
                                    </div>
                                    {/* Action Buttons */}
                                    <div className="flex justify-between items-center gap-2 pt-1">
                                      <button
                                        type="button"
                                        onClick={() => setSketchColor("eraser")}
                                        className={`px-2.5 py-1 text-[9px] font-extrabold rounded-lg border transition ${sketchColor === "eraser" ? "bg-purple-600/30 border-purple-500 text-purple-300" : "bg-slate-900 border-slate-850 text-slate-400"}`}
                                      >
                                        🧹 Radierer
                                      </button>
                                      <button
                                        type="button"
                                        onClick={clearSketchCanvas}
                                        className="px-2.5 py-1 text-[9px] bg-slate-900 hover:bg-slate-850 text-slate-300 font-extrabold rounded-lg border border-slate-800 transition"
                                      >
                                        Leeren
                                      </button>
                                    </div>
                                    {/* Brush size choice */}
                                    <div className="flex items-center justify-between text-[9px] font-medium pt-1">
                                      <span className="text-slate-400">Pinselstärke:</span>
                                      <div className="flex gap-1.5">
                                        {[6, 12, 24].map((size) => (
                                          <button
                                            key={size}
                                            type="button"
                                            onClick={() => setSketchBrushSize(size)}
                                            className={`px-2 py-0.5 rounded text-[8px] font-bold ${sketchBrushSize === size ? "bg-yellow-500 text-slate-950 font-extrabold" : "bg-slate-900 text-slate-400 hover:text-slate-200"}`}
                                          >
                                            {size === 6 ? "Dünn" : size === 12 ? "Mittel" : "Dick"}
                                          </button>
                                        ))}
                                      </div>
                                    </div>
                                    {/* AI Layout use checkbox */}
                                    <label className="flex items-center gap-2 cursor-pointer pt-2 border-t border-slate-850/60 select-none">
                                      <input
                                        type="checkbox"
                                        checked={useSketchInAi}
                                        onChange={(e) => setUseSketchInAi(e.target.checked)}
                                        className="rounded border-slate-800 bg-slate-950 text-yellow-500 focus:ring-0 h-3.5 w-3.5"
                                      />
                                      <span className="text-[10px] text-slate-300 font-bold">
                                        Layoutvorlage für KI aktivieren
                                      </span>
                                    </label>
                                    {/* Advanced Options for Sketch */}
                                    {useSketchInAi && (
                                      <div className="space-y-3 pt-2 border-t border-slate-850/60">
                                        {/* Sketch Mode Toggle */}
                                        <div className="flex flex-col gap-1.5">
                                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide block">Zeichenmodus / KI-Interpretation:</span>
                                          <div className="flex gap-2">
                                            <button
                                              type="button"
                                              onClick={() => setSketchMode("grid")}
                                              className={`flex-1 py-1 px-2 rounded-lg text-[9px] font-bold border transition ${sketchMode === "grid" ? "bg-emerald-600/20 border-emerald-500 text-emerald-400" : "bg-slate-900 border-slate-850 text-slate-400 hover:text-slate-200"}`}
                                            >
                                              Raster / Linear
                                            </button>
                                            <button
                                              type="button"
                                              onClick={() => setSketchMode("freehand")}
                                              className={`flex-1 py-1 px-2 rounded-lg text-[9px] font-bold border transition ${sketchMode === "freehand" ? "bg-amber-600/20 border-amber-500 text-amber-400" : "bg-slate-900 border-slate-850 text-slate-400 hover:text-slate-200"}`}
                                            >
                                              Freihand (1:1 Skizze folgen)
                                            </button>
                                          </div>
                                        </div>
                                        {/* Advanced Custom Prompt Input */}
                                        <div className="flex flex-col gap-1.5">
                                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide block flex items-center gap-1"><Settings className="h-3 w-3" /> Advanced: Eigene Anweisung (Style)</span>
                                          <textarea
                                            value={sketchPrompt}
                                            onChange={(e) => setSketchPrompt(e.target.value)}
                                            placeholder="Bsp.: Die Style Aufteilung sind Äste von Pflanzen mit Blättern am Ende..."
                                            className="w-full h-16 rounded-lg bg-slate-900 border border-slate-800 text-[10px] text-slate-300 placeholder:text-slate-600 p-2 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-colors resize-none"
                                          />
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                             </div>
                          ) : (
                             <>
                          {/* Interaktive Farbanpassung & Designkontrollen */}
                          <div className="bg-slate-950/80 rounded-xl border border-slate-800 p-4 space-y-4">
                            <div className="flex items-center justify-between border-b border-slate-900 pb-2">
                              <div>
                                <span className="text-xs text-yellow-400 font-bold uppercase tracking-wider block">Interaktive Farbanpassung</span>
                                <span className="text-[10px] text-slate-400 mt-0.5 block">Farben & Layout direkt am Farbenrad anpassen</span>
                              </div>
                            </div>

                            <div className="flex flex-col space-y-6">
                              {/* LEFT: COLOR WHEEL */}
                              <div className="space-y-3">
                                <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">A. Farbenrad & Farbharmonie</span>
                                
                                <div className="bg-slate-950 border border-slate-900 rounded-xl p-3 flex flex-col items-center space-y-3 shadow-inner relative overflow-hidden">
                                  {true ? (
                                    <>

                                  <div 
                                    className="relative w-36 h-36 select-none touch-none cursor-crosshair opacity-100"
                                    onPointerDown={handlePointerDown}
                                    onPointerMove={handlePointerMove}
                                    onPointerUp={handlePointerUp}
                                  >
                                    <div 
                                      className="w-full h-full rounded-full border border-slate-800/80 shadow-lg flex items-center justify-center relative overflow-hidden"
                                      style={{
                                        background: "conic-gradient(from 0deg, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%)",
                                      }}
                                    >
                                      <div className="w-20 h-20 rounded-full bg-slate-950 border border-slate-900/80 shadow-inner flex flex-col items-center justify-center z-10 pointer-events-none">
                                        <span className="text-[8px] text-slate-500 font-sans uppercase tracking-widest font-extrabold">
                                          {redesignPalette === "split_complementary" ? "Split" : redesignPalette === "triadic" ? "Triade" : "Monochrom"}
                                        </span>
                                        <span className="text-xs font-extrabold font-mono text-yellow-400 mt-0.5">{redesignBaseHue}°</span>
                                      </div>
                                    </div>

                                    <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible z-20">
                                      {(() => {
                                        const getCoords = (hAngle: number) => {
                                          const mathAngle = hAngle - 90;
                                          const rad = (mathAngle * Math.PI) / 180;
                                          return {
                                            x: 72 + 54 * Math.cos(rad),
                                            y: 72 + 54 * Math.sin(rad)
                                          };
                                        };

                                        const pt1 = getCoords(redesignBaseHue);
                                        const pt2 = getCoords(redesignPalette === "split_complementary" ? (redesignBaseHue + 150) % 360 : redesignPalette === "triadic" ? (redesignBaseHue + 120) % 360 : redesignBaseHue);
                                        const pt3 = getCoords(redesignPalette === "split_complementary" ? (redesignBaseHue + 210) % 360 : redesignPalette === "triadic" ? (redesignBaseHue + 240) % 360 : redesignBaseHue);

                                        return (
                                          <>
                                            {redesignPalette === "monochromatic" ? (
                                              <line x1="72" y1="72" x2={pt1.x} y2={pt1.y} stroke={activeColors.primary} strokeWidth="2" strokeDasharray="3,3" />
                                            ) : (
                                              <polygon 
                                                points={`${pt1.x},${pt1.y} ${pt2.x},${pt2.y} ${pt3.x},${pt3.y}`} 
                                                fill={`${activeColors.primary}0B`} 
                                                stroke={activeColors.primary} 
                                                strokeWidth="2" 
                                                className="opacity-80"
                                              />
                                            )}

                                            <line x1="72" y1="72" x2={pt1.x} y2={pt1.y} stroke={activeColors.primary} strokeWidth="1.5" className="opacity-40" />
                                            {redesignPalette !== "monochromatic" && (
                                              <>
                                                <line x1="72" y1="72" x2={pt2.x} y2={pt2.y} stroke={activeColors.secondary} strokeWidth="1" className="opacity-30" />
                                                <line x1="72" y1="72" x2={pt3.x} y2={pt3.y} stroke={activeColors.accent} strokeWidth="1" className="opacity-30" />
                                              </>
                                            )}

                                            <circle cx={pt1.x} cy={pt1.y} r="7" fill={activeColors.primary} stroke="#ffffff" strokeWidth="1.5" />
                                            {redesignPalette !== "monochromatic" && (
                                              <circle cx={pt2.x} cy={pt2.y} r="5.5" fill={activeColors.secondary} stroke="#000000" strokeWidth="1" />
                                            )}
                                            {redesignPalette !== "monochromatic" && (
                                              <circle cx={pt3.x} cy={pt3.y} r="5.5" fill={activeColors.accent} stroke="#000000" strokeWidth="1" />
                                            )}
                                          </>
                                        );
                                      })()}
                                    </svg>
                                  </div>

                                                                      </>
                                  ) : (
                                    <div className="w-full space-y-2">
                                      <span className="text-[9px] text-slate-500 font-bold block text-center">Basisfarbe (Hue) auswählen: {redesignBaseHue}°</span>
                                      <input type="range" min="0" max="360" value={redesignBaseHue} onChange={(e) => setRedesignBaseHue(Number(e.target.value))} className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer" style={{ background: "linear-gradient(to right, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%)" }} />
                                    </div>
                                  )}

                                  <div className="w-full grid grid-cols-5 gap-1 pt-1.5 border-t border-slate-900">
                                    <div className="flex flex-col items-center">
                                      <div className="w-full h-6 rounded border border-slate-800 flex items-center justify-center font-mono text-[7px] text-white relative overflow-hidden" style={{ backgroundColor: activeColors.primary_light }}>
                                        <span className="mix-blend-difference font-bold pointer-events-none">{activeColors.primary_light}</span>
                                        <input type="color" value={activeColors.primary_light} onChange={(e) => setCustomColors(prev => ({ ...prev, primary_light: e.target.value }))} className="absolute inset-[-10px] opacity-0 cursor-pointer w-[200%] h-[200%]" />
                                      </div>
                                      <span className="text-[5.5px] text-slate-500 font-bold uppercase mt-0.5 text-center leading-none">Primär<br/>Hell</span>
                                    </div>
                                    <div className="flex flex-col items-center">
                                      <div className="w-full h-6 rounded border border-slate-800 flex items-center justify-center font-mono text-[7px] text-white relative overflow-hidden" style={{ backgroundColor: activeColors.primary_dark }}>
                                        <span className="mix-blend-difference font-bold pointer-events-none">{activeColors.primary_dark}</span>
                                        <input type="color" value={activeColors.primary_dark} onChange={(e) => setCustomColors(prev => ({ ...prev, primary_dark: e.target.value }))} className="absolute inset-[-10px] opacity-0 cursor-pointer w-[200%] h-[200%]" />
                                      </div>
                                      <span className="text-[5.5px] text-slate-500 font-bold uppercase mt-0.5 text-center leading-none">Primär<br/>Dunkel</span>
                                    </div>
                                    <div className="flex flex-col items-center">
                                      <div className="w-full h-6 rounded border border-slate-800 flex items-center justify-center font-mono text-[7px] text-white relative overflow-hidden" style={{ backgroundColor: activeColors.secondary_light }}>
                                        <span className="mix-blend-difference font-bold pointer-events-none">{activeColors.secondary_light}</span>
                                        <input type="color" value={activeColors.secondary_light} onChange={(e) => setCustomColors(prev => ({ ...prev, secondary_light: e.target.value }))} className="absolute inset-[-10px] opacity-0 cursor-pointer w-[200%] h-[200%]" />
                                      </div>
                                      <span className="text-[5.5px] text-slate-500 font-bold uppercase mt-0.5 text-center leading-none">Sekundär<br/>Hell</span>
                                    </div>
                                    <div className="flex flex-col items-center">
                                      <div className="w-full h-6 rounded border border-slate-800 flex items-center justify-center font-mono text-[7px] text-white relative overflow-hidden" style={{ backgroundColor: activeColors.secondary_dark }}>
                                        <span className="mix-blend-difference font-bold pointer-events-none">{activeColors.secondary_dark}</span>
                                        <input type="color" value={activeColors.secondary_dark} onChange={(e) => setCustomColors(prev => ({ ...prev, secondary_dark: e.target.value }))} className="absolute inset-[-10px] opacity-0 cursor-pointer w-[200%] h-[200%]" />
                                      </div>
                                      <span className="text-[5.5px] text-slate-500 font-bold uppercase mt-0.5 text-center leading-none">Sekundär<br/>Dunkel</span>
                                    </div>
                                    <div className="flex flex-col items-center">
                                      <div className="w-full h-6 rounded border border-slate-800 flex items-center justify-center font-mono text-[7px] text-white relative overflow-hidden" style={{ backgroundColor: activeColors.accent }}>
                                        <span className="mix-blend-difference font-bold pointer-events-none">{activeColors.accent}</span>
                                        <input type="color" value={activeColors.accent} onChange={(e) => setCustomColors(prev => ({ ...prev, accent: e.target.value }))} className="absolute inset-[-10px] opacity-0 cursor-pointer w-[200%] h-[200%]" />
                                      </div>
                                      <span className="text-[5.5px] text-slate-500 font-bold uppercase mt-0.5 text-center leading-none">Akzent<br/>&nbsp;</span>
                                    </div>
                                  </div>
                                </div>

                                <div className="flex gap-1.5">
                                  {["monochromatic", "split_complementary", "triadic"].map((p) => (
                                    <button
                                      key={p}
                                      type="button"
                                      onClick={() => setRedesignPalette(p as any)}
                                      className={`flex-1 py-1 px-1.5 rounded-lg border text-center transition text-[8px] font-bold ${
                                        redesignPalette === p
                                          ? "bg-yellow-500/10 border-yellow-500 text-yellow-400"
                                          : "bg-slate-950/40 border-slate-850 text-slate-500 hover:border-slate-800"
                                      }`}
                                    >
                                      {p === "monochromatic" ? "MONOCHROM" : p === "split_complementary" ? "SPLIT-KOMPL." : "TRIADE"}
                                    </button>
                                  ))}
                                </div>
                              </div>

                              {/* RIGHT: BACK/CONTRAST & APPLY BUTTON */}
                              <div className="space-y-4 flex flex-col justify-between">
                                <div className="space-y-3">
                                  <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">B. Hintergrund & Layout-Kontrast</span>
                                  
                                  <div className="grid grid-cols-2 gap-2">
                                    <button
                                      key="dark-toggle"
                                      type="button"
                                      onClick={() => setRedesignBackgroundType("dark")}
                                      className={`px-3 py-2 rounded-xl border flex items-center gap-2 transition ${
                                        redesignBackgroundType === "dark"
                                          ? "bg-slate-800 border-slate-500 text-white shadow-md shadow-slate-900/50"
                                          : "bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700"
                                      }`}
                                    >
                                      <div className="w-3 h-3 rounded-full bg-[#121212] border border-slate-600"></div>
                                      <span className="text-[10px] font-extrabold">DARK MODE</span>
                                    </button>
                                    <button
                                      key="light-toggle"
                                      type="button"
                                      onClick={() => setRedesignBackgroundType("light")}
                                      className={`px-3 py-2 rounded-xl border flex items-center gap-2 transition ${
                                        redesignBackgroundType === "light"
                                          ? "bg-slate-100 border-slate-300 text-slate-900 shadow-md shadow-slate-200/50"
                                          : "bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700"
                                      }`}
                                    >
                                      <div className="w-3 h-3 rounded-full bg-white border border-slate-300"></div>
                                      <span className="text-[10px] font-extrabold">LIGHT MODE</span>
                                    </button>
                                  </div>

                                  <div className="bg-slate-950 border border-slate-900/60 rounded-xl p-3">
                                    <span className="text-[9px] text-slate-400 font-bold block mb-1 font-sans">Dynamische Vorschau</span>
                                    <p className="text-[9px] text-slate-500 leading-relaxed font-sans">
                                      Wählen Sie die Farben am Farbenrad links aus und passen Sie das Kontrast-Layout an. Klicken Sie dann auf die Schaltfläche unten, um diese Farbwerte direkt in Ihren CSS-Quellcode des aktuell ausgewählten Dokuments ({redesignSelectedDoc === "resume" ? "Lebenslauf" : "Motivationsschreiben"}) zu injizieren.
                                    </p>
                                  </div>
                                </div>

                                <button
                                  type="button"
                                  onClick={applyColorWheelToCss}
                                  className="w-full py-3 bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-extrabold rounded-xl text-xs transition shadow-lg shadow-yellow-500/10 flex items-center justify-center gap-1.5"
                                >
                                  <Sparkles className="h-3.5 w-3.5" />
                                  Farbschema im CSS-Quellcode anpassen
                                </button>
                              </div>
                            </div>
                          </div>

                          <span className="text-[10px] text-slate-500 font-sans uppercase tracking-wider block">WCAG 2.1 Kontrast-Prüfung:</span>
                        
                        {/* Summary Widget */}
                        {(() => {
                          const total = contrastIssues.length;
                          const passed = contrastIssues.filter(x => x.passed).length;
                          const failed = total - passed;
                          const score = total > 0 ? Math.round((passed / total) * 100) : 100;

                          let ratingTitle = "Hervorragend";
                          let ratingColor = "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
                          let ratingText = "Alle geprüften Textelemente erfüllen die WCAG-Richtlinien.";

                          if (failed > 0 && failed <= 2) {
                            ratingTitle = "Eingeschränkt";
                            ratingColor = "text-yellow-400 bg-yellow-500/10 border-yellow-500/20";
                            ratingText = "Einige wenige Elemente weisen ungenügenden Kontrast auf.";
                          } else if (failed > 2) {
                            ratingTitle = "Kritisch";
                            ratingColor = "text-rose-400 bg-rose-500/10 border-rose-500/20";
                            ratingText = "Mehrere Textelemente weisen unzureichende Kontrastwerte auf.";
                          }

                          return (
                            <div className="bg-slate-950/80 rounded-xl border border-slate-800 p-4 space-y-4">
                              <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                  <span className="text-xs font-bold text-slate-300">Barrierefreiheit (Kontrast)</span>
                                  <span className="text-[10px] text-slate-500 block">Basierend auf WCAG 2.1 AA Standards</span>
                                </div>
                                <div className="text-right">
                                  <span className="text-2xl font-black font-mono text-yellow-500">{score}%</span>
                                  <span className="text-[9px] text-slate-500 block uppercase font-bold">Score</span>
                                </div>
                              </div>

                              {/* Progress bar */}
                              <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                                <div 
                                  className={`h-full transition-all duration-550 ${score === 100 ? 'bg-emerald-500' : score >= 80 ? 'bg-yellow-500' : 'bg-rose-500'}`}
                                  style={{ width: `${score}%` }}
                                />
                              </div>

                              {/* Diagnostic Badge */}
                              <div className={`p-2.5 rounded-lg border text-[11px] leading-relaxed flex gap-2 items-start ${ratingColor}`}>
                                {failed === 0 ? (
                                  <ShieldCheck className="h-4.5 w-4.5 shrink-0 text-emerald-400 mt-0.5" />
                                ) : (
                                  <AlertTriangle className="h-4.5 w-4.5 shrink-0 text-yellow-500 mt-0.5" />
                                )}
                                <div>
                                  <strong>{ratingTitle}: </strong>{ratingText}
                                </div>
                              </div>

                              {/* Detailed statistics grid */}
                              <div className="grid grid-cols-3 gap-2 text-center text-[11px] font-mono">
                                <div className="bg-slate-900/60 rounded-lg p-2 border border-slate-850">
                                  <span className="text-slate-500 block text-[9px] uppercase font-bold mb-0.5">Geprüft</span>
                                  <span className="text-slate-300 font-extrabold">{total}</span>
                                </div>
                                <div className="bg-slate-900/60 rounded-lg p-2 border border-slate-850">
                                  <span className="text-emerald-500/80 block text-[9px] uppercase font-bold mb-0.5">Bestanden</span>
                                  <span className="text-emerald-400 font-extrabold">{passed}</span>
                                </div>
                                <div className="bg-slate-900/60 rounded-lg p-2 border border-slate-850">
                                  <span className="text-rose-500/80 block text-[9px] uppercase font-bold mb-0.5">Kritisch</span>
                                  <span className={`font-extrabold ${failed > 0 ? 'text-rose-400 font-black' : 'text-slate-500'}`}>{failed}</span>
                                </div>
                              </div>

                              {/* Visualization Toggle and Refresh Check Row */}
                              <div className="flex flex-col gap-2 pt-2 border-t border-slate-900">
                                <label className="flex items-center gap-2 cursor-pointer bg-slate-900/40 p-2 rounded-lg border border-slate-850/60 select-none hover:bg-slate-900 transition">
                                  <input 
                                    type="checkbox"
                                    checked={highlightContrastFailures}
                                    onChange={(e) => setHighlightContrastFailures(e.target.checked)}
                                    className="accent-yellow-500 rounded border-slate-800 bg-slate-950 focus:ring-0 h-4 w-4"
                                  />
                                  <div className="text-[11px]">
                                    <span className="text-slate-300 font-bold block">Kritische Bereiche markieren</span>
                                    <span className="text-slate-500 text-[9px] block">Zeigt rote Umrandungen im Dokument</span>
                                  </div>
                                </label>

                                <button
                                  type="button"
                                  onClick={runContrastCheck}
                                  disabled={isContrastChecking}
                                  className="w-full py-2 bg-slate-900 hover:bg-slate-850 disabled:bg-slate-950 text-slate-300 border border-slate-800 hover:border-slate-700 text-[11px] font-bold rounded-lg flex items-center justify-center gap-1.5 transition"
                                >
                                  <RefreshCw className={`h-3 w-3 text-yellow-500 ${isContrastChecking ? 'animate-spin' : ''}`} />
                                  Kontrastprüfung aktualisieren
                                </button>
                              </div>
                            </div>
                          );
                        })()}

                        {/* List of elements */}
                        <div className="bg-slate-950/80 rounded-xl border border-slate-800 overflow-hidden flex flex-col flex-1 max-h-[350px]">
                          <div className="bg-slate-900/60 px-3 py-2 border-b border-slate-850 flex items-center justify-between">
                            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Elementanalyse & Fehlerprotokoll</span>
                            {contrastIssues.filter(x => !x.passed).length > 0 && (
                              <span className="bg-rose-500/10 text-rose-400 text-[9px] font-black px-1.5 py-0.5 rounded border border-rose-500/25 animate-pulse">
                                Handlungsbedarf
                              </span>
                            )}
                          </div>

                          <div className="p-2 overflow-y-auto space-y-2 flex-1 scrollbar-thin scrollbar-thumb-slate-800">
                            {contrastIssues.length === 0 ? (
                              <div className="h-32 flex flex-col items-center justify-center text-center p-4">
                                <Loader2 className="h-5 w-5 text-yellow-500 animate-spin mb-2" />
                                <span className="text-[10px] text-slate-500 font-medium font-mono">Elemente werden analysiert...</span>
                              </div>
                            ) : (
                              (() => {
                                const fails = contrastIssues.filter(x => !x.passed);
                                const formatToHex = (rgbStr: string): string => {
                                  const rgb = parseRgb(rgbStr);
                                  if (!rgb) return rgbStr;
                                  return `#${rgb.r.toString(16).padStart(2, "0")}${rgb.g.toString(16).padStart(2, "0")}${rgb.b.toString(16).padStart(2, "0")}`.toUpperCase();
                                };

                                if (fails.length === 0) {
                                  return (
                                    <div className="py-6 px-4 text-center space-y-2">
                                      <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto">
                                        <Check className="h-5 w-5 text-emerald-400" />
                                      </div>
                                      <div>
                                        <span className="text-xs font-bold text-slate-300 block">Perfekter Kontrast</span>
                                        <span className="text-[9px] text-slate-500 block leading-normal mt-0.5">
                                          Alle {contrastIssues.length} analysierten Textelemente erfüllen die Anforderungen für Barrierefreiheit (AA: mind. 4,5:1).
                                        </span>
                                      </div>
                                    </div>
                                  );
                                }

                                return fails.map((issue) => (
                                  <div 
                                    key={issue.idx}
                                    className="bg-slate-900/40 hover:bg-slate-900 border border-slate-850 hover:border-slate-800 rounded-lg p-2.5 transition text-[11px] space-y-2 relative group"
                                  >
                                    <div className="flex items-start justify-between">
                                      <div className="flex items-center gap-1.5">
                                        <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
                                        <span className="bg-rose-500/10 text-rose-400 text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border border-rose-500/20">
                                          {issue.tagName}
                                        </span>
                                        {issue.isLargeText && (
                                          <span className="bg-blue-500/10 text-blue-400 text-[9px] px-1 py-0.5 rounded border border-blue-500/20 font-bold">
                                            Großtext
                                          </span>
                                        )}
                                      </div>
                                      
                                      <button
                                        type="button"
                                        onClick={() => focusContrastElement(redesignIframeRef.current!, issue.idx)}
                                        className="text-yellow-500 hover:text-yellow-400 text-[10px] font-bold flex items-center gap-1 transition"
                                      >
                                        <Eye className="h-3 w-3" />
                                        Anzeigen
                                      </button>
                                    </div>

                                    {/* Text excerpt */}
                                    <div className="text-slate-300 italic font-medium leading-normal bg-slate-950/50 p-1.5 rounded border border-slate-900/50">
                                      "{issue.textSnippet}"
                                    </div>

                                    {/* Contrast ratios info */}
                                    <div className="grid grid-cols-2 gap-2 text-[10px] font-mono leading-normal pt-1">
                                      <div>
                                        <span className="text-slate-500 block">Ist-Kontrast:</span>
                                        <span className="text-rose-400 font-extrabold flex items-center gap-1">
                                          {issue.ratio}:1 
                                          <span className="text-slate-500 text-[9px] font-medium">(Soll: {issue.requiredRatio}:1)</span>
                                        </span>
                                      </div>
                                      <div>
                                        <span className="text-slate-500 block">Größe:</span>
                                        <span className="text-slate-400">{issue.fontSize}</span>
                                      </div>
                                    </div>

                                    {/* Swatch color representation */}
                                    <div className="flex gap-2 items-center text-[9px] font-mono text-slate-500 pt-1 border-t border-slate-900/60">
                                      <div className="flex items-center gap-1 bg-slate-950 p-1 rounded border border-slate-900">
                                        <span className="w-2.5 h-2.5 rounded-full border border-slate-700 inline-block shrink-0" style={{ backgroundColor: issue.bgColor }} />
                                        <span>BG: {formatToHex(issue.bgColor)}</span>
                                      </div>
                                      <div className="flex items-center gap-1 bg-slate-950 p-1 rounded border border-slate-900">
                                        <span className="w-2.5 h-2.5 rounded-full border border-slate-700 inline-block shrink-0" style={{ backgroundColor: issue.textColor }} />
                                        <span>FG: {formatToHex(issue.textColor)}</span>
                                      </div>
                                    </div>
                                  </div>
                                ));
                              })()
                            )}
                          </div>
                        </div>
                    {/* Code Editor Accordion style */}
                    <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-xs text-yellow-400 font-bold uppercase tracking-wider block">Design-Quellcode anpassen (HTML & CSS)</span>
                          <span className="text-[10px] text-slate-400 mt-0.5 block">Sie können den HTML- und CSS-Inhalt hier verändern; die Vorschau oben wird sofort aktualisiert.</span>
                        </div>
                        <button
                          onClick={() => {
                            const doc = redesignSelectedDoc === "resume" ? redesignResult?.[redesignSelectedStyle]?.resume : redesignResult?.[redesignSelectedStyle]?.cover_letter;
                            if (doc) {
                              navigator.clipboard.writeText(`<!-- HTML -->\n${doc.html}\n\n/* CSS */\n${doc.css}`);
                              setCopiedSection("redesign_code");
                              setTimeout(() => setCopiedSection(null), 2000);
                            }
                          }}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-bold rounded-lg border border-slate-800 transition"
                        >
                          {copiedSection === "redesign_code" ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                          {copiedSection === "redesign_code" ? "Kopiert" : "Code kopieren"}
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] text-slate-500 font-mono">HTML Struktur:</label>
                          <textarea
                            value={redesignSelectedDoc === "resume" ? redesignResult?.[redesignSelectedStyle]?.resume?.html : redesignResult?.[redesignSelectedStyle]?.cover_letter?.html}
                            onChange={(e) => {
                              const val = e.target.value;
                              setRedesignResult(prev => {
                                if (!prev) return prev;
                                const currentStyle = prev[redesignSelectedStyle];
                                if (!currentStyle) return prev;
                                return {
                                  ...prev,
                                  [redesignSelectedStyle]: {
                                    ...currentStyle,
                                    [redesignSelectedDoc]: {
                                      ...currentStyle[redesignSelectedDoc],
                                      html: val
                                    }
                                  }
                                };
                              });
                            }}
                            className="w-full h-48 bg-slate-950 text-slate-300 border border-slate-850 rounded-lg p-2.5 text-[10px] font-mono leading-relaxed focus:outline-none focus:border-yellow-500"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] text-slate-500 font-mono">CSS Design:</label>
                          <textarea
                            value={redesignSelectedDoc === "resume" ? redesignResult?.[redesignSelectedStyle]?.resume?.css : redesignResult?.[redesignSelectedStyle]?.cover_letter?.css}
                            onChange={(e) => {
                              const val = e.target.value;
                              setRedesignResult(prev => {
                                if (!prev) return prev;
                                const currentStyle = prev[redesignSelectedStyle];
                                if (!currentStyle) return prev;
                                return {
                                  ...prev,
                                  [redesignSelectedStyle]: {
                                    ...currentStyle,
                                    [redesignSelectedDoc]: {
                                      ...currentStyle[redesignSelectedDoc],
                                      css: val
                                    }
                                  }
                                };
                              });
                            }}
                            className="w-full h-48 bg-slate-950 text-slate-300 border border-slate-850 rounded-lg p-2.5 text-[10px] font-mono leading-relaxed focus:outline-none focus:border-yellow-500"
                          />
                        </div>
                      </div>
                    </div>

                    {/* DSGVO Footer */}
                    <div className="bg-yellow-500/5 border border-yellow-500/10 rounded-xl p-3 flex items-start gap-2">
                      <ShieldCheck className="h-4.5 w-4.5 text-yellow-500 shrink-0 mt-0.5" />
                      <p className="text-[10px] text-slate-400 leading-relaxed">
                        <strong>Echtzeit-Demaskierung erfolgreich:</strong> Alle Platzhalter im CSS-Redesign wurden lokal im Browser durch Ihre echten Daten (<strong>{manualNames.split(',')[0] || "De-maskierter Name"}</strong>) ersetzt.
                      </p>
                    </div>
                  </>
                  )}
                </div>
                )}
              </div>
            </div>
            )}
          </div>
        )}

            {/* Common informational footer */}
            <div className="border-t border-slate-800/80 pt-4 mt-6 flex items-center justify-between text-[10px] text-slate-500">
              <span>System: <strong>AI-Bridge Privacy Suite v1.4</strong></span>
              <span>Lokalzeit: {new Date().toLocaleDateString("de-DE")}</span>
            </div>
          </div>
        </section>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/60 bg-slate-950/50 py-6 mt-12 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-500">
            © 2026 Lazy-HR-Workaround. Intelligente Automatisierung für deinen Bewerbungserfolg.
          </div>
          <div className="flex items-center space-x-4 text-xs text-slate-400">
            <span>Powered by <strong>Gemma-4</strong></span>
            <span>•</span>
            <span>Keine Speicherung von Profilen auf Cloud-Servern</span>
          </div>
        </div>
      </footer>

      {isRedesignFullscreen && redesignResult && (
        <div className="fixed inset-0 bg-[#020617]/95 backdrop-blur-md z-50 flex flex-col p-4 sm:p-6 overflow-hidden">
          {/* Fullscreen Header */}
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-white">Vollbild-Vorschau</h3>
            <button
              type="button"
              onClick={() => setIsRedesignFullscreen(false)}
              className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg font-bold"
            >
              Schließen
            </button>
          </div>
          <div className="flex-1 bg-white rounded-xl overflow-hidden relative">
            <iframe
              title="Fullscreen Document Preview"
              srcDoc={
                redesignSelectedDoc === "resume"
                  ? redesignResult[redesignSelectedStyle]?.resume?.html
                  : redesignResult[redesignSelectedStyle]?.cover_letter?.html
              }
              className="w-full h-full border-0"
              sandbox="allow-same-origin allow-scripts"
            />
          </div>
        </div>
      )}
    </div>
  );
}
