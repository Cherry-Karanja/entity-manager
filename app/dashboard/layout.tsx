"use client";
import { DashboardLayout } from "@/components/layouts/dashboard-layout";
import { ProtectedRoute } from "@/components/auth/lib/protected-route";
import { useAuth } from "@/components/auth/contexts/auth-context";
import { usePathname } from "next/navigation";

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

  const breadcrumbs = generateBreadcrumbs(pathname);

  return (
    <ProtectedRoute>
      <DashboardLayout
        title="Dashboard"
        subtitle="Welcome back! Here's an overview of your entity management system."
        breadcrumbs={breadcrumbs}
        user={{
            first_name: user?.first_name || "John",
            last_name: user?.last_name || "Doe",
            email: user?.email || "john.doe@entitymanager.com",
        }}
        actions={null}
        >
        {children}
      </DashboardLayout>
    </ProtectedRoute>
  );
}