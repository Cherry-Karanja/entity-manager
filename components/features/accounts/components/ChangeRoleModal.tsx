'use client'

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { User } from '../types'

interface ChangeRoleModalProps {
  item: unknown
  onClose: () => void
}

export const ChangeRoleModal: React.FC<ChangeRoleModalProps> = ({ item, onClose }) => {
  const user = item as User
  const [selectedRole, setSelectedRole] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Available roles - in a real app, this would come from an API
  const availableRoles = [
    { id: 'admin', name: 'Administrator', display_name: 'Administrator' },
    { id: 'manager', name: 'Manager', display_name: 'Manager' },
    { id: 'user', name: 'User', display_name: 'User' },
    { id: 'moderator', name: 'Moderator', display_name: 'Moderator' },
  ]

  // Initialize with current role
  useEffect(() => {
    if (user.role) {
      const currentRoleId = typeof user.role === 'string' ? user.role :
                           (user.role as { id: string })?.id || ''
      setSelectedRole(currentRoleId)
    }
  }, [user])

  const handleSubmit = async () => {
    if (!selectedRole) return

    setIsSubmitting(true)
    try {
      // In a real app, this would call an API
      console.log('Changing role for user:', user.id, 'to role:', selectedRole)

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      alert(`Role changed successfully for ${user.full_name || user.email}`)
      onClose()
    } catch (error) {
      console.error('Error changing role:', error)
      alert('Failed to change role. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const currentRoleName = availableRoles.find(role => role.id === selectedRole)?.display_name || 'None'

  return (
    <div className="p-6 space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Change User Role</h3>
        <p className="text-sm text-gray-600">
          Change the role for <strong>{user.full_name || user.email}</strong>
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="role-select">Select New Role</Label>
          <Select value={selectedRole} onValueChange={setSelectedRole}>
            <SelectTrigger className="w-full mt-1">
              <SelectValue placeholder="Choose a role" />
            </SelectTrigger>
            <SelectContent>
              {availableRoles.map((role) => (
                <SelectItem key={role.id} value={role.id}>
                  {role.display_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="p-3 bg-gray-50 rounded-md">
          <div className="text-sm">
            <span className="font-medium">Current Role:</span>{' '}
            {currentRoleName}
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button
          variant="outline"
          onClick={onClose}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={!selectedRole || isSubmitting}
        >
          {isSubmitting ? 'Changing...' : 'Change Role'}
        </Button>
      </div>
    </div>
  )
}