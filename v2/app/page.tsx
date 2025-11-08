import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Database, ArrowRight, Shield, BarChart3 } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Database className="h-4 w-4" />
              </div>
              <span className="text-lg font-semibold text-foreground">
                Entity Manager
              </span>
              <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                v2.0
              </span>
            </div>
            <Button asChild>
              <Link href="/dashboard">
                View Dashboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <div className="flex justify-center mb-8">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg">
              <Database className="h-8 w-8" />
            </div>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            Modern Entity
            <span className="text-primary"> Management</span>
          </h1>

          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            Streamline your data operations with our powerful entity management platform.
            Manage entities, track relationships, and gain insights with ease.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button size="lg" asChild className="text-lg px-8 py-6">
              <Link href="/dashboard">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6">
              Learn More
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="text-center p-6 rounded-lg border border-border/50 bg-card/50 backdrop-blur">
            <div className="flex justify-center mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Database className="h-6 w-6" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Entity Management
            </h3>
            <p className="text-muted-foreground">
              Create, update, and manage your entities with our intuitive interface.
              Support for complex relationships and data validation.
            </p>
          </div>

          <div className="text-center p-6 rounded-lg border border-border/50 bg-card/50 backdrop-blur">
            <div className="flex justify-center mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <BarChart3 className="h-6 w-6" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Analytics & Insights
            </h3>
            <p className="text-muted-foreground">
              Gain valuable insights with comprehensive analytics and reporting tools.
              Track performance and make data-driven decisions.
            </p>
          </div>

          <div className="text-center p-6 rounded-lg border border-border/50 bg-card/50 backdrop-blur">
            <div className="flex justify-center mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Shield className="h-6 w-6" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Security & Access
            </h3>
            <p className="text-muted-foreground">
              Enterprise-grade security with role-based access control.
              Keep your data safe with advanced permission management.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 rounded-2xl p-8 border border-border/50">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Ready to get started?
            </h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Join thousands of organizations managing their entities efficiently.
            </p>
            <Button size="lg" asChild className="text-lg px-8 py-6">
              <Link href="/dashboard">
                View Dashboard
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <div className="flex h-6 w-6 items-center justify-center rounded bg-primary text-primary-foreground">
                <Database className="h-3 w-3" />
              </div>
              <span className="text-sm text-muted-foreground">
                Entity Manager v2.0
              </span>
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <span>© 2025 Entity Manager</span>
              <span>•</span>
              <span>Modern Management Platform</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
