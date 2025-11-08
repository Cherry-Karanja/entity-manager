import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Database,
  Users,
  BarChart3,
  Shield,
  TrendingUp,
  Activity,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

export default function DashboardPage() {
  const stats = [
    {
      title: "Total Entities",
      value: "1,234",
      change: "+12%",
      changeType: "positive" as const,
      icon: Database,
    },
    {
      title: "Active Users",
      value: "89",
      change: "+5%",
      changeType: "positive" as const,
      icon: Users,
    },
    {
      title: "System Health",
      value: "98.5%",
      change: "+0.2%",
      changeType: "positive" as const,
      icon: Activity,
    },
    {
      title: "Security Alerts",
      value: "3",
      change: "-2",
      changeType: "negative" as const,
      icon: Shield,
    },
  ];

  const recentActivities = [
    {
      id: 1,
      action: "Entity Created",
      entity: "User Profile",
      user: "John Doe",
      time: "2 minutes ago",
      status: "success",
    },
    {
      id: 2,
      action: "Permission Updated",
      entity: "Admin Role",
      user: "Jane Smith",
      time: "15 minutes ago",
      status: "success",
    },
    {
      id: 3,
      action: "Security Alert",
      entity: "Login Attempt",
      user: "Unknown User",
      time: "1 hour ago",
      status: "warning",
    },
    {
      id: 4,
      action: "Entity Modified",
      entity: "Product Catalog",
      user: "Mike Johnson",
      time: "2 hours ago",
      status: "success",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                <Badge
                  variant={stat.changeType === "positive" ? "default" : "destructive"}
                  className="text-xs"
                >
                  {stat.change}
                </Badge>
                <span>from last month</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Quick Actions */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Quick Actions
            </CardTitle>
            <CardDescription>
              Common tasks and shortcuts
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start" variant="outline">
              <Database className="mr-2 h-4 w-4" />
              Create New Entity
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Users className="mr-2 h-4 w-4" />
              Manage Users
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <BarChart3 className="mr-2 h-4 w-4" />
              View Analytics
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Shield className="mr-2 h-4 w-4" />
              Security Settings
            </Button>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Recent Activity
            </CardTitle>
            <CardDescription>
              Latest actions and system events
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    {activity.status === "success" ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-yellow-500" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">
                      {activity.action}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {activity.entity} • {activity.user}
                    </p>
                  </div>
                  <div className="flex-shrink-0 text-xs text-muted-foreground">
                    {activity.time}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            System Status
          </CardTitle>
          <CardDescription>
            Current system health and performance metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm font-medium">Database</p>
                <p className="text-xs text-muted-foreground">All systems operational</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm font-medium">API Services</p>
                <p className="text-xs text-muted-foreground">Response time: 45ms</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm font-medium">WebSocket</p>
                <p className="text-xs text-muted-foreground">89 active connections</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}