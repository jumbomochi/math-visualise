import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { SaveRequest, SaveResponse } from '@/lib/import-types';

export async function POST(request: NextRequest) {
  try {
    const body: SaveRequest = await request.json();
    const { importId, questions, lessons, metadata } = body;

    if (!importId) {
      return NextResponse.json({ success: false, error: 'Import ID is required' }, { status: 400 });
    }

    const importRecord = await prisma.importedPDF.findUnique({
      where: { id: importId },
    });

    if (!importRecord) {
      return NextResponse.json({ success: false, error: 'Import not found' }, { status: 404 });
    }

    let savedQuestions = 0;
    let savedLessons = 0;

    // Save questions
    for (const q of questions) {
      try {
        await prisma.extractedQuestion.create({
          data: {
            pdfId: importId,
            content: q.content,
            solution: q.solution,
            answer: q.answer,
            hints: q.hints ? JSON.stringify(q.hints) : null,
            topic: q.topic,
            difficulty: q.difficulty,
            confidence: q.confidence,
            school: metadata.school,
            year: metadata.year,
            examType: metadata.examType,
            paperNumber: metadata.paperNumber,
            questionNum: q.questionNum,
          },
        });
        savedQuestions++;
      } catch (err) {
        console.error('Error saving question:', err);
      }
    }

    // Save lessons
    for (const l of lessons) {
      try {
        await prisma.extractedLesson.create({
          data: {
            pdfId: importId,
            title: l.title,
            content: l.content,
            contentType: l.contentType,
            topic: l.topic,
            order: l.order,
          },
        });
        savedLessons++;
      } catch (err) {
        console.error('Error saving lesson:', err);
      }
    }

    // Update import record
    await prisma.importedPDF.update({
      where: { id: importId },
      data: {
        status: 'completed',
        questionsCount: savedQuestions,
        lessonsCount: savedLessons,
        completedAt: new Date(),
        extractedData: null, // Clear to save space
      },
    });

    const response: SaveResponse = {
      success: true,
      savedQuestions,
      savedLessons,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Save error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to save' },
      { status: 500 }
    );
  }
}
