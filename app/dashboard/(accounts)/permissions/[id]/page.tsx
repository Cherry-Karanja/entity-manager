/**
 * Permission Detail Page
 * 
 * View details of a specific permission.
 */

'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { permissionsApiClient, Permission } from '@/components/features/accounts/permissions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Shield, Code, Box, AppWindow } from 'lucide-react';
import { Loader2 } from 'lucide-react';

export default function PermissionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  
  const [permission, setPermission] = useState<Permission | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPermission = async () => {
      try {
        setLoading(true);
        const response = await permissionsApiClient.get(id);
        if (response.data) {
          setPermission(response.data);
        } else if (response.error) {
          setError(response.error.message || 'Failed to load permission');
        }
      } catch (err) {
        console.error('Failed to fetch permission:', err);
        setError('Failed to load permission details');
      } finally {
        setLoading(false);
      }
    };

    fetchPermission();
  }, [id]);

  const handleBack = () => router.push('/dashboard/permissions');

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-3">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <span className="text-muted-foreground">Loading permission...</span>
        </div>
      </div>
    );
  }

  if (error || !permission) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="text-destructive">{error || 'Permission not found'}</div>
        <Button variant="outline" onClick={handleBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Permissions
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={handleBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            {permission.name}
          </h1>
          <p className="text-muted-foreground">
            Permission details and usage information
          </p>
        </div>
      </div>

      {/* Permission Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="h-5 w-5" />
              Permission Information
            </CardTitle>
            <CardDescription>
              Technical details about this permission
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Name</label>
              <p className="text-lg font-medium">{permission.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Codename</label>
              <p>
                <code className="bg-muted px-2 py-1 rounded text-sm">
                  {permission.codename}
                </code>
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Full Permission String</label>
              <p>
                <code className="bg-muted px-2 py-1 rounded text-sm">
                  {permission.app_label}.{permission.codename}
                </code>
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Box className="h-5 w-5" />
              Model Information
            </CardTitle>
            <CardDescription>
              The Django model this permission applies to
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">App Label</label>
              <p className="flex items-center gap-2">
                <Badge variant="outline" className="capitalize">
                  <AppWindow className="h-3 w-3 mr-1" />
                  {permission.app_label}
                </Badge>
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Model</label>
              <p className="capitalize font-medium">{permission.model}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Content Type</label>
              <p className="text-muted-foreground">
                {permission.content_type_name || `${permission.app_label} | ${permission.model}`}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Usage Information */}
      <Card>
        <CardHeader>
          <CardTitle>Usage Information</CardTitle>
          <CardDescription>
            How to use this permission in your application
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">In Django Views</h4>
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
              <code>{`@permission_required('${permission.app_label}.${permission.codename}')
def my_view(request):
    # Your view code here
    pass`}</code>
            </pre>
          </div>
          <div>
            <h4 className="font-medium mb-2">In Django Templates</h4>
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
              <code>{`{% if perms.${permission.app_label}.${permission.codename} %}
    <!-- Content for users with this permission -->
{% endif %}`}</code>
            </pre>
          </div>
          <div>
            <h4 className="font-medium mb-2">Check Programmatically</h4>
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
              <code>{`user.has_perm('${permission.app_label}.${permission.codename}')`}</code>
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
