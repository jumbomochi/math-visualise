// PDF text extraction with page splitting

import pdfParse from 'pdf-parse';

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
    const result = await pdfParse(buffer);

    const extractedText = normalizeText(result.text);

    // pdf-parse v1 doesn't provide per-page text, so we'll use the full text
    // and estimate pages based on form feeds or page breaks
    const pages = extractedText
      .split(/\f|\n{3,}/)
      .filter(page => page.trim().length > 0)
      .map(page => normalizeText(page));

    return {
      text: extractedText,
      pageCount: result.numpages,
      pages: pages.length > 0 ? pages : [extractedText],
      metadata: {
        title: result.info?.Title || undefined,
        author: result.info?.Author || undefined,
      },
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Failed to extract PDF text: ${message}`);
  }
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
