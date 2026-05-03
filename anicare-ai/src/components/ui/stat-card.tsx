'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface StatCardProps {
  label: string;
  value: ReactNode;
  helper?: string;
  icon?: ReactNode;
}

export function StatCard({ label, value, helper, icon }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="card-glow rounded-3xl border border-orange-500/20 bg-surface-800/80 p-5 backdrop-blur"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-warm-100/60">{label}</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-warm-50">{value}</p>
        </div>
        <div className="rounded-2xl bg-warm-500/10 p-2 text-orange-300">{icon}</div>
      </div>
      {helper && <p className="mt-3 text-xs text-warm-100/50">{helper}</p>}
    </motion.div>
  );
}
