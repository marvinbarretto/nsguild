import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET } from '../gallery';

// Mock the gallery query function
vi.mock('../../../sanity/queries/gallery', () => ({
  getAllGalleryImages: vi.fn(),
}));

const { getAllGalleryImages } = await import('../../../sanity/queries/gallery');

describe('Gallery API Route', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockImages = [
    {
      thumb: 'https://example.com/image1?w=400&auto=format',
      thumb2x: 'https://example.com/image1?w=800&auto=format',
      full: 'https://example.com/image1?w=1600&auto=format',
    },
    {
      thumb: 'https://example.com/image2?w=400&auto=format',
      thumb2x: 'https://example.com/image2?w=800&auto=format',
      full: 'https://example.com/image2?w=1600&auto=format',
    },
  ];

  it('should handle default pagination parameters', async () => {
    vi.mocked(getAllGalleryImages).mockResolvedValueOnce(mockImages);

    const url = new URL('http://localhost/api/gallery');
    const response = await GET({ url });
    
    expect(response.status).toBe(200);
    expect(getAllGalleryImages).toHaveBeenCalledWith({ limit: 5, offset: 0 });
    
    const data = await response.json();
    expect(data).toEqual(mockImages);
  });

  it('should parse page and limit parameters correctly', async () => {
    vi.mocked(getAllGalleryImages).mockResolvedValueOnce(mockImages);

    const url = new URL('http://localhost/api/gallery?page=3&limit=10');
    const response = await GET({ url });
    
    expect(response.status).toBe(200);
    expect(getAllGalleryImages).toHaveBeenCalledWith({ limit: 10, offset: 20 });
  });

  it('should handle invalid page parameter', async () => {
    vi.mocked(getAllGalleryImages).mockResolvedValueOnce(mockImages);

    const url = new URL('http://localhost/api/gallery?page=invalid&limit=5');
    const response = await GET({ url });
    
    expect(response.status).toBe(200);
    expect(getAllGalleryImages).toHaveBeenCalledWith({ limit: 5, offset: 0 });
  });

  it('should handle invalid limit parameter', async () => {
    vi.mocked(getAllGalleryImages).mockResolvedValueOnce(mockImages);

    const url = new URL('http://localhost/api/gallery?page=2&limit=invalid');
    const response = await GET({ url });
    
    expect(response.status).toBe(200);
    expect(getAllGalleryImages).toHaveBeenCalledWith({ limit: 5, offset: 5 });
  });

  it('should calculate offset correctly for different pages', async () => {
    vi.mocked(getAllGalleryImages).mockResolvedValueOnce(mockImages);

    const url = new URL('http://localhost/api/gallery?page=4&limit=8');
    const response = await GET({ url });
    
    expect(getAllGalleryImages).toHaveBeenCalledWith({ limit: 8, offset: 24 });
  });
});