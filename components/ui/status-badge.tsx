import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

export type Status = "draft" | "pending" | "approved" | "rejected" | "in-progress" | "completed"
export type Priority = "low" | "medium" | "high"

interface StatusBadgeProps {
  status: Status
  className?: string
}

interface PriorityBadgeProps {
  priority: Priority
  className?: string
}

const statusConfig = {
  draft: {
    label: "Draft",
    className: "bg-status-draft text-status-draft-foreground",
  },
  pending: {
    label: "Pending",
    className: "bg-status-pending text-status-pending-foreground",
  },
  "in-progress": {
    label: "In Progress",
    className: "bg-status-in-progress text-status-in-progress-foreground",
  },
  approved: {
    label: "Approved",
    className: "bg-status-approved text-status-approved-foreground",
  },
  completed: {
    label: "Completed",
    className: "bg-status-completed text-status-completed-foreground",
  },
  rejected: {
    label: "Rejected",
    className: "bg-status-rejected text-status-rejected-foreground",
  },
}

const priorityConfig = {
  low: {
    label: "low",
    className: "bg-priority-low text-priority-low-foreground",
  },
  medium: {
    label: "medium",
    className: "bg-priority-medium text-priority-medium-foreground",
  },
  high: {
    label: "high",
    className: "bg-priority-high text-priority-high-foreground",
  },
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status]

  return <Badge className={cn(config.className, className)}>{config.label}</Badge>
}

export function PriorityBadge({ priority, className }: PriorityBadgeProps) {
  const config = priorityConfig[priority]

  return <Badge className={cn(config.className, "text-xs font-medium", className)}>{config.label}</Badge>
}
