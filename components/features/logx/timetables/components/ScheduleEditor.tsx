"use client"
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react'
import { useDebounceSearch } from '@/hooks/useDebounce'
import { motion, AnimatePresence } from 'framer-motion'
import { classGroupScheduleApi } from '../../class-group-schedules/api/client'
import { timetableSettingClient } from '../../timetable-settings'
import { departmentsApiClient, programmesApiClient } from '@/components/features/institution'
import { classGroupScheduleClient } from '../../class-group-schedules'
import { ClassGroupSchedule, TimetableSettings, DayOfWeek } from '../../types'
import { roomClient } from '../../rooms'
import { Search, Calendar, Clock, AlertCircle, Check, X, Maximize2, Minimize2 } from 'lucide-react'
// use command component for search filters for departments classgroups and rooms
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
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
  const showStats = true
  const [hoveredSchedule, setHoveredSchedule] = useState<number | null>(null)

  const HOUR_PX = 60
  const pixelsPerMinute = HOUR_PX / 60
  const slotMinutes = timetableSettings?.slot_duration_minutes ?? 60
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [columnWidth, setColumnWidth] = useState(150)
  const [draggingId, setDraggingId] = useState<number | null>(null)
  const [preview, setPreview] = useState<{ dayIdx: number, startMin: number, durationMins: number } | null>(null)
  const [pendingSave, setPendingSave] = useState<null | { updated: ClassGroupSchedule, localViolations: string[], serverConflicts?: any[] }>(null)
  const [conflictIds, setConflictIds] = useState<Set<number>>(new Set())
  const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null)
  const [departments, setDepartments] = useState<any[]>([])
  const [programmes, setProgrammes] = useState<any[]>([])
  const [classGroupsOptions, setClassGroupsOptions] = useState<any[]>([])
  const [roomsOptions, setRoomsOptions] = useState<any[]>([])
  const [selectedProgramme, setSelectedProgramme] = useState<string|undefined>(undefined)
  const [programmesPage, setProgrammesPage] = useState(1)
  const [programmesHasMore, setProgrammesHasMore] = useState(false)
  const [classGroupsPage, setClassGroupsPage] = useState(1)
  const [classGroupsHasMore, setClassGroupsHasMore] = useState(false)
  const [roomsPage, setRoomsPage] = useState(1)
  const [roomsHasMore, setRoomsHasMore] = useState(false)
  const PAGE_SIZE = 25
  const [deptOpen, setDeptOpen] = useState(false)
  const [programmeOpen, setProgrammeOpen] = useState(false)
  const [groupOpen, setGroupOpen] = useState(false)
  const [roomOpen, setRoomOpen] = useState(false)
  const { searchTerm: deptSearchTerm, debouncedSearchTerm: debouncedDeptSearch, setSearchTerm: setDeptSearch } = useDebounceSearch('', 300)
  const { searchTerm: programmeSearchTerm, debouncedSearchTerm: debouncedProgrammeSearch, setSearchTerm: setProgrammeSearch } = useDebounceSearch('', 300)
  const { searchTerm: groupSearchTerm, debouncedSearchTerm: debouncedGroupSearch, setSearchTerm: setGroupSearch } = useDebounceSearch('', 300)
  const { searchTerm: roomSearchTerm, debouncedSearchTerm: debouncedRoomSearch, setSearchTerm: setRoomSearch } = useDebounceSearch('', 300)
  const [selectedDepartment, setSelectedDepartment] = useState<string|undefined>(undefined)
  const searchRef = useRef<HTMLInputElement | null>(null)
  const classGroupsReqRef = useRef(0)
  const roomsReqRef = useRef(0)
  const programmesReqRef = useRef(0)
  const schedulesReqRef = useRef(0)

  const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v))

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

    (async () => {
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
    if (!selectedDepartment && !selectedProgramme && !debouncedGroupSearch) { setClassGroupsOptions([]); setClassGroupsHasMore(false); return }
    (async () => {
      try {
        const params: any = { pageSize: PAGE_SIZE, page: classGroupsPage }
        // backend expects Django-style lookup params for nested filters
        if (selectedProgramme) params['class_group__programme'] = selectedProgramme
        else if (selectedDepartment) params['class_group__programme__department'] = selectedDepartment
        if (debouncedGroupSearch) params.search = debouncedGroupSearch
        const res = await classGroupScheduleClient.list(params)
        if (!mounted) return
        // ignore stale responses
        if (classGroupsReqRef.current !== reqId) return
        const items = (res as any).results || (res as any).data || res || []
        // append or replace based on page
        setClassGroupsOptions(prev => classGroupsPage > 1 ? [...prev, ...items] : items)
        // detect pagination
        setClassGroupsHasMore(Boolean((res as any).next))
      } catch (err) {
        console.warn('Failed to fetch class groups', err)
        if (classGroupsPage === 1) setClassGroupsOptions([])
        setClassGroupsHasMore(false)
      }
    })()
    return () => { mounted = false }
  }, [selectedDepartment, selectedProgramme, debouncedGroupSearch, classGroupsPage])

  // Also trigger class group fetch when debouncedGroupSearch changes
  useEffect(() => {
    // NOTE: removed duplicate effect — class groups are fetched in the main effect above
  }, [debouncedGroupSearch, selectedDepartment, selectedProgramme])

  // ensure search-only class group effect also reruns when selectedProgramme changes


  // Fetch programmes for selected department (paginated + search)
  useEffect(() => {
    let mounted = true
    // if no department and no search, clear
    if (!selectedDepartment && !debouncedProgrammeSearch) { setProgrammes([]); setProgrammesHasMore(false); return }
    const reqId = programmesReqRef.current + 1
    programmesReqRef.current = reqId
    (async () => {
      try {
        const params: any = { pageSize: PAGE_SIZE, page: programmesPage }
        if (selectedDepartment) params.department = selectedDepartment
        if (debouncedProgrammeSearch) params.search = debouncedProgrammeSearch
        const res = await programmesApiClient.list(params)
        if (!mounted) return
        if (programmesReqRef.current !== reqId) return
        const items = (res as any).results || (res as any).data || res || []
        setProgrammes(prev => programmesPage > 1 ? [...prev, ...items] : items)
        setProgrammesHasMore(Boolean((res as any).next))
      } catch (err) {
        console.warn('Failed to fetch programmes', err)
        if (programmesPage === 1) setProgrammes([])
        setProgrammesHasMore(false)
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
    if (!selectedGroup && !debouncedRoomSearch && !selectedDepartment) { setRoomsOptions([]); setRoomsHasMore(false); return }
    (async () => {
      try {
        const params: any = { pageSize: PAGE_SIZE, page: roomsPage }
        // derive department from selectedGroup when available
        if (selectedGroup) {
          const sg = classGroupsOptions.find((g: any) => String(g.id || g.pk || g.name) === String(selectedGroup))
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
        setRoomsHasMore(Boolean((res as any).next))
      } catch (err) {
        console.warn('Failed to fetch rooms', err)
        if (roomsPage === 1) setRoomsOptions([])
        setRoomsHasMore(false)
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

  const MAX_DISPLAY_COLUMNS = 3
  // Vertical stacking offset (px) applied per overlapping lane when in vertical stacking mode.
  // Kept small so time alignment remains visually clear but items don't fully obscure each other.
  const STACK_OFFSET_PX = Math.min(12, slotPx * 0.25)

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

  function hasLocalOverlap(updated: ClassGroupSchedule) {
    const updStart = timeStrToMinutes(updated.start_time)
    const updEnd = timeStrToMinutes(updated.end_time)
    return schedules.some(s => {
      if (s.id === updated.id) return false
      if (s.day_of_week !== updated.day_of_week) return false
      const sStart = timeStrToMinutes(s.start_time)
      const sEnd = timeStrToMinutes(s.end_time)
      return (sStart < updEnd && sEnd > updStart)
    })
  }

  function checkConstraintsLocally(updated: ClassGroupSchedule) {
    const violations: string[] = []
    if (!timetableSettings) return violations
    const preferred = timetableSettings.preferred_class_duration || 0
    const minBreak = timetableSettings.min_break_between_classes || 0
    const maxConsec = timetableSettings.max_consecutive_classes || 0

    const start = timeStrToMinutes(updated.start_time)
    const end = timeStrToMinutes(updated.end_time)
    const duration = Math.max(1, end - start)

    if (preferred > 0 && duration !== preferred) {
      violations.push(`Duration ${duration}m does not match preferred class duration of ${preferred}m.`)
    }

    if (minBreak > 0 && updated.class_group) {
      const sameGroup = schedules.filter(s => s.id !== updated.id && s.day_of_week === updated.day_of_week && s.class_group === updated.class_group)
      for (const s of sameGroup) {
        const sStart = timeStrToMinutes(s.start_time)
        const sEnd = timeStrToMinutes(s.end_time)
        const gap = Math.max(0, Math.min(Math.abs(sStart - end), Math.abs(start - sEnd)))
        if (gap < minBreak) {
          violations.push(`Break between classes for this group is ${gap}m which is less than the minimum ${minBreak}m.`)
          break
        }
      }
    }

    if (maxConsec > 0 && updated.class_group) {
      const sameDay = schedules.filter(s => s.id !== updated.id && s.day_of_week === updated.day_of_week && s.class_group === updated.class_group)
      const times = sameDay.map(s => ({ start: timeStrToMinutes(s.start_time), end: timeStrToMinutes(s.end_time) }))
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
  }

  async function performSave(updated: ClassGroupSchedule) {
    const prev = schedules
    setSchedules(arr => arr.map(it => it.id === updated.id ? updated : it))
    setPendingSave(null)
    try {
      await classGroupScheduleApi.update(updated.id, {
        start_time: updated.start_time,
        end_time: updated.end_time,
        day_of_week: updated.day_of_week,
      })
      setNotification({ type: 'success', message: 'Schedule updated successfully' })
    } catch (err) {
      setSchedules(prev)
      setNotification({ type: 'error', message: 'Failed to save schedule' })
      console.error('Failed to save schedule', err)
    }
  }

  async function saveSchedule(updated: ClassGroupSchedule) {
    const localViolations: string[] = []
    if (hasLocalOverlap(updated)) localViolations.push('This schedule overlaps with an existing schedule.')
    const constraintViolations = checkConstraintsLocally(updated)
    if (constraintViolations.length) localViolations.push(...constraintViolations)

    let serverConflicts: any[] | undefined = undefined
    try {
      const dayIdx = days.indexOf(updated.day_of_week as DayOfWeek)
      const ttId = Number(timetableId)
      const excludeId = updated.id ? Number(updated.id) : undefined
      const resp = await classGroupScheduleApi.checkConflicts(ttId, dayIdx, updated.start_time, updated.end_time, excludeId)
      if (resp && resp.conflicts && resp.conflicts.length) serverConflicts = resp.conflicts
    } catch (err) {
      console.warn('Constraint check failed (server), proceeding to inline warnings', err)
    }

    if (localViolations.length || (serverConflicts && serverConflicts.length)) {
      setPendingSave({ updated, localViolations, serverConflicts })
      return
    }

    await performSave(updated)
  }

  function nudgeSchedule(s: ClassGroupSchedule, deltaMins: number, deltaDays = 0) {
    try {
      const orig = parseTime(s.start_time)
      const end = parseTime(s.end_time)
      const origTotal = orig.hh * 60 + orig.mm
      const duration = Math.max(slotMinutes, end.hh * 60 + end.mm - origTotal)
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
      saveSchedule(updated)
    } catch (err) {
      console.error('nudge error', err)
    }
  }

  const clearFilters = () => {
    setSearchQuery('')
    setSelectedRoom('')
    setSelectedGroup('')
    setSelectedProgramme(undefined)
    setSelectedDepartment(undefined)
  }

  return (
    <div className={`w-full ${isFullscreen ? 'fixed inset-0 z-50 bg-white p-6' : ''}`}>
      {/* Header with Search and Filters */}
      <div className="mb-4 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Schedule Editor</h2>
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
          </button>
        </div>

        {/* Statistics */}
        {showStats && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-4 gap-3"
          >
            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="text-xs text-blue-600 font-medium">Total Classes</div>
              <div className="text-2xl font-bold text-blue-900">{stats.totalClasses}</div>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <div className="text-xs text-green-600 font-medium">Rooms Used</div>
              <div className="text-2xl font-bold text-green-900">{stats.roomsUsed}</div>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg">
              <div className="text-xs text-purple-600 font-medium">Groups</div>
              <div className="text-2xl font-bold text-purple-900">{stats.groupsScheduled}</div>
            </div>
            <div className="bg-yellow-50 p-3 rounded-lg">
              <div className="text-xs text-yellow-600 font-medium">Locked</div>
              <div className="text-2xl font-bold text-yellow-900">{stats.lockedClasses}</div>
            </div>
          </motion.div>
        )}

        {/* Search and Filters */}
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by class, room, or group..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              ref={searchRef}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex flex-col">
            <div className="relative">
              <button
                type="button"
                onClick={() => setDeptOpen(v => !v)}
                className="w-full text-left px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {selectedDepartment ? (departments.find(d => String(d.id || d.pk || d.name) === String(selectedDepartment))?.name || selectedDepartment) : 'All Departments'}
              </button>
              {deptOpen && (
                <div className="absolute z-30 mt-1 w-full max-h-60 overflow-hidden border rounded bg-white shadow-sm">
                  <Command className="w-full">
                    <CommandInput
                      value={deptSearchTerm}
                      onValueChange={(v: string) => setDeptSearch(v)}
                      placeholder="Search departments..."
                    />
                    <CommandList>
                      <CommandEmpty>No departments</CommandEmpty>
                      <CommandGroup>
                        <div key="dept-all" className="px-3 py-2 hover:bg-gray-100 cursor-pointer" onMouseDown={() => { setSelectedDepartment(''); setSelectedProgramme(undefined); setSelectedGroup(''); setDeptOpen(false) }}>All Departments</div>
                        {departments.map(d => (
                          <CommandItem key={d.id || d.pk || d.name} onMouseDown={() => { setSelectedDepartment(d.id || d.pk || d.name); setSelectedProgramme(undefined); setSelectedGroup(''); setDeptOpen(false) }}>{d.name || d.title || String(d)}</CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-col">
            <div className="relative">
              <button
                type="button"
                onClick={() => setProgrammeOpen(v => !v)}
                className="w-full text-left px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {selectedProgramme ? (programmes.find(p => String(p.id || p.pk || p.name) === String(selectedProgramme))?.name || selectedProgramme) : 'All Programmes'}
              </button>
              {programmeOpen && (
                <div className="absolute z-30 mt-1 w-full max-h-60 overflow-hidden border rounded bg-white shadow-sm">
                  <Command className="w-full">
                    <CommandInput
                      value={programmeSearchTerm}
                      onValueChange={(v: string) => setProgrammeSearch(v)}
                      placeholder="Search programmes..."
                    />
                    <CommandList>
                      <CommandEmpty>No programmes</CommandEmpty>
                      <CommandGroup>
                        <CommandItem onMouseDown={() => { setSelectedProgramme(undefined); setSelectedGroup(''); setProgrammeOpen(false) }}>All Programmes</CommandItem>
                        {programmes.map((p: any) => (
                          <CommandItem key={p.id || p.pk || p.name} onMouseDown={() => { setSelectedProgramme(p.id || p.pk || p.name); setSelectedGroup(''); setProgrammeOpen(false) }}>{p.name || p.title || String(p)}</CommandItem>
                        ))}
                        {programmesHasMore && (
                          <div className="px-3 py-2 text-center border-t"><button onMouseDown={(e) => { e.preventDefault(); setProgrammesPage(p => p + 1) }} className="text-sm text-blue-600">Load more</button></div>
                        )}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col">
            <div className="relative">
              <button
                type="button"
                onClick={() => setGroupOpen(v => !v)}
                className="w-full text-left px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {selectedGroup ? (classGroupsOptions.find((g:any) => String(g.id || g.pk || g.name) === String(selectedGroup))?.name || selectedGroup) : 'All Groups'}
              </button>
              {groupOpen && (
                <div className="absolute z-30 mt-1 w-full max-h-60 overflow-hidden border rounded bg-white shadow-sm">
                  <Command className="w-full">
                    <CommandInput
                      value={groupSearchTerm}
                      onValueChange={(v: string) => setGroupSearch(v)}
                      placeholder="Search groups..."
                    />
                    <CommandList>
                      <CommandEmpty>No groups</CommandEmpty>
                      <CommandGroup>
                        <CommandItem onMouseDown={() => { setSelectedGroup(''); setGroupOpen(false) }}>All Groups</CommandItem>
                        {classGroupsOptions.map((g: any) => (
                          <CommandItem key={g.id || g.pk || g.name} onMouseDown={() => {
                            const gid = g.id || g.pk || g.name
                            setSelectedGroup(gid)
                            // derive programme/department from group if available
                            const prog = g.programme?.id || g.programme?.pk || g.programme || g.programme_id
                            const dept = g.programme?.department || g.programme?.department_id || g.department || g.department_id
                            if (prog) setSelectedProgramme(prog)
                            if (dept) setSelectedDepartment(dept)
                            setGroupOpen(false)
                          }}>{g.name || g.title || String(g)}</CommandItem>
                        ))}
                        {classGroupsHasMore && (
                          <div className="px-3 py-2 text-center border-t"><button onMouseDown={(e) => { e.preventDefault(); setClassGroupsPage(p => p + 1) }} className="text-sm text-blue-600">Load more</button></div>
                        )}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col">
            <div className="relative">
              <button
                type="button"
                onClick={() => setRoomOpen(v => !v)}
                className="w-full text-left px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {selectedRoom ? (roomsOptions.find((r:any) => String(r.id || r.pk || r.name) === String(selectedRoom))?.name || selectedRoom) : 'All Rooms'}
              </button>
              {roomOpen && (
                <div className="absolute z-30 mt-1 w-full max-h-60 overflow-hidden border rounded bg-white shadow-sm">
                  <Command className="w-full">
                    <CommandInput
                      value={roomSearchTerm}
                      onValueChange={(v: string) => setRoomSearch(v)}
                      placeholder="Search rooms..."
                    />
                    <CommandList>
                      <CommandEmpty>No rooms</CommandEmpty>
                      <CommandGroup>
                        <CommandItem onMouseDown={() => { setSelectedRoom(''); setRoomOpen(false) }}>All Rooms</CommandItem>
                        {roomsOptions.map((r: any) => (
                          <CommandItem key={r.id || r.pk || r.name} onMouseDown={() => { setSelectedRoom(r.id || r.pk || r.name); setRoomOpen(false) }}>{r.name || r.title || String(r)}</CommandItem>
                        ))}
                        {roomsHasMore && (
                          <div className="px-3 py-2 text-center border-t"><button onMouseDown={(e) => { e.preventDefault(); setRoomsPage(p => p + 1) }} className="text-sm text-blue-600">Load more</button></div>
                        )}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </div>
              )}
            </div>
          </div>

          {(searchQuery || selectedRoom || selectedGroup || selectedDepartment) && (
            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Clear
            </button>
          )}
        </div>
      </div>

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

      {/* Schedule Grid */}
      <div className="overflow-auto border rounded-lg shadow-sm">
        <div ref={containerRef} className="grid" style={{ gridTemplateColumns: `80px repeat(${days.length}, minmax(150px, 1fr))` }}>
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-3 font-semibold text-gray-700 sticky left-0 z-20 border-r">
            <Clock className="w-4 h-4 inline mr-2" />
            Time
          </div>
          {days.map(d => (
            <div key={d} className="bg-gradient-to-br from-blue-50 to-indigo-50 p-3 text-center font-semibold text-gray-700">
              <Calendar className="w-4 h-4 inline mr-2" />
              {d.charAt(0).toUpperCase() + d.slice(1)}
            </div>
          ))}

          <div className="flex flex-col sticky left-0 z-10 bg-white border-r">
            {slots.map(slot => (
              <div key={`label-${slot.index}`} className="p-3 text-xs text-gray-500 font-medium border-b" style={{ height: slotHeights[slot.index] }}>
                {slot.label}
              </div>
            ))}
          </div>

          {days.map((day, dayIdx) => {
            const daySchedules = filteredSchedules.filter(s => s.day_of_week === day).map(s => ({ s, start: timeStrToMinutes(s.start_time), end: timeStrToMinutes(s.end_time) })).sort((a, b) => a.start - b.start)

            const columns: number[] = []
            const placement = new Map<number, { col: number, totalCols: number }>()

            for (const item of daySchedules) {
              let placed = false
              for (let ci = 0; ci < columns.length; ci++) {
                if (item.start >= columns[ci]) {
                  placement.set(Number(item.s.id), { col: ci, totalCols: 0 })
                  columns[ci] = item.end
                  placed = true
                  break
                }
              }
              if (!placed) {
                columns.push(item.end)
                placement.set(Number(item.s.id), { col: columns.length - 1, totalCols: 0 })
              }
            }

            const totalCols = columns.length || 1
            for (const key of placement.keys()) placement.set(key, { col: placement.get(key)!.col, totalCols })
            // account for vertical stacking extra height so events don't get clipped
            const visibleCols = Math.min(totalCols, MAX_DISPLAY_COLUMNS)
            const dayExtraHeight = Math.max(0, (visibleCols - 1) * STACK_OFFSET_PX)
            const dayHeight = Math.max(48, totalHeight + dayExtraHeight)

            return (
              <div key={`day-${day}`} className="p-3 border-l border-t relative bg-white" style={{ minHeight: Math.max(48, dayHeight), height: dayHeight }}>
                {slotTopOffsets.map((topOff, si) => (
                  <div key={`sep-${si}`} style={{ position: 'absolute', left: 0, right: 0, top: topOff, height: 0, borderTop: '1px solid rgba(0,0,0,0.04)' }} aria-hidden />
                ))}
                {daySchedules.map(({ s, start, end }) => {
                  const startTotal = start
                  const duration = Math.max(1, end - startTotal)
                  // compute absolute top/height in pixels so schedule blocks match time slots exactly
                  let top = (startTotal - startHour * 60) * pixelsPerMinute
                  let height = Math.max(1, duration * pixelsPerMinute)
                  // clamp into grid bounds (account for extra stacking height)
                  top = clamp(top, 0, Math.max(0, dayHeight))
                  height = Math.max(1, Math.min(height, Math.max(0, dayHeight - top)))
                  const isDragging = draggingId === Number(s.id)
                  const isHovered = hoveredSchedule === Number(s.id)
                  const layout = placement.get(Number(s.id)) || { col: 0, totalCols: 1 }
                  const hasConflict = conflictIds && conflictIds.has(Number(s.id))
                  // VERTICAL STACKING MODE:
                  // Instead of carving horizontal columns, keep time-aligned top positions and apply
                  // a small vertical offset per overlapping lane so items don't fully obscure each other.
                  // We still limit the number of visual lanes for display purposes.
                  const laneIndex = layout.col % MAX_DISPLAY_COLUMNS
                  const verticalOffset = laneIndex * STACK_OFFSET_PX
                  // compute column display (we render full-width with small inset padding)
                  const leftInset = 8
                  const rightInset = 8
                  const topWithRow = top + verticalOffset

                  return (
                    <motion.div
                      key={s.id}
                      role="button"
                      tabIndex={0}
                      aria-label={`${s.class_group_name || ('Class ' + s.class_group)} ${s.start_time} to ${s.end_time}`}
                      className={`rounded-lg p-3 text-sm select-none absolute transition-all cursor-move  ${
                        hasConflict 
                          ? 'bg-red-100 border-2 border-red-500 shadow-lg' 
                          : isHovered 
                          ? 'bg-blue-100 border-2 border-blue-400 shadow-xl scale-105' 
                          : 'bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 shadow-md hover:shadow-lg'
                      }`}
                      style={{ top: topWithRow, height, zIndex: isDragging ? 30 : isHovered ? 20 : 10, left: `${leftInset}px`, width: `calc(100% - ${leftInset + rightInset}px)` }}
                      drag="y"
                      onMouseEnter={() => setHoveredSchedule(Number(s.id))}
                      onMouseLeave={() => setHoveredSchedule(null)}
                      whileHover={{ scale: isDragging ? 1 : 1.02 }}
                      onKeyDown={(e) => {
                        if (e.key === 'ArrowUp') { e.preventDefault(); nudgeSchedule(s, -slotMinutes, 0) }
                        else if (e.key === 'ArrowDown') { e.preventDefault(); nudgeSchedule(s, slotMinutes, 0) }
                        else if (e.key === 'ArrowLeft') { e.preventDefault(); nudgeSchedule(s, 0, -1) }
                        else if (e.key === 'ArrowRight') { e.preventDefault(); nudgeSchedule(s, 0, 1) }
                      }}
                      dragElastic={0}
                      onDragStart={() => { setDraggingId(Number(s.id)); setPreview(null) }}
                      onDrag={(e, info) => {
                        try {
                          const offsetY = info.offset.y
                          const offsetX = info.offset.x
                          const deltaMinutes = Math.round(offsetY / pixelsPerMinute)
                          const deltaDays = Math.round(offsetX / columnWidth)
                          const origTotalMins = startTotal
                          const durationMins = duration
                          const newTotalMins = origTotalMins + deltaMinutes
                          let newDayIdx = dayIdx + deltaDays
                          newDayIdx = clamp(newDayIdx, 0, days.length - 1)
                          const snappedStart = Math.round(newTotalMins / slotMinutes) * slotMinutes
                          setPreview({ dayIdx: newDayIdx, startMin: snappedStart, durationMins })

                          const newStart = snappedStart
                          const newEnd = newStart + durationMins
                          const conflictSet = new Set<number>()
                          for (const other of schedules) {
                            if (Number(other.id) === Number(s.id)) continue
                            if (other.day_of_week !== days[newDayIdx]) continue
                            const oStart = timeStrToMinutes(other.start_time)
                            const oEnd = timeStrToMinutes(other.end_time)
                            if (oStart < newEnd && oEnd > newStart) {
                              conflictSet.add(Number(other.id))
                            }
                          }
                          setConflictIds(conflictSet)
                        } catch {}
                      }}
                      onDragEnd={(e, info) => {
                        try {
                          const offsetY = info.offset.y
                          const offsetX = info.offset.x
                          const minutesDelta = Math.round(offsetY / pixelsPerMinute)
                          let newTotalMins = startTotal + minutesDelta
                          newTotalMins = Math.round(newTotalMins / slotMinutes) * slotMinutes
                          let newHour = Math.floor(newTotalMins / 60)
                          let newMin = newTotalMins % 60
                          let newDayIdx = dayIdx + Math.round(offsetX / columnWidth)
                          newDayIdx = clamp(newDayIdx, 0, days.length - 1)
                          newHour = clamp(newHour, startHour, endHour - Math.ceil(duration / 60))
                          if (newHour + Math.ceil(duration / 60) > endHour) { newHour = endHour - Math.ceil(duration / 60); newMin = 0 }
                          const newStart = formatTime(newHour, newMin)
                          const newEndTotal = newHour * 60 + newMin + duration
                          const newEnd = formatTime(Math.floor(newEndTotal / 60), newEndTotal % 60)
                          const updated: ClassGroupSchedule = { ...s, day_of_week: days[newDayIdx], start_time: newStart, end_time: newEnd }
                          if (updated.start_time !== s.start_time || updated.day_of_week !== s.day_of_week) {
                            saveSchedule(updated)
                          }
                        } catch (err) {
                          console.error('drag end error', err)
                        } finally {
                          setDraggingId(null)
                          setPreview(null)
                          setConflictIds(new Set())
                        }
                      }}
                    >
                      <div className="flex items-center justify-between ">
                        <div className="font-medium">{s.class_group_name || ('Class ' + s.class_group)}</div>
                        {s.is_locked && <div className="text-xs px-2 py-0.5 rounded bg-yellow-100 text-yellow-800">Locked</div>}
                      </div>
                      <div className="text-xs text-gray-600">{s.start_time} - {s.end_time} • {s.room_name || ''}</div>
                      {!s.is_locked && (
                        <motion.div
                          drag="y"
                          dragElastic={0}
                          onDragEnd={(e, info) => {
                            try {
                              const deltaMins = Math.round(info.offset.y / pixelsPerMinute)
                              let newDuration = clamp(duration + deltaMins, slotMinutes, totalMinutes)
                              newDuration = Math.round(newDuration / slotMinutes) * slotMinutes
                              const newEndTotal = startTotal + newDuration
                              const newEnd = formatTime(Math.floor(newEndTotal / 60), newEndTotal % 60)
                              const updated = { ...s, end_time: newEnd }
                              saveSchedule(updated as ClassGroupSchedule)
                            } catch (err) {
                              console.error('resize save failed', err)
                            }
                          }}
                          className="h-2 mt-2 bg-blue-200 rounded-b cursor-ns-resize"
                        />
                      )}
                    </motion.div>
                  )
                })}

                {preview && preview.dayIdx === dayIdx && (() => {
                  const pTop = (preview.startMin - startHour * 60) * pixelsPerMinute
                  const pHeight = Math.max(1, preview.durationMins * pixelsPerMinute)
                  return (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.12 }}
                      style={{ position: 'absolute', left: 8, top: pTop, width: 'calc(100% - 12px)', height: pHeight, pointerEvents: 'none', zIndex: 25 }}
                      className="bg-primary/20 border border-primary/40 rounded h-full shadow-sm "
                    />
                  )
                })()}
              </div>
            )
          })}

        </div>
      </div>

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
              <button className="px-3 py-1 bg-gray-200 text-gray-800 rounded text-sm" onClick={() => { setPendingSave(null) }}>Dismiss</button>
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