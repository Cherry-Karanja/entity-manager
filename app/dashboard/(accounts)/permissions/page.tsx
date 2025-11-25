/**
 * Permissions Management Page
 * 
 * Page for managing Django permissions using a user-friendly interface.
 * Handles hundreds of permissions efficiently with search and grouping.
 */

'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { permissionActions, Permission } from '@/components/features/accounts/permissions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Search, Shield, RefreshCw, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePageActions } from '../../layout';
import { Loader2 } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import Link from 'next/link';

interface GroupedPermissions {
  [appLabel: string]: Permission[];
}

export default function PermissionsPage() {
  const { setPageActions } = usePageActions();
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [groupedPermissions, setGroupedPermissions] = useState<GroupedPermissions>({});
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedApps, setExpandedApps] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grouped' | 'table'>('grouped');

  // Set page actions
  useEffect(() => {
    setPageActions(
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setViewMode(viewMode === 'grouped' ? 'table' : 'grouped')}
        >
          {viewMode === 'grouped' ? 'Table View' : 'Grouped View'}
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => loadPermissions()}
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>
    );

    return () => setPageActions(null);
  }, [setPageActions, viewMode]);

  // Load permissions
  const loadPermissions = async () => {
    try {
      setLoading(true);
      
      // Load grouped permissions for app-based view
      const grouped = await permissionActions.getByApp();
      setGroupedPermissions(grouped);
      
      // Flatten for table view
      const allPermissions = Object.values(grouped).flat() as Permission[];
      setPermissions(allPermissions);
      
      // Auto-expand first app
      const appLabels = Object.keys(grouped);
      if (appLabels.length > 0) {
        setExpandedApps([appLabels[0]]);
      }
    } catch (error) {
      console.error('Failed to load permissions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPermissions();
  }, []);

  // Filter permissions based on search
  const filteredGroupedPermissions = useMemo(() => {
    if (!searchQuery.trim()) {
      return groupedPermissions;
    }

    const query = searchQuery.toLowerCase();
    const filtered: GroupedPermissions = {};

    Object.entries(groupedPermissions).forEach(([appLabel, perms]) => {
      const matchingPermissions = perms.filter(
        perm =>
          perm.name.toLowerCase().includes(query) ||
          perm.codename.toLowerCase().includes(query) ||
          perm.model.toLowerCase().includes(query) ||
          appLabel.toLowerCase().includes(query)
      );

      if (matchingPermissions.length > 0) {
        filtered[appLabel] = matchingPermissions;
      }
    });

    return filtered;
  }, [groupedPermissions, searchQuery]);

  const filteredPermissions = useMemo(() => {
    if (!searchQuery.trim()) {
      return permissions;
    }

    const query = searchQuery.toLowerCase();
    return permissions.filter(
      perm =>
        perm.name.toLowerCase().includes(query) ||
        perm.codename.toLowerCase().includes(query) ||
        perm.model.toLowerCase().includes(query) ||
        perm.app_label.toLowerCase().includes(query)
    );
  }, [permissions, searchQuery]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-3">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <span className="text-muted-foreground">Loading permissions...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Permissions</h1>
        <p className="text-muted-foreground">
          View all available Django permissions. Permissions are assigned to roles to control access.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Permissions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{permissions.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Apps
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Object.keys(groupedPermissions).length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Models
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(permissions.map(p => `${p.app_label}.${p.model}`)).size}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search permissions by name, codename, model, or app..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Permissions List */}
      {viewMode === 'grouped' ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Permissions by App
            </CardTitle>
            <CardDescription>
              Permissions are grouped by Django app for easier navigation.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[600px] pr-4">
              <Accordion type="multiple" value={expandedApps} onValueChange={setExpandedApps}>
                {Object.entries(filteredGroupedPermissions).map(([appLabel, perms]) => (
                  <AccordionItem key={appLabel} value={appLabel}>
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center justify-between w-full pr-4">
                        <div className="font-semibold capitalize">
                          {appLabel.replace(/_/g, ' ')}
                        </div>
                        <Badge variant="secondary">
                          {perms.length} permissions
                        </Badge>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2 pl-4 pt-2">
                        {perms.map((permission) => (
                          <Link
                            key={permission.id}
                            href={`/dashboard/permissions/${permission.id}`}
                            className="flex items-start justify-between rounded-md p-3 hover:bg-accent transition-colors group"
                          >
                            <div className="flex-1 space-y-1">
                              <div className="font-medium group-hover:text-primary transition-colors">
                                {permission.name}
                              </div>
                              <div className="text-sm text-muted-foreground space-x-2">
                                <code className="bg-muted px-1.5 py-0.5 rounded text-xs">
                                  {permission.codename}
                                </code>
                                <span>•</span>
                                <span className="capitalize">{permission.model}</span>
                              </div>
                            </div>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Info className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Click to view details</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </Link>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>

              {Object.keys(filteredGroupedPermissions).length === 0 && (
                <div className="text-center text-muted-foreground py-8">
                  {searchQuery ? 'No permissions found matching your search.' : 'No permissions available.'}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              All Permissions
            </CardTitle>
            <CardDescription>
              Complete list of all Django permissions in the system.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[600px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Codename</TableHead>
                    <TableHead>App</TableHead>
                    <TableHead>Model</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPermissions.map((permission) => (
                    <TableRow key={permission.id}>
                      <TableCell className="font-medium">{permission.name}</TableCell>
                      <TableCell>
                        <code className="bg-muted px-1.5 py-0.5 rounded text-xs">
                          {permission.codename}
                        </code>
                      </TableCell>
                      <TableCell className="capitalize">{permission.app_label}</TableCell>
                      <TableCell className="capitalize">{permission.model}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/dashboard/permissions/${permission.id}`}>
                            View
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {filteredPermissions.length === 0 && (
                <div className="text-center text-muted-foreground py-8">
                  {searchQuery ? 'No permissions found matching your search.' : 'No permissions available.'}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
