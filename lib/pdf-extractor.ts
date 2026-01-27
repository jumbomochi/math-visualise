// PDF text extraction with page splitting

import { PDFParse } from 'pdf-parse';

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
  const parser = new PDFParse({ data: buffer });

  try {
    const [textResult, infoResult] = await Promise.all([
      parser.getText(),
      parser.getInfo(),
    ]);

    const extractedText = normalizeText(textResult.text);
    const pages = textResult.pages.map(page => normalizeText(page.text));

    return {
      text: extractedText,
      pageCount: textResult.total,
      pages,
      metadata: {
        title: infoResult.info?.Title || undefined,
        author: infoResult.info?.Author || undefined,
      },
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Failed to extract PDF text: ${message}`);
  } finally {
    await parser.destroy();
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
