// components/Topbar.tsx
import { LOCATIONS, BUSINESS_UNITS } from '@/lib/data';

interface Props {
  activeView: string;
  activeLocation: string;
  activeBU: string;
  onGenerateReport: () => void;
}

const VIEW_TITLES: Record<string, string> = {
  overview: 'Overview',
  analytics: 'Sentiment Analytics',
  branches: 'Branch Performance',
  advisors: 'Advisor Leaderboard',
  ai: 'AI Insights',
  escalations: 'Escalation Center',
  reports: 'Reports',
  settings: 'Settings',
};

export default function Topbar({ activeView, activeLocation, activeBU, onGenerateReport }: Props) {
  const locName = activeLocation === 'all' ? 'All Locations' : LOCATIONS.find(l => l.id === activeLocation)?.name;
  const buItem = BUSINESS_UNITS.find(b => b.id === activeBU);
  const now = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <header className="h-14 flex-shrink-0 flex items-center justify-between px-6 border-b border-white/5 bg-navy-900/80 backdrop-blur-md sticky top-0 z-20">
      <div className="flex items-center gap-3">
        <div>
          <div className="font-display font-bold text-sm text-white">{VIEW_TITLES[activeView] || 'Dashboard'}</div>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="text-[10px] text-gray-500 font-mono">{locName}</span>
            {activeBU !== 'all' && buItem && (
              <>
                <span className="text-gray-700">·</span>
                <span className="text-[10px] font-mono" style={{ color: buItem.color }}>{buItem.icon} {buItem.name}</span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden md:flex items-center gap-2 bg-navy-800 border border-white/6 rounded-xl px-3 py-1.5">
          <span className="text-[10px] text-gray-500 font-mono">📅 {now}</span>
        </div>

        <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-3 py-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 pulse-dot" />
          <span className="text-[10px] text-emerald-400 font-mono">Synced</span>
        </div>

        <button onClick={onGenerateReport}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white transition-opacity hover:opacity-90"
          style={{ background: 'linear-gradient(135deg, #1E6FE8, #4F46E5)' }}>
          <span>✦</span>
          <span className="hidden sm:inline">Generate Report</span>
        </button>

        <div className="w-8 h-8 rounded-xl bg-navy-700 border border-white/8 flex items-center justify-center text-xs font-bold text-blue-400">
          MD
        </div>
      </div>
    </header>
  );
}
