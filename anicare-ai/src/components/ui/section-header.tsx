'use client';

import { motion } from 'framer-motion';

export function SectionHeader({ title, description }: { title: string; description?: string }) {
  return (
    <motion.header initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="mb-8 max-w-3xl">
      <h1 className="text-3xl font-bold tracking-tight text-warm-50 sm:text-4xl">{title}</h1>
      {description && <p className="mt-3 text-base text-warm-100/70 leading-relaxed">{description}</p>}
    </motion.header>
  );
}
