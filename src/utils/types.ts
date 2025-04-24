export type RichTextBlock = {
  _type: 'block';
  children: { text: string }[];
};

export type Globals = {
  siteTitle: string;
  description: string;
  keywords: string;
  footerText: string;
  programmeUrl: string;
}

export type Banner = {
  message: string;
  isActive: boolean;
  link?: string;
}

export type Homepage = {
  description: string;
  whoWeAre: RichTextBlock;
  whatWeDo: RichTextBlock;
  whenWeMeet: RichTextBlock;
  whereWeMeet: RichTextBlock;
  banner?: Banner;
  carouselImages: { asset: { url: string } }[];
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

export interface PagesContent {
  newsPageDescription?: string;
  eventsPageDescription?: string;
  distaffPageDescription?: string;
  equipmentPageDescription?: string;
}


export interface Post {
  title: string;
  publishedAt: string;
  newsPageDescription?: string;
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
  category: "For Sale" | "For Hire";
  description: any;
  image: GalleryImage;
}

export type Gallery = {
  title: string;
  slug: string;
  images: GalleryImage[];
  date?: string;
};



export type GalleryImage = {
  url: string;
};


export type GalleryData = {
  title: string;
  slug: string; 
  date?: string;
  images: GalleryImage[];
};


export type ImageBlock = {
  _type: 'image';
  asset: { url: string };
  alt?: string;
};

export type ImageData = {
  asset: {
    _id: string;
    url: string;
  };
};

export type PhotoAlbum = {
  title: string;
  slug: string;
  date?: string;
  images: GalleryImage[];
}