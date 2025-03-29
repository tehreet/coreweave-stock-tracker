"use client";

import { motion } from 'framer-motion';
import TradingViewWidget from '../components/TradingViewWidget';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-gray-900/50 backdrop-blur-sm rounded-lg shadow-xl p-4 border border-gray-700">
         <TradingViewWidget />
      </div>
    </main>
  );
}
