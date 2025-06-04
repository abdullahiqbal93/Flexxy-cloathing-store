import axios from 'axios';
import { env } from '../../lib/config.js';

const API_URL = "https://api.textcortex.com/v1/texts/products/descriptions";

export const generateText = async (prompt) => {
    try {
        if (!env.TEXT_CORTEX_API_KEY) {
            throw new Error("TEXT_CORTEX_API_KEY is not configured");
        }

        const apiKey = env.TEXT_CORTEX_API_KEY.trim();
        const response = await axios.post(API_URL, {
            source_lang: "en",
            target_lang: "en",
            name: "Product Description",
            model: "gemini-2-0-flash",
            max_tokens: 2048,
            n: 1,
            temperature: 0.7,
            description: prompt,
            formality: "default",
            keywords: ["product", "description"],
            brand: "",
            category: ""
        }, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`
            }
        });

        console.log('Text Generation Response:', response.data);

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
