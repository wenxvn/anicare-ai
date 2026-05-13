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
      className="card-glow rounded-3xl border border-[#172033]/8 bg-white/92 p-5 backdrop-blur transition-all hover:-translate-y-0.5 hover:border-teal-500/25"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-[#5d6b82]">{label}</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-[#172033]">{value}</p>
        </div>
        <div className="rounded-2xl border border-teal-500/15 bg-teal-500/10 p-2 text-teal-700">{icon}</div>
      </div>
      {helper && <p className="mt-3 text-xs leading-relaxed text-[#5d6b82]/65">{helper}</p>}
    </motion.div>
  );
}
