/**
 * Timetable Generation Loading Component
 * 
 * Displays an inline loading state when timetable is being generated
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Loader2, Calendar, CheckCircle2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';

interface GenerationLoadingProps {
  progress?: number;
  message?: string;
  estimatedTime?: number; // in seconds
  className?: string;
}

export function GenerationLoading({
  progress,
  message = 'Generating your timetable...',
  estimatedTime,
  className = '',
}: GenerationLoadingProps) {
  const [elapsedTime, setElapsedTime] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setElapsedTime(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
  };

  const steps = [
    { label: 'Loading constraints', status: progress && progress > 20 ? 'complete' : progress && progress > 0 ? 'active' : 'pending' },
    { label: 'Analyzing resources', status: progress && progress > 40 ? 'complete' : progress && progress > 20 ? 'active' : 'pending' },
    { label: 'Optimizing schedule', status: progress && progress > 70 ? 'complete' : progress && progress > 40 ? 'active' : 'pending' },
    { label: 'Finalizing timetable', status: progress && progress > 90 ? 'complete' : progress && progress > 70 ? 'active' : 'pending' },
  ];

  return (
    <Card className={className}>
      <CardContent className="pt-6">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center gap-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            >
              <Calendar className="h-8 w-8 text-primary" />
            </motion.div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg">{message}</h3>
              <p className="text-sm text-muted-foreground">
                Elapsed: {formatTime(elapsedTime)}
                {estimatedTime && ` • Est. remaining: ${formatTime(Math.max(0, estimatedTime - elapsedTime))}`}
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          {progress !== undefined && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-medium">{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}

          {/* Steps */}
          <div className="space-y-3">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-3"
              >
                {step.status === 'complete' && (
                  <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
                )}
                {step.status === 'active' && (
                  <Loader2 className="h-4 w-4 text-primary animate-spin flex-shrink-0" />
                )}
                {step.status === 'pending' && (
                  <div className="h-4 w-4 rounded-full border-2 border-gray-300 flex-shrink-0" />
                )}
                <span 
                  className={`text-sm ${
                    step.status === 'complete' 
                      ? 'text-green-600 font-medium' 
                      : step.status === 'active'
                      ? 'text-primary font-medium'
                      : 'text-muted-foreground'
                  }`}
                >
                  {step.label}
                </span>
              </motion.div>
            ))}
          </div>

          {/* Tips */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-xs text-blue-900">
              💡 <strong>Tip:</strong> You can navigate away - generation will continue in the background. 
              We&apos;ll notify you when it&apos;s complete.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
