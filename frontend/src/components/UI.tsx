import React from 'react';
import { motion } from 'framer-motion';

// Professional Status Badge with Glow
export const StatusBadge = ({ status }: { status: 'secure' | 'warning' | 'critical' | 'info' | string }) => {
  const styles: Record<string, string> = {
    secure: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.2)]',
    warning: 'bg-amber-500/10 text-amber-500 border-amber-500/20 shadow-[0_0_10px_rgba(245,158,11,0.2)]',
    critical: 'bg-rose-500/10 text-rose-500 border-rose-500/20 shadow-[0_0_10px_rgba(244,63,94,0.2)]',
    info: 'bg-blue-500/10 text-blue-500 border-blue-500/20 shadow-[0_0_10px_rgba(59,130,246,0.2)]',
  };

  // Default to 'info' if status key doesn't match
  const activeStyle = styles[status?.toLowerCase()] || styles.info;
  
  return (
    <div className={`px-3 py-1 rounded-md text-[10px] font-black border uppercase tracking-widest ${activeStyle}`}>
      {status}
    </div>
  );
};

// Animated Loading Dots for Buttons
export const ButtonLoader = () => (
  <div className="flex space-x-1 justify-center items-center h-full">
    {[0, 1, 2].map((i) => (
      <motion.div
        key={i}
        animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
        transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.1 }}
        className="w-1.5 h-1.5 bg-current rounded-full"
      />
    ))}
  </div>
);