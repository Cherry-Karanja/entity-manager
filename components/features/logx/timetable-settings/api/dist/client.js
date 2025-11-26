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
exports.__esModule = true;
exports.timetableSettingsApi = void 0;
var entityManager_1 = require("@/components/entityManager");
var BASE_PATH = '/api/v1/timetabling/timetable-settings/';
var base = entityManager_1.createHttpClient({ endpoint: BASE_PATH });
exports.timetableSettingsApi = __assign({}, base);
exports["default"] = exports.timetableSettingsApi;
