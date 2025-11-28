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
var class_group_schedules_1 = require("../../class-group-schedules");
var rooms_1 = require("../../rooms");
var lucide_react_1 = require("lucide-react");
// use command component for search filters for departments classgroups and rooms
var command_1 = require("@/components/ui/command");
var pad = function (n) { return String(n).padStart(2, '0'); };
var formatTime = function (h, m) { return pad(h) + ":" + pad(m); };
function ScheduleEditor(_a) {
    var _this = this;
    var _b, _c, _d, _e, _f, _g;
    var timetableId = _a.timetableId;
    var _h = react_1.useState([]), schedules = _h[0], setSchedules = _h[1];
    var _j = react_1.useState([]), filteredSchedules = _j[0], setFilteredSchedules = _j[1];
    var _k = react_1.useState(null), timetableSettings = _k[0], setTimetableSettings = _k[1];
    var _l = react_1.useState(''), searchQuery = _l[0], setSearchQuery = _l[1];
    var _m = react_1.useState(''), selectedRoom = _m[0], setSelectedRoom = _m[1];
    var _o = react_1.useState(''), selectedGroup = _o[0], setSelectedGroup = _o[1];
    var _p = react_1.useState(false), isFullscreen = _p[0], setIsFullscreen = _p[1];
    var showStats = true;
    var _q = react_1.useState(null), hoveredSchedule = _q[0], setHoveredSchedule = _q[1];
    var HOUR_PX = 60;
    var pixelsPerMinute = HOUR_PX / 60;
    var slotMinutes = (_b = timetableSettings === null || timetableSettings === void 0 ? void 0 : timetableSettings.slot_duration_minutes) !== null && _b !== void 0 ? _b : 60;
    // Fixed session duration (defined by timetable settings). Sessions always use this length.
    var fixedDuration = (_c = timetableSettings === null || timetableSettings === void 0 ? void 0 : timetableSettings.preferred_class_duration) !== null && _c !== void 0 ? _c : slotMinutes;
    var containerRef = react_1.useRef(null);
    var _r = react_1.useState(150), columnWidth = _r[0], setColumnWidth = _r[1];
    var _s = react_1.useState(null), draggingId = _s[0], setDraggingId = _s[1];
    var _t = react_1.useState(null), preview = _t[0], setPreview = _t[1];
    var _u = react_1.useState(null), pendingSave = _u[0], setPendingSave = _u[1];
    var _v = react_1.useState(new Set()), conflictIds = _v[0], setConflictIds = _v[1];
    var _w = react_1.useState('vertical'), stackingMode = _w[0], setStackingMode = _w[1];
    var _x = react_1.useState(null), notification = _x[0], setNotification = _x[1];
    var _y = react_1.useState([]), departments = _y[0], setDepartments = _y[1];
    var _z = react_1.useState([]), programmes = _z[0], setProgrammes = _z[1];
    var _0 = react_1.useState([]), classGroupsOptions = _0[0], setClassGroupsOptions = _0[1];
    var _1 = react_1.useState([]), roomsOptions = _1[0], setRoomsOptions = _1[1];
    var _2 = react_1.useState(undefined), selectedProgramme = _2[0], setSelectedProgramme = _2[1];
    var _3 = react_1.useState(1), programmesPage = _3[0], setProgrammesPage = _3[1];
    var _4 = react_1.useState(false), programmesHasMore = _4[0], setProgrammesHasMore = _4[1];
    var _5 = react_1.useState(1), classGroupsPage = _5[0], setClassGroupsPage = _5[1];
    var _6 = react_1.useState(false), classGroupsHasMore = _6[0], setClassGroupsHasMore = _6[1];
    var _7 = react_1.useState(1), roomsPage = _7[0], setRoomsPage = _7[1];
    var _8 = react_1.useState(false), roomsHasMore = _8[0], setRoomsHasMore = _8[1];
    var PAGE_SIZE = 25;
    var _9 = react_1.useState(false), deptOpen = _9[0], setDeptOpen = _9[1];
    var _10 = react_1.useState(false), programmeOpen = _10[0], setProgrammeOpen = _10[1];
    var _11 = react_1.useState(false), groupOpen = _11[0], setGroupOpen = _11[1];
    var _12 = react_1.useState(false), roomOpen = _12[0], setRoomOpen = _12[1];
    var _13 = useDebounce_1.useDebounceSearch('', 300), deptSearchTerm = _13.searchTerm, debouncedDeptSearch = _13.debouncedSearchTerm, setDeptSearch = _13.setSearchTerm;
    var _14 = useDebounce_1.useDebounceSearch('', 300), programmeSearchTerm = _14.searchTerm, debouncedProgrammeSearch = _14.debouncedSearchTerm, setProgrammeSearch = _14.setSearchTerm;
    var _15 = useDebounce_1.useDebounceSearch('', 300), groupSearchTerm = _15.searchTerm, debouncedGroupSearch = _15.debouncedSearchTerm, setGroupSearch = _15.setSearchTerm;
    var _16 = useDebounce_1.useDebounceSearch('', 300), roomSearchTerm = _16.searchTerm, debouncedRoomSearch = _16.debouncedSearchTerm, setRoomSearch = _16.setSearchTerm;
    var _17 = react_1.useState(undefined), selectedDepartment = _17[0], setSelectedDepartment = _17[1];
    var searchRef = react_1.useRef(null);
    var classGroupsReqRef = react_1.useRef(0);
    var roomsReqRef = react_1.useRef(0);
    var programmesReqRef = react_1.useRef(0);
    var schedulesReqRef = react_1.useRef(0);
    var clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };
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
            setClassGroupsHasMore(false);
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
                        if (debouncedGroupSearch)
                            params.search = debouncedGroupSearch;
                        return [4 /*yield*/, class_group_schedules_1.classGroupScheduleClient.list(params)];
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
                        // detect pagination
                        setClassGroupsHasMore(Boolean(res.next));
                        return [3 /*break*/, 3];
                    case 2:
                        err_4 = _a.sent();
                        console.warn('Failed to fetch class groups', err_4);
                        if (classGroupsPage === 1)
                            setClassGroupsOptions([]);
                        setClassGroupsHasMore(false);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); })();
        return function () { mounted = false; };
    }, [selectedDepartment, selectedProgramme, debouncedGroupSearch, classGroupsPage]);
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
            setProgrammesHasMore(false);
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
                        setProgrammesHasMore(Boolean(res.next));
                        return [3 /*break*/, 3];
                    case 2:
                        err_5 = _a.sent();
                        console.warn('Failed to fetch programmes', err_5);
                        if (programmesPage === 1)
                            setProgrammes([]);
                        setProgrammesHasMore(false);
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
            setRoomsHasMore(false);
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
                        setRoomsHasMore(Boolean(res.next));
                        return [3 /*break*/, 3];
                    case 2:
                        err_6 = _c.sent();
                        console.warn('Failed to fetch rooms', err_6);
                        if (roomsPage === 1)
                            setRoomsOptions([]);
                        setRoomsHasMore(false);
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
    // Max display columns (legacy) - kept for reference; current stacking uses dynamic offsets (unused)
    // Vertical stacking offset (base px) applied per overlapping lane when in vertical stacking mode.
    // Increased slightly so stacked items are more clearly separated for long events.
    var STACK_OFFSET_PX = Math.min(16, slotPx * 0.4);
    // Minimum padding inside slot boundaries so items don't touch separator lines
    var PADDING_PX = 2;
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
    function hasLocalOverlap(updated) {
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
    }
    function checkConstraintsLocally(updated) {
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
    }
    function performSave(updated) {
        return __awaiter(this, void 0, void 0, function () {
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
        });
    }
    function saveSchedule(updated) {
        return __awaiter(this, void 0, void 0, function () {
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
        });
    }
    function nudgeSchedule(s, deltaMins, deltaDays) {
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
            saveSchedule(updated);
        }
        catch (err) {
            console.error('nudge error', err);
        }
    }
    var clearFilters = function () {
        setSearchQuery('');
        setSelectedRoom('');
        setSelectedGroup('');
        setSelectedProgramme(undefined);
        setSelectedDepartment(undefined);
    };
    return (react_1["default"].createElement("div", { className: "w-full " + (isFullscreen ? 'fixed inset-0 z-50 bg-white p-6' : '') },
        react_1["default"].createElement("div", { className: "mb-4 space-y-3" },
            react_1["default"].createElement("div", { className: "flex items-center justify-between" },
                react_1["default"].createElement("h2", { className: "text-2xl font-bold" }, "Schedule Editor"),
                react_1["default"].createElement("div", { className: "flex items-center gap-2" },
                    react_1["default"].createElement("button", { onClick: function () { return setStackingMode(function (m) { return m === 'vertical' ? 'columns' : 'vertical'; }); }, className: "px-3 py-1 text-sm border rounded hover:bg-gray-100", title: "Toggle stacking mode" }, stackingMode === 'vertical' ? 'Stack: Vertical' : 'Stack: Columns'),
                    react_1["default"].createElement("button", { onClick: function () { return setIsFullscreen(!isFullscreen); }, className: "p-2 hover:bg-gray-100 rounded-lg transition-colors", "aria-label": isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen' }, isFullscreen ? react_1["default"].createElement(lucide_react_1.Minimize2, { className: "w-5 h-5" }) : react_1["default"].createElement(lucide_react_1.Maximize2, { className: "w-5 h-5" })))),
            showStats && (react_1["default"].createElement(framer_motion_1.motion.div, { initial: { opacity: 0, y: -10 }, animate: { opacity: 1, y: 0 }, className: "grid grid-cols-4 gap-3" },
                react_1["default"].createElement("div", { className: "bg-blue-50 p-3 rounded-lg" },
                    react_1["default"].createElement("div", { className: "text-xs text-blue-600 font-medium" }, "Total Classes"),
                    react_1["default"].createElement("div", { className: "text-2xl font-bold text-blue-900" }, stats.totalClasses)),
                react_1["default"].createElement("div", { className: "bg-green-50 p-3 rounded-lg" },
                    react_1["default"].createElement("div", { className: "text-xs text-green-600 font-medium" }, "Rooms Used"),
                    react_1["default"].createElement("div", { className: "text-2xl font-bold text-green-900" }, stats.roomsUsed)),
                react_1["default"].createElement("div", { className: "bg-purple-50 p-3 rounded-lg" },
                    react_1["default"].createElement("div", { className: "text-xs text-purple-600 font-medium" }, "Groups"),
                    react_1["default"].createElement("div", { className: "text-2xl font-bold text-purple-900" }, stats.groupsScheduled)),
                react_1["default"].createElement("div", { className: "bg-yellow-50 p-3 rounded-lg" },
                    react_1["default"].createElement("div", { className: "text-xs text-yellow-600 font-medium" }, "Locked"),
                    react_1["default"].createElement("div", { className: "text-2xl font-bold text-yellow-900" }, stats.lockedClasses)))),
            react_1["default"].createElement("div", { className: "flex gap-3" },
                react_1["default"].createElement("div", { className: "flex-1 relative" },
                    react_1["default"].createElement(lucide_react_1.Search, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" }),
                    react_1["default"].createElement("input", { type: "text", placeholder: "Search by class, room, or group...", value: searchQuery, onChange: function (e) { return setSearchQuery(e.target.value); }, ref: searchRef, className: "w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" })),
                react_1["default"].createElement("div", { className: "flex flex-col" },
                    react_1["default"].createElement("div", { className: "relative" },
                        react_1["default"].createElement("button", { type: "button", onClick: function () { return setDeptOpen(function (v) { return !v; }); }, className: "w-full text-left px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" }, selectedDepartment ? (((_d = departments.find(function (d) { return String(d.id || d.pk || d.name) === String(selectedDepartment); })) === null || _d === void 0 ? void 0 : _d.name) || selectedDepartment) : 'All Departments'),
                        deptOpen && (react_1["default"].createElement("div", { className: "absolute z-30 mt-1 w-full max-h-60 overflow-hidden border rounded bg-white shadow-sm" },
                            react_1["default"].createElement(command_1.Command, { className: "w-full" },
                                react_1["default"].createElement(command_1.CommandInput, { value: deptSearchTerm, onValueChange: function (v) { return setDeptSearch(v); }, placeholder: "Search departments..." }),
                                react_1["default"].createElement(command_1.CommandList, null,
                                    react_1["default"].createElement(command_1.CommandEmpty, null, "No departments"),
                                    react_1["default"].createElement(command_1.CommandGroup, null,
                                        react_1["default"].createElement("div", { key: "dept-all", className: "px-3 py-2 hover:bg-gray-100 cursor-pointer", onMouseDown: function () { setSelectedDepartment(''); setSelectedProgramme(undefined); setSelectedGroup(''); setDeptOpen(false); } }, "All Departments"),
                                        departments.map(function (d) { return (react_1["default"].createElement(command_1.CommandItem, { key: d.id || d.pk || d.name, onMouseDown: function () { setSelectedDepartment(d.id || d.pk || d.name); setSelectedProgramme(undefined); setSelectedGroup(''); setDeptOpen(false); } }, d.name || d.title || String(d))); })))))))),
                react_1["default"].createElement("div", { className: "flex flex-col" },
                    react_1["default"].createElement("div", { className: "relative" },
                        react_1["default"].createElement("button", { type: "button", onClick: function () { return setProgrammeOpen(function (v) { return !v; }); }, className: "w-full text-left px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" }, selectedProgramme ? (((_e = programmes.find(function (p) { return String(p.id || p.pk || p.name) === String(selectedProgramme); })) === null || _e === void 0 ? void 0 : _e.name) || selectedProgramme) : 'All Programmes'),
                        programmeOpen && (react_1["default"].createElement("div", { className: "absolute z-30 mt-1 w-full max-h-60 overflow-hidden border rounded bg-white shadow-sm" },
                            react_1["default"].createElement(command_1.Command, { className: "w-full" },
                                react_1["default"].createElement(command_1.CommandInput, { value: programmeSearchTerm, onValueChange: function (v) { return setProgrammeSearch(v); }, placeholder: "Search programmes..." }),
                                react_1["default"].createElement(command_1.CommandList, null,
                                    react_1["default"].createElement(command_1.CommandEmpty, null, "No programmes"),
                                    react_1["default"].createElement(command_1.CommandGroup, null,
                                        react_1["default"].createElement(command_1.CommandItem, { onMouseDown: function () { setSelectedProgramme(undefined); setSelectedGroup(''); setProgrammeOpen(false); } }, "All Programmes"),
                                        programmes.map(function (p) { return (react_1["default"].createElement(command_1.CommandItem, { key: p.id || p.pk || p.name, onMouseDown: function () { setSelectedProgramme(p.id || p.pk || p.name); setSelectedGroup(''); setProgrammeOpen(false); } }, p.name || p.title || String(p))); }),
                                        programmesHasMore && (react_1["default"].createElement("div", { className: "px-3 py-2 text-center border-t" },
                                            react_1["default"].createElement("button", { onMouseDown: function (e) { e.preventDefault(); setProgrammesPage(function (p) { return p + 1; }); }, className: "text-sm text-blue-600" }, "Load more")))))))))),
                react_1["default"].createElement("div", { className: "flex flex-col" },
                    react_1["default"].createElement("div", { className: "relative" },
                        react_1["default"].createElement("button", { type: "button", onClick: function () { return setGroupOpen(function (v) { return !v; }); }, className: "w-full text-left px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" }, selectedGroup ? (((_f = classGroupsOptions.find(function (g) { return String(g.id || g.pk || g.name) === String(selectedGroup); })) === null || _f === void 0 ? void 0 : _f.name) || selectedGroup) : 'All Groups'),
                        groupOpen && (react_1["default"].createElement("div", { className: "absolute z-30 mt-1 w-full max-h-60 overflow-hidden border rounded bg-white shadow-sm" },
                            react_1["default"].createElement(command_1.Command, { className: "w-full" },
                                react_1["default"].createElement(command_1.CommandInput, { value: groupSearchTerm, onValueChange: function (v) { return setGroupSearch(v); }, placeholder: "Search groups..." }),
                                react_1["default"].createElement(command_1.CommandList, null,
                                    react_1["default"].createElement(command_1.CommandEmpty, null, "No groups"),
                                    react_1["default"].createElement(command_1.CommandGroup, null,
                                        react_1["default"].createElement(command_1.CommandItem, { onMouseDown: function () { setSelectedGroup(''); setGroupOpen(false); } }, "All Groups"),
                                        classGroupsOptions.map(function (g) { return (react_1["default"].createElement(command_1.CommandItem, { key: g.id || g.pk || g.name, onMouseDown: function () {
                                                var _a, _b, _c, _d;
                                                var gid = g.id || g.pk || g.name;
                                                setSelectedGroup(gid);
                                                // derive programme/department from group if available
                                                var prog = ((_a = g.programme) === null || _a === void 0 ? void 0 : _a.id) || ((_b = g.programme) === null || _b === void 0 ? void 0 : _b.pk) || g.programme || g.programme_id;
                                                var dept = ((_c = g.programme) === null || _c === void 0 ? void 0 : _c.department) || ((_d = g.programme) === null || _d === void 0 ? void 0 : _d.department_id) || g.department || g.department_id;
                                                if (prog)
                                                    setSelectedProgramme(prog);
                                                if (dept)
                                                    setSelectedDepartment(dept);
                                                setGroupOpen(false);
                                            } }, g.name || g.title || String(g))); }),
                                        classGroupsHasMore && (react_1["default"].createElement("div", { className: "px-3 py-2 text-center border-t" },
                                            react_1["default"].createElement("button", { onMouseDown: function (e) { e.preventDefault(); setClassGroupsPage(function (p) { return p + 1; }); }, className: "text-sm text-blue-600" }, "Load more")))))))))),
                react_1["default"].createElement("div", { className: "flex flex-col" },
                    react_1["default"].createElement("div", { className: "relative" },
                        react_1["default"].createElement("button", { type: "button", onClick: function () { return setRoomOpen(function (v) { return !v; }); }, className: "w-full text-left px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" }, selectedRoom ? (((_g = roomsOptions.find(function (r) { return String(r.id || r.pk || r.name) === String(selectedRoom); })) === null || _g === void 0 ? void 0 : _g.name) || selectedRoom) : 'All Rooms'),
                        roomOpen && (react_1["default"].createElement("div", { className: "absolute z-30 mt-1 w-full max-h-60 overflow-hidden border rounded bg-white shadow-sm" },
                            react_1["default"].createElement(command_1.Command, { className: "w-full" },
                                react_1["default"].createElement(command_1.CommandInput, { value: roomSearchTerm, onValueChange: function (v) { return setRoomSearch(v); }, placeholder: "Search rooms..." }),
                                react_1["default"].createElement(command_1.CommandList, null,
                                    react_1["default"].createElement(command_1.CommandEmpty, null, "No rooms"),
                                    react_1["default"].createElement(command_1.CommandGroup, null,
                                        react_1["default"].createElement(command_1.CommandItem, { onMouseDown: function () { setSelectedRoom(''); setRoomOpen(false); } }, "All Rooms"),
                                        roomsOptions.map(function (r) { return (react_1["default"].createElement(command_1.CommandItem, { key: r.id || r.pk || r.name, onMouseDown: function () { setSelectedRoom(r.id || r.pk || r.name); setRoomOpen(false); } }, r.name || r.title || String(r))); }),
                                        roomsHasMore && (react_1["default"].createElement("div", { className: "px-3 py-2 text-center border-t" },
                                            react_1["default"].createElement("button", { onMouseDown: function (e) { e.preventDefault(); setRoomsPage(function (p) { return p + 1; }); }, className: "text-sm text-blue-600" }, "Load more")))))))))),
                (searchQuery || selectedRoom || selectedGroup || selectedDepartment) && (react_1["default"].createElement("button", { onClick: clearFilters, className: "px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors" }, "Clear")))),
        react_1["default"].createElement(framer_motion_1.AnimatePresence, null, notification && (react_1["default"].createElement(framer_motion_1.motion.div, { initial: { opacity: 0, y: -20 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -20 }, className: "mb-4 p-4 rounded-lg flex items-center gap-3 " + (notification.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800') },
            notification.type === 'success' ? (react_1["default"].createElement(lucide_react_1.Check, { className: "w-5 h-5" })) : (react_1["default"].createElement(lucide_react_1.AlertCircle, { className: "w-5 h-5" })),
            react_1["default"].createElement("span", { className: "flex-1" }, notification.message),
            react_1["default"].createElement("button", { onClick: function () { return setNotification(null); }, className: "hover:opacity-70", "aria-label": "Dismiss notification" },
                react_1["default"].createElement(lucide_react_1.X, { className: "w-5 h-5" }))))),
        react_1["default"].createElement("div", { className: "overflow-auto border rounded-lg shadow-sm" },
            react_1["default"].createElement("div", { ref: containerRef, className: "grid", style: { gridTemplateColumns: "80px repeat(" + days.length + ", minmax(150px, 1fr))" } },
                react_1["default"].createElement("div", { className: "bg-gradient-to-br from-gray-50 to-gray-100 p-3 font-semibold text-gray-700 sticky left-0 z-20 border-r" },
                    react_1["default"].createElement(lucide_react_1.Clock, { className: "w-4 h-4 inline mr-2" }),
                    "Time"),
                days.map(function (d) { return (react_1["default"].createElement("div", { key: d, className: "bg-gradient-to-br from-blue-50 to-indigo-50 p-3 text-center font-semibold text-gray-700" },
                    react_1["default"].createElement(lucide_react_1.Calendar, { className: "w-4 h-4 inline mr-2" }),
                    d.charAt(0).toUpperCase() + d.slice(1))); }),
                react_1["default"].createElement("div", { className: "flex flex-col sticky left-0 z-10 bg-white border-r" }, slots.map(function (slot) { return (react_1["default"].createElement("div", { key: "label-" + slot.index, className: "p-3 text-xs text-gray-500 font-medium border-b", style: { height: slotHeights[slot.index] } }, slot.label)); })),
                days.map(function (day, dayIdx) {
                    var daySchedules = filteredSchedules.filter(function (s) { return s.day_of_week === day; }).map(function (s) {
                        var start = timeStrToMinutes(s.start_time);
                        return { s: s, start: start, end: start + fixedDuration };
                    }).sort(function (a, b) { return a.start - b.start; });
                    // Compute visual placements: we want to guarantee no visual overlap even for long events
                    // Approach: find overlapping clusters (connected components by time overlap) and within
                    // each cluster assign a vertical offset to each event so their visual boxes do not
                    // intersect. Offsets are computed in pixels and we respect a small padding from slot lines.
                    var n = daySchedules.length;
                    // offsets (px) for each event index (default zero)
                    var offsets = Array.from({ length: n }).map(function () { return 0; });
                    // placementMap will be populated when in columns mode so renderer can access column info
                    var placementMap = undefined;
                    var dayHeight = Math.max(48, totalHeight);
                    if (stackingMode === 'columns') {
                        // legacy columns mode: compute horizontal columns so overlapping events share rows
                        var columns = [];
                        var placement = new Map();
                        for (var _i = 0, daySchedules_1 = daySchedules; _i < daySchedules_1.length; _i++) {
                            var item = daySchedules_1[_i];
                            var placed = false;
                            for (var ci = 0; ci < columns.length; ci++) {
                                if (item.start >= columns[ci]) {
                                    placement.set(Number(item.s.id), { col: ci, totalCols: 0 });
                                    columns[ci] = item.end;
                                    placed = true;
                                    break;
                                }
                            }
                            if (!placed) {
                                columns.push(item.end);
                                placement.set(Number(item.s.id), { col: columns.length - 1, totalCols: 0 });
                            }
                        }
                        var totalCols = columns.length || 1;
                        for (var _a = 0, _b = placement.keys(); _a < _b.length; _a++) {
                            var key = _b[_a];
                            placement.set(key, { col: placement.get(key).col, totalCols: totalCols });
                        }
                        placementMap = placement;
                        // dayHeight remains default (no extra vertical stacking)
                    }
                    else {
                        // VERTICAL stacking: compute non-overlapping vertical offsets per connected cluster
                        // build graph of overlaps
                        var adj = Array.from({ length: n }, function () { return []; });
                        for (var i = 0; i < n; i++) {
                            for (var j = i + 1; j < n; j++) {
                                var a = daySchedules[i];
                                var b = daySchedules[j];
                                if (a.start < b.end && a.end > b.start) {
                                    adj[i].push(j);
                                    adj[j].push(i);
                                }
                            }
                        }
                        // find clusters
                        var visited = new Array(n).fill(false);
                        var clusters = [];
                        for (var i = 0; i < n; i++) {
                            if (visited[i])
                                continue;
                            var stack = [i];
                            var comp = [];
                            visited[i] = true;
                            while (stack.length) {
                                var u = stack.pop();
                                comp.push(u);
                                for (var _c = 0, _d = adj[u]; _c < _d.length; _c++) {
                                    var v = _d[_c];
                                    if (!visited[v]) {
                                        visited[v] = true;
                                        stack.push(v);
                                    }
                                }
                            }
                            clusters.push(comp);
                        }
                        var maxBottom = totalHeight;
                        // process each cluster independently
                        for (var _e = 0, clusters_1 = clusters; _e < clusters_1.length; _e++) {
                            var comp = clusters_1[_e];
                            // sort by start time (stable)
                            comp.sort(function (a, b) { return daySchedules[a].start - daySchedules[b].start; });
                            var placed = [];
                            for (var _f = 0, comp_1 = comp; _f < comp_1.length; _f++) {
                                var idx = comp_1[_f];
                                var item = daySchedules[idx];
                                var topPx = (item.start - startHour * 60) * pixelsPerMinute;
                                var heightPx = Math.max(1, (item.end - item.start) * pixelsPerMinute) - 2 * PADDING_PX;
                                var off = 0;
                                // incrementally raise off until no overlap with already placed items
                                while (true) {
                                    var conflictFound = false;
                                    var neededOff = off;
                                    for (var _g = 0, placed_1 = placed; _g < placed_1.length; _g++) {
                                        var p = placed_1[_g];
                                        // check vertical overlap between item at candidate offset and placed p
                                        var itemTop = topPx + off + PADDING_PX;
                                        var itemBottom = itemTop + heightPx;
                                        var pTop = p.top + p.offset + PADDING_PX;
                                        var pBottom = pTop + p.height;
                                        if (itemTop < pBottom && itemBottom > pTop) {
                                            // overlapping visually, raise below this placed item
                                            neededOff = Math.max(neededOff, (pBottom - topPx) + STACK_OFFSET_PX);
                                            conflictFound = true;
                                        }
                                    }
                                    if (!conflictFound)
                                        break;
                                    off = neededOff;
                                }
                                offsets[idx] = off;
                                placed.push({ idx: idx, top: topPx, height: heightPx, offset: off });
                                maxBottom = Math.max(maxBottom, topPx + off + PADDING_PX + heightPx);
                            }
                        }
                        dayHeight = Math.max(48, Math.max(totalHeight, Math.ceil(maxBottom)));
                    }
                    return (react_1["default"].createElement("div", { key: "day-" + day, className: "p-3 border-l border-t relative bg-white", style: { minHeight: Math.max(48, dayHeight), height: dayHeight } },
                        slotTopOffsets.map(function (topOff, si) { return (react_1["default"].createElement("div", { key: "sep-" + si, style: { position: 'absolute', left: 0, right: 0, top: topOff, height: 0, borderTop: '1px solid rgba(0,0,0,0.04)' }, "aria-hidden": true })); }),
                        daySchedules.map(function (_a, idx) {
                            var s = _a.s, start = _a.start;
                            var startTotal = start;
                            var duration = fixedDuration;
                            // compute absolute top/height in pixels so schedule blocks match time slots exactly
                            var top = (startTotal - startHour * 60) * pixelsPerMinute;
                            // visual padding so items don't touch slot borders
                            var height = Math.max(1, duration * pixelsPerMinute) - 2 * PADDING_PX;
                            // clamp into grid bounds (account for extra stacking height)
                            top = clamp(top, 0, Math.max(0, dayHeight));
                            height = Math.max(1, Math.min(height, Math.max(0, dayHeight - top)));
                            // compute rendering metrics depending on stacking mode
                            var styleTop = top + PADDING_PX;
                            var styleHeight = Math.max(1, height);
                            var styleLeft = 8 + "px";
                            var styleWidth = "calc(100% - " + (8 + 8) + "px)";
                            if (stackingMode === 'columns') {
                                // compute horizontal columns layout
                                var layout = (placementMap === null || placementMap === void 0 ? void 0 : placementMap.get(Number(s.id))) || { col: 0, totalCols: 1 };
                                var actualCol = layout.col % Math.max(1, layout.totalCols || 1);
                                var colsForThis = Math.max(1, layout.totalCols || 1);
                                var leftPct = (actualCol / colsForThis) * 100;
                                var widthPct = (1 / colsForThis) * 100;
                                styleLeft = "calc(" + leftPct + "% + 8px)";
                                styleWidth = "calc(" + widthPct + "% - 12px)";
                                styleTop = top + PADDING_PX;
                                styleHeight = Math.max(1, duration * pixelsPerMinute - 2 * PADDING_PX);
                            }
                            else {
                                var offsetPx = (offsets && offsets[idx]) ? offsets[idx] : 0;
                                styleTop = top + PADDING_PX + offsetPx;
                                styleHeight = Math.max(1, height);
                                styleLeft = 8 + "px";
                                styleWidth = "calc(100% - " + (8 + 8) + "px)";
                            }
                            var isDragging = draggingId === Number(s.id);
                            var isHovered = hoveredSchedule === Number(s.id);
                            var hasConflict = conflictIds && conflictIds.has(Number(s.id));
                            return (react_1["default"].createElement(framer_motion_1.motion.div, { key: s.id, role: "button", tabIndex: 0, "aria-label": (s.class_group_name || ('Class ' + s.class_group)) + " " + s.start_time + " to " + s.end_time, className: "rounded-lg p-3 text-sm select-none absolute transition-all cursor-move  " + (hasConflict
                                    ? 'bg-red-100 border-2 border-red-500 shadow-lg'
                                    : isHovered
                                        ? 'bg-blue-100 border-2 border-blue-400 shadow-xl scale-105'
                                        : 'bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 shadow-md hover:shadow-lg'), style: { top: styleTop, height: styleHeight, zIndex: isDragging ? 30 : isHovered ? 20 : 10, left: styleLeft, width: styleWidth }, drag: "y", onMouseEnter: function () { return setHoveredSchedule(Number(s.id)); }, onMouseLeave: function () { return setHoveredSchedule(null); }, whileHover: { scale: isDragging ? 1 : 1.02 }, onKeyDown: function (e) {
                                    if (e.key === 'ArrowUp') {
                                        e.preventDefault();
                                        nudgeSchedule(s, -slotMinutes, 0);
                                    }
                                    else if (e.key === 'ArrowDown') {
                                        e.preventDefault();
                                        nudgeSchedule(s, slotMinutes, 0);
                                    }
                                    else if (e.key === 'ArrowLeft') {
                                        e.preventDefault();
                                        nudgeSchedule(s, 0, -1);
                                    }
                                    else if (e.key === 'ArrowRight') {
                                        e.preventDefault();
                                        nudgeSchedule(s, 0, 1);
                                    }
                                }, dragElastic: 0, onDragStart: function () { setDraggingId(Number(s.id)); setPreview(null); }, onDrag: function (e, info) {
                                    try {
                                        var offsetY = info.offset.y;
                                        var offsetX = info.offset.x;
                                        var deltaMinutes = Math.round(offsetY / pixelsPerMinute);
                                        var deltaDays = Math.round(offsetX / columnWidth);
                                        var origTotalMins = startTotal;
                                        var durationMins = fixedDuration;
                                        var newTotalMins = origTotalMins + deltaMinutes;
                                        var newDayIdx = dayIdx + deltaDays;
                                        newDayIdx = clamp(newDayIdx, 0, days.length - 1);
                                        var snappedStart = Math.round(newTotalMins / slotMinutes) * slotMinutes;
                                        setPreview({ dayIdx: newDayIdx, startMin: snappedStart, durationMins: durationMins });
                                        var newStart = snappedStart;
                                        var newEnd = newStart + durationMins;
                                        var conflictSet = new Set();
                                        for (var _i = 0, schedules_1 = schedules; _i < schedules_1.length; _i++) {
                                            var other = schedules_1[_i];
                                            if (Number(other.id) === Number(s.id))
                                                continue;
                                            if (other.day_of_week !== days[newDayIdx])
                                                continue;
                                            var oStart = timeStrToMinutes(other.start_time);
                                            var oEnd = oStart + fixedDuration;
                                            if (oStart < newEnd && oEnd > newStart) {
                                                conflictSet.add(Number(other.id));
                                            }
                                        }
                                        setConflictIds(conflictSet);
                                    }
                                    catch (_a) { }
                                }, onDragEnd: function (e, info) {
                                    try {
                                        var offsetY = info.offset.y;
                                        var offsetX = info.offset.x;
                                        var minutesDelta = Math.round(offsetY / pixelsPerMinute);
                                        var newTotalMins = startTotal + minutesDelta;
                                        newTotalMins = Math.round(newTotalMins / slotMinutes) * slotMinutes;
                                        var newHour = Math.floor(newTotalMins / 60);
                                        var newMin = newTotalMins % 60;
                                        var newDayIdx = dayIdx + Math.round(offsetX / columnWidth);
                                        newDayIdx = clamp(newDayIdx, 0, days.length - 1);
                                        var durationMins = fixedDuration;
                                        newHour = clamp(newHour, startHour, endHour - Math.ceil(durationMins / 60));
                                        if (newHour + Math.ceil(durationMins / 60) > endHour) {
                                            newHour = endHour - Math.ceil(durationMins / 60);
                                            newMin = 0;
                                        }
                                        var newStart = formatTime(newHour, newMin);
                                        var newEndTotal = newHour * 60 + newMin + durationMins;
                                        var newEnd = formatTime(Math.floor(newEndTotal / 60), newEndTotal % 60);
                                        var updated = __assign(__assign({}, s), { day_of_week: days[newDayIdx], start_time: newStart, end_time: newEnd });
                                        if (updated.start_time !== s.start_time || updated.day_of_week !== s.day_of_week) {
                                            saveSchedule(updated);
                                        }
                                    }
                                    catch (err) {
                                        console.error('drag end error', err);
                                    }
                                    finally {
                                        setDraggingId(null);
                                        setPreview(null);
                                        setConflictIds(new Set());
                                    }
                                } },
                                react_1["default"].createElement("div", { className: "flex items-center justify-between " },
                                    react_1["default"].createElement("div", { className: "font-medium" }, s.class_group_name || ('Class ' + s.class_group)),
                                    s.is_locked && react_1["default"].createElement("div", { className: "text-xs px-2 py-0.5 rounded bg-yellow-100 text-yellow-800" }, "Locked")),
                                react_1["default"].createElement("div", { className: "text-xs text-gray-600" },
                                    s.start_time,
                                    " - ",
                                    s.end_time,
                                    " \u2022 ",
                                    s.room_name || '')));
                        }),
                        preview && preview.dayIdx === dayIdx && (function () {
                            var pTop = (preview.startMin - startHour * 60) * pixelsPerMinute + PADDING_PX;
                            var pHeight = Math.max(1, preview.durationMins * pixelsPerMinute - 2 * PADDING_PX);
                            return (react_1["default"].createElement(framer_motion_1.motion.div, { initial: { opacity: 0, scale: 0.98 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0 }, transition: { duration: 0.12 }, style: { position: 'absolute', left: 8, top: pTop, width: 'calc(100% - 12px)', height: pHeight, pointerEvents: 'none', zIndex: 25 }, className: "bg-primary/20 border border-primary/40 rounded h-full shadow-sm " }));
                        })()));
                }))),
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
                    react_1["default"].createElement("button", { className: "px-3 py-1 bg-gray-200 text-gray-800 rounded text-sm", onClick: function () { setPendingSave(null); } }, "Dismiss"))))),
        react_1["default"].createElement("div", { className: "mt-3 flex items-center justify-between" },
            react_1["default"].createElement("div", { className: "text-sm text-gray-600" },
                "Arrow keys nudge by ",
                react_1["default"].createElement("strong", null, String(slotMinutes)),
                " minutes (slots are fixed)"))));
}
exports["default"] = ScheduleEditor;
