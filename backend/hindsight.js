// hindsight.js — Official Hindsight SDK Implementation
import { HindsightClient } from '@vectorize-io/hindsight-client';

// Initialize the official client using your environment variables
const client = new HindsightClient({
  baseUrl: 'https://api.hindsight.vectorize.io',
  apiKey: process.env.HINDSIGHT_API_KEY
});

// Helper function to get the current Bank ID (Pipeline ID)
const BANK_ID = () => process.env.HINDSIGHT_PIPELINE_ID;

/**
 * Stores a new memory (trade log or observation) in Hindsight.
 * @param {string} content - The text of the chat or trade details.
 * @param {object} metadata - Tags like { type: "trade_log", outcome: "WIN" }.
 */
export async function storeMemory({ content, metadata = {} }) {
  try {
    // Uses the official 'retain' method for permanent storage
    const result = await client.retain(BANK_ID(), content, { 
      metadata: {
        ...metadata,
        source: "tradememory",
        timestamp: new Date().toISOString()
      } 
    });
    
    return { success: true, data: result };
  } catch (error) {
    console.error("[Hindsight] storeMemory error:", error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Recalls relevant past trades using semantic search.
 * @param {string} query - The user's current message.
 * @param {number} topK - Number of memories to retrieve.
 */
export async function recallMemories({ query, topK = 5 }) {
  try {
    // Uses the official 'recall' method for semantic search
    const result = await client.recall(BANK_ID(), query, { limit: topK });
    
    // Map the SDK response to the format expected by agent.js
    const memories = (result.results || []).map((r) => ({
      content: r.text || r.content || "",
      score: r.score,
      metadata: r.metadata || {},
    }));

    return { success: true, memories };
  } catch (error) {
    console.error("[Hindsight] recallMemories error:", error.message);
    return { success: false, memories: [], error: error.message };
  }
}

/**
 * Lists memories to calculate dashboard statistics.
 * @param {number} limit - Number of documents to fetch.
 */
export async function listMemories({ limit = 100 } = {}) {
  try {
    // If a direct 'list' is unavailable, we recall with an empty query to get recent data
    const result = await client.recall(BANK_ID(), "", { limit });
    
    return { 
      success: true, 
      documents: (result.results || []).map(r => ({
        content: r.text || r.content || "",
        metadata: r.metadata || {}
      }))
    };
  } catch (error) {
    console.error("[Hindsight] listMemories error:", error.message);
    return { success: false, documents: [], error: error.message };
  }
}