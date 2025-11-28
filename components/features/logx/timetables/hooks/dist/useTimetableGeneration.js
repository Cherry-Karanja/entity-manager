"use strict";
/**
 * Hook for monitoring timetable generation status
 * Uses adaptive polling to track background generation progress efficiently
 */
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
exports.useTimetableGeneration = void 0;
var react_1 = require("react");
var client_1 = require("../api/client");
/**
 * Hook to monitor and control timetable generation with smart adaptive polling
 *
 * @example
 * ```tsx
 * const { status, isGenerating, startGeneration, cancelPolling } = useTimetableGeneration({
 *   timetableId: 123,
 *   onComplete: (timetable) => console.log('Generation complete!', timetable),
 *   onError: (errors) => console.error('Generation failed:', errors)
 * });
 *
 * // Start generation
 * await startGeneration({ use_optimization: true });
 *
 * // Status will update automatically via polling
 * if (isGenerating) {
 *   return <div>Generating timetable...</div>;
 * }
 * ```
 */
function useTimetableGeneration(options) {
    var _this = this;
    if (options === void 0) { options = {}; }
    var timetableId = options.timetableId, _a = options.pollingInterval, pollingInterval = _a === void 0 ? 2000 : _a, // Default poll every 2 seconds
    onComplete = options.onComplete, onError = options.onError;
    var _b = react_1.useState({
        status: 'pending',
        isGenerating: false
    }), state = _b[0], setState = _b[1];
    var _c = react_1.useState(pollingInterval), adaptiveInterval = _c[0], setAdaptiveInterval = _c[1];
    var pollingIntervalRef = react_1.useRef(null);
    var consecutiveErrorsRef = react_1.useRef(0);
    var isPausedRef = react_1.useRef(false);
    var lastStatusRef = react_1.useRef('pending');
    var generationStartTimeRef = react_1.useRef(0);
    var MAX_CONSECUTIVE_ERRORS = 5;
    var MAX_BACKOFF_MS = 60000;
    /**
     * Fetch current timetable status
     */
    // Return an object with either timetable or error so caller can implement
    // backoff / cooldown behaviour based on HTTP status (e.g. 429 Too Many Requests)
    var fetchStatus = react_1.useCallback(function () { return __awaiter(_this, void 0, Promise, function () {
        var resp, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!timetableId)
                        return [2 /*return*/, { timetable: null }];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, client_1.timetablesApiClient.get(timetableId)];
                case 2:
                    resp = _a.sent();
                    return [2 /*return*/, { timetable: (resp && resp.data) }];
                case 3:
                    error_1 = _a.sent();
                    // Don't swallow error — return it so polling logic can react (backoff/pause)
                    return [2 /*return*/, { error: error_1 }];
                case 4: return [2 /*return*/];
            }
        });
    }); }, [timetableId]);
    /**
     * Update state from timetable data
     */
    var updateFromTimetable = react_1.useCallback(function (timetable) {
        if (!timetable)
            return;
        var newStatus = (timetable.generation_status || 'pending');
        var isGenerating = newStatus === 'in_progress';
        setState({
            status: newStatus,
            taskId: timetable.generation_task_id,
            errors: timetable.generation_errors,
            isGenerating: isGenerating
        });
        // Call callbacks on status change
        if (lastStatusRef.current !== newStatus) {
            if (newStatus === 'completed' && onComplete) {
                onComplete(timetable);
            }
            else if (newStatus === 'failed' && onError && timetable.generation_errors) {
                onError(timetable.generation_errors);
            }
            lastStatusRef.current = newStatus;
        }
    }, [onComplete, onError]);
    /**
     * Start polling for status updates with adaptive intervals
     */
    /**
     * Stop polling
     */
    var cancelPolling = react_1.useCallback(function () {
        if (pollingIntervalRef.current) {
            clearInterval(pollingIntervalRef.current);
            pollingIntervalRef.current = null;
        }
        isPausedRef.current = false;
        consecutiveErrorsRef.current = 0;
    }, []);
    /**
     * Start polling for status updates with adaptive intervals
     */
    var startPolling = react_1.useCallback(function () {
        // If we've been paused externally (cooldown), do not start
        if (isPausedRef.current)
            return;
        // Clear existing interval
        if (pollingIntervalRef.current) {
            clearInterval(pollingIntervalRef.current);
        }
        // Start new polling interval with adaptive timing
        pollingIntervalRef.current = setInterval(function () { return __awaiter(_this, void 0, void 0, function () {
            var result, statusCode, cooldown, timetable;
            var _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, fetchStatus()];
                    case 1:
                        result = _d.sent();
                        if (result.error) {
                            // Increment consecutive error counter
                            consecutiveErrorsRef.current += 1;
                            statusCode = ((_b = (_a = result.error) === null || _a === void 0 ? void 0 : _a.response) === null || _b === void 0 ? void 0 : _b.status) || ((_c = result.error) === null || _c === void 0 ? void 0 : _c.status);
                            console.error('Error fetching timetable status:', result.error);
                            // If rate limited, apply cooldown proportional to errors (but capped)
                            if (statusCode === 429) {
                                cooldown = Math.min(MAX_BACKOFF_MS, 5000 * consecutiveErrorsRef.current);
                                // Pause polling and schedule restart after cooldown
                                cancelPolling();
                                isPausedRef.current = true;
                                setTimeout(function () {
                                    isPausedRef.current = false;
                                    // Only restart if generation still in progress
                                    if (lastStatusRef.current === 'in_progress') {
                                        startPolling();
                                    }
                                }, cooldown);
                                // increase adaptiveInterval to reduce pressure
                                setAdaptiveInterval(function (prev) { return Math.min(prev * 2, MAX_BACKOFF_MS); });
                                return [2 /*return*/];
                            }
                            // Other errors: exponential backoff, and abort after repeated failures
                            setAdaptiveInterval(function (prev) { return Math.min(prev * 2, MAX_BACKOFF_MS); });
                            if (consecutiveErrorsRef.current >= MAX_CONSECUTIVE_ERRORS) {
                                cancelPolling();
                                setState(function (prev) { return (__assign(__assign({}, prev), { isGenerating: false, status: 'failed', errors: ['Failed to poll timetable status after repeated errors.'] })); });
                            }
                            return [2 /*return*/];
                        }
                        // Success: reset consecutive error counter and update state
                        consecutiveErrorsRef.current = 0;
                        timetable = result.timetable || null;
                        updateFromTimetable(timetable);
                        // Stop polling if generation is complete or failed
                        if (timetable && ['completed', 'failed'].includes((timetable.generation_status || ''))) {
                            cancelPolling();
                        }
                        return [2 /*return*/];
                }
            });
        }); }, adaptiveInterval);
    }, [fetchStatus, updateFromTimetable, adaptiveInterval, cancelPolling]);
    /**
     * Update polling interval based on elapsed time (adaptive polling)
     */
    react_1.useEffect(function () {
        if (state.status === 'in_progress' && generationStartTimeRef.current > 0) {
            var elapsed = Date.now() - generationStartTimeRef.current;
            // Adaptive polling strategy: faster initially, slower over time
            if (elapsed < 10000) {
                setAdaptiveInterval(1000); // 1s for first 10 seconds
            }
            else if (elapsed < 30000) {
                setAdaptiveInterval(2000); // 2s for 10-30 seconds
            }
            else if (elapsed < 60000) {
                setAdaptiveInterval(5000); // 5s for 30-60 seconds
            }
            else {
                setAdaptiveInterval(10000); // 10s after 1 minute
            }
        }
        else {
            setAdaptiveInterval(pollingInterval); // Reset to default
        }
    }, [state.status, pollingInterval]);
    // If the adaptive interval changes while polling, restart the polling
    react_1.useEffect(function () {
        if (state.status === 'in_progress' && pollingIntervalRef.current) {
            // restart with new interval
            cancelPolling();
            startPolling();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [adaptiveInterval]);
    /**
     * Start timetable generation
     */
    var startGeneration = react_1.useCallback(function (options) { return __awaiter(_this, void 0, void 0, function () {
        var response, taskId_1, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!timetableId) {
                        throw new Error('Timetable ID is required to start generation');
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    setState(function (prev) { return (__assign(__assign({}, prev), { isGenerating: true, status: 'in_progress' })); });
                    generationStartTimeRef.current = Date.now(); // Track start time for adaptive polling
                    return [4 /*yield*/, client_1.timetablesApiClient.customAction(timetableId, 'regenerate_timetable', options || {})];
                case 2:
                    response = _a.sent();
                    taskId_1 = response.task_id;
                    setState(function (prev) { return (__assign(__assign({}, prev), { taskId: taskId_1 })); });
                    // Start polling for status
                    startPolling();
                    return [2 /*return*/, taskId_1];
                case 3:
                    error_2 = _a.sent();
                    setState(function (prev) { return (__assign(__assign({}, prev), { isGenerating: false, status: 'failed', errors: ['Failed to start generation'] })); });
                    throw error_2;
                case 4: return [2 /*return*/];
            }
        });
    }); }, [timetableId, startPolling]);
    /**
     * Refresh status manually
     */
    var refreshStatus = react_1.useCallback(function () { return __awaiter(_this, void 0, void 0, function () {
        var result, timetable;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fetchStatus()];
                case 1:
                    result = _a.sent();
                    timetable = (result === null || result === void 0 ? void 0 : result.timetable) || null;
                    updateFromTimetable(timetable);
                    return [2 /*return*/, timetable];
            }
        });
    }); }, [fetchStatus, updateFromTimetable]);
    // Initial fetch when timetableId changes
    react_1.useEffect(function () {
        if (timetableId) {
            refreshStatus();
        }
    }, [timetableId, refreshStatus]);
    // Cleanup on unmount
    react_1.useEffect(function () {
        return function () {
            cancelPolling();
        };
    }, [cancelPolling]);
    // Auto-start polling if status is in_progress
    react_1.useEffect(function () {
        if (state.status === 'in_progress' && !pollingIntervalRef.current) {
            startPolling();
        }
    }, [state.status, startPolling]);
    return __assign(__assign({}, state), { startGeneration: startGeneration,
        refreshStatus: refreshStatus,
        cancelPolling: cancelPolling });
}
exports.useTimetableGeneration = useTimetableGeneration;
