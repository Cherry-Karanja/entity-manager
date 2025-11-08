import { BulkImportFormat, FormField } from '../types'

export const parseImportFile = async (
  file: File,
  format: BulkImportFormat,
  fields: FormField[]
): Promise<Record<string, unknown>[]> => {
  const fileContent = await readFileAsText(file)

  switch (format.type) {
    case 'csv':
      return parseCSV(fileContent, format)
    case 'json':
      return parseJSON(fileContent)
    case 'xml':
      return parseXML(fileContent)
    case 'xlsx':
      return parseXLSX(file)
    default:
      throw new Error(`Unsupported format: ${format.type}`)
  }
}

const readFileAsText = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => resolve(e.target?.result as string)
    reader.onerror = (e) => reject(new Error('Failed to read file'))
    reader.readAsText(file)
  })
}

const readFileAsArrayBuffer = (file: File): Promise<ArrayBuffer> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => resolve(e.target?.result as ArrayBuffer)
    reader.onerror = (e) => reject(new Error('Failed to read file'))
    reader.readAsArrayBuffer(file)
  })
}

const parseCSV = (content: string, format: BulkImportFormat): Record<string, unknown>[] => {
  const lines = content.split('\n').filter(line => line.trim())
  if (lines.length === 0) return []

  const delimiter = format.delimiter || ','
  const hasHeaders = format.hasHeaders !== false

  // Parse headers
  const headers = hasHeaders
    ? parseCSVLine(lines[0], delimiter)
    : generateColumnNames(lines[0].split(delimiter).length)

  // Parse data rows
  const dataLines = hasHeaders ? lines.slice(1) : lines
  const result: Record<string, unknown>[] = []

  for (let i = 0; i < dataLines.length; i++) {
    const line = dataLines[i].trim()
    if (!line) continue

    try {
      const values = parseCSVLine(line, delimiter)
      const row: Record<string, unknown> = {}

      headers.forEach((header, index) => {
        const value = values[index] || ''
        row[header] = parseValue(value)
      })

      result.push(row)
    } catch (error) {
      throw new Error(`Error parsing line ${i + 1}: ${error instanceof Error ? error.message : 'Invalid CSV format'}`)
    }
  }

  return result
}

const parseCSVLine = (line: string, delimiter: string): string[] => {
  const result: string[] = []
  let current = ''
  let inQuotes = false
  let i = 0

  while (i < line.length) {
    const char = line[i]

    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        // Escaped quote
        current += '"'
        i += 2
      } else {
        // Toggle quote state
        inQuotes = !inQuotes
        i++
      }
    } else if (char === delimiter && !inQuotes) {
      // Field separator
      result.push(current.trim())
      current = ''
      i++
    } else {
      current += char
      i++
    }
  }

  result.push(current.trim())
  return result
}

const parseJSON = (content: string): Record<string, unknown>[] => {
  try {
    const parsed = JSON.parse(content)

    if (Array.isArray(parsed)) {
      return parsed.map(item => {
        if (typeof item === 'object' && item !== null) {
          return item as Record<string, unknown>
        }
        throw new Error('JSON array must contain objects')
      })
    } else if (typeof parsed === 'object' && parsed !== null) {
      return [parsed as Record<string, unknown>]
    } else {
      throw new Error('JSON must be an object or array of objects')
    }
  } catch (error) {
    throw new Error(`Invalid JSON format: ${error instanceof Error ? error.message : 'Parse error'}`)
  }
}

const parseXML = (content: string): Record<string, unknown>[] => {
  // Simple XML parser for basic structures
  const parser = new DOMParser()
  const doc = parser.parseFromString(content, 'text/xml')

  const parseError = doc.querySelector('parsererror')
  if (parseError) {
    throw new Error('Invalid XML format')
  }

  // Try to find root array element or convert single object
  const root = doc.documentElement
  const children = Array.from(root.children)

  if (children.length === 0) {
    // Single object
    return [parseXMLElement(root)]
  } else {
    // Array of objects
    return children.map(parseXMLElement)
  }
}

const parseXMLElement = (element: Element): Record<string, unknown> => {
  const result: Record<string, unknown> = {}

  // Parse attributes
  Array.from(element.attributes).forEach(attr => {
    result[attr.name] = parseValue(attr.value)
  })

  // Parse child elements
  Array.from(element.children).forEach(child => {
    const childName = child.tagName
    const childValue = child.children.length > 0
      ? parseXMLElement(child)
      : parseValue(child.textContent || '')

    if (result[childName]) {
      // Multiple elements with same name - convert to array
      if (!Array.isArray(result[childName])) {
        result[childName] = [result[childName]]
      }
      (result[childName] as unknown[]).push(childValue)
    } else {
      result[childName] = childValue
    }
  })

  // If no attributes or children, use text content
  if (Object.keys(result).length === 0) {
    return { value: parseValue(element.textContent || '') }
  }

  return result
}

const parseXLSX = async (file: File): Promise<Record<string, unknown>[]> => {
  // This would require a library like xlsx
  // For now, throw an error indicating XLSX support needs additional dependencies
  throw new Error('XLSX parsing requires additional dependencies. Please use CSV, JSON, or XML formats.')
}

const parseValue = (value: string): unknown => {
  if (value === '') return null

  // Try to parse as number
  const numValue = Number(value)
  if (!isNaN(numValue) && isFinite(numValue)) {
    return numValue
  }

  // Try to parse as boolean
  if (value.toLowerCase() === 'true') return true
  if (value.toLowerCase() === 'false') return false

  // Try to parse as date
  const dateValue = new Date(value)
  if (!isNaN(dateValue.getTime()) && value.match(/\d{4}-\d{2}-\d{2}/)) {
    return dateValue.toISOString().split('T')[0] // Return date string
  }

  // Return as string
  return value
}

const generateColumnNames = (count: number): string[] => {
  const names: string[] = []
  for (let i = 0; i < count; i++) {
    names.push(`Column_${i + 1}`)
  }
  return names
}