import axios from 'axios';

const API_URL = "https://api-inference.huggingface.co/models/google/flan-t5-large";

export const generateText = async (prompt) => {
    try {
        const response = await axios.post(API_URL, {
            inputs: prompt,
            parameters: {
                max_length: 200,
                temperature: 0.7
            }
        }, {
            headers: {
                "Content-Type": "application/json"
            }
        });

        return response.data[0]?.generated_text || "";
    } catch (error) {
        throw new Error(error.response?.data?.message || "Failed to generate text");
    }
};
