import axios from 'axios';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

const SYSTEM_PROMPT = `
ROLE: You are the "Antigravity Narrative Auditor." Your goal is to deconstruct news stories into cold, hard data to help humans rise above political "gravity" (bias).

TASKS:
1. DECONSTRUCT: Analyze the provided "Search Context" and break it down into 3-5 core factual claims.
2. LATERAL SEARCH: For each claim, identify how it is reported by the different sources in the context.
3. CALCULATE OMISSION: Identify facts present in one side but missing from the other.
4. CALCULATE VOLATILITY: Count "Loaded Words" (e.g., 'vicious', 'scheme', 'heroic').
5. ESTIMATE GRAVITY: Score the net bias (-100 Left to +100 Right).
6. SYNTHESIZE: Write a "Human Layer" synopsis. Explain the "Why" behind the numbers.

OUTPUT FORMAT: Return ONLY a valid JSON object (no markdown fences):
{
  "metadata": { "query": "...", "total_sources": 0, "gravity_score": "..." },
  "synthesis": {
    "executive_summary": "...",
    "gravity_analysis": "...",
    "omission_analysis": "...",
    "truth_analysis": "..."
  },
  "claims": [{ "id": 1, "fact": "...", "status": "verified|disputed|debunked", "left_treatment": "reported|omitted|spun", "right_treatment": "...", "center_treatment": "...", "notes": "..." }],
  "omission_index": { "left_omissions": [], "right_omissions": [], "left_omission_pct": 0, "right_omission_pct": 0 },
  "bias_metrics": { "left_score": 0, "right_score": 0, "loaded_words": { "left": [], "right": [] } }
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

export default async function handler(req, res) {
    // CORS headers for Vercel
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const { query } = req.body;
    if (!query) return res.status(400).json({ error: 'Missing query' });

    if (!process.env.TAVILY_API_KEY || !process.env.GEMINI_API_KEY) {
        return res.status(500).json({ error: 'Missing server API keys' });
    }

    try {
        // 1. Tavily Search
        const searchResponse = await axios.post('https://api.tavily.com/search', {
            api_key: process.env.TAVILY_API_KEY,
            query,
            search_depth: 'advanced',
            include_answer: true,
            max_results: 7,
        });

        const sources = searchResponse.data.results;
        const searchContext = sources
            .map(s => `Title: ${s.title}\nSource: ${s.url}\nContent: ${s.content}`)
            .join('\n\n');

        // 2. Gemini Analysis
        const prompt = `${SYSTEM_PROMPT}\n\nUSER QUERY: "${query}"\n\nSEARCH CONTEXT:\n${searchContext}`;
        const result = await model.generateContent(prompt);
        const responseText = result.response.text();
        const jsonResponse = extractJSON(responseText);
        jsonResponse.metadata.total_sources = sources.length;

        return res.json(jsonResponse);
    } catch (error) {
        console.error('Audit error:', error);
        return res.status(500).json({ error: error.message });
    }
}
