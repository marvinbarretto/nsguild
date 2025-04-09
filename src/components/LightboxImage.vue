<template>
  
  <a :href="image.lightboxUrl" class="image-wrapper glightbox polaroid" data-gallery="gallery1">
    <img 
      :src="image.thumbnailUrl"
      :alt="image.altText || 'Gallery image'"
      loading="lazy"
    />
  </a>
</template>

  
  <script setup lang="ts">
  // Receive props passed into the component.
  const props = defineProps<{
    image: ImageData;
  }>();
  
  // Destructure for easier access
  const { image } = props;
  </script>
  
  <style scoped>
  /* Polaroid card look */
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
  
  /* Optional 3D hover effect */
  .polaroid:hover {
    transform: scale(1.03);
  }
  
  .polaroid img {
    width: 100%;
    height: auto;
    /* object-fit: cover; */
    border-radius: 2px;
  }
  </style>
  