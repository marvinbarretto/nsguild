<template>
  <div class="gallery">
    <template v-for="(img, index) in images" :key="img.url || index">
  <LightboxImage
    v-if="isValidImage(img)"
    :image="img"
  />
</template>
    <!-- Sentinel triggers infinite scroll -->
    <div ref="sentinel">
      <span v-if="isLoading">Loading more...</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, watch } from 'vue';
import LightboxImage from '../components/LightboxImage.vue';
import 'glightbox/dist/css/glightbox.min.css';
import type { GalleryImage } from '../utils/types';
import { formatGalleryImages } from '../utils/sanity';

const props = defineProps<{
  initialImages: GalleryImage[];
  infinite?: boolean;
}>();

const enableInfinite = props.infinite ?? true;
const images = ref<GalleryImage[]>([...props.initialImages]);

// Diagnostic logs
console.log('🖼️ Initial images passed to GalleryGrid:', props.initialImages);

watch(images, (newImages: GalleryImage[]) => {
  console.log('🔄 Images updated:', newImages);
});

// Safety check for valid images
function isValidImage(img: GalleryImage): boolean {
  return !!img?.url;
}

// Pagination state
const page = ref(1);
const isLoading = ref(false);
const sentinel = ref<HTMLElement | null>(null);
let observer: IntersectionObserver;
let lightbox: any = null;

async function loadMoreImages() {
  if (!enableInfinite || isLoading.value) return;

  isLoading.value = true;

  try {
    const limit = 5;
    const res = await fetch(`/api/gallery?page=${page.value + 1}&limit=${limit}`);
    const rawImages = await res.json();

    const newImages: GalleryImage[] = formatGalleryImages(rawImages);

    console.log('📥 Loaded new images:', newImages);

    if (newImages.length > 0) {
      images.value.push(...newImages);
      page.value++;

      await nextTick();

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

onMounted(async () => {
  console.log('🔧 GalleryGrid mounted');

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
</style>
