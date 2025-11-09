'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Users,
  UserCheck,
  Shield,
  Activity,
  Clock,
  History,
  Plus,
  Eye,
  Settings,
  BarChart3
} from "lucide-react"
import Link from "next/link"

// Entity overview data
const entityStats = [
  {
    name: 'Users',
    count: 0,
    description: 'Total registered users',
    icon: Users,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    href: '/dashboard/accounts/users'
  },
  {
    name: 'User Roles',
    count: 0,
    description: 'Defined role types',
    icon: Shield,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    href: '/dashboard/accounts/user-roles'
  },
  {
    name: 'User Profiles',
    count: 0,
    description: 'Profile completions',
    icon: UserCheck,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    href: '/dashboard/accounts/user-profiles'
  },
  {
    name: 'Active Sessions',
    count: 0,
    description: 'Current user sessions',
    icon: Activity,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    href: '/dashboard/accounts/user-sessions'
  },
  {
    name: 'Login Attempts',
    count: 0,
    description: 'Recent login activity',
    icon: Clock,
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    href: '/dashboard/accounts/login-attempts'
  },
  {
    name: 'Role History',
    count: 0,
    description: 'Role change records',
    icon: History,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50',
    href: '/dashboard/accounts/user-role-history'
  }
]

const quickActions = [
  {
    title: 'Create User',
    description: 'Add a new user account',
    icon: Plus,
    href: '/dashboard/accounts/users/create',
    variant: 'default' as const
  },
  {
    title: 'Manage Roles',
    description: 'Configure user roles and permissions',
    icon: Settings,
    href: '/dashboard/accounts/user-roles',
    variant: 'outline' as const
  },
  {
    title: 'View Reports',
    description: 'Access account analytics and reports',
    icon: BarChart3,
    href: '/dashboard/accounts/reports',
    variant: 'outline' as const
  },
  {
    title: 'Audit Logs',
    description: 'Review system activity and changes',
    icon: Eye,
    href: '/dashboard/accounts/audit',
    variant: 'outline' as const
  }
]

export default function AccountsDashboardPage() {
  const [selectedEntity, setSelectedEntity] = useState<string | null>(null)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Accounts Management</h1>
          <p className="text-muted-foreground">
            Manage users, roles, profiles, and security across your organization
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common account management tasks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action) => (
              <Link key={action.title} href={action.href}>
                <Button
                  variant={action.variant}
                  className="w-full h-auto p-4 flex flex-col items-center gap-2"
                >
                  <action.icon className="h-6 w-6" />
                  <div className="text-center">
                    <div className="font-medium">{action.title}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {action.description}
                    </div>
                  </div>
                </Button>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Entity Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {entityStats.map((entity) => (
          <Link key={entity.name} href={entity.href}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {entity.name}
                </CardTitle>
                <div className={`p-2 rounded-md ${entity.bgColor}`}>
                  <entity.icon className={`h-4 w-4 ${entity.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{entity.count}</div>
                <p className="text-xs text-muted-foreground">
                  {entity.description}
                </p>
                <div className="mt-4">
                  <Badge variant="secondary" className="text-xs">
                    View Details →
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>
            Latest account management activities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">System initialized</p>
                <p className="text-xs text-muted-foreground">
                  Account management system is ready for use
                </p>
              </div>
              <div className="text-xs text-muted-foreground">
                Just now
              </div>
            </div>
          </div>
          <div className="mt-4 text-center">
            <Button variant="outline" size="sm">
              View All Activity
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}