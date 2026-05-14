# REPU-AI — Dealer Intelligence Dashboard

**Built for Maruti Suzuki dealer groups** (Arena, Nexa, Service, True Value)  
Powered by Google Reviews + Claude AI + BroaddCast

---

## Features

- **Multi-location** dashboard (5 branches: Banjara Hills, Jubilee Hills, Secunderabad, Kukatpally, Warangal)
- **Business unit split**: Arena Sales · Nexa Sales · Service · True Value
- **Advisor sentiment leaderboard** — Sales & Service separately, ranked by % positive mentions
- **Category breakdown** — Positive vs Negative with specific reasons (parking, cleanliness, reception, delivery, billing, etc.)
- **6-month trend charts** with Recharts
- **AI Monthly Report** — one-click report comparing current month vs last 3 months (for MD/CEO/GM)
- **AI Query Box** — ask anything about your reviews, get instant operational intelligence
- **Escalation alerts** — advisors flagged automatically based on sentiment threshold

---

## Deploy to Vercel (5 minutes)

### Step 1: Get your Anthropic API Key
1. Go to [console.anthropic.com](https://console.anthropic.com/)
2. Create an account or sign in
3. Go to **API Keys** → **Create Key**
4. Copy the key (starts with `sk-ant-...`)

### Step 2: Push to GitHub
```bash
cd reputation-eye
git init
git add .
git commit -m "Initial commit — REPU-AI"
# Create a new repo on github.com, then:
git remote add origin https://github.com/YOUR_USERNAME/reputation-eye.git
git push -u origin main
```

### Step 3: Deploy on Vercel
1. Go to [vercel.com](https://vercel.com) → Sign in with GitHub
2. Click **"Add New Project"**
3. Select your `reputation-eye` repository
4. Click **"Deploy"** (Vercel auto-detects Next.js)
5. After deploy, go to **Settings → Environment Variables**
6. Add: `ANTHROPIC_API_KEY` = `sk-ant-your-key-here`
7. Go to **Deployments** → click **"Redeploy"** to apply the env var

Your dashboard is now live at `https://reputation-eye.vercel.app` (or your custom domain).

---

## Local Development

```bash
cd reputation-eye
cp .env.example .env.local
# Edit .env.local and add your ANTHROPIC_API_KEY
npm install
npm run dev
# Open http://localhost:3000
```

---

## Project Structure

```
reputation-eye/
├── pages/
│   ├── _app.tsx          # App wrapper
│   ├── index.tsx         # Main dashboard
│   └── api/
│       ├── analyze.ts    # AI query endpoint
│       └── report.ts     # Monthly report endpoint
├── components/
│   ├── Sidebar.tsx       # Left nav + filters
│   ├── MetricCard.tsx    # KPI cards
│   ├── SentimentTrendChart.tsx   # 6-month Recharts
│   ├── AdvisorLeaderboard.tsx    # Ranked advisors
│   ├── CategoryBreakdown.tsx     # +/- category bars
│   ├── LocationGrid.tsx          # Location cards
│   ├── AIQueryBox.tsx            # Ask AI
│   └── ReportModal.tsx           # Monthly report
├── lib/
│   └── data.ts           # Mock data + aggregation logic
├── styles/
│   └── globals.css       # Dark navy theme
├── .env.example          # Environment template
├── vercel.json           # Vercel config
└── README.md
```

---

## Connecting Real Google Business Profile Data

To connect real GMB reviews:
1. Use the **Google My Business API** → fetch reviews per location
2. Send each review text through Claude API for classification (sales/service/etc.)
3. Store results in a database (Postgres on Vercel, Supabase, or Planetscale)
4. Replace `lib/data.ts` mock data with real DB queries

BroaddCast can handle the full GMB integration. Contact: leads@broaddcast.com

---

## Customizing for Your Dealership

Edit `lib/data.ts` to update:
- `LOCATIONS` — your actual branch names
- `BUSINESS_UNITS` — your divisions
- `POSITIVE_CATEGORIES` / `NEGATIVE_CATEGORIES` — review topics

The AI system prompt in `pages/api/analyze.ts` and `pages/api/report.ts` can be updated with your specific dealership data.

---

Built by BroaddCast · Hyderabad · broaddcast.com
