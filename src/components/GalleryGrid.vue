<template>
  <div class="gallery">
    <LightboxImage
      v-for="img in images"
      :key="img.asset._id"
      :image="img"
    />
    <!-- Sentinel triggers infinite scroll -->
    <div ref="sentinel">
      <span v-if="isLoading">Loading more...</span>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, nextTick } from 'vue';
  import LightboxImage from '../components/LightboxImage.vue';
  import 'glightbox/dist/css/glightbox.min.css';

  const props = defineProps<{
    initialImages: ImageData[];
    infinite?: boolean;
  }>();
  const enableInfinite = props.infinite ?? true;

  // Reactive state
  const images = ref<ImageData[]>([...props.initialImages]);
  
  const page = ref(1);
  const isLoading = ref(false);
  const sentinel = ref<HTMLElement | null>(null);
  let observer: IntersectionObserver;
  let lightbox: any = null;

  // Function to load more images from API
  async function loadMoreImages() {
    if (!enableInfinite || isLoading.value) return;

    isLoading.value = true;

    try {
      const limit = 5;
      const res = await fetch(`/api/gallery?page=${page.value + 1}&limit=${limit}`);
      const newImages: ImageData[] = await res.json();

      if (newImages.length > 0) {
        images.value.push(...newImages);
        page.value++;

        await nextTick(); // Wait for DOM update

        // Refresh the lightbox to bind to new elements
        if (lightbox) lightbox.destroy();
        const { default: GLightbox } = await import('glightbox');
        lightbox = GLightbox({
          touchNavigation: true,
          loop: true,
          zoomable: true,
          openEffect: 'zoom',
          closeEffect: 'fade',
        });
      }

      // If fewer than limit returned, assume end of list
      if (newImages.length < limit) {
        observer?.disconnect();
        console.log('✅ All images loaded');
      }
    } catch (e) {
      console.error('Image fetch failed:', e);
    } finally {
      isLoading.value = false;
    }
  }

  // Setup IntersectionObserver on mount
  onMounted(async () => {
    console.log("💡 Initial images:", images.value);


    // Initialize observer
    observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          console.log('📸 Sentinel intersected');
          loadMoreImages();
        }
      },
      { rootMargin: '100px', threshold: 0.1 }
    );

    if (sentinel.value) {
      observer.observe(sentinel.value);
      console.log('👁️ Observer attached to sentinel');
    }

    // Initialize lightbox for initial images
    const { default: GLightbox } = await import('glightbox');
    lightbox = GLightbox({
      touchNavigation: true,
      loop: true,
      zoomable: true,
      openEffect: 'zoom',
      closeEffect: 'fade',
    });
  });
</script>

<style scoped>
  .gallery {
    margin: 1rem;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1rem;
  }

  .image-wrapper img {
    width: 100%;
    height: auto;
    object-fit: cover;
  }
</style>