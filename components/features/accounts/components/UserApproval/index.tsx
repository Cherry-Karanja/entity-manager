'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
  UserProfile
} from '../../types'
import {
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  MessageSquare,
  UserCheck,
  Eye,
  FileText,
  Calendar
} from "lucide-react"

interface UserApprovalWorkflowProps {
  pendingUsers: Array<User & { profile?: UserProfile }>
  onApproveUser: (userId: string, comments?: string) => Promise<void>
  onRejectUser: (userId: string, reason: string, comments?: string) => Promise<void>
  onRequestMoreInfo: (userId: string, requirements: string[]) => Promise<void>
  currentUser: User | null
  canApprove: boolean
}

type ApprovalAction = 'approve' | 'reject' | 'request_info'

interface ApprovalDialogState {
  isOpen: boolean
  user: (User & { profile?: UserProfile }) | null
  action: ApprovalAction | null
}

export function UserApprovalWorkflow({
  pendingUsers,
  onApproveUser,
  onRejectUser,
  onRequestMoreInfo,
  currentUser,
  canApprove
}: UserApprovalWorkflowProps) {
  const [approvalDialog, setApprovalDialog] = useState<ApprovalDialogState>({
    isOpen: false,
    user: null,
    action: null
  })
  const [comments, setComments] = useState('')
  const [rejectionReason, setRejectionReason] = useState('')
  const [requestedInfo, setRequestedInfo] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleApprovalAction = async () => {
    if (!approvalDialog.user || !approvalDialog.action) return

    setIsSubmitting(true)
    try {
      switch (approvalDialog.action) {
        case 'approve':
          await onApproveUser(approvalDialog.user.id, comments)
          break
        case 'reject':
          await onRejectUser(approvalDialog.user.id, rejectionReason, comments)
          break
        case 'request_info':
          await onRequestMoreInfo(approvalDialog.user.id, requestedInfo)
          break
      }

      // Reset dialog state
      setApprovalDialog({ isOpen: false, user: null, action: null })
      setComments('')
      setRejectionReason('')
      setRequestedInfo([])
    } catch (error) {
      console.error('Approval action failed:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const openApprovalDialog = (user: User & { profile?: UserProfile }, action: ApprovalAction) => {
    setApprovalDialog({ isOpen: true, user, action })
    setComments('')
    setRejectionReason('')
    setRequestedInfo([])
  }

  const getStatusBadge = (user: User & { profile?: UserProfile }) => {
    const profile = user.profile
    if (!profile) {
      return <Badge variant="outline">No Profile</Badge>
    }

    switch (profile.approval_status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
      case 'more_info_required':
        return <Badge className="bg-blue-100 text-blue-800">More Info Needed</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-600" />
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />
      case 'more_info_required':
        return <AlertTriangle className="h-4 w-4 text-blue-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  const getCompletionPercentage = (profile?: UserProfile) => {
    if (!profile) return 0

    const fields = [
      profile.bio,
      profile.phone,
      profile.date_of_birth,
      profile.department,
      profile.employee_id,
      profile.manager_name,
      profile.start_date
    ]

    const completedFields = fields.filter(field => field && String(field).trim() !== '').length
    return Math.round((completedFields / fields.length) * 100)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">User Approval Workflow</h2>
          <p className="text-muted-foreground">
            Review and approve new user registrations
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline">
            {pendingUsers.length} pending
          </Badge>
        </div>
      </div>

      {/* Pending Users List */}
      <div className="grid gap-4">
        {pendingUsers.map((user) => {
          const profile = user.profile
          const completionPercentage = getCompletionPercentage(profile)

          return (
            <Card key={user.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
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
                      <div className="flex items-center gap-2 mt-1">
                        {getStatusBadge(user)}
                        <Badge variant="outline" className="text-xs">
                          {completionPercentage}% complete
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {canApprove && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openApprovalDialog(user, 'request_info')}
                        >
                          <MessageSquare className="h-4 w-4 mr-1" />
                          Request Info
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openApprovalDialog(user, 'reject')}
                          className="text-red-600 hover:text-red-700"
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => openApprovalDialog(user, 'approve')}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                      </>
                    )}
                    <Button size="sm" variant="ghost">
                      <Eye className="h-4 w-4 mr-1" />
                      View Details
                    </Button>
                  </div>
                </div>
              </CardHeader>

              {profile && (
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label className="text-xs text-muted-foreground">DEPARTMENT</Label>
                      <p className="text-sm font-medium">
                        {profile.department as string || 'Not specified'}
                      </p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">EMPLOYEE ID</Label>
                      <p className="text-sm font-medium">
                        {profile.employee_id as string || 'Not specified'}
                      </p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">START DATE</Label>
                      <p className="text-sm font-medium">
                        {profile.start_date ? new Date(profile.start_date as string).toLocaleDateString() : 'Not specified'}
                      </p>
                    </div>
                  </div>

                  {(() => {
                    const notes = profile.approval_notes
                    return notes && String(notes).trim() !== '' ? (
                      <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                        <Label className="text-xs text-muted-foreground">APPROVAL NOTES</Label>
                        <p className="text-sm mt-1">{String(notes)}</p>
                      </div>
                    ) : null
                  })()}
                </CardContent>
              )}
            </Card>
          )
        })}
      </div>

      {pendingUsers.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <CheckCircle className="h-12 w-12 text-green-600 mb-4" />
            <h3 className="text-lg font-medium mb-2">All Caught Up!</h3>
            <p className="text-muted-foreground text-center">
              There are no pending user approvals at this time.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Approval Action Dialog */}
      <Dialog
        open={approvalDialog.isOpen}
        onOpenChange={(open) => !open && setApprovalDialog({ isOpen: false, user: null, action: null })}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {approvalDialog.action === 'approve' && <CheckCircle className="h-5 w-5 text-green-600" />}
              {approvalDialog.action === 'reject' && <XCircle className="h-5 w-5 text-red-600" />}
              {approvalDialog.action === 'request_info' && <MessageSquare className="h-5 w-5 text-blue-600" />}
              {approvalDialog.action === 'approve' && 'Approve User'}
              {approvalDialog.action === 'reject' && 'Reject User'}
              {approvalDialog.action === 'request_info' && 'Request More Information'}
            </DialogTitle>
            <DialogDescription>
              {approvalDialog.user && (
                <>Confirm action for {approvalDialog.user.first_name} {approvalDialog.user.last_name}</>
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {approvalDialog.action === 'reject' && (
              <div>
                <Label htmlFor="rejection-reason">Rejection Reason</Label>
                <Select value={rejectionReason} onValueChange={setRejectionReason}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a reason" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="incomplete_profile">Incomplete Profile Information</SelectItem>
                    <SelectItem value="invalid_credentials">Invalid Credentials</SelectItem>
                    <SelectItem value="unauthorized_access">Unauthorized Access Request</SelectItem>
                    <SelectItem value="policy_violation">Policy Violation</SelectItem>
                    <SelectItem value="duplicate_account">Duplicate Account</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {approvalDialog.action === 'request_info' && (
              <div>
                <Label>Information Required</Label>
                <div className="space-y-2 mt-2">
                  {[
                    'Complete employee ID',
                    'Valid phone number',
                    'Department information',
                    'Manager approval',
                    'Additional documentation'
                  ].map((info) => (
                    <div key={info} className="flex items-center space-x-2">
                      <input
                        title='select'
                        type="checkbox"
                        id={info}
                        checked={requestedInfo.includes(info)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setRequestedInfo(prev => [...prev, info])
                          } else {
                            setRequestedInfo(prev => prev.filter(item => item !== info))
                          }
                        }}
                        className="rounded"
                      />
                      <Label htmlFor={info} className="text-sm">{info}</Label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <Label htmlFor="comments">
                {approvalDialog.action === 'approve' && 'Approval Comments'}
                {approvalDialog.action === 'reject' && 'Rejection Comments'}
                {approvalDialog.action === 'request_info' && 'Additional Notes'}
              </Label>
              <Textarea
                id="comments"
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder={
                  approvalDialog.action === 'approve' ? 'Add approval notes...' :
                  approvalDialog.action === 'reject' ? 'Explain the rejection...' :
                  'Add any additional notes...'
                }
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setApprovalDialog({ isOpen: false, user: null, action: null })}
            >
              Cancel
            </Button>
            <Button
              onClick={handleApprovalAction}
              disabled={isSubmitting || (approvalDialog.action === 'reject' && !rejectionReason)}
              className={
                approvalDialog.action === 'reject' ? 'bg-red-600 hover:bg-red-700' : ''
              }
            >
              {isSubmitting ? 'Processing...' :
               approvalDialog.action === 'approve' ? 'Approve User' :
               approvalDialog.action === 'reject' ? 'Reject User' :
               'Send Request'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}