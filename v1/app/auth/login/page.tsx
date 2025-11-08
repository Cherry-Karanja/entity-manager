'use client';

import { AuthPage } from '@/features/auth';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/dashboard';

  return (
    <AuthPage
      initialMode="login"
      onAuthSuccess={() => { 
        console.log('Login successful'); 
        router.push(redirectTo);
      }}
    />
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginPageContent />
    </Suspense>
  );
}