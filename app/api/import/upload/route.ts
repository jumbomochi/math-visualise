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
