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

  // Debug: log initial data
  console.log('🖼️ Initial images passed to GalleryGrid:', props.initialImages);

  watch(images, (newImages: GalleryImage[]) => {
    console.log('🔄 Images updated:', newImages);
  });

  // Check that image is valid
  function isValidImage(img: GalleryImage): boolean {
    return !!img?.thumb;
  }

  // Infinite scroll + GLightbox state
  const page = ref(1);
  const isLoading = ref(false);
  const sentinel = ref<HTMLElement | null>(null);
  let observer: IntersectionObserver;
  let lightbox: any = null;

  async function loadMoreImages() {
    if (!enableInfinite || isLoading.value) return;

    isLoading.value = true;

    try {
      const nextPage = page.value + 1;
      const limit = 5;

      const res = await fetch(`/api/gallery?page=${nextPage}&limit=${limit}`);
      const newImages: GalleryImage[] = await res.json();

      console.log('📥 Loaded new images:', newImages);

      if (newImages.length > 0) {
        images.value = [...images.value, ...newImages];
        page.value = nextPage;

        await nextTick();

        // Instead of destroying and reinitializing, just reload
        if (lightbox?.reload) {
          lightbox.reload();
        }
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

    // Attach observer for infinite scroll
    observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          console.log('📸 Sentinel intersected');
          loadMoreImages();
        }
      },
      { rootMargin: '100px', threshold: 0.1 }
    );

    // Delay slightly to avoid early triggers
    setTimeout(() => {
      if (sentinel.value) {
        observer.observe(sentinel.value);
        console.log('👁️ Observer attached to sentinel');
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
</style>
