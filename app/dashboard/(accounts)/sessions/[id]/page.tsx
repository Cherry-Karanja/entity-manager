/**
 * Session View Page
 * 
 * View a single user session's details.
 * Sessions are read-only - they cannot be edited.
 */

'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { EntityView } from '@/components/entityManager';
import { sessionViewFields } from '@/components/features/accounts/sessions/config';
import { userSessionsApiClient } from '@/components/features/accounts/sessions/api/client';
import { UserSession } from '@/components/features/accounts/types';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Monitor } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

// Define view groups for session detail view
const sessionViewGroups = [
  {
    id: 'basic',
    label: 'User Information',
    description: 'User and session identification',
    fields: ['user_full_name', 'user_email'],
    collapsible: false,
    order: 1,
  },
  {
    id: 'session',
    label: 'Session Details',
    description: 'Session identification and connection info',
    fields: ['ip_address', 'session_key'],
    collapsible: false,
    order: 2,
  },
  {
    id: 'status',
    label: 'Status',
    description: 'Session status information',
    fields: ['is_active', 'is_current_session'],
    collapsible: false,
    order: 3,
  },
  {
    id: 'device',
    label: 'Device Information',
    description: 'Device and browser details',
    fields: ['device_type', 'device_os', 'browser'],
    collapsible: true,
    order: 4,
  },
  {
    id: 'timestamps',
    label: 'Timestamps',
    description: 'Activity and expiration times',
    fields: ['last_activity', 'created_at', 'expires_at'],
    collapsible: true,
    order: 5,
  },
];

export default function SessionViewPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.id as string;
  
  const [session, setSession] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        setLoading(true);
        const response = await userSessionsApiClient.get(sessionId);
        if (response.error) {
          setError(response.error.message);
        } else {
          setSession(response.data);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load session');
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, [sessionId]);

  const handleBack = () => {
    router.push('/dashboard/sessions');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-muted-foreground">Loading session...</div>
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <div className="text-destructive">{error || 'Session not found'}</div>
        <Button onClick={handleBack} variant="outline">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Sessions
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button onClick={handleBack} variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
              <Monitor className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold">Session Details</h1>
                {session.is_active ? (
                  <Badge variant="default" className="bg-green-600 text-white">Active</Badge>
                ) : (
                  <Badge variant="secondary">Expired</Badge>
                )}
                {session.is_current_session && (
                  <Badge variant="outline" className="text-blue-600 border-blue-600">Current Session</Badge>
                )}
              </div>
              <p className="text-muted-foreground">
                {session.user_full_name || session.user_email || 'Unknown User'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Session Details */}
      <EntityView
        entity={session}
        fields={sessionViewFields}
        groups={sessionViewGroups}
        mode="detail"
      />
    </div>
  );
}
