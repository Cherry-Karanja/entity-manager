"use client"

import React from 'react'
import { useParams, useRouter } from 'next/navigation'
import ScheduleEditor from '@/components/features/logx/timetables/components/ScheduleEditor'
import { Button } from '@/components/ui/button'
import { Edit2, RefreshCw, Download, Printer, Share2 } from 'lucide-react'
import { useTimetableGeneration } from '@/components/features/logx/timetables/hooks/useTimetableGeneration'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export default function TimetableViewerPage(){
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const timetableId = id;
  const [showRegenerateDialog, setShowRegenerateDialog] = React.useState(false);

  const { 
    startGeneration, 
    isGenerating 
  } = useTimetableGeneration({
    timetableId: id,
    onComplete: () => {
      toast.success('Timetable regenerated successfully!');
    },
    onError: (errors) => {
      toast.error('Regeneration failed', {
        description: errors.join(', ')
      });
    }
  });

  const handleRegenerate = async () => {
    setShowRegenerateDialog(false);
    try {
      await startGeneration({ use_optimization: true });
      toast.loading('Regenerating timetable...', { id: `gen-${id}` });
    } catch (error) {
      toast.error('Failed to start regeneration', { id: `gen-${id}` });
    }
  };

  const handleExport = () => {
    toast.info('Export feature coming soon!');
    // TODO: Implement export functionality
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    toast.success('Link copied to clipboard!');
  };

  if(!timetableId) return <div className="p-4">Invalid timetable id</div>

  return (
    <div className="p-4 space-y-4">
      {/* Enhanced Toolbar */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Timetable Schedule</h2>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => router.push(`/dashboard/timetables/${id}`)}
          >
            <Edit2 className="h-4 w-4 mr-2" />
            Edit Details
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowRegenerateDialog(true)}
            disabled={isGenerating}
          >
            <RefreshCw className={cn("h-4 w-4 mr-2", isGenerating && "animate-spin")} />
            {isGenerating ? 'Regenerating...' : 'Regenerate'}
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleExport}
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handlePrint}
          >
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleShare}
          >
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>
      </div>

      {/* Schedule Editor */}
      <ScheduleEditor timetableId={timetableId} />

      {/* Regenerate Confirmation Dialog */}
      <AlertDialog open={showRegenerateDialog} onOpenChange={setShowRegenerateDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Regenerate Timetable?</AlertDialogTitle>
            <AlertDialogDescription>
              This will create new schedules based on current enrollments and constraints. 
              The current schedule will be replaced. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleRegenerate}>
              Regenerate
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
