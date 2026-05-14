// pages/index.tsx
import { useState, useMemo } from 'react';
import Head from 'next/head';
import Sidebar from '@/components/Sidebar';
import Topbar from '@/components/Topbar';
import MetricCard from '@/components/MetricCard';
import SentimentTrendChart from '@/components/SentimentTrendChart';
import AdvisorLeaderboard from '@/components/AdvisorLeaderboard';
import CategoryBreakdown from '@/components/CategoryBreakdown';
import LocationGrid from '@/components/LocationGrid';
import AIInsights from '@/components/AIInsights';
import ReportModal from '@/components/ReportModal';
import { ALL_DATA, LOCATIONS, BUSINESS_UNITS, aggregateMonths, getAllAdvisors, getFilteredData, getOverallStats, MONTHS, POSITIVE_CATEGORIES, NEGATIVE_CATEGORIES } from '@/lib/data';

export default function Dashboard() {
  const [activeView, setActiveView] = useState('overview');
  const [activeLocation, setActiveLocation] = useState('all');
  const [activeBU, setActiveBU] = useState('all');
  const [showReport, setShowReport] = useState(false);

  const filteredData = useMemo(() => getFilteredData(activeLocation, activeBU), [activeLocation, activeBU]);
  const months = useMemo(() => aggregateMonths(filteredData), [filteredData]);
  const current = months[months.length - 1];
  const prev = months[months.length - 2];
  const advisors = useMemo(() => getAllAdvisors(activeLocation, activeBU), [activeLocation, activeBU]);
  const { totalReviews: grandTotal } = getOverallStats();

  const positivePct = current.totalReviews > 0 ? Math.round((current.positive / current.totalReviews) * 100) : 0;
  const prevPosPct = prev.totalReviews > 0 ? Math.round((prev.positive / prev.totalReviews) * 100) : 0;
  const escalated = advisors.filter(a => a.escalated).length;

  const contextData = {
    location: activeLocation === 'all' ? 'All Locations' : LOCATIONS.find(l => l.id === activeLocation)?.name,
    bu: activeBU === 'all' ? 'All Divisions' : BUSINESS_UNITS.find(b => b.id === activeBU)?.name,
    current, allMonths: months,
    advisors: advisors.slice(0, 20), positivePct, escalated,
  };

  return (
    <>
      <Head><title>REPU-AI — Dealer Intelligence</title></Head>
      <div className="flex h-screen bg-navy-950 overflow-hidden">
        <Sidebar activeView={activeView} onViewChange={setActiveView} activeLocation={activeLocation} onLocationChange={setActiveLocation} activeBU={activeBU} onBUChange={setActiveBU} />

        <div className="flex-1 flex flex-col overflow-hidden">
          <Topbar activeView={activeView} activeLocation={activeLocation} activeBU={activeBU} onGenerateReport={() => setShowReport(true)} />

          <main className="flex-1 overflow-y-auto p-6 space-y-6">

            {/* ─── OVERVIEW ─── */}
            {activeView === 'overview' && (
              <>
                {/* Hero gradient banner */}
                <div className="rounded-3xl p-6 relative overflow-hidden border border-white/5"
                  style={{ background: 'linear-gradient(135deg, #0D1829 0%, #132038 60%, #1a2550 100%)' }}>
                  <div className="absolute inset-0 opacity-10"
                    style={{ backgroundImage: 'radial-gradient(circle at 80% 50%, #1E6FE8 0%, transparent 60%)' }} />
                  <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <div className="text-xs text-blue-400 font-mono uppercase tracking-widest mb-2">REPU-AI · May 2025</div>
                      <div className="font-display font-black text-2xl text-white leading-tight">
                        {activeLocation === 'all' ? 'All Branches Overview' : LOCATIONS.find(l => l.id === activeLocation)?.name}
                      </div>
                      <div className="text-sm text-gray-400 mt-1">
                        {current.totalReviews} reviews this month · {positivePct}% positive sentiment
                      </div>
                    </div>
                    <div className="flex gap-3 flex-wrap">
                      <div className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-center">
                        <div className="font-display font-black text-2xl text-emerald-400">{positivePct}%</div>
                        <div className="text-[10px] text-gray-500">Positive</div>
                      </div>
                      <div className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-center">
                        <div className="font-display font-black text-2xl text-amber-400">{current.avgRating}★</div>
                        <div className="text-[10px] text-gray-500">Avg Rating</div>
                      </div>
                      <div className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-center">
                        <div className="font-display font-black text-2xl text-red-400">{escalated}</div>
                        <div className="text-[10px] text-gray-500">Escalated</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* KPI Row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <MetricCard label="Total Reviews" value={current.totalReviews.toLocaleString()} icon="⭐" color="#1E6FE8" bgColor="rgba(30,111,232,0.12)"
                    delta={`${current.totalReviews > prev.totalReviews ? '+' : ''}${current.totalReviews - prev.totalReviews} vs last month`}
                    deltaUp={current.totalReviews >= prev.totalReviews} sub="This month" />
                  <MetricCard label="Positive Sentiment" value={`${positivePct}%`} icon="📈" color="#10B981" bgColor="rgba(16,185,129,0.12)"
                    delta={`${positivePct >= prevPosPct ? '+' : ''}${positivePct - prevPosPct}% MoM`}
                    deltaUp={positivePct >= prevPosPct} sub={`${current.positive} positive reviews`} />
                  <MetricCard label="Avg Rating" value={`${current.avgRating} ★`} icon="🌟" color="#F5A623" bgColor="rgba(245,166,35,0.12)"
                    delta={`${current.avgRating >= prev.avgRating ? '+' : ''}${(current.avgRating - prev.avgRating).toFixed(1)} MoM`}
                    deltaUp={current.avgRating >= prev.avgRating} sub="Google rating" />
                  <MetricCard label="Escalated Advisors" value={escalated} icon="🚨" color="#EF4444" bgColor="rgba(239,68,68,0.12)"
                    delta={`${current.negative} complaint reviews`} deltaUp={false} sub="Need coaching" />
                </div>

                {/* BU Cards */}
                {activeBU === 'all' && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {BUSINESS_UNITS.map(bu => {
                      const buData = getFilteredData(activeLocation, bu.id);
                      const buMonths = aggregateMonths(buData);
                      const buCurr = buMonths[buMonths.length - 1];
                      const buPrev = buMonths[buMonths.length - 2];
                      const buPct = buCurr.totalReviews > 0 ? Math.round((buCurr.positive / buCurr.totalReviews) * 100) : 0;
                      const buPrevPct = buPrev.totalReviews > 0 ? Math.round((buPrev.positive / buPrev.totalReviews) * 100) : 0;
                      return (
                        <button key={bu.id} onClick={() => setActiveBU(bu.id)}
                          className="bg-navy-800 rounded-3xl p-5 border border-white/5 card-hover text-left relative overflow-hidden">
                          <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: bu.color }} />
                          <div className="text-2xl mb-3">{bu.icon}</div>
                          <div className="font-display font-bold text-sm text-white mb-0.5">{bu.name}</div>
                          <div className="font-display font-black text-2xl" style={{ color: bu.color }}>{buPct}%</div>
                          <div className="text-[10px] text-gray-600 mt-1">{buCurr.totalReviews} reviews · {buCurr.avgRating}★</div>
                          <div className={`text-[10px] font-mono mt-1 ${buPct >= buPrevPct ? 'text-emerald-400' : 'text-red-400'}`}>
                            {buPct >= buPrevPct ? '+' : ''}{buPct - buPrevPct}% MoM
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Charts row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <SentimentTrendChart months={months} />
                  <CategoryBreakdown data={current} buId={activeBU} />
                </div>

                {/* Advisors + Escalations */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <AdvisorLeaderboard advisors={advisors} title="Top Advisors this Month" />
                  </div>
                  <div className="space-y-4">
                    {/* Escalation mini */}
                    <div className="bg-navy-800 rounded-3xl border border-red-500/15 overflow-hidden">
                      <div className="px-5 py-3.5 border-b border-white/5 flex items-center justify-between">
                        <div className="font-display font-semibold text-sm text-white">🚨 Escalations</div>
                        <span className="text-[10px] bg-red-500/10 text-red-400 border border-red-500/20 rounded-full px-2 py-0.5 font-mono">{escalated}</span>
                      </div>
                      <div className="p-4 space-y-3">
                        {advisors.filter(a => a.escalated).slice(0, 4).map((a, i) => (
                          <div key={i} className="flex items-center gap-3 p-3 bg-red-500/5 border border-red-500/10 rounded-2xl">
                            <div className="w-8 h-8 rounded-xl bg-red-500/15 flex items-center justify-center text-[10px] font-bold text-red-400 flex-shrink-0">
                              {a.name.split(' ').map(w => w[0]).join('').slice(0,2)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-xs font-medium text-gray-200 truncate">{a.name}</div>
                              <div className="text-[10px] text-gray-500 truncate">{a.role} · {LOCATIONS.find(l => l.id === a.locationId)?.name}</div>
                            </div>
                            <div className="text-xs font-bold font-mono text-red-400">{a.positivePct}%</div>
                          </div>
                        ))}
                        {escalated > 4 && <div className="text-[10px] text-center text-gray-600 pt-1">+{escalated - 4} more · see Escalation Center</div>}
                      </div>
                    </div>

                    {/* Quick AI */}
                    <AIInsights contextData={contextData} />
                  </div>
                </div>
              </>
            )}

            {/* ─── SENTIMENT ANALYTICS ─── */}
            {activeView === 'analytics' && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {months.slice(-4).map((m, i) => (
                    <div key={m.month} className="bg-navy-800 rounded-3xl p-5 border border-white/5">
                      <div className="flex justify-between items-start mb-3">
                        <div className="text-xs text-gray-500 font-mono">{m.month} 2025</div>
                        {i === 3 && <span className="text-[9px] bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full px-1.5 py-0.5">Latest</span>}
                      </div>
                      <div className="font-display font-black text-2xl text-white mb-1">{m.totalReviews}</div>
                      <div className="text-[10px] text-gray-600 mb-3">Total reviews</div>
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-[10px]">
                          <span className="text-emerald-400">+{m.positive} pos</span>
                          <span className="text-emerald-400">{m.totalReviews > 0 ? Math.round((m.positive / m.totalReviews) * 100) : 0}%</span>
                        </div>
                        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${m.totalReviews > 0 ? Math.round((m.positive / m.totalReviews) * 100) : 0}%`, background: '#10B981' }} />
                        </div>
                        <div className="flex justify-between text-[10px]">
                          <span className="text-red-400">−{m.negative} neg</span>
                          <span className="text-red-400">{m.totalReviews > 0 ? Math.round((m.negative / m.totalReviews) * 100) : 0}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <SentimentTrendChart months={months} type="area" />
                  <SentimentTrendChart months={months} type="bar" />
                </div>
                <CategoryBreakdown data={current} buId={activeBU} />
              </div>
            )}

            {/* ─── BRANCH PERFORMANCE ─── */}
            {activeView === 'branches' && (
              <div className="space-y-6">
                <LocationGrid activeBU={activeBU} />
                <SentimentTrendChart months={months} />
              </div>
            )}

            {/* ─── ADVISOR LEADERBOARD ─── */}
            {activeView === 'advisors' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <div className="text-sm font-display font-bold text-white mb-3 flex items-center gap-2">🚗 Sales Advisors</div>
                    <AdvisorLeaderboard advisors={advisors.filter(a => ['arena','nexa'].includes(a.buId))} title="Sales Advisor Rankings" showAll />
                  </div>
                  <div>
                    <div className="text-sm font-display font-bold text-white mb-3 flex items-center gap-2">🔧 Service Advisors</div>
                    <AdvisorLeaderboard advisors={advisors.filter(a => ['service','truevalue'].includes(a.buId))} title="Service Advisor Rankings" showAll />
                  </div>
                </div>
              </div>
            )}

            {/* ─── AI INSIGHTS ─── */}
            {activeView === 'ai' && <AIInsights contextData={contextData} />}

            {/* ─── ESCALATION CENTER ─── */}
            {activeView === 'escalations' && (
              <div className="space-y-4">
                <div className="bg-red-500/5 border border-red-500/15 rounded-3xl p-5">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-xl">🚨</span>
                    <div className="font-display font-bold text-lg text-white">Escalation Center</div>
                    <span className="text-xs bg-red-500/15 text-red-400 border border-red-500/25 rounded-full px-3 py-1 font-mono">{escalated} active</span>
                  </div>
                  <p className="text-xs text-gray-400">Advisors automatically flagged by AI based on negative sentiment threshold (&lt;40% positive, &gt;5 mentions)</p>
                </div>

                {advisors.filter(a => a.escalated).sort((a, b) => a.positivePct - b.positivePct).map((a, i) => {
                  const bu = BUSINESS_UNITS.find(b => b.id === a.buId);
                  const loc = LOCATIONS.find(l => l.id === a.locationId);
                  return (
                    <div key={i} className="bg-navy-800 rounded-3xl p-5 border border-red-500/15 card-hover">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-sm font-bold flex-shrink-0"
                          style={{ background: 'rgba(239,68,68,0.15)', color: '#ef4444' }}>
                          {a.name.split(' ').map(w => w[0]).join('').slice(0,2)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <div className="font-display font-bold text-base text-white">{a.name}</div>
                            <span className="text-[10px] bg-red-500/10 text-red-400 border border-red-500/20 rounded-full px-2 py-0.5 font-mono">ESCALATED</span>
                          </div>
                          <div className="text-xs text-gray-500 mb-2">{bu?.icon} {bu?.name} · 📍 {loc?.name} · {a.mentions} review mentions</div>
                          <div className="flex flex-wrap gap-1.5 mb-3">
                            {a.tags.map(t => <span key={t} className="text-[10px] bg-red-500/8 text-red-300 border border-red-500/15 rounded-lg px-2 py-0.5">{t}</span>)}
                          </div>
                          <div className="grid grid-cols-3 gap-3">
                            <div className="bg-navy-900/60 rounded-2xl p-3 text-center border border-white/4">
                              <div className="font-display font-bold text-lg text-red-400">{a.positivePct}%</div>
                              <div className="text-[10px] text-gray-600">Positive</div>
                            </div>
                            <div className="bg-navy-900/60 rounded-2xl p-3 text-center border border-white/4">
                              <div className="font-display font-bold text-lg text-red-400">{a.negativePct}%</div>
                              <div className="text-[10px] text-gray-600">Negative</div>
                            </div>
                            <div className="bg-navy-900/60 rounded-2xl p-3 text-center border border-white/4">
                              <div className={`font-display font-bold text-lg ${a.trend >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>{a.trend >= 0 ? '+' : ''}{a.trend}%</div>
                              <div className="text-[10px] text-gray-600">MoM Trend</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* ─── REPORTS ─── */}
            {activeView === 'reports' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { title: 'Monthly Executive Report', desc: 'Current month vs last 3 months. Built for MD/CEO/GM.', icon: '📊', action: () => setShowReport(true), gradient: 'from-blue-600 to-indigo-600' },
                    { title: 'Advisor Performance Report', desc: 'Full advisor leaderboard with sentiment breakdown.', icon: '👤', action: () => setActiveView('advisors'), gradient: 'from-purple-600 to-pink-600' },
                    { title: 'Branch Comparison Report', desc: 'Side-by-side location performance analysis.', icon: '⊡', action: () => setActiveView('branches'), gradient: 'from-emerald-600 to-teal-600' },
                    { title: 'Escalation Report', desc: 'All flagged advisors with action recommendations.', icon: '🚨', action: () => setActiveView('escalations'), gradient: 'from-red-600 to-orange-600' },
                    { title: 'Sentiment Trend Report', desc: '6-month positive/negative trend analysis.', icon: '∿', action: () => setActiveView('analytics'), gradient: 'from-amber-600 to-yellow-600' },
                    { title: 'Category Analysis Report', desc: 'Positive & negative review category breakdown.', icon: '◫', action: () => {}, gradient: 'from-cyan-600 to-blue-600' },
                  ].map(r => (
                    <button key={r.title} onClick={r.action}
                      className="bg-navy-800 rounded-3xl p-6 border border-white/5 card-hover text-left relative overflow-hidden">
                      <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${r.gradient}`} />
                      <div className="text-3xl mb-4">{r.icon}</div>
                      <div className="font-display font-bold text-sm text-white mb-2">{r.title}</div>
                      <p className="text-xs text-gray-500 leading-relaxed mb-4">{r.desc}</p>
                      <div className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl text-white bg-gradient-to-r ${r.gradient}`}>
                        Generate → 
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ─── SETTINGS ─── */}
            {activeView === 'settings' && (
              <div className="max-w-2xl space-y-4">
                {[
                  { title: 'Dealership Profile', fields: [{ label: 'Dealer Name', placeholder: 'Saboo RKS Motor Pvt Ltd', type: 'text' }, { label: 'GST Number', placeholder: '36AAXFB2608J1Z4', type: 'text' }] },
                  { title: 'Google Business Profile', fields: [{ label: 'GMB Account ID', placeholder: 'Connect via Google OAuth', type: 'text' }, { label: 'Sync Frequency', placeholder: 'Every 2 hours', type: 'text' }] },
                  { title: 'Notifications', fields: [{ label: 'Alert Email', placeholder: 'md@dealership.com', type: 'email' }, { label: 'Escalation Threshold', placeholder: 'Below 40% positive', type: 'text' }] },
                ].map(section => (
                  <div key={section.title} className="bg-navy-800 rounded-3xl p-6 border border-white/5">
                    <div className="font-display font-bold text-sm text-white mb-4">{section.title}</div>
                    <div className="space-y-3">
                      {section.fields.map(f => (
                        <div key={f.label}>
                          <label className="text-[10px] text-gray-500 font-mono uppercase tracking-wider block mb-1.5">{f.label}</label>
                          <input type={f.type} placeholder={f.placeholder} className="w-full bg-navy-900 border border-white/8 rounded-xl px-4 py-2.5 text-sm text-gray-300 placeholder-gray-700 outline-none focus:border-blue-500/40 transition-all" />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                <button className="px-6 py-3 rounded-2xl text-sm font-bold text-white" style={{ background: 'linear-gradient(135deg, #1E6FE8, #4F46E5)' }}>
                  Save Settings
                </button>
              </div>
            )}

          </main>
        </div>
      </div>

      {showReport && <ReportModal onClose={() => setShowReport(false)} contextData={contextData} />}
    </>
  );
}
