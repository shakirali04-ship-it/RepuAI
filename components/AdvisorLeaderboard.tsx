// components/AdvisorLeaderboard.tsx
import { AdvisorData, BUSINESS_UNITS, LOCATIONS } from '@/lib/data';

interface Props {
  advisors: AdvisorData[];
  title?: string;
  showAll?: boolean;
}

const BU_MAP: Record<string, typeof BUSINESS_UNITS[0]> = Object.fromEntries(BUSINESS_UNITS.map(b => [b.id, b]));

function initials(name: string) { return name.split(' ').map(w => w[0]).join('').slice(0, 2); }

export default function AdvisorLeaderboard({ advisors, title = 'Advisor Leaderboard', showAll = false }: Props) {
  const sorted = [...advisors].sort((a, b) => b.positivePct - a.positivePct).slice(0, showAll ? 50 : 8);

  return (
    <div className="bg-navy-800 rounded-3xl shadow-sm border border-white/5 overflow-hidden">
      <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
        <div>
          <div className="font-display font-semibold text-sm text-white flex items-center gap-2">
            <span className="text-gray-500">◉</span> {title}
          </div>
          <div className="text-xs text-gray-500 mt-0.5">Ranked by % positive mentions from reviews</div>
        </div>
        <span className="text-[10px] bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-full px-2.5 py-1 font-mono">AI-extracted</span>
      </div>
      <div className="p-4">
        {/* Header */}
        <div className="grid grid-cols-12 gap-2 px-2 pb-2 text-[10px] text-gray-600 font-mono uppercase tracking-wider border-b border-white/4 mb-1">
          <div className="col-span-1">#</div>
          <div className="col-span-4">Advisor</div>
          <div className="col-span-2 text-center">Positive</div>
          <div className="col-span-2 text-center">Negative</div>
          <div className="col-span-2">Sentiment</div>
          <div className="col-span-1 text-right">MoM</div>
        </div>

        {sorted.map((a, i) => {
          const bu = BU_MAP[a.buId];
          const loc = LOCATIONS.find(l => l.id === a.locationId);
          const isTop = i === 0;
          const isConcern = a.positivePct < 40;
          return (
            <div key={`${a.name}-${a.locationId}-${i}`}
              className="grid grid-cols-12 gap-2 items-center px-2 py-2.5 rounded-2xl mb-1 border border-transparent hover:bg-white/3 hover:border-white/5 transition-all">
              <div className="col-span-1 text-xs font-mono text-gray-600">
                {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i+1}`}
              </div>
              <div className="col-span-4 flex items-center gap-2 min-w-0">
                <div className="w-7 h-7 rounded-xl flex-shrink-0 flex items-center justify-center text-[10px] font-bold"
                  style={{ background: bu?.bg, color: bu?.color }}>
                  {initials(a.name)}
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-medium text-gray-200 truncate flex items-center gap-1">
                    {a.name}
                    {isTop && <span className="flex-shrink-0 text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded px-1">TOP</span>}
                    {isConcern && <span className="flex-shrink-0 text-[9px] bg-red-500/10 text-red-400 border border-red-500/20 rounded px-1">FLAG</span>}
                    {a.escalated && <span className="flex-shrink-0 text-[9px] bg-red-500/15 text-red-300 border border-red-400/25 rounded px-1">ESC</span>}
                  </div>
                  <div className="text-[10px] text-gray-600 truncate">{bu?.icon} {bu?.name} · {loc?.name}</div>
                </div>
              </div>
              <div className="col-span-2 text-center">
                <span className="text-xs font-bold font-mono text-emerald-400">{a.positivePct}%</span>
                <div className="text-[9px] text-gray-600">{a.mentions} mentions</div>
              </div>
              <div className="col-span-2 text-center">
                <span className="text-xs font-bold font-mono text-red-400">{a.negativePct}%</span>
              </div>
              <div className="col-span-2">
                <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                  <div className="h-full rounded-full transition-all"
                    style={{ width: `${a.positivePct}%`, background: a.positivePct > 70 ? '#10B981' : a.positivePct > 45 ? '#F5A623' : '#EF4444' }} />
                </div>
              </div>
              <div className="col-span-1 text-right">
                <span className={`text-[10px] font-mono font-bold ${a.trend >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {a.trend >= 0 ? '+' : ''}{a.trend}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
