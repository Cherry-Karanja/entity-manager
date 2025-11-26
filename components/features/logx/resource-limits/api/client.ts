import { createHttpClient } from "@/components/entityManager";
import type { ResourceLimit } from "../../types";

const BASE_URL = "/api/v1/timetabling/resource-limits";

const resourceLimitClient = createHttpClient<ResourceLimit>({
  endpoint: BASE_URL,
});

export default resourceLimitClient;
