<template>
    <!--
      This component renders a single image with a polaroid-style container.
      When clicked, it opens the image in a GLightbox popup viewer.
    -->
    <a
      :href="image.asset.url"
      class="glightbox polaroid"
      :data-glightbox="image.alt ? `title: ${image.alt}` : undefined"
    >
      <img
        :src="`${image.asset.url}?w=300&auto=format`"
        :alt="image.alt || 'Image'"
        width="300"
        loading="lazy"
        decoding="async"
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
    object-fit: cover;
    border-radius: 2px;
  }
  </style>
  