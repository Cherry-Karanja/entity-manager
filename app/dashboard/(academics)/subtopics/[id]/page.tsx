/**
 * Subtopic View Page
 */

'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { subtopicsApiClient } from '@/components/features/institution/subtopics/api/client';
import { Subtopic } from '@/components/features/institution/types';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function SubtopicViewPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  
  const [subtopic, setSubtopic] = useState<Subtopic | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubtopic = async () => {
      try {
        setLoading(true);
        const response = await subtopicsApiClient.get(id);
        if (response.error) setError(response.error.message);
        else setSubtopic(response.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load subtopic');
      } finally {
        setLoading(false);
      }
    };
    fetchSubtopic();
  }, [id]);

  const handleBack = () => router.push('/dashboard/academics/subtopics');
  const handleEdit = () => router.push(`/dashboard/academics/subtopics/${id}/edit`);

  if (loading) return <div className="flex items-center justify-center h-96"><div className="text-muted-foreground">Loading...</div></div>;
  if (error || !subtopic) return (
    <div className="flex flex-col items-center justify-center h-96 gap-4">
      <div className="text-destructive">{error || 'Subtopic not found'}</div>
      <Button variant="outline" onClick={handleBack}><ArrowLeft className="h-4 w-4 mr-2" />Back</Button>
    </div>
  );

  const typeColors: Record<string, string> = {
    lecture: 'bg-blue-100 text-blue-800',
    practical: 'bg-green-100 text-green-800',
    discussion: 'bg-purple-100 text-purple-800',
    assessment: 'bg-red-100 text-red-800',
    'self-study': 'bg-yellow-100 text-yellow-800',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={handleBack}><ArrowLeft className="h-4 w-4 mr-2" />Back to Subtopics</Button>
        <Button onClick={handleEdit}><Edit className="h-4 w-4 mr-2" />Edit</Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-muted-foreground font-mono mr-2">#{subtopic.order || '-'}</span>
            {subtopic.name}
            {subtopic.content_type && (
              <Badge variant="outline" className={typeColors[subtopic.content_type] || ''}>
                {subtopic.content_type.charAt(0).toUpperCase() + subtopic.content_type.slice(1)}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <div><span className="text-muted-foreground">Topic:</span> <span className="font-medium">{subtopic.topic_name || '-'}</span></div>
          <div><span className="text-muted-foreground">Duration:</span> <span className="font-medium">{subtopic.duration_minutes ? `${subtopic.duration_minutes} minutes` : '-'}</span></div>
          <div className="col-span-2"><span className="text-muted-foreground">Description:</span> <p className="mt-1">{subtopic.description || '-'}</p></div>
          <div className="col-span-2"><span className="text-muted-foreground">Resources:</span> <p className="mt-1 whitespace-pre-wrap">{subtopic.resources || '-'}</p></div>
        </CardContent>
      </Card>
    </div>
  );
}
