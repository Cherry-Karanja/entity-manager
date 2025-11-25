import { FieldConfig } from "@/components/entityManager";
import { CONSTRAINT_TYPE_LABELS } from "../../types";

export const timetableConstraintFields: FieldConfig[] = [
  {
    name: "name",
    label: "Constraint Name",
    type: "text",
    required: true,
    placeholder: "e.g., No Back-to-Back Classes for Teachers",
    helpText: "A descriptive name for this constraint",
  },
  {
    name: "timetable",
    label: "Timetable",
    type: "select",
    required: true,
    placeholder: "Select timetable",
    helpText: "The timetable this constraint applies to",
    endpoint: "/api/v1/logx/timetabling/timetables/",
    displayField: "name",
    valueField: "id",
  },
  {
    name: "constraint_type",
    label: "Constraint Type",
    type: "select",
    required: true,
    placeholder: "Select constraint type",
    helpText: "The type of scheduling constraint",
    options: Object.entries(CONSTRAINT_TYPE_LABELS).map(([value, label]) => ({
      value,
      label,
    })),
  },
  {
    name: "priority",
    label: "Priority",
    type: "number",
    required: true,
    placeholder: "e.g., 1 (highest)",
    helpText: "Priority level (1 = highest, lower numbers are processed first)",
  },
  {
    name: "weight",
    label: "Weight",
    type: "number",
    required: true,
    placeholder: "e.g., 100",
    helpText: "Weight used in penalty calculations for violations",
  },
  {
    name: "is_hard_constraint",
    label: "Hard Constraint",
    type: "checkbox",
    helpText: "Hard constraints must be satisfied; soft constraints can be violated with penalties",
  },
  {
    name: "is_active",
    label: "Active",
    type: "checkbox",
    helpText: "Only active constraints are applied during scheduling",
  },
  {
    name: "parameters",
    label: "Parameters (JSON)",
    type: "textarea",
    placeholder: '{"max_hours": 6, "excluded_days": [0, 6]}',
    helpText: "Constraint-specific parameters in JSON format",
  },
  {
    name: "description",
    label: "Description",
    type: "textarea",
    placeholder: "Describe what this constraint enforces...",
    helpText: "Detailed explanation of the constraint",
  },
];
