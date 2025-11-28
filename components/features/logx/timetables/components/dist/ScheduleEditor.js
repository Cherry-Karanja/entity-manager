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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
/* eslint-disable @typescript-eslint/no-explicit-any */
var react_1 = require("react");
var useDebounce_1 = require("@/hooks/useDebounce");
var framer_motion_1 = require("framer-motion");
var client_1 = require("../../class-group-schedules/api/client");
var timetable_settings_1 = require("../../timetable-settings");
var institution_1 = require("@/components/features/institution");
var rooms_1 = require("../../rooms");
var lucide_react_1 = require("lucide-react");
var ScheduleToolbar_1 = require("./ScheduleToolbar");
var ScheduleFilters_1 = require("./ScheduleFilters");
var ScheduleGrid_1 = require("./ScheduleGrid");
var pad = function (n) { return String(n).padStart(2, '0'); };
var formatTime = function (h, m) { return pad(h) + ":" + pad(m); };
function ScheduleEditor(_a) {
    var _this = this;
    var _b, _c;
    var timetableId = _a.timetableId;
    var _d = react_1.useState([]), schedules = _d[0], setSchedules = _d[1];
    var _e = react_1.useState([]), filteredSchedules = _e[0], setFilteredSchedules = _e[1];
    var _f = react_1.useState(null), timetableSettings = _f[0], setTimetableSettings = _f[1];
    var _g = react_1.useState(''), searchQuery = _g[0], setSearchQuery = _g[1];
    var _h = react_1.useState(''), selectedRoom = _h[0], setSelectedRoom = _h[1];
    var _j = react_1.useState(''), selectedGroup = _j[0], setSelectedGroup = _j[1];
    var _k = react_1.useState(false), isFullscreen = _k[0], setIsFullscreen = _k[1];
    // placeholder for potential hover state (not used in refactor yet)
    var HOUR_PX = 60;
    var pixelsPerMinute = HOUR_PX / 60;
    var slotMinutes = (_b = timetableSettings === null || timetableSettings === void 0 ? void 0 : timetableSettings.slot_duration_minutes) !== null && _b !== void 0 ? _b : 60;
    // Fixed session duration (defined by timetable settings). Sessions always use this length.
    var fixedDuration = (_c = timetableSettings === null || timetableSettings === void 0 ? void 0 : timetableSettings.preferred_class_duration) !== null && _c !== void 0 ? _c : slotMinutes;
    var containerRef = react_1.useRef(null);
    var _l = react_1.useState(150), columnWidth = _l[0], setColumnWidth = _l[1];
    var _m = react_1.useState(null), draggingId = _m[0], setDraggingId = _m[1];
    var _o = react_1.useState(null), preview = _o[0], setPreview = _o[1];
    var _p = react_1.useState(null), pendingSave = _p[0], setPendingSave = _p[1];
    var _q = react_1.useState(false), showConflictModal = _q[0], setShowConflictModal = _q[1];
    var _r = react_1.useState(new Set()), conflictIds = _r[0], setConflictIds = _r[1];
    var _s = react_1.useState(null), selectedId = _s[0], setSelectedId = _s[1];
    var _t = react_1.useState('vertical'), stackingMode = _t[0], setStackingMode = _t[1];
    var _u = react_1.useState(null), notification = _u[0], setNotification = _u[1];
    var _v = react_1.useState([]), departments = _v[0], setDepartments = _v[1];
    var _w = react_1.useState([]), programmes = _w[0], setProgrammes = _w[1];
    var _x = react_1.useState([]), classGroupsOptions = _x[0], setClassGroupsOptions = _x[1];
    var _y = react_1.useState([]), roomsOptions = _y[0], setRoomsOptions = _y[1];
    var _z = react_1.useState(undefined), selectedProgramme = _z[0], setSelectedProgramme = _z[1];
    var _0 = react_1.useState(1), programmesPage = _0[0], setProgrammesPage = _0[1];
    var _1 = react_1.useState(1), classGroupsPage = _1[0], setClassGroupsPage = _1[1];
    var _2 = react_1.useState(1), roomsPage = _2[0], setRoomsPage = _2[1];
    var PAGE_SIZE = 25;
    var debouncedDeptSearch = useDebounce_1.useDebounceSearch('', 300).debouncedSearchTerm;
    var debouncedProgrammeSearch = useDebounce_1.useDebounceSearch('', 300).debouncedSearchTerm;
    var debouncedGroupSearch = useDebounce_1.useDebounceSearch('', 300).debouncedSearchTerm;
    var debouncedRoomSearch = useDebounce_1.useDebounceSearch('', 300).debouncedSearchTerm;
    var _3 = react_1.useState(undefined), selectedDepartment = _3[0], setSelectedDepartment = _3[1];
    var searchRef = react_1.useRef(null);
    var classGroupsReqRef = react_1.useRef(0);
    var roomsReqRef = react_1.useRef(0);
    var programmesReqRef = react_1.useRef(0);
    var schedulesReqRef = react_1.useRef(0);
    var nudgeRef = react_1.useRef(null);
    // clamp helper was used in previous placement calculations; kept inline in helpers as needed
    // Auto-dismiss notifications
    react_1.useEffect(function () {
        if (notification) {
            var timer_1 = setTimeout(function () { return setNotification(null); }, 4000);
            return function () { return clearTimeout(timer_1); };
        }
    }, [notification]);
    react_1.useEffect(function () {
        var mounted = true;
        function load() {
            return __awaiter(this, void 0, void 0, function () {
                var resp, items, tt, ttItems, firstSetting, dResp, dItems, err_1, e_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 7, , 8]);
                            return [4 /*yield*/, client_1.classGroupScheduleApi.list({ timetable: timetableId, pageSize: 1000 })];
                        case 1:
                            resp = _a.sent();
                            items = resp.results || resp.data || resp;
                            if (mounted) {
                                setSchedules(items || []);
                                setFilteredSchedules(items || []);
                            }
                            return [4 /*yield*/, timetable_settings_1.timetableSettingClient.list({ timetable: timetableId })];
                        case 2:
                            tt = _a.sent();
                            ttItems = tt.results || tt.data || tt;
                            firstSetting = null;
                            if (Array.isArray(ttItems)) {
                                firstSetting = ttItems[0] || null;
                            }
                            else if (ttItems && typeof ttItems === 'object') {
                                firstSetting = ttItems;
                            }
                            if (mounted)
                                setTimetableSettings(firstSetting);
                            _a.label = 3;
                        case 3:
                            _a.trys.push([3, 5, , 6]);
                            return [4 /*yield*/, institution_1.departmentsApiClient.list({ pageSize: 50 })];
                        case 4:
                            dResp = _a.sent();
                            dItems = dResp.results || dResp.data || dResp;
                            if (mounted && Array.isArray(dItems))
                                setDepartments(dItems);
                            return [3 /*break*/, 6];
                        case 5:
                            err_1 = _a.sent();
                            console.warn('Failed to fetch departments', err_1);
                            return [3 /*break*/, 6];
                        case 6: return [3 /*break*/, 8];
                        case 7:
                            e_1 = _a.sent();
                            console.error(e_1);
                            if (mounted)
                                setNotification({ type: 'error', message: 'Failed to load schedules' });
                            return [3 /*break*/, 8];
                        case 8: return [2 /*return*/];
                    }
                });
            });
        }
        load();
        return function () { mounted = false; };
    }, [timetableId]);
    // Fetch schedules from backend when filters change so displayed data is authoritative
    react_1.useEffect(function () {
        var mounted = true;
        var reqId = schedulesReqRef.current + 1;
        schedulesReqRef.current = reqId;
        // only fetch when there's a timetable and at least one filter is set (avoids unnecessary re-fetch)
        var shouldFetch = Boolean(timetableId && (selectedDepartment || selectedProgramme || selectedGroup || selectedRoom || debouncedGroupSearch || debouncedRoomSearch));
        if (!shouldFetch)
            return;
        (function () { return __awaiter(_this, void 0, void 0, function () {
            var params, res, items, err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        params = { timetable: timetableId, pageSize: 1000 };
                        if (selectedGroup)
                            params.class_group = selectedGroup;
                        else if (selectedProgramme)
                            params['class_group__programme'] = selectedProgramme;
                        else if (selectedDepartment)
                            params['class_group__programme__department'] = selectedDepartment;
                        if (selectedRoom)
                            params.room = selectedRoom;
                        // include group/room search as server search when present
                        if (debouncedGroupSearch)
                            params.search = debouncedGroupSearch;
                        if (debouncedRoomSearch && !debouncedGroupSearch)
                            params.search = debouncedRoomSearch;
                        return [4 /*yield*/, client_1.classGroupScheduleApi.list(params)];
                    case 1:
                        res = _a.sent();
                        if (!mounted)
                            return [2 /*return*/];
                        if (schedulesReqRef.current !== reqId)
                            return [2 /*return*/];
                        items = res.results || res.data || res || [];
                        setSchedules(items);
                        setFilteredSchedules(items);
                        return [3 /*break*/, 3];
                    case 2:
                        err_2 = _a.sent();
                        console.warn('Failed to fetch filtered schedules', err_2);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); })();
        return function () { mounted = false; };
    }, [timetableId, selectedDepartment, selectedProgramme, selectedGroup, selectedRoom, debouncedGroupSearch, debouncedRoomSearch]);
    // Debounced search for departments
    react_1.useEffect(function () {
        var mounted = true;
        (function () { return __awaiter(_this, void 0, void 0, function () {
            var q, resp, items, err_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        q = (debouncedDeptSearch || '').trim();
                        if (!q)
                            return [2 /*return*/];
                        return [4 /*yield*/, institution_1.departmentsApiClient.list({ search: q, pageSize: 100 })];
                    case 1:
                        resp = _a.sent();
                        items = resp.results || resp.data || resp;
                        if (mounted && Array.isArray(items))
                            setDepartments(items);
                        return [3 /*break*/, 3];
                    case 2:
                        err_3 = _a.sent();
                        console.warn('Department search failed', err_3);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); })();
        return function () { mounted = false; };
    }, [debouncedDeptSearch, selectedDepartment]);
    react_1.useEffect(function () {
        // reset paging when search or department changes
        setClassGroupsPage(1);
    }, [selectedDepartment, debouncedGroupSearch]);
    // reset paging when programme changes or group search changes
    react_1.useEffect(function () {
        setClassGroupsPage(1);
    }, [selectedProgramme, debouncedGroupSearch]);
    react_1.useEffect(function () {
        var mounted = true;
        var reqId = classGroupsReqRef.current + 1;
        classGroupsReqRef.current = reqId;
        // guard: only run if there's either a department, programme or a search term
        if (!selectedDepartment && !selectedProgramme && !debouncedGroupSearch) {
            setClassGroupsOptions([]);
            return;
        }
        ;
        (function () { return __awaiter(_this, void 0, void 0, function () {
            var params, res, items_1, err_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        params = { pageSize: PAGE_SIZE, page: classGroupsPage };
                        // backend expects Django-style lookup params for nested filters
                        if (selectedProgramme)
                            params['class_group__programme'] = selectedProgramme;
                        else if (selectedDepartment)
                            params['class_group__programme__department'] = selectedDepartment;
                        // allow optional filtering of class group options by room (show only groups that have schedules in the room)
                        if (selectedRoom)
                            params.room = selectedRoom;
                        if (debouncedGroupSearch)
                            params.search = debouncedGroupSearch;
                        return [4 /*yield*/, institution_1.classGroupsApiClient.list(params)];
                    case 1:
                        res = _a.sent();
                        if (!mounted)
                            return [2 /*return*/];
                        // ignore stale responses
                        if (classGroupsReqRef.current !== reqId)
                            return [2 /*return*/];
                        items_1 = res.results || res.data || res || [];
                        // append or replace based on page
                        setClassGroupsOptions(function (prev) { return classGroupsPage > 1 ? __spreadArrays(prev, items_1) : items_1; });
                        return [3 /*break*/, 3];
                    case 2:
                        err_4 = _a.sent();
                        console.warn('Failed to fetch class groups', err_4);
                        if (classGroupsPage === 1)
                            setClassGroupsOptions([]);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); })();
        return function () { mounted = false; };
    }, [selectedDepartment, selectedProgramme, debouncedGroupSearch, classGroupsPage, selectedRoom]);
    // Also trigger class group fetch when debouncedGroupSearch changes
    react_1.useEffect(function () {
        // NOTE: removed duplicate effect — class groups are fetched in the main effect above
    }, [debouncedGroupSearch, selectedDepartment, selectedProgramme]);
    // ensure search-only class group effect also reruns when selectedProgramme changes
    // Fetch programmes for selected department (paginated + search)
    react_1.useEffect(function () {
        var mounted = true;
        // if no department and no search, clear
        if (!selectedDepartment && !debouncedProgrammeSearch) {
            setProgrammes([]);
            return;
        }
        var reqId = programmesReqRef.current + 1;
        programmesReqRef.current = reqId;
        (function () { return __awaiter(_this, void 0, void 0, function () {
            var params, res, items_2, err_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        params = { pageSize: PAGE_SIZE, page: programmesPage };
                        if (selectedDepartment)
                            params.department = selectedDepartment;
                        if (debouncedProgrammeSearch)
                            params.search = debouncedProgrammeSearch;
                        return [4 /*yield*/, institution_1.programmesApiClient.list(params)];
                    case 1:
                        res = _a.sent();
                        if (!mounted)
                            return [2 /*return*/];
                        if (programmesReqRef.current !== reqId)
                            return [2 /*return*/];
                        items_2 = res.results || res.data || res || [];
                        setProgrammes(function (prev) { return programmesPage > 1 ? __spreadArrays(prev, items_2) : items_2; });
                        return [3 /*break*/, 3];
                    case 2:
                        err_5 = _a.sent();
                        console.warn('Failed to fetch programmes', err_5);
                        if (programmesPage === 1)
                            setProgrammes([]);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); })();
        return function () { mounted = false; };
    }, [selectedDepartment, debouncedProgrammeSearch, programmesPage]);
    // reset programmes when department changes
    react_1.useEffect(function () {
        setSelectedProgramme(undefined);
        setProgrammes([]);
        setProgrammesPage(1);
    }, [selectedDepartment]);
    react_1.useEffect(function () {
        // reset rooms page when search or group/department changes
        setRoomsPage(1);
    }, [selectedGroup, debouncedRoomSearch, selectedDepartment]);
    react_1.useEffect(function () {
        var mounted = true;
        var reqId = roomsReqRef.current + 1;
        roomsReqRef.current = reqId;
        if (!selectedGroup && !debouncedRoomSearch && !selectedDepartment) {
            setRoomsOptions([]);
            return;
        }
        ;
        (function () { return __awaiter(_this, void 0, void 0, function () {
            var params, sg, derivedDept, res, items_3, err_6;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 2, , 3]);
                        params = { pageSize: PAGE_SIZE, page: roomsPage };
                        // derive department from selectedGroup when available
                        if (selectedGroup) {
                            sg = classGroupsOptions.find(function (g) { return String(g.id || g.pk || g.name) === String(selectedGroup); });
                            derivedDept = ((_a = sg === null || sg === void 0 ? void 0 : sg.programme) === null || _a === void 0 ? void 0 : _a.department) || ((_b = sg === null || sg === void 0 ? void 0 : sg.programme) === null || _b === void 0 ? void 0 : _b.department_id) || (sg === null || sg === void 0 ? void 0 : sg.department) || (sg === null || sg === void 0 ? void 0 : sg.department_id) || selectedDepartment;
                            if (derivedDept)
                                params.department = derivedDept;
                        }
                        else if (selectedDepartment) {
                            params.department = selectedDepartment;
                        }
                        if (debouncedRoomSearch)
                            params.search = debouncedRoomSearch;
                        return [4 /*yield*/, rooms_1.roomClient.list(params)];
                    case 1:
                        res = _c.sent();
                        if (!mounted)
                            return [2 /*return*/];
                        // ignore stale responses
                        if (roomsReqRef.current !== reqId)
                            return [2 /*return*/];
                        items_3 = res.results || res.data || res || [];
                        setRoomsOptions(function (prev) { return roomsPage > 1 ? __spreadArrays(prev, items_3) : items_3; });
                        return [3 /*break*/, 3];
                    case 2:
                        err_6 = _c.sent();
                        console.warn('Failed to fetch rooms', err_6);
                        if (roomsPage === 1)
                            setRoomsOptions([]);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); })();
        return function () { mounted = false; };
    }, [selectedGroup, debouncedRoomSearch, roomsPage, selectedDepartment, classGroupsOptions]);
    // Filter schedules based on search and filters
    react_1.useEffect(function () {
        var filtered = schedules;
        var query = (searchQuery || '').trim().toLowerCase();
        if (query) {
            filtered = filtered.filter(function (s) {
                return ((s.class_group_name || '').toLowerCase().includes(query) ||
                    (s.room_name || '').toLowerCase().includes(query) ||
                    (s.class_group !== undefined && s.class_group !== null && String(s.class_group).toLowerCase().includes(query)));
            });
        }
        if (selectedRoom) {
            // selectedRoom may be an id (from backend) or a room name
            var rid_1 = Number(selectedRoom || NaN);
            filtered = filtered.filter(function (s) {
                return ((s.room && (Number(s.room) === rid_1)) ||
                    (s.room_id && Number(s.room_id) === rid_1) ||
                    s.room_name === selectedRoom || String(s.room) === selectedRoom);
            });
        }
        if (selectedGroup) {
            var gid_1 = Number(selectedGroup || NaN);
            filtered = filtered.filter(function (s) {
                return ((s.class_group && Number(s.class_group) === gid_1) ||
                    (s.class_group_name === selectedGroup) ||
                    String(s.class_group) === selectedGroup);
            });
        }
        setFilteredSchedules(filtered);
    }, [schedules, searchQuery, selectedRoom, selectedGroup]);
    // keyboard shortcut to focus search ("/" or Ctrl+K)
    react_1.useEffect(function () {
        var handler = function (e) {
            var _a;
            if ((e.key === '/' || (e.ctrlKey && e.key.toLowerCase() === 'k')) && document.activeElement && (document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA')) {
                e.preventDefault();
                (_a = searchRef.current) === null || _a === void 0 ? void 0 : _a.focus();
            }
        };
        window.addEventListener('keydown', handler);
        return function () { return window.removeEventListener('keydown', handler); };
    }, []);
    // keyboard nudges for selected schedule (arrow keys)
    react_1.useEffect(function () {
        var handler = function (e) {
            var _a, _b, _c, _d;
            if (!selectedId)
                return;
            var sched = schedules.find(function (s) { return Number(s.id) === Number(selectedId); });
            if (!sched)
                return;
            if (e.key === 'ArrowUp') {
                e.preventDefault();
                (_a = nudgeRef.current) === null || _a === void 0 ? void 0 : _a.call(nudgeRef, sched, -slotMinutes);
            }
            else if (e.key === 'ArrowDown') {
                e.preventDefault();
                (_b = nudgeRef.current) === null || _b === void 0 ? void 0 : _b.call(nudgeRef, sched, slotMinutes);
            }
            else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                (_c = nudgeRef.current) === null || _c === void 0 ? void 0 : _c.call(nudgeRef, sched, 0, -1);
            }
            else if (e.key === 'ArrowRight') {
                e.preventDefault();
                (_d = nudgeRef.current) === null || _d === void 0 ? void 0 : _d.call(nudgeRef, sched, 0, 1);
            }
        };
        window.addEventListener('keydown', handler);
        return function () { return window.removeEventListener('keydown', handler); };
    }, [selectedId, schedules, slotMinutes]);
    var days = react_1.useMemo(function () {
        if ((timetableSettings === null || timetableSettings === void 0 ? void 0 : timetableSettings.enabled_days) && timetableSettings.enabled_days.length)
            return timetableSettings.enabled_days;
        return ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
    }, [timetableSettings]);
    var startHour = (timetableSettings === null || timetableSettings === void 0 ? void 0 : timetableSettings.start_hour) ? parseInt(timetableSettings.start_hour.split(':')[0], 10) : 8;
    var endHour = (timetableSettings === null || timetableSettings === void 0 ? void 0 : timetableSettings.end_hour) ? parseInt(timetableSettings.end_hour.split(':')[0], 10) : 17;
    var totalMinutes = Math.max(0, (endHour - startHour) * 60);
    var slotsCount = Math.max(1, Math.ceil(totalMinutes / slotMinutes));
    var slots = Array.from({ length: slotsCount }).map(function (_, i) {
        var total = startHour * 60 + i * slotMinutes;
        return { index: i, total: total, label: formatTime(Math.floor(total / 60), total % 60) };
    });
    var slotPx = slotMinutes * pixelsPerMinute;
    function parseTime(t) { var _a = (t || '00:00').split(':').map(function (x) { return parseInt(x || '0', 10) || 0; }), hh = _a[0], mm = _a[1]; return { hh: hh, mm: mm }; }
    var timeStrToMinutes = react_1.useCallback(function (t) {
        var _a = parseTime(t), hh = _a.hh, mm = _a.mm;
        return hh * 60 + mm;
    }, []);
    // Statistics
    var stats = react_1.useMemo(function () {
        var totalClasses = filteredSchedules.length;
        var roomsUsed = new Set(filteredSchedules.map(function (s) { return s.room_name; }).filter(Boolean)).size;
        var groupsScheduled = new Set(filteredSchedules.map(function (s) { return s.class_group; })).size;
        var lockedClasses = filteredSchedules.filter(function (s) { return s.is_locked; }).length;
        return { totalClasses: totalClasses, roomsUsed: roomsUsed, groupsScheduled: groupsScheduled, lockedClasses: lockedClasses };
    }, [filteredSchedules]);
    // NOTE: filter option lists are provided by backend clients (departments, classGroupsOptions, roomsOptions)
    // If a room is selected, narrow class group options to those that actually have schedules in that room
    var visibleClassGroups = react_1.useMemo(function () {
        if (!selectedRoom)
            return classGroupsOptions;
        // match schedules to class groups by id/PK/name and room by id or name
        return classGroupsOptions.filter(function (g) {
            var _a, _b, _c;
            var gid = String((_c = (_b = (_a = g.id) !== null && _a !== void 0 ? _a : g.pk) !== null && _b !== void 0 ? _b : g.name) !== null && _c !== void 0 ? _c : '');
            return filteredSchedules.some(function (s) {
                var _a, _b, _c, _d, _e, _f;
                var sG = String((_c = (_b = (_a = s.class_group) !== null && _a !== void 0 ? _a : s.class_group_id) !== null && _b !== void 0 ? _b : s.class_group_name) !== null && _c !== void 0 ? _c : '');
                var sRoom = String((_f = (_e = (_d = s.room) !== null && _d !== void 0 ? _d : s.room_id) !== null && _e !== void 0 ? _e : s.room_name) !== null && _f !== void 0 ? _f : '');
                return sG === gid && (sRoom === String(selectedRoom) || String(s.room_name) === String(selectedRoom));
            });
        });
    }, [classGroupsOptions, selectedRoom, filteredSchedules]);
    // Max display columns (legacy) - kept for reference; current stacking uses dynamic offsets (unused)
    // Vertical stacking and padding are handled in the DayColumn component after refactor
    // Each logical slot maps to a fixed pixel height so schedule blocks align precisely
    var slotHeights = react_1.useMemo(function () { return Array.from({ length: slotsCount }).map(function () { return slotPx; }); }, [slotsCount, slotPx]);
    var totalHeight = react_1.useMemo(function () { return Math.max(48, slotsCount * slotPx); }, [slotsCount, slotPx]);
    var slotTopOffsets = react_1.useMemo(function () {
        var out = [];
        var acc = 0;
        for (var i = 0; i < slotHeights.length; i++) {
            out.push(acc);
            acc += slotHeights[i];
        }
        return out;
    }, [slotHeights]);
    react_1.useEffect(function () {
        var measure = function () {
            var el = containerRef.current;
            if (!el)
                return;
            var rect = el.getBoundingClientRect();
            var available = Math.max(200, rect.width - 80);
            var w = Math.max(100, Math.floor(available / Math.max(1, days.length)));
            setColumnWidth(w);
        };
        measure();
        window.addEventListener('resize', measure);
        return function () { return window.removeEventListener('resize', measure); };
    }, [slots.length, days.length]);
    var hasLocalOverlap = react_1.useCallback(function (updated) {
        var updStart = timeStrToMinutes(updated.start_time);
        var updEnd = updStart + fixedDuration;
        return schedules.some(function (s) {
            if (s.id === updated.id)
                return false;
            if (s.day_of_week !== updated.day_of_week)
                return false;
            var sStart = timeStrToMinutes(s.start_time);
            var sEnd = sStart + fixedDuration;
            return (sStart < updEnd && sEnd > updStart);
        });
    }, [timeStrToMinutes, fixedDuration, schedules]);
    var checkConstraintsLocally = react_1.useCallback(function (updated) {
        var violations = [];
        if (!timetableSettings)
            return violations;
        var preferred = timetableSettings.preferred_class_duration || 0;
        var minBreak = timetableSettings.min_break_between_classes || 0;
        var maxConsec = timetableSettings.max_consecutive_classes || 0;
        var start = timeStrToMinutes(updated.start_time);
        var duration = fixedDuration;
        var end = start + duration;
        if (preferred > 0 && duration !== preferred) {
            violations.push("Duration " + duration + "m does not match preferred class duration of " + preferred + "m.");
        }
        if (minBreak > 0 && updated.class_group) {
            var sameGroup = schedules.filter(function (s) { return s.id !== updated.id && s.day_of_week === updated.day_of_week && s.class_group === updated.class_group; });
            for (var _i = 0, sameGroup_1 = sameGroup; _i < sameGroup_1.length; _i++) {
                var s = sameGroup_1[_i];
                var sStart = timeStrToMinutes(s.start_time);
                var sEnd = sStart + fixedDuration;
                var gap = Math.max(0, Math.min(Math.abs(sStart - end), Math.abs(start - sEnd)));
                if (gap < minBreak) {
                    violations.push("Break between classes for this group is " + gap + "m which is less than the minimum " + minBreak + "m.");
                    break;
                }
            }
        }
        if (maxConsec > 0 && updated.class_group) {
            var sameDay = schedules.filter(function (s) { return s.id !== updated.id && s.day_of_week === updated.day_of_week && s.class_group === updated.class_group; });
            var times = sameDay.map(function (s) { return ({ start: timeStrToMinutes(s.start_time), end: timeStrToMinutes(s.start_time) + fixedDuration }); });
            times.push({ start: start, end: end });
            times.sort(function (a, b) { return a.start - b.start; });
            var consecutive = 1;
            var maxFound = 1;
            for (var i = 1; i < times.length; i++) {
                var gap = times[i].start - times[i - 1].end;
                if (gap <= (minBreak || 0)) {
                    consecutive += 1;
                }
                else {
                    consecutive = 1;
                }
                maxFound = Math.max(maxFound, consecutive);
            }
            if (maxFound > maxConsec) {
                violations.push("This change would create " + maxFound + " consecutive classes for the group (limit is " + maxConsec + ").");
            }
        }
        return violations;
    }, [timetableSettings, schedules, timeStrToMinutes, fixedDuration]);
    var performSave = react_1.useCallback(function (updated) { return __awaiter(_this, void 0, void 0, function () {
        var prev, start, end, err_7;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    prev = schedules;
                    setSchedules(function (arr) { return arr.map(function (it) { return it.id === updated.id ? updated : it; }); });
                    setPendingSave(null);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    start = timeStrToMinutes(updated.start_time);
                    end = formatTime(Math.floor((start + fixedDuration) / 60), (start + fixedDuration) % 60);
                    return [4 /*yield*/, client_1.classGroupScheduleApi.update(updated.id, {
                            start_time: updated.start_time,
                            end_time: end,
                            day_of_week: updated.day_of_week
                        })];
                case 2:
                    _a.sent();
                    setNotification({ type: 'success', message: 'Schedule updated successfully' });
                    return [3 /*break*/, 4];
                case 3:
                    err_7 = _a.sent();
                    setSchedules(prev);
                    setNotification({ type: 'error', message: 'Failed to save schedule' });
                    console.error('Failed to save schedule', err_7);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); }, [schedules, setSchedules, timeStrToMinutes, fixedDuration]);
    var saveSchedule = react_1.useCallback(function (updated) { return __awaiter(_this, void 0, void 0, function () {
        var localViolations, constraintViolations, serverConflicts, dayIdx, ttId, excludeId, start_1, endTime_1, resp, err_8, start, endTime, toSave;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    localViolations = [];
                    if (hasLocalOverlap(updated))
                        localViolations.push('This schedule overlaps with an existing schedule.');
                    constraintViolations = checkConstraintsLocally(updated);
                    if (constraintViolations.length)
                        localViolations.push.apply(localViolations, constraintViolations);
                    serverConflicts = undefined;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    dayIdx = days.indexOf(updated.day_of_week);
                    ttId = Number(timetableId);
                    excludeId = updated.id ? Number(updated.id) : undefined;
                    start_1 = timeStrToMinutes(updated.start_time);
                    endTime_1 = formatTime(Math.floor((start_1 + fixedDuration) / 60), (start_1 + fixedDuration) % 60);
                    return [4 /*yield*/, client_1.classGroupScheduleApi.checkConflicts(ttId, dayIdx, updated.start_time, endTime_1, excludeId)];
                case 2:
                    resp = _a.sent();
                    if (resp && resp.conflicts && resp.conflicts.length)
                        serverConflicts = resp.conflicts;
                    return [3 /*break*/, 4];
                case 3:
                    err_8 = _a.sent();
                    console.warn('Constraint check failed (server), proceeding to inline warnings', err_8);
                    return [3 /*break*/, 4];
                case 4:
                    if (localViolations.length || (serverConflicts && serverConflicts.length)) {
                        setPendingSave({ updated: updated, localViolations: localViolations, serverConflicts: serverConflicts });
                        return [2 /*return*/];
                    }
                    start = timeStrToMinutes(updated.start_time);
                    endTime = formatTime(Math.floor((start + fixedDuration) / 60), (start + fixedDuration) % 60);
                    toSave = __assign(__assign({}, updated), { end_time: endTime });
                    return [4 /*yield*/, performSave(toSave)];
                case 5:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); }, [hasLocalOverlap, checkConstraintsLocally, days, timetableId, timeStrToMinutes, fixedDuration, performSave]);
    var nudgeSchedule = react_1.useCallback(function (s, deltaMins, deltaDays) {
        if (deltaDays === void 0) { deltaDays = 0; }
        try {
            var orig = parseTime(s.start_time);
            var origTotal = orig.hh * 60 + orig.mm;
            var duration = fixedDuration;
            var snap = slotMinutes;
            var newTotal = origTotal + deltaMins;
            newTotal = Math.round(newTotal / snap) * snap;
            var newHour = Math.floor(newTotal / 60);
            var newMin = newTotal % 60;
            newHour = Math.max(startHour, Math.min(newHour, endHour - Math.ceil(duration / 60)));
            var startStr = formatTime(newHour, newMin);
            var endTotal = newHour * 60 + newMin + duration;
            var endStr = formatTime(Math.floor(endTotal / 60), endTotal % 60);
            var origDay = days.indexOf(s.day_of_week);
            var newDay = Math.max(0, Math.min(origDay + deltaDays, days.length - 1));
            var updated = __assign(__assign({}, s), { start_time: startStr, end_time: endStr, day_of_week: days[newDay] });
            // fire-and-forget
            void saveSchedule(updated);
        }
        catch (err) {
            console.error('nudge error', err);
        }
    }, [fixedDuration, slotMinutes, startHour, endHour, days, saveSchedule]);
    // expose current nudge function to a ref so earlier effects can call it without TDZ
    react_1.useEffect(function () {
        nudgeRef.current = nudgeSchedule;
        return function () { nudgeRef.current = null; };
    }, [nudgeSchedule]);
    var clearFilters = function () {
        setSearchQuery('');
        setSelectedRoom('');
        setSelectedGroup('');
        setSelectedProgramme(undefined);
        setSelectedDepartment(undefined);
    };
    return (react_1["default"].createElement("div", { className: "w-full " + (isFullscreen ? 'fixed inset-0 z-50 bg-white p-6' : '') },
        react_1["default"].createElement(ScheduleToolbar_1["default"], { stackingMode: stackingMode, setStackingMode: setStackingMode, isFullscreen: isFullscreen, setIsFullscreen: setIsFullscreen, searchQuery: searchQuery, setSearchQuery: setSearchQuery, stats: stats, clearFilters: clearFilters, selectedDepartment: selectedDepartment, selectedProgramme: selectedProgramme, selectedGroup: selectedGroup, selectedRoom: selectedRoom, selectedDepartmentLabel: (function () {
                var it = departments.find(function (d) { return String(d.id || d.pk || d.name) === String(selectedDepartment); });
                return it ? (it.name || it.title || it.label || String(it.id || it.pk || '')) : undefined;
            })(), selectedProgrammeLabel: (function () {
                var it = programmes.find(function (p) { return String(p.id || p.pk || p.name) === String(selectedProgramme); });
                return it ? (it.name || it.title || it.label || String(it.id || it.pk || '')) : undefined;
            })(), selectedGroupLabel: (function () {
                var it = classGroupsOptions.find(function (g) { return String(g.id || g.pk || g.name) === String(selectedGroup); });
                return it ? (it.name || it.title || it.class_group_name || String(it.id || it.pk || '')) : undefined;
            })(), selectedRoomLabel: (function () {
                var it = roomsOptions.find(function (r) { return String(r.id || r.pk || r.name) === String(selectedRoom); });
                return it ? (it.name || it.title || it.label || String(it.id || it.pk || '')) : undefined;
            })(), clearDepartment: function () { return setSelectedDepartment(undefined); }, clearProgramme: function () { return setSelectedProgramme(undefined); }, clearGroup: function () { return setSelectedGroup(''); }, clearRoom: function () { return setSelectedRoom(''); } }),
        react_1["default"].createElement(ScheduleFilters_1["default"], { departments: departments, programmes: programmes, classGroups: visibleClassGroups, rooms: roomsOptions, selectedDepartment: selectedDepartment, selectedProgramme: selectedProgramme, selectedGroup: selectedGroup, selectedRoom: selectedRoom, setSelectedDepartment: function (v) { return setSelectedDepartment(v); }, setSelectedProgramme: function (v) { return setSelectedProgramme(v); }, setSelectedGroup: function (v) { return setSelectedGroup(v); }, setSelectedRoom: function (v) { return setSelectedRoom(v); } }),
        react_1["default"].createElement(framer_motion_1.AnimatePresence, null, notification && (react_1["default"].createElement(framer_motion_1.motion.div, { initial: { opacity: 0, y: -20 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -20 }, className: "mb-4 p-4 rounded-lg flex items-center gap-3 " + (notification.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800') },
            notification.type === 'success' ? (react_1["default"].createElement(lucide_react_1.Check, { className: "w-5 h-5" })) : (react_1["default"].createElement(lucide_react_1.AlertCircle, { className: "w-5 h-5" })),
            react_1["default"].createElement("span", { className: "flex-1" }, notification.message),
            react_1["default"].createElement("button", { onClick: function () { return setNotification(null); }, className: "hover:opacity-70", "aria-label": "Dismiss notification" },
                react_1["default"].createElement(lucide_react_1.X, { className: "w-5 h-5" }))))),
        react_1["default"].createElement(ScheduleGrid_1["default"], { containerRef: containerRef, days: days, slots: slots, slotHeights: slotHeights, slotTopOffsets: slotTopOffsets, slotMinutes: slotMinutes, pixelsPerMinute: pixelsPerMinute, startHour: startHour, totalHeight: totalHeight, dayData: react_1.useMemo(function () {
                var map = {};
                days.forEach(function (d) {
                    map[d] = filteredSchedules.filter(function (s) { return s.day_of_week === d; }).map(function (s) { return ({ s: s, start: timeStrToMinutes(s.start_time), end: timeStrToMinutes(s.start_time) + fixedDuration }); });
                });
                return map;
            }, [filteredSchedules, days, fixedDuration, timeStrToMinutes]), stackingMode: stackingMode, columnWidth: columnWidth, draggingId: draggingId, setDraggingId: setDraggingId, preview: preview, setPreview: setPreview, conflictIds: conflictIds, setConflictIds: setConflictIds, setSelectedId: setSelectedId, schedules: schedules, saveSchedule: saveSchedule, nudgeSchedule: nudgeSchedule }),
        pendingSave && (react_1["default"].createElement("div", { className: "mt-3 p-3 border rounded bg-rose-50" },
            react_1["default"].createElement("div", { className: "flex items-start justify-between" },
                react_1["default"].createElement("div", null,
                    react_1["default"].createElement("div", { className: "font-medium text-sm text-rose-800" }, "Cannot save \u2014 timetable constraints violated"),
                    pendingSave.localViolations.length > 0 && (react_1["default"].createElement("ul", { className: "mt-2 list-disc list-inside text-sm text-rose-800" }, pendingSave.localViolations.map(function (v, i) { return react_1["default"].createElement("li", { key: "lv-" + i }, v); }))),
                    pendingSave.serverConflicts && pendingSave.serverConflicts.length > 0 && (react_1["default"].createElement("div", { className: "mt-2 text-sm text-rose-800" },
                        "Server reported ",
                        pendingSave.serverConflicts.length,
                        " conflict(s). Please resolve them before saving."))),
                react_1["default"].createElement("div", { className: "flex items-center gap-2" },
                    pendingSave.serverConflicts && pendingSave.serverConflicts.length > 0 && (react_1["default"].createElement("button", { className: "px-3 py-1 bg-yellow-100 text-yellow-800 rounded text-sm", onClick: function () { setShowConflictModal(true); } }, "View conflicts")),
                    react_1["default"].createElement("button", { className: "px-3 py-1 bg-gray-200 text-gray-800 rounded text-sm", onClick: function () { setPendingSave(null); } }, "Dismiss"))))),
        showConflictModal && pendingSave && pendingSave.serverConflicts && (react_1["default"].createElement("div", { className: "fixed inset-0 bg-black/40 flex items-center justify-center z-50" },
            react_1["default"].createElement("div", { className: "bg-white rounded-lg shadow-lg w-[min(900px,95%)] p-6" },
                react_1["default"].createElement("div", { className: "flex items-center justify-between mb-4" },
                    react_1["default"].createElement("h3", { className: "text-lg font-semibold" }, "Conflicting schedules"),
                    react_1["default"].createElement("button", { className: "text-sm text-gray-500", onClick: function () { return setShowConflictModal(false); } }, "Close")),
                react_1["default"].createElement("div", { className: "max-h-[50vh] overflow-auto" }, pendingSave.serverConflicts.map(function (c, i) { return (react_1["default"].createElement("div", { key: "conf-" + i, className: "p-3 border-b last:border-b-0 flex items-start justify-between gap-4" },
                    react_1["default"].createElement("div", null,
                        react_1["default"].createElement("div", { className: "font-medium" }, c.class_group_name || "Class " + c.id),
                        react_1["default"].createElement("div", { className: "text-sm text-gray-600" },
                            c.day_of_week,
                            " \u2022 ",
                            c.start_time,
                            " - ",
                            c.end_time,
                            " \u2022 ",
                            c.room_name),
                        react_1["default"].createElement("div", { className: "text-sm text-gray-700 mt-2" }, c.note || '')),
                    react_1["default"].createElement("div", { className: "flex flex-col items-end gap-2" },
                        react_1["default"].createElement("button", { className: "px-3 py-1 bg-blue-50 text-blue-800 rounded text-sm", onClick: function () {
                                try {
                                    var di = days.indexOf(c.day_of_week);
                                    if (di >= 0)
                                        setPreview({ dayIdx: di, startMin: timeStrToMinutes(c.start_time), durationMins: fixedDuration });
                                    setConflictIds(function (prev) { return new Set(__spreadArrays((prev ? Array.from(prev) : []), [Number(c.id)])); });
                                }
                                catch (e) {
                                    console.error(e);
                                }
                            } }, "Preview"),
                        react_1["default"].createElement("button", { className: "px-3 py-1 bg-gray-100 text-gray-800 rounded text-sm", onClick: function () { setShowConflictModal(false); } }, "Close")))); }))))),
        react_1["default"].createElement("div", { className: "mt-3 flex items-center justify-between" },
            react_1["default"].createElement("div", { className: "text-sm text-gray-600" },
                "Arrow keys nudge by ",
                react_1["default"].createElement("strong", null, String(slotMinutes)),
                " minutes (slots are fixed)"))));
}
exports["default"] = ScheduleEditor;
