// components/ChatInput.jsx
import React, { useState, useRef, useEffect } from "react";
import { Send, Mic } from "lucide-react";

export default function ChatInput({ onSend, isLoading, initialValue = "" }) {
  const [value, setValue] = useState("");
  const textareaRef = useRef(null);

  // Fill with quick action prompt
  useEffect(() => {
    if (initialValue) {
      setValue(initialValue);
      textareaRef.current?.focus();
    }
  }, [initialValue]);

  const handleSend = () => {
    if (!value.trim() || isLoading) return;
    onSend(value.trim());
    setValue("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = (e) => {
    setValue(e.target.value);
    const ta = textareaRef.current;
    if (ta) {
      ta.style.height = "auto";
      ta.style.height = Math.min(ta.scrollHeight, 160) + "px";
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.inputRow}>
        <div style={styles.inputWrap}>
          <textarea
            ref={textareaRef}
            value={value}
            onChange={handleInput}
            onKeyDown={handleKey}
            placeholder="Log a trade, recall patterns, store a lesson..."
            disabled={isLoading}
            rows={1}
            style={styles.textarea}
          />
        </div>
        <button
          onClick={handleSend}
          disabled={!value.trim() || isLoading}
          style={{
            ...styles.sendBtn,
            background: value.trim() && !isLoading ? "var(--accent)" : "var(--bg-hover)",
            color: value.trim() && !isLoading ? "#080b0f" : "var(--text-muted)",
            cursor: value.trim() && !isLoading ? "pointer" : "default",
          }}
        >
          <Send size={16} />
        </button>
      </div>
      <div style={styles.hint}>
        Press <kbd style={styles.kbd}>Enter</kbd> to send · <kbd style={styles.kbd}>Shift+Enter</kbd> for newline
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: "16px 24px 20px",
    background: "var(--bg-deep)",
    borderTop: "1px solid var(--border)",
  },
  inputRow: {
    display: "flex",
    gap: 10,
    alignItems: "flex-end",
  },
  inputWrap: {
    flex: 1,
    background: "var(--bg-surface)",
    border: "1px solid var(--border-bright)",
    borderRadius: "var(--radius-lg)",
    transition: "border-color 0.15s ease",
    overflow: "hidden",
  },
  textarea: {
    width: "100%",
    background: "transparent",
    border: "none",
    color: "var(--text-primary)",
    fontSize: 14,
    padding: "12px 16px",
    resize: "none",
    lineHeight: 1.6,
    fontFamily: "var(--font-body)",
    display: "block",
    minHeight: 46,
    maxHeight: 160,
  },
  sendBtn: {
    width: 46,
    height: 46,
    borderRadius: "var(--radius-lg)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "none",
    transition: "all 0.15s ease",
    flexShrink: 0,
  },
  hint: {
    marginTop: 8,
    fontSize: 11,
    color: "var(--text-muted)",
    textAlign: "center",
  },
  kbd: {
    background: "var(--bg-raised)",
    border: "1px solid var(--border-bright)",
    borderRadius: 3,
    padding: "1px 5px",
    fontFamily: "var(--font-mono)",
    fontSize: 10,
  },
};