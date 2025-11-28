/* eslint-disable */
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
var EventBlock_1 = require("./EventBlock");
function DayColumn(_a) {
    var _this = this;
    var day = _a.day, _b = _a.dayIdx, dayIdx = _b === void 0 ? 0 : _b, slots = _a.slots, events = _a.events, startHour = _a.startHour, pixelsPerMinute = _a.pixelsPerMinute, slotMinutes = _a.slotMinutes, slotHeights = _a.slotHeights, slotTopOffsets = _a.slotTopOffsets, dayHeight = _a.dayHeight, stackingMode = _a.stackingMode, _c = _a.columnWidth, columnWidth = _c === void 0 ? 150 : _c, draggingId = _a.draggingId, setDraggingId = _a.setDraggingId, preview = _a.preview, setPreview = _a.setPreview, conflictIds = _a.conflictIds, setConflictIds = _a.setConflictIds, _d = _a.schedules, schedules = _d === void 0 ? [] : _d, saveSchedule = _a.saveSchedule, nudgeSchedule = _a.nudgeSchedule, setSelectedId = _a.setSelectedId;
    // compute constants for placement
    var slotPx = slotMinutes * pixelsPerMinute;
    var STACK_OFFSET_PX = Math.min(16, slotPx * 0.4);
    var PADDING_PX = 4;
    // normalize events and sort by start time
    var evs = react_1.useMemo(function () {
        return (events || []).map(function (e) { return ({
            s: e.s,
            start: Number(e.start || 0),
            end: Number(e.end || 0)
        }); }).sort(function (a, b) {
            if (a.start === b.start)
                return (b.end - b.start) - (a.end - a.start);
            return a.start - b.start;
        });
    }, [events]);
    // assign lanes (interval graph coloring)
    var positioned = react_1.useMemo(function () {
        var lanesEnd = [];
        var out = [];
        var maxLane = 0;
        for (var _i = 0, evs_1 = evs; _i < evs_1.length; _i++) {
            var ev = evs_1[_i];
            var lane = -1;
            for (var i = 0; i < lanesEnd.length; i++) {
                if (ev.start >= lanesEnd[i]) {
                    lane = i;
                    break;
                }
            }
            if (lane === -1) {
                lane = lanesEnd.length;
                lanesEnd.push(ev.end);
            }
            else {
                lanesEnd[lane] = Math.max(lanesEnd[lane], ev.end);
            }
            maxLane = Math.max(maxLane, lane + 1);
            out.push(__assign(__assign({}, ev), { lane: lane, laneCount: lanesEnd.length }));
        }
        return { items: out, laneCount: Math.max(1, maxLane) };
    }, [evs]);
    // local refs and drag state
    var containerRef = react_1.useRef(null);
    var _e = react_1.useState(null), activeDragId = _e[0], setActiveDragId = _e[1];
    // selection
    // setSelectedId passed from ScheduleGrid to allow keyboard nudges
    // helper: convert absolute pageY to minutes from day start
    var minutesFromClientY = function (clientY) {
        var el = containerRef.current;
        if (!el)
            return 0;
        var rect = el.getBoundingClientRect();
        var y = clientY - rect.top;
        var minutes = Math.round(y / pixelsPerMinute);
        return Math.max(0, minutes + startHour * 60);
    };
    var minutesToTimeStr = function (mins) {
        var hh = Math.floor(mins / 60);
        var mm = mins % 60;
        var pad = function (n) { return String(n).padStart(2, '0'); };
        return pad(hh) + ":" + pad(mm);
    };
    react_1.useEffect(function () {
        var moving = false;
        var onMove = function (ev) {
            if (activeDragId === null && !draggingId)
                return;
            var id = activeDragId !== null && activeDragId !== void 0 ? activeDragId : draggingId;
            if (id == null)
                return;
            moving = true;
            var mins = minutesFromClientY(ev.clientY);
            // snap to slot minutes
            var snap = slotMinutes || 15;
            var snapped = Math.round(mins / snap) * snap;
            setPreview && setPreview({ dayIdx: dayIdx, startMin: snapped, durationMins: fixedDurationSafe() });
        };
        var onUp = function (ev) { return __awaiter(_this, void 0, void 0, function () {
            var id, mins, snap, snapped, sched, newStart, updated, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!moving) {
                            setActiveDragId(null);
                            return [2 /*return*/];
                        }
                        id = activeDragId !== null && activeDragId !== void 0 ? activeDragId : draggingId;
                        if (id == null) {
                            setActiveDragId(null);
                            setDraggingId && setDraggingId(null);
                            setPreview && setPreview(null);
                            return [2 /*return*/];
                        }
                        mins = minutesFromClientY(ev.clientY);
                        snap = slotMinutes || 15;
                        snapped = Math.round(mins / snap) * snap;
                        sched = schedules.find(function (s) { return Number(s.id) === Number(id); });
                        if (!(sched && saveSchedule)) return [3 /*break*/, 4];
                        newStart = minutesToTimeStr(snapped);
                        updated = __assign(__assign({}, sched), { start_time: newStart, day_of_week: day });
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
                        setActiveDragId(null);
                        setDraggingId && setDraggingId(null);
                        setPreview && setPreview(null);
                        return [2 /*return*/];
                }
            });
        }); };
        window.addEventListener('mousemove', onMove);
        window.addEventListener('mouseup', onUp);
        return function () { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeDragId, draggingId, dayIdx, slotMinutes, pixelsPerMinute, schedules, saveSchedule, setPreview, setDraggingId]);
    // safe access to fixedDuration (fallback to slotMinutes if settings unknown)
    function fixedDurationSafe() { return Math.max(1, Math.round((slotMinutes || 60))); }
    var uid = "daycol-" + dayIdx + "-" + day;
    // build dynamic css rules for event placement to avoid inline style props
    var css = react_1.useMemo(function () {
        var lines = [];
        // ensure the column bounds its children and prevents event cards from spilling out
        lines.push("." + uid + "{position:relative;height:" + dayHeight + "px;overflow:hidden;width:100%;box-sizing:border-box;}");
        slots.forEach(function (slot, idx) {
            // slot rows inherit tailwind height classes; add optional padding
            lines.push("." + uid + " .slot-" + idx + "{}");
        });
        for (var _i = 0, _a = positioned.items; _i < _a.length; _i++) {
            var ev = _a[_i];
            var dayStart = startHour * 60;
            var relStart = Math.max(0, ev.start - dayStart);
            var relEnd = Math.max(relStart + 1, ev.end - dayStart);
            var top = Math.max(0, Math.round(relStart * pixelsPerMinute + ev.lane * STACK_OFFSET_PX + PADDING_PX));
            var height = Math.max(8, Math.round((relEnd - relStart) * pixelsPerMinute - PADDING_PX * 2));
            var z = 20 + ev.lane;
            if (stackingMode === 'columns') {
                var laneCount = Math.max(1, positioned.laneCount);
                var w = Math.max(40, Math.floor((columnWidth - 8) / laneCount));
                var left = Math.round((ev.lane * (columnWidth / laneCount)) + 8);
                // ensure cards never exceed column bounds
                lines.push("." + uid + " .ev-" + ev.s.id + "{position:absolute;top:" + top + "px;height:" + height + "px;left:" + left + "px;width:" + w + "px;z-index:" + z + ";box-sizing:border-box;max-width:calc(100% - " + PADDING_PX * 2 + "px);}");
            }
            else {
                var left = PADDING_PX;
                var width = Math.max(40, Math.round(columnWidth - PADDING_PX * 2));
                lines.push("." + uid + " .ev-" + ev.s.id + "{position:absolute;top:" + top + "px;height:" + height + "px;left:" + left + "px;width:" + width + "px;z-index:" + z + ";box-sizing:border-box;max-width:calc(100% - " + PADDING_PX * 2 + "px);}");
            }
        }
        // preview placement when active for this column
        if (preview && preview.dayIdx === dayIdx) {
            var pr = preview;
            var dayStart = startHour * 60;
            var relStart = Math.max(0, pr.startMin - dayStart);
            var relEnd = Math.max(relStart + 1, (pr.startMin + (pr.durationMins || fixedDurationSafe())) - dayStart);
            var top = Math.max(0, Math.round(relStart * pixelsPerMinute + PADDING_PX));
            var height = Math.max(8, Math.round((relEnd - relStart) * pixelsPerMinute - PADDING_PX * 2));
            var left = PADDING_PX;
            var width = Math.max(40, Math.round(columnWidth - PADDING_PX * 2));
            lines.push("." + uid + " .preview-block{position:absolute;top:" + top + "px;height:" + height + "px;left:" + left + "px;width:" + width + "px;z-index:999;opacity:0.7;border:2px dashed rgba(59,130,246,0.6);background:linear-gradient(135deg, rgba(59,130,246,0.06), rgba(99,102,241,0.04));box-sizing:border-box;max-width:calc(100% - " + PADDING_PX * 2 + "px);}");
        }
        return lines.join('\n');
    }, [positioned, dayHeight, pixelsPerMinute, stackingMode, columnWidth, slots, startHour]);
    return (react_1["default"].createElement("div", { className: "p-0 border-l border-t bg-white" },
        react_1["default"].createElement("style", null, css),
        react_1["default"].createElement("div", { className: uid },
            react_1["default"].createElement("div", { className: "absolute inset-0" }, slots.map(function (slot) { return (react_1["default"].createElement("div", { key: "slot-" + day + "-" + slot.index, className: "text-xs text-gray-400 border-b h-16 slot-" + slot.index + " p-3" }, slot.label)); })),
            react_1["default"].createElement("div", { ref: containerRef },
                positioned.items.map(function (ev) { return (react_1["default"].createElement("div", { key: "ev-" + ev.s.id, className: "ev-" + ev.s.id + " " + (conflictIds && conflictIds.has(ev.s.id) ? 'border-rose-400 bg-rose-50' : ''), onMouseDown: function (e) { e.preventDefault(); setActiveDragId(Number(ev.s.id)); setDraggingId && setDraggingId(Number(ev.s.id)); } },
                    react_1["default"].createElement(EventBlock_1["default"], { id: ev.s.id, title: ev.s.class_group_name, start: ev.s.start_time, end: ev.s.end_time, room: ev.s.room_name, isLocked: ev.s.is_locked, onClick: function () { return setSelectedId && setSelectedId(Number(ev.s.id)); } }))); }),
                preview && preview.dayIdx === dayIdx && (react_1["default"].createElement("div", { className: "preview-block" },
                    react_1["default"].createElement(EventBlock_1["default"], { id: "preview-" + dayIdx, title: "Preview", start: minutesToTimeStr(preview.startMin), end: minutesToTimeStr(preview.startMin + (preview.durationMins || fixedDurationSafe())), room: '', isLocked: false })))))));
}
exports["default"] = DayColumn;
