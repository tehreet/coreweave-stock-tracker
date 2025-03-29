<template>
  <div id="app">
    <h1>SSR Test</h1>
    <!-- Client-side only section -->
    <div v-if="isMounted">
        <h2>Client Mounted</h2>
        <TradingViewWidget />
    </div>
    <div v-else>
        <p>Waiting for client mount...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import TradingViewWidget from './components/TradingViewWidget.vue';

const isMounted = ref(false);

onMounted(() => {
  isMounted.value = true;
});
</script>

<style>
body {
  font-family: sans-serif;
  margin: 0;
  background-color: #131722;
  color: #d1d4dc;
}
#app {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}
h1, h2 {
  text-align: center;
  color: #b2b5be;
  margin-bottom: 30px;
}
p {
    text-align: center;
    font-style: italic;
}
</style>
