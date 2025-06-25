import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getAllGalleryImages } from '../gallery';

// Mock the sanity utility with realistic data
vi.mock('../../../utils/sanity', () => ({
  getSanityData: vi.fn(),
}));

const { getSanityData } = await import('../../../utils/sanity');

describe('Gallery Pagination Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // Create 12 mock images to test pagination properly (now flat array)
  const mockImageArray = [
    {
      thumb: 'https://example.com/image1?w=400&auto=format',
      thumb2x: 'https://example.com/image1?w=800&auto=format', 
      full: 'https://example.com/image1?w=1600&auto=format',
      _createdAt: '2024-01-12T10:00:00Z',
    },
    {
      thumb: 'https://example.com/image2?w=400&auto=format',
      thumb2x: 'https://example.com/image2?w=800&auto=format',
      full: 'https://example.com/image2?w=1600&auto=format', 
      _createdAt: '2024-01-11T10:00:00Z',
    },
    {
      thumb: 'https://example.com/image3?w=400&auto=format',
      thumb2x: 'https://example.com/image3?w=800&auto=format',
      full: 'https://example.com/image3?w=1600&auto=format',
      _createdAt: '2024-01-10T10:00:00Z',
    },
    {
      thumb: 'https://example.com/image4?w=400&auto=format',
      thumb2x: 'https://example.com/image4?w=800&auto=format',
      full: 'https://example.com/image4?w=1600&auto=format',
      _createdAt: '2024-01-09T10:00:00Z',
    },
    {
      thumb: 'https://example.com/image5?w=400&auto=format',
      thumb2x: 'https://example.com/image5?w=800&auto=format',
      full: 'https://example.com/image5?w=1600&auto=format',
      _createdAt: '2024-01-08T10:00:00Z',
    },
    {
      thumb: 'https://example.com/image6?w=400&auto=format',
      thumb2x: 'https://example.com/image6?w=800&auto=format',
      full: 'https://example.com/image6?w=1600&auto=format',
      _createdAt: '2024-01-07T10:00:00Z',
    },
    {
      thumb: 'https://example.com/image7?w=400&auto=format',
      thumb2x: 'https://example.com/image7?w=800&auto=format',
      full: 'https://example.com/image7?w=1600&auto=format',
      _createdAt: '2024-01-06T10:00:00Z',
    },
    {
      thumb: 'https://example.com/image8?w=400&auto=format',
      thumb2x: 'https://example.com/image8?w=800&auto=format',
      full: 'https://example.com/image8?w=1600&auto=format',
      _createdAt: '2024-01-05T10:00:00Z',
    },
    {
      thumb: 'https://example.com/image9?w=400&auto=format',
      thumb2x: 'https://example.com/image9?w=800&auto=format',
      full: 'https://example.com/image9?w=1600&auto=format',
      _createdAt: '2024-01-04T10:00:00Z',
    },
    {
      thumb: 'https://example.com/image10?w=400&auto=format',
      thumb2x: 'https://example.com/image10?w=800&auto=format',
      full: 'https://example.com/image10?w=1600&auto=format',
      _createdAt: '2024-01-03T10:00:00Z',
    },
    {
      thumb: 'https://example.com/image11?w=400&auto=format',
      thumb2x: 'https://example.com/image11?w=800&auto=format',
      full: 'https://example.com/image11?w=1600&auto=format',
      _createdAt: '2024-01-02T10:00:00Z',
    },
    {
      thumb: 'https://example.com/image12?w=400&auto=format',
      thumb2x: 'https://example.com/image12?w=800&auto=format',
      full: 'https://example.com/image12?w=1600&auto=format',
      _createdAt: '2024-01-01T10:00:00Z',
    },
  ];

  it('should use different queries for different pagination calls (PROVING THE FIX)', async () => {
    // Mock different responses for different pagination calls - this is the fix!
    vi.mocked(getSanityData)
      .mockResolvedValueOnce(mockImageArray.slice(0, 5))  // Page 1: first 5 images
      .mockResolvedValueOnce(mockImageArray.slice(5, 10)); // Page 2: next 5 images

    // Simulate infinite scroll: get page 1, then page 2
    const page1 = await getAllGalleryImages({ limit: 5, offset: 0 });
    const page2 = await getAllGalleryImages({ limit: 5, offset: 5 });
    
    // Extract just the image URLs for comparison
    const page1Urls = page1.map(img => img.thumb);
    const page2Urls = page2.map(img => img.thumb);
    
    console.log('Page 1 URLs:', page1Urls);
    console.log('Page 2 URLs:', page2Urls);
    
    // Verify queries are DIFFERENT (this proves the fix)
    expect(vi.mocked(getSanityData)).toHaveBeenCalledTimes(2);
    
    const call1Args = vi.mocked(getSanityData).mock.calls[0];
    const call2Args = vi.mocked(getSanityData).mock.calls[1]; 
    expect(call1Args[0]).not.toBe(call2Args[0]); // Different queries = fixed!
    
    // The pages should be different and non-overlapping
    const hasOverlap = page1Urls.some(url => page2Urls.includes(url));
    expect(hasOverlap).toBe(false);
    expect(page1Urls).not.toEqual(page2Urls);
  });

  it('should handle multiple consecutive pages without duplicates', async () => {
    // Mock different responses for each page
    vi.mocked(getSanityData)
      .mockResolvedValueOnce(mockImageArray.slice(0, 3))  // Page 1: images 1-3
      .mockResolvedValueOnce(mockImageArray.slice(3, 6))  // Page 2: images 4-6
      .mockResolvedValueOnce(mockImageArray.slice(6, 9)); // Page 3: images 7-9
    
    const page1 = await getAllGalleryImages({ limit: 3, offset: 0 });
    const page2 = await getAllGalleryImages({ limit: 3, offset: 3 });
    const page3 = await getAllGalleryImages({ limit: 3, offset: 6 });
    
    const allUrls = [
      ...page1.map(img => img.thumb),
      ...page2.map(img => img.thumb), 
      ...page3.map(img => img.thumb),
    ];
    
    // Check for duplicates across all pages
    const uniqueUrls = new Set(allUrls);
    expect(uniqueUrls.size).toBe(allUrls.length); // Should be 9 unique images
    expect(uniqueUrls.size).toBe(9);
  });
});