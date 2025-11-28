"use client"

import React from 'react'
import { useParams } from 'next/navigation'
import ScheduleEditor from '@/components/features/logx/timetables/components/ScheduleEditor'

export default function TimetableViewerPage(){
  const params = useParams();
  const id = params.id as string;
  const timetableId = id

  if(!timetableId) return <div className="p-4">Invalid timetable id</div>

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Timetable {timetableId} — Viewer</h2>
      {/* Reuse ScheduleEditor in view-only mode by passing readOnly prop in future; for now it renders without edit controls */}
      <ScheduleEditor timetableId={timetableId} />
    </div>
  )
}
