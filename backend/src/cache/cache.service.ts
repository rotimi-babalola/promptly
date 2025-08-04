import { Injectable, Logger } from '@nestjs/common';
import { createHash } from 'crypto';

interface CacheItem<T = unknown> {
  data: T;
  timestamp: number;
  ttl: number;
}

@Injectable()
export class CacheService {
  private readonly logger = new Logger(CacheService.name);
  private readonly cache = new Map<string, CacheItem>();
  private readonly DEFAULT_TTL = 60 * 60 * 1000; // 1 hour in milliseconds
  private cleanupInterval?: NodeJS.Timeout;

  constructor() {
    // Only start cleanup interval in production (not during testing)
    if (process.env.NODE_ENV !== 'test') {
      this.cleanupInterval = setInterval(() => this.cleanup(), 10 * 60 * 1000);
    }
  }

  onModuleDestroy() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
  }

  generateKey(data: string): string {
    return createHash('md5').update(data).digest('hex');
  }

  set<T>(key: string, data: T, ttl: number = this.DEFAULT_TTL): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
    this.logger.debug(`Cached item with key: ${key}`);
  }

  get<T = unknown>(key: string): T | null {
    const item = this.cache.get(key);

    if (!item) {
      return null;
    }

    // Check if item has expired
    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      this.logger.debug(`Expired cache item removed: ${key}`);
      return null;
    }

    this.logger.debug(`Cache hit for key: ${key}`);
    return item.data as T;
  }

  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
    this.logger.log('Cache cleared');
  }

  private cleanup(): void {
    const now = Date.now();
    let removedCount = 0;

    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > item.ttl) {
        this.cache.delete(key);
        removedCount++;
      }
    }

    if (removedCount > 0) {
      this.logger.debug(`Cleaned up ${removedCount} expired cache items`);
    }
  }

  getStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
  }
}
