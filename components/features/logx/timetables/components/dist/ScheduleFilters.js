"use client";
"use strict";
exports.__esModule = true;
var react_1 = require("react");
var command_1 = require("@/components/ui/command");
function ScheduleFilters(_a) {
    var _b, _c, _d, _e;
    var _f = _a.departments, departments = _f === void 0 ? [] : _f, _g = _a.programmes, programmes = _g === void 0 ? [] : _g, _h = _a.classGroups, classGroups = _h === void 0 ? [] : _h, _j = _a.rooms, rooms = _j === void 0 ? [] : _j, selectedDepartment = _a.selectedDepartment, selectedProgramme = _a.selectedProgramme, selectedGroup = _a.selectedGroup, selectedRoom = _a.selectedRoom, setSelectedDepartment = _a.setSelectedDepartment, setSelectedProgramme = _a.setSelectedProgramme, setSelectedGroup = _a.setSelectedGroup, setSelectedRoom = _a.setSelectedRoom;
    var renderLabel = function (item) {
        var _a, _b;
        if (item === undefined || item === null)
            return '';
        if (typeof item === 'string' || typeof item === 'number')
            return String(item);
        // item is EntityItem
        return item.name || item.title || item.label || item.class_group_name || item.display || String((_b = (_a = item.id) !== null && _a !== void 0 ? _a : item.pk) !== null && _b !== void 0 ? _b : '') || JSON.stringify(item).slice(0, 120);
    };
    var findLabel = function (list, value) {
        if (!value)
            return undefined;
        var it = list.find(function (i) { var _a, _b, _c; return String((_c = (_b = (_a = i.id) !== null && _a !== void 0 ? _a : i.pk) !== null && _b !== void 0 ? _b : i.name) !== null && _c !== void 0 ? _c : i.class_group_name) === String(value); });
        return it ? renderLabel(it) : undefined;
    };
    return (react_1["default"].createElement("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3" },
        react_1["default"].createElement("div", null,
            react_1["default"].createElement("div", { className: "flex items-center justify-between mb-1" },
                react_1["default"].createElement("div", { className: "text-xs text-gray-600" }, "Department"),
                selectedDepartment && react_1["default"].createElement("div", { className: "text-xs text-blue-700" },
                    "Selected: ", (_b = findLabel(departments, selectedDepartment)) !== null && _b !== void 0 ? _b : selectedDepartment)),
            react_1["default"].createElement("div", { className: "border rounded p-2 bg-white" },
                react_1["default"].createElement(command_1.Command, null,
                    react_1["default"].createElement(command_1.CommandInput, { placeholder: "Filter departments..." }),
                    react_1["default"].createElement(command_1.CommandList, null,
                        react_1["default"].createElement(command_1.CommandEmpty, null, "No departments"),
                        react_1["default"].createElement("div", { className: "max-h-48 overflow-y-auto" },
                            react_1["default"].createElement(command_1.CommandGroup, null, departments.map(function (d) {
                                var _a, _b, _c;
                                return (react_1["default"].createElement(command_1.CommandItem, { key: String((_c = (_b = (_a = d.id) !== null && _a !== void 0 ? _a : d.pk) !== null && _b !== void 0 ? _b : d.name) !== null && _c !== void 0 ? _c : renderLabel(d)), onMouseDown: function () { var _a, _b, _c; return setSelectedDepartment && setSelectedDepartment(String((_c = (_b = (_a = d.id) !== null && _a !== void 0 ? _a : d.pk) !== null && _b !== void 0 ? _b : d.name) !== null && _c !== void 0 ? _c : renderLabel(d))); } }, renderLabel(d)));
                            }))))))),
        react_1["default"].createElement("div", null,
            react_1["default"].createElement("div", { className: "flex items-center justify-between mb-1" },
                react_1["default"].createElement("div", { className: "text-xs text-gray-600" }, "Programme"),
                selectedProgramme && react_1["default"].createElement("div", { className: "text-xs text-green-700" },
                    "Selected: ", (_c = findLabel(programmes, selectedProgramme)) !== null && _c !== void 0 ? _c : selectedProgramme)),
            react_1["default"].createElement("div", { className: "border rounded p-2 bg-white" },
                react_1["default"].createElement(command_1.Command, null,
                    react_1["default"].createElement(command_1.CommandInput, { placeholder: "Filter programmes..." }),
                    react_1["default"].createElement(command_1.CommandList, null,
                        react_1["default"].createElement(command_1.CommandEmpty, null, "No programmes"),
                        react_1["default"].createElement("div", { className: "max-h-48 overflow-y-auto" },
                            react_1["default"].createElement(command_1.CommandGroup, null, programmes.map(function (p) {
                                var _a, _b, _c;
                                return (react_1["default"].createElement(command_1.CommandItem, { key: String((_c = (_b = (_a = p.id) !== null && _a !== void 0 ? _a : p.pk) !== null && _b !== void 0 ? _b : p.name) !== null && _c !== void 0 ? _c : renderLabel(p)), onMouseDown: function () { var _a, _b, _c; return setSelectedProgramme && setSelectedProgramme(String((_c = (_b = (_a = p.id) !== null && _a !== void 0 ? _a : p.pk) !== null && _b !== void 0 ? _b : p.name) !== null && _c !== void 0 ? _c : renderLabel(p))); } }, renderLabel(p)));
                            }))))))),
        react_1["default"].createElement("div", null,
            react_1["default"].createElement("div", { className: "flex items-center justify-between mb-1" },
                react_1["default"].createElement("div", { className: "text-xs text-gray-600" }, "Group"),
                selectedGroup && react_1["default"].createElement("div", { className: "text-xs text-indigo-700" },
                    "Selected: ", (_d = findLabel(classGroups, selectedGroup)) !== null && _d !== void 0 ? _d : selectedGroup)),
            react_1["default"].createElement("div", { className: "border rounded p-2 bg-white" },
                react_1["default"].createElement(command_1.Command, null,
                    react_1["default"].createElement(command_1.CommandInput, { placeholder: "Filter groups..." }),
                    react_1["default"].createElement(command_1.CommandList, null,
                        react_1["default"].createElement(command_1.CommandEmpty, null, "No groups"),
                        react_1["default"].createElement("div", { className: "max-h-48 overflow-y-auto" },
                            react_1["default"].createElement(command_1.CommandGroup, null, classGroups.map(function (g) {
                                var _a, _b, _c;
                                return (react_1["default"].createElement(command_1.CommandItem, { key: String((_c = (_b = (_a = g.id) !== null && _a !== void 0 ? _a : g.pk) !== null && _b !== void 0 ? _b : g.name) !== null && _c !== void 0 ? _c : renderLabel(g)), onMouseDown: function () { var _a, _b, _c; return setSelectedGroup && setSelectedGroup(String((_c = (_b = (_a = g.id) !== null && _a !== void 0 ? _a : g.pk) !== null && _b !== void 0 ? _b : g.name) !== null && _c !== void 0 ? _c : renderLabel(g))); } }, renderLabel(g)));
                            }))))))),
        react_1["default"].createElement("div", null,
            react_1["default"].createElement("div", { className: "flex items-center justify-between mb-1" },
                react_1["default"].createElement("div", { className: "text-xs text-gray-600" }, "Room"),
                selectedRoom && react_1["default"].createElement("div", { className: "text-xs text-yellow-700" },
                    "Selected: ", (_e = findLabel(rooms, selectedRoom)) !== null && _e !== void 0 ? _e : selectedRoom)),
            react_1["default"].createElement("div", { className: "border rounded p-2 bg-white" },
                react_1["default"].createElement(command_1.Command, null,
                    react_1["default"].createElement(command_1.CommandInput, { placeholder: "Filter rooms..." }),
                    react_1["default"].createElement(command_1.CommandList, null,
                        react_1["default"].createElement(command_1.CommandEmpty, null, "No rooms"),
                        react_1["default"].createElement("div", { className: "max-h-48 overflow-y-auto" },
                            react_1["default"].createElement(command_1.CommandGroup, null, rooms.map(function (r) {
                                var _a, _b, _c;
                                return (react_1["default"].createElement(command_1.CommandItem, { key: String((_c = (_b = (_a = r.id) !== null && _a !== void 0 ? _a : r.pk) !== null && _b !== void 0 ? _b : r.name) !== null && _c !== void 0 ? _c : renderLabel(r)), onMouseDown: function () { var _a, _b, _c; return setSelectedRoom && setSelectedRoom(String((_c = (_b = (_a = r.id) !== null && _a !== void 0 ? _a : r.pk) !== null && _b !== void 0 ? _b : r.name) !== null && _c !== void 0 ? _c : renderLabel(r))); } }, renderLabel(r)));
                            })))))))));
}
exports["default"] = ScheduleFilters;
