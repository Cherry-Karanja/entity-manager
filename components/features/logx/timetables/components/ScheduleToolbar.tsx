"use client"
import React from 'react'
import { Minimize2, Maximize2 } from 'lucide-react'

interface Props {
  stackingMode: 'vertical' | 'columns'
  setStackingMode: React.Dispatch<React.SetStateAction<'vertical' | 'columns'>>
  isFullscreen: boolean
  setIsFullscreen: (v: boolean) => void
  searchQuery: string
  setSearchQuery: (s: string) => void
  stats?: { totalClasses?: number; roomsUsed?: number; groupsScheduled?: number; lockedClasses?: number }
  clearFilters?: () => void
  // display selected filters
  selectedDepartment?: string | undefined
  selectedProgramme?: string | undefined
  selectedGroup?: string | undefined
  selectedRoom?: string | undefined
  // human-friendly labels for selected filters (preferred)
  selectedDepartmentLabel?: string | undefined
  selectedProgrammeLabel?: string | undefined
  selectedGroupLabel?: string | undefined
  selectedRoomLabel?: string | undefined
  // optional individual clear callbacks
  clearDepartment?: () => void
  clearProgramme?: () => void
  clearGroup?: () => void
  clearRoom?: () => void
}

export default function ScheduleToolbar({ stackingMode, setStackingMode, isFullscreen, setIsFullscreen, searchQuery, setSearchQuery, stats, clearFilters, selectedDepartment, selectedProgramme, selectedGroup, selectedRoom, selectedDepartmentLabel, selectedProgrammeLabel, selectedGroupLabel, selectedRoomLabel, clearDepartment, clearProgramme, clearGroup, clearRoom }: Props) {
  const anyFilters = Boolean(selectedDepartment || selectedProgramme || selectedGroup || selectedRoom)
  return (
    <div className="mb-4 space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold">Schedule</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setStackingMode(m => m === 'vertical' ? 'columns' : 'vertical')}
              className="px-3 py-1 text-sm border rounded hover:bg-gray-100"
              title="Toggle stacking mode"
            >
              {stackingMode === 'vertical' ? 'Stack: Vertical' : 'Stack: Columns'}
            </button>
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
            >
              {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {stats && (
            <div className="hidden sm:flex items-center space-x-4 text-sm text-gray-600">
              <div>Total: <strong className="ml-1">{stats.totalClasses ?? 0}</strong></div>
              <div>Rooms: <strong className="ml-1">{stats.roomsUsed ?? 0}</strong></div>
              <div>Groups: <strong className="ml-1">{stats.groupsScheduled ?? 0}</strong></div>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
        <input className="w-full sm:flex-1 pl-4 pr-4 py-2 border rounded-lg" placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        <div className="flex gap-2 items-center flex-wrap">
          {clearFilters && <button onClick={clearFilters} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg">Clear</button>}
          {/* display selected filter chips */}
          {selectedDepartment && (
            <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-800 rounded-full text-sm">
              <span>Dept: {selectedDepartmentLabel ?? selectedDepartment}</span>
              <button onClick={clearDepartment || (() => clearFilters && clearFilters())} aria-label="Clear department" className="opacity-70 hover:opacity-100">×</button>
            </div>
          )}
          {selectedProgramme && (
            <div className="flex items-center gap-2 px-3 py-1 bg-green-50 text-green-800 rounded-full text-sm">
              <span>Prog: {selectedProgrammeLabel ?? selectedProgramme}</span>
              <button onClick={clearProgramme || (() => clearFilters && clearFilters())} aria-label="Clear programme" className="opacity-70 hover:opacity-100">×</button>
            </div>
          )}
          {selectedGroup && (
            <div className="flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-800 rounded-full text-sm">
              <span>Group: {selectedGroupLabel ?? selectedGroup}</span>
              <button onClick={clearGroup || (() => clearFilters && clearFilters())} aria-label="Clear group" className="opacity-70 hover:opacity-100">×</button>
            </div>
          )}
          {selectedRoom && (
            <div className="flex items-center gap-2 px-3 py-1 bg-yellow-50 text-yellow-800 rounded-full text-sm">
              <span>Room: {selectedRoomLabel ?? selectedRoom}</span>
              <button onClick={clearRoom || (() => clearFilters && clearFilters())} aria-label="Clear room" className="opacity-70 hover:opacity-100">×</button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
