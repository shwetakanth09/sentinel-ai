"use client";

import * as React from "react";
import { Bot, Send, Sparkles, ShieldAlert, User } from "lucide-react";
import { answerQuery, SUGGESTED_QUESTIONS } from "@/lib/ai-assistant";
import type { ChatMessage } from "@/types";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { formatTime } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/toast";

export function AssistantPage() {
  const [messages, setMessages] = React.useState<ChatMessage[]>([]);
  const [input, setInput] = React.useState("");
  const [thinking, setThinking] = React.useState(false);
  const { toast } = useToast();

  const ask = (question: string) => {
    const userMsg: ChatMessage = {
      id: `U-${Date.now()}`,
      role: "user",
      content: question,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setThinking(true);

    window.setTimeout(() => {
      const answer = answerQuery(question);
      setMessages((prev) => [...prev, answer]);
      setThinking(false);
    }, 700);
  };

  const clearChat = () => setMessages([]);

  return (
    <div className="animate-fade-in">
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-lg font-bold text-foreground">
            <Sparkles className="h-5 w-5 text-accent" />
            Intelligence Assistant
          </h1>
          <p className="text-xs text-muted">
            Grounded Q&A over the CASE-2026-014 knowledge graph · answers only from synthetic data
          </p>
        </div>
        {messages.length > 0 && (
          <Button variant="outline" size="sm" onClick={clearChat}>
            Clear
          </Button>
        )}
      </div>

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 flex h-[560px] flex-col overflow-hidden rounded-lg border border-border bg-surface lg:col-span-8">
          <div className="flex items-center gap-2 border-b border-border bg-card px-4 py-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-accent/15 text-accent">
              <Bot className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-foreground">SENTINEL AI Copilot</p>
              <p className="text-[10px] text-green">Online · synthetic dataset · no external APIs</p>
            </div>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto p-4">
            {messages.length === 0 && (
              <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-accent">
                  <ShieldAlert className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    Ask about the investigation
                  </p>
                  <p className="mx-auto mt-1 max-w-sm text-xs leading-relaxed text-muted">
                    I analyze the synthetic knowledge graph for CASE-2026-014 and provide
                    evidence-backed, explainable answers.
                  </p>
                </div>
              </div>
            )}

            {messages.map((m) => (
              <MessageBubble key={m.id} message={m} />
            ))}

            {thinking && (
              <div className="flex items-start gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-accent/15 text-accent">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2.5">
                  <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-accent" />
                  <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-accent [animation-delay:0.2s]" />
                  <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-accent [animation-delay:0.4s]" />
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-border bg-card p-3">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (input.trim()) ask(input.trim());
              }}
              className="flex items-center gap-2"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about entities, patterns, timelines, clusters..."
                className="h-9 flex-1 rounded-md border border-border bg-surface px-3 text-xs text-foreground placeholder:text-muted-light focus:outline-none focus:ring-1 focus:ring-accent/50"
              />
              <Button type="submit" size="icon" disabled={!input.trim() || thinking}>
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-4">
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted">
              Suggested Questions
            </p>
            <div className="space-y-1.5">
              {SUGGESTED_QUESTIONS.map((q) => (
                <button
                  key={q}
                  onClick={() => ask(q)}
                  disabled={thinking}
                  className="w-full rounded-md border border-border bg-card-alt px-3 py-2 text-left text-xs text-muted transition-colors hover:border-accent/30 hover:text-foreground cursor-pointer disabled:opacity-50"
                >
                  {q}
                </button>
              ))}
            </div>
            <p className="mt-3 text-[10px] leading-snug text-muted-light">
              The assistant does not invent evidence. Answers are generated deterministically from
              the synthetic dataset present in this application.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";
  if (isUser) {
    return (
      <div className="flex justify-end">
        <div className="max-w-[85%] rounded-lg rounded-br-none border border-accent/30 bg-accent/10 px-3.5 py-2.5">
          <p className="whitespace-pre-wrap text-xs leading-relaxed text-foreground">
            {message.content}
          </p>
          <p className="mt-1 text-right text-[9px] text-muted">{formatTime(message.timestamp)}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-2">
      <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent">
        <Bot className="h-4 w-4" />
      </div>
      <div className="max-w-[85%] space-y-2 rounded-lg rounded-bl-none border border-border bg-card px-3.5 py-2.5">
        <p className="whitespace-pre-wrap text-xs leading-relaxed text-foreground">
          {message.content}
        </p>

        {message.evidence && message.evidence.length > 0 && (
          <div className="rounded-md border border-border bg-card-alt p-2.5">
            <p className="mb-1 text-[9px] font-semibold uppercase tracking-wider text-muted">
              Evidence
            </p>
            <ul className="space-y-1">
              {message.evidence.slice(0, 4).map((ev, i) => (
                <li key={i} className="flex items-start gap-1.5 text-[10px] text-muted">
                  <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-accent" />
                  {ev}
                </li>
              ))}
            </ul>
          </div>
        )}

        {typeof message.confidence === "number" && (
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-muted">Confidence</span>
            <Progress value={message.confidence * 100} className="h-1 w-20" />
            <span className="text-[10px] tabular-nums text-muted">
              {Math.round(message.confidence * 100)}%
            </span>
          </div>
        )}

        <p className="text-[9px] text-muted-light">
          AI-generated investigative lead · requires independent verification
        </p>
      </div>
    </div>
  );
}

function MessageAvatar() {
  return <User className="h-3.5 w-3.5" />;
}