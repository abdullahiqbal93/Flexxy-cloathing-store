import axios from 'axios';
import { env } from '../../lib/config.js';

const API_URL = "https://api.textcortex.com/v1/texts/descriptions";

export const generateText = async (prompt) => {
    try {
        if (!env.TEXT_CORTEX_API_KEY) {
            throw new Error("TEXT_CORTEX_API_KEY is not configured");
        }

        const apiKey = env.TEXT_CORTEX_API_KEY.trim();
        const response = await axios.post(API_URL, {
            max_tokens: 200,
            model: "gemini-2-0-flash",
            n: 1,
            temperature: null,
            text: prompt
        }, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`
            }
        });

        const generatedText = response.data.data[0]?.text;
        if (!generatedText) {
            throw new Error("No description generated");
        }
        return generatedText;
    } catch (error) {
        console.error('Text Generation Error:', error.response?.data || error.message);
        throw new Error(error.response?.data?.message || "Failed to generate text");
    }
};
