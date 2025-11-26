"use strict";
exports.__esModule = true;
var entityManager_1 = require("@/components/entityManager");
var BASE_URL = "/api/v1/timetabling/resource-limits";
var resourceLimitClient = entityManager_1.createHttpClient({
    endpoint: BASE_URL
});
exports["default"] = resourceLimitClient;
