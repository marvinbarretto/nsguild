export type Gallery = {
    title: string;
    slug: string;
    date?: string;
};
  
export type GalleryImage = {
  url: string;
  thumbnailUrl: string;
  lightboxUrl: string;
  altText?: string;
  caption?: string;
};

export type GalleryData = {
  title: string;
  date?: string;
  images: GalleryImage[];
};
