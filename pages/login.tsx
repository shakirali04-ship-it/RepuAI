// pages/login.tsx
import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function Login() {
  const router = useRouter();
  const [step, setStep] = useState<'login' | 'otp'>('login');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState<'md' | 'gm' | 'manager'>('gm');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setLoading(false);
    setStep('otp');
  };

  const handleOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setLoading(false);
    router.push('/');
  };

  const handleOtpInput = (val: string, i: number) => {
    const next = [...otp];
    next[i] = val.slice(-1);
    setOtp(next);
    if (val && i < 5) {
      const el = document.getElementById(`otp-${i + 1}`);
      el?.focus();
    }
  };

  return (
    <>
      <Head><title>REPU-AI — Login</title></Head>
      <div className="min-h-screen bg-navy-950 flex">
        {/* Left panel */}
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col justify-between p-12"
          style={{ background: 'linear-gradient(135deg, #0D1829 0%, #132038 40%, #1A2D4F 100%)' }}>
          {/* Grid bg */}
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: 'linear-gradient(rgba(30,111,232,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(30,111,232,0.3) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
          {/* Glow */}
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full opacity-20"
            style={{ background: 'radial-gradient(circle, #1E6FE8 0%, transparent 70%)' }} />

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-lg"
                style={{ background: 'linear-gradient(135deg, #1E6FE8, #4F46E5)' }}>👁</div>
              <div>
                <div className="font-display font-bold text-xl text-white">REPU-AI</div>
                <div className="text-xs text-blue-400 font-mono tracking-widest">AI INTELLIGENCE</div>
              </div>
            </div>
          </div>

          <div className="relative z-10">
            <div className="font-display font-bold text-4xl text-white leading-tight mb-4">
              Turn Google Reviews<br />
              <span style={{ background: 'linear-gradient(135deg, #1E6FE8, #00C2E0)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Into Operational<br />Intelligence
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-8">
              Monitor every dealership branch, identify top advisors, detect issues before they escalate — powered by AI.
            </p>

            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Total Reviews Tracked', value: '24,582', icon: '⭐', color: '#F5A623' },
                { label: 'Positive Sentiment', value: '87%', icon: '📈', color: '#10B981' },
                { label: 'Escalations Detected', value: '12', icon: '🚨', color: '#EF4444' },
                { label: 'Locations Monitored', value: '5', icon: '📍', color: '#1E6FE8' },
              ].map(stat => (
                <div key={stat.label} className="rounded-2xl p-4 border border-white/5"
                  style={{ background: 'rgba(255,255,255,0.04)' }}>
                  <div className="text-xl mb-1">{stat.icon}</div>
                  <div className="font-display font-bold text-xl" style={{ color: stat.color }}>{stat.value}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative z-10 text-xs text-gray-600">
            Powered by BroaddCast · Hyderabad · broaddcast.com
          </div>
        </div>

        {/* Right panel */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            {/* Logo mobile */}
            <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-lg"
                style={{ background: 'linear-gradient(135deg, #1E6FE8, #4F46E5)' }}>👁</div>
              <div className="font-display font-bold text-xl text-white">REPU-AI</div>
            </div>

            {step === 'login' ? (
              <div className="animate-[fadeIn_0.4s_ease_forwards]">
                <h2 className="font-display font-bold text-3xl text-white mb-1">Welcome back</h2>
                <p className="text-gray-400 text-sm mb-8">Sign in to your dealer dashboard</p>

                <form onSubmit={handleLogin} className="space-y-4">
                  {/* Role selector */}
                  <div>
                    <label className="text-xs text-gray-400 font-mono uppercase tracking-wider mb-2 block">Access Level</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'md', label: 'MD / CEO', icon: '👑' },
                        { id: 'gm', label: 'GM', icon: '🏢' },
                        { id: 'manager', label: 'Manager', icon: '👤' },
                      ].map(r => (
                        <button key={r.id} type="button" onClick={() => setRole(r.id as any)}
                          className={`p-3 rounded-xl border text-xs font-medium transition-all ${role === r.id ? 'border-blue-500/50 bg-blue-600/10 text-blue-400' : 'border-white/8 bg-white/3 text-gray-400 hover:border-white/15'}`}>
                          <div className="text-base mb-1">{r.icon}</div>
                          {r.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-gray-400 font-mono uppercase tracking-wider mb-2 block">Email</label>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@dealer.com" required
                      className="w-full bg-navy-800 border border-white/8 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 outline-none focus:border-blue-500/50 focus:bg-navy-700 transition-all" />
                  </div>

                  <div>
                    <label className="text-xs text-gray-400 font-mono uppercase tracking-wider mb-2 block">Password</label>
                    <input type="password" placeholder="••••••••" required
                      className="w-full bg-navy-800 border border-white/8 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 outline-none focus:border-blue-500/50 focus:bg-navy-700 transition-all" />
                  </div>

                  <button type="submit" disabled={loading}
                    className="w-full py-3.5 rounded-xl font-display font-bold text-white text-sm flex items-center justify-center gap-2 transition-opacity disabled:opacity-50"
                    style={{ background: 'linear-gradient(135deg, #1E6FE8, #4F46E5)' }}>
                    {loading ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full spin" /> : '→'}
                    {loading ? 'Signing in...' : 'Send OTP & Continue'}
                  </button>
                </form>

                <div className="mt-6 p-4 rounded-2xl border border-white/5 bg-white/2">
                  <div className="text-xs text-gray-500 text-center font-mono mb-3">DEMO ACCOUNTS</div>
                  <div className="space-y-2">
                    {[
                      { role: 'MD / CEO', email: 'md@saboo.com', access: 'All locations + all BUs' },
                      { role: 'GM', email: 'gm@saboo.com', access: 'Assigned locations' },
                    ].map(d => (
                      <button key={d.email} onClick={() => setEmail(d.email)}
                        className="w-full text-left p-3 rounded-xl bg-white/3 hover:bg-white/5 border border-transparent hover:border-white/8 transition-all">
                        <div className="text-xs font-medium text-gray-300">{d.role} — {d.email}</div>
                        <div className="text-xs text-gray-500 mt-0.5">{d.access}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="animate-[fadeIn_0.4s_ease_forwards]">
                <div className="mb-2 w-12 h-12 rounded-2xl flex items-center justify-center text-xl bg-green-500/10 border border-green-500/20">📱</div>
                <h2 className="font-display font-bold text-3xl text-white mb-1">Check your phone</h2>
                <p className="text-gray-400 text-sm mb-2">OTP sent to <span className="text-white">{email}</span></p>
                <p className="text-xs text-gray-600 mb-8 font-mono">Demo: use any 6 digits</p>

                <form onSubmit={handleOtp}>
                  <div className="flex gap-3 justify-between mb-6">
                    {otp.map((v, i) => (
                      <input key={i} id={`otp-${i}`} maxLength={1} value={v} onChange={e => handleOtpInput(e.target.value, i)}
                        className="w-12 h-14 bg-navy-800 border border-white/10 rounded-xl text-center text-xl font-bold text-white outline-none focus:border-blue-500/60 focus:bg-navy-700 transition-all"
                        onKeyDown={e => e.key === 'Backspace' && !v && i > 0 && document.getElementById(`otp-${i-1}`)?.focus()} />
                    ))}
                  </div>
                  <button type="submit" disabled={loading}
                    className="w-full py-3.5 rounded-xl font-display font-bold text-white text-sm flex items-center justify-center gap-2 disabled:opacity-50"
                    style={{ background: 'linear-gradient(135deg, #10B981, #059669)' }}>
                    {loading ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full spin" /> : '✓'}
                    {loading ? 'Verifying...' : 'Enter Dashboard'}
                  </button>
                  <button type="button" onClick={() => setStep('login')} className="w-full mt-3 text-xs text-gray-500 hover:text-gray-300 transition-colors">
                    ← Back to login
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
