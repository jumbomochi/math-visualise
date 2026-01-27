// Type definitions for PDF Import feature

export type ImportStatus = 'processing' | 'ready_for_review' | 'completed' | 'failed';

export type H2Topic =
  | 'vectors'
  | 'probability'
  | 'statistics'
  | 'combinatorics'
  | 'calculus'
  | 'complex-numbers'
  | 'functions';

export type ExamType = 'midyear' | 'promo' | 'prelim' | 'topical';

export type ContentType = 'theory' | 'example' | 'worked_solution' | 'summary';

export interface ExtractedQuestion {
  tempId: string;
  content: string;
  solution?: string;
  answer?: string;
  hints?: string[];
  topic: H2Topic;
  difficulty: number; // 1-5
  confidence: number; // 0-1
  questionNum?: string;
  needsReview: boolean;
}

export interface ExtractedLesson {
  tempId: string;
  title: string;
  content: string;
  contentType: ContentType;
  topic: H2Topic;
  order: number;
  confidence: number;
}

export interface ImportMetadata {
  filename: string;
  school: string;
  year: number;
  examType: ExamType;
  paperNumber?: number;
  totalPages?: number;
}

export interface ExtractionResult {
  questions: ExtractedQuestion[];
  lessons: ExtractedLesson[];
  metadata: ImportMetadata;
}

// API types
export interface UploadResponse {
  success: boolean;
  importId?: string;
  status?: ImportStatus;
  error?: string;
  questionsFound?: number;
  lessonsFound?: number;
}

export interface StatusResponse {
  id: string;
  status: ImportStatus;
  progress?: number;
  questionsFound?: number;
  lessonsFound?: number;
  errorMessage?: string;
}

export interface SaveRequest {
  importId: string;
  questions: ExtractedQuestion[];
  lessons: ExtractedLesson[];
  metadata: ImportMetadata;
}

export interface SaveResponse {
  success: boolean;
  savedQuestions: number;
  savedLessons: number;
  error?: string;
}
