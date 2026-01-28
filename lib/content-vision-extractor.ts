// Vision-based extraction of questions from PDF page images

import { ollama } from './ollama-client';
import { convertPDFToImages, isPopplerAvailable } from './pdf-to-images';
import {
  ExtractedQuestion,
  ExtractedLesson,
  ExtractionResult,
  ImportMetadata,
  H2Topic,
} from './import-types';

const VISION_EXTRACTION_PROMPT = `You are analyzing a page from a Singapore H2 Mathematics exam paper.

IMPORTANT RULES:
1. Extract COMPLETE questions - keep all parts together (e.g., Q5(i), Q5(ii), Q5(iii) are ONE question with multiple parts)
2. Include ALL mathematical content: equations, expressions, conditions
3. Describe any DIAGRAMS in detail: graphs, geometric figures, coordinate systems, etc.
4. Use LaTeX notation for all math: \\frac{a}{b}, \\int, \\sum, \\vec{a}, etc.

For each question found, provide:
- questionNum: Main question number (e.g., "Q5" not "Q5(i)")
- content: Full question text with ALL parts. Format parts clearly:
  "(i) first part...
   (ii) second part...
   (iii) third part..."
- diagram: If there's a diagram, describe it in detail (e.g., "Graph showing y = x^2 with vertex at origin, x-axis from -3 to 3")
- topic: One of: vectors, probability, statistics, combinatorics, calculus, complex-numbers, functions
- difficulty: 1-5 (1=basic, 5=olympiad)
- marks: Total marks if shown (e.g., "[10]" means 10 marks)

Respond with ONLY valid JSON in this exact format:
{
  "questions": [
    {
      "questionNum": "Q1",
      "content": "Full question with all parts (i), (ii), etc.",
      "diagram": "Description of any diagram, or null if none",
      "topic": "calculus",
      "difficulty": 3,
      "marks": 10,
      "confidence": 0.9
    }
  ],
  "pageInfo": "Brief description of what's on this page"
}

If this page has no questions (e.g., it's instructions or blank), return:
{"questions": [], "pageInfo": "description of page content"}`;

interface PageExtractionResult {
  questions: Array<{
    questionNum: string;
    content: string;
    diagram: string | null;
    topic: string;
    difficulty: number;
    marks?: number;
    confidence: number;
  }>;
  pageInfo: string;
}

/**
 * Extract questions from PDF using vision model on page images
 */
export async function extractContentWithVision(
  pdfBuffer: Buffer,
  metadata: ImportMetadata
): Promise<ExtractionResult> {
  // Check prerequisites
  if (!isPopplerAvailable()) {
    throw new Error('Poppler (pdftoppm) is not installed. Install with: brew install poppler');
  }

  const hasVision = await ollama.hasVisionModel();
  if (!hasVision) {
    throw new Error('No vision model available. Install with: ollama pull llava:13b');
  }

  console.log('Converting PDF to images...');
  const { pages, totalPages, cleanup } = await convertPDFToImages(pdfBuffer, {
    dpi: 150,
    format: 'png',
  });

  console.log(`Converted ${totalPages} pages to images`);

  const allQuestions: ExtractedQuestion[] = [];
  const questionsByNum = new Map<string, ExtractedQuestion>();

  try {
    // Process each page
    for (let i = 0; i < pages.length; i++) {
      const page = pages[i];
      console.log(`Processing page ${page.pageNumber}/${totalPages}...`);

      try {
        const response = await ollama.analyzeImage(
          page.base64,
          VISION_EXTRACTION_PROMPT,
          { temperature: 0.2, maxTokens: 4096, timeoutMs: 300000 }
        );

        const parsed = parseVisionResponse(response);
        console.log(`Page ${page.pageNumber}: Found ${parsed.questions.length} questions`);

        // Process questions from this page
        for (const q of parsed.questions) {
          const questionNum = normalizeQuestionNum(q.questionNum);

          // Check if we already have this question (from previous page)
          const existing = questionsByNum.get(questionNum);

          if (existing) {
            // Merge content if question continues from previous page
            existing.content += '\n\n' + q.content;
            if (q.diagram && !existing.diagram) {
              existing.diagram = q.diagram;
            }
          } else {
            // New question
            const extracted: ExtractedQuestion = {
              tempId: `q-${Date.now()}-${i}-${questionsByNum.size}`,
              content: q.content,
              diagram: q.diagram || undefined,
              topic: validateTopic(q.topic),
              difficulty: Math.min(5, Math.max(1, q.difficulty || 2)),
              confidence: q.confidence || 0.8,
              questionNum,
              marks: q.marks,
              needsReview: q.confidence < 0.7,
            };
            questionsByNum.set(questionNum, extracted);
          }
        }
      } catch (error) {
        console.error(`Error processing page ${page.pageNumber}:`, error);
        // Continue with other pages
      }
    }

    // Convert map to array, sorted by question number
    const sortedQuestions = Array.from(questionsByNum.values()).sort((a, b) => {
      const numA = parseInt(a.questionNum?.replace(/\D/g, '') || '0');
      const numB = parseInt(b.questionNum?.replace(/\D/g, '') || '0');
      return numA - numB;
    });

    allQuestions.push(...sortedQuestions);
  } finally {
    // Clean up temp files
    cleanup();
  }

  return {
    questions: allQuestions,
    lessons: [], // Vision extraction focuses on questions
    metadata,
  };
}

function parseVisionResponse(response: string): PageExtractionResult {
  // Try to extract JSON from response
  let jsonStr = response;

  // Remove markdown code blocks if present
  const jsonMatch = response.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (jsonMatch) {
    jsonStr = jsonMatch[1];
  }

  // Find JSON object
  const jsonStart = jsonStr.indexOf('{');
  const jsonEnd = jsonStr.lastIndexOf('}');
  if (jsonStart !== -1 && jsonEnd !== -1) {
    jsonStr = jsonStr.slice(jsonStart, jsonEnd + 1);
  }

  try {
    const parsed = JSON.parse(jsonStr);
    return {
      questions: Array.isArray(parsed.questions) ? parsed.questions : [],
      pageInfo: parsed.pageInfo || '',
    };
  } catch (error) {
    console.error('Failed to parse vision response:', error);
    console.error('Response was:', response.slice(0, 500));
    return { questions: [], pageInfo: 'Parse error' };
  }
}

function normalizeQuestionNum(num: string): string {
  if (!num) return 'Q?';

  // Remove parts like (i), (ii), (a), (b) to get main question number
  const mainNum = num.replace(/\s*\([ivxabc]+\)/gi, '').trim();

  // Ensure it starts with Q
  if (!mainNum.toLowerCase().startsWith('q')) {
    return `Q${mainNum}`;
  }

  return mainNum.toUpperCase();
}

const VALID_TOPICS: H2Topic[] = [
  'vectors',
  'probability',
  'statistics',
  'combinatorics',
  'calculus',
  'complex-numbers',
  'functions',
];

function validateTopic(topic: string): H2Topic {
  const normalized = topic?.toLowerCase().replace(/\s+/g, '-');
  if (VALID_TOPICS.includes(normalized as H2Topic)) {
    return normalized as H2Topic;
  }

  // Try to map common variations
  const topicMap: Record<string, H2Topic> = {
    'integration': 'calculus',
    'differentiation': 'calculus',
    'derivatives': 'calculus',
    'integrals': 'calculus',
    'series': 'calculus',
    'sequences': 'calculus',
    'complex': 'complex-numbers',
    'argand': 'complex-numbers',
    'vector': 'vectors',
    '3d': 'vectors',
    'planes': 'vectors',
    'lines': 'vectors',
    'permutations': 'combinatorics',
    'combinations': 'combinatorics',
    'pnc': 'combinatorics',
    'distribution': 'statistics',
    'hypothesis': 'statistics',
    'regression': 'statistics',
    'correlation': 'statistics',
    'graphs': 'functions',
    'transformations': 'functions',
  };

  for (const [key, value] of Object.entries(topicMap)) {
    if (normalized?.includes(key)) {
      return value;
    }
  }

  return 'calculus'; // Default fallback
}
