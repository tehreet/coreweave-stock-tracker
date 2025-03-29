<template>
  <div class="tradingview-widget-container" ref="widgetContainer"></div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const widgetContainer = ref(null);

onMounted(() => {
  // This code runs ONLY on the client-side after the component is mounted
  if (widgetContainer.value && typeof TradingView !== 'undefined') {
      new TradingView.widget({
        "autosize": true,
        "symbol": "NASDAQ:NVDA", // Example: Use NVDA as a proxy/placeholder for CoreWeave concept
        "interval": "D",
        "timezone": "Etc/UTC",
        "theme": "dark",
        "style": "1",
        "locale": "en",
        "toolbar_bg": "#f1f3f6",
        "enable_publishing": false,
        "allow_symbol_change": true,
        "container_id": widgetContainer.value.id // Ensure container has an ID or ref works
      });
  } else if (widgetContainer.value) {
    // Load the TradingView script if it's not already loaded
    // This basic example assumes it might be loaded globally via index.html
    // A more robust solution might load it dynamically here.
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/tv.js';
    script.async = true;
    script.onload = () => {
      if (typeof TradingView !== 'undefined') {
        new TradingView.widget({
          "autosize": true,
          "symbol": "NASDAQ:NVDA", // Example: Placeholder
          "interval": "D",
          "timezone": "Etc/UTC",
          "theme": "dark",
          "style": "1",
          "locale": "en",
          "enable_publishing": false,
          "allow_symbol_change": true,
          "container_id": widgetContainer.value.id // Assign dynamically if needed
        });
      }
    };
    // Ensure the container has an ID for the widget config
    widgetContainer.value.id = 'tv_chart_container_' + Math.random().toString(36).substring(7);
    document.body.appendChild(script);

    // Fallback/Error message if script fails to load or TradingView object not found
    script.onerror = () => {
        widgetContainer.value.innerHTML = 'Failed to load TradingView Widget.';
    };
  } else {
      console.error('TradingView widget container not found.');
  }
});
</script>

<style scoped>
.tradingview-widget-container {
  width: 100%;
  height: 500px; /* Adjust height as needed */
}
</style>
