"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { HelpCircle, X, Lightbulb, Info, AlertTriangle } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

interface ContextualHelpProps {
  title: string
  content: React.ReactNode
  type?: "info" | "tip" | "warning"
  className?: string
  defaultOpen?: boolean
}

export function ContextualHelp({
  title,
  content,
  type = "info",
  className = "",
  defaultOpen = false
}: ContextualHelpProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  const icons = {
    info: <Info className="h-4 w-4" />,
    tip: <Lightbulb className="h-4 w-4" />,
    warning: <AlertTriangle className="h-4 w-4" />
  }

  const colors = {
    info: "border-blue-200 bg-blue-50 text-blue-800",
    tip: "border-green-200 bg-green-50 text-green-800",
    warning: "border-yellow-200 bg-yellow-50 text-yellow-800"
  }

  return (
    <Card className={`${colors[type]} ${className}`}>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-opacity-80 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {icons[type]}
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  {type.toUpperCase()}
                </Badge>
                <HelpCircle className="h-4 w-4" />
              </div>
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="pt-0">
            <div className="text-sm leading-relaxed">
              {content}
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  )
}

// Template-specific help panels
export function TemplateHelpPanels() {
  return (
    <div className="space-y-4">
      <ContextualHelp
        title="Template Basics"
        content={
          <div className="space-y-2">
            <p><strong>Name &amp; Description:</strong> Choose a clear, descriptive name and provide details about the exam&apos;s purpose and content.</p>
            <p><strong>Format:</strong> Word (.docx) files are editable and great for templates. PDF files are final and secure.</p>
            <p><strong>Duration & Marks:</strong> Set realistic time limits and ensure marks align with question difficulty.</p>
          </div>
        }
        type="info"
      />

      <ContextualHelp
        title="Section Configuration Tips"
        content={
          <div className="space-y-2">
            <p><strong>Question Types:</strong> Mix different question types (multiple choice, essay, etc.) for balanced assessment.</p>
            <p><strong>Mark Distribution:</strong> Higher marks for complex questions, lower for basic recall.</p>
            <p><strong>Selection Types:</strong> Use &quot;Fixed Choice&quot; when students must answer a specific number of questions.</p>
          </div>
        }
        type="tip"
      />

      <ContextualHelp
        title="Custom Fields Best Practices"
        content={
          <div className="space-y-2">
            <p><strong>Placeholders:</strong> Use descriptive names like {"{{university_name}}"} or {"{{course_code}}"}.</p>
            <p><strong>Required Fields:</strong> Mark essential information as required to prevent incomplete exams.</p>
            <p><strong>Default Values:</strong> Provide sensible defaults to speed up exam generation.</p>
          </div>
        }
        type="tip"
      />

      <ContextualHelp
        title="Header & Footer Setup"
        content={
          <div className="space-y-2">
            <p><strong>Branding:</strong> Include university name, logo, and course information in headers.</p>
            <p><strong>Page Numbers:</strong> Always include {"{{page_number}}"} and {"{{total_pages}}"} in footers.</p>
            <p><strong>Consistency:</strong> Use the same placeholders across all templates for uniformity.</p>
          </div>
        }
        type="info"
      />
    </div>
  )
}

// Floating help button that shows help panels
interface FloatingHelpButtonProps {
  className?: string
}

export function FloatingHelpButton({ className = "" }: FloatingHelpButtonProps) {
  const [showHelp, setShowHelp] = useState(false)

  return (
    <>
      <Button
        onClick={() => setShowHelp(true)}
        size="sm"
        variant="outline"
        className={`fixed bottom-4 right-4 z-50 shadow-lg ${className}`}
      >
        <HelpCircle className="h-4 w-4 mr-2" />
        Help
      </Button>

      {showHelp && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-background rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Template Editor Help</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowHelp(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <TemplateHelpPanels />
            </div>
          </div>
        </div>
      )}
    </>
  )
}