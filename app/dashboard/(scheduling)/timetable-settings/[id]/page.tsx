/**
 * Timetable Setting View Page
 */

'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { default as timetableSettingClient } from '@/components/features/logx/timetable-settings/api/client';
import { TimetableSetting } from '@/components/features/logx/types';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function TimetableSettingViewPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  
  const [setting, setSetting] = useState<TimetableSetting | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSetting = async () => {
      try {
        setLoading(true);
        const response = await timetableSettingClient.get(id);
        if (response.error) {
          setError(response.error.message);
        } else {
          setSetting(response.data);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load timetable setting');
      } finally {
        setLoading(false);
      }
    };
    fetchSetting();
  }, [id]);

  const handleBack = () => router.push('/dashboard/scheduling/timetable-settings');
  const handleEdit = () => router.push(`/dashboard/scheduling/timetable-settings/${id}/edit`);

  if (loading) {
    return <div className="flex items-center justify-center h-96"><div className="text-muted-foreground">Loading...</div></div>;
  }

  if (error || !setting) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <div className="text-destructive">{error || 'Timetable setting not found'}</div>
        <Button variant="outline" onClick={handleBack}><ArrowLeft className="h-4 w-4 mr-2" />Back</Button>
      </div>
    );
  }

  const formatConfig = (config: Record<string, unknown> | undefined) => {
    if (!config) return '-';
    return JSON.stringify(config, null, 2);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{setting.name}</h1>
            <p className="text-muted-foreground">Timetable Setting</p>
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
              <span className="font-medium">{setting.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Is Default</span>
              <Badge variant={setting.is_default ? "default" : "secondary"}>
                {setting.is_default ? "Default" : "Custom"}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Time Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Periods per Day</span>
              <span className="font-medium">{setting.periods_per_day}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Days per Week</span>
              <span className="font-medium">{setting.days_per_week}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Period Duration</span>
              <span className="font-medium">{setting.period_duration} minutes</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Break Duration</span>
              <span className="font-medium">{setting.break_duration} minutes</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {setting.config && Object.keys(setting.config).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Configuration</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-muted p-4 rounded-md text-sm overflow-auto">
              {formatConfig(setting.config)}
            </pre>
          </CardContent>
        </Card>
      )}

      {setting.description && (
        <Card>
          <CardHeader>
            <CardTitle>Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{setting.description}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
