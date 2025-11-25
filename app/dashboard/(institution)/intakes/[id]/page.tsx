/**
 * Intake View Page
 */

'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { intakesApiClient } from '@/components/features/institution/intakes/api/client';
import { Intake } from '@/components/features/institution/types';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function IntakeViewPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  
  const [intake, setIntake] = useState<Intake | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchIntake = async () => {
      try {
        setLoading(true);
        const response = await intakesApiClient.get(id);
        if (response.error) setError(response.error.message);
        else setIntake(response.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load intake');
      } finally {
        setLoading(false);
      }
    };
    fetchIntake();
  }, [id]);

  const handleBack = () => router.push('/dashboard/institution/intakes');
  const handleEdit = () => router.push(`/dashboard/institution/intakes/${id}/edit`);

  if (loading) return <div className="flex items-center justify-center h-96"><div className="text-muted-foreground">Loading...</div></div>;
  if (error || !intake) return (
    <div className="flex flex-col items-center justify-center h-96 gap-4">
      <div className="text-destructive">{error || 'Intake not found'}</div>
      <Button variant="outline" onClick={handleBack}><ArrowLeft className="h-4 w-4 mr-2" />Back</Button>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={handleBack}><ArrowLeft className="h-4 w-4 mr-2" />Back to Intakes</Button>
        <Button onClick={handleEdit}><Edit className="h-4 w-4 mr-2" />Edit</Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {intake.name}
            <Badge variant={intake.is_active ? 'default' : 'secondary'}>{intake.is_active ? 'Active' : 'Inactive'}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <div><span className="text-muted-foreground">Code:</span> <span className="font-medium">{intake.code}</span></div>
          <div><span className="text-muted-foreground">Academic Year:</span> <span className="font-medium">{intake.academic_year_name || '-'}</span></div>
          <div><span className="text-muted-foreground">Start Date:</span> <span className="font-medium">{intake.start_date ? new Date(intake.start_date).toLocaleDateString() : '-'}</span></div>
          <div><span className="text-muted-foreground">End Date:</span> <span className="font-medium">{intake.end_date ? new Date(intake.end_date).toLocaleDateString() : '-'}</span></div>
          <div className="col-span-2"><span className="text-muted-foreground">Description:</span> <p className="mt-1">{intake.description || '-'}</p></div>
        </CardContent>
      </Card>
    </div>
  );
}
