// components/ChatInput.jsx
// Upgraded with:
//   1. 🎙️ Voice-to-text  — Web Speech API (built into browser, no API key needed)
//   2. 📎 File/PDF upload — sends file to /api/parse-file, extracts text, fills textarea
//   3. ➕ Plus button    — opens file picker (images + PDFs + CSVs)

import React, { useState, useRef, useEffect, useCallback } from "react";
import { Send, Mic, MicOff, Paperclip, X, FileText, Image, Loader2 } from "lucide-react";

// ── Supported file types ──────────────────────────────────────────────────────
const ACCEPT = ".pdf,.png,.jpg,.jpeg,.csv,.txt";

// ── File type display config ──────────────────────────────────────────────────
function getFileIcon(file) {
  if (!file) return <FileText size={14} />;
  const t = file.type;
  if (t.startsWith("image/")) return <Image size={14} />;
  return <FileText size={14} />;
}

export default function ChatInput({ onSend, isLoading, disabled, initialValue = "" }) {
  const [value, setValue]           = useState("");
  const [isListening, setIsListening] = useState(false);
  const [voiceError, setVoiceError]   = useState("");
  const [attachedFile, setAttachedFile] = useState(null);   // { name, type, base64, text }
  const [fileLoading, setFileLoading]   = useState(false);
  const [fileError, setFileError]       = useState("");
  const [micSupported, setMicSupported] = useState(true);

  const textareaRef   = useRef(null);
  const fileInputRef  = useRef(null);
  const recognitionRef = useRef(null);

  // ── Fill textarea from quick actions ──────────────────────────────────────
  useEffect(() => {
    if (initialValue) {
      setValue(initialValue);
      textareaRef.current?.focus();
    }
  }, [initialValue]);

  // ── Auto-resize textarea ──────────────────────────────────────────────────
  const resize = () => {
    const ta = textareaRef.current;
    if (ta) {
      ta.style.height = "auto";
      ta.style.height = Math.min(ta.scrollHeight, 160) + "px";
    }
  };

  // ── Check mic support on mount ────────────────────────────────────────────
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) setMicSupported(false);
  }, []);

  // ── Send message ──────────────────────────────────────────────────────────
  const handleSend = useCallback(() => {
    const text = value.trim();
    if ((!text && !attachedFile) || isLoading || disabled) return;

    // If file attached, prefix the message with file context
    let finalMessage = text;
    if (attachedFile) {
      const fileContext = attachedFile.extractedText
        ? `[File: ${attachedFile.name}]\n${attachedFile.extractedText}\n\n${text}`
        : `[File attached: ${attachedFile.name}]\n${text}`;
      finalMessage = fileContext.trim();
    }

    onSend(finalMessage);
    setValue("");
    setAttachedFile(null);
    setFileError("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  }, [value, attachedFile, isLoading, disabled, onSend]);

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleChange = (e) => {
    setValue(e.target.value);
    resize();
  };

  // ── Voice to Text ─────────────────────────────────────────────────────────
  const toggleVoice = useCallback(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setVoiceError("Voice not supported in this browser. Use Chrome.");
      return;
    }

    // If already listening → stop
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    setVoiceError("");
    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;

    recognition.continuous     = true;   // keep listening until stopped
    recognition.interimResults = true;   // show partial results live
    recognition.lang           = "en-IN"; // Indian English — works for trading terms
    recognition.maxAlternatives = 1;

    let finalTranscript = value; // start from current textarea content

    recognition.onstart = () => setIsListening(true);

    recognition.onresult = (event) => {
      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const t = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += (finalTranscript ? " " : "") + t;
        } else {
          interim = t;
        }
      }
      // Show final + interim live in textarea
      setValue(finalTranscript + (interim ? ` ${interim}` : ""));
      resize();
    };

    recognition.onerror = (e) => {
      setIsListening(false);
      if (e.error === "not-allowed") {
        setVoiceError("Microphone access denied. Allow mic in browser settings.");
      } else if (e.error !== "aborted") {
        setVoiceError(`Voice error: ${e.error}`);
      }
    };

    recognition.onend = () => {
      setIsListening(false);
      setValue((prev) => prev.trim()); // clean up trailing space
    };

    recognition.start();
  }, [isListening, value]);

  // ── File Upload ───────────────────────────────────────────────────────────
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!fileInputRef.current) return;
    fileInputRef.current.value = ""; // reset so same file can be re-selected

    if (!file) return;

    const MAX_MB = 10;
    if (file.size > MAX_MB * 1024 * 1024) {
      setFileError(`File too large. Max ${MAX_MB}MB.`);
      return;
    }

    setFileLoading(true);
    setFileError("");

    try {
      // Convert file to base64
      const base64 = await toBase64(file);

      // Send to backend /api/parse-file for text extraction
      const res = await fetch("/api/parse-file", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: file.name,
          type: file.type,
          base64: base64.split(",")[1], // strip data URI prefix
        }),
      });

      let extractedText = "";
      if (res.ok) {
        const data = await res.json();
        extractedText = data.text || "";
      } else {
        // Backend failed — still attach file, just without extracted text
        console.warn("File parse failed, attaching without text extraction");
      }

      setAttachedFile({
        name: file.name,
        type: file.type,
        extractedText,
      });

      // Auto-suggest a prompt based on file type
      if (!value.trim()) {
        if (file.type === "application/pdf" || file.name.endsWith(".pdf")) {
          setValue("Analyze this document and extract any trades or P&L data from it");
        } else if (file.type.startsWith("image/")) {
          setValue("Analyze this chart/screenshot and tell me what you see");
        } else if (file.name.endsWith(".csv")) {
          setValue("Parse this trade history and summarize my performance");
        }
        resize();
      }
    } catch (err) {
      setFileError("Failed to read file. Try again.");
    } finally {
      setFileLoading(false);
    }
  };

  const removeFile = () => {
    setAttachedFile(null);
    setFileError("");
  };

  // ── Helpers ───────────────────────────────────────────────────────────────
  const toBase64 = (file) =>
    new Promise((res, rej) => {
      const reader = new FileReader();
      reader.onload = () => res(reader.result);
      reader.onerror = rej;
      reader.readAsDataURL(file);
    });

  const canSend = (value.trim() || attachedFile) && !isLoading && !disabled && !fileLoading;

  return (
    <div style={styles.container}>

      {/* ── Attached file preview ── */}
      {attachedFile && (
        <div style={styles.filePill}>
          <span style={styles.filePillIcon}>{getFileIcon(attachedFile)}</span>
          <span style={styles.filePillName}>{attachedFile.name}</span>
          {attachedFile.extractedText && (
            <span style={styles.filePillBadge}>
              {attachedFile.extractedText.length} chars extracted
            </span>
          )}
          <button onClick={removeFile} style={styles.filePillRemove} title="Remove file">
            <X size={12} />
          </button>
        </div>
      )}

      {/* ── File error ── */}
      {fileError && (
        <div style={styles.errorBanner}>{fileError}</div>
      )}

      {/* ── Voice error ── */}
      {voiceError && (
        <div style={styles.errorBanner}>{voiceError}</div>
      )}

      {/* ── Main input row ── */}
      <div style={styles.inputRow}>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept={ACCEPT}
          onChange={handleFileChange}
          style={{ display: "none" }}
        />

        {/* ➕ Attach file button */}
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={fileLoading || isLoading}
          title="Attach file — PDF, image, CSV"
          style={{
            ...styles.iconBtn,
            color: attachedFile ? "#00d4aa" : "#64748b",
            borderColor: attachedFile ? "rgba(0,212,170,0.4)" : "#1e293b",
            background: attachedFile ? "rgba(0,212,170,0.08)" : "rgba(255,255,255,0.03)",
          }}
        >
          {fileLoading ? <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} /> : <Paperclip size={16} />}
        </button>

        {/* Textarea */}
        <div
          style={{
            ...styles.inputWrap,
            borderColor: isListening ? "rgba(239,68,68,0.5)" : attachedFile ? "rgba(0,212,170,0.35)" : "#1e293b",
            boxShadow: isListening ? "0 0 0 2px rgba(239,68,68,0.1)" : "none",
          }}
        >
          <textarea
            ref={textareaRef}
            value={value}
            onChange={handleChange}
            onKeyDown={handleKey}
            placeholder={
              isListening
                ? "🎙️ Listening... speak your trade..."
                : attachedFile
                ? "Ask something about this file, or just press Send..."
                : "Log a trade, recall patterns, upload a broker note..."
            }
            disabled={isLoading || disabled}
            rows={1}
            style={{
              ...styles.textarea,
              color: isListening ? "#fca5a5" : "#f1f5f9",
            }}
          />
        </div>

        {/* 🎙️ Mic button */}
        {micSupported && (
          <button
            onClick={toggleVoice}
            disabled={isLoading || disabled}
            title={isListening ? "Stop recording" : "Voice input — speak your trade"}
            style={{
              ...styles.iconBtn,
              color: isListening ? "#ef4444" : "#64748b",
              borderColor: isListening ? "rgba(239,68,68,0.5)" : "#1e293b",
              background: isListening ? "rgba(239,68,68,0.1)" : "rgba(255,255,255,0.03)",
              animation: isListening ? "pulse 1.5s ease infinite" : "none",
            }}
          >
            {isListening ? <MicOff size={16} /> : <Mic size={16} />}
          </button>
        )}

        {/* ✈️ Send button */}
        <button
          onClick={handleSend}
          disabled={!canSend}
          title="Send"
          style={{
            ...styles.sendBtn,
            background: canSend ? "#00d4aa" : "rgba(255,255,255,0.04)",
            color: canSend ? "#0f1117" : "#475569",
            cursor: canSend ? "pointer" : "default",
            boxShadow: canSend ? "0 0 16px rgba(0,212,170,0.3)" : "none",
          }}
        >
          <Send size={16} />
        </button>
      </div>

      {/* ── Hint bar ── */}
      <div style={styles.hintRow}>
        <span>
          {!isListening && (
            <span>PDF · Image · CSV supported</span>
          )}
          
        </span>
        <span style={styles.hintRight}>
          {isListening && (
            <span style={{ color: "#ef4444", display: "flex", alignItems: "center", gap: 4 }}>
              <span style={styles.recDot} /> Recording...
            </span>
          )}
          <kbd style={styles.kbd}>Enter</kbd> send ·{" "}
          <kbd style={styles.kbd}>Shift+Enter</kbd> newline
        </span>
      </div>

      {/* Spin keyframe injected once */}
      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const styles = {
  container: {
    padding: "12px 20px 16px",
    background: "#0f172a",
    borderTop: "1px solid #1e293b",
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },

  // File attachment preview pill
  filePill: {
    display: "inline-flex",
    alignItems: "center",
    gap: 7,
    background: "rgba(0,212,170,0.08)",
    border: "1px solid rgba(0,212,170,0.25)",
    borderRadius: 99,
    padding: "5px 10px 5px 8px",
    fontSize: 12,
    color: "#00d4aa",
    alignSelf: "flex-start",
    maxWidth: "100%",
  },
  filePillIcon: { flexShrink: 0, display: "flex", alignItems: "center" },
  filePillName: {
    fontFamily: "monospace",
    maxWidth: 200,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    color: "#e2e8f0",
  },
  filePillBadge: {
    background: "rgba(0,212,170,0.15)",
    borderRadius: 99,
    padding: "1px 7px",
    fontSize: 10,
    color: "#00d4aa",
    whiteSpace: "nowrap",
  },
  filePillRemove: {
    background: "transparent",
    border: "none",
    cursor: "pointer",
    color: "#64748b",
    display: "flex",
    alignItems: "center",
    padding: 0,
    flexShrink: 0,
  },

  // Error banner
  errorBanner: {
    background: "rgba(239,68,68,0.08)",
    border: "1px solid rgba(239,68,68,0.25)",
    borderRadius: 8,
    padding: "7px 12px",
    fontSize: 12,
    color: "#fca5a5",
  },

  // Main row
  inputRow: {
    display: "flex",
    alignItems: "flex-end",
    gap: 8,
  },

  // Icon buttons (attach + mic)
  iconBtn: {
    width: 40,
    height: 40,
    flexShrink: 0,
    border: "1px solid",
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    transition: "all 0.15s ease",
    background: "transparent",
  },

  // Textarea wrapper
  inputWrap: {
    flex: 1,
    background: "rgba(255,255,255,0.03)",
    border: "1px solid",
    borderRadius: 12,
    overflow: "hidden",
    transition: "border-color 0.15s, box-shadow 0.15s",
  },
  textarea: {
    width: "100%",
    background: "transparent",
    border: "none",
    fontSize: 14,
    padding: "11px 14px",
    resize: "none",
    lineHeight: 1.6,
    fontFamily: "sans-serif",
    display: "block",
    minHeight: 44,
    maxHeight: 160,
    transition: "color 0.2s",
  },

  // Send button
  sendBtn: {
    width: 40,
    height: 40,
    flexShrink: 0,
    border: "none",
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.15s ease",
  },

  // Bottom hint row
  hintRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: 11,
    color: "#334155",
    paddingTop: 2,
  },
  hintRight: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    color: "#334155",
  },
  kbd: {
    background: "#1e293b",
    border: "1px solid #334155",
    borderRadius: 3,
    padding: "1px 5px",
    fontFamily: "monospace",
    fontSize: 10,
    color: "#64748b",
  },

  // Recording dot
  recDot: {
    width: 6,
    height: 6,
    borderRadius: "50%",
    background: "#ef4444",
    display: "inline-block",
    animation: "pulse 1s ease infinite",
  },
};