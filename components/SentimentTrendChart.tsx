// components/SentimentTrendChart.tsx
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { MonthData } from '@/lib/data';

const Tooltip_ = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-navy-800 border border-white/10 rounded-2xl p-3 text-xs shadow-xl">
      <div className="text-gray-400 font-mono mb-2">{label}</div>
      {payload.map((p: any) => (
        <div key={p.dataKey} className="flex justify-between gap-8 mb-1" style={{ color: p.color }}>
          <span>{p.name}</span>
          <span className="font-bold font-mono">{p.value}</span>
        </div>
      ))}
    </div>
  );
};

interface Props { months: MonthData[]; type?: 'area' | 'bar'; }

export default function SentimentTrendChart({ months, type = 'area' }: Props) {
  const data = months.map(m => ({
    month: m.month,
    Positive: m.positive,
    Negative: m.negative,
    Rating: m.avgRating,
    Total: m.totalReviews,
  }));

  return (
    <div className="bg-navy-800 rounded-3xl shadow-sm border border-white/5 overflow-hidden">
      <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
        <div>
          <div className="font-display font-semibold text-sm text-white flex items-center gap-2">
            <span className="text-gray-500">∿</span> 6-Month Sentiment Trend
          </div>
          <div className="text-xs text-gray-500 mt-0.5">Positive vs Negative reviews over time</div>
        </div>
        <div className="flex gap-3">
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <div className="w-2.5 h-2.5 rounded-sm bg-emerald-500" />Positive
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <div className="w-2.5 h-2.5 rounded-sm bg-red-500" />Negative
          </div>
        </div>
      </div>
      <div className="px-4 py-5">
        <ResponsiveContainer width="100%" height={200}>
          {type === 'bar' ? (
            <BarChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="month" tick={{ fill: '#6b7280', fontSize: 11, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#6b7280', fontSize: 11, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} />
              <Tooltip content={<Tooltip_ />} />
              <Bar dataKey="Positive" fill="#10B981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Negative" fill="#EF4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          ) : (
            <AreaChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="gPos" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id="gNeg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EF4444" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#EF4444" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="month" tick={{ fill: '#6b7280', fontSize: 11, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#6b7280', fontSize: 11, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} />
              <Tooltip content={<Tooltip_ />} />
              <Area type="monotone" dataKey="Positive" stroke="#10B981" strokeWidth={2} fill="url(#gPos)" dot={{ fill: '#10B981', r: 3, strokeWidth: 0 }} />
              <Area type="monotone" dataKey="Negative" stroke="#EF4444" strokeWidth={2} fill="url(#gNeg)" strokeDasharray="4 3" dot={{ fill: '#EF4444', r: 3, strokeWidth: 0 }} />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
