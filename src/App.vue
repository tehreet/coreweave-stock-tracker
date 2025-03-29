<template>
  <div id="app">
    <h1>CoreWeave Stock Tracker</h1>
    <p v-if="!isMounted">Loading Chart...</p>
    <TradingViewWidget v-if="isMounted" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import TradingViewWidget from './components/TradingViewWidget.vue';

const isMounted = ref(false);

onMounted(() => {
  // This ensures TradingViewWidget only renders client-side
  isMounted.value = true;
});
</script>

<style scoped>
h1 {
  color: #34495e;
  text-align: center;
}
div#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
p {
  text-align: center;
}
</style>
