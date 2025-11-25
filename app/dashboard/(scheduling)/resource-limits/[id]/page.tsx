/**
 * Resource Limit View Page
 */

'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { default as resourceLimitClient } from '@/components/features/logx/resource-limits/api/client';
import { ResourceLimit, ENTITY_TYPE_LABELS, LIMIT_RESOURCE_TYPE_LABELS, PERIOD_TYPE_LABELS } from '@/components/features/logx/types';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function ResourceLimitViewPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  
  const [limit, setLimit] = useState<ResourceLimit | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLimit = async () => {
      try {
        setLoading(true);
        const response = await resourceLimitClient.get(id);
        if (response.error) {
          setError(response.error.message);
        } else {
          setLimit(response.data);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load resource limit');
      } finally {
        setLoading(false);
      }
    };
    fetchLimit();
  }, [id]);

  const handleBack = () => router.push('/dashboard/scheduling/resource-limits');
  const handleEdit = () => router.push(`/dashboard/scheduling/resource-limits/${id}/edit`);

  if (loading) {
    return <div className="flex items-center justify-center h-96"><div className="text-muted-foreground">Loading...</div></div>;
  }

  if (error || !limit) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <div className="text-destructive">{error || 'Resource limit not found'}</div>
        <Button variant="outline" onClick={handleBack}><ArrowLeft className="h-4 w-4 mr-2" />Back</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">
              {ENTITY_TYPE_LABELS[limit.entity_type as keyof typeof ENTITY_TYPE_LABELS]} - {LIMIT_RESOURCE_TYPE_LABELS[limit.resource_type as keyof typeof LIMIT_RESOURCE_TYPE_LABELS]} Limit
            </h1>
            <p className="text-muted-foreground">
              Max: {limit.max_value} {PERIOD_TYPE_LABELS[limit.period_type as keyof typeof PERIOD_TYPE_LABELS]}
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
              <span className="text-muted-foreground">Timetable</span>
              <span className="font-medium">
                {limit.timetable_details?.name || limit.timetable}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Entity Type</span>
              <Badge className="bg-purple-100 text-purple-800">
                {ENTITY_TYPE_LABELS[limit.entity_type as keyof typeof ENTITY_TYPE_LABELS]}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Resource Type</span>
              <Badge className="bg-orange-100 text-orange-800">
                {LIMIT_RESOURCE_TYPE_LABELS[limit.resource_type as keyof typeof LIMIT_RESOURCE_TYPE_LABELS]}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Limit Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Maximum Value</span>
              <span className="font-medium text-2xl">{limit.max_value}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Period Type</span>
              <Badge className="bg-cyan-100 text-cyan-800">
                {PERIOD_TYPE_LABELS[limit.period_type as keyof typeof PERIOD_TYPE_LABELS]}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Status</span>
              <Badge variant={limit.is_active ? "default" : "secondary"}>
                {limit.is_active ? "Active" : "Inactive"}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
