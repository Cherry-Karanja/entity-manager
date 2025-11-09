'use client'

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  User,
  UserRole,
  UserRoleHistory
} from '../../types'
import {
  Shield,
  UserCheck,
  AlertTriangle,
  Clock,
  CheckCircle,
  XCircle,
  MessageSquare
} from "lucide-react"

interface RoleChangeDialogProps {
  isOpen: boolean
  onClose: () => void
  user: User | null
  currentRoles: UserRole[]
  availableRoles: UserRole[]
  onRoleChange: (userId: string, roleIds: string[], reason: string) => Promise<void>
  onRoleChangeApprove?: (changeId: string, approved: boolean, comments?: string) => Promise<void>
  pendingChanges?: UserRoleHistory[]
  currentUser: User | null
  requiresApproval?: boolean
}

type ChangeType = 'assign' | 'remove' | 'replace'

interface RoleChange {
  type: ChangeType
  roleId: string
  roleName: string
}

export function RoleChangeDialog({
  isOpen,
  onClose,
  user,
  currentRoles,
  availableRoles,
  onRoleChange,
  onRoleChangeApprove,
  pendingChanges = [],
  currentUser,
  requiresApproval = false
}: RoleChangeDialogProps) {
  const [selectedRoles, setSelectedRoles] = useState<string[]>([])
  const [changeReason, setChangeReason] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [pendingChange, setPendingChange] = useState<UserRoleHistory | null>(null)
  const [approvalComments, setApprovalComments] = useState('')

  // Initialize selected roles when dialog opens
  useEffect(() => {
    if (isOpen && user) {
      setSelectedRoles(currentRoles.map(role => role.id))
      setChangeReason('')
    }
  }, [isOpen, user, currentRoles])

  const handleRoleToggle = (roleId: string, checked: boolean) => {
    if (checked) {
      setSelectedRoles(prev => [...prev, roleId])
    } else {
      setSelectedRoles(prev => prev.filter(id => id !== roleId))
    }
  }

  const getRoleChanges = (): RoleChange[] => {
    const currentRoleIds = new Set(currentRoles.map(r => r.id))
    const selectedRoleIds = new Set(selectedRoles)

    const changes: RoleChange[] = []

    // Find roles to assign
    selectedRoles.forEach(roleId => {
      if (!currentRoleIds.has(roleId)) {
        const role = availableRoles.find(r => r.id === roleId)
        if (role) {
          changes.push({
            type: 'assign',
            roleId,
            roleName: role.name
          })
        }
      }
    })

    // Find roles to remove
    currentRoles.forEach(role => {
      if (!selectedRoleIds.has(role.id)) {
        changes.push({
          type: 'remove',
          roleId: role.id,
          roleName: role.name
        })
      }
    })

    return changes
  }

  const handleSubmit = async () => {
    if (!user || selectedRoles.length === 0) return

    setIsSubmitting(true)
    try {
      await onRoleChange(user.id, selectedRoles, changeReason)
      onClose()
    } catch (error) {
      console.error('Failed to change roles:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleApproval = async (approved: boolean) => {
    if (!pendingChange || !onRoleChangeApprove) return

    try {
      await onRoleChangeApprove(pendingChange.id, approved, approvalComments)
      setPendingChange(null)
      setApprovalComments('')
    } catch (error) {
      console.error('Failed to process approval:', error)
    }
  }

  const changes = getRoleChanges()
  const hasChanges = changes.length > 0

  if (!user) return null

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Change User Roles
            </DialogTitle>
            <DialogDescription>
              Modify roles for {user.first_name} {user.last_name}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* User Info */}
            <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
              <Avatar className="h-12 w-12">
                <AvatarImage src={user.avatar as string} />
                <AvatarFallback>
                  {user.first_name[0]}{user.last_name[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-medium">
                  {user.first_name} {user.last_name}
                </h3>
                <p className="text-sm text-muted-foreground">{user.email}</p>
                <div className="flex gap-1 mt-1">
                  {currentRoles.map(role => (
                    <Badge key={role.id} variant="secondary" className="text-xs">
                      {role.name}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Role Selection */}
            <div>
              <Label className="text-base font-medium">Select Roles</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                {availableRoles.map((role) => {
                  const isSelected = selectedRoles.includes(role.id)
                  const isCurrent = currentRoles.some(r => r.id === role.id)

                  return (
                    <div
                      key={role.id}
                      className={`flex items-center space-x-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                        isSelected ? 'border-primary bg-primary/5' : 'border-border hover:bg-muted/50'
                      }`}
                      onClick={() => handleRoleToggle(role.id, !isSelected)}
                    >
                      <Checkbox
                        checked={isSelected}
                        onChange={() => {}} // Handled by parent div
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{role.name}</span>
                          {isCurrent && (
                            <Badge variant="outline" className="text-xs">
                              Current
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {role.description || 'No description'}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Change Summary */}
            {hasChanges && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Role Changes Summary</h4>
                <div className="space-y-1">
                  {changes.map((change, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      {change.type === 'assign' && <UserCheck className="h-4 w-4 text-green-600" />}
                      {change.type === 'remove' && <XCircle className="h-4 w-4 text-red-600" />}
                      {change.type === 'replace' && <AlertTriangle className="h-4 w-4 text-orange-600" />}
                      <span>
                        {change.type === 'assign' && 'Assign'}
                        {change.type === 'remove' && 'Remove'}
                        {change.type === 'replace' && 'Replace'}
                        {' '}
                        <strong>{change.roleName}</strong>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Change Reason */}
            <div>
              <Label htmlFor="reason">Change Reason</Label>
              <Textarea
                id="reason"
                value={changeReason}
                onChange={(e) => setChangeReason(e.target.value)}
                placeholder="Explain why these role changes are being made..."
                className="mt-1"
                rows={3}
              />
            </div>

            {/* Approval Notice */}
            {requiresApproval && hasChanges && (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center gap-2 text-yellow-800">
                  <Clock className="h-4 w-4" />
                  <span className="font-medium">Approval Required</span>
                </div>
                <p className="text-sm text-yellow-700 mt-1">
                  These role changes require approval from a supervisor before taking effect.
                </p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={() => setShowConfirmDialog(true)}
              disabled={!hasChanges || isSubmitting}
            >
              {isSubmitting ? 'Processing...' : requiresApproval ? 'Request Changes' : 'Apply Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Role Changes</AlertDialogTitle>
            <AlertDialogDescription>
              {requiresApproval
                ? 'This will submit a role change request for approval. The changes will not take effect until approved.'
                : 'This will immediately apply the role changes to the user.'
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleSubmit}>
              {requiresApproval ? 'Submit Request' : 'Confirm Changes'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Approval Dialog */}
      {pendingChange && onRoleChangeApprove && (
        <Dialog open={!!pendingChange} onOpenChange={() => setPendingChange(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Review Role Change Request</DialogTitle>
              <DialogDescription>
                Review and approve or reject the role change request.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="p-4 bg-muted/50 rounded-lg">
                <h4 className="font-medium mb-2">Change Details</h4>
                <p className="text-sm text-muted-foreground">
                  {String(pendingChange.details || 'No details provided')}
                </p>
              </div>

              <div>
                <Label htmlFor="comments">Approval Comments</Label>
                <Textarea
                  id="comments"
                  value={approvalComments}
                  onChange={(e) => setApprovalComments(e.target.value)}
                  placeholder="Add comments about your decision..."
                  rows={3}
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => handleApproval(false)}
                className="text-red-600 hover:text-red-700"
              >
                <XCircle className="h-4 w-4 mr-2" />
                Reject
              </Button>
              <Button onClick={() => handleApproval(true)}>
                <CheckCircle className="h-4 w-4 mr-2" />
                Approve
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}