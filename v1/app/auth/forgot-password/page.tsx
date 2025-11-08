'use client';

import { AuthPage } from '@/features/auth';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

export default function ForgotPasswordPage() {
  const router = useRouter();
  return (
    <AuthPage
      initialMode="forgot-password"
      onAuthSuccess={ ()=>{ router.push('/auth/login') } }
    />
  );
}
