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
