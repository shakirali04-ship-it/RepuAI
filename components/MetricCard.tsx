// components/MetricCard.tsx
interface Props {
  label: string;
  value: string | number;
  delta?: string;
  deltaUp?: boolean;
  color?: string;
  bgColor?: string;
  icon?: string;
  sub?: string;
}

export default function MetricCard({ label, value, delta, deltaUp, color = '#1E6FE8', bgColor, icon, sub }: Props) {
  return (
    <div className="bg-navy-800 rounded-3xl p-6 shadow-sm border border-white/5 card-hover relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-0.5 rounded-t-3xl" style={{ background: color }} />
      {icon && (
        <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-lg mb-4 border border-white/5"
          style={{ background: bgColor || `${color}18` }}>
          {icon}
        </div>
      )}
      <div className="text-[11px] text-gray-500 font-mono uppercase tracking-wider mb-2">{label}</div>
      <div className="font-display font-black text-3xl leading-none mb-1" style={{ color }}>{value}</div>
      {sub && <div className="text-xs text-gray-600 mt-1">{sub}</div>}
      {delta && (
        <div className={`flex items-center gap-1 mt-3 text-xs font-medium ${deltaUp ? 'text-emerald-400' : 'text-red-400'}`}>
          <span>{deltaUp ? '↑' : '↓'}</span> {delta}
        </div>
      )}
    </div>
  );
}
