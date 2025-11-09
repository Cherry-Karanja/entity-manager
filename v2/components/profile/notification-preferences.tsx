"use client"

import { useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Bell, Mail, MessageSquare, Shield } from "lucide-react"
import { toast } from "sonner"

interface NotificationPreference {
  id: string
  label: string
  description: string
  enabled: boolean
}

interface NotificationPreferencesProps {
  onUpdate?: (preferences: Record<string, boolean>) => Promise<void>
}

export function NotificationPreferences({ onUpdate }: NotificationPreferencesProps) {
  
  const [emailNotifications, setEmailNotifications] = useState<NotificationPreference[]>([
    {
      id: "email_updates",
      label: "Product Updates",
      description: "Receive emails about new features and updates.",
      enabled: true,
    },
    {
      id: "email_security",
      label: "Security Alerts",
      description: "Get notified about security events on your account.",
      enabled: true,
    },
    {
      id: "email_marketing",
      label: "Marketing Communications",
      description: "Receive promotional emails and newsletters.",
      enabled: false,
    },
  ])

  const [pushNotifications, setPushNotifications] = useState<NotificationPreference[]>([
    {
      id: "push_messages",
      label: "Direct Messages",
      description: "Get notified when someone sends you a message.",
      enabled: true,
    },
    {
      id: "push_mentions",
      label: "Mentions",
      description: "Receive notifications when someone mentions you.",
      enabled: true,
    },
    {
      id: "push_updates",
      label: "System Updates",
      description: "Stay informed about system maintenance and updates.",
      enabled: false,
    },
  ])

  const handleToggle = async (
    type: "email" | "push",
    id: string,
    enabled: boolean
  ) => {
    const setter = type === "email" ? setEmailNotifications : setPushNotifications
    const notifications = type === "email" ? emailNotifications : pushNotifications

    setter(
      notifications.map((notif) =>
        notif.id === id ? { ...notif, enabled } : notif
      )
    )

    try {
      if (onUpdate) {
        const allPreferences = {
          ...Object.fromEntries(emailNotifications.map((n) => [n.id, n.enabled])),
          ...Object.fromEntries(pushNotifications.map((n) => [n.id, n.enabled])),
          [id]: enabled,
        }
        await onUpdate(allPreferences)
      }
      toast.message("Preferences updated",
        {description: "Your notification preferences have been saved."}
      )
    } catch {
      toast.error( "Error",
        {
        description: "Failed to update preferences. Please try again.",
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          <CardTitle>Notification Preferences</CardTitle>
        </div>
        <CardDescription>
          Manage how you receive notifications and updates.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Email Notifications */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-sm font-semibold">Email Notifications</h3>
          </div>
          <div className="space-y-4">
            {emailNotifications.map((notification) => (
              <div
                key={notification.id}
                className="flex items-center justify-between space-x-2"
              >
                <div className="flex-1 space-y-1">
                  <Label htmlFor={notification.id} className="cursor-pointer">
                    {notification.label}
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    {notification.description}
                  </p>
                </div>
                <Switch
                  id={notification.id}
                  checked={notification.enabled}
                  onCheckedChange={(enabled) =>
                    handleToggle("email", notification.id, enabled)
                  }
                />
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Push Notifications */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-sm font-semibold">Push Notifications</h3>
          </div>
          <div className="space-y-4">
            {pushNotifications.map((notification) => (
              <div
                key={notification.id}
                className="flex items-center justify-between space-x-2"
              >
                <div className="flex-1 space-y-1">
                  <Label htmlFor={notification.id} className="cursor-pointer">
                    {notification.label}
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    {notification.description}
                  </p>
                </div>
                <Switch
                  id={notification.id}
                  checked={notification.enabled}
                  onCheckedChange={(enabled) =>
                    handleToggle("push", notification.id, enabled)
                  }
                />
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Privacy Settings */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-sm font-semibold">Privacy</h3>
          </div>
          <div className="flex items-center justify-between space-x-2">
            <div className="flex-1 space-y-1">
              <Label htmlFor="profile_visibility" className="cursor-pointer">
                Profile Visibility
              </Label>
              <p className="text-sm text-muted-foreground">
                Make your profile visible to other users.
              </p>
            </div>
            <Switch id="profile_visibility" defaultChecked />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
