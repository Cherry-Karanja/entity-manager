/**
 * Timetable Detail Page
 * 
 * View and manage individual timetable with generation status monitoring.
 */

'use client';

import React, { useEffect, useState } from 'react';
import { EntityManager } from '@/components/entityManager';
import { timetableConfig } from '@/components/features/logx/timetables/config';
import { timetablesApiClient, timetableActions } from '@/components/features/logx/timetables/api/client';
import { Calendar, Eye, RefreshCw, Edit2 } from 'lucide-react';
import { usePageActions } from '../../../layout';
import { Button } from '@/components/ui/button';
import { EntityManagerView } from '@/components/entityManager';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import { useTimetableGeneration } from '@/components/features/logx/timetables/hooks/useTimetableGeneration';
import { GenerationStatusDisplay } from '@/components/features/logx/timetables/components/GenerationStatusDisplay';
import { toast } from 'sonner';

export default function TimetableDetailPage() {
  const params = useParams();
  const initialId = params?.id as string | undefined;
  const { setPageActions } = usePageActions();
  const [initialView, setInitialView] = React.useState<EntityManagerView>('view');
  const [refreshKey, setRefreshKey] = useState(0);
  const router = useRouter();

  // Monitor timetable generation status
  const { 
    status, 
    isGenerating, 
    errors, 
    startGeneration, 
    refreshStatus 
  } = useTimetableGeneration({
    timetableId: initialId,
    onComplete: (timetable) => {
      // Show success toast with auto-redirect
      toast.success('🎉 Timetable generated successfully!', {
        description: 'Redirecting to viewer in 3 seconds...',
        duration: 3000,
        action: {
          label: 'View Now',
          onClick: () => {
            router.push(`/dashboard/timetables/${initialId}/viewer`);
          }
        },
        cancel: {
          label: 'Stay Here',
          onClick: () => {}
        }
      });

      // Auto-redirect after 3 seconds
      setTimeout(() => {
        router.push(`/dashboard/timetables/${initialId}/viewer`);
      }, 3000);

      setRefreshKey(prev => prev + 1); // Trigger refresh
    },
    onError: (errors) => {
      toast.error('Generation failed', {
        description: errors.join(', '),
        action: {
          label: 'Retry',
          onClick: handleRegenerate
        }
      });
    },
  });

  // Handle regeneration
  const handleRegenerate = React.useCallback(async () => {
    try {
      toast.loading('Starting timetable generation...', { id: `gen-${initialId}` });
      await startGeneration({ use_optimization: true });
      toast.success('Timetable generation started!', { id: `gen-${initialId}` });
    } catch (err) {
      console.error('Failed to start generation', err);
      toast.error('Failed to start generation', {
        id: `gen-${initialId}`,
        description: (err)?.message ?? String(err),
      });
    }
  }, [initialId, startGeneration]);

  // Set actions in the page header
  useEffect(() => {
    setPageActions(
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => router.push(`/dashboard/timetables/${initialId}/viewer`)}
        >
          <Eye className="h-4 w-4 mr-2" />
          View Schedule
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setInitialView('edit')}
        >
          <Edit2 className="h-4 w-4 mr-2" />
          Edit Details
        </Button>
        <Button 
          variant="default" 
          size="sm"
          onClick={handleRegenerate}
          disabled={isGenerating}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isGenerating ? 'animate-spin' : ''}`} />
          {isGenerating ? 'Generating...' : 'Regenerate'}
        </Button>
      </div>
    );

    return () => setPageActions(null);
  }, [initialId, setPageActions, router, isGenerating, handleRegenerate]);

  // Callback when view changes
  const handleViewChange = React.useCallback((newView: EntityManagerView) => {
    setInitialView(newView);
    if (newView === 'list') {
      router.push('/dashboard/timetables');
    }
  }, [router]);

  return (
    <div className="space-y-4">
      {/* Generation Status Display */}
      <GenerationStatusDisplay
        status={status}
        isGenerating={isGenerating}
        errors={errors}
        onRetry={handleRegenerate}
      />

      {/* Entity Manager for timetable details */}
      <EntityManager
        key={refreshKey}
        config={{
          config: timetableConfig,
          apiClient: timetablesApiClient,
          initialView: initialView,
          initialId: initialId,
          initialData: [],
          onViewChange: handleViewChange,
          features: {
            offline: false,
            realtime: false,
            optimistic: true,
            collaborative: false,
          },
        }}
      />
    </div>
  );
}
