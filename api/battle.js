import axios from 'axios';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

const BATTLE_PROMPT = `
ROLE: You are the "Antigravity Narrative Auditor" in BATTLE MODE. Compare two specific articles (Source A vs Source B).
TASKS:
1. COMPARE COVERAGE: Facts each source mentioned that the other omitted.
2. COMPARE TONE: Which is more volatile emotionally?
3. VERIFY: Use your knowledge to judge factual accuracy.
4. SYNTHESIZE: Write a "Battle Report" summarizing the conflict.

OUTPUT FORMAT: Return ONLY valid JSON (no markdown):
{
  "metadata": { "mode": "battle", "query": "Battle: Source A vs Source B", "total_sources": 2, "gravity_score": 0 },
  "synthesis": { "executive_summary": "...", "gravity_analysis": "...", "omission_analysis": "...", "truth_analysis": "..." },
  "claims": [{ "id": 1, "fact": "...", "status": "verified|disputed", "source_a_treatment": "...", "source_b_treatment": "...", "notes": "..." }],
  "omission_index": { "source_a_omissions": [], "source_b_omissions": [], "source_a_omission_pct": 0, "source_b_omission_pct": 0 },
  "bias_metrics": { "source_a_score": 0, "source_b_score": 0, "loaded_words": { "source_a": [], "source_b": [] } }
}
`;

function extractJSON(text) {
    try { return JSON.parse(text); } catch { }
    const match = text.match(/```json([\s\S]*?)```/);
    if (match) try { return JSON.parse(match[1]); } catch { }
    const first = text.indexOf('{');
    const last = text.lastIndexOf('}');
    if (first !== -1 && last !== -1) return JSON.parse(text.substring(first, last + 1));
    throw new Error('No JSON found in response');
}

async function fetchContext(url, label) {
    try {
        const response = await axios.post('https://api.tavily.com/search', {
            api_key: process.env.TAVILY_API_KEY,
            query: url,
            search_depth: 'advanced',
            include_raw_content: true,
        });
        return response.data.results
            .map(r => `${label}: ${r.title}\n${r.content}\n${r.raw_content || ''}`)
            .join('\n\n')
            .slice(0, 15000);
    } catch {
        return `${label} could not be retrieved.`;
    }
}

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const { urlA, urlB } = req.body;
    if (!urlA || !urlB) return res.status(400).json({ error: 'Missing urlA or urlB' });

    try {
        const [contextA, contextB] = await Promise.all([
            fetchContext(urlA, 'SOURCE A'),
            fetchContext(urlB, 'SOURCE B'),
        ]);

        const prompt = `${BATTLE_PROMPT}\n\n=== SOURCE A ===\n${contextA}\n\n=== SOURCE B ===\n${contextB}`;
        const result = await model.generateContent(prompt);
        const jsonResponse = extractJSON(result.response.text());

        return res.json(jsonResponse);
    } catch (error) {
        console.error('Battle error:', error);
        return res.status(500).json({ error: error.message });
    }
}
