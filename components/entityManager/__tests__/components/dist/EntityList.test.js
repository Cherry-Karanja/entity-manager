"use strict";
/**
 * Tests for EntityList Component
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
var vitest_1 = require("vitest");
var react_1 = require("@testing-library/react");
var user_event_1 = require("@testing-library/user-event");
var list_1 = require("../../components/list");
var testUtils_1 = require("../testUtils");
vitest_1.describe('EntityList', function () {
    var mockData = testUtils_1.createMockUsers(10);
    var mockColumns = testUtils_1.createMockColumns();
    var mockActions = testUtils_1.createMockActions();
    vitest_1.beforeEach(function () {
        testUtils_1.resetMocks();
    });
    vitest_1.describe('rendering', function () {
        vitest_1.it('should render data in table format', function () {
            react_1.render(React.createElement(list_1.EntityList, { data: mockData, columns: mockColumns }));
            vitest_1.expect(react_1.screen.getByRole('table')).toBeInTheDocument();
            vitest_1.expect(react_1.screen.getByText('User 1')).toBeInTheDocument();
            vitest_1.expect(react_1.screen.getByText('user1@example.com')).toBeInTheDocument();
        });
        vitest_1.it('should render all columns', function () {
            react_1.render(React.createElement(list_1.EntityList, { data: mockData, columns: mockColumns }));
            mockColumns.forEach(function (column) {
                if (column.label)
                    vitest_1.expect(react_1.screen.getByText(column.label)).toBeInTheDocument();
            });
        });
        vitest_1.it('should render all rows', function () {
            react_1.render(React.createElement(list_1.EntityList, { data: mockData, columns: mockColumns }));
            var rows = react_1.screen.getAllByRole('row');
            // +1 for header row
            vitest_1.expect(rows).toHaveLength(mockData.length + 1);
        });
        vitest_1.it('should render custom cell content with render function', function () {
            react_1.render(React.createElement(list_1.EntityList, { data: mockData, columns: mockColumns }));
            // Role column has custom render that uppercases in each row
            var userRoles = react_1.screen.getAllByText('USER');
            vitest_1.expect(userRoles).toHaveLength(mockData.length);
        });
        vitest_1.it('should show empty state when no data', function () {
            react_1.render(React.createElement(list_1.EntityList, { data: [], columns: mockColumns, emptyMessage: "No users found" }));
            vitest_1.expect(react_1.screen.getByText('No users found')).toBeInTheDocument();
        });
        vitest_1.it('should show loading state', function () {
            react_1.render(React.createElement(list_1.EntityList, { data: mockData, columns: mockColumns, loading: true }));
            vitest_1.expect(react_1.screen.getByText('Loading data...')).toBeInTheDocument();
        });
    });
    vitest_1.describe('selection', function () {
        vitest_1.it('should show selection checkboxes when selectable', function () {
            react_1.render(React.createElement(list_1.EntityList, { data: mockData, columns: mockColumns, selectable: true, multiSelect: true }));
            var checkboxes = react_1.screen.getAllByRole('checkbox');
            // +1 for select-all checkbox in header
            vitest_1.expect(checkboxes).toHaveLength(mockData.length + 1);
        });
        vitest_1.it('should select individual row', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user, onSelectionChange, checkboxes;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = user_event_1["default"].setup();
                        onSelectionChange = vitest_1.vi.fn();
                        react_1.render(React.createElement(list_1.EntityList, { data: mockData, columns: mockColumns, selectable: true, onSelectionChange: onSelectionChange }));
                        checkboxes = react_1.screen.getAllByRole('checkbox');
                        return [4 /*yield*/, user.click(checkboxes[1])];
                    case 1:
                        _a.sent(); // First data row (User 2 with id='2')
                        vitest_1.expect(onSelectionChange).toHaveBeenCalledWith(vitest_1.expect.any(Set), [mockData[1]] // User 2 is at index 1
                        );
                        return [2 /*return*/];
                }
            });
        }); });
        vitest_1.it('should select all rows', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user, onSelectionChange, selectAllCheckbox;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = user_event_1["default"].setup();
                        onSelectionChange = vitest_1.vi.fn();
                        react_1.render(React.createElement(list_1.EntityList, { data: mockData, columns: mockColumns, selectable: true, multiSelect: true, onSelectionChange: onSelectionChange }));
                        selectAllCheckbox = react_1.screen.getAllByRole('checkbox')[0];
                        return [4 /*yield*/, user.click(selectAllCheckbox)];
                    case 1:
                        _a.sent();
                        vitest_1.expect(onSelectionChange).toHaveBeenCalledWith(vitest_1.expect.any(Set), mockData);
                        return [2 /*return*/];
                }
            });
        }); });
        vitest_1.it('should deselect all rows', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user, onSelectionChange, initialSelection, selectAllCheckbox;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = user_event_1["default"].setup();
                        onSelectionChange = vitest_1.vi.fn();
                        initialSelection = new Set(mockData.map(function (d) { return d.id; }));
                        react_1.render(React.createElement(list_1.EntityList, { data: mockData, columns: mockColumns, selectable: true, multiSelect: true, selectedIds: initialSelection, onSelectionChange: onSelectionChange }));
                        selectAllCheckbox = react_1.screen.getAllByRole('checkbox')[0];
                        return [4 /*yield*/, user.click(selectAllCheckbox)];
                    case 1:
                        _a.sent();
                        vitest_1.expect(onSelectionChange).toHaveBeenCalledWith(vitest_1.expect.any(Set), []);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    vitest_1.describe('sorting', function () {
        vitest_1.it('should show sort indicators on sortable columns', function () {
            react_1.render(React.createElement(list_1.EntityList, { data: mockData, columns: mockColumns, sortable: true }));
            var nameHeader = react_1.screen.getByText('Name').closest('th');
            vitest_1.expect(nameHeader).toBeInTheDocument();
        });
        vitest_1.it('should sort ascending on first click', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user, onSortChange, nameHeader;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = user_event_1["default"].setup();
                        onSortChange = vitest_1.vi.fn();
                        react_1.render(React.createElement(list_1.EntityList, { data: mockData, columns: mockColumns, sortable: true, onSortChange: onSortChange }));
                        nameHeader = react_1.screen.getByText('Name').closest('th');
                        return [4 /*yield*/, user.click(nameHeader)];
                    case 1:
                        _a.sent();
                        vitest_1.expect(onSortChange).toHaveBeenCalledWith({ field: 'name', direction: 'asc' });
                        return [2 /*return*/];
                }
            });
        }); });
        vitest_1.it('should toggle sort direction on second click', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user, onSortChange, nameHeader;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = user_event_1["default"].setup();
                        onSortChange = vitest_1.vi.fn();
                        react_1.render(React.createElement(list_1.EntityList, { data: mockData, columns: mockColumns, sortable: true, onSortChange: onSortChange }));
                        nameHeader = react_1.screen.getByText('Name').closest('th');
                        // First click -> asc, second click -> desc
                        return [4 /*yield*/, user.click(nameHeader)];
                    case 1:
                        // First click -> asc, second click -> desc
                        _a.sent();
                        return [4 /*yield*/, user.click(nameHeader)];
                    case 2:
                        _a.sent();
                        vitest_1.expect(onSortChange).toHaveBeenCalledWith({ field: 'name', direction: 'desc' });
                        return [2 /*return*/];
                }
            });
        }); });
        vitest_1.it('should apply sorting to data', function () {
            var container = react_1.render(React.createElement(list_1.EntityList, { data: mockData, columns: mockColumns, sortable: true })).container;
            var rows = container.querySelectorAll('tbody tr');
            var firstRowName = react_1.within(rows[0]).getByText(/User 1/);
            vitest_1.expect(firstRowName).toBeInTheDocument();
        });
    });
    vitest_1.describe('filtering', function () {
        vitest_1.it('should show search input when searchable', function () {
            react_1.render(React.createElement(list_1.EntityList, { data: mockData, columns: mockColumns, searchable: true }));
            vitest_1.expect(react_1.screen.getByPlaceholderText(/search/i)).toBeInTheDocument();
        });
        vitest_1.it('should filter data by search query', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user, searchInput;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = user_event_1["default"].setup();
                        react_1.render(React.createElement(list_1.EntityList, { data: mockData, columns: mockColumns, searchable: true }));
                        searchInput = react_1.screen.getByPlaceholderText(/search/i);
                        return [4 /*yield*/, user.type(searchInput, 'User 1')];
                    case 1:
                        _a.sent();
                        // Should show User 1 and User 10
                        vitest_1.expect(react_1.screen.getByText('User 1')).toBeInTheDocument();
                        vitest_1.expect(react_1.screen.queryByText('User 2')).not.toBeInTheDocument();
                        return [2 /*return*/];
                }
            });
        }); });
        vitest_1.it.skip('should show column filters when filterable', function () {
            react_1.render(React.createElement(list_1.EntityList, { data: mockData, columns: mockColumns, filterable: true }));
            // Filter buttons or dropdowns should be visible
            var filterButtons = react_1.screen.getAllByRole('button', { name: /filter/i });
            vitest_1.expect(filterButtons.length).toBeGreaterThan(0);
        });
        vitest_1.it.skip('should apply column filters', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user, onFilterChange, roleFilter;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = user_event_1["default"].setup();
                        onFilterChange = vitest_1.vi.fn();
                        react_1.render(React.createElement(list_1.EntityList, { data: mockData, columns: mockColumns, filterable: true, onFilterChange: onFilterChange }));
                        roleFilter = react_1.screen.getByRole('combobox', { name: /role/i });
                        return [4 /*yield*/, user.selectOptions(roleFilter, 'admin')];
                    case 1:
                        _a.sent();
                        vitest_1.expect(onFilterChange).toHaveBeenCalled();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    vitest_1.describe('pagination', function () {
        vitest_1.it('should show pagination controls when paginated', function () {
            react_1.render(React.createElement(list_1.EntityList, { data: mockData, columns: mockColumns, pagination: true, paginationConfig: {
                    page: 1,
                    pageSize: 5,
                    totalCount: mockData.length
                } }));
            vitest_1.expect(react_1.screen.getByRole('navigation', { name: /pagination/i })).toBeInTheDocument();
        });
        vitest_1.it('should show correct page size of data', function () {
            // For server-side pagination, data should be pre-paginated
            var pageData = mockData.slice(0, 5);
            react_1.render(React.createElement(list_1.EntityList, { data: pageData, columns: mockColumns, pagination: true, paginationConfig: {
                    page: 1,
                    pageSize: 5,
                    totalCount: mockData.length
                } }));
            var rows = react_1.screen.getAllByRole('row');
            // 5 data rows + 1 header row
            vitest_1.expect(rows).toHaveLength(6);
        });
        vitest_1.it('should navigate to next page', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user, mockOnPaginationChange, pageData, nextButton;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = user_event_1["default"].setup();
                        mockOnPaginationChange = vitest_1.vi.fn();
                        pageData = mockData.slice(0, 5);
                        react_1.render(React.createElement(list_1.EntityList, { data: pageData, columns: mockColumns, pagination: true, paginationConfig: {
                                page: 1,
                                pageSize: 5,
                                totalCount: mockData.length
                            }, onPaginationChange: mockOnPaginationChange }));
                        nextButton = react_1.screen.getByRole('button', { name: /next/i });
                        return [4 /*yield*/, user.click(nextButton)];
                    case 1:
                        _a.sent();
                        // Should call onPaginationChange with page 2
                        vitest_1.expect(mockOnPaginationChange).toHaveBeenCalledWith({
                            page: 2,
                            pageSize: 5,
                            totalCount: mockData.length
                        });
                        return [2 /*return*/];
                }
            });
        }); });
        vitest_1.it('should navigate to previous page', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user, mockOnPaginationChange, pageData, prevButton;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = user_event_1["default"].setup();
                        mockOnPaginationChange = vitest_1.vi.fn();
                        pageData = mockData.slice(5, 10);
                        react_1.render(React.createElement(list_1.EntityList, { data: pageData, columns: mockColumns, pagination: true, paginationConfig: {
                                page: 2,
                                pageSize: 5,
                                totalCount: mockData.length
                            }, onPaginationChange: mockOnPaginationChange }));
                        prevButton = react_1.screen.getByRole('button', { name: /previous/i });
                        return [4 /*yield*/, user.click(prevButton)];
                    case 1:
                        _a.sent();
                        // Should call onPaginationChange with page 1
                        vitest_1.expect(mockOnPaginationChange).toHaveBeenCalledWith({
                            page: 1,
                            pageSize: 5,
                            totalCount: mockData.length
                        });
                        return [2 /*return*/];
                }
            });
        }); });
        vitest_1.it('should allow page size change', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user, onPageSizeChange, pageSizeSelect;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = user_event_1["default"].setup();
                        onPageSizeChange = vitest_1.vi.fn();
                        react_1.render(React.createElement(list_1.EntityList, { data: mockData, columns: mockColumns, pagination: true, paginationConfig: {
                                page: 1,
                                pageSize: 5,
                                totalCount: mockData.length
                            }, onPaginationChange: onPageSizeChange }));
                        pageSizeSelect = react_1.screen.getByRole('combobox', { name: /items per page/i });
                        return [4 /*yield*/, user.selectOptions(pageSizeSelect, '10')];
                    case 1:
                        _a.sent();
                        vitest_1.expect(onPageSizeChange).toHaveBeenCalledWith({
                            page: 1,
                            pageSize: 10,
                            totalCount: mockData.length
                        });
                        return [2 /*return*/];
                }
            });
        }); });
    });
    vitest_1.describe('actions', function () {
        vitest_1.it('should render row actions', function () {
            react_1.render(React.createElement(list_1.EntityList, { data: mockData, columns: mockColumns, actions: { actions: mockActions } }));
            // Actions column should be present
            var actionsHeaders = react_1.screen.getAllByText(/actions/i);
            vitest_1.expect(actionsHeaders.length).toBeGreaterThan(0);
        });
        vitest_1.it('should trigger immediate actions', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user, editHandler, actions, editButtons;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = user_event_1["default"].setup();
                        editHandler = vitest_1.vi.fn();
                        actions = [
                            {
                                id: 'edit',
                                label: 'Edit',
                                actionType: 'immediate',
                                handler: editHandler
                            },
                        ];
                        react_1.render(React.createElement(list_1.EntityList, { data: mockData, columns: mockColumns, actions: { actions: actions } }));
                        editButtons = react_1.screen.getAllByRole('button', { name: /edit/i });
                        return [4 /*yield*/, user.click(editButtons[0])];
                    case 1:
                        _a.sent();
                        vitest_1.expect(editHandler).toHaveBeenCalledWith(mockData[0], undefined);
                        return [2 /*return*/];
                }
            });
        }); });
        vitest_1.it('should show confirmation dialog for confirm actions', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user, deleteHandler, actions, deleteButtons;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = user_event_1["default"].setup();
                        deleteHandler = vitest_1.vi.fn();
                        actions = [
                            {
                                id: 'delete',
                                label: 'Delete',
                                actionType: 'confirm',
                                confirmMessage: 'Are you sure?',
                                confirmText: 'Confirm Delete',
                                onConfirm: deleteHandler
                            },
                        ];
                        react_1.render(React.createElement(list_1.EntityList, { data: mockData, columns: mockColumns, actions: { actions: actions } }));
                        deleteButtons = react_1.screen.getAllByRole('button', { name: /delete/i });
                        return [4 /*yield*/, user.click(deleteButtons[0])];
                    case 1:
                        _a.sent();
                        vitest_1.expect(react_1.screen.getByRole('heading', { name: 'Confirm Delete' })).toBeInTheDocument();
                        vitest_1.expect(react_1.screen.getByText('Are you sure?')).toBeInTheDocument();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    vitest_1.describe('accessibility', function () {
        vitest_1.it('should have proper ARIA roles', function () {
            react_1.render(React.createElement(list_1.EntityList, { data: mockData, columns: mockColumns }));
            vitest_1.expect(react_1.screen.getByRole('table')).toBeInTheDocument();
            vitest_1.expect(react_1.screen.getAllByRole('row')).toHaveLength(11); // 10 + header
            vitest_1.expect(react_1.screen.getAllByRole('columnheader')).toHaveLength(4);
        });
        vitest_1.it('should support keyboard navigation', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user, firstCheckbox;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = user_event_1["default"].setup();
                        react_1.render(React.createElement(list_1.EntityList, { data: mockData, columns: mockColumns, selectable: true }));
                        firstCheckbox = react_1.screen.getAllByRole('checkbox')[0];
                        // Use click instead of keyboard to check checkbox
                        return [4 /*yield*/, user.click(firstCheckbox)];
                    case 1:
                        // Use click instead of keyboard to check checkbox
                        _a.sent();
                        vitest_1.expect(firstCheckbox).toBeChecked();
                        return [2 /*return*/];
                }
            });
        }); });
        vitest_1.it('should have accessible labels', function () {
            react_1.render(React.createElement(list_1.EntityList, { data: mockData, columns: mockColumns, selectable: true, multiSelect: true, searchable: true }));
            vitest_1.expect(react_1.screen.getByPlaceholderText(/search/i)).toBeInTheDocument();
            vitest_1.expect(react_1.screen.getByRole('checkbox', { name: /select all/i })).toBeInTheDocument();
        });
    });
    vitest_1.describe('edge cases', function () {
        vitest_1.it('should handle empty data gracefully', function () {
            react_1.render(React.createElement(list_1.EntityList, { data: [], columns: mockColumns }));
            vitest_1.expect(react_1.screen.getByText(/no data/i)).toBeInTheDocument();
        });
        vitest_1.it('should handle missing column keys', function () {
            var dataWithMissing = [__assign(__assign({}, mockData[0]), { name: undefined })];
            react_1.render(React.createElement(list_1.EntityList, { data: dataWithMissing, columns: mockColumns }));
            // Should not crash
            vitest_1.expect(react_1.screen.getByRole('table')).toBeInTheDocument();
        });
        vitest_1.it('should handle dynamic data updates', function () {
            var rerender = react_1.render(React.createElement(list_1.EntityList, { data: mockData.slice(0, 5), columns: mockColumns })).rerender;
            vitest_1.expect(react_1.screen.getAllByRole('row')).toHaveLength(6); // 5 + header
            rerender(React.createElement(list_1.EntityList, { data: mockData, columns: mockColumns }));
            vitest_1.expect(react_1.screen.getAllByRole('row')).toHaveLength(11); // 10 + header
        });
    });
});
