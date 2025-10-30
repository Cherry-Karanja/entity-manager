"use client"

import { useState, useEffect } from "react"
import { HelpCircle, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { useFieldHelpText } from "@/hooks/useFieldHelp"

interface HelpTextProps {
  text?: string
  title?: string
  className?: string
  variant?: "tooltip" | "popover" | "inline"
}

export function HelpText({
  text,
  title,
  className = "",
  variant = "tooltip"
}: HelpTextProps) {
  const [isOpen, setIsOpen] = useState(false)

  if (!text) return null

  if (variant === "inline") {
    return (
      <div className={`text-sm text-muted-foreground ${className}`}>
        <Info className="inline h-3 w-3 mr-1" />
        {text}
      </div>
    )
  }

  if (variant === "popover") {
    return (
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className={`h-4 w-4 p-0 hover:bg-muted ${className}`}
            title={title || "Help"}
          >
            <HelpCircle className="h-3 w-3" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80" align="start">
          <div className="space-y-2">
            {title && (
              <h4 className="font-medium text-sm">{title}</h4>
            )}
            <p className="text-sm text-muted-foreground leading-relaxed">
              {text}
            </p>
          </div>
        </PopoverContent>
      </Popover>
    )
  }

  // Default tooltip variant
  return (
    <div
      className={`inline-block ${className}`}
      title={text}
    >
      <HelpCircle className="h-3 w-3 text-muted-foreground hover:text-foreground cursor-help" />
    </div>
  )
}

// Component for displaying field help with API integration
interface FieldHelpProps {
  fieldName: string
  endpoint?: string
  className?: string
  variant?: "tooltip" | "popover" | "inline"
  fallbackText?: string
}

export function FieldHelp({
  fieldName,
  endpoint,
  className,
  variant = "popover",
  fallbackText
}: FieldHelpProps) {
  const helpText = useFieldHelpText(fieldName, endpoint)
  const displayText = helpText || fallbackText

  if (!displayText) return null

  return (
    <HelpText
      text={displayText}
      title={fieldName}
      className={className}
      variant={variant}
    />
  )
}

// Form field wrapper with help text
interface FormFieldWithHelpProps {
  label: string
  helpText?: string
  fieldName?: string
  endpoint?: string
  required?: boolean
  children: React.ReactNode
  className?: string
}

export function FormFieldWithHelp({
  label,
  helpText,
  fieldName,
  endpoint,
  required = false,
  children,
  className = ""
}: FormFieldWithHelpProps) {
  const dynamicHelpText = useFieldHelpText(fieldName || "", endpoint)
  const displayHelpText = dynamicHelpText || helpText

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium">
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </label>
        {displayHelpText && (
          <HelpText
            text={displayHelpText}
            title={label}
            variant="popover"
          />
        )}
      </div>
      {children}
    </div>
  )
}