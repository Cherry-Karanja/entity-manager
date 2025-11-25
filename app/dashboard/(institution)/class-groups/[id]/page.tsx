/**
 * Class Group View Page
 */

'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { classGroupsApiClient } from '@/components/features/institution/class-groups/api/client';
import { ClassGroup } from '@/components/features/institution/types';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function ClassGroupViewPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  
  const [classGroup, setClassGroup] = useState<ClassGroup | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClassGroup = async () => {
      try {
        setLoading(true);
        const response = await classGroupsApiClient.get(id);
        if (response.error) setError(response.error.message);
        else setClassGroup(response.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load class group');
      } finally {
        setLoading(false);
      }
    };
    fetchClassGroup();
  }, [id]);

  const handleBack = () => router.push('/dashboard/institution/class-groups');
  const handleEdit = () => router.push(`/dashboard/institution/class-groups/${id}/edit`);

  if (loading) return <div className="flex items-center justify-center h-96"><div className="text-muted-foreground">Loading...</div></div>;
  if (error || !classGroup) return (
    <div className="flex flex-col items-center justify-center h-96 gap-4">
      <div className="text-destructive">{error || 'Class group not found'}</div>
      <Button variant="outline" onClick={handleBack}><ArrowLeft className="h-4 w-4 mr-2" />Back</Button>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={handleBack}><ArrowLeft className="h-4 w-4 mr-2" />Back to Class Groups</Button>
        <Button onClick={handleEdit}><Edit className="h-4 w-4 mr-2" />Edit</Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {classGroup.name}
            <Badge variant={classGroup.is_active ? 'default' : 'secondary'}>{classGroup.is_active ? 'Active' : 'Inactive'}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <div><span className="text-muted-foreground">Programme:</span> <span className="font-medium">{classGroup.programme_name || '-'}</span></div>
          <div><span className="text-muted-foreground">Curriculum Code:</span> <span className="font-medium">{classGroup.cirriculum_code || '-'}</span></div>
          <div><span className="text-muted-foreground">Year:</span> <span className="font-medium">{classGroup.year || '-'}</span></div>
          <div><span className="text-muted-foreground">Term:</span> <span className="font-medium">{classGroup.term_number || '-'}</span></div>
          <div><span className="text-muted-foreground">Intake:</span> <span className="font-medium">{classGroup.intake_name || '-'}</span></div>
          <div><span className="text-muted-foreground">Trainee Count:</span> <span className="font-medium">{classGroup.trainee_count || 0}</span></div>
        </CardContent>
      </Card>
    </div>
  );
}
