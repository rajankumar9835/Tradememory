import React, { useState, useEffect, useRef, createContext, useContext } from "react";
import { SignedIn, SignedOut } from "@clerk/clerk-react";
import Header from "./components/Header";
import StatsBar from "./components/StatsBar";
import MessageBubble from "./components/MessageBubble";
import ChatInput from "./components/ChatInput";
import QuickActions from "./components/QuickActions";
import Sidebar from "./components/Sidebar.jsx";
import TypingIndicator from "./components/TypingIndicator";
import LandingPage from "./components/LandingPage";
import useChat from "./hooks/useChat";

// Theme context — used by Header, Sidebar, everywhere
export const ThemeContext = createContext({ theme: "dark", toggleTheme: () => {} });
export const useTheme = () => useContext(ThemeContext);

function Dashboard() {
  const { messages, sendMessage, isLoading, stats, refreshStats } = useChat();
  const { theme } = useTheme();
  const scrollRef = useRef(null);
  const [quickPrompt, setQuickPrompt] = useState("");
  const [promptKey, setPromptKey] = useState(0);
  const isDark = theme === "dark";

  useEffect(() => {
    if (scrollRef.current)
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isLoading]);

  useEffect(() => { refreshStats?.(); }, []);

  const handleQuickAction = (text) => {
    setQuickPrompt(text);
    setPromptKey(k => k + 1);
    sendMessage(text);
  };

  return (
    <div style={{
      display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden",
      background: isDark ? "#0f1117" : "#f8fafc",
      color: isDark ? "#f1f5f9" : "#0f172a",
      fontFamily: "'DM Sans', sans-serif",
      transition: "background 0.25s, color 0.25s",
    }}>
      <Header />
      <StatsBar stats={stats} />

      {/* ✅ FIXED: flex row so Sidebar sits beside main */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>

        {/* ✅ Sidebar rendered here — this was missing */}
        <Sidebar />

        <main style={{
          flex: 1, display: "flex", flexDirection: "column", overflow: "hidden",
        }}>
          <div ref={scrollRef} style={{
            flex: 1, overflowY: "auto", padding: "20px 28px",
            display: "flex", flexDirection: "column", gap: 14,
          }}>
            {messages.length === 0 && (
              <div style={{
                flex: 1, display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center",
                textAlign: "center", opacity: 0.4, gap: 14,
              }}>
                <div style={{ padding: 20, borderRadius: "50%", background: "rgba(59,130,246,0.08)" }}>
                  <span style={{ fontSize: 40 }}>📉</span>
                </div>
                <div>
                  <h2 style={{ fontSize: 20, fontWeight: 700, margin: "0 0 6px" }}>TradeMemory Terminal</h2>
                  <p style={{ fontSize: 13, color: isDark ? "#64748b" : "#94a3b8", margin: 0 }}>
                    Log your trades, ask for hindsight, or analyze patterns.
                  </p>
                </div>
              </div>
            )}
            {messages.map((msg, index) => <MessageBubble key={index} message={msg} />)}
            {isLoading && <TypingIndicator />}
          </div>

          <div style={{
            borderTop: isDark ? "1px solid #1e293b" : "1px solid #e2e8f0",
            background: isDark ? "#0c1118" : "#ffffff",
            padding: "12px 20px 10px",
            transition: "background 0.25s",
          }}>
            {messages.length < 2 && <QuickActions onAction={handleQuickAction} />}
            <ChatInput key={promptKey} onSend={sendMessage} disabled={isLoading} initialValue={quickPrompt} />
            <p style={{
              textAlign: "center", fontSize: 10, margin: "6px 0 2px",
              color: isDark ? "#1e293b" : "#cbd5e1",
              textTransform: "uppercase", letterSpacing: "1px",
            }}>
              Powered by Groq LLM & Hindsight Vector Memory
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem("tm-theme") || "dark");

  const toggleTheme = () => {
    setTheme(prev => {
      const next = prev === "dark" ? "light" : "dark";
      localStorage.setItem("tm-theme", next);
      return next;
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <SignedOut><LandingPage /></SignedOut>
      <SignedIn><Dashboard /></SignedIn>
    </ThemeContext.Provider>
  );
}