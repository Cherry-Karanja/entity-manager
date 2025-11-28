"use client";
"use strict";
exports.__esModule = true;
var react_1 = require("react");
var lucide_react_1 = require("lucide-react");
function ScheduleToolbar(_a) {
    var _b, _c, _d;
    var stackingMode = _a.stackingMode, setStackingMode = _a.setStackingMode, isFullscreen = _a.isFullscreen, setIsFullscreen = _a.setIsFullscreen, searchQuery = _a.searchQuery, setSearchQuery = _a.setSearchQuery, stats = _a.stats, clearFilters = _a.clearFilters, selectedDepartment = _a.selectedDepartment, selectedProgramme = _a.selectedProgramme, selectedGroup = _a.selectedGroup, selectedRoom = _a.selectedRoom, selectedDepartmentLabel = _a.selectedDepartmentLabel, selectedProgrammeLabel = _a.selectedProgrammeLabel, selectedGroupLabel = _a.selectedGroupLabel, selectedRoomLabel = _a.selectedRoomLabel, clearDepartment = _a.clearDepartment, clearProgramme = _a.clearProgramme, clearGroup = _a.clearGroup, clearRoom = _a.clearRoom;
    var anyFilters = Boolean(selectedDepartment || selectedProgramme || selectedGroup || selectedRoom);
    return (react_1["default"].createElement("div", { className: "mb-4 space-y-3" },
        react_1["default"].createElement("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3" },
            react_1["default"].createElement("div", { className: "flex items-center gap-3" },
                react_1["default"].createElement("h2", { className: "text-2xl font-bold" }, "Schedule"),
                react_1["default"].createElement("div", { className: "flex items-center gap-2" },
                    react_1["default"].createElement("button", { onClick: function () { return setStackingMode(function (m) { return m === 'vertical' ? 'columns' : 'vertical'; }); }, className: "px-3 py-1 text-sm border rounded hover:bg-gray-100", title: "Toggle stacking mode" }, stackingMode === 'vertical' ? 'Stack: Vertical' : 'Stack: Columns'),
                    react_1["default"].createElement("button", { onClick: function () { return setIsFullscreen(!isFullscreen); }, className: "p-2 hover:bg-gray-100 rounded-lg transition-colors", "aria-label": isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen' }, isFullscreen ? react_1["default"].createElement(lucide_react_1.Minimize2, { className: "w-5 h-5" }) : react_1["default"].createElement(lucide_react_1.Maximize2, { className: "w-5 h-5" })))),
            react_1["default"].createElement("div", { className: "flex items-center gap-2" }, stats && (react_1["default"].createElement("div", { className: "hidden sm:flex items-center space-x-4 text-sm text-gray-600" },
                react_1["default"].createElement("div", null,
                    "Total: ",
                    react_1["default"].createElement("strong", { className: "ml-1" }, (_b = stats.totalClasses) !== null && _b !== void 0 ? _b : 0)),
                react_1["default"].createElement("div", null,
                    "Rooms: ",
                    react_1["default"].createElement("strong", { className: "ml-1" }, (_c = stats.roomsUsed) !== null && _c !== void 0 ? _c : 0)),
                react_1["default"].createElement("div", null,
                    "Groups: ",
                    react_1["default"].createElement("strong", { className: "ml-1" }, (_d = stats.groupsScheduled) !== null && _d !== void 0 ? _d : 0)))))),
        react_1["default"].createElement("div", { className: "flex flex-col sm:flex-row gap-3 items-stretch sm:items-center" },
            react_1["default"].createElement("input", { className: "w-full sm:flex-1 pl-4 pr-4 py-2 border rounded-lg", placeholder: "Search...", value: searchQuery, onChange: function (e) { return setSearchQuery(e.target.value); } }),
            react_1["default"].createElement("div", { className: "flex gap-2 items-center flex-wrap" },
                clearFilters && react_1["default"].createElement("button", { onClick: clearFilters, className: "px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg" }, "Clear"),
                selectedDepartment && (react_1["default"].createElement("div", { className: "flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-800 rounded-full text-sm" },
                    react_1["default"].createElement("span", null,
                        "Dept: ", selectedDepartmentLabel !== null && selectedDepartmentLabel !== void 0 ? selectedDepartmentLabel : selectedDepartment),
                    react_1["default"].createElement("button", { onClick: clearDepartment || (function () { return clearFilters && clearFilters(); }), "aria-label": "Clear department", className: "opacity-70 hover:opacity-100" }, "\u00D7"))),
                selectedProgramme && (react_1["default"].createElement("div", { className: "flex items-center gap-2 px-3 py-1 bg-green-50 text-green-800 rounded-full text-sm" },
                    react_1["default"].createElement("span", null,
                        "Prog: ", selectedProgrammeLabel !== null && selectedProgrammeLabel !== void 0 ? selectedProgrammeLabel : selectedProgramme),
                    react_1["default"].createElement("button", { onClick: clearProgramme || (function () { return clearFilters && clearFilters(); }), "aria-label": "Clear programme", className: "opacity-70 hover:opacity-100" }, "\u00D7"))),
                selectedGroup && (react_1["default"].createElement("div", { className: "flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-800 rounded-full text-sm" },
                    react_1["default"].createElement("span", null,
                        "Group: ", selectedGroupLabel !== null && selectedGroupLabel !== void 0 ? selectedGroupLabel : selectedGroup),
                    react_1["default"].createElement("button", { onClick: clearGroup || (function () { return clearFilters && clearFilters(); }), "aria-label": "Clear group", className: "opacity-70 hover:opacity-100" }, "\u00D7"))),
                selectedRoom && (react_1["default"].createElement("div", { className: "flex items-center gap-2 px-3 py-1 bg-yellow-50 text-yellow-800 rounded-full text-sm" },
                    react_1["default"].createElement("span", null,
                        "Room: ", selectedRoomLabel !== null && selectedRoomLabel !== void 0 ? selectedRoomLabel : selectedRoom),
                    react_1["default"].createElement("button", { onClick: clearRoom || (function () { return clearFilters && clearFilters(); }), "aria-label": "Clear room", className: "opacity-70 hover:opacity-100" }, "\u00D7")))))));
}
exports["default"] = ScheduleToolbar;
