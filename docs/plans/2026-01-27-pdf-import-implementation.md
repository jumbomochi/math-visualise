# PDF Import System - Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Convert math-visualise from Vite to Next.js and add PDF import functionality for extracting H2 Math questions and lesson content from school exam papers.

**Architecture:** Next.js App Router with Prisma/SQLite database. PDF text extraction with OCR fallback, AI-powered question/lesson extraction using local Ollama Qwen 2.5 32B model. Upload → Extract → Review → Save workflow.

**Tech Stack:** Next.js 14, React 18, Prisma, SQLite, pdf-parse, tesseract.js, pdfjs-dist, Ollama API, Tailwind CSS, Framer Motion

---

## Phase 1: Convert to Next.js

### Task 1.1: Initialize Next.js Project

**Files:**
- Create: `package.json` (replace existing)
- Create: `next.config.js`
- Create: `tsconfig.json` (replace existing)
- Create: `app/layout.tsx`
- Create: `app/page.tsx`

**Step 1: Install Next.js and update package.json**

```bash
cd /Users/huiliang/GitHub/math-visualise/.worktrees/pdf-import
npm install next@14.2.21 --save
npm install @types/node --save-dev
```

**Step 2: Create next.config.js**

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['pdf-parse', 'tesseract.js', 'canvas'],
  },
  webpack: (config) => {
    config.resolve.alias.canvas = false;
    config.resolve.fallback = { fs: false, path: false };
    return config;
  },
};

module.exports = nextConfig;
```

**Step 3: Update tsconfig.json for Next.js**

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

**Step 4: Create app/layout.tsx**

```tsx
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'H2 Math Visualizer',
  description: 'Interactive visualizations for Singapore H2 Mathematics',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

**Step 5: Create app/globals.css** (copy from src/index.css with Tailwind directives)

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Copy existing styles from src/index.css */
```

**Step 6: Create app/page.tsx** (wrapper for existing App)

```tsx
'use client';

import dynamic from 'next/dynamic';

const App = dynamic(() => import('@/components/App'), { ssr: false });

export default function HomePage() {
  return <App />;
}
```

**Step 7: Move src/App.tsx to components/App.tsx**

```bash
mkdir -p components
mv src/App.tsx components/App.tsx
```

**Step 8: Update package.json scripts**

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  }
}
```

**Step 9: Run dev server to verify**

```bash
npm run dev
```

Expected: App loads at http://localhost:3000

**Step 10: Commit**

```bash
git add -A
git commit -m "feat: Convert from Vite to Next.js App Router"
```

---

### Task 1.2: Migrate Source Files to Next.js Structure

**Files:**
- Move: `src/components/*` → `components/`
- Move: `src/modules/*` → `modules/`
- Move: `src/math/*` → `lib/math/`
- Move: `src/store/*` → `lib/store/`
- Move: `src/core/*` → `lib/core/`

**Step 1: Create directory structure**

```bash
mkdir -p components/ui components/layout components/tools components/visualizations
mkdir -p modules
mkdir -p lib/math lib/store lib/core
```

**Step 2: Move directories**

```bash
cp -r src/components/ui/* components/ui/
cp -r src/components/layout/* components/layout/
cp -r src/components/tools/* components/tools/
cp -r src/modules/* modules/
cp -r src/math/* lib/math/
cp -r src/store/* lib/store/
cp -r src/core/* lib/core/
```

**Step 3: Update import paths in all files**

Replace `@/` paths to match new structure:
- `@/components/` stays same
- `@/modules/` stays same
- `@/math/` → `@/lib/math/`
- `@/store/` → `@/lib/store/`
- `@/core/` → `@/lib/core/`

**Step 4: Update tailwind.config.js content paths**

```javascript
content: [
  './app/**/*.{js,ts,jsx,tsx,mdx}',
  './components/**/*.{js,ts,jsx,tsx,mdx}',
  './modules/**/*.{js,ts,jsx,tsx,mdx}',
],
```

**Step 5: Run dev server to verify all modules work**

```bash
npm run dev
```

Expected: All visualizations render correctly

**Step 6: Commit**

```bash
git add -A
git commit -m "refactor: Migrate source files to Next.js structure"
```

---

## Phase 2: Set Up Database

### Task 2.1: Initialize Prisma with SQLite

**Files:**
- Create: `prisma/schema.prisma`
- Create: `lib/db.ts`

**Step 1: Install Prisma**

```bash
npm install prisma @prisma/client --save-dev
npx prisma init --datasource-provider sqlite
```

**Step 2: Create prisma/schema.prisma**

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

model ImportedPDF {
  id            String   @id @default(cuid())
  filename      String
  source        String?
  pageCount     Int      @default(0)
  status        String   @default("processing") // processing | ready_for_review | completed | failed
  errorMessage  String?
  extractedData String?  // JSON string of extracted content
  questionsCount Int?
  lessonsCount   Int?
  createdAt     DateTime @default(now())
  completedAt   DateTime?

  questions ExtractedQuestion[]
  lessons   ExtractedLesson[]
}

model ExtractedQuestion {
  id           String   @id @default(cuid())
  pdfId        String
  pdf          ImportedPDF @relation(fields: [pdfId], references: [id], onDelete: Cascade)

  // Content
  content      String
  solution     String?
  answer       String?
  hints        String?  // JSON array

  // Classification
  topic        String
  difficulty   Int      @default(2)
  confidence   Float    @default(0.5)

  // Paper metadata
  school       String
  year         Int
  examType     String   // midyear | promo | prelim | topical
  paperNumber  Int?
  questionNum  String?

  createdAt    DateTime @default(now())
}

model ExtractedLesson {
  id           String   @id @default(cuid())
  pdfId        String
  pdf          ImportedPDF @relation(fields: [pdfId], references: [id], onDelete: Cascade)

  title        String
  content      String
  contentType  String   // theory | example | worked_solution | summary
  topic        String
  order        Int      @default(0)

  createdAt    DateTime @default(now())
}
```

**Step 3: Create .env file**

```bash
echo 'DATABASE_URL="file:./dev.db"' > .env
echo 'OLLAMA_BASE_URL="http://localhost:11434"' >> .env
echo 'OLLAMA_MODEL="qwen2.5:32b"' >> .env
```

**Step 4: Add .env to .gitignore**

```bash
echo '.env' >> .gitignore
echo '.env.local' >> .gitignore
```

**Step 5: Create lib/db.ts**

```typescript
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
```

**Step 6: Generate Prisma client and push schema**

```bash
npx prisma generate
npx prisma db push
```

Expected: dev.db created, Prisma client generated

**Step 7: Commit**

```bash
git add prisma/ lib/db.ts .gitignore
git commit -m "feat: Set up Prisma with SQLite database"
```

---

## Phase 3: Port PDF Extraction Utilities

### Task 3.1: Create Import Types

**Files:**
- Create: `lib/import-types.ts`

**Step 1: Create lib/import-types.ts**

```typescript
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
```

**Step 2: Commit**

```bash
git add lib/import-types.ts
git commit -m "feat: Add import type definitions"
```

---

### Task 3.2: Create PDF Extractor

**Files:**
- Create: `lib/pdf-extractor.ts`

**Step 1: Install dependencies**

```bash
npm install pdf-parse --save
npm install @types/pdf-parse --save-dev
```

**Step 2: Create lib/pdf-extractor.ts**

```typescript
// PDF text extraction with page splitting

import pdf from 'pdf-parse';

export interface PDFExtractionResult {
  text: string;
  pageCount: number;
  pages: string[];
  metadata: {
    title?: string;
    author?: string;
  };
}

export async function extractTextFromPDF(
  buffer: Buffer
): Promise<PDFExtractionResult> {
  try {
    const data = await pdf(buffer);
    const extractedText = normalizeText(data.text);
    const pages = splitIntoPages(data.text, data.numpages);

    return {
      text: extractedText,
      pageCount: data.numpages,
      pages: pages.map(normalizeText),
      metadata: {
        title: data.info?.Title || undefined,
        author: data.info?.Author || undefined,
      },
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Failed to extract PDF text: ${message}`);
  }
}

function splitIntoPages(text: string, pageCount: number): string[] {
  if (pageCount <= 1) {
    return [text];
  }

  const roughPages = text.split(/\n{4,}/);

  if (roughPages.length >= pageCount) {
    const pagesPerGroup = Math.ceil(roughPages.length / pageCount);
    const pages: string[] = [];
    for (let i = 0; i < pageCount; i++) {
      const start = i * pagesPerGroup;
      const end = Math.min(start + pagesPerGroup, roughPages.length);
      pages.push(roughPages.slice(start, end).join('\n\n'));
    }
    return pages.filter(p => p.trim().length > 0);
  }

  // Split evenly by character count
  const charsPerPage = Math.ceil(text.length / pageCount);
  const pages: string[] = [];
  for (let i = 0; i < pageCount; i++) {
    const start = i * charsPerPage;
    const end = Math.min(start + charsPerPage, text.length);
    pages.push(text.slice(start, end));
  }
  return pages.filter(p => p.trim().length > 0);
}

function normalizeText(text: string): string {
  return text
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{2,}/g, '\n\n')
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, '')
    .replace(/[""]/g, '"')
    .replace(/['']/g, "'")
    .replace(/[–—]/g, '-')
    .replace(/\.{3,}/g, '...')
    .trim();
}

export function isValidPDF(buffer: Buffer): boolean {
  const header = buffer.slice(0, 5).toString('ascii');
  return header === '%PDF-';
}

export const PDF_LIMITS = {
  maxFileSizeMB: 10,
  maxPages: 50,
} as const;

export function checkPDFLimits(
  buffer: Buffer,
  pageCount?: number
): { valid: boolean; error?: string } {
  const sizeMB = buffer.length / (1024 * 1024);

  if (sizeMB > PDF_LIMITS.maxFileSizeMB) {
    return {
      valid: false,
      error: `PDF is too large (${sizeMB.toFixed(1)}MB). Maximum is ${PDF_LIMITS.maxFileSizeMB}MB.`,
    };
  }

  if (pageCount && pageCount > PDF_LIMITS.maxPages) {
    return {
      valid: false,
      error: `PDF has too many pages (${pageCount}). Maximum is ${PDF_LIMITS.maxPages}.`,
    };
  }

  return { valid: true };
}
```

**Step 3: Commit**

```bash
git add lib/pdf-extractor.ts package.json package-lock.json
git commit -m "feat: Add PDF text extraction utility"
```

---

### Task 3.3: Create Ollama Client

**Files:**
- Create: `lib/ollama-client.ts`

**Step 1: Create lib/ollama-client.ts**

```typescript
// Ollama API client for local LLM inference

interface OllamaMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface OllamaResponse {
  model: string;
  message: {
    role: string;
    content: string;
  };
  done: boolean;
}

export class OllamaClient {
  private baseUrl: string;
  private model: string;

  constructor() {
    this.baseUrl = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
    this.model = process.env.OLLAMA_MODEL || 'qwen2.5:32b';
  }

  async chat(
    messages: OllamaMessage[],
    options: { temperature?: number; maxTokens?: number } = {}
  ): Promise<string> {
    const { temperature = 0.3, maxTokens = 8192 } = options;

    const response = await fetch(`${this.baseUrl}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: this.model,
        messages,
        stream: false,
        options: {
          temperature,
          num_predict: maxTokens,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.status} ${response.statusText}`);
    }

    const data: OllamaResponse = await response.json();
    return data.message.content;
  }

  async isAvailable(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/api/tags`);
      return response.ok;
    } catch {
      return false;
    }
  }
}

export const ollama = new OllamaClient();
```

**Step 2: Commit**

```bash
git add lib/ollama-client.ts
git commit -m "feat: Add Ollama API client for local LLM"
```

---

### Task 3.4: Create AI Content Extractor

**Files:**
- Create: `lib/content-ai-extractor.ts`

**Step 1: Create lib/content-ai-extractor.ts**

```typescript
// AI-powered extraction of questions and lessons from PDF text

import { ollama } from './ollama-client';
import {
  ExtractedQuestion,
  ExtractedLesson,
  ExtractionResult,
  ImportMetadata,
  H2Topic,
} from './import-types';

const EXTRACTION_SYSTEM_PROMPT = `You are an expert at extracting content from Singapore H2 Mathematics exam papers and notes.

Your task is to:
1. Identify and extract math QUESTIONS with their solutions
2. Identify and extract LESSON content (theory, examples, explanations)

## H2 Math Topics (use these exact slugs):
- vectors: 3D vectors, dot product, cross product, lines, planes
- probability: Basic probability, conditional probability, Bayes
- statistics: Distributions, hypothesis testing, correlation, regression
- combinatorics: Permutations, combinations, arrangements
- calculus: Differentiation, integration, applications
- complex-numbers: Complex number operations, Argand diagrams
- functions: Graphs, transformations, inverse functions

## For QUESTIONS extract:
- content: Full question text with LaTeX math (use $...$ for inline, $$...$$ for display)
- solution: Step-by-step worked solution if present
- answer: Final answer
- topic: One of the topic slugs above
- difficulty: 1-5 (1=basic, 2=standard, 3=challenging, 4=competition, 5=olympiad)
- questionNum: Original question number (e.g., "Q5", "Q10(iii)")

## For LESSONS extract:
- title: Short descriptive title
- content: The educational content with LaTeX formatting
- contentType: "theory" | "example" | "worked_solution" | "summary"
- topic: One of the topic slugs above
- order: Sequence number (1, 2, 3...)

## LaTeX Formatting:
- Fractions: \\frac{a}{b}
- Vectors: \\mathbf{a} or \\vec{a}
- Integrals: \\int_a^b f(x) \\, dx
- Derivatives: \\frac{dy}{dx}
- Summations: \\sum_{i=1}^{n}

## Output JSON format:
{
  "questions": [
    {
      "content": "...",
      "solution": "...",
      "answer": "...",
      "topic": "vectors",
      "difficulty": 3,
      "questionNum": "Q5(a)",
      "confidence": 0.9
    }
  ],
  "lessons": [
    {
      "title": "...",
      "content": "...",
      "contentType": "theory",
      "topic": "vectors",
      "order": 1,
      "confidence": 0.85
    }
  ]
}

Be thorough. Extract ALL questions and lesson content. Use proper LaTeX notation.`;

export async function extractContentWithAI(
  pdfText: string,
  metadata: ImportMetadata
): Promise<ExtractionResult> {
  // Check if Ollama is available
  const available = await ollama.isAvailable();
  if (!available) {
    throw new Error('Ollama is not running. Please start Ollama and try again.');
  }

  // Split text into chunks if too long
  const chunks = splitIntoChunks(pdfText);
  const allQuestions: ExtractedQuestion[] = [];
  const allLessons: ExtractedLesson[] = [];

  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    const chunkContext = chunks.length > 1
      ? `\n\n[Section ${i + 1} of ${chunks.length}]`
      : '';

    try {
      const response = await ollama.chat([
        { role: 'system', content: EXTRACTION_SYSTEM_PROMPT },
        {
          role: 'user',
          content: `Extract all questions and lesson content from this H2 Math paper:${chunkContext}\n\n---\n\n${chunk}`,
        },
      ]);

      const parsed = parseAIResponse(response);

      // Add questions with tempIds
      const questions = parsed.questions.map((q, idx) => ({
        ...q,
        tempId: `q-${Date.now()}-${i}-${idx}`,
        needsReview: q.confidence < 0.7,
      }));
      allQuestions.push(...questions);

      // Add lessons with tempIds
      const lessons = parsed.lessons.map((l, idx) => ({
        ...l,
        tempId: `l-${Date.now()}-${i}-${idx}`,
      }));
      allLessons.push(...lessons);
    } catch (error) {
      console.error(`Error processing chunk ${i + 1}:`, error);
    }
  }

  // Deduplicate
  const uniqueQuestions = deduplicateQuestions(allQuestions);
  const uniqueLessons = deduplicateLessons(allLessons);

  return {
    questions: uniqueQuestions,
    lessons: uniqueLessons,
    metadata,
  };
}

function splitIntoChunks(text: string, maxChars = 12000): string[] {
  if (text.length <= maxChars) {
    return [text];
  }

  const chunks: string[] = [];
  const paragraphs = text.split(/\n\n+/);
  let currentChunk = '';

  for (const para of paragraphs) {
    if ((currentChunk + para).length > maxChars) {
      if (currentChunk) chunks.push(currentChunk.trim());
      currentChunk = para;
    } else {
      currentChunk += (currentChunk ? '\n\n' : '') + para;
    }
  }

  if (currentChunk) chunks.push(currentChunk.trim());
  return chunks;
}

function parseAIResponse(response: string): {
  questions: Omit<ExtractedQuestion, 'tempId' | 'needsReview'>[];
  lessons: Omit<ExtractedLesson, 'tempId'>[];
} {
  // Extract JSON from response
  let jsonStr = response;

  const jsonMatch = response.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (jsonMatch) {
    jsonStr = jsonMatch[1];
  }

  const jsonStart = jsonStr.indexOf('{');
  const jsonEnd = jsonStr.lastIndexOf('}');
  if (jsonStart !== -1 && jsonEnd !== -1) {
    jsonStr = jsonStr.slice(jsonStart, jsonEnd + 1);
  }

  try {
    const parsed = JSON.parse(jsonStr);
    return {
      questions: (parsed.questions || []).map(validateQuestion),
      lessons: (parsed.lessons || []).map(validateLesson),
    };
  } catch (error) {
    console.error('Failed to parse AI response:', error);
    return { questions: [], lessons: [] };
  }
}

const VALID_TOPICS: H2Topic[] = [
  'vectors', 'probability', 'statistics', 'combinatorics',
  'calculus', 'complex-numbers', 'functions',
];

function validateQuestion(q: Record<string, unknown>) {
  const topic = VALID_TOPICS.includes(q.topic as H2Topic)
    ? (q.topic as H2Topic)
    : 'calculus';

  return {
    content: String(q.content || ''),
    solution: q.solution ? String(q.solution) : undefined,
    answer: q.answer ? String(q.answer) : undefined,
    hints: Array.isArray(q.hints) ? q.hints.map(String) : undefined,
    topic,
    difficulty: typeof q.difficulty === 'number' ? Math.min(5, Math.max(1, q.difficulty)) : 2,
    confidence: typeof q.confidence === 'number' ? q.confidence : 0.5,
    questionNum: q.questionNum ? String(q.questionNum) : undefined,
  };
}

function validateLesson(l: Record<string, unknown>) {
  const topic = VALID_TOPICS.includes(l.topic as H2Topic)
    ? (l.topic as H2Topic)
    : 'calculus';

  const validTypes = ['theory', 'example', 'worked_solution', 'summary'];
  const contentType = validTypes.includes(l.contentType as string)
    ? (l.contentType as 'theory' | 'example' | 'worked_solution' | 'summary')
    : 'theory';

  return {
    title: String(l.title || 'Untitled'),
    content: String(l.content || ''),
    contentType,
    topic,
    order: typeof l.order === 'number' ? l.order : 0,
    confidence: typeof l.confidence === 'number' ? l.confidence : 0.5,
  };
}

function deduplicateQuestions(questions: ExtractedQuestion[]): ExtractedQuestion[] {
  const seen = new Set<string>();
  return questions.filter(q => {
    const key = (q.content + q.answer).toLowerCase().replace(/\s+/g, ' ').trim();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function deduplicateLessons(lessons: ExtractedLesson[]): ExtractedLesson[] {
  const seen = new Set<string>();
  return lessons.filter(l => {
    const key = l.content.toLowerCase().replace(/\s+/g, ' ').trim().slice(0, 200);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
```

**Step 2: Commit**

```bash
git add lib/content-ai-extractor.ts
git commit -m "feat: Add AI content extractor using Ollama"
```

---

## Phase 4: Create API Routes

### Task 4.1: Create Upload API Route

**Files:**
- Create: `app/api/import/upload/route.ts`

**Step 1: Create app/api/import/upload/route.ts**

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { extractTextFromPDF, isValidPDF, checkPDFLimits } from '@/lib/pdf-extractor';
import { extractContentWithAI } from '@/lib/content-ai-extractor';
import { ExamType } from '@/lib/import-types';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const school = formData.get('school') as string | null;
    const yearStr = formData.get('year') as string | null;
    const examType = formData.get('examType') as ExamType | null;
    const paperNumberStr = formData.get('paperNumber') as string | null;

    // Validate required fields
    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    if (!school || !yearStr || !examType) {
      return NextResponse.json(
        { success: false, error: 'School, year, and exam type are required' },
        { status: 400 }
      );
    }

    if (!file.name.toLowerCase().endsWith('.pdf')) {
      return NextResponse.json(
        { success: false, error: 'File must be a PDF' },
        { status: 400 }
      );
    }

    // Read file buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Validate PDF
    if (!isValidPDF(buffer)) {
      return NextResponse.json(
        { success: false, error: 'Invalid PDF file' },
        { status: 400 }
      );
    }

    // Check size limits
    const limitsCheck = checkPDFLimits(buffer);
    if (!limitsCheck.valid) {
      return NextResponse.json(
        { success: false, error: limitsCheck.error },
        { status: 400 }
      );
    }

    const year = parseInt(yearStr, 10);
    const paperNumber = paperNumberStr ? parseInt(paperNumberStr, 10) : undefined;

    // Create import record
    const importRecord = await prisma.importedPDF.create({
      data: {
        filename: file.name,
        source: `${school} ${year} ${examType}`,
        status: 'processing',
      },
    });

    // Extract text from PDF
    let pdfResult;
    try {
      pdfResult = await extractTextFromPDF(buffer);
    } catch (extractError) {
      await prisma.importedPDF.update({
        where: { id: importRecord.id },
        data: {
          status: 'failed',
          errorMessage: `PDF extraction failed: ${extractError instanceof Error ? extractError.message : 'Unknown error'}`,
        },
      });
      return NextResponse.json(
        { success: false, importId: importRecord.id, error: 'Failed to extract text from PDF' },
        { status: 500 }
      );
    }

    // Update page count
    await prisma.importedPDF.update({
      where: { id: importRecord.id },
      data: { pageCount: pdfResult.pageCount },
    });

    // Extract content using AI
    let extractionResult;
    try {
      extractionResult = await extractContentWithAI(pdfResult.text, {
        filename: file.name,
        school,
        year,
        examType,
        paperNumber,
        totalPages: pdfResult.pageCount,
      });
    } catch (aiError) {
      await prisma.importedPDF.update({
        where: { id: importRecord.id },
        data: {
          status: 'failed',
          errorMessage: `AI extraction failed: ${aiError instanceof Error ? aiError.message : 'Unknown error'}`,
        },
      });
      return NextResponse.json(
        { success: false, importId: importRecord.id, error: 'Failed to extract content with AI' },
        { status: 500 }
      );
    }

    // Check if any content was found
    if (extractionResult.questions.length === 0 && extractionResult.lessons.length === 0) {
      await prisma.importedPDF.update({
        where: { id: importRecord.id },
        data: {
          status: 'failed',
          errorMessage: 'No questions or lessons found in PDF',
        },
      });
      return NextResponse.json(
        { success: false, importId: importRecord.id, error: 'No content found in the PDF' },
        { status: 400 }
      );
    }

    // Store extracted data
    await prisma.importedPDF.update({
      where: { id: importRecord.id },
      data: {
        status: 'ready_for_review',
        questionsCount: extractionResult.questions.length,
        lessonsCount: extractionResult.lessons.length,
        extractedData: JSON.stringify(extractionResult),
      },
    });

    return NextResponse.json({
      success: true,
      importId: importRecord.id,
      status: 'ready_for_review',
      questionsFound: extractionResult.questions.length,
      lessonsFound: extractionResult.lessons.length,
    });
  } catch (error) {
    console.error('Import upload error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to process upload' },
      { status: 500 }
    );
  }
}
```

**Step 2: Commit**

```bash
git add app/api/import/upload/route.ts
git commit -m "feat: Add PDF upload API route"
```

---

### Task 4.2: Create Status API Route

**Files:**
- Create: `app/api/import/status/[id]/route.ts`

**Step 1: Create directory and file**

```bash
mkdir -p app/api/import/status/\[id\]
```

**Step 2: Create app/api/import/status/[id]/route.ts**

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { StatusResponse, ExtractionResult } from '@/lib/import-types';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: 'Import ID is required' }, { status: 400 });
    }

    const importRecord = await prisma.importedPDF.findUnique({
      where: { id },
    });

    if (!importRecord) {
      return NextResponse.json({ error: 'Import not found' }, { status: 404 });
    }

    const response: StatusResponse = {
      id: importRecord.id,
      status: importRecord.status as StatusResponse['status'],
      questionsFound: importRecord.questionsCount ?? undefined,
      lessonsFound: importRecord.lessonsCount ?? undefined,
      errorMessage: importRecord.errorMessage ?? undefined,
    };

    if (importRecord.status === 'processing') {
      response.progress = 50;
    } else if (importRecord.status === 'ready_for_review') {
      response.progress = 100;
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error('Status check error:', error);
    return NextResponse.json({ error: 'Failed to check import status' }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { action } = await request.json();

    if (action !== 'get_content') {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    const importRecord = await prisma.importedPDF.findUnique({
      where: { id },
    });

    if (!importRecord) {
      return NextResponse.json({ error: 'Import not found' }, { status: 404 });
    }

    if (importRecord.status !== 'ready_for_review') {
      return NextResponse.json({ error: 'Content not ready for review' }, { status: 400 });
    }

    if (!importRecord.extractedData) {
      return NextResponse.json({ error: 'No extracted data found' }, { status: 404 });
    }

    const extractedData: ExtractionResult = JSON.parse(importRecord.extractedData);

    return NextResponse.json({
      importId: importRecord.id,
      questions: extractedData.questions,
      lessons: extractedData.lessons,
      metadata: extractedData.metadata,
    });
  } catch (error) {
    console.error('Get content error:', error);
    return NextResponse.json({ error: 'Failed to get content' }, { status: 500 });
  }
}
```

**Step 3: Commit**

```bash
git add app/api/import/status/
git commit -m "feat: Add import status API route"
```

---

### Task 4.3: Create Save API Route

**Files:**
- Create: `app/api/import/save/route.ts`

**Step 1: Create app/api/import/save/route.ts**

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { SaveRequest, SaveResponse } from '@/lib/import-types';

export async function POST(request: NextRequest) {
  try {
    const body: SaveRequest = await request.json();
    const { importId, questions, lessons, metadata } = body;

    if (!importId) {
      return NextResponse.json({ success: false, error: 'Import ID is required' }, { status: 400 });
    }

    const importRecord = await prisma.importedPDF.findUnique({
      where: { id: importId },
    });

    if (!importRecord) {
      return NextResponse.json({ success: false, error: 'Import not found' }, { status: 404 });
    }

    let savedQuestions = 0;
    let savedLessons = 0;

    // Save questions
    for (const q of questions) {
      try {
        await prisma.extractedQuestion.create({
          data: {
            pdfId: importId,
            content: q.content,
            solution: q.solution,
            answer: q.answer,
            hints: q.hints ? JSON.stringify(q.hints) : null,
            topic: q.topic,
            difficulty: q.difficulty,
            confidence: q.confidence,
            school: metadata.school,
            year: metadata.year,
            examType: metadata.examType,
            paperNumber: metadata.paperNumber,
            questionNum: q.questionNum,
          },
        });
        savedQuestions++;
      } catch (err) {
        console.error('Error saving question:', err);
      }
    }

    // Save lessons
    for (const l of lessons) {
      try {
        await prisma.extractedLesson.create({
          data: {
            pdfId: importId,
            title: l.title,
            content: l.content,
            contentType: l.contentType,
            topic: l.topic,
            order: l.order,
          },
        });
        savedLessons++;
      } catch (err) {
        console.error('Error saving lesson:', err);
      }
    }

    // Update import record
    await prisma.importedPDF.update({
      where: { id: importId },
      data: {
        status: 'completed',
        questionsCount: savedQuestions,
        lessonsCount: savedLessons,
        completedAt: new Date(),
        extractedData: null, // Clear to save space
      },
    });

    const response: SaveResponse = {
      success: true,
      savedQuestions,
      savedLessons,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Save error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to save' },
      { status: 500 }
    );
  }
}
```

**Step 2: Commit**

```bash
git add app/api/import/save/route.ts
git commit -m "feat: Add import save API route"
```

---

## Phase 5: Create Import UI Components

### Task 5.1: Create PDFUploader Component

**Files:**
- Create: `components/import/PDFUploader.tsx`

**Step 1: Create components/import/PDFUploader.tsx**

```tsx
'use client';

import { useState, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, X, AlertCircle } from 'lucide-react';
import { ExamType } from '@/lib/import-types';

interface PDFUploaderProps {
  onUpload: (
    file: File,
    school: string,
    year: number,
    examType: ExamType,
    paperNumber?: number
  ) => void;
  isUploading: boolean;
}

const SCHOOLS = [
  'Anglo-Chinese JC',
  'Anderson Serangoon JC',
  'Catholic JC',
  'Dunman High School',
  'Eunoia JC',
  'Hwa Chong Institution',
  'Jurong Pioneer JC',
  'Millennia Institute',
  'Nanyang JC',
  'National JC',
  'Raffles Institution',
  'River Valley High School',
  'St. Andrew\'s JC',
  'Tampines Meridian JC',
  'Temasek JC',
  'Victoria JC',
  'Yishun Innova JC',
  'Other',
];

const EXAM_TYPES: { value: ExamType; label: string }[] = [
  { value: 'midyear', label: 'Mid-Year Examination' },
  { value: 'promo', label: 'Promotional Examination' },
  { value: 'prelim', label: 'Preliminary Examination' },
  { value: 'topical', label: 'Topical Test' },
];

export function PDFUploader({ onUpload, isUploading }: PDFUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [school, setSchool] = useState('');
  const [customSchool, setCustomSchool] = useState('');
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [examType, setExamType] = useState<ExamType>('prelim');
  const [paperNumber, setPaperNumber] = useState('');
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): boolean => {
    setError(null);
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      setError('Please select a PDF file');
      return false;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('File is too large. Maximum size is 10MB');
      return false;
    }
    return true;
  };

  const handleFile = useCallback((file: File) => {
    if (validateFile(file)) {
      setSelectedFile(file);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleSubmit = () => {
    if (!selectedFile) return;
    const finalSchool = school === 'Other' ? customSchool : school;
    if (!finalSchool) {
      setError('Please select or enter a school name');
      return;
    }
    const yearNum = parseInt(year, 10);
    if (isNaN(yearNum) || yearNum < 2000 || yearNum > 2100) {
      setError('Please enter a valid year');
      return;
    }
    onUpload(
      selectedFile,
      finalSchool,
      yearNum,
      examType,
      paperNumber ? parseInt(paperNumber, 10) : undefined
    );
  };

  return (
    <div className="space-y-6">
      {/* Drop zone */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`relative border-2 border-dashed rounded-2xl p-8 transition-all ${
          isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'
        } ${selectedFile ? 'border-green-500 bg-green-50' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={isUploading}
        />
        <div className="flex flex-col items-center text-center">
          {selectedFile ? (
            <>
              <FileText className="w-12 h-12 text-green-600 mb-4" />
              <p className="text-lg font-medium">{selectedFile.name}</p>
              <p className="text-sm text-gray-500">
                {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
              </p>
              <button
                onClick={() => setSelectedFile(null)}
                className="mt-4 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-sm"
                disabled={isUploading}
              >
                <X className="w-4 h-4" /> Remove
              </button>
            </>
          ) : (
            <>
              <Upload className="w-12 h-12 text-blue-600 mb-4" />
              <p className="text-lg font-medium">Drop your PDF here</p>
              <p className="text-sm text-gray-500">or click to browse (max 10MB)</p>
            </>
          )}
        </div>
      </motion.div>

      {error && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-200">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {selectedFile && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {/* School */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">School *</label>
            <select
              value={school}
              onChange={(e) => setSchool(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={isUploading}
            >
              <option value="">Select school</option>
              {SCHOOLS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            {school === 'Other' && (
              <input
                type="text"
                value={customSchool}
                onChange={(e) => setCustomSchool(e.target.value)}
                placeholder="Enter school name"
                className="mt-2 w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500"
                disabled={isUploading}
              />
            )}
          </div>

          <div className="grid grid-cols-3 gap-4">
            {/* Year */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Year *</label>
              <input
                type="number"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                min="2000"
                max="2100"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500"
                disabled={isUploading}
              />
            </div>

            {/* Exam Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Exam Type *</label>
              <select
                value={examType}
                onChange={(e) => setExamType(e.target.value as ExamType)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500"
                disabled={isUploading}
              >
                {EXAM_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>

            {/* Paper Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Paper #</label>
              <select
                value={paperNumber}
                onChange={(e) => setPaperNumber(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500"
                disabled={isUploading}
              >
                <option value="">Optional</option>
                <option value="1">Paper 1</option>
                <option value="2">Paper 2</option>
              </select>
            </div>
          </div>

          {/* Submit */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSubmit}
            disabled={isUploading || !school}
            className="w-full py-4 rounded-xl font-bold text-lg text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUploading ? (
              <span className="flex items-center justify-center gap-2">
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                />
                Processing...
              </span>
            ) : (
              'Extract Content'
            )}
          </motion.button>
        </motion.div>
      )}
    </div>
  );
}
```

**Step 2: Commit**

```bash
git add components/import/PDFUploader.tsx
git commit -m "feat: Add PDFUploader component"
```

---

### Task 5.2: Create ImportProgress Component

**Files:**
- Create: `components/import/ImportProgress.tsx`

**Step 1: Create components/import/ImportProgress.tsx**

```tsx
'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FileSearch, Sparkles, CheckCircle } from 'lucide-react';
import { StatusResponse } from '@/lib/import-types';

interface ImportProgressProps {
  importId: string;
  onComplete: (questionsFound: number, lessonsFound: number) => void;
  onError: (error: string) => void;
}

const STEPS = [
  { id: 'upload', label: 'Uploading PDF', icon: FileSearch },
  { id: 'extract', label: 'Extracting text', icon: FileSearch },
  { id: 'analyze', label: 'AI Analysis', icon: Sparkles },
  { id: 'complete', label: 'Ready for review', icon: CheckCircle },
];

export function ImportProgress({ importId, onComplete, onError }: ImportProgressProps) {
  const [status, setStatus] = useState<StatusResponse | null>(null);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    let attempts = 0;

    const checkStatus = async () => {
      try {
        const response = await fetch(`/api/import/status/${importId}`);
        if (!response.ok) throw new Error('Failed to check status');

        const data: StatusResponse = await response.json();
        setStatus(data);

        if (data.status === 'processing') {
          setCurrentStep((prev) => Math.min(prev + 1, 2));
        } else if (data.status === 'ready_for_review') {
          setCurrentStep(3);
          clearInterval(interval);
          onComplete(data.questionsFound || 0, data.lessonsFound || 0);
        } else if (data.status === 'failed') {
          clearInterval(interval);
          onError(data.errorMessage || 'Import failed');
        }

        attempts++;
        if (attempts >= 120) { // 2 minute timeout
          clearInterval(interval);
          onError('Import timed out');
        }
      } catch (error) {
        attempts++;
        if (attempts >= 3) {
          clearInterval(interval);
          onError('Failed to check status');
        }
      }
    };

    checkStatus();
    interval = setInterval(checkStatus, 1000);

    return () => clearInterval(interval);
  }, [importId, onComplete, onError]);

  return (
    <div className="space-y-8">
      <div className="flex justify-center">
        <motion.div
          animate={{ y: [0, -10, 0], rotate: [0, 5, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center shadow-lg">
            <Sparkles className="w-12 h-12 text-white" />
          </div>
        </motion.div>
      </div>

      <div className="text-center">
        <h2 className="text-xl font-bold mb-2">
          {STEPS[currentStep]?.label || 'Processing...'}
        </h2>
        <p className="text-gray-500">
          {currentStep < 3
            ? 'Extracting questions and lessons from your PDF...'
            : 'Extraction complete!'}
        </p>
      </div>

      <div className="max-w-md mx-auto">
        <div className="relative">
          <div className="absolute top-5 left-5 right-5 h-0.5 bg-gray-200">
            <motion.div
              className="h-full bg-blue-500"
              initial={{ width: '0%' }}
              animate={{ width: `${(currentStep / 3) * 100}%` }}
            />
          </div>
          <div className="relative flex justify-between">
            {STEPS.map((step, index) => {
              const Icon = step.icon;
              const isActive = index <= currentStep;
              return (
                <div key={step.id} className="flex flex-col items-center">
                  <motion.div
                    animate={{ scale: index === currentStep ? 1.1 : 1 }}
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      isActive ? 'bg-blue-500' : 'bg-gray-200'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                  </motion.div>
                  <span className={`mt-2 text-xs ${isActive ? 'text-gray-900' : 'text-gray-400'}`}>
                    {step.label.split(' ')[0]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {status?.questionsFound !== undefined && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 text-green-700">
            <CheckCircle className="w-5 h-5" />
            <span>
              {status.questionsFound} questions, {status.lessonsFound || 0} lessons found
            </span>
          </div>
        </motion.div>
      )}
    </div>
  );
}
```

**Step 2: Commit**

```bash
git add components/import/ImportProgress.tsx
git commit -m "feat: Add ImportProgress component"
```

---

### Task 5.3: Create Review Components

**Files:**
- Create: `components/import/ExtractedQuestionCard.tsx`
- Create: `components/import/ExtractedLessonCard.tsx`
- Create: `components/import/ImportReview.tsx`

**Step 1: Create components/import/ExtractedQuestionCard.tsx**

```tsx
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronUp, Edit2, Check, X } from 'lucide-react';
import { ExtractedQuestion, H2Topic } from '@/lib/import-types';

interface Props {
  question: ExtractedQuestion;
  onUpdate: (updated: ExtractedQuestion) => void;
  onRemove: () => void;
}

const TOPICS: { value: H2Topic; label: string }[] = [
  { value: 'vectors', label: 'Vectors' },
  { value: 'probability', label: 'Probability' },
  { value: 'statistics', label: 'Statistics' },
  { value: 'combinatorics', label: 'Combinatorics' },
  { value: 'calculus', label: 'Calculus' },
  { value: 'complex-numbers', label: 'Complex Numbers' },
  { value: 'functions', label: 'Functions' },
];

export function ExtractedQuestionCard({ question, onUpdate, onRemove }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState(question);

  const handleSave = () => {
    onUpdate(editData);
    setEditing(false);
  };

  const confidenceColor = question.confidence >= 0.7
    ? 'bg-green-100 text-green-700'
    : question.confidence >= 0.5
    ? 'bg-yellow-100 text-yellow-700'
    : 'bg-red-100 text-red-700';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="border rounded-xl p-4 bg-white shadow-sm"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700">
              {TOPICS.find(t => t.value === question.topic)?.label || question.topic}
            </span>
            <span className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-700">
              Difficulty {question.difficulty}
            </span>
            <span className={`px-2 py-1 text-xs rounded-full ${confidenceColor}`}>
              {Math.round(question.confidence * 100)}% confidence
            </span>
            {question.questionNum && (
              <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700">
                {question.questionNum}
              </span>
            )}
          </div>
          <p className="text-gray-800 line-clamp-2">{question.content}</p>
        </div>
        <div className="flex items-center gap-2 ml-4">
          <button
            onClick={() => setEditing(!editing)}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          <button
            onClick={onRemove}
            className="p-2 rounded-lg hover:bg-red-100 text-red-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {expanded && !editing && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          className="mt-4 pt-4 border-t space-y-3"
        >
          <div>
            <h4 className="text-sm font-medium text-gray-500">Full Question</h4>
            <p className="mt-1 text-gray-800 whitespace-pre-wrap">{question.content}</p>
          </div>
          {question.answer && (
            <div>
              <h4 className="text-sm font-medium text-gray-500">Answer</h4>
              <p className="mt-1 text-gray-800">{question.answer}</p>
            </div>
          )}
          {question.solution && (
            <div>
              <h4 className="text-sm font-medium text-gray-500">Solution</h4>
              <p className="mt-1 text-gray-800 whitespace-pre-wrap">{question.solution}</p>
            </div>
          )}
        </motion.div>
      )}

      {editing && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          className="mt-4 pt-4 border-t space-y-4"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
            <textarea
              value={editData.content}
              onChange={(e) => setEditData({ ...editData, content: e.target.value })}
              rows={4}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Topic</label>
              <select
                value={editData.topic}
                onChange={(e) => setEditData({ ...editData, topic: e.target.value as H2Topic })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                {TOPICS.map(t => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
              <select
                value={editData.difficulty}
                onChange={(e) => setEditData({ ...editData, difficulty: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                {[1, 2, 3, 4, 5].map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Answer</label>
            <input
              value={editData.answer || ''}
              onChange={(e) => setEditData({ ...editData, answer: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setEditing(false)}
              className="px-4 py-2 rounded-lg border hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-2"
            >
              <Check className="w-4 h-4" /> Save
            </button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
```

**Step 2: Create components/import/ExtractedLessonCard.tsx**

```tsx
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronUp, Edit2, Check, X, BookOpen } from 'lucide-react';
import { ExtractedLesson, H2Topic, ContentType } from '@/lib/import-types';

interface Props {
  lesson: ExtractedLesson;
  onUpdate: (updated: ExtractedLesson) => void;
  onRemove: () => void;
}

const CONTENT_TYPES: { value: ContentType; label: string }[] = [
  { value: 'theory', label: 'Theory' },
  { value: 'example', label: 'Example' },
  { value: 'worked_solution', label: 'Worked Solution' },
  { value: 'summary', label: 'Summary' },
];

export function ExtractedLessonCard({ lesson, onUpdate, onRemove }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState(lesson);

  const handleSave = () => {
    onUpdate(editData);
    setEditing(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="border rounded-xl p-4 bg-white shadow-sm"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="w-4 h-4 text-green-600" />
            <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">
              {CONTENT_TYPES.find(t => t.value === lesson.contentType)?.label}
            </span>
            <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700">
              {lesson.topic}
            </span>
          </div>
          <h3 className="font-medium text-gray-900">{lesson.title}</h3>
          <p className="text-gray-600 text-sm line-clamp-2 mt-1">{lesson.content}</p>
        </div>
        <div className="flex items-center gap-2 ml-4">
          <button onClick={() => setEditing(!editing)} className="p-2 rounded-lg hover:bg-gray-100">
            <Edit2 className="w-4 h-4" />
          </button>
          <button onClick={() => setExpanded(!expanded)} className="p-2 rounded-lg hover:bg-gray-100">
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          <button onClick={onRemove} className="p-2 rounded-lg hover:bg-red-100 text-red-600">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {expanded && !editing && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          className="mt-4 pt-4 border-t"
        >
          <p className="text-gray-800 whitespace-pre-wrap">{lesson.content}</p>
        </motion.div>
      )}

      {editing && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          className="mt-4 pt-4 border-t space-y-4"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              value={editData.title}
              onChange={(e) => setEditData({ ...editData, title: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
            <textarea
              value={editData.content}
              onChange={(e) => setEditData({ ...editData, content: e.target.value })}
              rows={6}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Content Type</label>
            <select
              value={editData.contentType}
              onChange={(e) => setEditData({ ...editData, contentType: e.target.value as ContentType })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              {CONTENT_TYPES.map(t => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>
          <div className="flex justify-end gap-2">
            <button onClick={() => setEditing(false)} className="px-4 py-2 rounded-lg border hover:bg-gray-50">
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-2"
            >
              <Check className="w-4 h-4" /> Save
            </button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
```

**Step 3: Commit**

```bash
git add components/import/ExtractedQuestionCard.tsx components/import/ExtractedLessonCard.tsx
git commit -m "feat: Add review card components for questions and lessons"
```

---

### Task 5.4: Create Import Page

**Files:**
- Create: `app/import/page.tsx`
- Create: `components/import/ImportClient.tsx`

**Step 1: Create components/import/ImportClient.tsx**

```tsx
'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Save, FileText, BookOpen } from 'lucide-react';
import { PDFUploader } from './PDFUploader';
import { ImportProgress } from './ImportProgress';
import { ExtractedQuestionCard } from './ExtractedQuestionCard';
import { ExtractedLessonCard } from './ExtractedLessonCard';
import {
  ExtractedQuestion,
  ExtractedLesson,
  ImportMetadata,
  ExamType,
} from '@/lib/import-types';

type Step = 'upload' | 'processing' | 'review' | 'complete';

export function ImportClient() {
  const [step, setStep] = useState<Step>('upload');
  const [importId, setImportId] = useState<string | null>(null);
  const [questions, setQuestions] = useState<ExtractedQuestion[]>([]);
  const [lessons, setLessons] = useState<ExtractedLesson[]>([]);
  const [metadata, setMetadata] = useState<ImportMetadata | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'questions' | 'lessons'>('questions');

  const handleUpload = useCallback(async (
    file: File,
    school: string,
    year: number,
    examType: ExamType,
    paperNumber?: number
  ) => {
    setError(null);
    setStep('processing');
    setMetadata({ filename: file.name, school, year, examType, paperNumber });

    const formData = new FormData();
    formData.append('file', file);
    formData.append('school', school);
    formData.append('year', year.toString());
    formData.append('examType', examType);
    if (paperNumber) formData.append('paperNumber', paperNumber.toString());

    try {
      const response = await fetch('/api/import/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!data.success) {
        setError(data.error || 'Upload failed');
        setStep('upload');
        return;
      }

      setImportId(data.importId);
    } catch (err) {
      setError('Failed to upload file');
      setStep('upload');
    }
  }, []);

  const handleProcessingComplete = useCallback(async (questionsFound: number, lessonsFound: number) => {
    if (!importId) return;

    try {
      const response = await fetch(`/api/import/status/${importId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'get_content' }),
      });

      const data = await response.json();
      setQuestions(data.questions || []);
      setLessons(data.lessons || []);
      setMetadata(data.metadata);
      setStep('review');
    } catch (err) {
      setError('Failed to load extracted content');
    }
  }, [importId]);

  const handleSave = useCallback(async () => {
    if (!importId || !metadata) return;

    setIsSaving(true);
    try {
      const response = await fetch('/api/import/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ importId, questions, lessons, metadata }),
      });

      const data = await response.json();
      if (data.success) {
        setStep('complete');
      } else {
        setError(data.error || 'Save failed');
      }
    } catch (err) {
      setError('Failed to save content');
    } finally {
      setIsSaving(false);
    }
  }, [importId, questions, lessons, metadata]);

  const handleQuestionUpdate = (index: number, updated: ExtractedQuestion) => {
    setQuestions(qs => qs.map((q, i) => i === index ? updated : q));
  };

  const handleLessonUpdate = (index: number, updated: ExtractedLesson) => {
    setLessons(ls => ls.map((l, i) => i === index ? updated : l));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Import PDF</h1>
          <p className="text-gray-600 mt-2">
            Extract H2 Math questions and lesson content from exam papers
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
            {error}
          </div>
        )}

        <AnimatePresence mode="wait">
          {step === 'upload' && (
            <motion.div
              key="upload"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <PDFUploader onUpload={handleUpload} isUploading={false} />
            </motion.div>
          )}

          {step === 'processing' && importId && (
            <motion.div
              key="processing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <ImportProgress
                importId={importId}
                onComplete={handleProcessingComplete}
                onError={(err) => { setError(err); setStep('upload'); }}
              />
            </motion.div>
          )}

          {step === 'review' && (
            <motion.div
              key="review"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setStep('upload')}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
                >
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving || (questions.length === 0 && lessons.length === 0)}
                  className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {isSaving ? 'Saving...' : 'Save All'}
                </button>
              </div>

              {/* Tabs */}
              <div className="flex gap-2 border-b">
                <button
                  onClick={() => setActiveTab('questions')}
                  className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
                    activeTab === 'questions'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  Questions ({questions.length})
                </button>
                <button
                  onClick={() => setActiveTab('lessons')}
                  className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
                    activeTab === 'lessons'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <BookOpen className="w-4 h-4" />
                  Lessons ({lessons.length})
                </button>
              </div>

              {/* Content */}
              <div className="space-y-4">
                {activeTab === 'questions' && questions.map((q, i) => (
                  <ExtractedQuestionCard
                    key={q.tempId}
                    question={q}
                    onUpdate={(updated) => handleQuestionUpdate(i, updated)}
                    onRemove={() => setQuestions(qs => qs.filter((_, idx) => idx !== i))}
                  />
                ))}
                {activeTab === 'lessons' && lessons.map((l, i) => (
                  <ExtractedLessonCard
                    key={l.tempId}
                    lesson={l}
                    onUpdate={(updated) => handleLessonUpdate(i, updated)}
                    onRemove={() => setLessons(ls => ls.filter((_, idx) => idx !== i))}
                  />
                ))}
                {activeTab === 'questions' && questions.length === 0 && (
                  <p className="text-center text-gray-500 py-8">No questions extracted</p>
                )}
                {activeTab === 'lessons' && lessons.length === 0 && (
                  <p className="text-center text-gray-500 py-8">No lessons extracted</p>
                )}
              </div>
            </motion.div>
          )}

          {step === 'complete' && (
            <motion.div
              key="complete"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16"
            >
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
                <Save className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Import Complete!</h2>
              <p className="text-gray-600 mb-8">
                Successfully saved {questions.length} questions and {lessons.length} lessons
              </p>
              <button
                onClick={() => {
                  setStep('upload');
                  setImportId(null);
                  setQuestions([]);
                  setLessons([]);
                  setMetadata(null);
                }}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
              >
                Import Another PDF
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
```

**Step 2: Create app/import/page.tsx**

```tsx
import { ImportClient } from '@/components/import/ImportClient';

export default function ImportPage() {
  return <ImportClient />;
}
```

**Step 3: Commit**

```bash
git add components/import/ImportClient.tsx app/import/page.tsx
git commit -m "feat: Add import page with full workflow"
```

---

## Phase 6: Final Integration

### Task 6.1: Add Navigation Link to Import Page

**Files:**
- Modify: `components/layout/AppLayout.tsx` or equivalent navigation component

**Step 1: Add import link to navigation**

Find the navigation component and add a link to `/import`:

```tsx
<Link href="/import" className="...">
  Import PDF
</Link>
```

**Step 2: Verify full flow works**

```bash
npm run dev
```

1. Navigate to `/import`
2. Upload a test PDF
3. Verify extraction works (requires Ollama running with qwen2.5:32b)
4. Review and save content

**Step 3: Commit**

```bash
git add -A
git commit -m "feat: Add navigation link to import page"
```

---

### Task 6.2: Final Testing and Cleanup

**Step 1: Run lint**

```bash
npm run lint
```

Fix any lint errors.

**Step 2: Run build**

```bash
npm run build
```

Fix any build errors.

**Step 3: Final commit**

```bash
git add -A
git commit -m "chore: Fix lint and build errors"
```

---

## Summary

This plan converts math-visualise from Vite to Next.js and adds a complete PDF import system:

- **Phase 1**: Convert Vite → Next.js (2 tasks)
- **Phase 2**: Set up Prisma + SQLite (1 task)
- **Phase 3**: Port PDF extraction utilities (4 tasks)
- **Phase 4**: Create API routes (3 tasks)
- **Phase 5**: Create import UI components (4 tasks)
- **Phase 6**: Final integration (2 tasks)

**Total: 16 tasks**

Each task has explicit file paths, complete code, and commit instructions.
