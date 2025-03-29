<template>
  <div class="tradingview-widget-container" ref="widgetContainer"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';

const widgetContainer = ref(null);
let widgetInstance = null; // To hold the TradingView widget instance
let scriptElement = null; // To hold the script element reference

// Function to initialize the widget
const initWidget = () => {
  // Ensure container exists and TradingView library is loaded
  if (widgetContainer.value && typeof window.TradingView !== 'undefined') {
    // Prevent re-initialization
    if (!widgetContainer.value.querySelector('iframe')) {
      console.log("Initializing TradingView Widget on client...");
      widgetInstance = new window.TradingView.widget({
        autosize: true,
        symbol: "NASDAQ:CRWV",
        interval: "1",
        timezone: "Etc/UTC",
        theme: "dark",
        style: "1",
        locale: "en",
        enable_publishing: false,
        hide_side_toolbar: false,
        allow_symbol_change: true,
        container_id: widgetContainer.value.id // Dynamically assign ID or ensure static ID
      });
    } else {
      console.log("TradingView Widget already initialized.");
    }
  } else {
     console.log("Conditions not met for widget initialization.", { hasContainer: !!widgetContainer.value, hasTradingView: typeof window.TradingView !== 'undefined' })
  }
};

// Load the TradingView script and initialize the widget *only on the client*
onMounted(() => {
  // Assign a unique ID if the container doesn't have one
  if (widgetContainer.value && !widgetContainer.value.id) {
      widgetContainer.value.id = `tradingview_${Math.random().toString(36).substring(7)}`;
  }

  // Check if script already exists (e.g., due to HMR or SPA navigation)
  if (!document.querySelector('script[src="https://s3.tradingview.com/tv.js"]')) {
    scriptElement = document.createElement('script');
    scriptElement.src = 'https://s3.tradingview.com/tv.js';
    scriptElement.async = true;
    scriptElement.onload = () => {
      console.log("TradingView script loaded by component.");
      initWidget();
    };
    scriptElement.onerror = (e) => {
        console.error("Failed to load TradingView script:", e);
    };
    document.body.appendChild(scriptElement);
  } else {
    // If script exists, TradingView might already be on window, try initializing
    console.log("TradingView script potentially loaded already.");
    initWidget();
  }
});

// Clean up the widget and script when the component is unmounted
onUnmounted(() => {
  console.log("TradingViewWidget unmounting...");
  if (widgetInstance && typeof widgetInstance.remove === 'function') {
    try {
        // TradingView widget API might have a specific cleanup method
        // widgetInstance.remove(); // Example if such a method exists
        console.log("Attempted TradingView widget cleanup (if API supports it).");
    } catch (e) {
        console.error("Error during widget cleanup:", e);
    }
  }
  // Optionally remove the container contents manually if widget cleanup is unreliable
  if (widgetContainer.value) {
      widgetContainer.value.innerHTML = ''; // Clear container
  }

  // Optionally remove the script tag - be careful if other components might use it
  // if (scriptElement && scriptElement.parentNode) {
  //   scriptElement.parentNode.removeChild(scriptElement);
  //   console.log("Removed TradingView script tag.");
  // }
});
</script>

<style scoped>
.tradingview-widget-container {
  width: 100%;
  height: 100%;
}
</style>
