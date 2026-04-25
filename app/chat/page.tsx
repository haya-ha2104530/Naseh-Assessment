"use client";
import { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const welcomeMessage: Message = {
    role: "assistant",
    content: "Hi! I'm Naseh, your company policy assistant. Ask me anything about your company or ask me to generate a policy!",
  };

  const loadMessages = () => {
    fetch("/api/chat")
      .then((res) => res.json())
      .then((data) => {
        if (data.messages.length === 0) {
          setMessages([welcomeMessage]);
        } else {
          setMessages(data.messages);
        }
      });
  };

  useEffect(() => {
    loadMessages();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userMessage = input;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "Sorry, something went wrong. Please try again!" }]);
    }
    setLoading(false);
  };

  const handleNewChat = async () => {
    await fetch("/api/chat", { method: "DELETE" });
    setMessages([welcomeMessage]);
  };

  return (
    <main className="h-screen flex bg-background overflow-hidden">

      {/* Sidebar */}
      <div className="w-64 border-r border-primary/10 flex flex-col p-4 space-y-4 shrink-0">
        <h1 className="text-xl font-bold text-primary px-2">Naseh</h1>
        <div className="space-y-1">
          <p className="text-xs text-muted px-2 uppercase tracking-widest mb-2">Chats</p>
          <div className="bg-surface rounded-xl px-3 py-2 text-sm text-primary cursor-pointer flex items-center justify-between group">
            <span>Company Assessment Chat</span>
            <button
              onClick={handleNewChat}
              className="opacity-0 group-hover:opacity-100 text-muted hover:text-primary transition-all text-xs">
              🗑️
            </button>
          </div>
        </div>
        <button
          onClick={handleNewChat}
          className="w-full text-left px-3 py-2 text-sm text-muted hover:text-primary transition-colors rounded-xl hover:bg-surface border border-primary/10">
          + New Chat
        </button>
        <div className="mt-auto space-y-2">
          <button
            onClick={() => window.location.href = "/assessment"}
            className="w-full text-left px-3 py-2 text-sm text-muted hover:text-primary transition-colors rounded-xl hover:bg-surface">
            ✏️ Edit Assessment
          </button>
          <button
            onClick={async () => {
              await fetch("/api/assessment", { method: "DELETE" });
              window.location.href = "/assessment";
            }}
            className="w-full text-left px-3 py-2 text-sm text-muted hover:text-primary transition-colors rounded-xl hover:bg-surface">
            🗑️ Delete Assessment
          </button>
        </div>
      </div>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Header */}
        <div className="border-b border-primary/10 px-6 py-4 shrink-0">
          <h2 className="text-sm font-medium text-muted">Company Assessment Chat</h2>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="max-w-3xl mx-auto space-y-4">
            {messages.map((m, i) => (
              <div key={i} className={`flex gap-3 ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                {m.role === "assistant" && (
                  <div className="w-8 h-8 rounded-full bg-surface border border-primary/20 flex items-center justify-center text-xs font-bold text-primary shrink-0 mt-1">
                    N
                  </div>
                )}
                <div className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  m.role === "user"
                    ? "bg-primary text-background rounded-br-sm"
                    : "bg-surface text-primary rounded-bl-sm border border-primary/10"
                }`}>
                  {m.role === "assistant" ? (
                    <ReactMarkdown
                      components={{
                        h1: ({children}) => <h1 className="text-lg font-bold mb-2">{children}</h1>,
                        h2: ({children}) => <h2 className="text-base font-bold mb-2">{children}</h2>,
                        h3: ({children}) => <h3 className="text-sm font-bold mb-1">{children}</h3>,
                        strong: ({children}) => <strong className="font-semibold">{children}</strong>,
                        ul: ({children}) => <ul className="list-disc list-inside space-y-1 my-2">{children}</ul>,
                        ol: ({children}) => <ol className="list-decimal list-inside space-y-1 my-2">{children}</ol>,
                        li: ({children}) => <li className="text-sm">{children}</li>,
                        p: ({children}) => <p className="mb-2 last:mb-0">{children}</p>,
                      }}>
                      {m.content}
                    </ReactMarkdown>
                  ) : (
                    m.content
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 rounded-full bg-surface border border-primary/20 flex items-center justify-center text-xs font-bold text-primary shrink-0">
                  N
                </div>
                <div className="bg-surface text-primary rounded-2xl rounded-bl-sm border border-primary/10 px-4 py-3 text-sm">
                  <span className="animate-pulse">Thinking...</span>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        </div>

        {/* Input */}
        <div className="border-t border-primary/10 px-6 py-4 shrink-0">
          <div className="max-w-3xl mx-auto flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask me anything about your company..."
              className="flex-1 rounded-xl px-4 py-3 text-primary outline-none bg-surface border border-primary/10 placeholder:text-muted focus:border-primary/30 transition-all duration-200 text-sm"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || loading}
              className="px-6 py-3 rounded-xl font-semibold bg-primary text-background hover:scale-105 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 text-sm">
              Send
            </button>
          </div>
        </div>

      </div>
    </main>
  );
}