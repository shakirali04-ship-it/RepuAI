// components/Sidebar.tsx
import { useRouter } from 'next/router';
import { LOCATIONS, BUSINESS_UNITS } from '@/lib/data';

const NAV = [
  { id: 'overview', label: 'Overview', icon: '◈' },
  { id: 'analytics', label: 'Sentiment Analytics', icon: '∿' },
  { id: 'branches', label: 'Branch Performance', icon: '⊡' },
  { id: 'advisors', label: 'Advisor Leaderboard', icon: '◉' },
  { id: 'ai', label: 'AI Insights', icon: '✦' },
  { id: 'escalations', label: 'Escalation Center', icon: '⚠', badge: 12 },
  { id: 'reports', label: 'Reports', icon: '⊟' },
  { id: 'settings', label: 'Settings', icon: '⊕' },
];

interface Props {
  activeView: string;
  onViewChange: (v: string) => void;
  activeLocation: string;
  onLocationChange: (v: string) => void;
  activeBU: string;
  onBUChange: (v: string) => void;
}

export default function Sidebar({ activeView, onViewChange, activeLocation, onLocationChange, activeBU, onBUChange }: Props) {
  const router = useRouter();

  return (
    <aside className="w-56 flex-shrink-0 flex flex-col h-screen overflow-y-auto bg-navy-900 border-r border-white/5">
      <div className="p-5 border-b border-white/5">
        <div className="flex items-center gap-2.5 mb-3">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center text-sm flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #1E6FE8, #4F46E5)' }}>👁</div>
          <div>
            <div className="font-display font-bold text-sm text-white">REPU-AI</div>
            <div className="text-[9px] text-blue-400 font-mono tracking-widest">AI INTELLIGENCE</div>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-navy-800 rounded-xl px-3 py-2 border border-white/5">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 pulse-dot" />
          <span className="text-[10px] text-emerald-400 font-mono">Live · 2m ago</span>
        </div>
      </div>

      <div className="p-3 flex-1">
        <div className="text-[9px] text-gray-600 font-mono tracking-widest uppercase px-2 mb-2">Navigation</div>
        {NAV.map(item => (
          <button key={item.id} onClick={() => onViewChange(item.id)}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl mb-1 text-left transition-all text-[13px] ${
              activeView === item.id
                ? 'bg-blue-600/15 text-blue-400 border border-blue-500/20'
                : 'text-gray-500 border border-transparent'
            }`}
            style={{ hover: undefined }}>
            <span className="w-5 flex-shrink-0">{item.icon}</span>
            <span>{item.label}</span>
            {item.badge && <span className="ml-auto text-[10px] bg-red-500/15 text-red-400 border border-red-500/25 rounded-full px-2 py-px font-mono">{item.badge}</span>}
          </button>
        ))}

        <div className="mt-5">
          <div className="text-[9px] text-gray-600 font-mono tracking-widest uppercase px-2 mb-2">Location</div>
          <select value={activeLocation} onChange={e => onLocationChange(e.target.value)}
            className="w-full bg-navy-800 border border-white/8 rounded-xl px-3 py-2 text-xs text-gray-300 outline-none">
            <option value="all">All Locations</option>
            {LOCATIONS.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
          </select>
        </div>

        <div className="mt-4">
          <div className="text-[9px] text-gray-600 font-mono tracking-widest uppercase px-2 mb-2">Division</div>
          <div className="space-y-1">
            <button onClick={() => onBUChange('all')}
              className={`w-full text-left px-3 py-2 rounded-xl text-xs transition-all ${activeBU === 'all' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'text-gray-500 border border-transparent'}`}>
              All Divisions
            </button>
            {BUSINESS_UNITS.map(bu => (
              <button key={bu.id} onClick={() => onBUChange(bu.id)}
                className="w-full text-left px-3 py-2 rounded-xl text-xs transition-all flex items-center gap-2 border"
                style={activeBU === bu.id
                  ? { background: bu.bg, color: bu.color, borderColor: `${bu.color}35` }
                  : { color: '#6b7280', borderColor: 'transparent', background: 'transparent' }}>
                <span>{bu.icon}</span>{bu.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-white/5">
        <div className="flex items-center gap-2.5 mb-2">
          <div className="w-7 h-7 rounded-full bg-blue-600/20 flex items-center justify-center text-xs font-bold text-blue-400">MD</div>
          <div><div className="text-xs font-medium text-gray-300">Dealer Admin</div><div className="text-[10px] text-gray-600">All Access</div></div>
        </div>
        <button onClick={() => router.push('/login')} className="w-full text-[11px] text-gray-600 text-left mt-1">→ Sign out</button>
      </div>
    </aside>
  );
}
