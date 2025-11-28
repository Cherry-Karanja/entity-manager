/**
 * Hook for monitoring timetable generation status
 * Uses adaptive polling to track background generation progress efficiently
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { timetablesApiClient } from '../api/client';
import { Timetable } from '../../types';

export type GenerationStatus = 'pending' | 'in_progress' | 'completed' | 'failed';

interface GenerationState {
  status: GenerationStatus;
  taskId?: string;
  errors?: string[];
  isGenerating: boolean;
  progress?: number;
}

interface UseTimetableGenerationOptions {
  timetableId?: number | string;
  pollingInterval?: number; // in milliseconds
  onComplete?: (timetable: Timetable) => void;
  onError?: (errors: string[]) => void;
}

/**
 * Hook to monitor and control timetable generation with smart adaptive polling
 * 
 * @example
 * ```tsx
 * const { status, isGenerating, startGeneration, cancelPolling } = useTimetableGeneration({
 *   timetableId: 123,
 *   onComplete: (timetable) => console.log('Generation complete!', timetable),
 *   onError: (errors) => console.error('Generation failed:', errors)
 * });
 * 
 * // Start generation
 * await startGeneration({ use_optimization: true });
 * 
 * // Status will update automatically via polling
 * if (isGenerating) {
 *   return <div>Generating timetable...</div>;
 * }
 * ```
 */
export function useTimetableGeneration(options: UseTimetableGenerationOptions = {}) {
  const { 
    timetableId, 
    pollingInterval = 2000, // Default poll every 2 seconds
    onComplete,
    onError 
  } = options;

  const [state, setState] = useState<GenerationState>({
    status: 'pending',
    isGenerating: false,
  });

  const [adaptiveInterval, setAdaptiveInterval] = useState(pollingInterval);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const consecutiveErrorsRef = useRef<number>(0);
  const isPausedRef = useRef<boolean>(false);
  const lastStatusRef = useRef<GenerationStatus>('pending');
  const generationStartTimeRef = useRef<number>(0);
  const MAX_CONSECUTIVE_ERRORS = 5;
  const MAX_BACKOFF_MS = 60000;

  /**
   * Fetch current timetable status
   */
  // Return an object with either timetable or error so caller can implement
  // backoff / cooldown behaviour based on HTTP status (e.g. 429 Too Many Requests)
  const fetchStatus = useCallback(async (): Promise<{ timetable?: Timetable | null; error?: any }> => {
    if (!timetableId) return { timetable: null };

    try {
      const resp = await timetablesApiClient.get(timetableId as string);
      return { timetable: (resp && (resp as any).data) as Timetable };
    } catch (error) {
      // Don't swallow error — return it so polling logic can react (backoff/pause)
      return { error };
    }
  }, [timetableId]);

  /**
   * Update state from timetable data
   */
  const updateFromTimetable = useCallback((timetable: Timetable | null) => {
    if (!timetable) return;

    const newStatus = (timetable.generation_status || 'pending') as GenerationStatus;
    const isGenerating = newStatus === 'in_progress';

    setState({
      status: newStatus,
      taskId: timetable.generation_task_id,
      errors: timetable.generation_errors,
      isGenerating,
    });

    // Call callbacks on status change
    if (lastStatusRef.current !== newStatus) {
      if (newStatus === 'completed' && onComplete) {
        onComplete(timetable);
      } else if (newStatus === 'failed' && onError && timetable.generation_errors) {
        onError(timetable.generation_errors);
      }
      lastStatusRef.current = newStatus;
    }
  }, [onComplete, onError]);

  /**
   * Start polling for status updates with adaptive intervals
   */
  /**
   * Stop polling
   */
  const cancelPolling = useCallback(() => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
    isPausedRef.current = false;
    consecutiveErrorsRef.current = 0;
  }, []);

  /**
   * Start polling for status updates with adaptive intervals
   */
  const startPolling = useCallback(() => {
    // If we've been paused externally (cooldown), do not start
    if (isPausedRef.current) return;

    // Clear existing interval
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
    }

    // Start new polling interval with adaptive timing
    pollingIntervalRef.current = setInterval(async () => {
      const result = await fetchStatus();

      if (result.error) {
        // Increment consecutive error counter
        consecutiveErrorsRef.current += 1;

        const statusCode = result.error?.response?.status || result.error?.status;
        console.error('Error fetching timetable status:', result.error);

        // If rate limited, apply cooldown proportional to errors (but capped)
        if (statusCode === 429) {
          const cooldown = Math.min(MAX_BACKOFF_MS, 5000 * consecutiveErrorsRef.current);
          // Pause polling and schedule restart after cooldown
          cancelPolling();
          isPausedRef.current = true;
          setTimeout(() => {
            isPausedRef.current = false;
            // Only restart if generation still in progress
            if (lastStatusRef.current === 'in_progress') {
              startPolling();
            }
          }, cooldown);
          // increase adaptiveInterval to reduce pressure
          setAdaptiveInterval(prev => Math.min(prev * 2, MAX_BACKOFF_MS));
          return;
        }

        // Other errors: exponential backoff, and abort after repeated failures
        setAdaptiveInterval(prev => Math.min(prev * 2, MAX_BACKOFF_MS));
        if (consecutiveErrorsRef.current >= MAX_CONSECUTIVE_ERRORS) {
          cancelPolling();
          setState(prev => ({
            ...prev,
            isGenerating: false,
            status: 'failed',
            errors: ['Failed to poll timetable status after repeated errors.']
          }));
        }

        return;
      }

      // Success: reset consecutive error counter and update state
      consecutiveErrorsRef.current = 0;
      const timetable = result.timetable || null;
      updateFromTimetable(timetable);

      // Stop polling if generation is complete or failed
      if (timetable && ['completed', 'failed'].includes((timetable.generation_status || '') as GenerationStatus)) {
        cancelPolling();
      }
    }, adaptiveInterval);
  }, [fetchStatus, updateFromTimetable, adaptiveInterval, cancelPolling]);

  /**
   * Update polling interval based on elapsed time (adaptive polling)
   */
  useEffect(() => {
    if (state.status === 'in_progress' && generationStartTimeRef.current > 0) {
      const elapsed = Date.now() - generationStartTimeRef.current;
      
      // Adaptive polling strategy: faster initially, slower over time
      if (elapsed < 10000) {
        setAdaptiveInterval(1000);      // 1s for first 10 seconds
      } else if (elapsed < 30000) {
        setAdaptiveInterval(2000);      // 2s for 10-30 seconds
      } else if (elapsed < 60000) {
        setAdaptiveInterval(5000);      // 5s for 30-60 seconds
      } else {
        setAdaptiveInterval(10000);     // 10s after 1 minute
      }
    } else {
      setAdaptiveInterval(pollingInterval); // Reset to default
    }
  }, [state.status, pollingInterval]);

  // If the adaptive interval changes while polling, restart the polling
  useEffect(() => {
    if (state.status === 'in_progress' && pollingIntervalRef.current) {
      // restart with new interval
      cancelPolling();
      startPolling();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [adaptiveInterval]);

  

  /**
   * Start timetable generation
   */
  const startGeneration = useCallback(async (options?: {
    department_ids?: number[];
    class_group_ids?: number[];
    use_optimization?: boolean;
  }) => {
    if (!timetableId) {
      throw new Error('Timetable ID is required to start generation');
    }

    try {
      setState(prev => ({ ...prev, isGenerating: true, status: 'in_progress' }));
      generationStartTimeRef.current = Date.now(); // Track start time for adaptive polling

      // Trigger generation via API
      // Pass timetableId through directly (string UUIDs are supported).
      const response = await timetablesApiClient.customAction(
        timetableId as any,
        'regenerate_timetable',
        options || {}
      );

      const taskId = (response as any).task_id;
      setState(prev => ({ ...prev, taskId }));

      // Start polling for status
      startPolling();

      return taskId;
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        isGenerating: false, 
        status: 'failed',
        errors: ['Failed to start generation']
      }));
      throw error;
    }
  }, [timetableId, startPolling]);

  /**
   * Refresh status manually
   */
  const refreshStatus = useCallback(async () => {
    const result = await fetchStatus();
    const timetable = result?.timetable || null;
    updateFromTimetable(timetable);
    return timetable;
  }, [fetchStatus, updateFromTimetable]);

  // Initial fetch when timetableId changes
  useEffect(() => {
    if (timetableId) {
      refreshStatus();
    }
  }, [timetableId, refreshStatus]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cancelPolling();
    };
  }, [cancelPolling]);

  // Auto-start polling if status is in_progress
  useEffect(() => {
    if (state.status === 'in_progress' && !pollingIntervalRef.current) {
      startPolling();
    }
  }, [state.status, startPolling]);

  return {
    ...state,
    startGeneration,
    refreshStatus,
    cancelPolling,
  };
}
