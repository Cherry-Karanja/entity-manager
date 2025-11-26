/**
 * Use Entity API Hook
 *
 * Hook for fetching and managing entity data from API.
 */
'use client';
"use strict";
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
exports.useEntityApi = void 0;
var react_1 = require("react");
var EntityApiProvider_1 = require("./EntityApiProvider");
var responseUtils_1 = require("../api/responseUtils");
/**
 * Use entity API hook
 */
function useEntityApi(initialParams) {
    var _this = this;
    var client = EntityApiProvider_1.useEntityApiContext().client;
    var _a = react_1.useState(false), loading = _a[0], setLoading = _a[1];
    var _b = react_1.useState(null), error = _b[0], setError = _b[1];
    var _c = react_1.useState(null), data = _c[0], setData = _c[1];
    var _d = react_1.useState(null), total = _d[0], setTotal = _d[1];
    var _e = react_1.useState(initialParams), params = _e[0], setParams = _e[1];
    /**
     * List entities
     */
    var list = react_1.useCallback(function (queryParams) { return __awaiter(_this, void 0, Promise, function () {
        var response, entities, total_1, err_1, error_1;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    setLoading(true);
                    setError(null);
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, client.list(queryParams)];
                case 2:
                    response = _b.sent();
                    entities = responseUtils_1.getListData(response);
                    setData(entities);
                    total_1 = response && typeof response === 'object' && ((_a = response.meta) === null || _a === void 0 ? void 0 : _a.total) !== undefined
                        ? response.meta.total
                        : Array.isArray(entities) ? entities.length : 0;
                    setTotal(total_1);
                    setParams(queryParams);
                    return [2 /*return*/, entities];
                case 3:
                    err_1 = _b.sent();
                    error_1 = err_1 instanceof Error ? err_1 : new Error('Failed to list entities');
                    setError(error_1);
                    throw error_1;
                case 4:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); }, [client]);
    /**
     * Get single entity
     */
    var get = react_1.useCallback(function (id) { return __awaiter(_this, void 0, Promise, function () {
        var response, err_2, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setLoading(true);
                    setError(null);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, client.get(id)];
                case 2:
                    response = _a.sent();
                    return [2 /*return*/, responseUtils_1.getEntityData(response)];
                case 3:
                    err_2 = _a.sent();
                    error_2 = err_2 instanceof Error ? err_2 : new Error('Failed to get entity');
                    setError(error_2);
                    throw error_2;
                case 4:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); }, [client]);
    /**
     * Refresh data
     */
    var refresh = react_1.useCallback(function () { return __awaiter(_this, void 0, Promise, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, list(params)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); }, [list, params]);
    // Auto-fetch on mount if initial params provided
    react_1.useEffect(function () {
        if (initialParams) {
            list(initialParams);
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps
    return {
        list: list,
        get: get,
        refresh: refresh,
        loading: loading,
        error: error,
        data: data,
        total: total
    };
}
exports.useEntityApi = useEntityApi;
