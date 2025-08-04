// Test helper to create a simple cache service mock
export const createMockCacheService = () => ({
  generateKey: jest.fn().mockReturnValue('test-cache-key'),
  get: jest.fn().mockReturnValue(null), // Always return null to simulate cache miss
  set: jest.fn(),
  delete: jest.fn(),
  clear: jest.fn(),
  getStats: jest.fn().mockReturnValue({ size: 0, keys: [] }),
});

export class MockCacheService {
  generateKey = jest.fn().mockReturnValue('test-cache-key');
  get = jest.fn().mockReturnValue(null);
  set = jest.fn();
  delete = jest.fn();
  clear = jest.fn();
  getStats = jest.fn().mockReturnValue({ size: 0, keys: [] });
}
