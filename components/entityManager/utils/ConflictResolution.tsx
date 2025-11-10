'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AlertTriangle, CheckCircle, XCircle, GitMerge, ArrowRight, Clock } from 'lucide-react'
import type { ConflictResolution as ConflictResolutionType, OptimisticOperation } from './types/optimistic'

interface ConflictResolutionDialogProps {
  conflict: ConflictResolutionType
  onResolve: (resolution: ConflictResolutionType) => void
  onCancel: () => void
  isOpen: boolean
}

export const ConflictResolutionDialog: React.FC<ConflictResolutionDialogProps> = ({
  conflict,
  onResolve,
  onCancel,
  isOpen
}) => {
  const [selectedResolution, setSelectedResolution] = useState<'local' | 'server' | 'merge' | 'manual'>('merge')
  const [customResolution, setCustomResolution] = useState<Record<string, unknown>>({})

  const handleResolve = () => {
    const resolvedConflict: ConflictResolutionType = {
      ...conflict,
      resolution: selectedResolution,
      resolvedData: selectedResolution === 'manual' ? customResolution : undefined,
      timestamp: Date.now()
    }
    onResolve(resolvedConflict)
  }

  const renderFieldComparison = (field: string, localValue: unknown, serverValue: unknown) => {
    const hasConflict = JSON.stringify(localValue) !== JSON.stringify(serverValue)

    return (
      <div key={field} className="grid grid-cols-3 gap-4 py-2 border-b border-gray-100 last:border-b-0">
        <div className="font-medium text-sm">{field}</div>
        <div className={`text-sm p-2 rounded ${hasConflict ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'}`}>
          {JSON.stringify(localValue)}
        </div>
        <div className={`text-sm p-2 rounded ${hasConflict ? 'bg-red-50 border border-red-200' : 'bg-gray-50'}`}>
          {JSON.stringify(serverValue)}
        </div>
      </div>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onCancel}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            Conflict Detected
          </DialogTitle>
          <DialogDescription>
            This {conflict.entityType} has been modified by another user. Please choose how to resolve the conflict.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Conflict Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Conflict Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Entity:</span> {conflict.entityType} #{conflict.entityId}
                </div>
                <div>
                  <span className="font-medium">Fields in Conflict:</span> {conflict.conflictFields.join(', ')}
                </div>
                <div>
                  <span className="font-medium">Your Changes:</span> {new Date(conflict.timestamp).toLocaleString()}
                </div>
                <div>
                  <span className="font-medium">Server Changes:</span> {new Date(conflict.timestamp).toLocaleString()}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Field Comparison */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Field Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 mb-4 text-sm font-medium">
                <div>Field</div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-blue-500 rounded"></div>
                  Your Changes
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-red-500 rounded"></div>
                  Server Changes
                </div>
              </div>
              <div className="space-y-1">
                {conflict.conflictFields.map(field =>
                  renderFieldComparison(
                    field,
                    (conflict.localData as any)[field],
                    (conflict.serverData as any)[field]
                  )
                )}
              </div>
            </CardContent>
          </Card>

          {/* Resolution Options */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Resolution Options</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={selectedResolution} onValueChange={(value) => setSelectedResolution(value as any)}>
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="local">Keep Mine</TabsTrigger>
                  <TabsTrigger value="server">Use Server</TabsTrigger>
                  <TabsTrigger value="merge">Smart Merge</TabsTrigger>
                  <TabsTrigger value="manual">Manual Edit</TabsTrigger>
                </TabsList>

                <TabsContent value="local" className="mt-4">
                  <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-900">Keep Your Changes</h4>
                      <p className="text-sm text-blue-700 mt-1">
                        Discard the server changes and keep your modifications. This will overwrite any changes made by other users.
                      </p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="server" className="mt-4">
                  <div className="flex items-start gap-3 p-4 bg-red-50 rounded-lg">
                    <XCircle className="h-5 w-5 text-red-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-red-900">Use Server Version</h4>
                      <p className="text-sm text-red-700 mt-1">
                        Discard your changes and use the server version. Your modifications will be lost.
                      </p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="merge" className="mt-4">
                  <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg">
                    <GitMerge className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-green-900">Smart Merge</h4>
                      <p className="text-sm text-green-700 mt-1">
                        Automatically merge compatible changes. For conflicting fields, server changes will take precedence.
                      </p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="manual" className="mt-4">
                  <div className="flex items-start gap-3 p-4 bg-purple-50 rounded-lg">
                    <Clock className="h-5 w-5 text-purple-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-purple-900">Manual Resolution</h4>
                      <p className="text-sm text-purple-700 mt-1">
                        Manually specify the final values for each conflicting field.
                      </p>
                      <div className="mt-3 space-y-2">
                        {conflict.conflictFields.map(field => (
                          <div key={field} className="flex items-center gap-2">
                            <label className="text-sm font-medium min-w-20">{field}:</label>
                            <input
                              type="text"
                              className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                              placeholder="Enter final value"
                              onChange={(e) => setCustomResolution(prev => ({
                                ...prev,
                                [field]: e.target.value
                              }))}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={handleResolve}>
            Resolve Conflict
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

interface ConflictNotificationProps {
  conflicts: ConflictResolutionType[]
  onResolve: (conflictId: string, resolution: ConflictResolutionType) => void
  onDismiss: (conflictId: string) => void
  className?: string
}

export const ConflictNotification: React.FC<ConflictNotificationProps> = ({
  conflicts,
  onResolve,
  onDismiss,
  className = ''
}) => {
  const [selectedConflict, setSelectedConflict] = useState<ConflictResolutionType | null>(null)

  if (conflicts.length === 0) {
    return null
  }

  return (
    <>
      <div className={`fixed bottom-4 right-4 z-50 max-w-sm ${className}`}>
        <div className="bg-white border border-orange-200 rounded-lg shadow-lg p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-orange-500 mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="font-medium text-gray-900">
                {conflicts.length} Conflict{conflicts.length > 1 ? 's' : ''} Detected
              </div>
              <div className="text-sm text-gray-600 mt-1">
                Some items have been modified by other users.
              </div>
              <div className="mt-3 space-y-2">
                {conflicts.slice(0, 3).map((conflict) => (
                  <div key={conflict.operationId} className="flex items-center justify-between">
                    <div className="text-sm">
                      <span className="font-medium">{conflict.entityType} #{conflict.entityId}</span>
                      <div className="text-xs text-gray-500">
                        {conflict.conflictFields.length} conflicting field{conflict.conflictFields.length > 1 ? 's' : ''}
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => setSelectedConflict(conflict)}
                      className="text-xs"
                    >
                      Resolve
                    </Button>
                  </div>
                ))}
                {conflicts.length > 3 && (
                  <div className="text-xs text-gray-500 text-center">
                    +{conflicts.length - 3} more conflicts
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {selectedConflict && (
        <ConflictResolutionDialog
          conflict={selectedConflict}
          onResolve={(resolution) => {
            onResolve(selectedConflict.operationId, resolution)
            setSelectedConflict(null)
          }}
          onCancel={() => setSelectedConflict(null)}
          isOpen={true}
        />
      )}
    </>
  )
}

const ConflictResolution = {
  ConflictResolutionDialog,
  ConflictNotification
}

export default ConflictResolution