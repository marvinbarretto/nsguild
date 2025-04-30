<template>
  <a
    :href="image.full"
    class="image-wrapper glightbox polaroid"
    data-gallery="gallery1"
  >

    <img
      :src="image.thumb"
      loading="lazy"
      decoding="async"
      alt=""
    />
  </a>
</template>

<script setup lang="ts">
import type { GalleryImage } from '../../utils/types';

const props = defineProps<{
  image: GalleryImage;
}>();
</script>

  
<style scoped lang="scss">
  .polaroid {
    position: relative;
    padding: .5rem;
    background: white;
    border: 1px solid #ccc;
    border-bottom: 30px solid white;
    box-shadow: 2px 4px 12px rgba(0, 0, 0, 0.2);
    transform-style: preserve-3d;
    transition: transform 0.3s ease;
    border-radius: 3px;
    cursor: pointer;
    display: inline-block;
    
    &:hover {
      transform: scale(1.03);
    }

    img {
      width: 100%;
      height: auto;
      border-radius: 2px;
    }
  }
</style>
  