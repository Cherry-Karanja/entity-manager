'use client'

import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
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
  Shield,
  Users,
  Settings,
  Eye,
  Edit,
  Trash2,
  Plus,
  Save,
  X,
  Search,
  Filter
} from "lucide-react"
import { UserRole, Permission } from '../../types'

// Permission categories and their actions
const PERMISSION_CATEGORIES = {
  users: {
    label: 'User Management',
    icon: Users,
    permissions: {
      'users.view': 'View Users',
      'users.create': 'Create Users',
      'users.edit': 'Edit Users',
      'users.delete': 'Delete Users',
      'users.approve': 'Approve Users'
    }
  },
  roles: {
    label: 'Role Management',
    icon: Shield,
    permissions: {
      'roles.view': 'View Roles',
      'roles.create': 'Create Roles',
      'roles.edit': 'Edit Roles',
      'roles.delete': 'Delete Roles',
      'roles.assign': 'Assign Roles'
    }
  },
  system: {
    label: 'System Administration',
    icon: Settings,
    permissions: {
      'system.view': 'View System Settings',
      'system.edit': 'Edit System Settings',
      'system.backup': 'Create Backups',
      'system.restore': 'Restore System',
      'system.logs': 'View System Logs'
    }
  },
  audit: {
    label: 'Audit & Security',
    icon: Eye,
    permissions: {
      'audit.view': 'View Audit Logs',
      'audit.export': 'Export Audit Data',
      'audit.security': 'Security Monitoring',
      'audit.reports': 'Generate Reports',
      'audit.alerts': 'Manage Alerts'
    }
  }
} as const

interface PermissionMatrixProps {
  roles: UserRole[]
  allPermissions: Permission[]
  onPermissionsChange: (roleId: string, permissions: Permission[]) => void
  onRoleCreate?: (roleData: Partial<UserRole>) => void
  onRoleUpdate?: (roleId: string, roleData: Partial<UserRole>) => void
  onRoleDelete?: (roleId: string) => void
  readonly?: boolean
}

export function PermissionMatrix({
  roles,
  allPermissions,
  onPermissionsChange,
  onRoleCreate,
  onRoleUpdate,
  onRoleDelete,
  readonly = false
}: PermissionMatrixProps) {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newRoleName, setNewRoleName] = useState('')
  const [newRoleDescription, setNewRoleDescription] = useState('')

  // Get all permissions as a flat list from props
  const permissionList = useMemo(() => {
    return allPermissions.map(permission => ({
      key: permission.codename,
      label: permission.name,
      category: permission.app_label,
      id: permission.id
    }))
  }, [allPermissions])

  // Group permissions by app_label for categories
  const permissionCategories = useMemo(() => {
    const categories: Record<string, { permissions: typeof permissionList, icon: React.ComponentType<any> }> = {}

    permissionList.forEach(permission => {
      const category = permission.category || 'general'
      if (!categories[category]) {
        categories[category] = {
          permissions: [],
          icon: getCategoryIcon(category)
        }
      }
      categories[category].permissions.push(permission)
    })

    return categories
  }, [permissionList])

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'accounts':
      case 'auth':
        return Users
      case 'admin':
        return Settings
      case 'contenttypes':
        return Shield
      default:
        return Eye
    }
  }

  // Filter permissions based on search and category
  const filteredPermissions = useMemo(() => {
    return permissionList.filter(perm => {
      const matchesSearch = perm.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           perm.key.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = filterCategory === 'all' || perm.category === filterCategory
      return matchesSearch && matchesCategory
    })
  }, [permissionList, searchTerm, filterCategory])

  const handlePermissionToggle = (roleId: string, permissionCodename: string, checked: boolean) => {
    if (readonly) return

    const role = roles.find(r => r.id === roleId)
    if (!role) return

    const currentPermissions = role.permissions || []
    let updatedPermissions: Permission[]

    if (checked) {
      // Add permission if not already present
      const permissionToAdd = allPermissions.find(p => p.codename === permissionCodename)
      if (permissionToAdd && !currentPermissions.some(p => p.codename === permissionCodename)) {
        updatedPermissions = [...currentPermissions, permissionToAdd]
      } else {
        updatedPermissions = currentPermissions
      }
    } else {
      // Remove permission
      updatedPermissions = currentPermissions.filter(p => p.codename !== permissionCodename)
    }

    onPermissionsChange(roleId, updatedPermissions)
  }

  const handleCreateRole = () => {
    if (!newRoleName.trim() || !onRoleCreate) return

    onRoleCreate({
      name: newRoleName.trim(),
      description: newRoleDescription.trim(),
      permissions: []
    })

    setNewRoleName('')
    setNewRoleDescription('')
    setIsCreateDialogOpen(false)
  }

  const getPermissionCount = (role: UserRole) => {
    return role.permissions?.length || 0
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Permission Matrix</h2>
          <p className="text-muted-foreground">
            Manage role-based permissions across the system
          </p>
        </div>
        {!readonly && onRoleCreate && (
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Role
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Role</DialogTitle>
                <DialogDescription>
                  Add a new role with custom permissions.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="role-name">Role Name</Label>
                  <Input
                    id="role-name"
                    value={newRoleName}
                    onChange={(e) => setNewRoleName(e.target.value)}
                    placeholder="Enter role name"
                  />
                </div>
                <div>
                  <Label htmlFor="role-description">Description</Label>
                  <Input
                    id="role-description"
                    value={newRoleDescription}
                    onChange={(e) => setNewRoleDescription(e.target.value)}
                    placeholder="Enter role description"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateRole} disabled={!newRoleName.trim()}>
                  Create Role
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search permissions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {Object.keys(permissionCategories).map((category) => (
                  <SelectItem key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Permission Matrix */}
      <Card>
        <CardHeader>
          <CardTitle>Role Permissions</CardTitle>
          <CardDescription>
            Configure permissions for each role. Check boxes to grant permissions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-64">Permission</TableHead>
                  <TableHead className="w-32">Category</TableHead>
                  {roles.map((role) => (
                    <TableHead key={role.id} className="text-center min-w-32">
                      <div className="space-y-1">
                        <div className="font-medium">{role.name}</div>
                        <Badge variant="secondary" className="text-xs">
                          {getPermissionCount(role)} permissions
                        </Badge>
                      </div>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPermissions.map((permission) => {
                  const CategoryIcon = getCategoryIcon(permission.category)
                  return (
                    <TableRow key={permission.key}>
                      <TableCell className="font-medium">
                        {permission.label}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <CategoryIcon className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground capitalize">
                            {permission.category}
                          </span>
                        </div>
                      </TableCell>
                      {roles.map((role) => {
                        const hasPermission = role.permissions?.some(p => p.codename === permission.key) || false
                        return (
                          <TableCell key={role.id} className="text-center">
                            <Checkbox
                              checked={hasPermission}
                              onCheckedChange={(checked) =>
                                handlePermissionToggle(role.id, permission.key, checked as boolean)
                              }
                              disabled={readonly}
                            />
                          </TableCell>
                        )
                      })}
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Role Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {roles.map((role) => (
          <Card key={role.id}>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">{role.name}</CardTitle>
              <CardDescription>{role.description || 'No description'}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Permissions:</span>
                  <Badge variant="outline">
                    {getPermissionCount(role)} / {allPermissions.length}
                  </Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Users:</span>
                  <Badge variant="outline">
                    {role.users_count || 0}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}