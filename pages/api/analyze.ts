// pages/api/analyze.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { question, context } = req.body;

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
        max_tokens: 600,
        system: `You are REPU-AI, an operational intelligence agent for a large Maruti Suzuki dealer group in Hyderabad (Arena, Nexa, Service, True Value divisions across 5 locations).
Analyze dealership Google review data and give sharp, actionable operational intelligence.
Be direct. Max 4 sentences. No filler. Focus on what the GM/MD should act on immediately.
Context data: ${JSON.stringify(context)}`,
        messages: [{ role: 'user', content: question }],
      }),
    });

    const data = await response.json();
    const text = data.content?.[0]?.text || 'No response.';
    res.status(200).json({ text });
  } catch (e) {
    res.status(500).json({ error: 'AI request failed' });
  }
}
