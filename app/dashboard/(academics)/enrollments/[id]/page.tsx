/**
 * Enrollment View Page
 */

'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { enrollmentsApiClient } from '@/components/features/institution/enrollments/api/client';
import { Enrollment } from '@/components/features/institution/types';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function EnrollmentViewPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEnrollment = async () => {
      try {
        setLoading(true);
        const response = await enrollmentsApiClient.get(id);
        if (response.error) setError(response.error.message);
        else setEnrollment(response.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load enrollment');
      } finally {
        setLoading(false);
      }
    };
    fetchEnrollment();
  }, [id]);

  const handleBack = () => router.push('/dashboard/academics/enrollments');
  const handleEdit = () => router.push(`/dashboard/academics/enrollments/${id}/edit`);

  if (loading) return <div className="flex items-center justify-center h-96"><div className="text-muted-foreground">Loading...</div></div>;
  if (error || !enrollment) return (
    <div className="flex flex-col items-center justify-center h-96 gap-4">
      <div className="text-destructive">{error || 'Enrollment not found'}</div>
      <Button variant="outline" onClick={handleBack}><ArrowLeft className="h-4 w-4 mr-2" />Back</Button>
    </div>
  );

  const statusColors: Record<string, string> = {
    active: 'bg-green-100 text-green-800',
    completed: 'bg-blue-100 text-blue-800',
    withdrawn: 'bg-red-100 text-red-800',
    suspended: 'bg-orange-100 text-orange-800',
    deferred: 'bg-yellow-100 text-yellow-800',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={handleBack}><ArrowLeft className="h-4 w-4 mr-2" />Back to Enrollments</Button>
        <Button onClick={handleEdit}><Edit className="h-4 w-4 mr-2" />Edit</Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {enrollment.trainee_name}
            <Badge variant="outline" className={statusColors[enrollment.status] || ''}>
              {enrollment.status.charAt(0).toUpperCase() + enrollment.status.slice(1)}
            </Badge>
            <Badge variant={enrollment.is_active ? 'default' : 'secondary'}>
              {enrollment.is_active ? 'Active' : 'Inactive'}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <div><span className="text-muted-foreground">Class Group:</span> <span className="font-medium">{enrollment.class_group_name || '-'}</span></div>
          <div><span className="text-muted-foreground">Enrollment Date:</span> <span className="font-medium">{enrollment.enrollment_date ? new Date(enrollment.enrollment_date).toLocaleDateString() : '-'}</span></div>
          <div><span className="text-muted-foreground">Grade:</span> <span className="font-medium">{enrollment.grade || '-'}</span></div>
          <div><span className="text-muted-foreground">Status:</span> <span className="font-medium">{enrollment.status}</span></div>
          <div className="col-span-2"><span className="text-muted-foreground">Notes:</span> <p className="mt-1">{enrollment.notes || '-'}</p></div>
        </CardContent>
      </Card>
    </div>
  );
}
