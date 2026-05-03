const riskStyles: Record<string, string> = {
  '紧急': 'bg-red-500/15 text-red-300 border-red-500/20',
  '高风险': 'bg-orange-500/15 text-orange-300 border-orange-500/20',
  '中风险': 'bg-amber-500/15 text-amber-300 border-amber-500/20',
  '低风险': 'bg-emerald-500/15 text-emerald-300 border-emerald-500/20',
};

export function RiskBadge({ risk }: { risk: string }) {
  return (
    <span className={"inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium " + (riskStyles[risk] ?? 'border-white/10 text-warm-100/70')}>
      {risk}
    </span>
  );
}
