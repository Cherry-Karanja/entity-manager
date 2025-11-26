"use strict";
/**
 * Action Builder
 *
 * Fluent API for building entity actions.
 */
exports.__esModule = true;
exports.ActionBuilder = void 0;
/**
 * Action builder class
 */
var ActionBuilder = /** @class */ (function () {
    function ActionBuilder(id, label, actionType) {
        if (actionType === void 0) { actionType = 'immediate'; }
        this.action = { id: id, label: label, actionType: actionType };
    }
    /**
     * Set action icon
     */
    ActionBuilder.prototype.icon = function (icon) {
        this.action.icon = icon;
        return this;
    };
    /**
     * Set action variant
     */
    ActionBuilder.prototype.variant = function (variant) {
        this.action.variant = variant;
        return this;
    };
    /**
     * Se action position
     */
    ActionBuilder.prototype.position = function (position) {
        this.action.position = position;
        return this;
    };
    /**
     * Set visibility condition
     */
    ActionBuilder.prototype.visible = function (visible) {
        this.action.visible = visible;
        return this;
    };
    /**
     * Set disabled condition
     */
    ActionBuilder.prototype.disabled = function (disabled) {
        this.action.disabled = disabled;
        return this;
    };
    /**
     * Set tooltip
     */
    ActionBuilder.prototype.tooltip = function (tooltip) {
        this.action.tooltip = tooltip;
        return this;
    };
    /**
     * Set permission requirement
     */
    ActionBuilder.prototype.permission = function (permission) {
        this.action.permission = permission;
        return this;
    };
    /**
     * Set requires selection
     */
    ActionBuilder.prototype.requiresSelection = function (required) {
        if (required === void 0) { required = true; }
        this.action.requiresSelection = required;
        return this;
    };
    /**
     * Set allow multiple selection
     */
    ActionBuilder.prototype.allowMultiple = function (allow) {
        if (allow === void 0) { allow = true; }
        this.action.allowMultiple = allow;
        return this;
    };
    // === Immediate Action Methods ===
    /**
     * Set immediate action handler
     */
    ActionBuilder.prototype.handler = function (handler) {
        this.action.handler = handler;
        return this;
    };
    // === Confirm Action Methods ===
    /**
     * Set confirmation message
     */
    ActionBuilder.prototype.confirmMessage = function (message) {
        this.action.confirmMessage = message;
        return this;
    };
    /**
     * Set confirm button text
     */
    ActionBuilder.prototype.confirmText = function (text) {
        this.action.confirmText = text;
        return this;
    };
    /**
     * Set cancel button text
     */
    ActionBuilder.prototype.cancelText = function (text) {
        this.action.cancelText = text;
        return this;
    };
    /**
     * Set confirm handler
     */
    ActionBuilder.prototype.onConfirm = function (handler) {
        this.action.onConfirm = handler;
        return this;
    };
    /**
     * Set cancel handler
     */
    ActionBuilder.prototype.onCancel = function (handler) {
        this.action.onCancel = handler;
        return this;
    };
    // === Form Action Methods ===
    /**
     * Set form title
     */
    ActionBuilder.prototype.formTitle = function (title) {
        this.action.formTitle = title;
        return this;
    };
    /**
     * Set form fields
     */
    ActionBuilder.prototype.fields = function (fields) {
        this.action.fields = fields;
        return this;
    };
    /**
     * Set initial form values
     */
    ActionBuilder.prototype.initialValues = function (values) {
        this.action.initialValues = values;
        return this;
    };
    /**
     * Set form submit handler
     */
    ActionBuilder.prototype.onSubmit = function (handler) {
        this.action.onSubmit = handler;
        return this;
    };
    /**
     * Set form submit button text
     */
    ActionBuilder.prototype.submitText = function (text) {
        this.action.submitText = text;
        return this;
    };
    // === Modal Action Methods ===
    /**
     * Set modal title
     */
    ActionBuilder.prototype.modalTitle = function (title) {
        this.action.modalTitle = title;
        return this;
    };
    /**
     * Set modal content component
     */
    ActionBuilder.prototype.content = function (content) {
        this.action.content = content;
        return this;
    };
    /**
     * Set modal size
     */
    ActionBuilder.prototype.modalSize = function (size) {
        this.action.size = size;
        return this;
    };
    // === Navigation Action Methods ===
    /**
     * Set navigation URL
     */
    ActionBuilder.prototype.url = function (url) {
        this.action.url = url;
        return this;
    };
    /**
     * Set whether to open in new tab
     */
    ActionBuilder.prototype.newTab = function (newTab) {
        if (newTab === void 0) { newTab = true; }
        this.action.newTab = newTab;
        return this;
    };
    // === Bulk Action Methods ===
    /**
     * Set bulk action handler
     */
    ActionBuilder.prototype.bulkHandler = function (handler) {
        this.action.handler = handler;
        return this;
    };
    /**
     * Set bulk confirmation message
     */
    ActionBuilder.prototype.bulkConfirmMessage = function (message) {
        // Legacy API: store on confirmMessage (BulkAction uses confirmMessage)
        this.action.confirmMessage = message;
        return this;
    };
    /**
     * Set whether to confirm bulk action
     */
    ActionBuilder.prototype.confirmBulk = function (confirm) {
        if (confirm === void 0) { confirm = true; }
        this.action.confirmBulk = confirm;
        return this;
    };
    // === Download Action Methods ===
    /**
     * Set download handler
     */
    ActionBuilder.prototype.downloadHandler = function (handler) {
        this.action.handler = handler;
        return this;
    };
    /**
     * Set download URL
     */
    ActionBuilder.prototype.downloadUrl = function (url) {
        this.action.downloadUrl = url;
        return this;
    };
    /**
     * Set download filename
     */
    ActionBuilder.prototype.filename = function (filename) {
        this.action.filename = filename;
        return this;
    };
    // === Custom Action Methods ===
    /**
     * Set custom component
     */
    ActionBuilder.prototype.component = function (component) {
        this.action.component = component;
        return this;
    };
    /**
     * Set custom handler
     */
    ActionBuilder.prototype.customHandler = function (handler) {
        this.action.handler = handler;
        return this;
    };
    /**
     * Build the action
     */
    ActionBuilder.prototype.build = function () {
        return this.action;
    };
    /**
     * Create a new action builder
     */
    ActionBuilder.create = function (id, label, actionType) {
        return new ActionBuilder(id, label, actionType);
    };
    /**
     * Create immediate action
     */
    ActionBuilder.immediate = function (id, label, handler) {
        return new ActionBuilder(id, label, 'immediate').handler(handler);
    };
    /**
     * Create confirm action
     */
    ActionBuilder.confirm = function (id, label, message, onConfirm) {
        return new ActionBuilder(id, label, 'confirm')
            .confirmMessage(message)
            .onConfirm(onConfirm);
    };
    /**
     * Create form action
     */
    ActionBuilder.form = function (id, label, fields, onSubmit) {
        return new ActionBuilder(id, label, 'form')
            .fields(fields)
            .onSubmit(onSubmit);
    };
    /**
     * Create modal action
     */
    ActionBuilder.modal = function (id, label, content) {
        return new ActionBuilder(id, label, 'modal').content(content);
    };
    /**
     * Create navigation action
     */
    ActionBuilder.navigation = function (id, label, url) {
        return new ActionBuilder(id, label, 'navigation').url(url);
    };
    /**
     * Create bulk action
     */
    ActionBuilder.bulk = function (id, label, handler) {
        return new ActionBuilder(id, label, 'bulk').bulkHandler(handler);
    };
    /**
     * Create download action
     */
    ActionBuilder.download = function (id, label, handler) {
        return new ActionBuilder(id, label, 'download').downloadHandler(handler);
    };
    /**
     * Create custom action
     */
    ActionBuilder.custom = function (id, label, component) {
        return new ActionBuilder(id, label, 'custom').component(component);
    };
    return ActionBuilder;
}());
exports.ActionBuilder = ActionBuilder;
