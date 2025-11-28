"use client";
"use client";
"use strict";
exports.__esModule = true;
var react_1 = require("react");
function EventBlock(_a) {
    var id = _a.id, title = _a.title, start = _a.start, end = _a.end, room = _a.room, isLocked = _a.isLocked, onClick = _a.onClick;
    return (react_1["default"].createElement("div", { role: "button", tabIndex: 0, onClick: onClick, onMouseDown: function (e) { }, className: "rounded-lg p-3 text-sm select-none transition-all cursor-pointer bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 shadow-md hover:shadow-lg" },
        react_1["default"].createElement("div", { className: "flex items-center justify-between" },
            react_1["default"].createElement("div", { className: "font-medium" }, title || "Class " + id),
            isLocked && react_1["default"].createElement("div", { className: "text-xs px-2 py-0.5 rounded bg-yellow-100 text-yellow-800" }, "Locked")),
        react_1["default"].createElement("div", { className: "text-xs text-gray-600" },
            start,
            " - ",
            end,
            " \u2022 ",
            room)));
}
exports["default"] = EventBlock;
