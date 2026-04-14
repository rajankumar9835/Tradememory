// components/MessageBubble.jsx
import React from "react";
import ReactMarkdown from "react-markdown";
import { User, Brain, Wrench } from "lucide-react";

const TOOL_LABELS = {
  log_trade: { label: "Logged Trade", color: "#22c55e" },
  recall_past_trades: { label: "Recalled Memory", color: "#3b82f6" },
  analyze_patterns: { label: "Analyzed Patterns", color: "#a855f7" },
  store_observation: { label: "Stored Observation", color: "#f59e0b" },
  check_similar_setups: { label: "Checked Similar Setups", color: "#00d4aa" },
};

export default function MessageBubble({ message }) {
  const isUser = message.role === "user";
  const isError = message.isError;

  return (
    <div
      style={{
        ...styles.wrapper,
        justifyContent: isUser ? "flex-end" : "flex-start",
        animation: "fadeIn 0.25s ease forwards",
      }}
    >
      {!isUser && (
        <div style={styles.avatar}>
          <Brain size={16} color="#00d4aa" />
        </div>
      )}

      <div style={{ maxWidth: "72%", display: "flex", flexDirection: "column", gap: 6 }}>
        {/* Tool badges */}
        {!isUser && message.toolsUsed?.length > 0 && (
          <div style={styles.toolBadges}>
            {message.toolsUsed.map((tool, i) => {
              const t = TOOL_LABELS[tool] || { label: tool, color: "var(--accent)" };
              return (
                <span
                  key={i}
                  style={{ ...styles.toolBadge, color: t.color, borderColor: t.color + "44", background: t.color + "11" }}
                >
                  <Wrench size={10} />
                  {t.label}
                </span>
              );
            })}
          </div>
        )}

        {/* Bubble */}
        <div
          style={{
            ...styles.bubble,
            background: isUser ? "var(--accent-glow-strong)" : "var(--bg-raised)",
            border: isUser
              ? "1px solid rgba(0,212,170,0.3)"
              : isError
              ? "1px solid rgba(239,68,68,0.3)"
              : "1px solid var(--border)",
          }}
        >
          {isUser ? (
            <p style={styles.userText}>{message.content}</p>
          ) : (
            <div style={styles.mdWrapper}>
              <ReactMarkdown
                components={{
                  p: ({ children }) => <p style={styles.mdP}>{children}</p>,
                  strong: ({ children }) => <strong style={styles.mdStrong}>{children}</strong>,
                  em: ({ children }) => <em style={styles.mdEm}>{children}</em>,
                  code: ({ inline, children }) =>
                    inline ? (
                      <code style={styles.inlineCode}>{children}</code>
                    ) : (
                      <pre style={styles.codeBlock}>
                        <code>{children}</code>
                      </pre>
                    ),
                  ul: ({ children }) => <ul style={styles.mdUl}>{children}</ul>,
                  li: ({ children }) => <li style={styles.mdLi}>{children}</li>,
                  h3: ({ children }) => <h3 style={styles.mdH3}>{children}</h3>,
                  hr: () => <hr style={styles.mdHr} />,
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>
          )}
        </div>
      </div>

      {isUser && (
        <div style={{ ...styles.avatar, background: "var(--bg-hover)", borderColor: "var(--border-bright)" }}>
          <User size={16} color="var(--text-secondary)" />
        </div>
      )}
    </div>
  );
}

const styles = {
  wrapper: {
    display: "flex",
    alignItems: "flex-end",
    gap: 10,
    padding: "4px 0",
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: "var(--radius)",
    background: "var(--accent-glow)",
    border: "1px solid rgba(0,212,170,0.25)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  toolBadges: {
    display: "flex",
    gap: 6,
    flexWrap: "wrap",
    paddingLeft: 2,
  },
  toolBadge: {
    display: "flex",
    alignItems: "center",
    gap: 4,
    padding: "2px 8px",
    borderRadius: 99,
    border: "1px solid",
    fontSize: 11,
    fontFamily: "var(--font-mono)",
    fontWeight: 500,
  },
  bubble: {
    padding: "12px 16px",
    borderRadius: "var(--radius-lg)",
    lineHeight: 1.65,
  },
  userText: {
    color: "var(--text-primary)",
    fontSize: 14,
    margin: 0,
  },
  mdWrapper: {
    color: "var(--text-primary)",
    fontSize: 14,
  },
  mdP: { margin: "0 0 8px 0", lineHeight: 1.65 },
  mdStrong: { color: "var(--accent)", fontWeight: 600 },
  mdEm: { color: "var(--text-secondary)", fontStyle: "italic" },
  inlineCode: {
    background: "var(--bg-surface)",
    border: "1px solid var(--border)",
    borderRadius: 4,
    padding: "1px 5px",
    fontFamily: "var(--font-mono)",
    fontSize: 12,
    color: "var(--accent)",
  },
  codeBlock: {
    background: "var(--bg-void)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius)",
    padding: "12px",
    fontFamily: "var(--font-mono)",
    fontSize: 12,
    overflow: "auto",
    margin: "8px 0",
  },
  mdUl: { paddingLeft: 20, margin: "6px 0" },
  mdLi: { margin: "4px 0", lineHeight: 1.6 },
  mdH3: {
    color: "var(--accent)",
    fontFamily: "var(--font-display)",
    fontWeight: 600,
    fontSize: 14,
    margin: "10px 0 4px",
  },
  mdHr: { border: "none", borderTop: "1px solid var(--border)", margin: "10px 0" },
};