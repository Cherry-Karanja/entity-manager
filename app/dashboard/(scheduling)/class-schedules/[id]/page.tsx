/**
 * Class Schedule View Page
 */

'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { default as classGroupScheduleClient } from '@/components/features/logx/class-group-schedules/api/client';
import { ClassGroupSchedule, DAY_OF_WEEK_LABELS } from '@/components/features/logx/types';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function ClassScheduleViewPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  
  const [schedule, setSchedule] = useState<ClassGroupSchedule | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        setLoading(true);
        const response = await classGroupScheduleClient.get(id);
        if (response.error) {
          setError(response.error.message);
        } else {
          setSchedule(response.data);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load class schedule');
      } finally {
        setLoading(false);
      }
    };
    fetchSchedule();
  }, [id]);

  const handleBack = () => router.push('/dashboard/scheduling/class-schedules');
  const handleEdit = () => router.push(`/dashboard/scheduling/class-schedules/${id}/edit`);

  if (loading) {
    return <div className="flex items-center justify-center h-96"><div className="text-muted-foreground">Loading...</div></div>;
  }

  if (error || !schedule) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <div className="text-destructive">{error || 'Class schedule not found'}</div>
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
            <h1 className="text-2xl font-bold">Class Schedule Details</h1>
            <p className="text-muted-foreground">
              {DAY_OF_WEEK_LABELS[schedule.day_of_week as keyof typeof DAY_OF_WEEK_LABELS]} - {formatTime(schedule.start_time)} to {formatTime(schedule.end_time)}
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
            <CardTitle>Schedule Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Day</span>
              <Badge>{DAY_OF_WEEK_LABELS[schedule.day_of_week as keyof typeof DAY_OF_WEEK_LABELS]}</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Start Time</span>
              <span className="font-medium">{formatTime(schedule.start_time)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">End Time</span>
              <span className="font-medium">{formatTime(schedule.end_time)}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>References</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Timetable</span>
              <span className="font-medium">
                {schedule.timetable_details?.name || schedule.timetable}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Class Group</span>
              <span className="font-medium">
                {schedule.class_group_details?.name || schedule.class_group}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subject</span>
              <span className="font-medium">
                {schedule.subject_details?.name || schedule.subject}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Teacher</span>
              <span className="font-medium">
                {schedule.teacher_details?.name || schedule.teacher}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Room</span>
              <span className="font-medium">
                {schedule.room_details?.name || schedule.room}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
