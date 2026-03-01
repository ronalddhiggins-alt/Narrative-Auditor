import axios from 'axios';

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');

    const key = process.env.GEMINI_API_KEY;
    if (!key) return res.json({ error: 'No GEMINI_API_KEY set', keyPrefix: null });

    try {
        // List available models
        const response = await axios.get(
            `https://generativelanguage.googleapis.com/v1/models?key=${key}`
        );
        const models = response.data.models?.map(m => m.name) || [];
        return res.json({
            keyPrefix: key.substring(0, 8) + '...',
            availableModels: models,
            total: models.length
        });
    } catch (err) {
        return res.json({
            keyPrefix: key.substring(0, 8) + '...',
            error: err.response?.data || err.message,
            status: err.response?.status
        });
    }
}
