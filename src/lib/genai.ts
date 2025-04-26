import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: "AIzaSyBWeEqPO8sAbuF4JWs3PGdmJ7e95PjvEP0" });

export const getAIResponse = async (message:string) => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: [message],
        });
        return await response.text;
    } catch (error) {
        console.error("Error fetching AI response:", error);
        throw error;
    }
}