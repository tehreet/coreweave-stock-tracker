import React, { useRef, memo, useState, useEffect } from 'react';
import Script from 'next/script'; 

declare global {
  interface Window {
    TradingView: any;
  }
}

function TradingViewWidget() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [isWidgetInitialized, setIsWidgetInitialized] = useState(false);

  const initializeWidget = () => {
    // Ensure TradingView is available and widget not already initialized
    if (typeof window.TradingView !== 'undefined' && containerRef.current && !isWidgetInitialized) {
        // Check if the container is empty before initializing
        // This is a secondary check in case onLoad fires multiple times or state updates are delayed
        if (!containerRef.current.querySelector('#tradingview_chart_container')?.hasChildNodes()) {
            console.log("Initializing TradingView Widget...");
            new window.TradingView.widget({
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
                container_id: "tradingview_chart_container"
            });
            setIsWidgetInitialized(true); // Mark as initialized
        }
    }
  };

  // Handle script loading
  const handleScriptLoad = () => {
    console.log("TradingView script loaded.");
    setIsScriptLoaded(true);
  };

  // Initialize widget once script is loaded
  useEffect(() => {
    if (isScriptLoaded) {
      initializeWidget();
    }
  }, [isScriptLoaded]); // Depend on script load state

  // Optional: Cleanup logic if needed, although next/script might handle some aspects.
  // Be cautious with direct DOM manipulation for cleanup if the component might remount.
  useEffect(() => {
    return () => {
      // Attempt to clean up if necessary when component unmounts
      // This might be complex due to the nature of third-party widgets.
      // console.log("TradingViewWidget unmounting, potential cleanup needed.");
      // Reset state if component might be reused/remounted in a way that requires re-initialization
      setIsWidgetInitialized(false);
    };
  }, []);

  return (
    <div className="tradingview-widget-container h-[600px] w-full relative" ref={containerRef}>
      {/* The container for the TradingView widget */}
      <div id="tradingview_chart_container" className='h-full w-full' />

      {/* Use next/script to load the TradingView library */}
      <Script
        src="https://s3.tradingview.com/tv.js"
        strategy="afterInteractive" // Load after the page becomes interactive
        onLoad={handleScriptLoad} // Callback when script is loaded
        onError={(e) => {
          console.error('TradingView script failed to load', e);
        }}
      />

      <div className="tradingview-widget-copyright absolute bottom-0 right-0 z-10 bg-gray-800 bg-opacity-50 p-1 rounded-tl-md">
        {/* Optional: Keep or remove TradingView branding - check their terms */}
        {/* <a href="https://www.tradingview.com/" rel="noopener nofollow" target="_blank"><span className="blue-text">Track all markets on TradingView</span></a> */}
      </div>
    </div>
  );
}

export default memo(TradingViewWidget);
