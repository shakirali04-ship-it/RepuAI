// components/CategoryBreakdown.tsx
import { MonthData, POSITIVE_CATEGORIES, NEGATIVE_CATEGORIES } from '@/lib/data';

export default function CategoryBreakdown({ data, buId }: { data: MonthData; buId?: string }) {
  const posCats = (buId && buId !== 'all' ? POSITIVE_CATEGORIES.filter(c => c.bUs.includes(buId)) : POSITIVE_CATEGORIES)
    .map(c => ({ ...c, count: data.positiveBreakdown[c.id] || 0 }))
    .sort((a, b) => b.count - a.count).slice(0, 6);

  const negCats = (buId && buId !== 'all' ? NEGATIVE_CATEGORIES.filter(c => c.bUs.includes(buId)) : NEGATIVE_CATEGORIES)
    .map(c => ({ ...c, count: data.negativeBreakdown[c.id] || 0 }))
    .sort((a, b) => b.count - a.count).slice(0, 6);

  const maxPos = Math.max(...posCats.map(c => c.count), 1);
  const maxNeg = Math.max(...negCats.map(c => c.count), 1);

  return (
    <div className="bg-navy-800 rounded-3xl shadow-sm border border-white/5 overflow-hidden">
      <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between flex-wrap gap-2">
        <div className="font-display font-semibold text-sm text-white flex items-center gap-2">
          <span className="text-gray-500">◫</span> Review Category Analysis
        </div>
        <div className="flex gap-2">
          <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full px-2.5 py-1">+{data.positive} positive</span>
          <span className="text-[10px] bg-red-500/10 text-red-400 border border-red-500/20 rounded-full px-2.5 py-1">−{data.negative} negative</span>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-white/5">
        {/* Positive */}
        <div className="p-5">
          <div className="text-[10px] text-emerald-400 font-mono uppercase tracking-wider mb-4 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" /> Positive Mentions
          </div>
          {posCats.map(cat => (
            <div key={cat.id} className="mb-3.5">
              <div className="flex justify-between mb-1.5">
                <span className="text-xs text-gray-300">{cat.label}</span>
                <span className="text-xs font-bold font-mono text-emerald-400">{cat.count}</span>
              </div>
              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${(cat.count / maxPos) * 100}%`, background: 'linear-gradient(90deg, #059669, #10B981)' }} />
              </div>
            </div>
          ))}
        </div>
        {/* Negative */}
        <div className="p-5">
          <div className="text-[10px] text-red-400 font-mono uppercase tracking-wider mb-4 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-400 inline-block" /> Negative Mentions
          </div>
          {negCats.map(cat => (
            <div key={cat.id} className="mb-3.5">
              <div className="flex justify-between mb-1.5">
                <span className="text-xs text-gray-300">{cat.label}</span>
                <span className="text-xs font-bold font-mono text-red-400">{cat.count}</span>
              </div>
              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${(cat.count / maxNeg) * 100}%`, background: 'linear-gradient(90deg, #b91c1c, #ef4444)' }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
