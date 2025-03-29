<template>
  <main class="app-container">
    <!-- Cowbell Button -->
    <button @click="toggleSound" class="sound-toggle-button">
      {{ isPlaying ? 'Stop Cowbell 🛑' : 'Needs More Cowbell! 🐄' }}
    </button>

    <!-- Chart Container -->
    <div class="chart-wrapper">
      <TradingViewWidget />
    </div>

    <!-- Hidden Audio Element -->
    <audio ref="audioPlayer" :src="cowbellSoundUrl" loop preload="auto"></audio>
  </main>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';
import TradingViewWidget from './components/TradingViewWidget.vue';

// State for audio playback
const isPlaying = ref(false);
const audioPlayer = ref(null); // Ref to the audio element
const cowbellSoundUrl = 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_b749a638c7.mp3'; // Same placeholder

// Function to toggle sound
const toggleSound = () => {
  isPlaying.value = !isPlaying.value;
};

// Watch for changes in isPlaying to control audio
watch(isPlaying, (newVal) => {
  if (audioPlayer.value) {
    if (newVal) {
      audioPlayer.value.play().catch(error => {
        console.error("Audio play failed:", error);
        isPlaying.value = false; // Reset if play fails
      });
    } else {
      audioPlayer.value.pause();
      audioPlayer.value.currentTime = 0; // Reset to start
    }
  }
});

// We might need specific lifecycle hooks if interaction is needed before hydration,
// but for simple playback control, watching the state is sufficient.

// Add basic styling
</script>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 1rem; /* Reduced padding */
  position: relative; /* For positioning the button */
  background-color: #0a0a0a; /* Dark background */
  color: white;
  /* Repeating cow background */
  background-image: url('https://img.freepik.com/free-vector/cute-cow-sitting-cartoon-vector-icon-illustration-animal-nature-icon-concept-isolated-premium_138676-4898.jpg?size=626&ext=jpg');
  background-repeat: repeat;
  background-size: 150px; /* Adjust size as needed */
}

.sound-toggle-button {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background-color: #4a5568; /* gray-700 */
  color: white;
  font-weight: bold;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem; /* rounded-lg */
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); /* shadow-md */
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;
  z-index: 20;
}

.sound-toggle-button:hover {
  background-color: #718096; /* gray-600 */
}

.chart-wrapper {
  width: 100%;
  max-width: 900px; /* Adjust max width as needed */
  height: 600px; /* Fixed height for the chart area */
  background-color: rgba(17, 24, 39, 0.7); /* bg-gray-900 with opacity */
  backdrop-filter: blur(4px); /* backdrop-blur-sm */
  border-radius: 0.5rem; /* rounded-lg */
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); /* shadow-xl */
  padding: 1rem;
  border: 1px solid #4b5563; /* border-gray-700 */
  z-index: 10;
  display: flex; /* Added to help center TradingViewWidget if needed */
  align-items: center;
  justify-content: center;
}
</style>
