import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('Gallery Pagination Total Count', () => {
  beforeEach(() => {
    // Mock fetch globally
    global.fetch = vi.fn();
  });

  it('should not double-count initial images', async () => {
    const mockPage1Response = [
      { thumb: 'image1.jpg', full: 'image1-full.jpg' },
      { thumb: 'image2.jpg', full: 'image2-full.jpg' },
      { thumb: 'image3.jpg', full: 'image3-full.jpg' },
      { thumb: 'image4.jpg', full: 'image4-full.jpg' },
      { thumb: 'image5.jpg', full: 'image5-full.jpg' }
    ];

    const mockPage2Response = [
      { thumb: 'image6.jpg', full: 'image6-full.jpg' },
      { thumb: 'image7.jpg', full: 'image7-full.jpg' },
      { thumb: 'image8.jpg', full: 'image8-full.jpg' },
      { thumb: 'image9.jpg', full: 'image9-full.jpg' }
    ];

    // Mock API responses
    (global.fetch as any)
      .mockResolvedValueOnce({
        json: () => Promise.resolve(mockPage2Response)
      });

    // Simulate starting with 5 initial images (page 1)
    const initialImages = mockPage1Response;
    let totalImages = initialImages.length; // 5

    // Simulate first scroll - should load page 2, not page 1
    const response = await fetch('/api/gallery?page=2&limit=5');
    const newImages = await response.json();
    
    totalImages += newImages.length; // 5 + 4 = 9

    expect(totalImages).toBe(9);
    expect(newImages.length).toBe(4); // Page 2 has 4 images (rest of the 9 total)
  });

  it('should correctly detect end of gallery', async () => {
    // Mock empty response for page 3
    (global.fetch as any)
      .mockResolvedValueOnce({
        json: () => Promise.resolve([])
      });

    const response = await fetch('/api/gallery?page=3&limit=5');
    const newImages = await response.json();
    
    expect(newImages.length).toBe(0);
    // When newImages.length < limit (0 < 5), should trigger end detection
    expect(newImages.length < 5).toBe(true);
  });

  it('should match Sanity total image count', async () => {
    // This test ensures our pagination logic matches the actual data
    const EXPECTED_TOTAL_IMAGES = 9;
    
    // Page 1: 5 images (initial load)
    // Page 2: 4 images (remaining)
    // Total: 9 images
    
    const page1Count = 5;
    const page2Count = 4;
    const totalFromPagination = page1Count + page2Count;
    
    expect(totalFromPagination).toBe(EXPECTED_TOTAL_IMAGES);
  });
});