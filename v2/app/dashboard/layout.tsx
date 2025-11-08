import { DashboardLayout } from "@/components/layouts/dashboard-layout";
import { ProtectedRoute } from "@/components/auth/protected-route";

export default function DashboardLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
         <DashboardLayout
        title="Dashboard"
        subtitle="Welcome back! Here's an overview of your entity management system."
        breadcrumbs={[{ label: "Dashboard" }]}
        user={{
            first_name: "John",
            last_name: "Doe",
            email: "john.doe@entitymanager.com",
        }}
        >
        {children}
        </DashboardLayout>
    </ProtectedRoute>
  );
}