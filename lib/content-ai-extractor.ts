// AI-powered extraction of questions from PDF text

import { ollama } from './ollama-client';
import {
  ExtractedQuestion,
  ExtractedLesson,
  ExtractionResult,
  ImportMetadata,
  H2Topic,
} from './import-types';

const EXTRACTION_SYSTEM_PROMPT = `You extract math questions from Singapore H2 Mathematics exam papers into JSON.

CRITICAL RULES:
1. Keep multi-part questions TOGETHER as ONE question (Q1 with parts (i), (ii), (iii) is ONE question)
2. Include ALL text exactly as written - equations, conditions, "Hence" parts, mark allocations
3. Note if a question has a diagram by setting hasDiagram: true
4. Wrap ALL math expressions in dollar signs: $\\frac{a}{b}$, $\\sqrt{x}$, $\\int_0^1 f(x) dx$
5. Use $...$ for inline math and $$...$$ for displayed equations

Topics (use exact slug):
- vectors, probability, statistics, combinatorics, calculus, complex-numbers, functions

Output ONLY this JSON structure:
{
  "questions": [
    {
      "questionNum": "1",
      "content": "Solve the equation $x^2 + 2x + 1 = 0$.\n(i) Find the roots [2]\n(ii) Hence find $\\sum_{n=1}^{\\infty} x^n$ [3]",
      "marks": 5,
      "hasDiagram": false,
      "topic": "calculus",
      "difficulty": 2,
      "confidence": 0.9
    }
  ]
}

Example of correct extraction:
Question: "1  Solve exactly the inequality 32x/(x-4) <= x+12 [3]  Hence solve... [2]"
Should become: questionNum "1", content with math wrapped: "Solve exactly the inequality $\\frac{32x}{x-4} \\leq x+12$ [3]\\n\\nHence solve... [2]", marks: 5

Question: "3  The diagram below shows... (i) Sketch the curve y=f(x) [2]"
Should become: questionNum "3", hasDiagram: true, content: "The diagram below shows...\\n(i) Sketch the curve $y = f(x)$ [2]"`;

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
  const questionsByNum = new Map<string, ExtractedQuestion>();

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
          content: `Extract all questions from this H2 Math paper. Keep multi-part questions together as single questions.${chunkContext}\n\n---\n\n${chunk}`,
        },
      ]);

      const parsed = parseAIResponse(response);

      // Process questions, merging if same question number appears
      for (const q of parsed.questions) {
        const questionNum = normalizeQuestionNum(q.questionNum);
        const existing = questionsByNum.get(questionNum);

        if (existing) {
          // Merge content if question continues
          existing.content += '\n\n' + q.content;
          if (q.marks) existing.marks = (existing.marks || 0) + q.marks;
          if (q.hasDiagram) existing.diagramDescription = 'This question includes a diagram';
        } else {
          const extracted: ExtractedQuestion = {
            tempId: `q-${Date.now()}-${i}-${questionsByNum.size}`,
            content: q.content,
            topic: validateTopic(q.topic),
            difficulty: Math.min(5, Math.max(1, q.difficulty || 2)),
            confidence: q.confidence || 0.8,
            questionNum,
            marks: q.marks,
            diagramDescription: q.hasDiagram ? 'This question includes a diagram' : undefined,
            needsReview: q.confidence < 0.7 || q.hasDiagram,
          };
          questionsByNum.set(questionNum, extracted);
        }
      }
    } catch (error) {
      console.error(`Error processing chunk ${i + 1}:`, error);
    }
  }

  // Convert map to sorted array
  const sortedQuestions = Array.from(questionsByNum.values()).sort((a, b) => {
    const numA = parseInt(a.questionNum?.replace(/\D/g, '') || '0');
    const numB = parseInt(b.questionNum?.replace(/\D/g, '') || '0');
    return numA - numB;
  });

  return {
    questions: sortedQuestions,
    lessons: [],
    metadata,
  };
}

function splitIntoChunks(text: string, maxChars = 10000): string[] {
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

interface ParsedQuestion {
  questionNum: string;
  content: string;
  marks?: number;
  hasDiagram?: boolean;
  topic: string;
  difficulty: number;
  confidence: number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeQuestion(raw: any): ParsedQuestion | null {
  if (!raw || typeof raw !== 'object') return null;

  // Get question number from various field names (models use different conventions)
  const questionNum = raw.questionNum || raw.questionNumber || raw.question_number ||
    raw.number || raw.num || raw.qNum || raw.q || '';

  // Debug: log what we found
  console.log('Normalizing question:', {
    keys: Object.keys(raw),
    questionNum,
    hasContent: !!raw.content,
    hasText: !!raw.text,
    hasParts: Array.isArray(raw.parts),
  });

  if (!questionNum) {
    console.log('Skipping question: no question number found');
    return null;
  }

  // Get content - handle 'parts' array format
  let content = '';
  if (raw.content && typeof raw.content === 'string') {
    content = raw.content;
  } else if (Array.isArray(raw.parts)) {
    // Flatten parts array into single content string
    content = raw.parts.map((part: { part_number?: string; partNum?: string; text?: string; content?: string }) => {
      const partNum = part.part_number || part.partNum || '';
      const partText = part.text || part.content || '';
      return partNum ? `${partNum} ${partText}` : partText;
    }).join('\n');
  } else if (raw.text && typeof raw.text === 'string') {
    content = raw.text;
  }

  if (!content) {
    console.log('Skipping question: no content found');
    return null;
  }

  // Get topic - handle various formats
  const topic = raw.topic || raw.category || 'calculus';

  // Get marks - could be number or in content
  let marks = typeof raw.marks === 'number' ? raw.marks : undefined;
  if (!marks && typeof raw.total_marks === 'number') marks = raw.total_marks;

  // Detect diagram
  const hasDiagram = raw.hasDiagram === true ||
    raw.has_diagram === true ||
    raw.diagram === true ||
    (typeof raw.diagram === 'string' && raw.diagram.length > 0) ||
    /diagram|figure|graph|sketch/i.test(content);

  return {
    questionNum: String(questionNum),
    content,
    marks,
    hasDiagram,
    topic: typeof topic === 'string' ? topic : 'calculus',
    difficulty: typeof raw.difficulty === 'number' ? raw.difficulty : 2,
    confidence: typeof raw.confidence === 'number' ? raw.confidence : 0.8,
  };
}

function parseAIResponse(response: string): { questions: ParsedQuestion[] } {
  console.log('Raw AI response (first 1500 chars):', response.slice(0, 1500));

  let jsonStr = response;

  // Remove markdown code blocks
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

  // Clean up
  jsonStr = jsonStr.trim();

  try {
    const parsed = JSON.parse(jsonStr);
    const rawQuestions = Array.isArray(parsed.questions) ? parsed.questions : [];

    // Normalize each question to handle different formats
    const normalizedQuestions = rawQuestions
      .map(normalizeQuestion)
      .filter((q): q is ParsedQuestion => q !== null);

    console.log('Parsed successfully:', {
      rawCount: rawQuestions.length,
      normalizedCount: normalizedQuestions.length
    });

    return { questions: normalizedQuestions };
  } catch (error) {
    console.error('Failed to parse AI response:', error);
    console.error('JSON string:', jsonStr.slice(0, 500));
    return { questions: [] };
  }
}

function normalizeQuestionNum(num: string): string {
  if (!num) return 'Q?';
  // Extract just the main number
  const match = String(num).match(/\d+/);
  return match ? `Q${match[0]}` : `Q${num}`;
}

const VALID_TOPICS: H2Topic[] = [
  'vectors', 'probability', 'statistics', 'combinatorics',
  'calculus', 'complex-numbers', 'functions',
];

function validateTopic(topic: string): H2Topic {
  const normalized = topic?.toLowerCase().replace(/\s+/g, '-');
  if (VALID_TOPICS.includes(normalized as H2Topic)) {
    return normalized as H2Topic;
  }

  const topicMap: Record<string, H2Topic> = {
    'integration': 'calculus',
    'differentiation': 'calculus',
    'derivatives': 'calculus',
    'integrals': 'calculus',
    'series': 'calculus',
    'sequences': 'calculus',
    'maclaurin': 'calculus',
    'complex': 'complex-numbers',
    'argand': 'complex-numbers',
    'vector': 'vectors',
    'planes': 'vectors',
    'lines': 'vectors',
    'permutations': 'combinatorics',
    'combinations': 'combinatorics',
    'distribution': 'statistics',
    'hypothesis': 'statistics',
    'regression': 'statistics',
    'graphs': 'functions',
    'transformations': 'functions',
    'inequality': 'functions',
    'inequalities': 'functions',
  };

  for (const [key, value] of Object.entries(topicMap)) {
    if (normalized?.includes(key)) {
      return value;
    }
  }

  return 'calculus';
}
