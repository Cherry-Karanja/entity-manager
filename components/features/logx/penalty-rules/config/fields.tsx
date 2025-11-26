import type { FormField } from "@/components/entityManager/components/form/types";
import { authApi } from '@/components/connectionManager/http/client';
import { VIOLATION_TYPE_LABELS } from "../../types";

import { PenaltyRule } from "../../types";
export const penaltyRuleFields: FormField<PenaltyRule>[] = [
  {
    name: "name",
    label: "Rule Name",
    type: "text",
    required: true,
    placeholder: "e.g., Teacher Overload Penalty",
    helpText: "A descriptive name for this penalty rule",
  },
  {
    name: "timetable",
    label: "Timetable",
    type: "relation",
    required: true,
    placeholder: "Select timetable",
    helpText: "The timetable this rule applies to",
    relationConfig: {
      entity: "timetables",
      displayField: "name",
      valueField: "id",
      fetchOptions: async (search?: string) => {
        const params = search ? { params: { search } } : undefined;
        const resp = await authApi.get('/api/v1/logx/timetabling/timetables/', params as Record<string, unknown> | undefined);
        const data = resp.data;
        return Array.isArray(data) ? data : data.results ?? data.data ?? [];
      },
    },
  },
  {
    name: "violation_type",
    label: "Violation Type",
    type: "select",
    required: true,
    placeholder: "Select violation type",
    helpText: "The type of scheduling violation this rule penalizes",
    options: Object.entries(VIOLATION_TYPE_LABELS).map(([value, label]) => ({
      value,
      label,
    })),
  },
  {
    name: "base_penalty",
    label: "Base Penalty",
    type: "number",
    required: true,
    placeholder: "e.g., 10",
    helpText: "Base penalty score for each violation",
  },
  {
    name: "multiplier",
    label: "Multiplier",
    type: "number",
    required: true,
    placeholder: "e.g., 1.5",
    helpText: "Multiplier applied to the base penalty (for escalating penalties)",
  },
  {
    name: "max_penalty",
    label: "Maximum Penalty",
    type: "number",
    placeholder: "e.g., 100",
    helpText: "Maximum penalty score (cap) for this rule",
  },
  {
    name: "threshold",
    label: "Threshold",
    type: "number",
    placeholder: "e.g., 3",
    helpText: "Number of violations before penalty applies (0 = immediate)",
  },
  {
    name: "is_active",
    label: "Active",
    type: "switch",
    helpText: "Only active rules are used in penalty calculations",
    defaultValue: true,
  },
  {
    name: "description",
    label: "Description",
    type: "textarea",
    placeholder: "Describe what this penalty rule enforces...",
    helpText: "Detailed explanation of the penalty rule",
  },
];
