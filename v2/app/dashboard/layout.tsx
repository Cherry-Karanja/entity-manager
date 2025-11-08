import { DashboardLayout } from "@/components/layouts/dashboard-layout";

export default function DashboardLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
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
  );
}