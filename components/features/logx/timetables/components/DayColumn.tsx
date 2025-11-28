/* eslint-disable */
"use client"
import React, { useMemo, useRef, useEffect, useState } from 'react'
import { ClassGroupSchedule } from '../../types'
import { motion } from 'framer-motion'
import EventBlock from './EventBlock'

interface Slot { index: number; total: number; label: string }

type DayEvent = { s: ClassGroupSchedule; start: number; end: number }

interface Props {
  day: string
  dayIdx?: number
  slots: Slot[]
  events: DayEvent[]
  startHour: number
  pixelsPerMinute: number
  slotMinutes: number
  slotHeights: number[]
  slotTopOffsets: number[]
  dayHeight: number
  stackingMode: 'vertical' | 'columns'
  // editor interactions
  columnWidth?: number
  draggingId?: number | null
  setDraggingId?: (id: number | null) => void
  preview?: { dayIdx: number; startMin: number; durationMins: number } | null
  setPreview?: (p: { dayIdx: number; startMin: number; durationMins: number } | null) => void
  conflictIds?: Set<number>
  setConflictIds?: (s: Set<number>) => void
  schedules?: ClassGroupSchedule[]
  saveSchedule?: (s: ClassGroupSchedule) => Promise<void>
  nudgeSchedule?: (s: ClassGroupSchedule, dm: number, dd?: number) => void
  setSelectedId?: (id: number | null) => void
}

export default function DayColumn({ day, dayIdx = 0, slots, events, startHour, pixelsPerMinute, slotMinutes, slotHeights, slotTopOffsets, dayHeight, stackingMode, columnWidth = 150, draggingId, setDraggingId, preview, setPreview, conflictIds, setConflictIds, schedules = [], saveSchedule, nudgeSchedule, setSelectedId }: Props) {
  // compute constants for placement
  const slotPx = slotMinutes * pixelsPerMinute
  const STACK_OFFSET_PX = Math.min(16, slotPx * 0.4)
  const PADDING_PX = 4

  // normalize events and sort by start time
  const evs = useMemo(() => {
    return (events || []).map((e: any) => ({
      s: e.s,
      start: Number(e.start || 0),
      end: Number(e.end || 0),
    })).sort((a: any, b: any) => {
      if (a.start === b.start) return (b.end - b.start) - (a.end - a.start)
      return a.start - b.start
    })
  }, [events])

  // assign lanes (interval graph coloring)
  const positioned = useMemo(() => {
    const lanesEnd: number[] = []
    const out: Array<any> = []
    let maxLane = 0
    for (const ev of evs) {
      let lane = -1
      for (let i = 0; i < lanesEnd.length; i++) {
        if (ev.start >= lanesEnd[i]) { lane = i; break }
      }
      if (lane === -1) { lane = lanesEnd.length; lanesEnd.push(ev.end) } else { lanesEnd[lane] = Math.max(lanesEnd[lane], ev.end) }
      maxLane = Math.max(maxLane, lane + 1)
      out.push({ ...ev, lane, laneCount: lanesEnd.length })
    }
    return { items: out, laneCount: Math.max(1, maxLane) }
  }, [evs])

  // local refs and drag state
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [activeDragId, setActiveDragId] = useState<number | null>(null)
  
  // selection
  // setSelectedId passed from ScheduleGrid to allow keyboard nudges

  // helper: convert absolute pageY to minutes from day start
  const minutesFromClientY = (clientY: number) => {
    const el = containerRef.current
    if (!el) return 0
    const rect = el.getBoundingClientRect()
    const y = clientY - rect.top
    const minutes = Math.round(y / pixelsPerMinute)
    return Math.max(0, minutes + startHour * 60)
  }

  const minutesToTimeStr = (mins: number) => {
    const hh = Math.floor(mins / 60)
    const mm = mins % 60
    const pad = (n: number) => String(n).padStart(2, '0')
    return `${pad(hh)}:${pad(mm)}`
  }

  useEffect(() => {
    let moving = false
    const onMove = (ev: MouseEvent) => {
      if (activeDragId === null && !draggingId) return
      const id = activeDragId ?? draggingId
      if (id == null) return
      moving = true
      const mins = minutesFromClientY(ev.clientY)
      // snap to slot minutes
      const snap = slotMinutes || 15
      const snapped = Math.round(mins / snap) * snap
      setPreview && setPreview({ dayIdx: dayIdx, startMin: snapped, durationMins: fixedDurationSafe() })
    }

    const onUp = async (ev: MouseEvent) => {
      if (!moving) {
        setActiveDragId(null)
        return
      }
      const id = activeDragId ?? draggingId
      if (id == null) { setActiveDragId(null); setDraggingId && setDraggingId(null); setPreview && setPreview(null); return }
      const mins = minutesFromClientY(ev.clientY)
      const snap = slotMinutes || 15
      const snapped = Math.round(mins / snap) * snap
      // find schedule and save
      const sched = schedules.find(s => Number(s.id) === Number(id))
      if (sched && saveSchedule) {
        const newStart = minutesToTimeStr(snapped)
        const updated = { ...sched, start_time: newStart, day_of_week: day }
        try { await saveSchedule(updated as ClassGroupSchedule) } catch (e) { console.error(e) }
      }
      setActiveDragId(null)
      setDraggingId && setDraggingId(null)
      setPreview && setPreview(null)
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    return () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeDragId, draggingId, dayIdx, slotMinutes, pixelsPerMinute, schedules, saveSchedule, setPreview, setDraggingId])

  // safe access to fixedDuration (fallback to slotMinutes if settings unknown)
  function fixedDurationSafe() { return Math.max(1, Math.round((slotMinutes || 60))) }

  const uid = `daycol-${dayIdx}-${day}`

  // build dynamic css rules for event placement to avoid inline style props
  const css = useMemo(() => {
    const lines: string[] = []
    // ensure the column bounds its children and prevents event cards from spilling out
    lines.push(`.${uid}{position:relative;height:${dayHeight}px;overflow:hidden;width:100%;box-sizing:border-box;}`)
    slots.forEach((slot, idx) => {
      // slot rows inherit tailwind height classes; add optional padding
      lines.push(`.${uid} .slot-${idx}{}`)
    })
    for (const ev of positioned.items) {
      const dayStart = startHour * 60
      const relStart = Math.max(0, ev.start - dayStart)
      const relEnd = Math.max(relStart + 1, ev.end - dayStart)
      const top = Math.max(0, Math.round(relStart * pixelsPerMinute + ev.lane * STACK_OFFSET_PX + PADDING_PX))
      const height = Math.max(8, Math.round((relEnd - relStart) * pixelsPerMinute - PADDING_PX * 2))
      const z = 20 + ev.lane
      if (stackingMode === 'columns') {
        const laneCount = Math.max(1, positioned.laneCount)
        const w = Math.max(40, Math.floor((columnWidth - 8) / laneCount))
        const left = Math.round((ev.lane * (columnWidth / laneCount)) + 8)
        // ensure cards never exceed column bounds
        lines.push(`.${uid} .ev-${ev.s.id}{position:absolute;top:${top}px;height:${height}px;left:${left}px;width:${w}px;z-index:${z};box-sizing:border-box;max-width:calc(100% - ${PADDING_PX * 2}px);}`)
      } else {
        const left = PADDING_PX
        const width = Math.max(40, Math.round(columnWidth - PADDING_PX * 2))
        lines.push(`.${uid} .ev-${ev.s.id}{position:absolute;top:${top}px;height:${height}px;left:${left}px;width:${width}px;z-index:${z};box-sizing:border-box;max-width:calc(100% - ${PADDING_PX * 2}px);}`)
      }
    }
    // preview placement when active for this column
    if (preview && preview.dayIdx === dayIdx) {
      const pr = preview
      const dayStart = startHour * 60
      const relStart = Math.max(0, pr.startMin - dayStart)
      const relEnd = Math.max(relStart + 1, (pr.startMin + (pr.durationMins || fixedDurationSafe())) - dayStart)
      const top = Math.max(0, Math.round(relStart * pixelsPerMinute + PADDING_PX))
      const height = Math.max(8, Math.round((relEnd - relStart) * pixelsPerMinute - PADDING_PX * 2))
      const left = PADDING_PX
      const width = Math.max(40, Math.round(columnWidth - PADDING_PX * 2))
      lines.push(`.${uid} .preview-block{position:absolute;top:${top}px;height:${height}px;left:${left}px;width:${width}px;z-index:999;opacity:0.7;border:2px dashed rgba(59,130,246,0.6);background:linear-gradient(135deg, rgba(59,130,246,0.06), rgba(99,102,241,0.04));box-sizing:border-box;max-width:calc(100% - ${PADDING_PX * 2}px);}`)
    }
    return lines.join('\n')
  }, [positioned, dayHeight, pixelsPerMinute, stackingMode, columnWidth, slots, startHour])

  return (
    <div className="p-0 border-l border-t bg-white">
      <style>{css}</style>
      <div className={uid}>
        {/* background slot rows */}
        <div className="absolute inset-0">
          {slots.map((slot) => (
            <div key={`slot-${day}-${slot.index}`} className={`text-xs text-gray-400 border-b h-16 slot-${slot.index} p-3`}>{slot.label}</div>
          ))}
        </div>

            {/* events overlay */}
            <div ref={containerRef}>
              {positioned.items.map((ev: any) => (
                <div key={`ev-${ev.s.id}`} className={`ev-${ev.s.id} ${conflictIds && conflictIds.has(ev.s.id) ? 'border-rose-400 bg-rose-50' : ''}`} onMouseDown={(e) => { e.preventDefault(); setActiveDragId(Number(ev.s.id)); setDraggingId && setDraggingId(Number(ev.s.id)); }}>
                  <EventBlock id={ev.s.id} title={ev.s.class_group_name} start={ev.s.start_time} end={ev.s.end_time} room={ev.s.room_name} isLocked={ev.s.is_locked} onClick={() => setSelectedId && setSelectedId(Number(ev.s.id))} />
                </div>
              ))}

              {/* preview block when dragging or hovering */}
              {preview && preview.dayIdx === dayIdx && (
                <div className={`preview-block`}>
                  <EventBlock id={`preview-${dayIdx}`} title={`Preview`} start={minutesToTimeStr(preview.startMin)} end={minutesToTimeStr(preview.startMin + (preview.durationMins || fixedDurationSafe()))} room={''} isLocked={false} />
                </div>
              )}
            </div>
      </div>
    </div>
  )
}
