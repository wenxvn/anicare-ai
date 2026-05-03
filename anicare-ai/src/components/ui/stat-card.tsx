'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: ReactNode;
  helper?: string;
}

export function StatCard({ label, value, icon, helper }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="card-glow rounded-3xl border border-teal-500/20 bg-white p-5 backdrop-blur"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-[#5c524a]">{label}</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-[#1a1615]">{value}</p>
        </div>
        <div className="rounded-2xl bg-teal-500/10 p-2 text-teal-600">{icon}</div>
      </div>
      {helper && <p className="mt-3 text-xs text-[#5c524a]/50">{helper}</p>}
    </motion.div>
  );
}
