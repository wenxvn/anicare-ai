'use client';

import clsx from 'clsx';

const riskStyles: Record<string, string> = {
  '紧急': 'bg-red-50 text-red-600 border-red-200',
  '高风险': 'bg-orange-50 text-orange-600 border-orange-200',
  '中风险': 'bg-amber-50 text-amber-600 border-amber-200',
  '低风险': 'bg-emerald-50 text-emerald-600 border-emerald-200',
};

interface RiskBadgeProps {
  risk: string;
}

export function RiskBadge({ risk }: RiskBadgeProps) {
  return (
    <span className={clsx('rounded-full border px-2.5 py-1 text-xs font-medium', riskStyles[risk] ?? 'border-[#1a1615]/10 text-[#5c524a]')}>
      {risk}
    </span>
  );
}
