/**
 * Generation Progress Modal
 * 
 * Modal component for displaying timetable generation progress with live updates
 */

'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useTimetableGeneration } from '../hooks/useTimetableGeneration';
import { GenerationStatusDisplay } from './GenerationStatusDisplay';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Eye, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface GenerationProgressModalProps {
  timetableId: string | number;
  isOpen: boolean;
  onClose: () => void;
  onComplete?: () => void;
}

export function GenerationProgressModal({
  timetableId,
  isOpen,
  onClose,
  onComplete,
}: GenerationProgressModalProps) {
  const router = useRouter();
  const { 
    status, 
    isGenerating, 
    errors,
    startGeneration 
  } = useTimetableGeneration({
    timetableId,
    onComplete: (timetable) => {
      toast.success('Generation complete!');
      onComplete?.();
    },
    onError: (errors) => {
      toast.error('Generation failed', {
        description: errors.join(', ')
      });
    }
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isGenerating ? 'Generating Timetable' : 'Timetable Generation'}
          </DialogTitle>
          <DialogDescription>
            {isGenerating 
              ? 'This may take a few moments depending on the complexity of your schedule.'
              : 'Monitor the generation progress below.'
            }
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Status Display */}
          <GenerationStatusDisplay 
            status={status}
            isGenerating={isGenerating}
            errors={errors}
            onRetry={() => startGeneration({ use_optimization: true })}
          />

          {/* Action Buttons */}
          {isGenerating && (
            <div className="flex gap-2">
              <Button 
                onClick={() => {
                  router.push(`/dashboard/timetables/${timetableId}/viewer`);
                  onClose();
                }}
                className="flex-1"
              >
                <Eye className="h-4 w-4 mr-2" />
                View Live
              </Button>
              <Button 
                variant="outline"
                onClick={onClose}
                className="flex-1"
              >
                Continue in Background
              </Button>
            </div>
          )}

          {status === 'completed' && (
            <Button 
              onClick={() => {
                router.push(`/dashboard/timetables/${timetableId}/viewer`);
                onClose();
              }}
              className="w-full"
            >
              <Eye className="h-4 w-4 mr-2" />
              View Schedule
            </Button>
          )}

          {status === 'failed' && (
            <div className="flex gap-2">
              <Button 
                onClick={() => startGeneration({ use_optimization: true })}
                className="flex-1"
              >
                <Loader2 className="h-4 w-4 mr-2" />
                Retry Generation
              </Button>
              <Button 
                variant="outline"
                onClick={onClose}
                className="flex-1"
              >
                Close
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
