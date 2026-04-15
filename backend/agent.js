// agent.js — The Groq + Hindsight Logic
import { storeMemory, recallMemories } from "./hindsight.js";

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

export async function runAgent({ messages }) {
    const userMessage = messages[messages.length - 1].content;

    // 1. Recall relevant past context from Hindsight
    // Note: Use 'text' or 'content' based on the mapping in hindsight.js
    const { memories } = await recallMemories({ query: userMessage, topK: 3 });
    const context = memories.map(m => m.content).join("\n");

    // 2. Prepare System Prompt with Context
    const systemPrompt = {
        role: "system",
        content: `You are TradeMemory — an elite AI trading journal assistant.
 
Your role is to help traders log trades and identify behavioral patterns.
Speak like a seasoned trading mentor. Be direct and perceptive.

**STRICT RULE:** Do not show any internal thinking, reasoning, or <think> blocks. 
Process your logic silently and provide ONLY the final response to the user.
**STRICT RULE:** Do not ask any question to user only answer when asked based on memory and thinking.

**TRADING CONTEXT FROM MEMORY:**
${context}`
    };

    try {
        // 3. Call Groq with the Qwen model
        const response = await fetch(GROQ_URL, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "qwen/qwen3-32b", 
                messages: [systemPrompt, ...messages],
                temperature: 0.7
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error?.message || "Groq API Error");
        }

        let agentReply = data.choices[0].message.content;

        // 4. CLEANING: Remove any accidental <think> blocks from the output
        agentReply = agentReply.replace(/<think>[\s\S]*?<\/think>/g, "").trim();

        // 5. DYNAMIC STATS LOGIC: Detect trade outcome for the StatsBar
        const userMsgLower = userMessage.toLowerCase();
        const isWin = userMsgLower.includes("win") || userMsgLower.includes("winning");
        const isLoss = userMsgLower.includes("loss") || userMsgLower.includes("lost");

        // Set metadata required by server.js to calculate Win Rate
        const memoryType = (isWin || isLoss) ? "trade_log" : "observation";
        
        // FIX: Ensure outcome is NEVER null. Use "NONE" or "PENDING" as a fallback string.
        const outcome = isWin ? "WIN" : (isLoss ? "LOSS" : "NONE");

        // 6. Auto-save to Hindsight with the correct metadata
        try {
            await storeMemory({ 
                content: `User: ${userMessage} | AI: ${agentReply}`,
                metadata: { 
                    type: memoryType, 
                    outcome: outcome // Now guaranteed to be a valid string ("WIN", "LOSS", or "NONE")
                }
            });
        } catch (storageError) {
            console.error("Hindsight Storage Failed:", storageError.message);
            // We don't throw here so the user still gets their AI reply even if saving fails
        }

        // Returning empty toolsUsed array hides the tags from your chat UI
        return { response: agentReply, toolsUsed: [] };

    } catch (error) {
        console.error("Agent Loop Error:", error.message);
        throw error;
    }
}