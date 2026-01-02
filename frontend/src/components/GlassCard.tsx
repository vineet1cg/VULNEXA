import { motion } from 'framer-motion';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
}

export const GlassCard = ({ children, className = "" }: GlassCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    whileHover={{ y: -5, transition: { duration: 0.2 } }}
    className={`bg-cyber-dark/40 backdrop-blur-xl border border-cyber-slate/20 rounded-3xl p-6 shadow-glass relative overflow-hidden ${className}`}
  >
    {/* Optional: Subtle gradient overlay for extra sheen */}
    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
    <div className="relative z-10 h-full w-full">
      {children}
    </div>
  </motion.div>
);