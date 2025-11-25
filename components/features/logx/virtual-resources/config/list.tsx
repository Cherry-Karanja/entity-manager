import { ColumnConfig } from "@/components/entityManager";
import { Badge } from "@/components/ui/badge";
import { VirtualResource, RESOURCE_TYPE_LABELS } from "../../types";
import { Check, X, Share2 } from "lucide-react";

export const virtualResourceColumns: ColumnConfig<VirtualResource>[] = [
  {
    key: "name",
    header: "Name",
    sortable: true,
    render: (value) => <span className="font-medium">{value}</span>,
  },
  {
    key: "code",
    header: "Code",
    sortable: true,
    render: (value) => (
      <code className="bg-muted px-2 py-0.5 rounded text-sm">{value}</code>
    ),
  },
  {
    key: "timetable_name",
    header: "Timetable",
    sortable: true,
  },
  {
    key: "resource_type",
    header: "Type",
    sortable: true,
    render: (value) => (
      <Badge variant="outline">
        {RESOURCE_TYPE_LABELS[value as keyof typeof RESOURCE_TYPE_LABELS] || value}
      </Badge>
    ),
  },
  {
    key: "capacity",
    header: "Capacity",
    sortable: true,
    render: (value) => (value ? value : "—"),
  },
  {
    key: "is_shared",
    header: "Shared",
    render: (value) =>
      value ? (
        <Share2 className="h-4 w-4 text-blue-500" />
      ) : (
        <X className="h-4 w-4 text-gray-400" />
      ),
  },
  {
    key: "is_active",
    header: "Status",
    render: (value) => (
      <Badge variant={value ? "default" : "secondary"}>
        {value ? "Active" : "Inactive"}
      </Badge>
    ),
  },
];
