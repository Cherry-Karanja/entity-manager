"use client";
import { DashboardLayout } from "@/components/layouts/dashboard-layout";
import { ProtectedRoute } from "@/components/auth/lib/protected-route";
import { useAuth } from "@/components/auth/contexts/auth-context";
import { usePathname } from "next/navigation";
import React, { createContext, useContext, useState, ReactNode } from "react";

// Context for child pages to pass actions up to layout
interface PageActionsContext {
  setPageActions: (actions: ReactNode) => void;
}

const PageActionsContext = createContext<PageActionsContext | undefined>(undefined);

export const usePageActions = () => {
  const context = useContext(PageActionsContext);
  if (!context) {
    throw new Error('usePageActions must be used within DashboardLayoutWrapper');
  }
  return context;
};

const generateBreadcrumbs = (pathname: string) => {
  const segments = pathname.split('/').filter(Boolean);
  return segments.map((segment, index) => {
    const href = '/' + segments.slice(0, index + 1).join('/');
    const label = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');
    return { label, href };
  });
};

export default function DashboardLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  const pathname = usePathname();
  const [pageActions, setPageActions] = useState<ReactNode>(null);

  const breadcrumbs = generateBreadcrumbs(pathname);

  return (
    <ProtectedRoute>
      <PageActionsContext.Provider value={{ setPageActions }}>
        <DashboardLayout
          title="Dashboard"
          subtitle="Welcome back! Here's an overview of your entity management system."
          breadcrumbs={breadcrumbs}
          user={{
              first_name: user?.first_name || "John",
              last_name: user?.last_name || "Doe",
              email: user?.email || "john.doe@entitymanager.com",
          }}
          actions={pageActions}
          >
          {children}
        </DashboardLayout>
      </PageActionsContext.Provider>
    </ProtectedRoute>
  );
}