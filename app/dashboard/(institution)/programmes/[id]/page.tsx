/**
 * Programme View Page
 */

'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { programmesApiClient } from '@/components/features/institution/programmes/api/client';
import { Programme } from '@/components/features/institution/types';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ProgrammeViewPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  
  const [programme, setProgramme] = useState<Programme | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProgramme = async () => {
      try {
        setLoading(true);
        const response = await programmesApiClient.get(id);
        if (response.error) setError(response.error.message);
        else setProgramme(response.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load programme');
      } finally {
        setLoading(false);
      }
    };
    fetchProgramme();
  }, [id]);

  const handleBack = () => router.push('/dashboard/institution/programmes');
  const handleEdit = () => router.push(`/dashboard/institution/programmes/${id}/edit`);

  if (loading) return <div className="flex items-center justify-center h-96"><div className="text-muted-foreground">Loading...</div></div>;
  if (error || !programme) return (
    <div className="flex flex-col items-center justify-center h-96 gap-4">
      <div className="text-destructive">{error || 'Programme not found'}</div>
      <Button variant="outline" onClick={handleBack}><ArrowLeft className="h-4 w-4 mr-2" />Back</Button>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={handleBack}><ArrowLeft className="h-4 w-4 mr-2" />Back to Programmes</Button>
        <Button onClick={handleEdit}><Edit className="h-4 w-4 mr-2" />Edit</Button>
      </div>
      <Card>
        <CardHeader><CardTitle>{programme.name}</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <div><span className="text-muted-foreground">Code:</span> <span className="font-medium">{programme.code}</span></div>
          <div><span className="text-muted-foreground">Level:</span> <span className="font-medium">{programme.level}</span></div>
          <div><span className="text-muted-foreground">Department:</span> <span className="font-medium">{programme.department_name || '-'}</span></div>
          <div className="col-span-2"><span className="text-muted-foreground">Description:</span> <p className="mt-1">{programme.description || '-'}</p></div>
        </CardContent>
      </Card>
    </div>
  );
}
