import React, { useEffect, useRef, memo } from 'react';

declare global {
  interface Window {
    TradingView: any;
  }
}

function TradingViewWidget() {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Ensure the script isn't added multiple times and the container exists
    if (container.current && !container.current.querySelector('script[src="https://s3.tradingview.com/tv.js"]')) {
      const script = document.createElement("script");
      script.src = "https://s3.tradingview.com/tv.js";
      script.type = "text/javascript";
      script.async = true;
      script.onload = () => {
        // Check if TradingView is loaded
        if (typeof (window as any).TradingView !== 'undefined') {
          // Check if the widget container already has a widget instance
          if (!document.getElementById('tradingview_chart_container')?.hasChildNodes()) {
            new (window as any).TradingView.widget({
              autosize: true,
              symbol: "NASDAQ:CRWV", // Using NASDAQ:CRWV - adjust if listed elsewhere
              interval: "1", // Changed from "D" to "1" for 1 minute interval
              timezone: "Etc/UTC",
              theme: "dark", // Dark theme for the widget
              style: "1", // Bar style
              locale: "en",
              enable_publishing: false,
              hide_side_toolbar: false, // Show drawing tools etc.
              allow_symbol_change: true,
              container_id: "tradingview_chart_container" // Match the div id
            });
          }
        }
      };
      container.current.appendChild(script);
    }

    // Basic cleanup - might need refinement based on TradingView widget specifics
    return () => {
        const scriptElement = container.current?.querySelector('script[src="https://s3.tradingview.com/tv.js"]');
        if (scriptElement) {
            // Removing the script might not be enough, TradingView might have global state.
            // For simplicity, we'll leave the script but prevent re-initialization.
            // Consider more robust cleanup if issues arise with navigation/re-renders.
        }
         const widgetIframe = document.getElementById('tradingview_chart_container')?.querySelector('iframe');
         if(widgetIframe) {
            // Optional: attempt to remove iframe if component unmounts, though useEffect cleanup timing might be tricky
            // widgetIframe.remove();
         }
    }
  }, []); // Empty dependency array ensures this runs once on mount

  return (
    <div className="tradingview-widget-container h-[600px] w-full" ref={container}>
      {/* Ensure this div is always rendered for the script to target */}
      <div id="tradingview_chart_container" className='h-full w-full' />
      <div className="tradingview-widget-copyright">
        {/* Optional: Keep or remove TradingView branding */}
        {/* <a href="https://www.tradingview.com/" rel="noopener nofollow" target="_blank"><span className="blue-text">Track all markets on TradingView</span></a> */}
      </div>
    </div>
  );
}

export default memo(TradingViewWidget); // Memoize to prevent unnecessary re-renders
