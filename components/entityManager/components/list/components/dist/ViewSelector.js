/**
 * View Selector
 *
 * UI component for switching between EntityList view modes.
 */
'use client';
"use strict";
exports.__esModule = true;
exports.ViewSelector = void 0;
var react_1 = require("react");
var utils_1 = require("@/lib/utils");
var button_1 = require("@/components/ui/button");
var dropdown_menu_1 = require("@/components/ui/dropdown-menu");
var tooltip_1 = require("@/components/ui/tooltip");
var lucide_react_1 = require("lucide-react");
var viewOptions = [
    { value: 'table', label: 'Table', description: 'Columnar table view' },
    { value: 'card', label: 'Card', description: 'Card grid' },
    { value: 'list', label: 'List', description: 'Simple list' },
    { value: 'grid', label: 'Grid', description: 'Grid layout' },
    { value: 'compact', label: 'Compact', description: 'Dense table' },
    { value: 'timeline', label: 'Timeline', description: 'Timeline view' },
    { value: 'detailed', label: 'Detailed', description: 'Detailed list' },
    { value: 'gallery', label: 'Gallery', description: 'Image gallery' },
];
function DropdownViewSelector(_a) {
    var value = _a.value, onChange = _a.onChange, className = _a.className;
    return (react_1["default"].createElement(dropdown_menu_1.DropdownMenu, null,
        react_1["default"].createElement(dropdown_menu_1.DropdownMenuTrigger, { asChild: true },
            react_1["default"].createElement(button_1.Button, { variant: "outline", size: "sm", className: utils_1.cn('min-h-[44px]', className), title: "Change view" },
                react_1["default"].createElement(lucide_react_1.LayoutGrid, { className: "h-4 w-4" }),
                react_1["default"].createElement("span", { className: "ml-2 hidden sm:inline" }, "View"))),
        react_1["default"].createElement(dropdown_menu_1.DropdownMenuContent, { align: "end", className: "w-56" },
            react_1["default"].createElement(dropdown_menu_1.DropdownMenuLabel, null, "View mode"),
            react_1["default"].createElement(dropdown_menu_1.DropdownMenuSeparator, null),
            react_1["default"].createElement(dropdown_menu_1.DropdownMenuRadioGroup, { value: value, onValueChange: function (v) { return onChange(v); } }, viewOptions.map(function (opt) { return (react_1["default"].createElement(dropdown_menu_1.DropdownMenuRadioItem, { key: opt.value, value: opt.value },
                react_1["default"].createElement("div", { className: "flex flex-col" },
                    react_1["default"].createElement("span", { className: "font-medium" }, opt.label),
                    react_1["default"].createElement("span", { className: "text-xs text-muted-foreground" }, opt.description)))); })))));
}
function ButtonGroupViewSelector(_a) {
    var value = _a.value, onChange = _a.onChange, className = _a.className;
    return (react_1["default"].createElement("div", { className: utils_1.cn('inline-flex rounded-md shadow-sm', className), role: "group" }, viewOptions.map(function (option, index) { return (react_1["default"].createElement(tooltip_1.TooltipProvider, { key: option.value },
        react_1["default"].createElement(tooltip_1.Tooltip, null,
            react_1["default"].createElement(tooltip_1.TooltipTrigger, { asChild: true },
                react_1["default"].createElement(button_1.Button, { type: "button", variant: value === option.value ? 'default' : 'outline', size: "sm", onClick: function () { return onChange(option.value); }, className: utils_1.cn('px-3', index === 0 && 'rounded-r-none', index === viewOptions.length - 1 && 'rounded-l-none', index > 0 && index < viewOptions.length - 1 && 'rounded-none border-l-0 border-r-0') },
                    option.label.charAt(0),
                    react_1["default"].createElement("span", { className: "ml-1 hidden md:inline" }, option.label.slice(1)))),
            react_1["default"].createElement(tooltip_1.TooltipContent, null,
                react_1["default"].createElement("p", null, option.description))))); })));
}
function ViewSelector(_a) {
    var value = _a.value, onChange = _a.onChange, _b = _a.variant, variant = _b === void 0 ? 'dropdown' : _b, className = _a.className;
    if (variant === 'buttons') {
        return react_1["default"].createElement(ButtonGroupViewSelector, { value: value, onChange: onChange, className: className });
    }
    return react_1["default"].createElement(DropdownViewSelector, { value: value, onChange: onChange, className: className });
}
exports.ViewSelector = ViewSelector;
