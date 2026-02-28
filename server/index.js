const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Initialize Gemini
if (!process.env.GEMINI_API_KEY) console.error("FATAL: GEMINI_API_KEY is missing from process.env");
else console.log(`[Init] Loaded GEMINI_API_KEY starting with: ${process.env.GEMINI_API_KEY.substring(0, 5)}...`);

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'MISSING_KEY');
// Using the available high-performance flash model
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

// The "Antigravity Narrative Auditor" System Prompt
const SYSTEM_PROMPT = `
ROLE: You are the "Antigravity Narrative Auditor." Your goal is to deconstruct news stories into cold, hard data to help humans rise above political "gravity" (bias).

TASKS:
1. DECONSTRUCT: Analyze the provided "Search Context" and break it down into 3-5 core factual claims.
2. LATERAL SEARCH: For each claim, identify how it is reported by the different sources in the context.
3. CALCULATE OMISSION: Identify facts present in one side but missing from the other.
4. CALCULATE VOLATILITY: Count "Loaded Words" (e.g., 'vicious', 'scheme', 'heroic').
5. ESTIMATE GRAVITY: Score the net bias (-100 Left to +100 Right).
6. SYNTHESIZE: Write a "Human Layer" synopsis. This MUST be distinct from the raw data. Explain the "Why" behind the numbers.

OUTPUT FORMAT: Return ONLY a valid JSON object matching this structure (no markdown fences):
{
  "metadata": {
    "query": "The original user query",
    "total_sources": "Number of sources analyzed",
    "gravity_score": "Score 1-10 (10 is neutral/verified, 1 is pure spin)"
  },
  "synthesis": {
    "executive_summary": "A concise 2-sentence overview of the narrative landscape for this topic.",
    "gravity_analysis": "Explain WHY the story leans Left or Right. e.g. 'The Right focused on cost, while the Left focused on intent.'",
    "omission_analysis": "Summarize the most critical missing context in plain English.",
    "truth_analysis": "One sentence acting as the final 'Truth Check' on the verified facts."
  },
  "claims": [
    {
      "id": 1,
      "fact": "The core claim",
      "status": "verified|disputed|debunked",
      "left_treatment": "reported|omitted|spun",
      "right_treatment": "reported|omitted|spun",
      "center_treatment": "reported|omitted|spun",
      "notes": "Brief explanation of the variance"
    }
  ],
  "omission_index": {
    "left_omissions": ["List of facts Left sources ignored"],
    "right_omissions": ["List of facts Right sources ignored"],
    "left_omission_pct": 20,
    "right_omission_pct": 45
  },
  "bias_metrics": {
    "left_score": -25, // -100 to 0
    "right_score": 60, // 0 to 100
    "loaded_words": {
      "left": ["list", "of", "words"],
      "right": ["list", "of", "words"]
    }
  }
}
`;

const BATTLE_PROMPT = `
ROLE: You are the "Antigravity Narrative Auditor" in BATTLE MODE. Your goal is to comparing two specific articles (Source A vs Source B) to find where they diverge.

TASKS:
1. COMPARE COVERAGE: What specific facts did Source A mention that Source B omitted (and vice versa)?
2. COMPARE TONE: Analyze the emotional language. Which one is more volatile?
3. VERIFY: If they disagree on a fact, use your internal knowledge to judge who is likely correct (or label it disputed).
4. SYNTHESIZE: Write a "Battle Report" summarizing the conflict.

OUTPUT FORMAT: Return ONLY a valid JSON object matching this structure (no markdown fences):
{
  "metadata": {
    "mode": "battle",
    "query": "Battle: Source A vs Source B",
    "total_sources": 2,
    "gravity_score": 0 // 0 for battle mode default
  },
  "synthesis": {
    "executive_summary": "A concise summary of the main conflict between these two articles.",
    "gravity_analysis": "Compare the bias/framing of A vs B.",
    "omission_analysis": "What are the biggest things each side left out?",
    "truth_analysis": "Final judgment on which source was more factual."
  },
  "claims": [
    {
      "id": 1,
      "fact": "The specific point of contention",
      "status": "verified|disputed",
      "source_a_treatment": "reported|omitted|spun",
      "source_b_treatment": "reported|omitted|spun",
      "notes": "How they differed"
    }
  ],
  "omission_index": {
    "source_a_omissions": ["Facts A missed"],
    "source_b_omissions": ["Facts B missed"],
    "source_a_omission_pct": 30, // 0-100 estimate
    "source_b_omission_pct": 10
  },
  "bias_metrics": {
    "source_a_score": -50, // -100 (Left) to +100 (Right) estimate
    "source_b_score": 20, 
    "loaded_words": {
      "source_a": ["volatile", "words", "in", "A"],
      "source_b": ["volatile", "words", "in", "B"]
    }
  }
}
`;

app.post('/api/audit', async (req, res) => {
  const { query } = req.body;

  if (!process.env.TAVILY_API_KEY || !process.env.GEMINI_API_KEY) {
    return res.status(500).json({ error: "Missing Server API Keys" });
  }

  try {
    console.log(`[Audit] step 1: Searching Tavily for "${query}"...`);

    // 1. Tavily Search
    const searchResponse = await axios.post('https://api.tavily.com/search', {
      api_key: process.env.TAVILY_API_KEY,
      query: query,
      search_depth: "advanced",
      include_answer: true,
      max_results: 7
    });

    const sources = searchResponse.data.results;
    const searchContext = sources.map(s => `Title: ${s.title}\nSource: ${s.url}\nContent: ${s.content}`).join('\n\n');

    console.log(`[Audit] step 2: Analyzing with Gemini...`);

    // 2. Gemini Analysis
    const prompt = `
      ${SYSTEM_PROMPT}

      USER QUERY: "${query}"
      
      SEARCH CONTEXT:
      ${searchContext}
    `;

    console.log(`[Audit] Sending prompt to Gemini...`);
    const result = await model.generateContent(prompt);

    if (!result || !result.response) {
      throw new Error("Empty response from Gemini");
    }

    const responseText = result.response.text();
    console.log(`[Audit] Gemini Response Length: ${responseText.length}`);
    // console.log(`[Audit] Raw Response Preview: ${responseText.substring(0, 200)}...`);

    try {
      const jsonResponse = extractJSON(responseText);

      // Inject actual source count
      jsonResponse.metadata.total_sources = sources.length;

      console.log(`[Audit] Success! Returning data.`);
      res.json(jsonResponse);

    } catch (parseError) {
      console.error("JSON Parse Error:", parseError);
      console.error("Failed JSON Text:", responseText); // Critical for debugging
      res.status(500).json({ error: "Failed to parse AI response", raw: responseText });
    }

  } catch (error) {
    console.error("Audit Error:", error);
    res.status(500).json({ error: error.message, stack: error.stack });
  }
});

// Helper to extract JSON from potentially Markdown-wrapped text
function extractJSON(text) {
  try {
    // 1. Try simple parse
    return JSON.parse(text);
  } catch (e) {
    // 2. Try to find json block
    const match = text.match(/```json([\s\S]*?)```/);
    if (match) return JSON.parse(match[1]);

    // 3. Try to find first { and last }
    const firstBrace = text.indexOf('{');
    const lastBrace = text.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1) {
      return JSON.parse(text.substring(firstBrace, lastBrace + 1));
    }
    throw new Error("No JSON found in response");
  }
}

// Battle Endpoint (URL vs URL)
app.post('/api/battle', async (req, res) => {
  const { urlA, urlB } = req.body;
  console.log(`[Battle] Starting comparison: ${urlA} vs ${urlB}`);

  try {
    // Step 1: Get Context for A
    console.log(`[Battle] Fetching context for Source A...`);
    let contextA = "";
    try {
      const responseA = await axios.post('https://api.tavily.com/search', {
        api_key: process.env.TAVILY_API_KEY,
        query: urlA,
        search_depth: "advanced",
        include_raw_content: true
      });
      contextA = responseA.data.results.map(r => `SOURCE A: ${r.title}\n${r.content}\n${r.raw_content || ''}`).join("\n\n").slice(0, 15000);
      console.log(`[Battle] Source A Context Size: ${contextA.length} chars`);
    } catch (err) {
      console.error(`[Battle] Failed to fetch Source A: ${err.message}`);
      contextA = "Source A could not be retrieved. Proceed with analysis noting this failure.";
    }

    // Step 2: Get Context for B
    console.log(`[Battle] Fetching context for Source B...`);
    let contextB = "";
    try {
      const responseB = await axios.post('https://api.tavily.com/search', {
        api_key: process.env.TAVILY_API_KEY,
        query: urlB,
        search_depth: "advanced",
        include_raw_content: true
      });
      contextB = responseB.data.results.map(r => `SOURCE B: ${r.title}\n${r.content}\n${r.raw_content || ''}`).join("\n\n").slice(0, 15000);
      console.log(`[Battle] Source B Context Size: ${contextB.length} chars`);
    } catch (err) {
      console.error(`[Battle] Failed to fetch Source B: ${err.message}`);
      contextB = "Source B could not be retrieved. Proceed with analysis noting this failure.";
    }

    // 2. Analyze with Gemini
    console.log(`[Battle] Analyzing with Gemini...`);
    const prompt = `${BATTLE_PROMPT}\n\n=== SOURCE A CONTENT ===\n${contextA}\n\n=== SOURCE B CONTENT ===\n${contextB}`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    // 3. Clean and Parse JSON
    try {
      const jsonResponse = extractJSON(responseText);
      console.log(`[Battle] Analysis successful.`);
      res.json(jsonResponse);
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError);
      console.log("Raw Response:", responseText); // Log this to see what went wrong
      res.status(500).json({ error: "Failed to parse AI response", raw: responseText });
    }

  } catch (error) {
    console.error("Battle Error:", error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Antigravity Audit Server running on port ${PORT}`);
});
