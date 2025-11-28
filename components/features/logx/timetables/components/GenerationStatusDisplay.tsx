/**
 * Component to display timetable generation status with real-time updates
 */

'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Loader2, 
  CheckCircle, 
  XCircle, 
  Clock,
  AlertCircle 
} from 'lucide-react';
import { GenerationStatus } from '../hooks/useTimetableGeneration';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface GenerationStatusDisplayProps {
  status: GenerationStatus;
  isGenerating: boolean;
  errors?: string[];
  onRetry?: () => void;
  onCancel?: () => void;
  className?: string;
}

export function GenerationStatusDisplay({
  status,
  isGenerating,
  errors,
  onRetry,
  onCancel,
  className = '',
}: GenerationStatusDisplayProps) {
  // Don't show anything if pending and not generating
  if (status === 'pending' && !isGenerating) {
    return null;
  }

  const getStatusConfig = () => {
    switch (status) {
      case 'in_progress':
        return {
          icon: <Loader2 className="h-5 w-5 animate-spin text-blue-600" />,
          title: 'Generating Timetable',
          message: 'Please wait while we optimize your schedule...',
          bgColor: 'bg-blue-50 border-blue-200',
          textColor: 'text-blue-900',
        };
      case 'completed':
        return {
          icon: <CheckCircle className="h-5 w-5 text-green-600" />,
          title: 'Generation Complete',
          message: 'Your timetable has been successfully generated!',
          bgColor: 'bg-green-50 border-green-200',
          textColor: 'text-green-900',
        };
      case 'failed':
        return {
          icon: <XCircle className="h-5 w-5 text-red-600" />,
          title: 'Generation Failed',
          message: 'There was an error generating the timetable.',
          bgColor: 'bg-red-50 border-red-200',
          textColor: 'text-red-900',
        };
      default:
        return {
          icon: <Clock className="h-5 w-5 text-gray-600" />,
          title: 'Pending',
          message: 'Timetable generation is queued.',
          bgColor: 'bg-gray-50 border-gray-200',
          textColor: 'text-gray-900',
        };
    }
  };

  const config = getStatusConfig();

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className={className}
      >
        <Alert className={`${config.bgColor} border ${config.textColor}`}>
          <div className="flex items-start gap-3">
            <div className="mt-0.5">{config.icon}</div>
            <div className="flex-1">
              <div className="font-semibold">{config.title}</div>
              <AlertDescription className="mt-1">
                {config.message}
              </AlertDescription>
              
              {/* Show errors if any */}
              {errors && errors.length > 0 && (
                <div className="mt-2 space-y-1">
                  {errors.map((error, idx) => (
                    <div key={idx} className="text-sm flex items-start gap-2">
                      <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <span>{error}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Action buttons */}
              <div className="mt-3 flex gap-2">
                {status === 'in_progress' && onCancel && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onCancel}
                  >
                    Cancel
                  </Button>
                )}
                {status === 'failed' && onRetry && (
                  <Button
                    variant="default"
                    size="sm"
                    onClick={onRetry}
                  >
                    Retry Generation
                  </Button>
                )}
              </div>
            </div>
          </div>
        </Alert>
      </motion.div>
    </AnimatePresence>
  );
}

/**
 * Compact badge version for displaying in list views
 */
interface GenerationStatusBadgeProps {
  status: GenerationStatus;
  isGenerating: boolean;
  className?: string;
}

export function GenerationStatusBadge({
  status,
  isGenerating,
  className = '',
}: GenerationStatusBadgeProps) {
  const getStatusConfig = () => {
    switch (status) {
      case 'in_progress':
        return {
          icon: <Loader2 className="h-3 w-3 animate-spin" />,
          label: 'Generating',
          bgColor: 'bg-blue-100 text-blue-800',
        };
      case 'completed':
        return {
          icon: <CheckCircle className="h-3 w-3" />,
          label: 'Complete',
          bgColor: 'bg-green-100 text-green-800',
        };
      case 'failed':
        return {
          icon: <XCircle className="h-3 w-3" />,
          label: 'Failed',
          bgColor: 'bg-red-100 text-red-800',
        };
      default:
        return {
          icon: <Clock className="h-3 w-3" />,
          label: 'Pending',
          bgColor: 'bg-gray-100 text-gray-800',
        };
    }
  };

  const config = getStatusConfig();

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${config.bgColor} ${className}`}
    >
      {config.icon}
      {config.label}
    </span>
  );
}
