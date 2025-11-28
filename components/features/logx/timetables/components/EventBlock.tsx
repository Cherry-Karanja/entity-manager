"use client"
"use client"
import React from 'react'

interface Props {
  id: number | string
  title?: string
  start?: string
  end?: string
  room?: string
  isLocked?: boolean
  onClick?: () => void
  draggable?: boolean
}

export default function EventBlock({ id, title, start, end, room, isLocked, onClick }: Props) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onMouseDown={(e) => { /* allow parent drag handlers to attach */ }}
      className="rounded-lg p-3 text-sm select-none transition-all cursor-pointer bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 shadow-md hover:shadow-lg"
    >
      <div className="flex items-center justify-between">
        <div className="font-medium">{title || `Class ${id}`}</div>
        {isLocked && <div className="text-xs px-2 py-0.5 rounded bg-yellow-100 text-yellow-800">Locked</div>}
      </div>
      <div className="text-xs text-gray-600">{start} - {end} • {room}</div>
    </div>
  )
}
