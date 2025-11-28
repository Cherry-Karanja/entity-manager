"use client"
import { useEffect, useRef, useState } from 'react'
import { classGroupScheduleApi } from '../../class-group-schedules/api/client'

export default function useSchedules(timetableId: string) {
  const [schedules, setSchedules] = useState<any[]>([])
  const reqRef = useRef(0)

  useEffect(() => {
    let mounted = true
    const reqId = reqRef.current + 1
    reqRef.current = reqId
    ;(async () => {
      try {
        const res = await classGroupScheduleApi.list({ timetable: timetableId, pageSize: 1000 })
        if (!mounted) return
        if (reqRef.current !== reqId) return
        const items = (res as any).results || (res as any).data || res || []
        setSchedules(items)
      } catch (err) { console.warn('useSchedules fetch failed', err) }
    })()
    return () => { mounted = false }
  }, [timetableId])

  return { schedules, setSchedules }
}
