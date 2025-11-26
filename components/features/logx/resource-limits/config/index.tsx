export { resourceLimitFields } from "./fields";
export { resourceLimitListConfig } from "./list";
export { resourceLimitViewConfig } from "./view";
export { resourceLimitActionsConfig } from "./actions";
export { resourceLimitExportConfig } from "./export";

import type { EntityConfig } from '@/components/entityManager/composition/config/types';
import type { ResourceLimit } from '../../types';

/**
 * Canonical EntityConfig for Resource Limits
 * This mirrors the pattern used by the accounts module (e.g. userConfig)
 */
export const resourceLimitConfig: EntityConfig<ResourceLimit> = {
	name: 'resource_limit',
	label: 'Resource Limit',
	labelPlural: 'Resource Limits',
	description: 'Limits for resource usage within timetables',
	list: resourceLimitListConfig,
	form: { fields: resourceLimitFields },
	view: resourceLimitViewConfig,
	actions: resourceLimitActionsConfig,
	exporter: resourceLimitExportConfig,
	apiEndpoint: '/api/v1/timetabling/resource-limits',
	icon: 'Gauge',
	permissions: {
		create: true,
		read: true,
		update: true,
		delete: true,
		export: true,
	},
	metadata: {
		category: 'scheduling',
		tags: ['resource', 'limits', 'timetabling'],
	},
};

export default resourceLimitConfig;
