// ./src/sanity/lib/image-builder.ts

import { sanityClient } from 'sanity:client';
import imageUrlBuilder from '@sanity/image-url';
import type { SanityAsset } from '@sanity/image-url/lib/types/types';

export const imageBuilder = imageUrlBuilder(sanityClient);

export function imageBuilderFor(source: SanityAsset) {
  return imageBuilder.image(source);
}

export function srcSetForImage(
  source: SanityAsset,
  widths = [400, 800, 1200, 1600],
  height?: number,
  fit: 'max' | 'crop' = 'max'
): string {
  return widths
    .map((width) => {
      let builder = imageBuilderFor(source)
        .width(width)
        .auto('format')
        .fit(fit);

      if (height) builder = builder.height(height);

      return `${builder.url()} ${width}w`;
    })
    .join(', ');
}

/**
 * Carousel Variants (big, cropped, background-style)
 */
export function getCarouselImageUrl(source: SanityAsset, width = 1600, height = 500): string {
  return imageBuilderFor(source)
    .width(width)
    .height(height)
    .fit('crop')
    .auto('format')
    .url();
}

export function getCarouselSrcSet(source: SanityAsset): string {
  return srcSetForImage(source, [400, 800, 1200, 1600, 1920], 500, 'crop');
}

/***
 * Gallery Thumbnail (grid display)
 */
export function getGalleryThumbUrl(source: SanityAsset, width = 600): string {
  return imageBuilderFor(source)
    .width(width)
    .fit('max')
    .auto('format')
    .url();
}

export function getGalleryThumbSrcSet(source: SanityAsset): string {
  return srcSetForImage(source, [300, 600, 900]);
}

/***
 * Fullscreen / Lightbox View
 */
export function getGalleryFullUrl(source: SanityAsset, width = 1600): string {
  return imageBuilderFor(source)
    .width(width)
    .fit('max')
    .auto('format')
    .url();
}

export function getGalleryFullSrcSet(source: SanityAsset): string {
  return srcSetForImage(source, [800, 1200, 1600, 1920]);
}
