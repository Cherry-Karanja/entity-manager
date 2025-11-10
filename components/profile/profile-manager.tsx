"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProfileForm } from "./profile-form"
import { SecuritySettings } from "./security-settings"
import { NotificationPreferences } from "./notification-preferences"
import { User, Shield, Bell } from "lucide-react"

interface ProfileData {
  first_name?: string
  last_name?: string
  email?: string
  phone?: string
  bio?: string
  department?: string
  avatar?: string
}

interface ProfileManagerProps {
  initialData?: ProfileData
  onProfileUpdate?: (data: Partial<ProfileData>) => Promise<void>
  onPasswordUpdate?: (data: { current_password: string; new_password: string; confirm_password: string }) => Promise<void>
  onNotificationUpdate?: (data: Record<string, boolean>) => Promise<void>
}

export function ProfileManager({
  initialData,
  onProfileUpdate,
  onPasswordUpdate,
  onNotificationUpdate,
}: ProfileManagerProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your account settings and preferences.
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Profile</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Security</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Notifications</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-4">
          <ProfileForm initialData={initialData} onSubmit={onProfileUpdate} />
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <SecuritySettings onSubmit={onPasswordUpdate} />
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <NotificationPreferences onUpdate={onNotificationUpdate} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
