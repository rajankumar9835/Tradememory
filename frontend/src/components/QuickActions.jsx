// components/QuickActions.jsx
import React from "react";
import { TrendingUp, TrendingDown, Search, Lightbulb, BarChart2, AlertTriangle } from "lucide-react";

const QUICK_ACTIONS = [
  {
    icon: <TrendingUp size={14} />,
    label: "Log Win",
    prompt: "I just closed a winning trade on ",
    color: "var(--green)",
  },
  {
    icon: <TrendingDown size={14} />,
    label: "Log Loss",
    prompt: "I just took a loss on ",
    color: "var(--red)",
  },
  {
    icon: <Search size={14} />,
    label: "Recall Trades",
    prompt: "Show me my recent trades and patterns",
    color: "var(--blue)",
  },
  {
    icon: <BarChart2 size={14} />,
    label: "Analyze Me",
    prompt: "Analyze my trading patterns, strengths, and biggest weaknesses",
    color: "#a855f7",
  },
  {
    icon: <Lightbulb size={14} />,
    label: "Store Lesson",
    prompt: "I learned this lesson today: ",
    color: "var(--amber)",
  },
  {
    icon: <AlertTriangle size={14} />,
    label: "Pre-Trade Check",
    prompt: "I'm thinking about taking a trade on ",
    color: "var(--accent)",
  },
];

export default function QuickActions({ onSelect }) {
  return (
    <div style={styles.container}>
      <div style={styles.label}>Quick Actions</div>
      <div style={styles.actions}>
        {QUICK_ACTIONS.map((action, i) => (
          <button
            key={i}
            onClick={() => onSelect(action.prompt)}
            style={styles.btn}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--bg-hover)";
              e.currentTarget.style.borderColor = action.color + "66";
              e.currentTarget.style.color = action.color;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "var(--bg-surface)";
              e.currentTarget.style.borderColor = "var(--border)";
              e.currentTarget.style.color = "var(--text-secondary)";
            }}
          >
            <span style={{ color: "inherit" }}>{action.icon}</span>
            {action.label}
          </button>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: "12px 24px",
    borderBottom: "1px solid var(--border)",
    background: "var(--bg-deep)",
  },
  label: {
    fontSize: 11,
    color: "var(--text-muted)",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    marginBottom: 8,
  },
  actions: {
    display: "flex",
    gap: 8,
    flexWrap: "wrap",
  },
  btn: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    padding: "6px 12px",
    background: "var(--bg-surface)",
    border: "1px solid var(--border)",
    borderRadius: 99,
    color: "var(--text-secondary)",
    fontSize: 12,
    fontFamily: "var(--font-body)",
    fontWeight: 500,
    transition: "all 0.15s ease",
    cursor: "pointer",
    whiteSpace: "nowrap",
  },
};