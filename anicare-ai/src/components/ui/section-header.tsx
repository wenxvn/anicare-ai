'use client';

import { motion } from 'framer-motion';

interface SectionHeaderProps {
  title: string;
  description?: string;
}

export function SectionHeader({ title, description }: SectionHeaderProps) {
  return (
    <motion.header initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="mb-7 max-w-4xl">
      <div className="mb-3 h-1 w-10 rounded-full bg-gradient-to-r from-teal-500 to-sky-500" />
      <h1 className="text-3xl font-bold tracking-tight text-[#172033] sm:text-4xl">{title}</h1>
      {description && <p className="mt-3 max-w-3xl text-base leading-relaxed text-[#5d6b82]">{description}</p>}
    </motion.header>
  );
}
