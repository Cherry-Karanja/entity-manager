/**
 * Unit View Page
 */

'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { unitsApiClient } from '@/components/features/institution/units/api/client';
import { Unit } from '@/components/features/institution/types';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function UnitViewPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  
  const [unit, setUnit] = useState<Unit | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUnit = async () => {
      try {
        setLoading(true);
        const response = await unitsApiClient.get(id);
        if (response.error) setError(response.error.message);
        else setUnit(response.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load unit');
      } finally {
        setLoading(false);
      }
    };
    fetchUnit();
  }, [id]);

  const handleBack = () => router.push('/dashboard/academics/units');
  const handleEdit = () => router.push(`/dashboard/academics/units/${id}/edit`);

  if (loading) return <div className="flex items-center justify-center h-96"><div className="text-muted-foreground">Loading...</div></div>;
  if (error || !unit) return (
    <div className="flex flex-col items-center justify-center h-96 gap-4">
      <div className="text-destructive">{error || 'Unit not found'}</div>
      <Button variant="outline" onClick={handleBack}><ArrowLeft className="h-4 w-4 mr-2" />Back</Button>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={handleBack}><ArrowLeft className="h-4 w-4 mr-2" />Back to Units</Button>
        <Button onClick={handleEdit}><Edit className="h-4 w-4 mr-2" />Edit</Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {unit.name}
            <Badge variant={unit.is_active ? 'default' : 'secondary'}>{unit.is_active ? 'Active' : 'Inactive'}</Badge>
            {unit.is_core && <Badge variant="outline">Core</Badge>}
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <div><span className="text-muted-foreground">Code:</span> <span className="font-medium">{unit.code}</span></div>
          <div><span className="text-muted-foreground">Credits:</span> <span className="font-medium">{unit.credits}</span></div>
          <div><span className="text-muted-foreground">Programme:</span> <span className="font-medium">{unit.programme_name || '-'}</span></div>
          <div><span className="text-muted-foreground">Level:</span> <span className="font-medium">{unit.level || '-'}</span></div>
          <div><span className="text-muted-foreground">Term:</span> <span className="font-medium">{unit.term_number || '-'}</span></div>
          <div><span className="text-muted-foreground">Topics:</span> <span className="font-medium">{unit.topic_count || 0}</span></div>
          <div className="col-span-2"><span className="text-muted-foreground">Description:</span> <p className="mt-1">{unit.description || '-'}</p></div>
          <div className="col-span-2"><span className="text-muted-foreground">Learning Outcomes:</span> <p className="mt-1 whitespace-pre-wrap">{unit.learning_outcomes || '-'}</p></div>
        </CardContent>
      </Card>
    </div>
  );
}
