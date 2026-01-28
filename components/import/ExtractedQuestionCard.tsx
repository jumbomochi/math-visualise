'use client';

/**
 * ExtractedQuestionCard Component
 *
 * A card component for displaying and editing extracted questions from PDFs.
 * Shows topic, difficulty, confidence score, allows inline editing and diagram uploads.
 */

import { FC, useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import { ChevronDown, ChevronUp, Edit2, Check, X, Trash2, Image, Upload } from 'lucide-react';
import { ExtractedQuestion, H2Topic } from '@/lib/import-types';
import MathContent from '@/components/ui/MathContent';

const H2_TOPICS: { value: H2Topic; label: string }[] = [
  { value: 'vectors', label: 'Vectors' },
  { value: 'probability', label: 'Probability' },
  { value: 'statistics', label: 'Statistics' },
  { value: 'combinatorics', label: 'Combinatorics' },
  { value: 'calculus', label: 'Calculus' },
  { value: 'complex-numbers', label: 'Complex Numbers' },
  { value: 'functions', label: 'Functions' },
];

const DIFFICULTY_LEVELS = [1, 2, 3, 4, 5] as const;

interface ExtractedQuestionCardProps {
  question: ExtractedQuestion;
  onUpdate: (updated: ExtractedQuestion) => void;
  onRemove: (tempId: string) => void;
}

const ExtractedQuestionCard: FC<ExtractedQuestionCardProps> = ({
  question,
  onUpdate,
  onRemove,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<ExtractedQuestion>(question);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getConfidenceColor = useCallback((confidence: number): string => {
    if (confidence >= 0.7) return 'bg-green-100 text-green-700 border-green-200';
    if (confidence >= 0.5) return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    return 'bg-red-100 text-red-700 border-red-200';
  }, []);

  const getConfidenceLabel = useCallback((confidence: number): string => {
    if (confidence >= 0.7) return 'High';
    if (confidence >= 0.5) return 'Medium';
    return 'Low';
  }, []);

  const getTopicColor = useCallback((topic: H2Topic): string => {
    const colors: Record<H2Topic, string> = {
      vectors: 'bg-blue-100 text-blue-700',
      probability: 'bg-purple-100 text-purple-700',
      statistics: 'bg-indigo-100 text-indigo-700',
      combinatorics: 'bg-pink-100 text-pink-700',
      calculus: 'bg-orange-100 text-orange-700',
      'complex-numbers': 'bg-teal-100 text-teal-700',
      functions: 'bg-cyan-100 text-cyan-700',
    };
    return colors[topic] || 'bg-gray-100 text-gray-700';
  }, []);

  const handleEdit = useCallback(() => {
    setEditData(question);
    setIsEditing(true);
    setIsExpanded(true);
  }, [question]);

  const handleSave = useCallback(() => {
    onUpdate(editData);
    setIsEditing(false);
  }, [editData, onUpdate]);

  const handleCancel = useCallback(() => {
    setEditData(question);
    setIsEditing(false);
  }, [question]);

  const handleRemove = useCallback(() => {
    onRemove(question.tempId);
  }, [question.tempId, onRemove]);

  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image must be less than 5MB');
      return;
    }

    // Convert to base64
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      if (isEditing) {
        setEditData(prev => ({ ...prev, diagramImage: base64 }));
      } else {
        onUpdate({ ...question, diagramImage: base64 });
      }
    };
    reader.readAsDataURL(file);

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [isEditing, question, onUpdate]);

  const handleRemoveImage = useCallback(() => {
    if (isEditing) {
      setEditData(prev => ({ ...prev, diagramImage: undefined }));
    } else {
      onUpdate({ ...question, diagramImage: undefined });
    }
  }, [isEditing, question, onUpdate]);

  const topicLabel = H2_TOPICS.find((t) => t.value === question.topic)?.label || question.topic;
  const currentImage = isEditing ? editData.diagramImage : question.diagramImage;
  const hasDiagramIndicator = question.diagramDescription && !question.diagramImage;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={clsx(
        'bg-white rounded-xl border shadow-sm overflow-hidden transition-all duration-200',
        question.needsReview ? 'border-yellow-300' : 'border-gray-200'
      )}
    >
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />

      {/* Header */}
      <div className="p-4 flex items-start gap-3">
        {/* Question Number */}
        {question.questionNum && (
          <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
            <span className="text-sm font-bold text-gray-700">{question.questionNum}</span>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Badges Row */}
          <div className="flex flex-wrap items-center gap-2 mb-2">
            {/* Topic Badge */}
            <span
              className={clsx(
                'px-2 py-0.5 text-xs font-medium rounded-full',
                getTopicColor(question.topic)
              )}
            >
              {topicLabel}
            </span>

            {/* Difficulty Badge */}
            <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-gray-100 text-gray-700">
              Difficulty: {question.difficulty}/5
            </span>

            {/* Marks Badge */}
            {question.marks && (
              <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-emerald-100 text-emerald-700">
                {question.marks} marks
              </span>
            )}

            {/* Diagram Badges */}
            {question.diagramImage && (
              <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-violet-100 text-violet-700">
                Diagram Added
              </span>
            )}
            {hasDiagramIndicator && (
              <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-amber-100 text-amber-700">
                Needs Diagram
              </span>
            )}

            {/* Confidence Badge */}
            <span
              className={clsx(
                'px-2 py-0.5 text-xs font-medium rounded-full border',
                getConfidenceColor(question.confidence)
              )}
            >
              {getConfidenceLabel(question.confidence)} ({Math.round(question.confidence * 100)}%)
            </span>

            {/* Needs Review Indicator */}
            {question.needsReview && (
              <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-yellow-100 text-yellow-700">
                Needs Review
              </span>
            )}
          </div>

          {/* Content Preview */}
          <div
            className={clsx(
              'text-sm text-gray-700 leading-relaxed',
              !isExpanded && 'line-clamp-3'
            )}
          >
            <MathContent content={question.content} />
          </div>
        </div>

        {/* Actions */}
        <div className="flex-shrink-0 flex items-center gap-1">
          {!isEditing && (
            <>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2 text-gray-400 hover:text-violet-600 hover:bg-violet-50 rounded-lg transition-colors"
                title="Add Diagram"
              >
                <Image className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleEdit}
                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="Edit"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                title={isExpanded ? 'Collapse' : 'Expand'}
              >
                {isExpanded ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Expanded Content / Edit Mode */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-4 border-t border-gray-100 pt-4">
              {isEditing ? (
                /* Edit Form */
                <div className="space-y-4">
                  {/* Content */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Question Content
                    </label>
                    <textarea
                      value={editData.content}
                      onChange={(e) =>
                        setEditData((prev) => ({ ...prev, content: e.target.value }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none font-mono text-sm"
                      rows={8}
                    />
                  </div>

                  {/* Topic and Difficulty */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Topic</label>
                      <select
                        value={editData.topic}
                        onChange={(e) =>
                          setEditData((prev) => ({ ...prev, topic: e.target.value as H2Topic }))
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      >
                        {H2_TOPICS.map((t) => (
                          <option key={t.value} value={t.value}>
                            {t.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Difficulty</label>
                      <select
                        value={editData.difficulty}
                        onChange={(e) =>
                          setEditData((prev) => ({
                            ...prev,
                            difficulty: parseInt(e.target.value, 10),
                          }))
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      >
                        {DIFFICULTY_LEVELS.map((level) => (
                          <option key={level} value={level}>
                            {level} - {level === 1 ? 'Easy' : level === 5 ? 'Hard' : ''}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Marks */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Total Marks
                      <span className="text-gray-400 font-normal ml-1">(optional)</span>
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="20"
                      value={editData.marks || ''}
                      onChange={(e) =>
                        setEditData((prev) => ({
                          ...prev,
                          marks: e.target.value ? parseInt(e.target.value, 10) : undefined,
                        }))
                      }
                      placeholder="e.g., 5"
                      className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  </div>

                  {/* Diagram Upload in Edit Mode */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Diagram Image
                      <span className="text-gray-400 font-normal ml-1">(optional)</span>
                    </label>
                    {editData.diagramImage ? (
                      <div className="relative inline-block">
                        <img
                          src={editData.diagramImage}
                          alt="Question diagram"
                          className="max-w-full max-h-64 rounded-lg border border-gray-200"
                        />
                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-violet-400 hover:text-violet-600 transition-colors"
                      >
                        <Upload className="w-4 h-4" />
                        Upload Diagram Screenshot
                      </button>
                    )}
                  </div>

                  {/* Answer */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Answer
                      <span className="text-gray-400 font-normal ml-1">(optional)</span>
                    </label>
                    <textarea
                      value={editData.answer || ''}
                      onChange={(e) =>
                        setEditData((prev) => ({ ...prev, answer: e.target.value || undefined }))
                      }
                      placeholder="Enter the answer..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                      rows={2}
                    />
                  </div>

                  {/* Edit Actions */}
                  <div className="flex items-center justify-between pt-2">
                    <button
                      type="button"
                      onClick={handleRemove}
                      className="flex items-center gap-1 px-3 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      Remove
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleCancel}
                        className="flex items-center gap-1 px-3 py-2 text-sm text-gray-600 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <X className="w-4 h-4" />
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleSave}
                        className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                      >
                        <Check className="w-4 h-4" />
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                /* View Mode - Expanded Details */
                <div className="space-y-3">
                  {/* Diagram Image */}
                  {currentImage && (
                    <div className="relative">
                      <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                        <Image className="w-4 h-4" />
                        Diagram
                      </h4>
                      <div className="relative inline-block">
                        <img
                          src={currentImage}
                          alt="Question diagram"
                          className="max-w-full max-h-64 rounded-lg border border-gray-200"
                        />
                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                          title="Remove diagram"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Diagram needed indicator */}
                  {hasDiagramIndicator && (
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                      <p className="text-sm text-amber-700 mb-2">
                        This question includes a diagram. Please upload a screenshot.
                      </p>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center gap-2 px-3 py-1.5 bg-amber-100 text-amber-700 rounded-lg text-sm font-medium hover:bg-amber-200 transition-colors"
                      >
                        <Upload className="w-4 h-4" />
                        Upload Diagram
                      </button>
                    </div>
                  )}

                  {/* Solution */}
                  {question.solution && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-1">Solution</h4>
                      <div className="text-sm text-gray-600">
                        <MathContent content={question.solution} />
                      </div>
                    </div>
                  )}

                  {/* Answer */}
                  {question.answer && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-1">Answer</h4>
                      <div className="text-sm text-gray-600">
                        <MathContent content={question.answer} />
                      </div>
                    </div>
                  )}

                  {/* Hints */}
                  {question.hints && question.hints.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-1">Hints</h4>
                      <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                        {question.hints.map((hint, index) => (
                          <li key={index}>{hint}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Remove Button in View Mode */}
                  <div className="pt-2 flex justify-end">
                    <button
                      type="button"
                      onClick={handleRemove}
                      className="flex items-center gap-1 px-3 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      Remove
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ExtractedQuestionCard;
