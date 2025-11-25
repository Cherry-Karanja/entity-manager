import { FieldConfig } from "@/components/entityManager";
import { VIOLATION_TYPE_LABELS } from "../../types";

export const penaltyRuleFields: FieldConfig[] = [
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
    type: "select",
    required: true,
    placeholder: "Select timetable",
    helpText: "The timetable this rule applies to",
    endpoint: "/api/v1/logx/timetabling/timetables/",
    displayField: "name",
    valueField: "id",
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
    type: "checkbox",
    helpText: "Only active rules are used in penalty calculations",
  },
  {
    name: "description",
    label: "Description",
    type: "textarea",
    placeholder: "Describe what this penalty rule enforces...",
    helpText: "Detailed explanation of the penalty rule",
  },
];
