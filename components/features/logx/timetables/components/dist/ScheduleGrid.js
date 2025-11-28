"use client";
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var react_1 = require("react");
var DayColumn_1 = require("./DayColumn");
function ScheduleGrid(_a) {
    var _this = this;
    var days = _a.days, slots = _a.slots, slotHeights = _a.slotHeights, slotTopOffsets = _a.slotTopOffsets, slotMinutes = _a.slotMinutes, pixelsPerMinute = _a.pixelsPerMinute, startHour = _a.startHour, totalHeight = _a.totalHeight, dayData = _a.dayData, stackingMode = _a.stackingMode, containerRef = _a.containerRef, columnWidth = _a.columnWidth, draggingId = _a.draggingId, setDraggingId = _a.setDraggingId, preview = _a.preview, setPreview = _a.setPreview, conflictIds = _a.conflictIds, setConflictIds = _a.setConflictIds, schedules = _a.schedules, saveSchedule = _a.saveSchedule, nudgeSchedule = _a.nudgeSchedule, setSelectedId = _a.setSelectedId;
    // refs to day column wrappers for hit testing during cross-column drags
    var colRefs = react_1["default"].useRef([]);
    // helper to format minutes -> HH:MM
    var pad = function (n) { return String(n).padStart(2, '0'); };
    var minutesToTime = function (mins) { return pad(Math.floor(mins / 60)) + ":" + pad(mins % 60); };
    react_1["default"].useEffect(function () {
        if (!draggingId)
            return;
        var active = true;
        var onMove = function (ev) {
            if (!active)
                return;
            // find column under pointer
            var foundIdx = -1;
            for (var i = 0; i < colRefs.current.length; i++) {
                var el = colRefs.current[i];
                if (!el)
                    continue;
                var r = el.getBoundingClientRect();
                if (ev.clientX >= r.left && ev.clientX <= r.right && ev.clientY >= r.top && ev.clientY <= r.bottom) {
                    foundIdx = i;
                    break;
                }
            }
            if (foundIdx === -1)
                return;
            var colEl = colRefs.current[foundIdx];
            if (!colEl)
                return;
            var rect = colEl.getBoundingClientRect();
            var relY = Math.max(0, ev.clientY - rect.top);
            var minsFromTop = Math.round(relY / pixelsPerMinute);
            var startMin = Math.max(0, minsFromTop + startHour * 60);
            var snap = slotMinutes || 15;
            var snapped = Math.round(startMin / snap) * snap;
            setPreview && setPreview({ dayIdx: foundIdx, startMin: snapped, durationMins: slotMinutes });
        };
        var onUp = function (ev) { return __awaiter(_this, void 0, void 0, function () {
            var foundIdx, i, el, r, colEl, rect, relY, minsFromTop, startMin, snap, snapped, id, sched, updated, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        active = false;
                        foundIdx = -1;
                        for (i = 0; i < colRefs.current.length; i++) {
                            el = colRefs.current[i];
                            if (!el)
                                continue;
                            r = el.getBoundingClientRect();
                            if (ev.clientX >= r.left && ev.clientX <= r.right && ev.clientY >= r.top && ev.clientY <= r.bottom) {
                                foundIdx = i;
                                break;
                            }
                        }
                        if (foundIdx === -1) {
                            setDraggingId && setDraggingId(null);
                            setPreview && setPreview(null);
                            return [2 /*return*/];
                        }
                        colEl = colRefs.current[foundIdx];
                        if (!colEl) {
                            setDraggingId && setDraggingId(null);
                            setPreview && setPreview(null);
                            return [2 /*return*/];
                        }
                        rect = colEl.getBoundingClientRect();
                        relY = Math.max(0, ev.clientY - rect.top);
                        minsFromTop = Math.round(relY / pixelsPerMinute);
                        startMin = Math.max(0, minsFromTop + startHour * 60);
                        snap = slotMinutes || 15;
                        snapped = Math.round(startMin / snap) * snap;
                        id = draggingId;
                        sched = (schedules || []).find(function (s) { return Number(s.id) === Number(id); });
                        if (!(sched && saveSchedule)) return [3 /*break*/, 4];
                        updated = __assign(__assign({}, sched), { start_time: minutesToTime(snapped), day_of_week: days[foundIdx] });
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, saveSchedule(updated)];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        e_1 = _a.sent();
                        console.error(e_1);
                        return [3 /*break*/, 4];
                    case 4:
                        setDraggingId && setDraggingId(null);
                        setPreview && setPreview(null);
                        return [2 /*return*/];
                }
            });
        }); };
        window.addEventListener('mousemove', onMove);
        window.addEventListener('mouseup', onUp);
        return function () { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
    }, [draggingId, colRefs, pixelsPerMinute, startHour, slotMinutes, setPreview, setDraggingId, schedules, saveSchedule, days]);
    return (react_1["default"].createElement("div", { className: "overflow-auto border rounded-lg shadow-sm", ref: containerRef },
        react_1["default"].createElement("div", { className: "flex" },
            react_1["default"].createElement("div", { className: "w-20 bg-gradient-to-br from-gray-50 to-gray-100 p-3 font-semibold text-gray-700 border-r" }, "Time"),
            days.map(function (d, i) { return (react_1["default"].createElement("div", { key: "hdr-" + d, className: "flex-1 p-3 text-center font-semibold text-gray-700 border-r " + (preview && preview.dayIdx === i ? 'bg-blue-100/60 ring-2 ring-blue-200' : 'bg-gradient-to-br from-blue-50 to-indigo-50') }, d.charAt(0).toUpperCase() + d.slice(1))); })),
        react_1["default"].createElement("div", { className: "flex" },
            react_1["default"].createElement("div", { className: "w-20 bg-white border-r" }, slots.map(function (slot) { return (react_1["default"].createElement("div", { key: "label-" + slot.index, className: "p-3 text-xs text-gray-500 font-medium border-b h-16" }, slot.label)); })),
            days.map(function (d, di) { return (react_1["default"].createElement("div", { key: "daycol-" + d, className: "flex-1", ref: function (el) { colRefs.current[di] = el; } },
                react_1["default"].createElement(DayColumn_1["default"], { day: d, dayIdx: di, slots: slots, events: dayData[d] || [], startHour: startHour, pixelsPerMinute: pixelsPerMinute, slotMinutes: slotMinutes, slotHeights: slotHeights, slotTopOffsets: slotTopOffsets, dayHeight: totalHeight, stackingMode: stackingMode, columnWidth: columnWidth, draggingId: draggingId, setDraggingId: setDraggingId, preview: preview, setPreview: setPreview, conflictIds: conflictIds, setConflictIds: setConflictIds, schedules: schedules, saveSchedule: saveSchedule, nudgeSchedule: nudgeSchedule, setSelectedId: setSelectedId }))); }))));
}
exports["default"] = ScheduleGrid;
