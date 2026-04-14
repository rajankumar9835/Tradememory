// hindsight.js — Hindsight Cloud memory layer
// Docs: https://hindsight.vectorize.io/
// All API calls go through Hindsight REST API

import fetch from "node-fetch";

const BASE_URL = "https://api.hindsight.vectorize.io/v1";

function headers() {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.HINDSIGHT_API_KEY}`,
  };
}

const PIPELINE_ID = () => process.env.HINDSIGHT_PIPELINE_ID;

// ── Store a memory (trade log, insight, observation) ──────────────────────────
export async function storeMemory({ content, metadata = {} }) {
  try {
    const res = await fetch(`${BASE_URL}/pipelines/${PIPELINE_ID()}/documents`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify({
        documents: [
          {
            content,
            metadata: {
              ...metadata,
              timestamp: new Date().toISOString(),
              source: "tradememory",
            },
          },
        ],
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Hindsight store error: ${res.status} — ${err}`);
    }

    const data = await res.json();
    return { success: true, data };
  } catch (error) {
    console.error("[Hindsight] storeMemory error:", error.message);
    return { success: false, error: error.message };
  }
}

// ── Recall relevant memories via semantic search ──────────────────────────────
export async function recallMemories({ query, topK = 5 }) {
  try {
    const res = await fetch(`${BASE_URL}/pipelines/${PIPELINE_ID()}/retrieve`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify({
        query,
        top_k: topK,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Hindsight recall error: ${res.status} — ${err}`);
    }

    const data = await res.json();
    const memories = (data.results || []).map((r) => ({
      content: r.content || r.document?.content || "",
      score: r.score,
      metadata: r.metadata || r.document?.metadata || {},
    }));

    return { success: true, memories };
  } catch (error) {
    console.error("[Hindsight] recallMemories error:", error.message);
    return { success: false, memories: [], error: error.message };
  }
}

// ── List all stored documents (for stats / history) ───────────────────────────
export async function listMemories({ limit = 20 } = {}) {
  try {
    const res = await fetch(
      `${BASE_URL}/pipelines/${PIPELINE_ID()}/documents?limit=${limit}`,
      { method: "GET", headers: headers() }
    );

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Hindsight list error: ${res.status} — ${err}`);
    }

    const data = await res.json();
    return { success: true, documents: data.documents || data.results || [] };
  } catch (error) {
    console.error("[Hindsight] listMemories error:", error.message);
    return { success: false, documents: [], error: error.message };
  }
}