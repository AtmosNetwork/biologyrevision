
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const getSystemInstruction = () => {
    return `You are an expert AQA A-Level Biology tutor. 
    Your explanations are clear, concise, and precisely tailored to the AQA specification. 
    You must use markdown for formatting to structure your response effectively. 
    Use headings (e.g., ##), subheadings (e.g., ###), bullet points (e.g., * or -), and bold text (e.g., **key term**) to make the information easy to digest.
    When generating questions, provide a detailed mark scheme or answer on a new line, prefixed with 'ANSWER:'.`;
};

const getPrompt = (topic: string, type: 'summary' | 'questions' | 'explain', customPrompt: string): string => {
    switch (type) {
        case 'summary':
            return `Provide a detailed summary of the key concepts for the AQA A-Level Biology topic: "${topic}". Focus on the most important information for revision. Ensure the content is accurate and directly relevant to the AQA syllabus.`;
        case 'questions':
            return `Generate 5 challenging exam-style questions for the AQA A-Level Biology topic: "${topic}". Include a mix of short-answer (1-3 marks) and longer-answer questions (4-6 marks). For each question, provide a detailed answer or mark scheme immediately following it.`;
        case 'explain':
            return `Explain the concept of "${customPrompt}" within the context of the AQA A-Level Biology topic: "${topic}". Break down the concept into simple, easy-to-understand parts. Use analogies if helpful.`;
        default:
            return '';
    }
};

export const generateRevisionContent = async (
    topic: string,
    type: 'summary' | 'questions' | 'explain',
    customPrompt: string = ''
): Promise<string> => {
    try {
        const model = 'gemini-2.5-flash';
        const systemInstruction = getSystemInstruction();
        const userPrompt = getPrompt(topic, type, customPrompt);

        if (!userPrompt) {
            throw new Error('Invalid revision type selected.');
        }

        const response = await ai.models.generateContent({
            model: model,
            contents: userPrompt,
            config: {
                systemInstruction: systemInstruction,
                temperature: 0.7,
                topP: 0.95,
            },
        });

        return response.text;
    } catch (error) {
        console.error("Error generating content from Gemini:", error);
        throw new Error("Failed to communicate with the Gemini API.");
    }
};
