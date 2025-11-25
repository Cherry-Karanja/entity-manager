/**
 * Academic Year View Page
 */

'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { academicYearsApiClient } from '@/components/features/institution/academic-years/api/client';
import { AcademicYear } from '@/components/features/institution/types';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function AcademicYearViewPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  
  const [academicYear, setAcademicYear] = useState<AcademicYear | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAcademicYear = async () => {
      try {
        setLoading(true);
        const response = await academicYearsApiClient.get(id);
        if (response.error) setError(response.error.message);
        else setAcademicYear(response.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load academic year');
      } finally {
        setLoading(false);
      }
    };
    fetchAcademicYear();
  }, [id]);

  const handleBack = () => router.push('/dashboard/institution/academic-years');
  const handleEdit = () => router.push(`/dashboard/institution/academic-years/${id}/edit`);

  if (loading) return <div className="flex items-center justify-center h-96"><div className="text-muted-foreground">Loading...</div></div>;
  if (error || !academicYear) return (
    <div className="flex flex-col items-center justify-center h-96 gap-4">
      <div className="text-destructive">{error || 'Academic year not found'}</div>
      <Button variant="outline" onClick={handleBack}><ArrowLeft className="h-4 w-4 mr-2" />Back</Button>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={handleBack}><ArrowLeft className="h-4 w-4 mr-2" />Back to Academic Years</Button>
        <Button onClick={handleEdit}><Edit className="h-4 w-4 mr-2" />Edit</Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {academicYear.year}
            <Badge variant={academicYear.is_active ? 'default' : 'secondary'}>{academicYear.is_active ? 'Active' : 'Inactive'}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <div><span className="text-muted-foreground">Year:</span> <span className="font-medium">{academicYear.year}</span></div>
          <div><span className="text-muted-foreground">Status:</span> <span className="font-medium">{academicYear.is_active ? 'Active' : 'Inactive'}</span></div>
        </CardContent>
      </Card>
    </div>
  );
}
