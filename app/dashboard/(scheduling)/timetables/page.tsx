/**
 * Timetables Management Page
 * 
 * Main page for managing timetables using Entity Manager with Django backend integration.
 */

'use client';

import React, { useEffect, useRef } from 'react';
import { EntityManager } from '@/components/entityManager';
import { timetableConfig } from '@/components/features/logx/timetables/config';
import { timetablesApiClient } from '@/components/features/logx/timetables/api/client';
import { Calendar } from 'lucide-react';
import { usePageActions } from '../../layout';
import { Button } from '@/components/ui/button';
import { EntityManagerView } from '@/components/entityManager';
import { useQuery, useQueryClient } from '@tanstack/react-query';

export default function TimetablesPage() {
  const { setPageActions } = usePageActions();
  const [initialView, setInitialView] = React.useState<EntityManagerView>('list');
  const [initialId, setInitialId] = React.useState<string | number | undefined>(undefined);
  const queryClient = useQueryClient();
  const previousGeneratingCountRef = useRef(0);

  // Poll for generating timetables to provide real-time status updates
  const { data: generatingTimetables } = useQuery({
    queryKey: ['generating-timetables'],
    queryFn: async () => {
      const response = await timetablesApiClient.list({ 
        generation_status: 'in_progress',
        page_size: 100 
      });
      return response;
    },
    refetchInterval: (data) => {
      // Only poll if there are generating timetables
      const results = (data as any)?.results || [];
      return results.length > 0 ? 2000 : false;
    },
  });

  // Refresh main list when generating timetables complete
  useEffect(() => {
    const currentCount = (generatingTimetables as any)?.results?.length || 0;
    
    if (currentCount === 0 && previousGeneratingCountRef.current > 0) {
      // Timetables just finished generating, refresh the main list
      queryClient.invalidateQueries({ queryKey: ['timetables'] });
    }
    
    previousGeneratingCountRef.current = currentCount;
  }, [generatingTimetables, queryClient]);

  // Set actions to display in the layout header
  useEffect(() => {
    setPageActions(
      <div className="flex gap-2">
        <Button 
          variant="default" 
          size="sm"
          onClick={() => {
            console.log('Add Timetable button clicked');
            setInitialView('create');
            setInitialId(undefined);
          }}
        >
          <Calendar className="h-4 w-4 mr-2" />
          Add Timetable
        </Button>
      </div>
    );

    // Cleanup on unmount
    return () => setPageActions(null);
  }, [setPageActions]);

  // Callback when view changes internally (e.g., back to list after submit)
  const handleViewChange = React.useCallback((newView: EntityManagerView) => {
    console.log('View changed to:', newView);
    setInitialView(newView);
    if (newView === 'list') {
      setInitialId(undefined);
    }
  }, []);

  return (
    <EntityManager
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
  );
}
