import { vi } from 'vitest';

// Mock IntersectionObserver for gallery tests
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  disconnect: vi.fn(),
  unobserve: vi.fn(),
}));

// Mock GLightbox module
vi.mock('glightbox', () => ({
  default: vi.fn().mockImplementation(() => ({
    reload: vi.fn(),
    destroy: vi.fn(),
  })),
}));

// Mock fetch for API tests
global.fetch = vi.fn();