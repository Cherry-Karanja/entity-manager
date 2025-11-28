"use client"
import React from 'react'
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from '@/components/ui/command'
import { Department, Programme, ClassGroup } from '@/components/features/institution/types'
import { Room } from '../../types'

interface Props {
  departments?: Department[]
  programmes?: Programme[]
  classGroups?: ClassGroup[]
  rooms?: Room[]
  selectedDepartment?: string|undefined
  selectedProgramme?: string|undefined
  selectedGroup?: string
  selectedRoom?: string
  // setter callbacks
  setSelectedDepartment?: (s?: string) => void
  setSelectedProgramme?: (s?: string) => void
  setSelectedGroup?: (s: string) => void
  setSelectedRoom?: (s: string) => void
}

export default function ScheduleFilters({ departments = [], programmes = [], classGroups = [], rooms = [], selectedDepartment, selectedProgramme, selectedGroup, selectedRoom, setSelectedDepartment, setSelectedProgramme, setSelectedGroup, setSelectedRoom }: Props) {
  const renderLabel = (item: any | string | number | undefined | null) => {
    if (item === undefined || item === null) return ''
    if (typeof item === 'string' || typeof item === 'number') return String(item)
    // item is EntityItem
    return item.name || item.title || item.label || item.class_group_name || item.display || String(item.id ?? item.pk ?? '') || JSON.stringify(item).slice(0, 120)
  }
  const findLabel = (list: any[], value?: string | null) => {
    if (!value) return undefined
    const it = list.find(i => String(i.id ?? i.pk ?? i.name ?? i.class_group_name) === String(value))
    return it ? renderLabel(it) : undefined
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      <div>
        <div className="flex items-center justify-between mb-1">
          <div className="text-xs text-gray-600">Department</div>
          {selectedDepartment && <div className="text-xs text-blue-700">Selected: {findLabel(departments, selectedDepartment) ?? selectedDepartment}</div>}
        </div>
        <div className="border rounded p-2 bg-white">
          <Command>
            <CommandInput placeholder="Filter departments..." />
            <CommandList>
              <CommandEmpty>No departments</CommandEmpty>
              <div className="max-h-48 overflow-y-auto">
                <CommandGroup>
                  {departments.map(d => (
                    <CommandItem key={String(d.id ?? d.pk ?? d.name ?? renderLabel(d))} onMouseDown={() => setSelectedDepartment && setSelectedDepartment(String(d.id ?? d.pk ?? d.name ?? renderLabel(d)))}>
                      {renderLabel(d)}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </div>
            </CommandList>
          </Command>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-1">
          <div className="text-xs text-gray-600">Programme</div>
          {selectedProgramme && <div className="text-xs text-green-700">Selected: {findLabel(programmes, selectedProgramme) ?? selectedProgramme}</div>}
        </div>
        <div className="border rounded p-2 bg-white">
          <Command>
            <CommandInput placeholder="Filter programmes..." />
            <CommandList>
              <CommandEmpty>No programmes</CommandEmpty>
              <div className="max-h-48 overflow-y-auto">
                <CommandGroup>
                  {programmes.map(p => (
                    <CommandItem key={String(p.id ?? p.pk ?? p.name ?? renderLabel(p))} onMouseDown={() => setSelectedProgramme && setSelectedProgramme(String(p.id ?? p.pk ?? p.name ?? renderLabel(p)))}>
                      {renderLabel(p)}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </div>
            </CommandList>
          </Command>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-1">
          <div className="text-xs text-gray-600">Group</div>
          {selectedGroup && <div className="text-xs text-indigo-700">Selected: {findLabel(classGroups, selectedGroup) ?? selectedGroup}</div>}
        </div>
        <div className="border rounded p-2 bg-white">
          <Command>
            <CommandInput placeholder="Filter groups..." />
            <CommandList>
              <CommandEmpty>No groups</CommandEmpty>
              <div className="max-h-48 overflow-y-auto">
                <CommandGroup>
                  {classGroups.map(g => (
                    <CommandItem key={String(g.id ?? g.pk ?? g.name ?? renderLabel(g))} onMouseDown={() => setSelectedGroup && setSelectedGroup(String(g.id ?? g.pk ?? g.name ?? renderLabel(g)))}>
                      {renderLabel(g)}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </div>
            </CommandList>
          </Command>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-1">
          <div className="text-xs text-gray-600">Room</div>
          {selectedRoom && <div className="text-xs text-yellow-700">Selected: {findLabel(rooms, selectedRoom) ?? selectedRoom}</div>}
        </div>
        <div className="border rounded p-2 bg-white">
          <Command>
            <CommandInput placeholder="Filter rooms..." />
            <CommandList>
              <CommandEmpty>No rooms</CommandEmpty>
              <div className="max-h-48 overflow-y-auto">
                <CommandGroup>
                  {rooms.map(r => (
                    <CommandItem key={String(r.id ?? r.pk ?? r.name ?? renderLabel(r))} onMouseDown={() => setSelectedRoom && setSelectedRoom(String(r.id ?? r.pk ?? r.name ?? renderLabel(r)))}>
                      {renderLabel(r)}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </div>
            </CommandList>
          </Command>
        </div>
      </div>
    </div>
  )
}
