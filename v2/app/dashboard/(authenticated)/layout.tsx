import { DashboardLayout } from "@/components/layouts/dashboard-layout";
import { ProtectedRoute } from "@/components/auth/lib/protected-route";

export default function DashboardLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      {children}
    </ProtectedRoute>
  );
}