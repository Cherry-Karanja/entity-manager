/**
 * Login Attempt View Page
 * 
 * View a single login attempt's details.
 * Login attempts are read-only audit logs - they cannot be edited.
 */

'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { EntityView } from '@/components/entityManager';
import { loginAttemptViewFields } from '@/components/features/accounts/login-attempts/config';
import { loginAttemptsApiClient } from '@/components/features/accounts/login-attempts/api/client';
import { LoginAttempt } from '@/components/features/accounts/types';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ShieldAlert, CheckCircle, XCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

// Define view groups for login attempt detail view
const loginAttemptViewGroups = [
  {
    id: 'basic',
    label: 'Attempt Information',
    description: 'Basic login attempt details',
    fields: ['success', 'email', 'user_full_name'],
    collapsible: false,
    order: 1,
  },
  {
    id: 'details',
    label: 'Connection Details',
    description: 'IP address and failure information',
    fields: ['ip_address', 'user_agent', 'failure_reason'],
    collapsible: false,
    order: 2,
  },
  {
    id: 'device',
    label: 'Device Information',
    description: 'Device and browser details',
    fields: ['device_type', 'device_os', 'browser'],
    collapsible: true,
    order: 3,
  },
  {
    id: 'timestamps',
    label: 'Timestamp',
    description: 'When the attempt occurred',
    fields: ['created_at'],
    collapsible: true,
    order: 4,
  },
];

export default function LoginAttemptViewPage() {
  const params = useParams();
  const router = useRouter();
  const attemptId = params.id as string;
  
  const [attempt, setAttempt] = useState<LoginAttempt | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAttempt = async () => {
      try {
        setLoading(true);
        const response = await loginAttemptsApiClient.get(attemptId);
        if (response.error) {
          setError(response.error.message);
        } else {
          setAttempt(response.data);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load login attempt');
      } finally {
        setLoading(false);
      }
    };

    fetchAttempt();
  }, [attemptId]);

  const handleBack = () => {
    router.push('/dashboard/login-attempts');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-muted-foreground">Loading login attempt...</div>
      </div>
    );
  }

  if (error || !attempt) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <div className="text-destructive">{error || 'Login attempt not found'}</div>
        <Button onClick={handleBack} variant="outline">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Login Attempts
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
            <div className={`p-2 rounded-lg ${attempt.success ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'}`}>
              <ShieldAlert className={`h-5 w-5 ${attempt.success ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold">Login Attempt Details</h1>
                {attempt.success ? (
                  <Badge variant="default" className="bg-green-600 text-white">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Successful
                  </Badge>
                ) : (
                  <Badge variant="destructive">
                    <XCircle className="h-3 w-3 mr-1" />
                    Failed
                  </Badge>
                )}
              </div>
              <p className="text-muted-foreground">
                {attempt.email || 'Unknown Email'} • {attempt.ip_address}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Login Attempt Details */}
      <EntityView
        entity={attempt}
        fields={loginAttemptViewFields}
        groups={loginAttemptViewGroups}
        mode="detail"
      />
    </div>
  );
}
