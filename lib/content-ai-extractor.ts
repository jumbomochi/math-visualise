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
