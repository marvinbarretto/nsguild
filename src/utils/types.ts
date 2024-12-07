export type GalleryImage = {
    thumbnailUrl: string;
    url: string;
    altText?: string;
    caption?: string;
  };
  
  export type Gallery = {
    title: string;
    slug: string;
    images: GalleryImage[];
  };
  