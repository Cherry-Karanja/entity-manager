// cachePolicies.ts
// Cache management policies for configurable TTL, size limits, and eviction strategies

export interface CachePolicy {
  name: string;
  ttl: number; // Time to live in milliseconds
  maxSize: number; // Maximum number of entries
  evictionStrategy: 'lru' | 'lfu' | 'fifo' | 'random';
  refreshThreshold: number; // Percentage of TTL when to refresh (0-1)
  priority: 'low' | 'medium' | 'high';
  compressionEnabled: boolean;
  persistenceEnabled: boolean;
}

export interface CachePolicyManagerConfig {
  defaultPolicy: CachePolicy;
  policies: Record<string, CachePolicy>;
  globalMaxSize: number;
  enableAutoCleanup: boolean;
  cleanupInterval: number; // in milliseconds
}

export class CachePolicyManager {
  private config: CachePolicyManagerConfig;
  private cleanupTimer?: NodeJS.Timeout;

  constructor(config: CachePolicyManagerConfig) {
    this.config = config;
    this.initializeCleanup();
  }

  private initializeCleanup(): void {
    if (this.config.enableAutoCleanup) {
      this.cleanupTimer = setInterval(() => {
        // Cleanup logic will be handled by CacheManager
      }, this.config.cleanupInterval);
    }
  }

  getPolicy(entityType: string): CachePolicy {
    return this.config.policies[entityType] || this.config.defaultPolicy;
  }

  getDefaultPolicy(): CachePolicy {
    return this.config.defaultPolicy;
  }

  updatePolicy(entityType: string, policy: Partial<CachePolicy>): void {
    if (this.config.policies[entityType]) {
      this.config.policies[entityType] = { ...this.config.policies[entityType], ...policy };
    } else {
      this.config.policies[entityType] = { ...this.config.defaultPolicy, ...policy, name: entityType };
    }
  }

  removePolicy(entityType: string): void {
    delete this.config.policies[entityType];
  }

  getAllPolicies(): Record<string, CachePolicy> {
    return { ...this.config.policies };
  }

  shouldRefresh(entry: any, policy: CachePolicy): boolean {
    const age = Date.now() - entry.timestamp;
    const ageRatio = age / policy.ttl;
    return ageRatio >= policy.refreshThreshold;
  }

  shouldEvict(entry: any, policy: CachePolicy): boolean {
    // This will be used by eviction strategies
    return false; // Placeholder - actual logic in CacheManager
  }

  getGlobalMaxSize(): number {
    return this.config.globalMaxSize;
  }

  isCompressionEnabled(policy: CachePolicy): boolean {
    return policy.compressionEnabled;
  }

  isPersistenceEnabled(policy: CachePolicy): boolean {
    return policy.persistenceEnabled;
  }

  getPriority(policy: CachePolicy): 'low' | 'medium' | 'high' {
    return policy.priority;
  }

  destroy(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
    }
  }
}

export class EvictionStrategy {
  static lru(entries: Map<string, any>): string[] {
    // Least Recently Used - evict oldest accessed
    return Array.from(entries.entries())
      .sort(([, a], [, b]) => a.lastAccessed - b.lastAccessed)
      .map(([key]) => key);
  }

  static lfu(entries: Map<string, any>): string[] {
    // Least Frequently Used - evict least accessed
    return Array.from(entries.entries())
      .sort(([, a], [, b]) => a.accessCount - b.accessCount)
      .map(([key]) => key);
  }

  static fifo(entries: Map<string, any>): string[] {
    // First In First Out - evict oldest entries
    return Array.from(entries.entries())
      .sort(([, a], [, b]) => a.timestamp - b.timestamp)
      .map(([key]) => key);
  }

  static random(entries: Map<string, any>): string[] {
    // Random eviction
    const keys = Array.from(entries.keys());
    for (let i = keys.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [keys[i], keys[j]] = [keys[j], keys[i]];
    }
    return keys;
  }
}

export class CachePolicyFactory {
  static createDefaultPolicy(): CachePolicy {
    return {
      name: 'default',
      ttl: 5 * 60 * 1000, // 5 minutes
      maxSize: 1000,
      evictionStrategy: 'lru',
      refreshThreshold: 0.8, // Refresh when 80% of TTL is reached
      priority: 'medium',
      compressionEnabled: false,
      persistenceEnabled: false,
    };
  }

  static createHighPriorityPolicy(): CachePolicy {
    return {
      name: 'high-priority',
      ttl: 10 * 60 * 1000, // 10 minutes
      maxSize: 2000,
      evictionStrategy: 'lru',
      refreshThreshold: 0.7,
      priority: 'high',
      compressionEnabled: true,
      persistenceEnabled: true,
    };
  }

  static createLowPriorityPolicy(): CachePolicy {
    return {
      name: 'low-priority',
      ttl: 2 * 60 * 1000, // 2 minutes
      maxSize: 500,
      evictionStrategy: 'fifo',
      refreshThreshold: 0.9,
      priority: 'low',
      compressionEnabled: false,
      persistenceEnabled: false,
    };
  }

  static createSessionPolicy(): CachePolicy {
    return {
      name: 'session',
      ttl: 30 * 60 * 1000, // 30 minutes
      maxSize: 5000,
      evictionStrategy: 'lfu',
      refreshThreshold: 0.5,
      priority: 'medium',
      compressionEnabled: true,
      persistenceEnabled: false,
    };
  }
}

export const defaultCachePolicyConfig: CachePolicyManagerConfig = {
  defaultPolicy: CachePolicyFactory.createDefaultPolicy(),
  policies: {
    'user': CachePolicyFactory.createHighPriorityPolicy(),
    'property': CachePolicyFactory.createSessionPolicy(),
    'tenant': CachePolicyFactory.createSessionPolicy(),
    'lease': CachePolicyFactory.createLowPriorityPolicy(),
    'payment': CachePolicyFactory.createLowPriorityPolicy(),
    'maintenance': CachePolicyFactory.createSessionPolicy(),
    'report': CachePolicyFactory.createHighPriorityPolicy(),
  },
  globalMaxSize: 10000,
  enableAutoCleanup: true,
  cleanupInterval: 60 * 1000, // 1 minute
};