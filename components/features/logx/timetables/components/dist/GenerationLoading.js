/**
 * Timetable Generation Loading Component
 *
 * Displays an inline loading state when timetable is being generated
 */
'use client';
"use strict";
exports.__esModule = true;
exports.GenerationLoading = void 0;
var react_1 = require("react");
var framer_motion_1 = require("framer-motion");
var lucide_react_1 = require("lucide-react");
var progress_1 = require("@/components/ui/progress");
var card_1 = require("@/components/ui/card");
function GenerationLoading(_a) {
    var progress = _a.progress, _b = _a.message, message = _b === void 0 ? 'Generating your timetable...' : _b, estimatedTime = _a.estimatedTime, _c = _a.className, className = _c === void 0 ? '' : _c;
    var _d = react_1["default"].useState(0), elapsedTime = _d[0], setElapsedTime = _d[1];
    react_1["default"].useEffect(function () {
        var interval = setInterval(function () {
            setElapsedTime(function (prev) { return prev + 1; });
        }, 1000);
        return function () { return clearInterval(interval); };
    }, []);
    var formatTime = function (seconds) {
        var mins = Math.floor(seconds / 60);
        var secs = seconds % 60;
        return mins > 0 ? mins + "m " + secs + "s" : secs + "s";
    };
    var steps = [
        { label: 'Loading constraints', status: progress && progress > 20 ? 'complete' : progress && progress > 0 ? 'active' : 'pending' },
        { label: 'Analyzing resources', status: progress && progress > 40 ? 'complete' : progress && progress > 20 ? 'active' : 'pending' },
        { label: 'Optimizing schedule', status: progress && progress > 70 ? 'complete' : progress && progress > 40 ? 'active' : 'pending' },
        { label: 'Finalizing timetable', status: progress && progress > 90 ? 'complete' : progress && progress > 70 ? 'active' : 'pending' },
    ];
    return (react_1["default"].createElement(card_1.Card, { className: className },
        react_1["default"].createElement(card_1.CardContent, { className: "pt-6" },
            react_1["default"].createElement("div", { className: "space-y-6" },
                react_1["default"].createElement("div", { className: "flex items-center gap-4" },
                    react_1["default"].createElement(framer_motion_1.motion.div, { animate: { rotate: 360 }, transition: { duration: 2, repeat: Infinity, ease: 'linear' } },
                        react_1["default"].createElement(lucide_react_1.Calendar, { className: "h-8 w-8 text-primary" })),
                    react_1["default"].createElement("div", { className: "flex-1" },
                        react_1["default"].createElement("h3", { className: "font-semibold text-lg" }, message),
                        react_1["default"].createElement("p", { className: "text-sm text-muted-foreground" },
                            "Elapsed: ",
                            formatTime(elapsedTime),
                            estimatedTime && " \u2022 Est. remaining: " + formatTime(Math.max(0, estimatedTime - elapsedTime))))),
                progress !== undefined && (react_1["default"].createElement("div", { className: "space-y-2" },
                    react_1["default"].createElement("div", { className: "flex justify-between text-sm" },
                        react_1["default"].createElement("span", { className: "text-muted-foreground" }, "Progress"),
                        react_1["default"].createElement("span", { className: "font-medium" },
                            Math.round(progress),
                            "%")),
                    react_1["default"].createElement(progress_1.Progress, { value: progress, className: "h-2" }))),
                react_1["default"].createElement("div", { className: "space-y-3" }, steps.map(function (step, index) { return (react_1["default"].createElement(framer_motion_1.motion.div, { key: index, initial: { opacity: 0, x: -20 }, animate: { opacity: 1, x: 0 }, transition: { delay: index * 0.1 }, className: "flex items-center gap-3" },
                    step.status === 'complete' && (react_1["default"].createElement(lucide_react_1.CheckCircle2, { className: "h-4 w-4 text-green-600 flex-shrink-0" })),
                    step.status === 'active' && (react_1["default"].createElement(lucide_react_1.Loader2, { className: "h-4 w-4 text-primary animate-spin flex-shrink-0" })),
                    step.status === 'pending' && (react_1["default"].createElement("div", { className: "h-4 w-4 rounded-full border-2 border-gray-300 flex-shrink-0" })),
                    react_1["default"].createElement("span", { className: "text-sm " + (step.status === 'complete'
                            ? 'text-green-600 font-medium'
                            : step.status === 'active'
                                ? 'text-primary font-medium'
                                : 'text-muted-foreground') }, step.label))); })),
                react_1["default"].createElement("div", { className: "bg-blue-50 border border-blue-200 rounded-lg p-3" },
                    react_1["default"].createElement("p", { className: "text-xs text-blue-900" },
                        "\uD83D\uDCA1 ",
                        react_1["default"].createElement("strong", null, "Tip:"),
                        " You can navigate away - generation will continue in the background. We'll notify you when it's complete."))))));
}
exports.GenerationLoading = GenerationLoading;
