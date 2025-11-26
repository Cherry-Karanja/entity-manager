"use strict";
/**
 * Users API Client
 *
 * API client for Django users endpoint using the HTTP client factory.
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
exports.userActions = exports.usersApiClient = void 0;
var entityManager_1 = require("@/components/entityManager");
/**
 * Users API Client
 *
 * Example usage:
 * ```typescript
 * // List users with pagination
 * const result = await usersApiClient.list({ page: 1, pageSize: 10 });
 *
 * // Get single user
 * const user = await usersApiClient.get(123);
 *
 * // Create user
 * const newUser = await usersApiClient.create({ email: 'test@example.com', ... });
 *
 * // Update user
 * const updated = await usersApiClient.update(123, { first_name: 'John' });
 *
 * // Delete user
 * await usersApiClient.delete(123);
 *
 * // Bulk operations
 * await usersApiClient.bulkDelete([1, 2, 3]);
 * ```
 */
exports.usersApiClient = entityManager_1.createHttpClient({
    endpoint: '/api/v1/accounts/users/'
});
/**
 * Custom user actions
 *
 * These use the customAction method which makes POST requests to:
 * /api/v1/accounts/users/{id}/{action}/
 *
 * Example usage:
 * ```typescript
 * // Approve user
 * await userActions.approve(123);
 *
 * // Change role
 * await userActions.changeRole(123, 'admin');
 *
 * // Unlock account
 * await userActions.unlockAccount(123);
 *
 * // Send password reset email
 * await userActions.resetPassword(123);
 * ```
 */
exports.userActions = {
    /**
     * Approve user
     */
    approve: function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, exports.usersApiClient.customAction(id, 'approve')];
            });
        });
    },
    /**
     * Change user role
     */
    changeRole: function (id, role) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, exports.usersApiClient.customAction(id, 'change_role', { role: role })];
            });
        });
    },
    /**
     * Unlock account
     */
    unlockAccount: function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, exports.usersApiClient.customAction(id, 'unlock')];
            });
        });
    },
    /**
     * Reset password (send email)
     */
    resetPassword: function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, exports.usersApiClient.customAction(id, 'reset_password')];
            });
        });
    }
};
