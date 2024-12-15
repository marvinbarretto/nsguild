export type RichTextBlock = {
  _type: 'block';
  children: { text: string }[];
};

export type ImageBlock = {
  _type: 'image';
  asset: { url: string };
  alt?: string;
};
export interface Settings {
  siteTitle: string;
  siteDescription: string;
  ogImage?: { asset: { url: string } };
  headerLinks?: { title: string; href: string }[];
  footerLinks?: { title: string; href: string }[];
  footerText?: string;
  welcomeWidget?: (RichTextBlock | ImageBlock)[];
}

export interface EventType {
  title: string;
  date: string;
  description: string;
  relatedGallery?: {
    title: string;
    slug: string;
  };
  images?: {
    url: string;
    caption?: string;
  }[];
}

export interface Post {
  title: string;
  publishedAt: string;
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