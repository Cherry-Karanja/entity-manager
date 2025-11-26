import type { Column } from "@/components/entityManager/components/list/types";
import { Badge } from "@/components/ui/badge";
import { VirtualResource, RESOURCE_TYPE_LABELS } from "../../types";
import { X, Share2 } from "lucide-react";

export const virtualResourceColumns: Column<VirtualResource>[] = [
  {
    key: "name",
    label: "Name",
    sortable: true,
    render: (value: unknown) => <span className="font-medium">{String(value)}</span>,
  },
  {
    key: "code",
    label: "Code",
    sortable: true,
    render: (value: unknown) => (
      <code className="bg-muted px-2 py-0.5 rounded text-sm">{String(value)}</code>
    ),
  },
  {
    key: "timetable_name",
    label: "Timetable",
    sortable: true,
  },
  {
    key: "resource_type",
    label: "Type",
    sortable: true,
    render: (value: unknown) => (
      <Badge variant="outline">
        {RESOURCE_TYPE_LABELS[value as keyof typeof RESOURCE_TYPE_LABELS] || String(value)}
      </Badge>
    ),
  },
  {
    key: "capacity",
    label: "Capacity",
    sortable: true,
    render: (value: unknown) => (value ? String(value) : "—"),
  },
  {
    key: "is_shared",
    label: "Shared",
    render: (value: unknown) =>
      value ? (
        <Share2 className="h-4 w-4 text-blue-500" />
      ) : (
        <X className="h-4 w-4 text-gray-400" />
      ),
  },
  {
    key: "is_active",
    label: "Status",
    render: (value: unknown) => (
      <Badge variant={(value as boolean) ? "default" : "secondary"}>
        {(value as boolean) ? "Active" : "Inactive"}
      </Badge>
    ),
  },
];
