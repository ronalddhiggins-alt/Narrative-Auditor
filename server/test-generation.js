require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function testGen() {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    // Using the model explicitly found in the list
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

    try {
        console.log("Testing generation with gemini-2.0-flash...");
        const result = await model.generateContent("Explain gravity in 5 words.");
        console.log("Response:", result.response.text());
        console.log("SUCCESS!");
    } catch (error) {
        console.error("FAILURE:");
        console.error(error.message);
        if (error.response) {
            console.error(JSON.stringify(error.response, null, 2));
        }
    }
}

testGen();
