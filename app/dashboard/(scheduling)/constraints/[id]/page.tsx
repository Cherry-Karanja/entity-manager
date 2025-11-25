/**
 * Constraint View Page
 */

'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { default as timetableConstraintClient } from '@/components/features/logx/timetable-constraints/api/client';
import { TimetableConstraint, CONSTRAINT_TYPE_LABELS } from '@/components/features/logx/types';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function ConstraintViewPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  
  const [constraint, setConstraint] = useState<TimetableConstraint | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchConstraint = async () => {
      try {
        setLoading(true);
        const response = await timetableConstraintClient.get(id);
        if (response.error) {
          setError(response.error.message);
        } else {
          setConstraint(response.data);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load constraint');
      } finally {
        setLoading(false);
      }
    };
    fetchConstraint();
  }, [id]);

  const handleBack = () => router.push('/dashboard/scheduling/constraints');
  const handleEdit = () => router.push(`/dashboard/scheduling/constraints/${id}/edit`);

  if (loading) {
    return <div className="flex items-center justify-center h-96"><div className="text-muted-foreground">Loading...</div></div>;
  }

  if (error || !constraint) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <div className="text-destructive">{error || 'Constraint not found'}</div>
        <Button variant="outline" onClick={handleBack}><ArrowLeft className="h-4 w-4 mr-2" />Back</Button>
      </div>
    );
  }

  const formatParameters = (params: Record<string, unknown> | undefined) => {
    if (!params) return '-';
    return JSON.stringify(params, null, 2);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{constraint.name}</h1>
            <p className="text-muted-foreground">
              {CONSTRAINT_TYPE_LABELS[constraint.constraint_type as keyof typeof CONSTRAINT_TYPE_LABELS]}
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
              <span className="font-medium">{constraint.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Type</span>
              <Badge>{CONSTRAINT_TYPE_LABELS[constraint.constraint_type as keyof typeof CONSTRAINT_TYPE_LABELS]}</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Timetable</span>
              <span className="font-medium">
                {constraint.timetable_details?.name || constraint.timetable}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Priority & Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Priority</span>
              <span className="font-medium text-lg">{constraint.priority}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Status</span>
              <Badge variant={constraint.is_active ? "default" : "secondary"}>
                {constraint.is_active ? "Active" : "Inactive"}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {constraint.parameters && Object.keys(constraint.parameters).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Parameters</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-muted p-4 rounded-md text-sm overflow-auto">
              {formatParameters(constraint.parameters)}
            </pre>
          </CardContent>
        </Card>
      )}

      {constraint.description && (
        <Card>
          <CardHeader>
            <CardTitle>Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{constraint.description}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
