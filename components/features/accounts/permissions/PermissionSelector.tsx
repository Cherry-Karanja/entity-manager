/**
 * Permission Selector Component
 * 
 * A user-friendly component for selecting permissions grouped by app.
 * Designed to handle hundreds of permissions efficiently.
 */

'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Permission } from '../types';
import { permissionActions } from './client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Search, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

interface PermissionSelectorProps {
  selectedPermissions?: Permission[];
  onSelectionChange?: (permissions: Permission[]) => void;
  mode?: 'select' | 'view';
  className?: string;
}

interface GroupedPermissions {
  [appLabel: string]: Permission[];
}

export function PermissionSelector({
  selectedPermissions = [],
  onSelectionChange,
  mode = 'select',
  className = '',
}: PermissionSelectorProps) {
  const [groupedPermissions, setGroupedPermissions] = useState<GroupedPermissions>({});
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [expandedApps, setExpandedApps] = useState<string[]>([]);

  // Initialize selected IDs from props
  useEffect(() => {
    const ids = new Set(selectedPermissions.map(p => p.id));
    setSelectedIds(ids);
  }, [selectedPermissions]);

  // Load permissions grouped by app
  useEffect(() => {
    const loadPermissions = async () => {
      try {
        setLoading(true);
        const grouped = await permissionActions.getByApp();
        setGroupedPermissions(grouped);

        // Auto-expand apps that have selected permissions (for editing)
        // or just the first app (for creating)
        const appLabels = Object.keys(grouped);
        if (appLabels.length > 0) {
          if (selectedIds.size > 0) {
            // Expand apps with selected permissions
            const appsWithSelections = appLabels.filter(appLabel => {
              const appPermissions = grouped[appLabel] || [];
              return appPermissions.some((p: Permission) => selectedIds.has(p.id));
            });
            setExpandedApps(appsWithSelections.length > 0 ? appsWithSelections : [appLabels[0]]);
          } else {
            // No selections, just expand first app
            setExpandedApps([appLabels[0]]);
          }
        }
      } catch (error) {
        console.error('Failed to load permissions:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPermissions();
  }, [selectedIds]);

  // Filter permissions based on search query
  const filteredGroupedPermissions = useMemo(() => {
    if (!searchQuery.trim()) {
      return groupedPermissions;
    }

    const query = searchQuery.toLowerCase();
    const filtered: GroupedPermissions = {};

    Object.entries(groupedPermissions).forEach(([appLabel, permissions]) => {
      const matchingPermissions = permissions.filter(
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

  // Handle permission toggle
  const handleTogglePermission = (permission: Permission) => {
    if (mode === 'view') return;

    const newSelectedIds = new Set(selectedIds);

    if (newSelectedIds.has(permission.id)) {
      newSelectedIds.delete(permission.id);
    } else {
      newSelectedIds.add(permission.id);
    }

    setSelectedIds(newSelectedIds);

    // Notify parent of changes
    if (onSelectionChange) {
      const allPermissions = Object.values(groupedPermissions).flat();
      const selected = allPermissions.filter(p => newSelectedIds.has(p.id));
      onSelectionChange(selected);
    }
  };

  // Handle select/deselect all for an app
  const handleToggleApp = (appLabel: string) => {
    if (mode === 'view') return;

    const appPermissions = groupedPermissions[appLabel] || [];
    const allSelected = appPermissions.every(p => selectedIds.has(p.id));
    const newSelectedIds = new Set(selectedIds);

    if (allSelected) {
      // Deselect all in this app
      appPermissions.forEach(p => newSelectedIds.delete(p.id));
    } else {
      // Select all in this app
      appPermissions.forEach(p => newSelectedIds.add(p.id));
    }

    setSelectedIds(newSelectedIds);

    // Notify parent of changes
    if (onSelectionChange) {
      const allPermissions = Object.values(groupedPermissions).flat();
      const selected = allPermissions.filter(p => newSelectedIds.has(p.id));
      onSelectionChange(selected);
    }
  };

  // Handle select/deselect all
  const handleSelectAll = () => {
    if (mode === 'view') return;

    const allPermissions = Object.values(filteredGroupedPermissions).flat();
    const allSelected = allPermissions.every(p => selectedIds.has(p.id));
    const newSelectedIds = new Set(selectedIds);

    if (allSelected) {
      // Deselect all visible permissions
      allPermissions.forEach(p => newSelectedIds.delete(p.id));
    } else {
      // Select all visible permissions
      allPermissions.forEach(p => newSelectedIds.add(p.id));
    }

    setSelectedIds(newSelectedIds);

    // Notify parent of changes
    if (onSelectionChange) {
      const allPermissions = Object.values(groupedPermissions).flat();
      const selected = allPermissions.filter(p => newSelectedIds.has(p.id));
      onSelectionChange(selected);
    }
  };

  // Get statistics for an app
  const getAppStats = (appLabel: string) => {
    const appPermissions = groupedPermissions[appLabel] || [];
    const selectedCount = appPermissions.filter(p => selectedIds.has(p.id)).length;
    const totalCount = appPermissions.length;
    return { selectedCount, totalCount };
  };

  if (loading) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-3">Loading permissions...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  const totalPermissions = Object.values(groupedPermissions).flat().length;
  const selectedCount = selectedIds.size;

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Permissions</CardTitle>
            <CardDescription>
              {mode === 'view'
                ? `${selectedCount} of ${totalPermissions} permissions assigned`
                : `Select permissions to assign. ${selectedCount} of ${totalPermissions} selected`
              }
            </CardDescription>
          </div>
          {mode === 'select' && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleSelectAll}
            >
              {Object.values(filteredGroupedPermissions).flat().every(p => selectedIds.has(p.id))
                ? <><X className="h-4 w-4 mr-2" /> Deselect All</>
                : <><Check className="h-4 w-4 mr-2" /> Select All</>
              }
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {/* Search */}
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search permissions by name, codename, model, or app..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>

        {/* Permissions grouped by app */}
        <ScrollArea className="h-[500px] pr-4">
          <Accordion type="multiple" value={expandedApps} onValueChange={setExpandedApps}>
            {Object.entries(filteredGroupedPermissions).map(([appLabel, permissions]) => {
              const { selectedCount: appSelectedCount, totalCount: appTotalCount } = getAppStats(appLabel);
              const allAppSelected = appSelectedCount === appTotalCount && appTotalCount > 0;
              const someAppSelected = appSelectedCount > 0 && appSelectedCount < appTotalCount;

              return (
                <AccordionItem key={appLabel} value={appLabel}>
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center justify-between w-full pr-4">
                      <div className="flex items-center gap-3">
                        {mode === 'select' && (
                          <Checkbox
                            checked={allAppSelected}
                            ref={(el) => {
                              if (el) {
                                (el as HTMLButtonElement).dataset.state = someAppSelected ? 'indeterminate' : (allAppSelected ? 'checked' : 'unchecked');
                              }
                            }}
                            onCheckedChange={() => handleToggleApp(appLabel)}
                            onClick={(e) => e.stopPropagation()}
                          />
                        )}
                        <div>
                          <div className="font-semibold text-left capitalize">
                            {appLabel.replace(/_/g, ' ')}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {appSelectedCount} / {appTotalCount} selected
                          </div>
                        </div>
                      </div>
                      <Badge variant={appSelectedCount > 0 ? 'default' : 'secondary'}>
                        {permissions.length}
                      </Badge>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2 pl-8 pt-2">
                      {permissions.map((permission) => (
                        <div
                          key={permission.id}
                          className={`flex items-start space-x-3 rounded-md p-2 hover:bg-accent ${mode === 'select' ? 'cursor-pointer' : ''
                            }`}
                          onClick={() => handleTogglePermission(permission)}
                        >
                          {mode === 'select' && (
                            <Checkbox
                              checked={selectedIds.has(permission.id)}
                              onCheckedChange={() => handleTogglePermission(permission)}
                            />
                          )}
                          <div className="flex-1 space-y-1">
                            <Label className={mode === 'select' ? 'cursor-pointer' : ''}>
                              {permission.name}
                            </Label>
                            <div className="text-xs text-muted-foreground space-x-2">
                              <code className="bg-muted px-1 py-0.5 rounded">
                                {permission.codename}
                              </code>
                              <span>•</span>
                              <span className="capitalize">{permission.model}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>

          {Object.keys(filteredGroupedPermissions).length === 0 && (
            <div className="text-center text-muted-foreground py-8">
              {searchQuery ? 'No permissions found matching your search.' : 'No permissions available.'}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
