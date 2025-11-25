/**
 * Room View Page
 */

'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { default as roomClient } from '@/components/features/logx/rooms/api/client';
import { Room, ROOM_TYPE_LABELS } from '@/components/features/logx/types';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function RoomViewPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        setLoading(true);
        const response = await roomClient.get(id);
        if (response.error) {
          setError(response.error.message);
        } else {
          setRoom(response.data);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load room');
      } finally {
        setLoading(false);
      }
    };
    fetchRoom();
  }, [id]);

  const handleBack = () => router.push('/dashboard/scheduling/rooms');
  const handleEdit = () => router.push(`/dashboard/scheduling/rooms/${id}/edit`);

  if (loading) {
    return <div className="flex items-center justify-center h-96"><div className="text-muted-foreground">Loading...</div></div>;
  }

  if (error || !room) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <div className="text-destructive">{error || 'Room not found'}</div>
        <Button variant="outline" onClick={handleBack}><ArrowLeft className="h-4 w-4 mr-2" />Back</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{room.name}</h1>
            <p className="text-muted-foreground">{room.code}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleEdit}>
            <Edit className="h-4 w-4 mr-2" />Edit
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Name</span>
              <span className="font-medium">{room.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Code</span>
              <span className="font-medium">{room.code}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Room Type</span>
              <Badge>{ROOM_TYPE_LABELS[room.room_type as keyof typeof ROOM_TYPE_LABELS] || room.room_type}</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Capacity</span>
              <span className="font-medium">{room.capacity}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Active</span>
              <Badge variant={room.is_active ? "default" : "secondary"}>
                {room.is_active ? "Active" : "Inactive"}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Under Maintenance</span>
              <Badge variant={room.is_under_maintenance ? "destructive" : "default"}>
                {room.is_under_maintenance ? "Yes" : "No"}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {room.description && (
        <Card>
          <CardHeader>
            <CardTitle>Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{room.description}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
