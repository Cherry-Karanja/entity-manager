"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, Grid, List, SlidersHorizontal } from "lucide-react"

interface FiltersBarProps {
  searchPlaceholder?: string
  onSearch?: (query: string) => void
  onFilterChange?: (filters: Record<string, string>) => void
  onViewChange?: (view: "grid" | "list") => void
  filters?: Array<{
    key: string
    label: string
    options: Array<{ value: string; label: string }>
  }>
  showViewToggle?: boolean
}

export function FiltersBar({
  searchPlaceholder = "Search...",
  onSearch,
  onFilterChange,
  onViewChange,
  filters = [],
  showViewToggle = true,
}: FiltersBarProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({})
  const [currentView, setCurrentView] = useState<"grid" | "list">("grid")

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    onSearch?.(query)
  }

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...activeFilters, [key]: value }
    setActiveFilters(newFilters)
    onFilterChange?.(newFilters)
  }

  const handleViewChange = (view: "grid" | "list") => {
    setCurrentView(view)
    onViewChange?.(view)
  }

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="flex flex-1 gap-3 items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        {filters.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                <SlidersHorizontal className="w-4 h-4" />
                Filters
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              {filters.map((filter) => (
                <div key={filter.key} className="p-2">
                  <label className="text-sm font-medium mb-2 block">{filter.label}</label>
                  <Select
                    value={activeFilters[filter.key] || "all"}
                    onValueChange={(value) => handleFilterChange(filter.key, value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={`Select ${filter.label.toLowerCase()}`} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      {filter.options.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {showViewToggle && (
        <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 rounded-md p-1">
          <Button
            variant={currentView === "grid" ? "default" : "ghost"}
            size="sm"
            onClick={() => handleViewChange("grid")}
            className="h-8 w-8 p-0"
          >
            <Grid className="w-4 h-4" />
          </Button>
          <Button
            variant={currentView === "list" ? "default" : "ghost"}
            size="sm"
            onClick={() => handleViewChange("list")}
            className="h-8 w-8 p-0"
          >
            <List className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  )
}
