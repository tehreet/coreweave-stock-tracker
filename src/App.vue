<template>
  <div id="app">
    <h1>CoreWeave Stock Tracker (SSR Example)</h1>
    <p>Loading chart...</p>
    <!-- Only render the widget on the client-side -->
    <TradingViewWidget v-if="isMounted" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import TradingViewWidget from './components/TradingViewWidget.vue';

const isMounted = ref(false);

onMounted(() => {
  // Set this to true only after the component mounts in the browser
  isMounted.value = true;
});
</script>

<style>
body {
  font-family: sans-serif;
  margin: 0;
  background-color: #131722; /* Dark background matching TradingView dark theme */
  color: #d1d4dc; /* Light text color */
}

#app {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

h1 {
  text-align: center;
  color: #b2b5be;
  margin-bottom: 30px;
}

p {
    text-align: center;
    font-style: italic;
}
</style>
