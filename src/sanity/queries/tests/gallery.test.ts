import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getAllGalleryImages } from '../gallery';
import type { GalleryImage } from '../../../utils/types';

// Mock the sanity utility
vi.mock('../../../utils/sanity', () => ({
  getSanityData: vi.fn(),
}));

const { getSanityData } = await import('../../../utils/sanity');

describe('getAllGalleryImages', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // Mock data now matches the flat array structure returned by new GROQ query
  const mockImageArray = [
    {
      thumb: 'https://example.com/image1?w=400&auto=format',
      thumb2x: 'https://example.com/image1?w=800&auto=format',
      full: 'https://example.com/image1?w=1600&auto=format',
      _createdAt: '2024-01-03T10:00:00Z',
    },
    {
      thumb: 'https://example.com/image2?w=400&auto=format',
      thumb2x: 'https://example.com/image2?w=800&auto=format',
      full: 'https://example.com/image2?w=1600&auto=format',
      _createdAt: '2024-01-02T10:00:00Z',
    },
    {
      thumb: 'https://example.com/image3?w=400&auto=format',
      thumb2x: 'https://example.com/image3?w=800&auto=format',
      full: 'https://example.com/image3?w=1600&auto=format',
      _createdAt: '2024-01-01T10:00:00Z',
    },
  ];

  it('should return all images when no pagination params provided', async () => {
    vi.mocked(getSanityData).mockResolvedValueOnce(mockImageArray);

    const result = await getAllGalleryImages();

    expect(result).toHaveLength(3);
    expect(result[0]._createdAt).toBe('2024-01-03T10:00:00Z'); // Most recent first
    expect(result[1]._createdAt).toBe('2024-01-02T10:00:00Z');
    expect(result[2]._createdAt).toBe('2024-01-01T10:00:00Z'); // Oldest last
  });

  it('should respect limit parameter', async () => {
    vi.mocked(getSanityData).mockResolvedValueOnce(mockImageArray.slice(0, 2));

    const result = await getAllGalleryImages({ limit: 2 });

    expect(result).toHaveLength(2);
    expect(result[0]._createdAt).toBe('2024-01-03T10:00:00Z');
    expect(result[1]._createdAt).toBe('2024-01-02T10:00:00Z');
  });

  it('should respect offset parameter', async () => {
    vi.mocked(getSanityData).mockResolvedValueOnce(mockImageArray.slice(1, 3));

    const result = await getAllGalleryImages({ offset: 1, limit: 2 });

    expect(result).toHaveLength(2);
    expect(result[0]._createdAt).toBe('2024-01-02T10:00:00Z');
    expect(result[1]._createdAt).toBe('2024-01-01T10:00:00Z');
  });

  it('should handle pagination beyond available images', async () => {
    vi.mocked(getSanityData).mockResolvedValueOnce([]);

    const result = await getAllGalleryImages({ offset: 5, limit: 5 });

    expect(result).toHaveLength(0);
  });

  it('should filter out images without required fields', async () => {
    const incompleteImageArray = [
      {
        thumb: 'https://example.com/image1?w=400&auto=format',
        thumb2x: 'https://example.com/image1?w=800&auto=format',
        full: 'https://example.com/image1?w=1600&auto=format',
        _createdAt: '2024-01-01T10:00:00Z',
      },
      {
        // Missing thumb field
        thumb2x: 'https://example.com/image2?w=800&auto=format',
        full: 'https://example.com/image2?w=1600&auto=format',
        _createdAt: '2024-01-02T10:00:00Z',
      },
      {
        thumb: 'https://example.com/image3?w=400&auto=format',
        thumb2x: 'https://example.com/image3?w=800&auto=format',
        // Missing full field
        _createdAt: '2024-01-03T10:00:00Z',
      },
    ];

    vi.mocked(getSanityData).mockResolvedValueOnce(incompleteImageArray);

    const result = await getAllGalleryImages();

    expect(result).toHaveLength(1);
    expect(result[0].thumb).toBe('https://example.com/image1?w=400&auto=format');
  });

  it('should handle empty galleries', async () => {
    vi.mocked(getSanityData).mockResolvedValueOnce([]);

    const result = await getAllGalleryImages();

    expect(result).toHaveLength(0);
  });

  it('should handle galleries with no images', async () => {
    vi.mocked(getSanityData).mockResolvedValueOnce([]);

    const result = await getAllGalleryImages();

    expect(result).toHaveLength(0);
  });

  it('should maintain consistent ordering across multiple calls', async () => {
    // Mock different responses for different pagination calls
    vi.mocked(getSanityData)
      .mockResolvedValueOnce(mockImageArray.slice(0, 2))  // First call: images 1-2
      .mockResolvedValueOnce(mockImageArray.slice(2, 4)); // Second call: image 3

    const firstCall = await getAllGalleryImages({ limit: 2, offset: 0 });
    const secondCall = await getAllGalleryImages({ limit: 2, offset: 2 });

    // Ensure no overlap between pages
    const firstIds = firstCall.map(img => img.thumb);
    const secondIds = secondCall.map(img => img.thumb);
    
    expect(firstIds).not.toEqual(expect.arrayContaining(secondIds));
    expect(secondIds).not.toEqual(expect.arrayContaining(firstIds));
  });
});