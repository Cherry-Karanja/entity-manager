"use client"
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react'
import { Department, Programme, ClassGroup } from '@/components/features/institution/types'
import { Room } from '../../types'
import { useDebounceSearch } from '@/hooks/useDebounce'
import { motion, AnimatePresence } from 'framer-motion'
import { classGroupScheduleApi } from '../../class-group-schedules/api/client'
import { timetableSettingClient } from '../../timetable-settings'
import { departmentsApiClient, programmesApiClient,classGroupsApiClient } from '@/components/features/institution'
import { classGroupScheduleClient } from '../../class-group-schedules'
import { ClassGroupSchedule, TimetableSettings, DayOfWeek } from '../../types'
import { roomClient } from '../../rooms'
import { AlertCircle, Check, X } from 'lucide-react'
import ScheduleToolbar from './ScheduleToolbar'
import ScheduleFilters from './ScheduleFilters'
import ScheduleGrid from './ScheduleGrid'
interface ScheduleEditorProps { timetableId: string }


const pad = (n: number) => String(n).padStart(2, '0')
const formatTime = (h: number, m: number) => `${pad(h)}:${pad(m)}`

export default function ScheduleEditor({ timetableId }: ScheduleEditorProps) {
  const [schedules, setSchedules] = useState<ClassGroupSchedule[]>([])
  const [filteredSchedules, setFilteredSchedules] = useState<ClassGroupSchedule[]>([])
  const [timetableSettings, setTimetableSettings] = useState<TimetableSettings | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRoom, setSelectedRoom] = useState<string>('')
  const [selectedGroup, setSelectedGroup] = useState<string>('')
  const [isFullscreen, setIsFullscreen] = useState(false)
  // placeholder for potential hover state (not used in refactor yet)

  const HOUR_PX = 60
  const pixelsPerMinute = HOUR_PX / 60
  const slotMinutes = timetableSettings?.slot_duration_minutes ?? 60
  // Fixed session duration (defined by timetable settings). Sessions always use this length.
  const fixedDuration = timetableSettings?.preferred_class_duration ?? slotMinutes
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [columnWidth, setColumnWidth] = useState(150)
  const [draggingId, setDraggingId] = useState<number | null>(null)
  const [preview, setPreview] = useState<{ dayIdx: number, startMin: number, durationMins: number } | null>(null)
  const [pendingSave, setPendingSave] = useState<null | { updated: ClassGroupSchedule, localViolations: string[], serverConflicts?: ClassGroupSchedule[] }>(null)
  const [showConflictModal, setShowConflictModal] = useState(false)
  const [conflictIds, setConflictIds] = useState<Set<number>>(new Set())
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [stackingMode, setStackingMode] = useState<'vertical' | 'columns'>('vertical')
  const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null)
  const [departments, setDepartments] = useState<Department[]>([])
  const [programmes, setProgrammes] = useState<Programme[]>([])
  const [classGroupsOptions, setClassGroupsOptions] = useState<ClassGroup[]>([])
  const [roomsOptions, setRoomsOptions] = useState<Room[]>([])
  const [selectedProgramme, setSelectedProgramme] = useState<string|undefined>(undefined)
  const [programmesPage, setProgrammesPage] = useState(1)
  const [classGroupsPage, setClassGroupsPage] = useState(1)
  const [roomsPage, setRoomsPage] = useState(1)
  const PAGE_SIZE = 25
  const { debouncedSearchTerm: debouncedDeptSearch } = useDebounceSearch('', 300)
  const { debouncedSearchTerm: debouncedProgrammeSearch } = useDebounceSearch('', 300)
  const { debouncedSearchTerm: debouncedGroupSearch } = useDebounceSearch('', 300)
  const { debouncedSearchTerm: debouncedRoomSearch } = useDebounceSearch('', 300)
  const [selectedDepartment, setSelectedDepartment] = useState<string|undefined>(undefined)
  const searchRef = useRef<HTMLInputElement | null>(null)
  const classGroupsReqRef = useRef(0)
  const roomsReqRef = useRef(0)
  const programmesReqRef = useRef(0)
  const schedulesReqRef = useRef(0)
  const nudgeRef = useRef<((s: ClassGroupSchedule, dm: number, dd?: number) => void) | null>(null)

  // clamp helper was used in previous placement calculations; kept inline in helpers as needed

  // Auto-dismiss notifications
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 4000)
      return () => clearTimeout(timer)
    }
  }, [notification])

  useEffect(() => {
    let mounted = true
    async function load() {
      try {
        const resp = await classGroupScheduleApi.list({ timetable: timetableId, pageSize: 1000 })
        const items = (resp as any).results || (resp as any).data || resp
        if (mounted) {
          setSchedules(items || [])
          setFilteredSchedules(items || [])
        }
        const tt = await timetableSettingClient.list({ timetable: timetableId })
        const ttItems = (tt as any).results || (tt as any).data || tt
        let firstSetting: TimetableSettings | null = null
        if (Array.isArray(ttItems)) {
          firstSetting = ttItems[0] || null
        } else if (ttItems && typeof ttItems === 'object') {
          firstSetting = ttItems as TimetableSettings
        }
        if (mounted) setTimetableSettings(firstSetting)
        // fetch departments for filters (backend-driven) using departmentsApiClient (initial small page)
        try {
          const dResp = await departmentsApiClient.list({ pageSize: 50 })
          const dItems = (dResp as any).results || (dResp as any).data || dResp
          if (mounted && Array.isArray(dItems)) setDepartments(dItems)
        } catch (err) {
          console.warn('Failed to fetch departments', err)
        }
      } catch (e) {
        console.error(e)
        if (mounted) setNotification({ type: 'error', message: 'Failed to load schedules' })
      }
    }
    load()
    return () => { mounted = false }
  }, [timetableId])

  // Fetch schedules from backend when filters change so displayed data is authoritative
  useEffect(() => {
    let mounted = true
    const reqId = schedulesReqRef.current + 1
    schedulesReqRef.current = reqId
    // only fetch when there's a timetable and at least one filter is set (avoids unnecessary re-fetch)
    const shouldFetch = Boolean(timetableId && (selectedDepartment || selectedProgramme || selectedGroup || selectedRoom || debouncedGroupSearch || debouncedRoomSearch))
    if (!shouldFetch) return

    ;(async () => {
      try {
        const params: any = { timetable: timetableId, pageSize: 1000 }
        if (selectedGroup) params.class_group = selectedGroup
        else if (selectedProgramme) params['class_group__programme'] = selectedProgramme
        else if (selectedDepartment) params['class_group__programme__department'] = selectedDepartment
        if (selectedRoom) params.room = selectedRoom
        // include group/room search as server search when present
        if (debouncedGroupSearch) params.search = debouncedGroupSearch
        if (debouncedRoomSearch && !debouncedGroupSearch) params.search = debouncedRoomSearch

        const res = await classGroupScheduleApi.list(params)
        if (!mounted) return
        if (schedulesReqRef.current !== reqId) return
        const items = (res as any).results || (res as any).data || res || []
        setSchedules(items)
        setFilteredSchedules(items)
      } catch (err) {
        console.warn('Failed to fetch filtered schedules', err)
      }
    })()

    return () => { mounted = false }
  }, [timetableId, selectedDepartment, selectedProgramme, selectedGroup, selectedRoom, debouncedGroupSearch, debouncedRoomSearch])

  // Debounced search for departments
  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const q = (debouncedDeptSearch || '').trim()
        if (!q) return
        const resp = await departmentsApiClient.list({ search: q, pageSize: 100 })
        const items = (resp as any).results || (resp as any).data || resp
        if (mounted && Array.isArray(items)) setDepartments(items)
      } catch (err) {
        console.warn('Department search failed', err)
      }
    })()
    return () => { mounted = false }
  }, [debouncedDeptSearch,selectedDepartment])

  useEffect(() => {
    // reset paging when search or department changes
    setClassGroupsPage(1)
  }, [selectedDepartment, debouncedGroupSearch])

  // reset paging when programme changes or group search changes
  useEffect(() => {
    setClassGroupsPage(1)
  }, [selectedProgramme, debouncedGroupSearch])

  useEffect(() => {
    let mounted = true
    const reqId = classGroupsReqRef.current + 1
    classGroupsReqRef.current = reqId
    // guard: only run if there's either a department, programme or a search term
    if (!selectedDepartment && !selectedProgramme && !debouncedGroupSearch) { setClassGroupsOptions([]); return }
    ;(async () => {
      try {
        const params: any = { pageSize: PAGE_SIZE, page: classGroupsPage }
        // backend expects Django-style lookup params for nested filters
        if (selectedProgramme) params['class_group__programme'] = selectedProgramme
        else if (selectedDepartment) params['class_group__programme__department'] = selectedDepartment
        // allow optional filtering of class group options by room (show only groups that have schedules in the room)
        if (selectedRoom) params.room = selectedRoom
        if (debouncedGroupSearch) params.search = debouncedGroupSearch
        const res = await classGroupsApiClient.list(params)
        if (!mounted) return
        // ignore stale responses
        if (classGroupsReqRef.current !== reqId) return
        const items = (res as any).results || (res as any).data || res || []
        // append or replace based on page
        setClassGroupsOptions(prev => classGroupsPage > 1 ? [...prev, ...items] : items)
        // detect pagination (pagination handling intentionally omitted in this refactor)
      } catch (err) {
        console.warn('Failed to fetch class groups', err)
        if (classGroupsPage === 1) setClassGroupsOptions([])
      }
    })()
    return () => { mounted = false }
  }, [selectedDepartment, selectedProgramme, debouncedGroupSearch, classGroupsPage, selectedRoom])

  // Also trigger class group fetch when debouncedGroupSearch changes
  useEffect(() => {
    // NOTE: removed duplicate effect — class groups are fetched in the main effect above
  }, [debouncedGroupSearch, selectedDepartment, selectedProgramme])

  // ensure search-only class group effect also reruns when selectedProgramme changes


  // Fetch programmes for selected department (paginated + search)
  useEffect(() => {
    let mounted = true
    // if no department and no search, clear
    if (!selectedDepartment && !debouncedProgrammeSearch) { setProgrammes([]); return }
    const reqId = programmesReqRef.current + 1
    programmesReqRef.current = reqId
    ;(async () => {
      try {
        const params: any = { pageSize: PAGE_SIZE, page: programmesPage }
        if (selectedDepartment) params.department = selectedDepartment
        if (debouncedProgrammeSearch) params.search = debouncedProgrammeSearch
        const res = await programmesApiClient.list(params)
        if (!mounted) return
        if (programmesReqRef.current !== reqId) return
        const items = (res as any).results || (res as any).data || res || []
        setProgrammes(prev => programmesPage > 1 ? [...prev, ...items] : items)
      } catch (err) {
        console.warn('Failed to fetch programmes', err)
        if (programmesPage === 1) setProgrammes([])
      }
    })()
    return () => { mounted = false }
  }, [selectedDepartment, debouncedProgrammeSearch, programmesPage])

  // reset programmes when department changes
  useEffect(() => {
    setSelectedProgramme(undefined)
    setProgrammes([])
    setProgrammesPage(1)
  }, [selectedDepartment])

  useEffect(() => {
    // reset rooms page when search or group/department changes
    setRoomsPage(1)
  }, [selectedGroup, debouncedRoomSearch, selectedDepartment])

  useEffect(() => {
    let mounted = true
    const reqId = roomsReqRef.current + 1
    roomsReqRef.current = reqId
    if (!selectedGroup && !debouncedRoomSearch && !selectedDepartment) { setRoomsOptions([]); return }
    ;(async () => {
      try {
        const params: any = { pageSize: PAGE_SIZE, page: roomsPage }
        // derive department from selectedGroup when available
        if (selectedGroup) {
          const sg: any = classGroupsOptions.find((g: any) => String(g.id || g.pk || g.name) === String(selectedGroup))
          const derivedDept = sg?.programme?.department || sg?.programme?.department_id || sg?.department || sg?.department_id || selectedDepartment
          if (derivedDept) params.department = derivedDept
        } else if (selectedDepartment) {
          params.department = selectedDepartment
        }
        if (debouncedRoomSearch) params.search = debouncedRoomSearch
        const res = await roomClient.list(params)
        if (!mounted) return
        // ignore stale responses
        if (roomsReqRef.current !== reqId) return
        const items = (res as any).results || (res as any).data || res || []
        setRoomsOptions(prev => roomsPage > 1 ? [...prev, ...items] : items)
      } catch (err) {
        console.warn('Failed to fetch rooms', err)
        if (roomsPage === 1) setRoomsOptions([])
      }
    })()
    return () => { mounted = false }
  }, [selectedGroup, debouncedRoomSearch, roomsPage, selectedDepartment, classGroupsOptions])

  // Filter schedules based on search and filters
  useEffect(() => {
    let filtered = schedules
    const query = (searchQuery || '').trim().toLowerCase()

    if (query) {
      filtered = filtered.filter(s => {
        return (
          (s.class_group_name || '').toLowerCase().includes(query) ||
          (s.room_name || '').toLowerCase().includes(query) ||
          (s.class_group !== undefined && s.class_group !== null && String(s.class_group).toLowerCase().includes(query))
        )
      })
    }

    if (selectedRoom) {
      // selectedRoom may be an id (from backend) or a room name
      const rid = Number(selectedRoom || NaN)
      filtered = filtered.filter(s => {
        return (
          (s.room && (Number((s as any).room) === rid)) ||
          (s.room_id && Number((s as any).room_id) === rid) ||
          s.room_name === selectedRoom || String(s.room) === selectedRoom
        )
      })
    }

    if (selectedGroup) {
      const gid = Number(selectedGroup || NaN)
      filtered = filtered.filter(s => {
        return (
          (s.class_group && Number((s as any).class_group) === gid) ||
          (s.class_group_name === selectedGroup) ||
          String(s.class_group) === selectedGroup
        )
      })
    }

    setFilteredSchedules(filtered)
  }, [schedules, searchQuery, selectedRoom, selectedGroup])

  // keyboard shortcut to focus search ("/" or Ctrl+K)
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.key === '/' || (e.ctrlKey && e.key.toLowerCase() === 'k')) && document.activeElement && (document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA')) {
        e.preventDefault()
        searchRef.current?.focus()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  // keyboard nudges for selected schedule (arrow keys)
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!selectedId) return
      const sched = schedules.find(s => Number(s.id) === Number(selectedId))
      if (!sched) return
      if (e.key === 'ArrowUp') { e.preventDefault(); nudgeRef.current?.(sched, -slotMinutes) }
      else if (e.key === 'ArrowDown') { e.preventDefault(); nudgeRef.current?.(sched, slotMinutes) }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); nudgeRef.current?.(sched, 0, -1) }
      else if (e.key === 'ArrowRight') { e.preventDefault(); nudgeRef.current?.(sched, 0, 1) }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [selectedId, schedules, slotMinutes])

  const days: DayOfWeek[] = useMemo(() => {
    if (timetableSettings?.enabled_days && timetableSettings.enabled_days.length) return timetableSettings.enabled_days as DayOfWeek[]
    return ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']
  }, [timetableSettings])

  const startHour = timetableSettings?.start_hour ? parseInt(timetableSettings.start_hour.split(':')[0], 10) : 8
  const endHour = timetableSettings?.end_hour ? parseInt(timetableSettings.end_hour.split(':')[0], 10) : 17
  const totalMinutes = Math.max(0, (endHour - startHour) * 60)
  const slotsCount = Math.max(1, Math.ceil(totalMinutes / slotMinutes))
  const slots = Array.from({ length: slotsCount }).map((_, i) => {
    const total = startHour * 60 + i * slotMinutes
    return { index: i, total, label: formatTime(Math.floor(total / 60), total % 60) }
  })

  const slotPx = slotMinutes * pixelsPerMinute

  function parseTime(t: string) { const [hh, mm] = (t || '00:00').split(':').map(x => parseInt(x || '0', 10) || 0); return { hh, mm } }

  const timeStrToMinutes = useCallback((t: string) => {
    const { hh, mm } = parseTime(t)
    return hh * 60 + mm
  }, [])

  // Statistics
  const stats = useMemo(() => {
    const totalClasses = filteredSchedules.length
    const roomsUsed = new Set(filteredSchedules.map(s => s.room_name).filter(Boolean)).size
    const groupsScheduled = new Set(filteredSchedules.map(s => s.class_group)).size
    const lockedClasses = filteredSchedules.filter(s => s.is_locked).length
    
    return { totalClasses, roomsUsed, groupsScheduled, lockedClasses }
  }, [filteredSchedules])

  // NOTE: filter option lists are provided by backend clients (departments, classGroupsOptions, roomsOptions)

  // If a room is selected, narrow class group options to those that actually have schedules in that room
  const visibleClassGroups = useMemo(() => {
    if (!selectedRoom) return classGroupsOptions
    // match schedules to class groups by id/PK/name and room by id or name
    return classGroupsOptions.filter(g => {
      const gid = String(g.id ?? g.pk ?? g.name ?? '')
      return filteredSchedules.some(s => {
        const sG = String((s as any).class_group ?? (s as any).class_group_id ?? s.class_group_name ?? '')
        const sRoom = String((s as any).room ?? (s as any).room_id ?? (s as any).room_name ?? '')
        return sG === gid && (sRoom === String(selectedRoom) || String(s.room_name) === String(selectedRoom))
      })
    })
  }, [classGroupsOptions, selectedRoom, filteredSchedules])

  // Max display columns (legacy) - kept for reference; current stacking uses dynamic offsets (unused)
  // Vertical stacking and padding are handled in the DayColumn component after refactor

  // Each logical slot maps to a fixed pixel height so schedule blocks align precisely
  const slotHeights = useMemo(() => Array.from({ length: slotsCount }).map(() => slotPx), [slotsCount, slotPx])

  const totalHeight = useMemo(() => Math.max(48, slotsCount * slotPx), [slotsCount, slotPx])

  const slotTopOffsets = useMemo(() => {
    const out: number[] = []
    let acc = 0
    for (let i = 0; i < slotHeights.length; i++) {
      out.push(acc)
      acc += slotHeights[i]
    }
    return out
  }, [slotHeights])

  useEffect(() => {
    const measure = () => {
      const el = containerRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const available = Math.max(200, rect.width - 80)
      const w = Math.max(100, Math.floor(available / Math.max(1, days.length)))
      setColumnWidth(w)
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [slots.length, days.length])

  const hasLocalOverlap = useCallback((updated: ClassGroupSchedule) => {
    const updStart = timeStrToMinutes(updated.start_time)
    const updEnd = updStart + fixedDuration
    return schedules.some(s => {
      if (s.id === updated.id) return false
      if (s.day_of_week !== updated.day_of_week) return false
      const sStart = timeStrToMinutes(s.start_time)
      const sEnd = sStart + fixedDuration
      return (sStart < updEnd && sEnd > updStart)
    })
  }, [timeStrToMinutes, fixedDuration, schedules])

  const checkConstraintsLocally = useCallback((updated: ClassGroupSchedule) => {
    const violations: string[] = []
    if (!timetableSettings) return violations
    const preferred = timetableSettings.preferred_class_duration || 0
    const minBreak = timetableSettings.min_break_between_classes || 0
    const maxConsec = timetableSettings.max_consecutive_classes || 0

    const start = timeStrToMinutes(updated.start_time)
    const duration = fixedDuration
    const end = start + duration

    if (preferred > 0 && duration !== preferred) {
      violations.push(`Duration ${duration}m does not match preferred class duration of ${preferred}m.`)
    }

    if (minBreak > 0 && updated.class_group) {
      const sameGroup = schedules.filter(s => s.id !== updated.id && s.day_of_week === updated.day_of_week && s.class_group === updated.class_group)
      for (const s of sameGroup) {
        const sStart = timeStrToMinutes(s.start_time)
        const sEnd = sStart + fixedDuration
        const gap = Math.max(0, Math.min(Math.abs(sStart - end), Math.abs(start - sEnd)))
        if (gap < minBreak) {
          violations.push(`Break between classes for this group is ${gap}m which is less than the minimum ${minBreak}m.`)
          break
        }
      }
    }

    if (maxConsec > 0 && updated.class_group) {
      const sameDay = schedules.filter(s => s.id !== updated.id && s.day_of_week === updated.day_of_week && s.class_group === updated.class_group)
      const times = sameDay.map(s => ({ start: timeStrToMinutes(s.start_time), end: timeStrToMinutes(s.start_time) + fixedDuration }))
      times.push({ start, end })
      times.sort((a, b) => a.start - b.start)
      let consecutive = 1
      let maxFound = 1
      for (let i = 1; i < times.length; i++) {
        const gap = times[i].start - times[i-1].end
        if (gap <= (minBreak || 0)) { consecutive += 1 } else { consecutive = 1 }
        maxFound = Math.max(maxFound, consecutive)
      }
      if (maxFound > maxConsec) {
        violations.push(`This change would create ${maxFound} consecutive classes for the group (limit is ${maxConsec}).`)
      }
    }

    return violations
  }, [timetableSettings, schedules, timeStrToMinutes, fixedDuration])

  const performSave = useCallback(async (updated: ClassGroupSchedule) => {
    const prev = schedules
    setSchedules(arr => arr.map(it => it.id === updated.id ? updated : it))
    setPendingSave(null)
    try {
      // enforce fixed duration on save
      const start = timeStrToMinutes(updated.start_time)
      const end = formatTime(Math.floor((start + fixedDuration) / 60), (start + fixedDuration) % 60)
      await classGroupScheduleApi.update(updated.id, {
        start_time: updated.start_time,
        end_time: end,
        day_of_week: updated.day_of_week,
      })
      setNotification({ type: 'success', message: 'Schedule updated successfully' })
    } catch (err) {
      setSchedules(prev)
      setNotification({ type: 'error', message: 'Failed to save schedule' })
      console.error('Failed to save schedule', err)
    }
  }, [schedules, setSchedules, timeStrToMinutes, fixedDuration])

  const saveSchedule = useCallback(async (updated: ClassGroupSchedule) => {
    const localViolations: string[] = []
    if (hasLocalOverlap(updated)) localViolations.push('This schedule overlaps with an existing schedule.')
    const constraintViolations = checkConstraintsLocally(updated)
    if (constraintViolations.length) localViolations.push(...constraintViolations)

    let serverConflicts: any[] | undefined = undefined
    try {
      const dayIdx = days.indexOf(updated.day_of_week as DayOfWeek)
      const ttId = Number(timetableId)
      const excludeId = updated.id ? Number(updated.id) : undefined
      // ensure we pass fixed duration end time when checking conflicts on the server
      const start = timeStrToMinutes(updated.start_time)
      const endTime = formatTime(Math.floor((start + fixedDuration) / 60), (start + fixedDuration) % 60)
      const resp = await classGroupScheduleApi.checkConflicts(ttId, dayIdx, updated.start_time, endTime, excludeId)
      if (resp && resp.conflicts && resp.conflicts.length) serverConflicts = resp.conflicts
    } catch (err) {
      console.warn('Constraint check failed (server), proceeding to inline warnings', err)
    }

    if (localViolations.length || (serverConflicts && serverConflicts.length)) {
      setPendingSave({ updated, localViolations, serverConflicts })
      return
    }

    // enforce fixed duration before saving
    const start = timeStrToMinutes(updated.start_time)
    const endTime = formatTime(Math.floor((start + fixedDuration) / 60), (start + fixedDuration) % 60)
    const toSave = { ...updated, end_time: endTime }
    await performSave(toSave as ClassGroupSchedule)
  }, [hasLocalOverlap, checkConstraintsLocally, days, timetableId, timeStrToMinutes, fixedDuration, performSave])

  const nudgeSchedule = useCallback((s: ClassGroupSchedule, deltaMins: number, deltaDays = 0) => {
    try {
      const orig = parseTime(s.start_time)
      const origTotal = orig.hh * 60 + orig.mm
      const duration = fixedDuration
      const snap = slotMinutes
      let newTotal = origTotal + deltaMins
      newTotal = Math.round(newTotal / snap) * snap
      let newHour = Math.floor(newTotal / 60)
      const newMin = newTotal % 60
      newHour = Math.max(startHour, Math.min(newHour, endHour - Math.ceil(duration / 60)))
      const startStr = formatTime(newHour, newMin)
      const endTotal = newHour * 60 + newMin + duration
      const endStr = formatTime(Math.floor(endTotal / 60), endTotal % 60)
      const origDay = days.indexOf(s.day_of_week as DayOfWeek)
      const newDay = Math.max(0, Math.min(origDay + deltaDays, days.length - 1))
      const updated = { ...s, start_time: startStr, end_time: endStr, day_of_week: days[newDay] }
      // fire-and-forget
      void saveSchedule(updated)
    } catch (err) {
      console.error('nudge error', err)
    }
  }, [fixedDuration, slotMinutes, startHour, endHour, days, saveSchedule])

  // expose current nudge function to a ref so earlier effects can call it without TDZ
  useEffect(() => {
    nudgeRef.current = nudgeSchedule
    return () => { nudgeRef.current = null }
  }, [nudgeSchedule])

  const clearFilters = () => {
    setSearchQuery('')
    setSelectedRoom('')
    setSelectedGroup('')
    setSelectedProgramme(undefined)
    setSelectedDepartment(undefined)
  }

  return (
    <div className={`w-full ${isFullscreen ? 'fixed inset-0 z-50 bg-white p-6' : ''}`}>
      {/* Toolbar and Filters - modular components */}
      <ScheduleToolbar
        stackingMode={stackingMode}
        setStackingMode={setStackingMode}
        isFullscreen={isFullscreen}
        setIsFullscreen={setIsFullscreen}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        stats={stats}
        clearFilters={clearFilters}
        selectedDepartment={selectedDepartment}
        selectedProgramme={selectedProgramme}
        selectedGroup={selectedGroup}
        selectedRoom={selectedRoom}
        selectedDepartmentLabel={(() => {
          const it = departments.find(d => String(d.id || d.pk || d.name) === String(selectedDepartment))
          return it ? (it.name || it.title || it.label || String(it.id || it.pk || '')) : undefined
        })()}
        selectedProgrammeLabel={(() => {
          const it = programmes.find(p => String(p.id || p.pk || p.name) === String(selectedProgramme))
          return it ? (it.name || it.title || it.label || String(it.id || it.pk || '')) : undefined
        })()}
        selectedGroupLabel={(() => {
          const it = classGroupsOptions.find(g => String(g.id || g.pk || g.name) === String(selectedGroup))
          return it ? (it.name || it.title || it.class_group_name || String(it.id || it.pk || '')) : undefined
        })()}
        selectedRoomLabel={(() => {
          const it = roomsOptions.find(r => String(r.id || r.pk || r.name) === String(selectedRoom))
          return it ? (it.name || it.title || it.label || String(it.id || it.pk || '')) : undefined
        })()}
        clearDepartment={() => setSelectedDepartment(undefined)}
        clearProgramme={() => setSelectedProgramme(undefined)}
        clearGroup={() => setSelectedGroup('')}
        clearRoom={() => setSelectedRoom('')}
      />
      <ScheduleFilters
        departments={departments}
        programmes={programmes}
        classGroups={visibleClassGroups}
        rooms={roomsOptions}
        selectedDepartment={selectedDepartment}
        selectedProgramme={selectedProgramme}
        selectedGroup={selectedGroup}
        selectedRoom={selectedRoom}
        setSelectedDepartment={(v?: string) => setSelectedDepartment(v)}
        setSelectedProgramme={(v?: string) => setSelectedProgramme(v)}
        setSelectedGroup={(v: string) => setSelectedGroup(v)}
        setSelectedRoom={(v: string) => setSelectedRoom(v)}
      />

      {/* Notifications */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`mb-4 p-4 rounded-lg flex items-center gap-3 ${
              notification.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
            }`}
          >
            {notification.type === 'success' ? (
              <Check className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            <span className="flex-1">{notification.message}</span>
            <button onClick={() => setNotification(null)} className="hover:opacity-70" aria-label="Dismiss notification">
              <X className="w-5 h-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Schedule Grid (scaffolded) */}
      <ScheduleGrid
        containerRef={containerRef}
        days={days}
        slots={slots}
        slotHeights={slotHeights}
        slotTopOffsets={slotTopOffsets}
        slotMinutes={slotMinutes}
        pixelsPerMinute={pixelsPerMinute}
        startHour={startHour}
        totalHeight={totalHeight}
        dayData={useMemo(() => {
          const map: { [key: string]: any[] } = {}
          days.forEach(d => {
            map[d] = filteredSchedules.filter(s => s.day_of_week === d).map(s => ({ s, start: timeStrToMinutes(s.start_time), end: timeStrToMinutes(s.start_time) + fixedDuration }))
          })
          return map
        }, [filteredSchedules, days, fixedDuration, timeStrToMinutes])}
        stackingMode={stackingMode}
        columnWidth={columnWidth}
        draggingId={draggingId}
        setDraggingId={setDraggingId}
        preview={preview}
        setPreview={setPreview}
        conflictIds={conflictIds}
        setConflictIds={setConflictIds}
        setSelectedId={setSelectedId}
        schedules={schedules}
        saveSchedule={saveSchedule}
        nudgeSchedule={nudgeSchedule}
      />

      {/* Inline warnings / pending save banner */}
      {pendingSave && (
        <div className="mt-3 p-3 border rounded bg-rose-50">
          <div className="flex items-start justify-between">
            <div>
              <div className="font-medium text-sm text-rose-800">Cannot save — timetable constraints violated</div>
              {pendingSave.localViolations.length > 0 && (
                <ul className="mt-2 list-disc list-inside text-sm text-rose-800">
                  {pendingSave.localViolations.map((v, i) => <li key={`lv-${i}`}>{v}</li>)}
                </ul>
              )}
              {pendingSave.serverConflicts && pendingSave.serverConflicts.length > 0 && (
                <div className="mt-2 text-sm text-rose-800">Server reported {pendingSave.serverConflicts.length} conflict(s). Please resolve them before saving.</div>
              )}
            </div>
            <div className="flex items-center gap-2">
                {pendingSave.serverConflicts && pendingSave.serverConflicts.length > 0 && (
                  <button className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded text-sm" onClick={() => { setShowConflictModal(true) }}>View conflicts</button>
                )}
              <button className="px-3 py-1 bg-gray-200 text-gray-800 rounded text-sm" onClick={() => { setPendingSave(null) }}>Dismiss</button>
            </div>
          </div>
        </div>
      )}

        {/* Conflict modal */}
        {showConflictModal && pendingSave && pendingSave.serverConflicts && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-[min(900px,95%)] p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Conflicting schedules</h3>
                <button className="text-sm text-gray-500" onClick={() => setShowConflictModal(false)}>Close</button>
              </div>
              <div className="max-h-[50vh] overflow-auto">
                {pendingSave.serverConflicts.map((c: any, i: number) => (
                  <div key={`conf-${i}`} className="p-3 border-b last:border-b-0 flex items-start justify-between gap-4">
                    <div>
                      <div className="font-medium">{c.class_group_name || `Class ${c.id}`}</div>
                      <div className="text-sm text-gray-600">{c.day_of_week} • {c.start_time} - {c.end_time} • {c.room_name}</div>
                      <div className="text-sm text-gray-700 mt-2">{c.note || ''}</div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <button className="px-3 py-1 bg-blue-50 text-blue-800 rounded text-sm" onClick={() => {
                        try {
                          const di = days.indexOf(c.day_of_week as DayOfWeek)
                          if (di >= 0) setPreview({ dayIdx: di, startMin: timeStrToMinutes(c.start_time), durationMins: fixedDuration })
                          setConflictIds(prev => new Set([...(prev ? Array.from(prev) : []), Number(c.id)]))
                        } catch (e) { console.error(e) }
                      }}>Preview</button>
                      <button className="px-3 py-1 bg-gray-100 text-gray-800 rounded text-sm" onClick={() => { setShowConflictModal(false) }}>Close</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      <div className="mt-3 flex items-center justify-between">
        <div className="text-sm text-gray-600">Arrow keys nudge by <strong>{String(slotMinutes)}</strong> minutes (slots are fixed)</div>
      </div>
    </div>
  )
}