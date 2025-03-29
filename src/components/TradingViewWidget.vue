<template>
  <div class="tradingview-widget-container" ref="widgetContainer"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const widgetContainer = ref(null);
let widgetInstance = null;

onMounted(() => {
  // Check if TradingView is loaded (it might be loaded via script tag in index.html or dynamically)
  if (typeof TradingView !== 'undefined') {
    if (widgetContainer.value) {
      widgetInstance = new TradingView.widget({
        autosize: true,
        symbol: "CRWV", 
        interval: "1S",
        timezone: "Etc/UTC",
        theme: "dark",
        style: "1",
        locale: "en",
        enable_publishing: false,
        allow_symbol_change: true,
        container_id: widgetContainer.value.id || "tradingview-widget-container"
      });
    }
  } else {
    console.error('TradingView library not loaded.');
  }
});

onUnmounted(() => {
  // Clean up the widget if the component is destroyed
  if (widgetInstance && widgetContainer.value) {
    // The library doesn't provide a direct destroy method typically,
    // so we remove the container's contents.
    // Check TradingView docs for best cleanup practices if available.
    widgetContainer.value.innerHTML = '';
    widgetInstance = null;
  }
});
</script>

<style scoped>
.tradingview-widget-container {
  height: 500px; 
  width: 100%;
}
</style>
