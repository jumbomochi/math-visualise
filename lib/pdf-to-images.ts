// PDF to image conversion using pdf-poppler

import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

export interface PDFPageImage {
  pageNumber: number;
  imagePath: string;
  base64: string;
}

export interface PDFToImagesResult {
  pages: PDFPageImage[];
  totalPages: number;
  cleanup: () => void;
}

/**
 * Convert PDF pages to images using pdftoppm (from poppler)
 */
export async function convertPDFToImages(
  pdfBuffer: Buffer,
  options: {
    dpi?: number;
    format?: 'png' | 'jpeg';
    maxPages?: number;
  } = {}
): Promise<PDFToImagesResult> {
  const { dpi = 150, format = 'png', maxPages = 50 } = options;

  // Create temp directory for this conversion
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'pdf-images-'));
  const pdfPath = path.join(tempDir, 'input.pdf');
  const outputPrefix = path.join(tempDir, 'page');

  try {
    // Write PDF buffer to temp file
    fs.writeFileSync(pdfPath, pdfBuffer);

    // Convert PDF to images using pdftoppm
    const formatFlag = format === 'png' ? '-png' : '-jpeg';
    const cmd = `pdftoppm ${formatFlag} -r ${dpi} "${pdfPath}" "${outputPrefix}"`;

    execSync(cmd, { stdio: 'pipe' });

    // Read generated images
    const files = fs.readdirSync(tempDir)
      .filter(f => f.startsWith('page-') && f.endsWith(`.${format}`))
      .sort((a, b) => {
        const numA = parseInt(a.match(/page-(\d+)/)?.[1] || '0');
        const numB = parseInt(b.match(/page-(\d+)/)?.[1] || '0');
        return numA - numB;
      });

    const pages: PDFPageImage[] = files.slice(0, maxPages).map((file, index) => {
      const imagePath = path.join(tempDir, file);
      const imageBuffer = fs.readFileSync(imagePath);
      const base64 = imageBuffer.toString('base64');

      return {
        pageNumber: index + 1,
        imagePath,
        base64,
      };
    });

    const cleanup = () => {
      try {
        fs.rmSync(tempDir, { recursive: true, force: true });
      } catch {
        // Ignore cleanup errors
      }
    };

    return {
      pages,
      totalPages: pages.length,
      cleanup,
    };
  } catch (error) {
    // Clean up on error
    try {
      fs.rmSync(tempDir, { recursive: true, force: true });
    } catch {
      // Ignore
    }
    throw new Error(`PDF to image conversion failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Check if pdftoppm is available
 */
export function isPopplerAvailable(): boolean {
  try {
    execSync('which pdftoppm', { stdio: 'pipe' });
    return true;
  } catch {
    return false;
  }
}
