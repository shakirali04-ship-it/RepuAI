// pages/api/report.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { context } = req.body;
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'API key not configured' });

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1200,
        system: `You are REPU-AI generating a monthly executive report for a Maruti Suzuki dealer group MD/CEO.
Structure your response as JSON with these exact keys:
{
  "headline": "One sentence executive summary",
  "score": number (0-100 reputation score),
  "scoreChange": number (change vs avg of last 3 months),
  "topWins": ["win1", "win2", "win3"],
  "topIssues": ["issue1", "issue2", "issue3"],
  "advisorStar": "Name and why",
  "advisorConcern": "Name and why",
  "locationStar": "Location name and why",
  "locationConcern": "Location name and why",
  "recommendations": ["rec1", "rec2", "rec3"],
  "urgentEscalations": ["esc1", "esc2"]
}
Return ONLY valid JSON, no markdown, no explanation.`,
        messages: [{ role: 'user', content: `Generate monthly report from this data: ${JSON.stringify(context)}` }],
      }),
    });

    const data = await response.json();
    const text = data.content?.[0]?.text || '{}';
    try {
      const parsed = JSON.parse(text);
      res.status(200).json(parsed);
    } catch {
      res.status(200).json({ error: 'Parse failed', raw: text });
    }
  } catch (e) {
    res.status(500).json({ error: 'Report generation failed' });
  }
}
