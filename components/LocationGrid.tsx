// components/LocationGrid.tsx
import { LOCATIONS, BUSINESS_UNITS, ALL_DATA, aggregateMonths } from '@/lib/data';

export default function LocationGrid({ activeBU }: { activeBU: string }) {
  return (
    <div>
      <div className="font-display font-bold text-base text-white mb-4 flex items-center gap-2">
        <span className="text-gray-500">⊡</span> Branch Performance
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {LOCATIONS.map(loc => {
          const locData = ALL_DATA.filter(d => d.locationId === loc.id && (activeBU === 'all' || d.buId === activeBU));
          const months = aggregateMonths(locData);
          const curr = months[months.length - 1];
          const prev = months[months.length - 2];
          const pct = curr.totalReviews > 0 ? Math.round((curr.positive / curr.totalReviews) * 100) : 0;
          const prevPct = prev.totalReviews > 0 ? Math.round((prev.positive / prev.totalReviews) * 100) : 0;
          const trend = pct - prevPct;
          const scoreColor = pct >= 70 ? '#10B981' : pct >= 50 ? '#F5A623' : '#EF4444';

          return (
            <div key={loc.id} className="bg-navy-800 rounded-3xl shadow-sm border border-white/5 overflow-hidden card-hover">
              <div className="h-1 w-full" style={{ background: scoreColor }} />
              <div className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="font-display font-bold text-base text-white">{loc.name}</div>
                    <div className="text-xs text-gray-500 font-mono mt-0.5">📍 {loc.city}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-display font-black text-3xl leading-none" style={{ color: scoreColor }}>{pct}%</div>
                    <div className={`text-[10px] font-mono mt-1 ${trend >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {trend >= 0 ? `+${trend}` : trend}% MoM
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-4">
                  {[
                    { label: 'Reviews', value: curr.totalReviews, color: '#1E6FE8' },
                    { label: 'Rating', value: `${curr.avgRating}★`, color: '#F5A623' },
                    { label: 'Issues', value: curr.negative, color: '#EF4444' },
                  ].map(stat => (
                    <div key={stat.label} className="bg-navy-900/60 rounded-2xl p-3 text-center border border-white/4">
                      <div className="font-display font-bold text-base" style={{ color: stat.color }}>{stat.value}</div>
                      <div className="text-[10px] text-gray-600 mt-0.5">{stat.label}</div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-1 h-2 rounded-full overflow-hidden mb-2">
                  <div className="rounded-l-full" style={{ flex: curr.positive, background: '#10B981' }} />
                  <div className="rounded-r-full" style={{ flex: curr.negative, background: '#EF4444' }} />
                </div>
                <div className="flex justify-between text-[10px] font-mono">
                  <span className="text-emerald-400">+{curr.positive} pos</span>
                  <span className="text-red-400">−{curr.negative} neg</span>
                </div>

                {activeBU === 'all' && (
                  <div className="flex gap-1.5 flex-wrap mt-3">
                    {BUSINESS_UNITS.map(bu => {
                      const buData = ALL_DATA.find(d => d.locationId === loc.id && d.buId === bu.id);
                      const r = buData?.months[buData.months.length - 1]?.totalReviews || 0;
                      return (
                        <span key={bu.id} className="text-[9px] px-2 py-0.5 rounded-full font-mono border"
                          style={{ background: bu.bg, color: bu.color, borderColor: `${bu.color}30` }}>
                          {bu.icon} {r}r
                        </span>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
