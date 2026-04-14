// tools.js — 5 Groq function-calling tools for TradeMemory agent
// These are passed to the LLM so it can choose which action to take

export const TOOLS = [
  {
    type: "function",
    function: {
      name: "log_trade",
      description:
        "Log a new trade entry into persistent Hindsight memory. Call this when the user describes entering or exiting a position, making a trade, or recording a trade outcome.",
      parameters: {
        type: "object",
        properties: {
          symbol: {
            type: "string",
            description: "Ticker symbol, e.g. AAPL, BTC/USD, EUR/USD",
          },
          direction: {
            type: "string",
            enum: ["LONG", "SHORT"],
            description: "Trade direction",
          },
          entry_price: {
            type: "number",
            description: "Entry price of the trade",
          },
          exit_price: {
            type: "number",
            description: "Exit price of the trade, if known",
          },
          pnl: {
            type: "number",
            description:
              "Profit or loss in dollars or percent, positive = win, negative = loss",
          },
          size: {
            type: "string",
            description: "Position size or lot size",
          },
          notes: {
            type: "string",
            description:
              "Any notes, rationale, setup type, emotions, or context the trader provides",
          },
          outcome: {
            type: "string",
            enum: ["WIN", "LOSS", "BREAKEVEN", "OPEN"],
            description: "Trade outcome",
          },
        },
        required: ["symbol", "direction", "notes"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "recall_past_trades",
      description:
        "Search and recall relevant past trades and memories from Hindsight. Use this when the user asks about their history, patterns, past trades on a symbol, or wants to learn from previous experience.",
      parameters: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description:
              "Semantic search query to find relevant memories, e.g. 'TSLA losses', 'FOMO trades', 'winning setups'",
          },
          top_k: {
            type: "number",
            description: "How many memories to retrieve (default: 5)",
          },
        },
        required: ["query"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "analyze_patterns",
      description:
        "Analyze the trader's patterns, strengths, weaknesses, and tendencies based on recalled memories. Use after recalling trades to provide deep psychological and statistical analysis.",
      parameters: {
        type: "object",
        properties: {
          focus_area: {
            type: "string",
            description:
              "What to analyze, e.g. 'win rate by setup', 'emotional mistakes', 'best trading hours', 'risk management'",
          },
          memories_context: {
            type: "string",
            description:
              "The recalled memories or trade data to base the analysis on",
          },
        },
        required: ["focus_area", "memories_context"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "store_observation",
      description:
        "Store a market observation, lesson learned, trading rule, or insight into Hindsight memory for future recall. Use when the user shares a lesson, market note, or rule they want to remember.",
      parameters: {
        type: "object",
        properties: {
          observation: {
            type: "string",
            description:
              "The insight, market observation, or lesson to permanently store",
          },
          category: {
            type: "string",
            enum: [
              "LESSON",
              "MARKET_OBSERVATION",
              "TRADING_RULE",
              "PSYCHOLOGY",
              "SETUP",
            ],
            description: "Category of the observation",
          },
          related_symbol: {
            type: "string",
            description:
              "Optional: ticker symbol this observation is related to",
          },
        },
        required: ["observation", "category"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "check_similar_setups",
      description:
        "Before a trade, check if the trader has seen this setup before and how it performed. Helps with pre-trade decision making using memory of past similar situations.",
      parameters: {
        type: "object",
        properties: {
          current_setup: {
            type: "string",
            description:
              "Description of the current trade setup being considered",
          },
          symbol: {
            type: "string",
            description: "Symbol being traded",
          },
        },
        required: ["current_setup"],
      },
    },
  },
];