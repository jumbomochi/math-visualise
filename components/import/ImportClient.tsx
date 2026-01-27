'use client';

/**
 * ImportClient Component
 *
 * Main orchestration component for the PDF import workflow.
 * Manages the full import flow: upload -> processing -> review -> complete
 */

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Save, FileText, BookOpen, CheckCircle, AlertCircle, Upload } from 'lucide-react';
import PDFUploader from './PDFUploader';
import { ImportProgress } from './ImportProgress';
import ExtractedQuestionCard from './ExtractedQuestionCard';
import ExtractedLessonCard from './ExtractedLessonCard';
import {
  ExtractedQuestion,
  ExtractedLesson,
  ImportMetadata,
  ExamType,
  UploadResponse,
  SaveResponse,
} from '@/lib/import-types';

type ImportStep = 'upload' | 'processing' | 'review' | 'complete';
type ActiveTab = 'questions' | 'lessons';

export function ImportClient() {
  // Step state
  const [step, setStep] = useState<ImportStep>('upload');

  // Import data
  const [importId, setImportId] = useState<string | null>(null);
  const [questions, setQuestions] = useState<ExtractedQuestion[]>([]);
  const [lessons, setLessons] = useState<ExtractedLesson[]>([]);
  const [metadata, setMetadata] = useState<ImportMetadata | null>(null);

  // UI state
  const [activeTab, setActiveTab] = useState<ActiveTab>('questions');
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saveResult, setSaveResult] = useState<{ questions: number; lessons: number } | null>(null);

  // Handle file upload
  const handleUpload = useCallback(
    async (
      file: File,
      school: string,
      year: number,
      examType: ExamType,
      paperNumber?: number
    ) => {
      setIsUploading(true);
      setError(null);

      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('school', school);
        formData.append('year', year.toString());
        formData.append('examType', examType);
        if (paperNumber) {
          formData.append('paperNumber', paperNumber.toString());
        }

        const response = await fetch('/api/import/upload', {
          method: 'POST',
          body: formData,
        });

        const result: UploadResponse = await response.json();

        if (!result.success || !result.importId) {
          throw new Error(result.error || 'Upload failed');
        }

        setImportId(result.importId);
        setMetadata({
          filename: file.name,
          school,
          year,
          examType,
          paperNumber,
        });
        setStep('processing');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to upload file');
      } finally {
        setIsUploading(false);
      }
    },
    []
  );

  // Handle processing complete - fetch extracted content
  const handleProcessingComplete = useCallback(
    async (questionsFound: number, lessonsFound: number) => {
      if (!importId) return;

      try {
        const response = await fetch(`/api/import/status/${importId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'get_content' }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch extracted content');
        }

        const data = await response.json();

        setQuestions(data.questions || []);
        setLessons(data.lessons || []);
        if (data.metadata) {
          setMetadata(data.metadata);
        }

        // Set default tab based on content
        if (questionsFound > 0) {
          setActiveTab('questions');
        } else if (lessonsFound > 0) {
          setActiveTab('lessons');
        }

        setStep('review');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load content');
        setStep('upload');
      }
    },
    [importId]
  );

  // Handle processing error
  const handleProcessingError = useCallback((errorMessage: string) => {
    setError(errorMessage);
    setStep('upload');
  }, []);

  // Handle save
  const handleSave = useCallback(async () => {
    if (!importId || !metadata) return;

    setIsSaving(true);
    setError(null);

    try {
      const response = await fetch('/api/import/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          importId,
          questions,
          lessons,
          metadata,
        }),
      });

      const result: SaveResponse = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Save failed');
      }

      setSaveResult({
        questions: result.savedQuestions,
        lessons: result.savedLessons,
      });
      setStep('complete');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setIsSaving(false);
    }
  }, [importId, metadata, questions, lessons]);

  // Handle question update
  const handleQuestionUpdate = useCallback((updated: ExtractedQuestion) => {
    setQuestions((prev) =>
      prev.map((q) => (q.tempId === updated.tempId ? updated : q))
    );
  }, []);

  // Handle lesson update
  const handleLessonUpdate = useCallback((updated: ExtractedLesson) => {
    setLessons((prev) =>
      prev.map((l) => (l.tempId === updated.tempId ? updated : l))
    );
  }, []);

  // Handle question remove
  const handleQuestionRemove = useCallback((tempId: string) => {
    setQuestions((prev) => prev.filter((q) => q.tempId !== tempId));
  }, []);

  // Handle lesson remove
  const handleLessonRemove = useCallback((tempId: string) => {
    setLessons((prev) => prev.filter((l) => l.tempId !== tempId));
  }, []);

  // Handle back to upload
  const handleBack = useCallback(() => {
    setStep('upload');
    setImportId(null);
    setQuestions([]);
    setLessons([]);
    setMetadata(null);
    setError(null);
  }, []);

  // Handle import another
  const handleImportAnother = useCallback(() => {
    setStep('upload');
    setImportId(null);
    setQuestions([]);
    setLessons([]);
    setMetadata(null);
    setError(null);
    setSaveResult(null);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Import PDF</h1>
          <p className="text-gray-600">
            Extract questions and lessons from H2 Mathematics exam papers
          </p>
        </motion.div>

        {/* Error Display */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700"
            >
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          {step === 'upload' && (
            <motion.div
              key="upload"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <PDFUploader onUpload={handleUpload} isUploading={isUploading} />
            </motion.div>
          )}

          {step === 'processing' && importId && (
            <motion.div
              key="processing"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl border border-gray-200 p-8"
            >
              <ImportProgress
                importId={importId}
                onComplete={handleProcessingComplete}
                onError={handleProcessingError}
              />
            </motion.div>
          )}

          {step === 'review' && (
            <motion.div
              key="review"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Review Header */}
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleBack}
                  className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>

                <button
                  type="button"
                  onClick={handleSave}
                  disabled={isSaving || (questions.length === 0 && lessons.length === 0)}
                  className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  {isSaving ? (
                    <>
                      <svg className="animate-spin h-4 w-4\" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Save All
                    </>
                  )}
                </button>
              </div>

              {/* Tabs */}
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="flex border-b border-gray-200">
                  <button
                    type="button"
                    onClick={() => setActiveTab('questions')}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
                      activeTab === 'questions'
                        ? 'text-blue-600 bg-blue-50 border-b-2 border-blue-600'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <FileText className="w-4 h-4" />
                    Questions ({questions.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('lessons')}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
                      activeTab === 'lessons'
                        ? 'text-blue-600 bg-blue-50 border-b-2 border-blue-600'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <BookOpen className="w-4 h-4" />
                    Lessons ({lessons.length})
                  </button>
                </div>

                {/* Tab Content */}
                <div className="p-4">
                  <AnimatePresence mode="wait">
                    {activeTab === 'questions' && (
                      <motion.div
                        key="questions-tab"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="space-y-4"
                      >
                        {questions.length === 0 ? (
                          <div className="text-center py-8 text-gray-500">
                            <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                            <p>No questions found</p>
                          </div>
                        ) : (
                          questions.map((question) => (
                            <ExtractedQuestionCard
                              key={question.tempId}
                              question={question}
                              onUpdate={handleQuestionUpdate}
                              onRemove={handleQuestionRemove}
                            />
                          ))
                        )}
                      </motion.div>
                    )}

                    {activeTab === 'lessons' && (
                      <motion.div
                        key="lessons-tab"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="space-y-4"
                      >
                        {lessons.length === 0 ? (
                          <div className="text-center py-8 text-gray-500">
                            <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
                            <p>No lessons found</p>
                          </div>
                        ) : (
                          lessons.map((lesson) => (
                            <ExtractedLessonCard
                              key={lesson.tempId}
                              lesson={lesson}
                              onUpdate={handleLessonUpdate}
                              onRemove={handleLessonRemove}
                            />
                          ))
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Metadata Info */}
              {metadata && (
                <div className="bg-gray-100 rounded-xl p-4 text-sm text-gray-600">
                  <p>
                    <span className="font-medium">Source:</span> {metadata.filename}
                  </p>
                  <p>
                    <span className="font-medium">School:</span> {metadata.school} |{' '}
                    <span className="font-medium">Year:</span> {metadata.year} |{' '}
                    <span className="font-medium">Exam:</span> {metadata.examType}
                    {metadata.paperNumber && ` | Paper ${metadata.paperNumber}`}
                  </p>
                </div>
              )}
            </motion.div>
          )}

          {step === 'complete' && saveResult && (
            <motion.div
              key="complete"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl border border-gray-200 p-8 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center"
              >
                <CheckCircle className="w-10 h-10 text-green-600" />
              </motion.div>

              <h2 className="text-2xl font-bold text-gray-900 mb-2">Import Complete</h2>
              <p className="text-gray-600 mb-6">
                Successfully saved {saveResult.questions} question
                {saveResult.questions !== 1 ? 's' : ''} and {saveResult.lessons} lesson
                {saveResult.lessons !== 1 ? 's' : ''}
              </p>

              <button
                type="button"
                onClick={handleImportAnother}
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors"
              >
                <Upload className="w-5 h-5" />
                Import Another PDF
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
