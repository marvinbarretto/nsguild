export type Gallery = {
    title: string;
    slug: string;
    date?: string;
  };
  
export type GalleryImage = {
  url: string;
};

export type GalleryData = {
  title: string;
  date?: string;
  images: GalleryImage[];
};
