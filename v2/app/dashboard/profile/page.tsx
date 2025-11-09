"use client"

import { ProfileManager } from "@/components/profile"

export default function ProfilePage() {
  // In a real application, you would fetch this data from your API
  const initialData = {
    first_name: "John",
    last_name: "Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    department: "Engineering",
    bio: "Senior Software Engineer with a passion for building great products.",
  }

  const handleProfileUpdate = async (data: {
    first_name: string
    last_name: string
    email: string
    phone?: string
    bio?: string
    department?: string
    avatar?: string
  }) => {
    // TODO: Implement API call to update profile
    console.log("Updating profile:", data)
    // Example API call:
    // const response = await fetch('/api/v1/accounts/users/me/', {
    //   method: 'PATCH',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(data)
    // })
    // if (!response.ok) throw new Error('Failed to update profile')
  }

  const handlePasswordUpdate = async (data: {
    current_password: string
    new_password: string
    confirm_password: string
  }) => {
    // TODO: Implement API call to update password
    console.log("Updating password")
    // Prevent unused variable warning
    void data
    // Example API call:
    // const response = await fetch('/api/v1/core/auth/password/change/', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(data)
    // })
    // if (!response.ok) throw new Error('Failed to update password')
  }

  const handleNotificationUpdate = async (preferences: Record<string, boolean>) => {
    // TODO: Implement API call to update notification preferences
    console.log("Updating notification preferences:", preferences)
    // Example API call:
    // const response = await fetch('/api/v1/accounts/users/me/preferences/', {
    //   method: 'PATCH',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ notifications: preferences })
    // })
    // if (!response.ok) throw new Error('Failed to update preferences')
  }

  return (
    <div className="container max-w-5xl py-6">
      <ProfileManager
        initialData={initialData}
        onPasswordUpdate={handlePasswordUpdate}
        onNotificationUpdate={handleNotificationUpdate}
      />
    </div>
  )
}
