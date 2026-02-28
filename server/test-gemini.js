require('dotenv').config();
const axios = require('axios');

async function listModels() {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
        console.error("No API Key found in .env");
        return;
    }

    try {
        console.log("Querying Google for available models...");
        const response = await axios.get(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`);
        const models = response.data.models;

        console.log("\n--- Available Models for your Key ---");
        models.forEach(m => {
            if (m.supportedGenerationMethods.includes("generateContent")) {
                console.log(`- ${m.name.replace('models/', '')} \t(Version: ${m.version})`);
            }
        });
        console.log("-------------------------------------\n");

    } catch (error) {
        console.error("Detailed Error:", error.response ? error.response.data : error.message);
    }
}

listModels();
