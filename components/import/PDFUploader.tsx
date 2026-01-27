'use client';

/**
 * PDFUploader Component
 *
 * A drag-and-drop file upload component for importing PDF exam papers.
 * Supports school selection (Singapore JCs), year, exam type, and paper number.
 */

import { FC, useState, useCallback, DragEvent, ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import { Upload, FileText, X, AlertCircle } from 'lucide-react';

// Singapore Junior Colleges
const SINGAPORE_JCS = [
  'Anderson Serangoon Junior College',
  'Anglo-Chinese Junior College',
  'Catholic Junior College',
  'Dunman High School',
  'Eunoia Junior College',
  'Hwa Chong Institution',
  'Jurong Pioneer Junior College',
  'Millennia Institute',
  'Nanyang Junior College',
  'National Junior College',
  'Raffles Institution',
  'River Valley High School',
  'Saint Andrew\'s Junior College',
  'Saint Joseph\'s Institution',
  'Tampines Meridian Junior College',
  'Temasek Junior College',
  'Victoria Junior College',
  'Yishun Innova Junior College',
  'Other',
] as const;

const EXAM_TYPES = [
  { value: 'midyear', label: 'Mid-Year Examination' },
  { value: 'promo', label: 'Promotional Examination' },
  { value: 'prelim', label: 'Preliminary Examination' },
  { value: 'topical', label: 'Topical Practice' },
] as const;

const PAPER_OPTIONS = [
  { value: '', label: 'Not Specified' },
  { value: '1', label: 'Paper 1' },
  { value: '2', label: 'Paper 2' },
] as const;

type ExamType = 'midyear' | 'promo' | 'prelim' | 'topical';

interface PDFUploaderProps {
  onUpload: (
    file: File,
    school: string,
    year: number,
    examType: ExamType,
    paperNumber?: number
  ) => void;
  isUploading: boolean;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const PDFUploader: FC<PDFUploaderProps> = ({ onUpload, isUploading }) => {
  const [file, setFile] = useState<File | null>(null);
  const [school, setSchool] = useState<string>('');
  const [customSchool, setCustomSchool] = useState<string>('');
  const [year, setYear] = useState<string>(new Date().getFullYear().toString());
  const [examType, setExamType] = useState<ExamType>('prelim');
  const [paperNumber, setPaperNumber] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const validateFile = useCallback((selectedFile: File): boolean => {
    if (!selectedFile.type.includes('pdf')) {
      setError('Please upload a PDF file');
      return false;
    }
    if (selectedFile.size > MAX_FILE_SIZE) {
      setError('File size must be less than 10MB');
      return false;
    }
    setError('');
    return true;
  }, []);

  const handleFileSelect = useCallback(
    (selectedFile: File) => {
      if (validateFile(selectedFile)) {
        setFile(selectedFile);
      }
    },
    [validateFile]
  );

  const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile) {
        handleFileSelect(droppedFile);
      }
    },
    [handleFileSelect]
  );

  const handleInputChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const selectedFile = e.target.files?.[0];
      if (selectedFile) {
        handleFileSelect(selectedFile);
      }
    },
    [handleFileSelect]
  );

  const handleRemoveFile = useCallback(() => {
    setFile(null);
    setError('');
  }, []);

  const handleYearChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow empty or valid year input
    if (value === '' || /^\d{0,4}$/.test(value)) {
      setYear(value);
    }
  }, []);

  const validateForm = useCallback((): boolean => {
    if (!file) {
      setError('Please select a PDF file');
      return false;
    }

    const selectedSchool = school === 'Other' ? customSchool.trim() : school;
    if (!selectedSchool) {
      setError('Please select or enter a school name');
      return false;
    }

    const yearNum = parseInt(year, 10);
    if (isNaN(yearNum) || yearNum < 2000 || yearNum > 2100) {
      setError('Please enter a valid year (2000-2100)');
      return false;
    }

    setError('');
    return true;
  }, [file, school, customSchool, year]);

  const handleSubmit = useCallback(() => {
    if (!validateForm() || !file) return;

    const selectedSchool = school === 'Other' ? customSchool.trim() : school;
    const yearNum = parseInt(year, 10);
    const paper = paperNumber ? parseInt(paperNumber, 10) : undefined;

    onUpload(file, selectedSchool, yearNum, examType, paper);
  }, [validateForm, file, school, customSchool, year, examType, paperNumber, onUpload]);

  const isOtherSchool = school === 'Other';

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Drag and Drop Zone */}
      <motion.div
        className={clsx(
          'relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-200',
          isDragging
            ? 'border-blue-500 bg-blue-50'
            : file
            ? 'border-green-500 bg-green-50'
            : 'border-gray-300 bg-gray-50 hover:border-gray-400 hover:bg-gray-100'
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <input
          type="file"
          accept=".pdf,application/pdf"
          onChange={handleInputChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={isUploading}
        />

        <AnimatePresence mode="wait">
          {file ? (
            <motion.div
              key="file-selected"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex flex-col items-center gap-3"
            >
              <div className="p-3 bg-green-100 rounded-full">
                <FileText className="w-8 h-8 text-green-600" />
              </div>
              <div className="text-center">
                <p className="font-medium text-gray-900 truncate max-w-xs">
                  {file.name}
                </p>
                <p className="text-sm text-gray-500">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveFile();
                }}
                className="flex items-center gap-1 px-3 py-1.5 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                disabled={isUploading}
              >
                <X className="w-4 h-4" />
                Remove
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="no-file"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex flex-col items-center gap-3"
            >
              <div
                className={clsx(
                  'p-3 rounded-full transition-colors',
                  isDragging ? 'bg-blue-100' : 'bg-gray-200'
                )}
              >
                <Upload
                  className={clsx(
                    'w-8 h-8 transition-colors',
                    isDragging ? 'text-blue-600' : 'text-gray-500'
                  )}
                />
              </div>
              <div className="text-center">
                <p className="font-medium text-gray-900">
                  {isDragging ? 'Drop your PDF here' : 'Drag and drop your PDF here'}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  or click to browse (max 10MB)
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Form Fields */}
      <motion.div
        className="bg-white rounded-xl border border-gray-200 p-6 space-y-5"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <h3 className="font-semibold text-gray-900 text-lg">Paper Details</h3>

        {/* School Selection */}
        <div className="space-y-2">
          <label htmlFor="school" className="block text-sm font-medium text-gray-700">
            School
          </label>
          <select
            id="school"
            value={school}
            onChange={(e) => setSchool(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            disabled={isUploading}
          >
            <option value="">Select a school</option>
            {SINGAPORE_JCS.map((jc) => (
              <option key={jc} value={jc}>
                {jc}
              </option>
            ))}
          </select>
        </div>

        {/* Custom School Input */}
        <AnimatePresence>
          {isOtherSchool && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-2 overflow-hidden"
            >
              <label htmlFor="customSchool" className="block text-sm font-medium text-gray-700">
                School Name
              </label>
              <input
                id="customSchool"
                type="text"
                value={customSchool}
                onChange={(e) => setCustomSchool(e.target.value)}
                placeholder="Enter school name"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                disabled={isUploading}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Year and Exam Type Row */}
        <div className="grid grid-cols-2 gap-4">
          {/* Year */}
          <div className="space-y-2">
            <label htmlFor="year" className="block text-sm font-medium text-gray-700">
              Year
            </label>
            <input
              id="year"
              type="text"
              inputMode="numeric"
              value={year}
              onChange={handleYearChange}
              placeholder="2024"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              disabled={isUploading}
            />
          </div>

          {/* Exam Type */}
          <div className="space-y-2">
            <label htmlFor="examType" className="block text-sm font-medium text-gray-700">
              Exam Type
            </label>
            <select
              id="examType"
              value={examType}
              onChange={(e) => setExamType(e.target.value as ExamType)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              disabled={isUploading}
            >
              {EXAM_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Paper Number */}
        <div className="space-y-2">
          <label htmlFor="paperNumber" className="block text-sm font-medium text-gray-700">
            Paper Number
            <span className="text-gray-400 font-normal ml-1">(optional)</span>
          </label>
          <select
            id="paperNumber"
            value={paperNumber}
            onChange={(e) => setPaperNumber(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            disabled={isUploading}
          >
            {PAPER_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </motion.div>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700"
          >
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm">{error}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Submit Button */}
      <motion.button
        type="button"
        onClick={handleSubmit}
        disabled={isUploading || !file}
        className={clsx(
          'w-full py-3 px-6 rounded-xl font-medium text-white transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500',
          isUploading || !file
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
        )}
        whileHover={!isUploading && file ? { scale: 1.01 } : undefined}
        whileTap={!isUploading && file ? { scale: 0.99 } : undefined}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        {isUploading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
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
            Uploading...
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            <Upload className="w-5 h-5" />
            Upload PDF
          </span>
        )}
      </motion.button>
    </div>
  );
};

export default PDFUploader;
