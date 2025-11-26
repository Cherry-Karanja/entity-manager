"use strict";
/**
 * UserProfile API Client
 *
 * API client for Django user-profiles endpoint using the HTTP client factory.
 *
 * The HTTP client factory handles all CRUD operations automatically:
 * - Authentication via authApi from connectionManager
 * - CSRF token handling
 * - 401 token refresh
 * - DRF pagination format (results, count, next, previous)
 * - Error handling with toast notifications
 * - Bulk operations
 * - Custom actions
 */
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
exports.userProfileActions = exports.userProfilesApiClient = void 0;
var entityManager_1 = require("@/components/entityManager");
/**
 * UserProfile API Client
 *
 * Example usage:
 * ```typescript
 * // List profiles with pagination
 * const result = await userProfilesApiClient.list({ page: 1, pageSize: 10 });
 *
 * // Get single profile
 * const profile = await userProfilesApiClient.get('uuid-here');
 *
 * // Create profile
 * const newProfile = await userProfilesApiClient.create({ user_id: '123', ... });
 *
 * // Update profile
 * const updated = await userProfilesApiClient.update('uuid', { bio: 'New bio' });
 *
 * // Delete profile
 * await userProfilesApiClient.delete('uuid');
 *
 * // Bulk operations
 * await userProfilesApiClient.bulkDelete(['uuid1', 'uuid2', 'uuid3']);
 * ```
 */
exports.userProfilesApiClient = entityManager_1.createHttpClient({
    endpoint: '/api/v1/accounts/user-profiles/'
});
/**
 * Custom user profile actions
 *
 * These use the customAction method which makes POST requests to:
 * /api/v1/accounts/user-profiles/{id}/{action}/
 *
 * Example usage:
 * ```typescript
 * // Approve profile
 * await userProfileActions.approve('uuid');
 *
 * // Reject profile
 * await userProfileActions.reject('uuid');
 *
 * // Suspend profile
 * await userProfileActions.suspend('uuid');
 * ```
 */
exports.userProfileActions = {
    /**
     * Approve user profile
     */
    approve: function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, exports.userProfilesApiClient.customAction(id, 'approve')];
            });
        });
    },
    /**
     * Reject user profile
     */
    reject: function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, exports.userProfilesApiClient.customAction(id, 'reject')];
            });
        });
    },
    /**
     * Suspend user profile
     */
    suspend: function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, exports.userProfilesApiClient.customAction(id, 'suspend')];
            });
        });
    }
};
