export type RichTextBlock = {
  _type: 'block';
  children: { text: string }[];
};

export type ImageBlock = {
  _type: 'image';
  asset: { url: string };
  alt?: string;
};

export interface Globals {
  siteTitle: string;
  footerText: string;
}

export type Banner = {
  message: string;
  isActive: boolean;
  link?: string;
}

export type Homepage = {
  homepageImage?: { asset: { url: string } };
  welcomeWidget?: (RichTextBlock | ImageBlock)[];
  banner?: Banner;
};

export interface EventType {
  title: string;
  date: string;
  slug: string;
  description: string | any[];
  relatedGallery?: {
    title: string;
    slug: string;
  };
  imageUrl?: string;
}



export interface Post {
  title: string;
  publishedAt: string;
  slug: string;
  attachPublication?: boolean;
  attachedPublication?: Publication;
  images?: {
    asset: {
      url: string;
    };
    alt?: string;
    caption?: string;
  }[];
  body: any;
  snippet?: string;
}
export interface Publication {
  _id: string;
  title: string;
  description: string;
  documentUrl: string;
}

export interface MetaProps {
  title: string;
  description?: string;
  keywords?: string;
}

export interface EquipmentType {
  title: string;
  slug: string;
  category: "For Sale" | "For Hire";  // ✅ Restrict to valid categories
  description: any;  // ✅ PortableText data type
  images: { url: string }[];  // ✅ Array of image URLs
  documentUrl?: string;  // ✅ Optional file attachment (PDF/Word)
}

export type Gallery = {
  title: string;
  slug: string;
  date?: string;
  images: GalleryImage[];
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
