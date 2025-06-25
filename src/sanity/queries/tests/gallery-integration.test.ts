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

  it('should use JavaScript pagination to get different slices of data', async () => {
    // Now we fetch ALL images and slice in JavaScript
    vi.mocked(getSanityData)
      .mockResolvedValueOnce(mockImageArray)  // First call: all 10 images
      .mockResolvedValueOnce(mockImageArray); // Second call: all 10 images

    // Simulate infinite scroll: get page 1, then page 2
    const page1 = await getAllGalleryImages({ limit: 5, offset: 0 });
    const page2 = await getAllGalleryImages({ limit: 5, offset: 5 });
    
    // Extract just the image URLs for comparison
    const page1Urls = page1.map(img => img.thumb);
    const page2Urls = page2.map(img => img.thumb);
    
    console.log('Page 1 URLs:', page1Urls);
    console.log('Page 2 URLs:', page2Urls);
    
    // Verify we call getSanityData with the SAME query each time
    expect(vi.mocked(getSanityData)).toHaveBeenCalledTimes(2);
    
    const call1Args = vi.mocked(getSanityData).mock.calls[0];
    const call2Args = vi.mocked(getSanityData).mock.calls[1]; 
    expect(call1Args[0]).toBe(call2Args[0]); // Same query, different JS slicing!
    
    // The pages should be different and non-overlapping
    const hasOverlap = page1Urls.some(url => page2Urls.includes(url));
    expect(hasOverlap).toBe(false);
    expect(page1Urls).not.toEqual(page2Urls);
    expect(page1).toHaveLength(5);
    expect(page2).toHaveLength(5);
  });

  it('should handle multiple consecutive pages without duplicates', async () => {
    // Now we fetch ALL images each time and slice in JavaScript
    vi.mocked(getSanityData)
      .mockResolvedValueOnce(mockImageArray)  // First call: all 10 images
      .mockResolvedValueOnce(mockImageArray)  // Second call: all 10 images
      .mockResolvedValueOnce(mockImageArray); // Third call: all 10 images
    
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
    
    // Check we got the right number from each page
    expect(page1).toHaveLength(3);
    expect(page2).toHaveLength(3);
    expect(page3).toHaveLength(3);
  });
});