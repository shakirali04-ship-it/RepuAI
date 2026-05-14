// components/ReportModal.tsx
import { useState } from 'react';

interface ReportData {
  headline: string; score: number; scoreChange: number;
  topWins: string[]; topIssues: string[];
  advisorStar: string; advisorConcern: string;
  locationStar: string; locationConcern: string;
  recommendations: string[]; urgentEscalations: string[];
}

export default function ReportModal({ onClose, contextData }: { onClose: () => void; contextData: object }) {
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<ReportData | null>(null);

  const generate = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/report', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ context: contextData }) });
      const data = await res.json();
      setReport(data);
    } catch { setReport(null); }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-navy-800 border border-white/10 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-navy-800 px-6 py-4 border-b border-white/8 flex items-center justify-between z-10">
          <div>
            <div className="font-display font-bold text-lg text-white">Monthly Executive Report</div>
            <div className="text-xs text-gray-500 font-mono mt-0.5">Current month vs last 3 months · MD/CEO/GM view</div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-xl bg-white/5 border border-white/8 text-gray-400 text-sm hover:text-red-400 transition-colors">✕</button>
        </div>

        <div className="p-6">
          {!report && !loading && (
            <div className="text-center py-12">
              <div className="text-5xl mb-4">📊</div>
              <div className="font-display font-bold text-xl text-white mb-2">Generate AI Monthly Report</div>
              <p className="text-sm text-gray-400 mb-6 leading-relaxed max-w-sm mx-auto">
                Compares current month vs last 3 months. Advisor highlights, location rankings, escalations & MD recommendations.
              </p>
              <button onClick={generate}
                className="px-8 py-3.5 rounded-2xl font-display font-bold text-white text-sm inline-flex items-center gap-2"
                style={{ background: 'linear-gradient(135deg, #1E6FE8, #4F46E5)' }}>
                ✦ Generate with AI
              </button>
            </div>
          )}

          {loading && (
            <div className="text-center py-16">
              <div className="w-12 h-12 border-3 border-white/10 border-t-blue-500 rounded-full spin mx-auto mb-4" style={{ borderWidth: 3 }} />
              <div className="text-gray-400 text-sm">AI analyzing 6 months of review data...</div>
            </div>
          )}

          {report && (
            <div className="space-y-4">
              {/* Headline */}
              <div className="rounded-2xl p-4 border border-blue-500/20" style={{ background: 'rgba(30,111,232,0.06)' }}>
                <div className="text-[10px] text-blue-400 font-mono uppercase tracking-wider mb-2">Executive Summary</div>
                <p className="text-sm text-gray-200 leading-relaxed">{report.headline}</p>
              </div>

              {/* Score + advisors */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-navy-900 rounded-2xl p-4 text-center border border-white/5">
                  <div className="font-display font-black text-4xl mb-1" style={{ color: report.score >= 70 ? '#10B981' : report.score >= 50 ? '#F5A623' : '#EF4444' }}>{report.score}</div>
                  <div className="text-[10px] text-gray-500">Reputation Score</div>
                  <div className={`text-[10px] font-mono mt-1 ${report.scoreChange >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>{report.scoreChange >= 0 ? '+' : ''}{report.scoreChange} vs avg</div>
                </div>
                <div className="bg-navy-900 rounded-2xl p-4 border border-white/5">
                  <div className="text-[10px] text-emerald-400 font-mono uppercase mb-2">⭐ Star Advisor</div>
                  <div className="text-xs text-gray-300 leading-relaxed">{report.advisorStar}</div>
                </div>
                <div className="bg-navy-900 rounded-2xl p-4 border border-white/5">
                  <div className="text-[10px] text-red-400 font-mono uppercase mb-2">⚠ Needs Coaching</div>
                  <div className="text-xs text-gray-300 leading-relaxed">{report.advisorConcern}</div>
                </div>
              </div>

              {/* Wins + Issues */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-[10px] text-emerald-400 font-mono uppercase tracking-wider mb-3">✓ Top Wins</div>
                  {report.topWins?.map((w, i) => <div key={i} className="flex gap-2 mb-2 text-xs text-gray-300"><span className="text-emerald-500 flex-shrink-0">●</span>{w}</div>)}
                </div>
                <div>
                  <div className="text-[10px] text-red-400 font-mono uppercase tracking-wider mb-3">✗ Top Issues</div>
                  {report.topIssues?.map((issue, i) => <div key={i} className="flex gap-2 mb-2 text-xs text-gray-300"><span className="text-red-500 flex-shrink-0">●</span>{issue}</div>)}
                </div>
              </div>

              {/* Locations */}
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl p-4 border border-emerald-500/15" style={{ background: 'rgba(16,185,129,0.05)' }}>
                  <div className="text-[10px] text-emerald-400 font-mono mb-1">🏆 TOP LOCATION</div>
                  <div className="text-xs text-gray-300">{report.locationStar}</div>
                </div>
                <div className="rounded-2xl p-4 border border-red-500/15" style={{ background: 'rgba(239,68,68,0.05)' }}>
                  <div className="text-[10px] text-red-400 font-mono mb-1">⚠ NEEDS ATTENTION</div>
                  <div className="text-xs text-gray-300">{report.locationConcern}</div>
                </div>
              </div>

              {/* Escalations */}
              {report.urgentEscalations?.length > 0 && (
                <div className="rounded-2xl p-4 border border-red-500/20" style={{ background: 'rgba(239,68,68,0.05)' }}>
                  <div className="text-[10px] text-red-400 font-mono uppercase mb-3">🚨 Urgent Escalations</div>
                  {report.urgentEscalations.map((e, i) => <div key={i} className="text-xs text-red-300 mb-1.5 flex gap-2"><span>→</span>{e}</div>)}
                </div>
              )}

              {/* Recommendations */}
              <div className="rounded-2xl p-4 border border-blue-500/15" style={{ background: 'rgba(30,111,232,0.05)' }}>
                <div className="text-[10px] text-blue-400 font-mono uppercase mb-3">✦ MD Action Items</div>
                {report.recommendations?.map((r, i) => <div key={i} className="text-xs text-blue-200 mb-2 flex gap-2"><span className="text-blue-500 flex-shrink-0">{i+1}.</span>{r}</div>)}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
