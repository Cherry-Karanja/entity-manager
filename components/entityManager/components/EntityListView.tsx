import React, { useState, useMemo } from 'react'
import { BaseEntity, EntityManagerConfig, EntityFieldConfig } from '../EntityManager/types'
import { Search, Filter, RefreshCw, Download, Upload, Plus, MoreHorizontal, Eye, Edit, Trash2 } from 'lucide-react'

// ===== SUB-COMPONENTS =====

// Search bar component
interface SearchBarProps {
  searchTerm: string
  onSearch: (query: string) => void
  placeholder?: string
  className?: string
}

const SearchBar: React.FC<SearchBarProps> = ({
  searchTerm,
  onSearch,
  placeholder = 'Search...',
  className = ''
}) => {
  return (
    <div className={`relative ${className}`}>
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => onSearch(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </div>
  )
}

// Filter bar component
interface FilterBarProps {
  filters: Record<string, unknown>
  onFilter: (filters: Record<string, unknown>) => void
  fields: EntityFieldConfig[]
  className?: string
}

const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onFilter,
  fields,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false)

  const filterableFields = fields.filter(field => field.filterable)

  if (filterableFields.length === 0) return null

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
        title="Toggle filters"
      >
        <Filter className="h-4 w-4" />
        Filters
        {Object.keys(filters).length > 0 && (
          <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
            {Object.keys(filters).length}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 right-0 bg-white border border-gray-300 rounded-lg shadow-lg p-4 z-10 min-w-64">
          <div className="space-y-3">
            {filterableFields.map(field => (
              <div key={field.name}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {field.label}
                </label>
                {field.type === 'select' && field.options ? (
                  <select
                    value={filters[field.name] as string || ''}
                    onChange={(e) => onFilter({ ...filters, [field.name]: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    title={`Filter by ${field.label}`}
                  >
                    <option value="">All</option>
                    {field.options.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    value={filters[field.name] as string || ''}
                    onChange={(e) => onFilter({ ...filters, [field.name]: e.target.value })}
                    placeholder={`Filter ${field.label.toLowerCase()}`}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => onFilter({})}
              className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
              title="Clear all filters"
            >
              Clear All
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
              title="Apply filters"
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ===== VIEW VARIANTS =====

// Table view component
interface TableViewProps<TEntity extends BaseEntity = BaseEntity> {
  config: EntityManagerConfig<TEntity>
  items: TEntity[]
  onItemClick?: (item: TEntity) => void
  onCreate?: () => void
  onEdit?: (item: TEntity) => void
  onView?: (item: TEntity) => void
  onDelete?: (item: TEntity) => void
}

const TableView = <TEntity extends BaseEntity = BaseEntity>({
  config,
  items,
  onItemClick,
  onCreate,
  onEdit,
  onView,
  onDelete
}: TableViewProps<TEntity>) => {
  const columns = config.listView.columns || config.fields.filter(f => f.sortable !== false).map(field => ({
    key: field.name,
    title: field.label,
    dataIndex: field.name,
    sortable: field.sortable,
    filterable: field.filterable,
    render: field.customRenderer
  }))

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {config.listView.enableSelection && (
              <th className="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  checked={false} // TODO: Implement selection state
                  onChange={() => {}} // TODO: Implement selection logic
                  className="rounded border-gray-300"
                  title="Select all items"
                />
              </th>
            )}
            {columns.map((column) => (
              <th
                key={column.key}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {column.title}
              </th>
            ))}
            {(onView || onEdit || onDelete) && (
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {items.map((item) => (
            <tr key={item.id} className="hover:bg-gray-50">
              {config.listView.enableSelection && (
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={false} // TODO: Implement selection state
                    onChange={() => {}} // TODO: Implement selection logic
                    className="rounded border-gray-300"
                    title={`Select ${config.displayName}`}
                  />
                </td>
              )}
              {columns.map((column) => (
                <td
                  key={column.key}
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                  onClick={() => onItemClick?.(item)}
                >
                  {column.render
                    ? column.render(item[column.dataIndex || column.key], item) as React.ReactNode
                    : String(item[column.dataIndex || column.key] || '-')}
                </td>
              ))}
              {(onView || onEdit || onDelete) && (
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end gap-2">
                    {onView && config.actions.enableView && (
                      <button
                        onClick={() => onView(item)}
                        className="text-blue-600 hover:text-blue-900"
                        title={`View ${config.displayName}`}
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    )}
                    {onEdit && config.actions.enableEdit && (
                      <button
                        onClick={() => onEdit(item)}
                        className="text-green-600 hover:text-green-900"
                        title={`Edit ${config.displayName}`}
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                    )}
                    {onDelete && config.actions.enableDelete && (
                      <button
                        onClick={() => onDelete(item)}
                        className="text-red-600 hover:text-red-900"
                        title={`Delete ${config.displayName}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// Card view component
interface CardViewProps<TEntity extends BaseEntity = BaseEntity> {
  config: EntityManagerConfig<TEntity>
  items: TEntity[]
  onItemClick?: (item: TEntity) => void
  onCreate?: () => void
  onEdit?: (item: TEntity) => void
  onView?: (item: TEntity) => void
  onDelete?: (item: TEntity) => void
}

const CardView = <TEntity extends BaseEntity = BaseEntity>({
  config,
  items,
  onItemClick,
  onCreate,
  onEdit,
  onView,
  onDelete
}: CardViewProps<TEntity>) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map(item => {
        const title = String(item.name || item.title || `Item ${item.id}`)
        const subtitle = item.description ? String(item.description) : null

        return (
          <div
            key={item.id}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => onItemClick?.(item)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
              </div>
              <div className="flex items-center gap-2">
                {onView && config.actions.enableView && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onView(item)
                    }}
                    className="p-1 text-blue-600 hover:text-blue-800"
                    title="View details"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                )}
                {onEdit && config.actions.enableEdit && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onEdit(item)
                    }}
                    className="p-1 text-green-600 hover:text-green-800"
                    title="Edit item"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                )}
                {onDelete && config.actions.enableDelete && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onDelete(item)
                    }}
                    className="p-1 text-red-600 hover:text-red-800"
                    title="Delete item"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ===== MAIN COMPONENT =====

export interface EntityListViewProps<TEntity extends BaseEntity = BaseEntity> {
  config: EntityManagerConfig<TEntity>
  items: TEntity[]
  onItemClick?: (item: TEntity) => void
  onCreate?: () => void
  onEdit?: (item: TEntity) => void
  onView?: (item: TEntity) => void
  onDelete?: (item: TEntity) => void
  variant?: 'table' | 'card' | 'list' | 'grid' | 'compact'
  className?: string
}

export const EntityListView = <TEntity extends BaseEntity = BaseEntity>({
  config,
  items,
  onItemClick,
  onCreate,
  onEdit,
  onView,
  onDelete,
  variant = 'table',
  className = ''
}: EntityListViewProps<TEntity>) => {
  // Render the appropriate view variant
  const renderView = () => {
    switch (variant) {
      case 'card':
        return (
          <CardView<TEntity>
            config={config}
            items={items}
            onItemClick={onItemClick}
            onCreate={onCreate}
            onEdit={onEdit}
            onView={onView}
            onDelete={onDelete}
          />
        )
      case 'table':
      default:
        return (
          <TableView<TEntity>
            config={config}
            items={items}
            onItemClick={onItemClick}
            onCreate={onCreate}
            onEdit={onEdit}
            onView={onView}
            onDelete={onDelete}
          />
        )
    }
  }

  return (
    <div className={`entity-list-view ${className}`}>
      {/* Search and Filter Bar - TODO: Implement search/filter state management */}
      {(config.listView.enableSearch || config.listView.enableFilters) && (
        <div className="flex gap-4 mb-6">
          {config.listView.enableSearch && (
            <SearchBar
              searchTerm=""
              onSearch={() => {}} // TODO: Implement search
              placeholder={`Search ${config.displayNamePlural}...`}
              className="flex-1 max-w-md"
            />
          )}
          {config.listView.enableFilters && (
            <FilterBar
              filters={{}}
              onFilter={() => {}} // TODO: Implement filters
              fields={config.fields}
            />
          )}
        </div>
      )}

      {/* Action Bar - TODO: Implement action bar */}
      {config.actions.enableCreate && onCreate && (
        <div className="flex justify-between items-center mb-6">
          <div></div>
          <button
            onClick={onCreate}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Create {config.displayName}
          </button>
        </div>
      )}

      {/* Content */}
      {items.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No {config.displayNamePlural} found</p>
          {config.actions.enableCreate && onCreate && (
            <button
              onClick={onCreate}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Create First {config.displayName}
            </button>
          )}
        </div>
      ) : (
        renderView()
      )}
    </div>
  )
}