'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'
import { EntityListPagination as EntityListPaginationType } from '../types'
import { useIsMobile } from '@/hooks/use-mobile'

interface EntityListPaginationComponentProps {
  pagination: EntityListPaginationType
  onChange: (page: number, pageSize: number) => void
  showSizeChanger?: boolean
  showQuickJumper?: boolean
  showTotal?: (total: number, range: [number, number]) => string
}

export const EntityListPagination: React.FC<EntityListPaginationComponentProps> = ({
  pagination,
  onChange,
  showSizeChanger = true,
  showQuickJumper = false,
  showTotal
}) => {
  const isMobile = useIsMobile()
  const { page, pageSize, total, totalPages, pageSizeOptions = [10, 20, 50, 100] } = pagination

  const startItem = (page - 1) * pageSize + 1
  const endItem = Math.min(page * pageSize, total)

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      onChange(newPage, pageSize)
    }
  }

  const handlePageSizeChange = (newPageSize: string) => {
    const size = parseInt(newPageSize)
    onChange(1, size) // Reset to first page when changing page size
  }

  if (total === 0) return null

  return (
    <div className={`flex ${isMobile ? 'flex-col gap-4' : 'items-center justify-between'}`}>
      <div className={`flex ${isMobile ? 'flex-col gap-2 items-center' : 'items-center gap-4'}`}>
        {/* Total info */}
        <div className="text-sm text-muted-foreground">
          {showTotal
            ? showTotal(total, [startItem, endItem])
            : `Showing ${startItem}-${endItem} of ${total} items`
          }
        </div>

        {/* Page size selector */}
        {showSizeChanger && (
          <div className={`flex items-center gap-2 ${isMobile ? 'justify-center' : ''}`}>
            <span className="text-sm">Show</span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    <Select value={pageSize.toString()} onValueChange={handlePageSizeChange}>
                      <SelectTrigger className="w-20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {pageSizeOptions.map((size) => (
                          <SelectItem key={size} value={size.toString()}>
                            {size}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">Items per page</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <span className="text-sm">per page</span>
          </div>
        )}
      </div>

      {/* Page controls */}
      <div className={`flex items-center gap-1 ${isMobile ? 'justify-center' : ''}`}>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(1)}
                disabled={page === 1}
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">First page</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">Previous page</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <div className="flex items-center gap-2 px-3">
          <span className="text-sm">Page</span>
          <span className="font-medium">{page}</span>
          <span className="text-sm">of</span>
          <span className="font-medium">{totalPages}</span>
        </div>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">Next page</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(totalPages)}
                disabled={page === totalPages}
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">Last page</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  )
}