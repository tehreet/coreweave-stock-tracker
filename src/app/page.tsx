"use client";

import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';

const TradingViewWidget = dynamic(() => import('../components/TradingViewWidget'), {
  ssr: false,
});

export default function Home() {
  return (
    <main className="min-h-screen p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto"
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-accent">
          CoreWeave Stock Tracker
        </h1>
        <p className="text-lg mb-8 text-gray-300">
          Real-time stock price data for CoreWeave ($CRWV)
        </p>
        <div className="bg-black/50 backdrop-blur-sm rounded-xl p-4 shadow-xl border border-accent/20">
          <TradingViewWidget />
        </div>
      </motion.div>
    </main>
  );
}
