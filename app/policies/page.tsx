"use client";
import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";

type Policy = {
  id: number;
  title: string;
  content: string;
  createdAt: string;
};

export default function PoliciesPage() {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [selected, setSelected] = useState<Policy | null>(null);
  const [editing, setEditing] = useState(false);
  const [editContent, setEditContent] = useState("");

  const loadPolicies = () => {
    fetch("/api/policies")
      .then((res) => res.json())
      .then((data) => {
        setPolicies(data.policies);
        if (data.policies.length > 0 && !selected) {
          setSelected(data.policies[0]);
          setEditContent(data.policies[0].content);
        }
      });
  };

  useEffect(() => {
    loadPolicies();
  }, []);

  const handleSave = async () => {
    if (!selected) return;
    await fetch(`/api/policies/${selected.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: editContent }),
    });
    setSelected({ ...selected, content: editContent });
    setEditing(false);
    loadPolicies();
  };

  const handleDelete = async (id: number) => {
    await fetch(`/api/policies/${id}`, { method: "DELETE" });
    setSelected(null);
    loadPolicies();
  };

  return (
    <main className="h-screen flex bg-background overflow-hidden">

      {/* Sidebar */}
      <div className="w-64 border-r border-primary/10 flex flex-col p-4 space-y-4 shrink-0">
        <div className="flex items-center justify-between px-2">
          <h1 className="text-xl font-bold text-primary">Policies</h1>
          <button
            onClick={() => window.location.href = "/chat"}
            className="text-xs text-muted hover:text-primary transition-colors">
            ← Chat
          </button>
        </div>
        <div className="space-y-1 flex-1 overflow-y-auto">
          {policies.length === 0 ? (
            <p className="text-xs text-muted px-2">No policies yet. Ask the chatbot to generate one!</p>
          ) : (
            policies.map((p) => (
              <div
                key={p.id}
                onClick={() => { setSelected(p); setEditContent(p.content); setEditing(false); }}
                className={`rounded-xl px-3 py-2 text-sm cursor-pointer flex items-center justify-between group transition-colors ${
                  selected?.id === p.id ? "bg-surface text-primary" : "text-muted hover:bg-surface hover:text-primary"
                }`}>
                <span className="truncate">{p.title}</span>
                <button
                  onClick={(e) => { e.stopPropagation(); handleDelete(p.id); }}
                  className="opacity-0 group-hover:opacity-100 text-muted hover:text-primary transition-all text-xs ml-2 shrink-0">
                  X
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0">
        {selected ? (
          <>
            {/* Header */}
            <div className="border-b border-primary/10 px-6 py-4 shrink-0 flex items-center justify-between">
              <h2 className="text-sm font-medium text-primary">{selected.title}</h2>
              <div className="flex gap-2">
                {editing ? (
                  <>
                    <button
                      onClick={() => setEditing(false)}
                      className="text-xs text-muted hover:text-primary transition-colors px-3 py-1.5 rounded-lg border border-primary/10">
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      className="text-xs bg-primary text-background font-semibold px-3 py-1.5 rounded-lg hover:scale-105 transition-all">
                      Save
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setEditing(true)}
                    className="text-xs text-muted hover:text-primary transition-colors px-3 py-1.5 rounded-lg border border-primary/10">
                     Edit
                  </button>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-8 py-6">
              {editing ? (
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full h-full min-h-[500px] bg-transparent text-primary outline-none resize-none text-sm leading-relaxed font-mono border border-primary/10 rounded-xl p-4"
                />
              ) : (
                <div className="max-w-3xl mx-auto prose prose-invert text-primary">
                  <ReactMarkdown
                    components={{
                      h1: ({children}) => <h1 className="text-2xl font-bold text-primary mb-4">{children}</h1>,
                      h2: ({children}) => <h2 className="text-xl font-bold text-primary mb-3 mt-6">{children}</h2>,
                      h3: ({children}) => <h3 className="text-lg font-semibold text-primary mb-2 mt-4">{children}</h3>,
                      strong: ({children}) => <strong className="font-semibold text-primary">{children}</strong>,
                      ul: ({children}) => <ul className="list-disc list-inside space-y-2 my-3 text-primary">{children}</ul>,
                      ol: ({children}) => <ol className="list-decimal list-inside space-y-2 my-3 text-primary">{children}</ol>,
                      li: ({children}) => <li className="text-sm text-primary">{children}</li>,
                      p: ({children}) => <p className="mb-3 text-primary leading-relaxed">{children}</p>,
                    }}>
                    {selected.content}
                  </ReactMarkdown>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center space-y-2">
              <p className="text-muted text-sm">No policy selected</p>
              <p className="text-muted text-xs">Ask the chatbot to generate a policy for your company</p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}