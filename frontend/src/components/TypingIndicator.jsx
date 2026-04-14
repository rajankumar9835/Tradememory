// components/TypingIndicator.jsx
import React from "react";
import { Brain } from "lucide-react";

export default function TypingIndicator({ toolsInProgress }) {
  return (
    <div style={styles.wrapper}>
      <div style={styles.avatar}>
        <Brain size={16} color="#00d4aa" />
      </div>
      <div style={styles.bubble}>
        <div style={styles.dots}>
          <span style={{ ...styles.dot, animationDelay: "0ms" }} />
          <span style={{ ...styles.dot, animationDelay: "150ms" }} />
          <span style={{ ...styles.dot, animationDelay: "300ms" }} />
        </div>
        <span style={styles.label}>
          {toolsInProgress ? "Accessing Hindsight memory..." : "Thinking..."}
        </span>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    display: "flex",
    alignItems: "flex-end",
    gap: 10,
    padding: "4px 0",
    animation: "fadeIn 0.2s ease forwards",
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
  bubble: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    background: "var(--bg-raised)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-lg)",
    padding: "10px 16px",
  },
  dots: {
    display: "flex",
    gap: 4,
    alignItems: "center",
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: "50%",
    background: "var(--accent)",
    display: "inline-block",
    animation: "dot-bounce 1.2s ease infinite",
  },
  label: {
    fontSize: 12,
    color: "var(--text-muted)",
    fontFamily: "var(--font-mono)",
  },
};