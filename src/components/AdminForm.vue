<script setup>
import { ref, onMounted } from 'vue';

// State to store settings
const settings = ref({
  siteTitle: '',
  footerText: '',
});

// Fetch settings from the API
async function fetchSettings() {
  console.log('Fetching settings...');
  try {
    const API_BASE_URL = import.meta.env.SITE || 'http://localhost:4321'; // Default to localhost in dev
    console.log('API_BASE_URL:', API_BASE_URL);

    const response = await fetch(`${API_BASE_URL}/api/getSettings`);
    console.log('Response:', response);

    if (!response.ok) {
      throw new Error(`Error fetching settings: ${response.statusText}`);
    }

    const responseData = await response.json();
    console.log('Parsed Response Data:', responseData);

    // Update settings with data from the API
    settings.value = responseData;
    console.log('Updated Settings:', settings.value);
  } catch (error) {
    console.error('Failed to fetch settings:', error);
  }
}

// Submit updated settings
async function updateSettings(event) {
  console.log('updateSettings triggered'); // Debug log
  event.preventDefault(); // Explicitly prevent the default behavior
  console.log('Default behavior prevented');
  console.log('Settings:', settings.value);

  // Simulate what would be sent to the server
  try {
    const API_BASE_URL = import.meta.env.SITE || 'http://localhost:4321';
    console.log(`Simulated POST to ${API_BASE_URL}/api/updateSettings`);
    console.log('Payload:', JSON.stringify(settings.value));
  } catch (error) {
    console.error('Failed to log settings:', error);
  }
}

// Fetch settings on component mount
onMounted(() => {
  fetchSettings();
});
</script>

<template>
  <form @submit="updateSettings" class="space-y-4">
    <label class="block">
      <span class="text-gray-700">Site Title</span>
      <input
        v-model="settings.siteTitle"
        type="text"
        placeholder="Enter site title"
        class="mt-1 block w-full px-3 py-2 border rounded"
      />
    </label>

    <label class="block">
      <span class="text-gray-700">Footer Text</span>
      <textarea
        v-model="settings.footerText"
        placeholder="Enter footer text"
        class="mt-1 block w-full px-3 py-2 border rounded"
      ></textarea>
    </label>

    <button
      type="submit"
      class="bg-blue-600 text-white px-4 py-2 rounded"
    >
      Save Changes
    </button>
  </form>
</template>
