"use client"

import React from 'react';
import { useAuth } from "@/contexts/auth-context";

const HomePage = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If user is authenticated, redirect to dashboard
  if (isAuthenticated) {
    window.location.href = '/dashboard';
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to App Name</h1>
        <p className="text-lg text-muted-foreground mb-8">Your management platform</p>
        <a href="/auth" className="bg-primary text-primary-foreground px-6 py-2 rounded-md hover:bg-primary/90">
          Get Started
        </a>
      </div>
    </div>
  );
};

export default HomePage;
