// components/AIInsights.tsx
import { useState } from 'react';

interface Props { contextData: object; }

const STARTER_INSIGHTS = [
  {
    type: 'win',
    icon: '📈',
    title: 'Positive momentum detected',
    body: 'Jubilee Hills branch improved by 12% in positive sentiment this month. Delivery delays reduced significantly. Arjun Joshi credited in 18 reviews.',
    tag: 'Branch Intel',
  },
  {
    type: 'alert',
    icon: '⚠️',
    title: 'Service wait time spike',
    body: 'Kukatpally Service average wait jumped to 3.2h (+110% vs baseline). 7 reviews flagged this week. Root cause: technician understaffing on weekends.',
    tag: 'Escalation',
  },
  {
    type: 'rec',
    icon: '✦',
    title: 'AI Recommendation',
    body: 'Implement mandatory 30-min service progress updates via WhatsApp. Similar dealerships reduced wait-related complaints by 42% within 60 days.',
    tag: 'Action Required',
  },
  {
    type: 'advisor',
    icon: '👤',
    title: 'Advisor coaching opportunity',
    body: 'Suresh Kumar (Service, Banjara Hills) has 4 complaints in 30 days — all citing dismissive behavior + billing disputes. Recommend 1-on-1 coaching session.',
    tag: 'Advisor Alert',
  },
];

const TAG_STYLES: Record<string, string> = {
  'Branch Intel': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  'Escalation': 'bg-red-500/10 text-red-400 border-red-500/20',
  'Action Required': 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  'Advisor Alert': 'bg-purple-500/10 text-purple-400 border-purple-500/20',
};

const BORDER_STYLES: Record<string, string> = {
  win: 'border-l-emerald-500/60',
  alert: 'border-l-red-500/60',
  rec: 'border-l-blue-500/60',
  advisor: 'border-l-purple-500/60',
};

export default function AIInsights({ contextData }: Props) {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);

  const ask = async (q?: string) => {
    const query = q || question;
    if (!query.trim()) return;
    setLoading(true); setAnswer('');
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: query, context: contextData }),
      });
      const data = await res.json();
      setAnswer(data.text || 'No response.');
    } catch { setAnswer('Error connecting to AI. Check ANTHROPIC_API_KEY.'); }
    setLoading(false);
  };

  const QUICK = ['Which location needs urgent attention?', 'Top complaint this month?', 'Best advisor to recognize?', 'Sales vs Service sentiment?'];

  return (
    <div className="space-y-6">
      {/* AI Insight Cards */}
      <div>
        <div className="font-display font-bold text-base text-white mb-4 flex items-center gap-2">
          <span style={{ background: 'linear-gradient(135deg, #1E6FE8, #00C2E0)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>✦</span>
          AI-Generated Insights
          <span className="text-[10px] bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full px-2 py-0.5 font-mono">Auto-generated</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {STARTER_INSIGHTS.map((ins, i) => (
            <div key={i} className={`bg-navy-800 rounded-2xl p-5 border border-white/5 border-l-4 ${BORDER_STYLES[ins.type]} card-hover`}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{ins.icon}</span>
                  <div className="font-semibold text-sm text-white">{ins.title}</div>
                </div>
                <span className={`text-[10px] border rounded-full px-2 py-0.5 font-mono flex-shrink-0 ${TAG_STYLES[ins.tag]}`}>{ins.tag}</span>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">{ins.body}</p>
            </div>
          ))}
        </div>
      </div>

      {/* AI Query */}
      <div className="bg-navy-800 rounded-3xl border border-white/5 overflow-hidden"
        style={{ boxShadow: '0 0 40px rgba(30,111,232,0.08)' }}>
        <div className="px-6 py-4 border-b border-white/5" style={{ background: 'linear-gradient(135deg, rgba(30,111,232,0.06), rgba(79,70,229,0.04))' }}>
          <div className="font-display font-semibold text-sm text-white flex items-center gap-2">
            <span className="text-blue-400">✦</span> Ask REPU-AI
          </div>
          <div className="text-xs text-gray-500 mt-0.5">Get instant operational intelligence from your review data</div>
        </div>
        <div className="p-5">
          <div className="flex flex-wrap gap-2 mb-4">
            {QUICK.map(q => (
              <button key={q} onClick={() => { setQuestion(q); ask(q); }}
                className="text-xs px-3 py-1.5 rounded-xl bg-white/4 border border-white/6 text-gray-400 hover:bg-blue-600/10 hover:text-blue-400 hover:border-blue-500/20 transition-all">
                {q}
              </button>
            ))}
          </div>
          <div className="flex gap-3">
            <input value={question} onChange={e => setQuestion(e.target.value)} onKeyDown={e => e.key === 'Enter' && ask()}
              placeholder="Ask anything about your dealership reviews, advisors, or escalations..."
              className="flex-1 bg-navy-900 border border-white/8 rounded-2xl px-4 py-3 text-sm text-white placeholder-gray-600 outline-none focus:border-blue-500/40 transition-all" />
            <button onClick={() => ask()} disabled={loading}
              className="px-5 py-3 rounded-2xl text-sm font-bold text-white flex items-center gap-2 disabled:opacity-40 transition-opacity"
              style={{ background: 'linear-gradient(135deg, #1E6FE8, #4F46E5)' }}>
              {loading ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full spin" /> : '✦'}
              {loading ? 'Thinking...' : 'Ask AI'}
            </button>
          </div>
          {(answer || loading) && (
            <div className="mt-4 bg-navy-900/80 border border-blue-500/15 rounded-2xl p-4">
              <div className="text-[10px] text-blue-400 font-mono uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 pulse-dot" /> REPU-AI
              </div>
              {loading
                ? <div className="text-sm text-gray-500">Analyzing review data<span className="typing-cursor" /></div>
                : <div className="text-sm text-gray-300 leading-relaxed">{answer}</div>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
