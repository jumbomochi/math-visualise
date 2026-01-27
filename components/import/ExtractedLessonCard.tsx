'use client';

/**
 * ExtractedLessonCard Component
 *
 * A card component for displaying and editing extracted lessons from PDFs.
 * Shows content type, topic, title, and allows inline editing.
 */

import { FC, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import { ChevronDown, ChevronUp, Edit2, Check, X, Trash2, BookOpen } from 'lucide-react';
import { ExtractedLesson, H2Topic, ContentType } from '@/lib/import-types';

const H2_TOPICS: { value: H2Topic; label: string }[] = [
  { value: 'vectors', label: 'Vectors' },
  { value: 'probability', label: 'Probability' },
  { value: 'statistics', label: 'Statistics' },
  { value: 'combinatorics', label: 'Combinatorics' },
  { value: 'calculus', label: 'Calculus' },
  { value: 'complex-numbers', label: 'Complex Numbers' },
  { value: 'functions', label: 'Functions' },
];

const CONTENT_TYPES: { value: ContentType; label: string }[] = [
  { value: 'theory', label: 'Theory' },
  { value: 'example', label: 'Example' },
  { value: 'worked_solution', label: 'Worked Solution' },
  { value: 'summary', label: 'Summary' },
];

interface ExtractedLessonCardProps {
  lesson: ExtractedLesson;
  onUpdate: (updated: ExtractedLesson) => void;
  onRemove: (tempId: string) => void;
}

const ExtractedLessonCard: FC<ExtractedLessonCardProps> = ({ lesson, onUpdate, onRemove }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<ExtractedLesson>(lesson);

  const getContentTypeColor = useCallback((contentType: ContentType): string => {
    const colors: Record<ContentType, string> = {
      theory: 'bg-emerald-100 text-emerald-700',
      example: 'bg-amber-100 text-amber-700',
      worked_solution: 'bg-violet-100 text-violet-700',
      summary: 'bg-sky-100 text-sky-700',
    };
    return colors[contentType] || 'bg-gray-100 text-gray-700';
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

  const getConfidenceColor = useCallback((confidence: number): string => {
    if (confidence >= 0.7) return 'bg-green-100 text-green-700 border-green-200';
    if (confidence >= 0.5) return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    return 'bg-red-100 text-red-700 border-red-200';
  }, []);

  const handleEdit = useCallback(() => {
    setEditData(lesson);
    setIsEditing(true);
    setIsExpanded(true);
  }, [lesson]);

  const handleSave = useCallback(() => {
    onUpdate(editData);
    setIsEditing(false);
  }, [editData, onUpdate]);

  const handleCancel = useCallback(() => {
    setEditData(lesson);
    setIsEditing(false);
  }, [lesson]);

  const handleRemove = useCallback(() => {
    onRemove(lesson.tempId);
  }, [lesson.tempId, onRemove]);

  const topicLabel = H2_TOPICS.find((t) => t.value === lesson.topic)?.label || lesson.topic;
  const contentTypeLabel =
    CONTENT_TYPES.find((t) => t.value === lesson.contentType)?.label || lesson.contentType;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden transition-all duration-200"
    >
      {/* Header */}
      <div className="p-4 flex items-start gap-3">
        {/* Icon */}
        <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
          <BookOpen className="w-5 h-5 text-blue-600" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Badges Row */}
          <div className="flex flex-wrap items-center gap-2 mb-2">
            {/* Content Type Badge */}
            <span
              className={clsx(
                'px-2 py-0.5 text-xs font-medium rounded-full',
                getContentTypeColor(lesson.contentType)
              )}
            >
              {contentTypeLabel}
            </span>

            {/* Topic Badge */}
            <span
              className={clsx(
                'px-2 py-0.5 text-xs font-medium rounded-full',
                getTopicColor(lesson.topic)
              )}
            >
              {topicLabel}
            </span>

            {/* Confidence Badge */}
            <span
              className={clsx(
                'px-2 py-0.5 text-xs font-medium rounded-full border',
                getConfidenceColor(lesson.confidence)
              )}
            >
              {Math.round(lesson.confidence * 100)}% confidence
            </span>
          </div>

          {/* Title */}
          <h3 className="text-sm font-semibold text-gray-900 mb-1">{lesson.title}</h3>

          {/* Content Preview */}
          <p
            className={clsx(
              'text-sm text-gray-600 leading-relaxed',
              !isExpanded && 'line-clamp-2'
            )}
          >
            {lesson.content}
          </p>
        </div>

        {/* Actions */}
        <div className="flex-shrink-0 flex items-center gap-1">
          {!isEditing && (
            <>
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
                  {/* Title */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Title</label>
                    <input
                      type="text"
                      value={editData.title}
                      onChange={(e) => setEditData((prev) => ({ ...prev, title: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  </div>

                  {/* Content */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Content</label>
                    <textarea
                      value={editData.content}
                      onChange={(e) =>
                        setEditData((prev) => ({ ...prev, content: e.target.value }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                      rows={6}
                    />
                  </div>

                  {/* Topic and Content Type */}
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
                      <label className="block text-sm font-medium text-gray-700">Content Type</label>
                      <select
                        value={editData.contentType}
                        onChange={(e) =>
                          setEditData((prev) => ({
                            ...prev,
                            contentType: e.target.value as ContentType,
                          }))
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      >
                        {CONTENT_TYPES.map((type) => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                    </div>
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
                /* View Mode - Full Content */
                <div className="space-y-3">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-1">Full Content</h4>
                    <p className="text-sm text-gray-600 whitespace-pre-wrap">{lesson.content}</p>
                  </div>

                  {/* Order Info */}
                  <div className="text-xs text-gray-400">Order: {lesson.order}</div>

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

export default ExtractedLessonCard;
