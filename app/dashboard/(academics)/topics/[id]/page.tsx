/**
 * Topic View Page
 */

'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { topicsApiClient } from '@/components/features/institution/topics/api/client';
import { Topic } from '@/components/features/institution/types';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function TopicViewPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  
  const [topic, setTopic] = useState<Topic | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTopic = async () => {
      try {
        setLoading(true);
        const response = await topicsApiClient.get(id);
        if (response.error) setError(response.error.message);
        else setTopic(response.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load topic');
      } finally {
        setLoading(false);
      }
    };
    fetchTopic();
  }, [id]);

  const handleBack = () => router.push('/dashboard/academics/topics');
  const handleEdit = () => router.push(`/dashboard/academics/topics/${id}/edit`);

  if (loading) return <div className="flex items-center justify-center h-96"><div className="text-muted-foreground">Loading...</div></div>;
  if (error || !topic) return (
    <div className="flex flex-col items-center justify-center h-96 gap-4">
      <div className="text-destructive">{error || 'Topic not found'}</div>
      <Button variant="outline" onClick={handleBack}><ArrowLeft className="h-4 w-4 mr-2" />Back</Button>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={handleBack}><ArrowLeft className="h-4 w-4 mr-2" />Back to Topics</Button>
        <Button onClick={handleEdit}><Edit className="h-4 w-4 mr-2" />Edit</Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Badge variant="outline" className="mr-2">#{topic.order || '-'}</Badge>
            {topic.name}
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <div><span className="text-muted-foreground">Unit:</span> <span className="font-medium">{topic.unit_name || '-'}</span></div>
          <div><span className="text-muted-foreground">Duration:</span> <span className="font-medium">{topic.duration_hours ? `${topic.duration_hours} hours` : '-'}</span></div>
          <div><span className="text-muted-foreground">Weight:</span> <span className="font-medium">{topic.weight ? `${topic.weight}%` : '-'}</span></div>
          <div><span className="text-muted-foreground">Subtopics:</span> <span className="font-medium">{topic.subtopic_count || 0}</span></div>
          <div className="col-span-2"><span className="text-muted-foreground">Description:</span> <p className="mt-1">{topic.description || '-'}</p></div>
          <div className="col-span-2"><span className="text-muted-foreground">Learning Objectives:</span> <p className="mt-1 whitespace-pre-wrap">{topic.learning_objectives || '-'}</p></div>
        </CardContent>
      </Card>
    </div>
  );
}
