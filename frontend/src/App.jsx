import React, { useState, useEffect, useRef } from "react";
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

// ── Authenticated Dashboard (your original App content, untouched) ────────────
function Dashboard() {
  const { messages, sendMessage, isLoading, stats, refreshStats } = useChat();
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  useEffect(() => {
    refreshStats();
  }, []);

  const handleQuickAction = (text) => {
    sendMessage(text);
  };

  return (
    <div className="flex flex-col h-screen bg-[#0f1117] text-gray-100 font-sans">
      {/* Top Navigation */}
      <Header />

      {/* Real-time Memory Stats */}
      <StatsBar stats={stats} />

      {/* Main Chat Area */}
      <main className="flex-1 overflow-hidden flex flex-col max-w-5xl w-full mx-auto px-4 py-4">
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-thin scrollbar-thumb-gray-700"
        >
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-50 space-y-4">
              <div className="p-4 rounded-full bg-blue-500/10">
                <span className="text-4xl">📉</span>
              </div>
              <div>
                <h2 className="text-xl font-semibold">TradeMemory Terminal</h2>
                <p className="text-sm">Log your trades, ask for hindsight, or analyze patterns.</p>
              </div>
            </div>
          )}

          {messages.map((msg, index) => (
            <MessageBubble key={index} message={msg} />
          ))}

          {isLoading && <TypingIndicator />}
        </div>

        {/* Interaction Layer */}
        <div className="mt-4 space-y-4">
          {messages.length < 2 && (
            <QuickActions onAction={handleQuickAction} />
          )}

          <ChatInput
            onSend={sendMessage}
            disabled={isLoading}
          />

          <p className="text-[10px] text-center text-gray-500 uppercase tracking-widest">
            Powered by Groq LLM & Hindsight Vector Memory
          </p>
        </div>
      </main>
    </div>
  );
}

// ── Root — Clerk switches between Landing and Dashboard ──────────────────────
export default function App() {
  return (
    <>
      {/* Unauthenticated users see the landing page */}
      <SignedOut>
        <LandingPage />
      </SignedOut>

      {/* Authenticated users get the full dashboard */}
      <SignedIn>
        <Dashboard />
      </SignedIn>
    </>
  );
}