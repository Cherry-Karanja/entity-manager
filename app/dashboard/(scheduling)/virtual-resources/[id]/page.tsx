/**
 * Virtual Resource View Page
 */

'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { default as virtualResourceClient } from '@/components/features/logx/virtual-resources/api/client';
import { VirtualResource, RESOURCE_TYPE_LABELS } from '@/components/features/logx/types';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function VirtualResourceViewPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  
  const [resource, setResource] = useState<VirtualResource | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResource = async () => {
      try {
        setLoading(true);
        const response = await virtualResourceClient.get(id);
        if (response.error) {
          setError(response.error.message);
        } else {
          setResource(response.data);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load virtual resource');
      } finally {
        setLoading(false);
      }
    };
    fetchResource();
  }, [id]);

  const handleBack = () => router.push('/dashboard/scheduling/virtual-resources');
  const handleEdit = () => router.push(`/dashboard/scheduling/virtual-resources/${id}/edit`);

  if (loading) {
    return <div className="flex items-center justify-center h-96"><div className="text-muted-foreground">Loading...</div></div>;
  }

  if (error || !resource) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <div className="text-destructive">{error || 'Virtual resource not found'}</div>
        <Button variant="outline" onClick={handleBack}><ArrowLeft className="h-4 w-4 mr-2" />Back</Button>
      </div>
    );
  }

  const formatTime = (time: string | undefined) => {
    if (!time) return '-';
    return time.substring(0, 5);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{resource.name}</h1>
            <p className="text-muted-foreground">
              {RESOURCE_TYPE_LABELS[resource.resource_type as keyof typeof RESOURCE_TYPE_LABELS]}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleEdit}>
            <Edit className="h-4 w-4 mr-2" />Edit
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Name</span>
              <span className="font-medium">{resource.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Resource Type</span>
              <Badge>{RESOURCE_TYPE_LABELS[resource.resource_type as keyof typeof RESOURCE_TYPE_LABELS]}</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Timetable</span>
              <span className="font-medium">
                {resource.timetable_details?.name || resource.timetable}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Availability & Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Capacity</span>
              <span className="font-medium text-lg">{resource.capacity}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Available From</span>
              <span className="font-medium">{formatTime(resource.available_from)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Available Until</span>
              <span className="font-medium">{formatTime(resource.available_until)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Status</span>
              <Badge variant={resource.is_active ? "default" : "secondary"}>
                {resource.is_active ? "Active" : "Inactive"}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {resource.description && (
        <Card>
          <CardHeader>
            <CardTitle>Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{resource.description}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
