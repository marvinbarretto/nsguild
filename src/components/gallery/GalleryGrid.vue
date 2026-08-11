<template>
  <div class="gallery">
    <div
      v-for="(img, index) in images"
      :key="img.thumb || index"
    >
      <LightboxImage
        v-if="isValidImage(img)"
        :image="img"
      />
    </div>

    <!-- Sentinel triggers infinite scroll -->
    <div ref="sentinel">
      <span v-if="isLoading">Loading more...</span>
      <div v-else-if="allImagesLoaded" class="end-message">
        <span>🎨 End of gallery</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, nextTick, watch } from 'vue';
  import LightboxImage from './LightboxImage.vue';
  import 'glightbox/dist/css/glightbox.min.css';
  import type { GalleryImage } from '../../utils/types';

  const props = defineProps<{
    initialImages: GalleryImage[];
    infinite?: boolean;
  }>();

  const enableInfinite = props.infinite ?? true;
  const images = ref<GalleryImage[]>([...props.initialImages]);

  // Check that image is valid
  function isValidImage(img: GalleryImage): boolean {
    return !!img?.thumb;
  }

  // Infinite scroll + GLightbox state
  const page = ref(1); // Start at 1 since we already have page 1 images
  const isLoading = ref(false);
  const allImagesLoaded = ref(false);
  const sentinel = ref<HTMLElement | null>(null);
  let observer: IntersectionObserver;
  let lightbox: any = null;

  async function loadMoreImages() {
    if (!enableInfinite || isLoading.value || allImagesLoaded.value) {
      return;
    }

    isLoading.value = true;
    const nextPage = page.value + 1;
    const limit = 5;

    try {
      const res = await fetch(`/api/gallery?page=${nextPage}&limit=${limit}`, {
        cache: 'no-cache'
      });
      const newImages: GalleryImage[] = await res.json();

      if (newImages.length > 0) {
        images.value = [...images.value, ...newImages];
        page.value = nextPage;

        await nextTick();

        // Instead of destroying and reinitializing, just reload
        if (lightbox?.reload) {
          lightbox.reload();
        }
      }

      // Check if we've reached the end
      if (newImages.length < limit) {
        allImagesLoaded.value = true;
        observer?.disconnect();
      }
    } catch (e) {
      console.error('❌ Image fetch failed:', e);
    } finally {
      isLoading.value = false;
    }
  }

  onMounted(async () => {
    // Attach observer for infinite scroll
    observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          loadMoreImages();
        }
      },
      { rootMargin: '100px', threshold: 0.1 }
    );

    // Delay slightly to avoid early triggers
    setTimeout(() => {
      if (sentinel.value) {
        observer.observe(sentinel.value);
      }
    }, 250);

    // Initialize GLightbox once
    const { default: GLightbox } = await import('glightbox');
    lightbox = GLightbox({
      touchNavigation: true,
      loop: true,
      zoomable: true,
      openEffect: 'zoom',
      closeEffect: 'fade',
      selector: '.glightbox'
    });
  });
</script>

<style scoped>
.gallery {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
  padding: 1rem;
}

.end-message {
  /* Primary: Grid column spanning */
  grid-column: 1 / -1;
  
  /* Fallback: Full width */
  width: 100%;
  display: block;
  
  /* Visual styling */
  text-align: center;
  color: #666;
  font-style: italic;
  
  /* Visual separator */
  border-top: 1px solid #eee;
  margin-top: 1rem;
  
  /* Responsive padding */
  padding: clamp(1rem, 4vw, 2rem);
}
</style>
