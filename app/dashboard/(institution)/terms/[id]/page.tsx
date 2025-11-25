/**
 * Term View Page
 */

'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { termsApiClient } from '@/components/features/institution/terms/api/client';
import { Term } from '@/components/features/institution/types';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function TermViewPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  
  const [term, setTerm] = useState<Term | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTerm = async () => {
      try {
        setLoading(true);
        const response = await termsApiClient.get(id);
        if (response.error) setError(response.error.message);
        else setTerm(response.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load term');
      } finally {
        setLoading(false);
      }
    };
    fetchTerm();
  }, [id]);

  const handleBack = () => router.push('/dashboard/institution/terms');
  const handleEdit = () => router.push(`/dashboard/institution/terms/${id}/edit`);

  if (loading) return <div className="flex items-center justify-center h-96"><div className="text-muted-foreground">Loading...</div></div>;
  if (error || !term) return (
    <div className="flex flex-col items-center justify-center h-96 gap-4">
      <div className="text-destructive">{error || 'Term not found'}</div>
      <Button variant="outline" onClick={handleBack}><ArrowLeft className="h-4 w-4 mr-2" />Back</Button>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={handleBack}><ArrowLeft className="h-4 w-4 mr-2" />Back to Terms</Button>
        <Button onClick={handleEdit}><Edit className="h-4 w-4 mr-2" />Edit</Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Term {term.term_number}
            <Badge variant={term.is_active ? 'default' : 'secondary'}>{term.is_active ? 'Active' : 'Inactive'}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <div><span className="text-muted-foreground">Term Number:</span> <span className="font-medium">{term.term_number}</span></div>
          <div><span className="text-muted-foreground">Academic Year:</span> <span className="font-medium">{term.academic_year_name || '-'}</span></div>
          <div><span className="text-muted-foreground">Start Date:</span> <span className="font-medium">{term.start_date ? new Date(term.start_date).toLocaleDateString() : '-'}</span></div>
          <div><span className="text-muted-foreground">End Date:</span> <span className="font-medium">{term.end_date ? new Date(term.end_date).toLocaleDateString() : '-'}</span></div>
        </CardContent>
      </Card>
    </div>
  );
}
