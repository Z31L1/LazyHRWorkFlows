export interface ExperienceEntry {
  id: string;
  jobTitle: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export interface EducationEntry {
  id: string;
  degree: string;
  institution: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export interface CVData {
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    linkedin: string;
    website: string;
  };
  summary: string;
  experience: ExperienceEntry[];
  education: EducationEntry[];
  skills: string[];
  languages: string[];
}

export interface ATSAnalysis {
  score: number;
  structureCheck: {
    hasContactInfo: boolean;
    hasWorkExperience: boolean;
    hasEducation: boolean;
    hasSkills: boolean;
    hasClearSections: boolean;
  };
  formattingIssues: {
    severity: "critical" | "warning" | "good";
    issue: string;
    fix: string;
  }[];
  keywordAnalysis: {
    keyword: string;
    status: "found" | "missing" | "excessive";
    importance: "high" | "medium" | "low";
    recommendation: string;
  }[];
  sectionFeedback: {
    contact: string;
    summary: string;
    experience: string;
    education: string;
    skills: string;
  };
  atsOptimizedText: string;
}

export interface JobMatchAnalysis {
  matchPercentage: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  criticalGaps: {
    gap: string;
    recommendation: string;
  }[];
  tailoringSuggestions: {
    section: string;
    originalText: string;
    suggestedText: string;
    reason: string;
  }[];
  roleRelevanceSummary: string;
}

export interface CoverLetterResult {
  subjectLine: string;
  salutation: string;
  bodyParagraphs: string[];
  signoff: string;
  atsTips: string[];
}
