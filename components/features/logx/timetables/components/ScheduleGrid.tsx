"use client"
import React from 'react'
import DayColumn from './DayColumn'
import { ClassGroupSchedule } from '../../types'

type Slot = { index: number; total: number; label: string }
type Preview = { dayIdx: number; startMin: number; durationMins: number } | null
type DayDataMap = { [day: string]: { s: ClassGroupSchedule; start: number; end: number }[] }

interface Props {
  days: string[]
  slots: Slot[]
  slotHeights: number[]
  slotTopOffsets: number[]
  slotMinutes: number
  pixelsPerMinute: number
  startHour: number
  totalHeight: number
  dayData: DayDataMap
  stackingMode: 'vertical' | 'columns'
  // editor interaction props
  columnWidth?: number
  draggingId?: number | null
  setDraggingId?: (id: number | null) => void
  preview?: Preview
  setPreview?: (p: Preview) => void
  conflictIds?: Set<number>
  setConflictIds?: (s: Set<number>) => void
  schedules?: ClassGroupSchedule[]
  saveSchedule?: (s: ClassGroupSchedule) => Promise<void>
  nudgeSchedule?: (s: ClassGroupSchedule, dm: number, dd?: number) => void
  setSelectedId?: (id: number | null) => void
  containerRef?: React.RefObject<HTMLDivElement | null>
}

export default function ScheduleGrid({ days, slots, slotHeights, slotTopOffsets, slotMinutes, pixelsPerMinute, startHour, totalHeight, dayData, stackingMode, containerRef, columnWidth, draggingId, setDraggingId, preview, setPreview, conflictIds, setConflictIds, schedules, saveSchedule, nudgeSchedule, setSelectedId }: Props) {
  // refs to day column wrappers for hit testing during cross-column drags
  const colRefs = React.useRef<Array<HTMLDivElement | null>>([])

  // helper to format minutes -> HH:MM
  const pad = (n: number) => String(n).padStart(2, '0')
  const minutesToTime = (mins: number) => `${pad(Math.floor(mins / 60))}:${pad(mins % 60)}`

  React.useEffect(() => {
    if (!draggingId) return
    let active = true
    const onMove = (ev: MouseEvent) => {
      if (!active) return
      // find column under pointer
      let foundIdx = -1
      for (let i = 0; i < colRefs.current.length; i++) {
        const el = colRefs.current[i]
        if (!el) continue
        const r = el.getBoundingClientRect()
        if (ev.clientX >= r.left && ev.clientX <= r.right && ev.clientY >= r.top && ev.clientY <= r.bottom) { foundIdx = i; break }
      }
      if (foundIdx === -1) return
      const colEl = colRefs.current[foundIdx]
      if (!colEl) return
      const rect = colEl.getBoundingClientRect()
      const relY = Math.max(0, ev.clientY - rect.top)
      const minsFromTop = Math.round(relY / pixelsPerMinute)
      const startMin = Math.max(0, minsFromTop + startHour * 60)
      const snap = slotMinutes || 15
      const snapped = Math.round(startMin / snap) * snap
      setPreview && setPreview({ dayIdx: foundIdx, startMin: snapped, durationMins: slotMinutes })
    }

    const onUp = async (ev: MouseEvent) => {
      active = false
      // find column under pointer
      let foundIdx = -1
      for (let i = 0; i < colRefs.current.length; i++) {
        const el = colRefs.current[i]
        if (!el) continue
        const r = el.getBoundingClientRect()
        if (ev.clientX >= r.left && ev.clientX <= r.right && ev.clientY >= r.top && ev.clientY <= r.bottom) { foundIdx = i; break }
      }
      if (foundIdx === -1) {
        setDraggingId && setDraggingId(null)
        setPreview && setPreview(null)
        return
      }
      const colEl = colRefs.current[foundIdx]
      if (!colEl) {
        setDraggingId && setDraggingId(null)
        setPreview && setPreview(null)
        return
      }
      const rect = colEl.getBoundingClientRect()
      const relY = Math.max(0, ev.clientY - rect.top)
      const minsFromTop = Math.round(relY / pixelsPerMinute)
      const startMin = Math.max(0, minsFromTop + startHour * 60)
      const snap = slotMinutes || 15
      const snapped = Math.round(startMin / snap) * snap

      // perform save: find schedule by draggingId
      const id = draggingId
      const sched = (schedules || []).find(s => Number(s.id) === Number(id))
      if (sched && saveSchedule) {
        const updated = { ...sched, start_time: minutesToTime(snapped), day_of_week: days[foundIdx] }
        try { await saveSchedule(updated as ClassGroupSchedule) } catch (e) { console.error(e) }
      }

      setDraggingId && setDraggingId(null)
      setPreview && setPreview(null)
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    return () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp) }
  }, [draggingId, colRefs, pixelsPerMinute, startHour, slotMinutes, setPreview, setDraggingId, schedules, saveSchedule, days])

  return (
    <div className="overflow-auto border rounded-lg shadow-sm" ref={containerRef}>
      <div className="flex">
        <div className="w-20 bg-gradient-to-br from-gray-50 to-gray-100 p-3 font-semibold text-gray-700 border-r">Time</div>
        {days.map((d, i) => (
          <div key={`hdr-${d}`} className={`flex-1 p-3 text-center font-semibold text-gray-700 border-r ${preview && preview.dayIdx === i ? 'bg-blue-100/60 ring-2 ring-blue-200' : 'bg-gradient-to-br from-blue-50 to-indigo-50'}`}>{d.charAt(0).toUpperCase() + d.slice(1)}</div>
        ))}
      </div>

      <div className="flex">
        <div className="w-20 bg-white border-r">
          {slots.map(slot => (
            <div key={`label-${slot.index}`} className="p-3 text-xs text-gray-500 font-medium border-b h-16">{slot.label}</div>
          ))}
        </div>
        {days.map((d, di) => (
          <div key={`daycol-${d}`} className="flex-1" ref={el => { colRefs.current[di] = el }}>
            <DayColumn
              day={d}
              dayIdx={di}
              slots={slots}
              events={dayData[d] || []}
              startHour={startHour}
              pixelsPerMinute={pixelsPerMinute}
              slotMinutes={slotMinutes}
              slotHeights={slotHeights}
              slotTopOffsets={slotTopOffsets}
              dayHeight={totalHeight}
              stackingMode={stackingMode}
              columnWidth={columnWidth}
              draggingId={draggingId}
              setDraggingId={setDraggingId}
              preview={preview}
              setPreview={setPreview}
              conflictIds={conflictIds}
              setConflictIds={setConflictIds}
              schedules={schedules}
              saveSchedule={saveSchedule}
              nudgeSchedule={nudgeSchedule}
              setSelectedId={setSelectedId}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
