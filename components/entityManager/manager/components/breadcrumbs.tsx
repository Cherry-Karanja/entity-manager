import { BaseEntity } from "../types"


// ===== TYPES =====

export interface BreadcrumbItem {
  label: string
  mode: 'list' | 'view' | 'create' | 'edit'
  entity?: BaseEntity
  onClick?: () => void
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
  className?: string
}

export  function Breadcrumb({ items, className }: BreadcrumbProps) {
  if (items.length <= 1) return null

  return (
    <nav className={`flex items-center space-x-2 text-sm text-muted-foreground mb-4 ${className || ''}`}>
      {items.map((item, index) => (
        <div key={index} className="flex items-center">
          {index > 0 && <span className="mx-2">/</span>}
          {item.onClick ? (
            <button
              onClick={item.onClick}
              className="hover:text-foreground transition-colors underline underline-offset-2"
            >
              {item.label}
            </button>
          ) : (
            <span className="text-foreground font-medium">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  )
}
