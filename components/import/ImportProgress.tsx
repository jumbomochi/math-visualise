'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { FileSearch, Sparkles, CheckCircle } from 'lucide-react';
import { StatusResponse } from '@/lib/import-types';

interface ImportProgressProps {
  importId: string;
  onComplete: (questionsFound: number, lessonsFound: number) => void;
  onError: (error: string) => void;
}

const STEPS = [
  { id: 'upload', label: 'Uploading PDF', icon: FileSearch },
  { id: 'extract', label: 'Extracting text', icon: FileSearch },
  { id: 'analyze', label: 'AI Analysis', icon: Sparkles },
  { id: 'complete', label: 'Ready for review', icon: CheckCircle },
];

export function ImportProgress({ importId, onComplete, onError }: ImportProgressProps) {
  const [status, setStatus] = useState<StatusResponse | null>(null);
  const [currentStep, setCurrentStep] = useState(0);

  const checkStatus = useCallback(async (): Promise<{ shouldContinue: boolean }> => {
    try {
      const response = await fetch(`/api/import/status/${importId}`);
      if (!response.ok) throw new Error('Failed to check status');

      const data: StatusResponse = await response.json();
      setStatus(data);

      if (data.status === 'processing') {
        setCurrentStep((prev) => Math.min(prev + 1, 2));
        return { shouldContinue: true };
      } else if (data.status === 'ready_for_review') {
        setCurrentStep(3);
        onComplete(data.questionsFound || 0, data.lessonsFound || 0);
        return { shouldContinue: false };
      } else if (data.status === 'failed') {
        onError(data.errorMessage || 'Import failed');
        return { shouldContinue: false };
      }

      return { shouldContinue: true };
    } catch {
      return { shouldContinue: true }; // Continue on transient errors
    }
  }, [importId, onComplete, onError]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    let attempts = 0;
    let consecutiveErrors = 0;

    const poll = async () => {
      try {
        const result = await checkStatus();
        consecutiveErrors = 0; // Reset on success

        if (!result.shouldContinue) {
          clearInterval(interval);
          return;
        }

        attempts++;
        if (attempts >= 120) {
          // 2 minute timeout
          clearInterval(interval);
          onError('Import timed out');
        }
      } catch {
        consecutiveErrors++;
        if (consecutiveErrors >= 3) {
          clearInterval(interval);
          onError('Failed to check status');
        }
      }
    };

    poll();
    interval = setInterval(poll, 1000);

    return () => clearInterval(interval);
  }, [checkStatus, onError]);

  return (
    <div className="space-y-8">
      <div className="flex justify-center">
        <motion.div
          animate={{ y: [0, -10, 0], rotate: [0, 5, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center shadow-lg">
            <Sparkles className="w-12 h-12 text-white" />
          </div>
        </motion.div>
      </div>

      <div className="text-center">
        <h2 className="text-xl font-bold mb-2">
          {STEPS[currentStep]?.label || 'Processing...'}
        </h2>
        <p className="text-gray-500">
          {currentStep < 3
            ? 'Extracting questions and lessons from your PDF...'
            : 'Extraction complete!'}
        </p>
      </div>

      <div className="max-w-md mx-auto">
        <div className="relative">
          <div className="absolute top-5 left-5 right-5 h-0.5 bg-gray-200">
            <motion.div
              className="h-full bg-blue-500"
              initial={{ width: '0%' }}
              animate={{ width: `${(currentStep / 3) * 100}%` }}
            />
          </div>
          <div className="relative flex justify-between">
            {STEPS.map((step, index) => {
              const Icon = step.icon;
              const isActive = index <= currentStep;
              return (
                <div key={step.id} className="flex flex-col items-center">
                  <motion.div
                    animate={{ scale: index === currentStep ? 1.1 : 1 }}
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      isActive ? 'bg-blue-500' : 'bg-gray-200'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                  </motion.div>
                  <span className={`mt-2 text-xs ${isActive ? 'text-gray-900' : 'text-gray-400'}`}>
                    {step.label.split(' ')[0]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {status?.questionsFound !== undefined && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 text-green-700">
            <CheckCircle className="w-5 h-5" />
            <span>
              {status.questionsFound} questions, {status.lessonsFound || 0} lessons found
            </span>
          </div>
        </motion.div>
      )}
    </div>
  );
}
