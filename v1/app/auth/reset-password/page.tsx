'use client';

import { AuthPage } from '@/features/auth';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

export default function ResetPasswordPage() {
  const router = useRouter();
  return (
    <AuthPage
      initialMode="reset-password"
      onAuthSuccess={ ()=>{ router.push('/auth/login') } }
    />
  );
}
