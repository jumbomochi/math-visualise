# PDF Import Feature - Progress Document

> **Last Updated:** 2026-01-28

## Overview

Implementing a PDF import feature for H2 Mathematics exam papers. The system extracts questions from PDFs using a local Ollama LLM, allows manual diagram uploads, and saves to SQLite via Prisma.

## Current Status: In Progress

The feature is functional but has reliability issues with the AI extraction returning inconsistent JSON formats.

---

## What's Been Implemented

### 1. Database Schema (Prisma + SQLite)

**File:** `prisma/schema.prisma`

```prisma
model ImportedPDF {
  id, filename, source, pageCount, status, errorMessage, extractedData,
  questionsCount, lessonsCount, createdAt, completedAt
  → relations to ExtractedQuestion[] and ExtractedLesson[]
}

model ExtractedQuestion {
  id, pdfId, content, solution, answer, hints, diagramImage, marks,
  topic, difficulty, confidence, school, year, examType, paperNumber, questionNum
}

model ExtractedLesson {
  id, pdfId, title, content, contentType, topic, order
}
```

### 2. Type Definitions

**File:** `lib/import-types.ts`

- `ImportStatus`: 'processing' | 'ready_for_review' | 'completed' | 'failed'
- `H2Topic`: 'vectors' | 'probability' | 'statistics' | 'combinatorics' | 'calculus' | 'complex-numbers' | 'functions'
- `ExamType`: 'midyear' | 'promo' | 'prelim' | 'topical'
- `ExtractedQuestion`: includes `diagramImage` (base64) and `marks` fields
- API types: `UploadResponse`, `StatusResponse`, `SaveRequest`, `SaveResponse`

### 3. PDF Text Extraction

**File:** `lib/pdf-extractor.ts`

- Uses `pdf-parse@1.1.1` (v2 had Web Worker issues with Next.js)
- Functions: `extractTextFromPDF()`, `isValidPDF()`, `checkPDFLimits()`

### 4. Ollama Client

**File:** `lib/ollama-client.ts`

- Supports both text and vision models
- Configurable via env vars: `OLLAMA_MODEL`, `OLLAMA_VISION_MODEL`, `OLLAMA_BASE_URL`
- 10-minute timeout for slow models
- JSON mode enabled for text extraction

### 5. AI Content Extraction

**File:** `lib/content-ai-extractor.ts`

- Extracts questions from PDF text using Ollama
- Chunks long documents (10k chars per chunk)
- **Normalization function** handles various JSON formats the model might return:
  - `questionNum`, `questionNumber`, `question_number`, `number`, `num`
  - `content`, `text`, or `parts` array
- Merges multi-part questions by question number
- Validates topics against H2 syllabus

### 6. API Routes

**Files:**
- `app/api/import/upload/route.ts` - Handles PDF upload, extraction, stores in DB
- `app/api/import/status/[id]/route.ts` - GET status, POST to get extracted data
- `app/api/import/save/route.ts` - Saves reviewed questions to DB

### 7. UI Components

**File:** `components/import/ExtractedQuestionCard.tsx`

- Displays extracted questions with topic, difficulty, confidence badges
- Inline editing of content, topic, difficulty, marks
- **Diagram upload**: Click image icon or "Upload Diagram" button
- Shows "Needs Diagram" badge when AI detects diagram reference
- Uses `MathContent` for LaTeX rendering

**File:** `components/ui/MathContent.tsx` (NEW)

- Parses mixed text/LaTeX content
- Renders `$...$` as inline math, `$$...$$` as block math
- Also supports `\(...\)` and `\[...\]` delimiters
- Uses KaTeX (already installed in project)

**File:** `app/import/page.tsx`

- Upload form with school, year, exam type, paper number
- Review interface showing extracted questions
- Save button to finalize import

---

## Environment Configuration

**File:** `.env`

```env
DATABASE_URL="file:./dev.db"
OLLAMA_MODEL="qwen2.5:3b"       # Use 3b for speed, 32b times out
OLLAMA_VISION_MODEL="llava:13b"  # Not currently used
```

---

## Known Issues & Next Steps

### Issue 1: Inconsistent AI JSON Output

**Problem:** The Ollama model returns different JSON structures each time:
- Sometimes `questionNum`, sometimes `questionNumber`, sometimes `question_number`
- Sometimes `content`, sometimes `text`, sometimes `parts` array
- Topic classification is unreliable

**Current Mitigation:** Added normalization function that handles multiple field names.

**Potential Solutions:**
1. Use a more capable model (but 32B times out)
2. Add retry logic with format validation
3. Use structured output/function calling if model supports it
4. Consider using Claude API for extraction (user has subscription but it's separate from API)

### Issue 2: LaTeX Formatting

**Problem:** Model doesn't consistently wrap math in `$...$` delimiters.

**Current State:** Prompt instructs model to use delimiters, but compliance is inconsistent.

**Solution:** May need post-processing to detect and wrap math expressions.

### Issue 3: Diagram Detection

**Current:** AI sets `hasDiagram: true` based on text references. User manually uploads screenshots.

**Working as designed** - vision models (LLaVA) were tested but hallucinated badly on math content.

---

## Files Modified/Created

### New Files
- `lib/pdf-extractor.ts`
- `lib/ollama-client.ts`
- `lib/content-ai-extractor.ts`
- `lib/import-types.ts`
- `lib/db.ts` (Prisma client singleton)
- `app/api/import/upload/route.ts`
- `app/api/import/status/[id]/route.ts`
- `app/api/import/save/route.ts`
- `app/import/page.tsx`
- `components/import/ExtractedQuestionCard.tsx`
- `components/ui/MathContent.tsx`
- `prisma/schema.prisma`
- `prisma/prisma.config.ts`

### Modified Files
- `package.json` - Added dependencies
- `.env` - Added config vars
- `.gitignore` - Added `*.db` for SQLite

---

## Dependencies Added

```json
{
  "pdf-parse": "^1.1.1",
  "@prisma/client": "^7.3.0",
  "@prisma/adapter-libsql": "^7.3.0"
}
```

Dev dependencies:
```json
{
  "prisma": "^7.3.0"
}
```

Already existed (used for math rendering):
- `katex`, `react-katex`

---

## How to Continue

### 1. Start the dev server
```bash
npm run dev
```

### 2. Ensure Ollama is running with model
```bash
ollama run qwen2.5:3b
```

### 3. Test at http://localhost:3000/import

### 4. Debug extraction issues
Check server console for:
- "Raw AI response" - see what the model returns
- "Normalizing question" - see field detection
- "Parsed successfully" - see raw vs normalized counts

### 5. Key file for fixing extraction
`lib/content-ai-extractor.ts` - modify prompt or normalization logic

---

## Alternative Approaches Considered

1. **Vision-based extraction (LLaVA)** - Tried, but model hallucinated completely wrong content
2. **Claude API** - User has Claude Code subscription but that's separate from API access
3. **Larger Ollama model (32B)** - Times out due to slow inference

---

## Database Commands

```bash
# Push schema changes
npx prisma db push

# Regenerate client
npx prisma generate

# View data (opens browser)
npx prisma studio
```
