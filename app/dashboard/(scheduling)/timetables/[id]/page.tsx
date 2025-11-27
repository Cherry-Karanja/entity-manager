"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { default as timetableClient } from '@/components/features/logx/timetables/api/client';
import { Timetable } from '@/components/features/logx/types';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function TimetableViewPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  
  const [timetable, setTimetable] = useState<Timetable | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTimetable = async () => {
      try {
        setLoading(true);
        const response = await timetableClient.get(id);
        if (response.error) {
          setError(response.error.message);
        } else {
          setTimetable(response.data);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load timetable');
      } finally {
        setLoading(false);
      }
    };
    fetchTimetable();
  }, [id]);

  const handleBack = () => router.push('/dashboard/timetables');
  const handleEdit = () => router.push(`/dashboard/timetables/${id}/editor`);

  if (loading) {
    return <div className="flex items-center justify-center h-96"><div className="text-muted-foreground">Loading...</div></div>;
  }

  if (error || !timetable) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <div className="text-destructive">{error || 'Timetable not found'}</div>
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
            <h1 className="text-2xl font-bold">{timetable.name}</h1>
            <p className="text-muted-foreground">Timetable Details</p>
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
              <span className="font-medium">{timetable.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Academic Year</span>
              <span className="font-medium">
                {timetable.academic_year_details?.name || timetable.academic_year}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Term</span>
              <span className="font-medium">
                {timetable.term_details?.name || timetable.term}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Active</span>
              <Badge variant={timetable.is_active ? "default" : "secondary"}>
                {timetable.is_active ? "Active" : "Inactive"}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Published</span>
              <Badge variant={timetable.is_published ? "default" : "secondary"}>
                {timetable.is_published ? "Published" : "Draft"}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Created</span>
              <span className="font-medium">
                {timetable.created_at ? new Date(timetable.created_at).toLocaleDateString() : '-'}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {timetable.description && (
        <Card>
          <CardHeader>
            <CardTitle>Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{timetable.description}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
