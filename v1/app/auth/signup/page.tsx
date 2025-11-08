'use client';

import { AuthPage } from '@/features/auth';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

export default function SignUpPage() {
  const router = useRouter();
  return (
    <AuthPage
      initialMode="register"
      onAuthSuccess={()=>{ router.push('/dashboard'); console.log('Registration successful'); }}
    />
  );
}
