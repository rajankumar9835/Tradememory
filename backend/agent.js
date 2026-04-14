// agent.js — The Groq + Hindsight Logic
import { storeMemory, recallMemories } from "./hindsight.js";

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

export async function runAgent({ messages }) {
    const userMessage = messages[messages.length - 1].content;

    // 1. Recall relevant past trades from Hindsight
    const { memories } = await recallMemories({ query: userMessage, topK: 3 });
    const context = memories.map(m => m.content).join("\n");

    // 2. Prepare System Prompt with Context
    const systemPrompt = {
        role: "system",
        content: `You are TradeMemory AI. Use this context from the user's past trades to help: \n${context}`
    };

    try {
        // 3. Call Groq with the NEW Model ID
        const response = await fetch(GROQ_URL, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "qwen/qwen3-32b", // UPDATED FROM LIST
                messages: [systemPrompt, ...messages],
                temperature: 0.7
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error?.message || "Groq API Error");
        }

        const agentReply = data.choices[0].message.content;

        // 4. Auto-save the conversation to Hindsight Memory
        await storeMemory({ 
            content: `User: ${userMessage} | AI: ${agentReply}`,
            metadata: { type: "observation" }
        });

        return { response: agentReply, toolsUsed: ["hindsight_recall", "hindsight_store"] };

    } catch (error) {
        console.error("Agent Loop Error:", error.message);
        throw error;
    }
}