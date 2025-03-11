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

export interface Homepage {
  homepageImage?: { asset: { url: string } };
  welcomeWidget?: (RichTextBlock | ImageBlock)[];
}

export interface EventType {
  title: string;
  date: string;
  slug: { current: string };
  description: string;
  relatedGallery?: {
    title: string;
    slug: string;
  };
  imageUrl?: string;
}

export interface Post {
  title: string;
  publishedAt: string;
  slug: { current: string };
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
}

export interface Gallery {
  title: string;
  slug: string;
  images: GalleryImage[];
};

export interface GalleryImage {
  url: string;
  thumbnailUrl: string;
  altText?: string;
  caption?: string;
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