/**
 * Department View Page
 */

'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { departmentsApiClient } from '@/components/features/institution/departments/api/client';
import { Department } from '@/components/features/institution/types';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function DepartmentViewPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  
  const [department, setDepartment] = useState<Department | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDepartment = async () => {
      try {
        setLoading(true);
        const response = await departmentsApiClient.get(id);
        if (response.error) {
          setError(response.error.message);
        } else {
          setDepartment(response.data);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load department');
      } finally {
        setLoading(false);
      }
    };
    fetchDepartment();
  }, [id]);

  const handleBack = () => router.push('/dashboard/institution/departments');
  const handleEdit = () => router.push(`/dashboard/institution/departments/${id}/edit`);

  if (loading) {
    return <div className="flex items-center justify-center h-96"><div className="text-muted-foreground">Loading...</div></div>;
  }

  if (error || !department) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <div className="text-destructive">{error || 'Department not found'}</div>
        <Button variant="outline" onClick={handleBack}><ArrowLeft className="h-4 w-4 mr-2" />Back</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={handleBack}><ArrowLeft className="h-4 w-4 mr-2" />Back to Departments</Button>
        <Button onClick={handleEdit}><Edit className="h-4 w-4 mr-2" />Edit</Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {department.name}
            <Badge variant={department.is_active ? 'default' : 'secondary'}>{department.is_active ? 'Active' : 'Inactive'}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <div><span className="text-muted-foreground">Code:</span> <span className="font-medium">{department.code}</span></div>
          <div><span className="text-muted-foreground">HOD:</span> <span className="font-medium">{department.hod_name || '-'}</span></div>
          <div className="col-span-2"><span className="text-muted-foreground">Description:</span> <p className="mt-1">{department.description || '-'}</p></div>
        </CardContent>
      </Card>
    </div>
  );
}
