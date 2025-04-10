<template>
  <a :href="image.url" class="image-wrapper glightbox polaroid" data-gallery="gallery1">
    <img 
      :src="image.url"
      :alt="''"
      loading="lazy"
    />
  </a>
</template>
  
<script setup lang="ts">
import type { GalleryImage } from '../utils/types';

const props = defineProps<{
  image: GalleryImage;
}>();

const altText = 'Gallery image';
</script>

  
<style scoped>
  .polaroid {
    position: relative;
    padding: 10px;
    background: white;
    border: 1px solid #ccc;
    border-bottom: 30px solid white;
    box-shadow: 2px 4px 12px rgba(0, 0, 0, 0.25);
    transform-style: preserve-3d;
    transition: transform 0.3s ease;
    border-radius: 3px;
    cursor: pointer;
    display: inline-block;
  }
  
  .polaroid:hover {
    transform: scale(1.03);
  }
  
  .polaroid img {
    width: 100%;
    height: auto;
    border-radius: 2px;
  }
</style>
  