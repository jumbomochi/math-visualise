# PDF Import System Design

## Overview

Add a PDF import system to math-visualise for extracting H2 Math questions and lesson content from school exam papers. This requires converting the project from Vite to Next.js and porting the import functionality from sg-math-pal.

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     Next.js App                         │
├─────────────────────────────────────────────────────────┤
│  Frontend (existing)         │  New Backend             │
│  ─────────────────────       │  ───────────────────     │
│  • Visualization modules     │  • /api/import/upload    │
│  • TI-84 Calculator          │  • /api/import/status    │
│  • Syllabus Navigator        │  • /api/import/save      │
│  • UI Components             │  • /api/content          │
├─────────────────────────────────────────────────────────┤
│                     Prisma + SQLite                     │
│  ─────────────────────────────────────────────────────  │
│  • ImportedPDF (file metadata, status)                  │
│  • ExtractedQuestion (math practice questions)          │
│  • ExtractedLesson (lesson content)                     │
└─────────────────────────────────────────────────────────┘
```

## AI Extraction

**Model:** Local Ollama with Qwen 2.5 32B
- Runs locally, no API costs
- ~20GB RAM usage during inference
- Configure short keep-alive to free memory when idle

**Environment:**
```
DATABASE_URL="file:./dev.db"
OLLAMA_BASE_URL="http://localhost:11434"
OLLAMA_MODEL="qwen2.5:32b"
OLLAMA_KEEP_ALIVE="1m"
```

## Data Models

### ImportedPDF
Tracks uploaded PDF files and their processing status.

```prisma
model ImportedPDF {
  id            String   @id @default(cuid())
  filename      String
  source        String?
  pageCount     Int
  status        String   // processing | ready_for_review | completed | failed
  errorMessage  String?
  extractedData Json?
  createdAt     DateTime @default(now())

  questions     ExtractedQuestion[]
  lessons       ExtractedLesson[]
}
```

### ExtractedQuestion
Math practice questions with school paper metadata.

```prisma
model ExtractedQuestion {
  id           String   @id @default(cuid())
  pdfId        String
  pdf          ImportedPDF @relation(fields: [pdfId], references: [id])

  // Content
  content      String   // Question text (supports LaTeX)
  solution     String?  // Worked solution
  answer       String?  // Final answer
  hints        Json?    // Array of hints

  // Classification
  topic        String   // vectors, probability, statistics, etc.
  difficulty   Int      // 1-5 scale
  confidence   Float    // AI confidence score

  // Paper metadata
  school       String   // e.g., "Raffles Institution", "Hwa Chong"
  year         Int      // e.g., 2024
  examType     String   // midyear | promo | prelim | topical
  paperNumber  Int?     // Paper 1 or Paper 2
  questionNum  String?  // e.g., "Q5", "Q10(iii)"

  createdAt    DateTime @default(now())
}
```

### ExtractedLesson
Lesson content (explanations, examples, theory).

```prisma
model ExtractedLesson {
  id           String   @id @default(cuid())
  pdfId        String
  pdf          ImportedPDF @relation(fields: [pdfId], references: [id])
  title        String
  content      String   // Markdown/LaTeX content
  contentType  String   // theory | example | worked_solution | summary
  topic        String   // Maps to syllabus
  order        Int      // Sequence within the PDF
  createdAt    DateTime @default(now())
}
```

## Import Workflow

```
┌──────────────┐    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│   Upload     │ →  │   Extract    │ →  │   Review     │ →  │    Save      │
│   PDF +      │    │   Text +     │    │   & Edit     │    │   to DB      │
│   Metadata   │    │   AI Parse   │    │   Content    │    │              │
└──────────────┘    └──────────────┘    └──────────────┘    └──────────────┘
```

**Upload form fields:**
- File (PDF, max 10MB)
- School name (dropdown with common schools + custom entry)
- Year (number input)
- Exam type (dropdown: Midyear, Promo, Prelim, Topical Test)
- Paper number (optional: 1 or 2)

**Processing:**
1. PDF text extraction (with OCR fallback for scanned papers)
2. Send to Qwen 32B with H2 Math-specific prompt
3. Parse response, assign confidence scores
4. Store for user review before final save

**AI extraction output:**
```json
{
  "questions": [
    {
      "content": "Find the angle between vectors...",
      "solution": "Step 1: ...",
      "answer": "45°",
      "topic": "vectors",
      "difficulty": 3,
      "questionNum": "Q5(a)"
    }
  ],
  "lessons": [
    {
      "title": "Properties of Dot Product",
      "content": "The dot product a·b = |a||b|cos θ...",
      "contentType": "theory",
      "topic": "vectors",
      "order": 1
    }
  ]
}
```

## File Structure

```
math-visualise/
├── app/                        # Next.js App Router
│   ├── layout.tsx
│   ├── page.tsx
│   ├── import/
│   │   └── page.tsx
│   └── api/
│       └── import/
│           ├── upload/route.ts
│           ├── status/[id]/route.ts
│           └── save/route.ts
├── components/
│   ├── ui/
│   ├── layout/
│   ├── tools/
│   ├── import/
│   │   ├── PDFUploader.tsx
│   │   ├── ImportProgress.tsx
│   │   ├── ExtractedQuestionCard.tsx
│   │   ├── ExtractedLessonCard.tsx
│   │   └── ImportSummary.tsx
│   └── visualizations/
├── modules/                    # Existing visualization modules
├── lib/
│   ├── pdf-extractor.ts
│   ├── ocr-extractor.ts
│   ├── question-ai-extractor.ts
│   ├── import-types.ts
│   └── ollama-client.ts        # Ollama API client
├── prisma/
│   └── schema.prisma
└── math/                       # Existing math utilities
```

## Implementation Phases

### Phase 1: Convert to Next.js
- Initialize Next.js with App Router
- Migrate existing components/modules
- Update build config, verify visualizations work

### Phase 2: Add Database
- Set up Prisma with SQLite
- Create schema
- Generate Prisma client

### Phase 3: Port Import Backend
- Create API routes
- Install dependencies (pdf-parse, tesseract.js)
- Create Ollama client for Qwen 32B
- Modify AI extractor for dual content extraction

### Phase 4: Port Import Frontend
- Copy UI components from sg-math-pal
- Add school/year/examType fields to upload form
- Create ExtractedLessonCard component
- Add import page to navigation

### Phase 5: Integration
- Link imported content to visualization modules
- Add question/lesson browser UI
- Filter by school, year, topic, exam type

## Dependencies to Add

```json
{
  "dependencies": {
    "next": "^14.2.0",
    "@prisma/client": "^6.0.0",
    "pdf-parse": "^1.1.1",
    "pdfjs-dist": "^4.0.0",
    "tesseract.js": "^7.0.0",
    "zod": "^3.23.0"
  },
  "devDependencies": {
    "prisma": "^6.0.0"
  }
}
```

## Topics Mapping

Questions and lessons map to existing syllabus modules:
- `vectors` - 3D vectors, dot/cross product, lines/planes
- `probability` - Basic probability, conditional, tree diagrams
- `statistics` - Distributions, hypothesis testing, correlation
- `combinatorics` - Permutations, combinations, slot method
- `calculus` - Differentiation, integration
- `complex-numbers` - Complex number operations
- `functions` - Functions and graphs
