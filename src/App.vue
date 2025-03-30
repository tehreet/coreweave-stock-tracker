<template>
  <div id="app">
    <ClientOnly>
      <!-- Content that requires the browser -->
      <TradingViewWidget />
      
      <!-- Optional: Placeholder content shown during SSR -->
      <template #placeholder>
        <p class="loading-text">Loading Chart...</p>
      </template>
    </ClientOnly>
  </div>
</template>

<script setup>
import TradingViewWidget from './components/TradingViewWidget.vue';
</script>

<!-- Scoped styles for this component -->
<style scoped>
div#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.loading-text {
  color: #d1d4dc; /* Match body text color */
  font-size: 1.2em;
  margin-top: 50px; /* Space it down a bit */
}
</style>

<!-- Global styles (NOT scoped) -->
<style>
body {
  background-color: #131722; /* Dark background */
  /* Simple repeating cow emoji background using SVG data URI */
  background-image: url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='50' height='50'><text x='0' y='35' font-size='30'>🐄</text></svg>");
  background-repeat: repeat;
  background-size: 50px 50px; /* Adjust size as needed */

  color: #d1d4dc; /* Light text for contrast */
  margin: 0;
  padding-top: 20px; /* Add some space above the widget */
  font-family: Avenir, Helvetica, Arial, sans-serif; /* Consistent font */
}
</style>
