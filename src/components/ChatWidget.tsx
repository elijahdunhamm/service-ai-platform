import { useState } from "react";
import {
  MessageCircle,
  X,
  Send,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import type { IndustryConfig, Faq } from "../config/types";

interface ChatMessage {
  from: "bot" | "user";
  text: string;
}

/**
 * Lightweight floating customer-support chat widget.
 * Sits fixed to the bottom-right corner; a click toggles a drawer that answers
 * FAQs from a simple, rule-based keyword match against the preset's chat.faqs.
 * Fully config-driven — no FAQ content is hardcoded here.
 */
export default function ChatWidget({ config }: { config: IndustryConfig }) {
  const chat = config.chat;
  const t = config.theme;
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { from: "bot", text: chat.greeting },
  ]);
  const [input, setInput] = useState("");

  // THEME-DRIVEN widget colors. Every value is read from config.theme with the
  // original shared "royal blue + gold" look as the default, so tenants that
  // don't override these (cleaning / hvac / detailing) keep the exact current
  // appearance. A tenant adds its own palette by setting these fields in its
  // preset's `theme` — no tenant color is hardcoded here, only the fallback.
  const chatGradient =
    t.chatGradient ?? "linear-gradient(135deg, #1E3A8A, #16295F)";
  const chatAccentBg = t.chatAccentBg ?? "bg-royal";
  const chatSoftBg = t.chatSoftBg ?? "bg-gold";
  const chatSoftText = t.chatSoftText ?? "text-gold";
  const chatFaqHover = t.chatFaqHover ?? "hover:border-royal hover:text-royal";
  const chatInputFocus = t.chatInputFocus ?? "focus:border-royal";

  const faqAnswer = (text: string): Faq | undefined => {
    const lower = text.toLowerCase();
    // Score each FAQ by how many of its question keywords appear in the input.
    let best: Faq | undefined;
    let bestScore = 0;
    for (const faq of chat.faqs) {
      const words = faq.question
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, "")
        .split(/\s+/)
        .filter((w) => w.length > 3);
      let score = 0;
      for (const w of words) {
        if (lower.includes(w)) score += 1;
      }
      if (score > bestScore) {
        bestScore = score;
        best = faq;
      }
    }
    return bestScore > 0 ? best : undefined;
  };

  const send = (raw: string) => {
    const text = raw.trim();
    if (!text) return;
    setMessages((prev) => [...prev, { from: "user", text }]);
    setInput("");
    const answer = faqAnswer(text);
    const reply = answer
      ? answer.answer
      : "Thanks for reaching out! For quick help, choose one of the questions below — or use our booking tool on the main page for specific dates and times.";
    window.setTimeout(() => {
      setMessages((prev) => [...prev, { from: "bot", text: reply }]);
    }, 350);
  };

  const ask = (question: string) => {
    setMessages((prev) => [...prev, { from: "user", text: question }]);
    const answer = chat.faqs.find((f) => f.question === question);
    if (answer) {
      window.setTimeout(() => {
        setMessages((prev) => [...prev, { from: "bot", text: answer.answer }]);
      }, 350);
    }
  };

  return (
    <>
      {/* Floating launcher button (bottom-right) */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close chat" : "Open support chat"}
        className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full shadow-xl ring-2 ring-white/40 transition-transform hover:scale-105"
        style={{
          background: chatGradient,
        }}
      >
        {open ? (
          <X className="h-6 w-6 text-white" />
        ) : (
          <>
            <MessageCircle className="h-6 w-6 text-white" />
            <span className="absolute -right-0.5 -top-0.5 flex h-3.5 w-3.5">
              <span
                className={`absolute inline-flex h-full w-full animate-ping rounded-full ${chatSoftBg} opacity-75`}
              />
              <span
                className={`relative inline-flex h-3.5 w-3.5 rounded-full ${chatSoftBg}`}
              />
            </span>
          </>
        )}
      </button>

      {/* Chat drawer */}
      {open && (
        <div className="fixed bottom-24 right-5 z-50 flex max-h-[70vh] w-[calc(100vw-2.5rem)] max-w-sm flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
          {/* Header */}
          <div
            className="flex items-center gap-2 px-4 py-3 text-white"
            style={{
              background: chatGradient,
            }}
          >
            <Sparkles className={`h-5 w-5 ${chatSoftText}`} />
            <span className="font-bold">{chat.title}</span>
          </div>

          {/* Messages */}
          <div className="flex-1 space-y-2 overflow-y-auto bg-slate-50 p-3">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                  m.from === "bot"
                    ? `rounded-tl-sm ${t.primaryLightBg} text-slate-800`
                    : `ml-auto rounded-tr-sm ${chatAccentBg} text-white`
                }`}
              >
                {m.text}
              </div>
            ))}
          </div>

          {/* Quick FAQ chips */}
          <div className="flex flex-wrap gap-1.5 border-t border-slate-100 bg-white px-3 py-2">
            {chat.faqs.map((faq) => (
              <button
                key={faq.question}
                type="button"
                onClick={() => ask(faq.question)}
                className={`inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-600 transition-colors ${chatFaqHover}`}
              >
                {faq.question}
                <ChevronRight className="h-3 w-3" />
              </button>
            ))}
          </div>

          {/* Input */}
          <form
            className="flex items-center gap-2 border-t border-slate-100 bg-white p-2"
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={chat.placeholder}
              className={`w-full rounded-full border border-slate-200 px-3 py-2 text-sm outline-none ${chatInputFocus}`}
            />
            <button
              type="submit"
              aria-label="Send message"
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${chatAccentBg} text-white transition-transform hover:scale-105`}
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
