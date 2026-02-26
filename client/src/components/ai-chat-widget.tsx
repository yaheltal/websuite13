import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Bot, User, Copy, Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/queryClient";

interface ChatMessage {
  role: "user" | "bot";
  content: string;
}

function formatMessage(text: string) {
  const parts = text.split(/(```[\s\S]*?```)/g);
  return parts.map((part, i) => {
    if (part.startsWith("```") && part.endsWith("```")) {
      const lines = part.slice(3, -3).split("\n");
      const lang = lines[0]?.trim();
      const code = lang ? lines.slice(1).join("\n") : lines.join("\n");
      return <CodeBlock key={i} code={code} label={lang} />;
    }

    const formatted = part
      .split("\n")
      .map((line, j) => {
        const segments: Array<{ text: string; bold: boolean }> = [];
        let lastIndex = 0;
        const boldRegex = /\*\*(.*?)\*\*/g;
        let match;
        while ((match = boldRegex.exec(line)) !== null) {
          if (match.index > lastIndex) {
            segments.push({ text: line.slice(lastIndex, match.index), bold: false });
          }
          segments.push({ text: match[1], bold: true });
          lastIndex = match.index + match[0].length;
        }
        if (lastIndex < line.length) {
          segments.push({ text: line.slice(lastIndex), bold: false });
        }
        if (segments.length === 0) {
          segments.push({ text: line, bold: false });
        }
        return (
          <span key={j}>
            {j > 0 && <br />}
            {segments.map((seg, k) =>
              seg.bold ? <strong key={k}>{seg.text}</strong> : <span key={k}>{seg.text}</span>
            )}
          </span>
        );
      });
    return <span key={i}>{formatted}</span>;
  });
}

function CodeBlock({ code, label }: { code: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-3 rounded-xl overflow-hidden border border-border/60 bg-foreground/5">
      <div className="flex items-center justify-between px-3 py-2 bg-foreground/10 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <Sparkles className="w-3 h-3 text-copper" />
          {label || "prompt"}
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 hover:text-foreground transition-colors"
          data-testid="button-copy-prompt"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? "הועתק!" : "העתק"}
        </button>
      </div>
      <pre className="p-3 text-xs leading-relaxed overflow-x-auto whitespace-pre-wrap text-foreground/90 font-mono" dir="ltr">
        {code}
      </pre>
    </div>
  );
}

export function AiChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [hasGreeted, setHasGreeted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && !hasGreeted) {
      sendInitialGreeting();
    }
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const sendInitialGreeting = async () => {
    setIsLoading(true);
    setHasGreeted(true);
    try {
      const response = await apiRequest("POST", "/api/chat", {
        message: "שלום, אני מתעניין בבניית אתר",
        sessionId: null,
      });
      const data = await response.json();
      setSessionId(data.sessionId);
      setMessages([
        { role: "user", content: "שלום, אני מתעניין בבניית אתר" },
        { role: "bot", content: data.reply },
      ]);
    } catch {
      setMessages([
        {
          role: "bot",
          content: "שלום! 👋 אני הסוכן AI של WebCraft Studio. ספר לי על העסק שלך ואני אעזור לך להגדיר את האתר המושלם!",
        },
      ]);
    }
    setIsLoading(false);
  };

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    const userMsg: ChatMessage = { role: "user", content: trimmed };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await apiRequest("POST", "/api/chat", {
        message: trimmed,
        sessionId,
      });
      const data = await response.json();
      if (!sessionId) setSessionId(data.sessionId);
      setMessages((prev) => [...prev, { role: "bot", content: data.reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "bot", content: "מצטער, נתקלתי בשגיאה. אנא נסה שוב." },
      ]);
    }
    setIsLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 350 }}
            className="fixed bottom-24 left-4 sm:left-6 z-50 w-[calc(100vw-2rem)] sm:w-[400px] h-[520px] flex flex-col rounded-2xl overflow-hidden border border-border/60 shadow-2xl bg-card"
            data-testid="chat-window"
          >
            <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-l from-copper to-copper-dark text-white">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm leading-tight">סוכן AI — WebCraft</h3>
                  <span className="text-[11px] text-white/70">מומחה לבניית אתרים</span>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center hover:bg-white/25 transition-colors"
                data-testid="button-close-chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 scroll-smooth" dir="rtl">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className={`flex gap-2 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                >
                  <div
                    className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center mt-1 ${
                      msg.role === "user"
                        ? "bg-copper/15 text-copper"
                        : "bg-sage/30 text-foreground/70"
                    }`}
                  >
                    {msg.role === "user" ? (
                      <User className="w-3.5 h-3.5" />
                    ) : (
                      <Bot className="w-3.5 h-3.5" />
                    )}
                  </div>
                  <div
                    className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-copper text-white rounded-tr-md"
                        : "bg-muted/60 text-foreground rounded-tl-md"
                    }`}
                    data-testid={`chat-message-${msg.role}-${i}`}
                  >
                    {msg.role === "bot" ? formatMessage(msg.content) : msg.content}
                  </div>
                </motion.div>
              ))}

              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-2"
                >
                  <div className="w-7 h-7 rounded-full bg-sage/30 flex items-center justify-center">
                    <Bot className="w-3.5 h-3.5 text-foreground/70" />
                  </div>
                  <div className="bg-muted/60 rounded-2xl rounded-tl-md px-4 py-3">
                    <div className="flex gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-foreground/30 animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-2 h-2 rounded-full bg-foreground/30 animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-2 h-2 rounded-full bg-foreground/30 animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="px-3 py-3 border-t border-border/40 bg-card" dir="rtl">
              <div className="flex gap-2 items-center">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="כתוב הודעה..."
                  disabled={isLoading}
                  className="flex-1 bg-muted/40 border border-border/40 rounded-xl px-3.5 py-2.5 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-copper/30 focus:border-copper/40 transition-all disabled:opacity-50"
                  data-testid="input-chat-message"
                />
                <Button
                  onClick={sendMessage}
                  disabled={!input.trim() || isLoading}
                  size="icon"
                  className="rounded-xl bg-copper hover:bg-copper-dark text-white h-10 w-10 flex-shrink-0"
                  data-testid="button-send-message"
                >
                  <Send className="w-4 h-4 rotate-180" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-24 left-4 sm:left-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-copper to-copper-dark text-white shadow-lg flex items-center justify-center hover:shadow-xl transition-shadow"
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        animate={isOpen ? { opacity: 0, scale: 0, pointerEvents: "none" as any } : { opacity: 1, scale: 1 }}
        data-testid="button-open-chat"
      >
        <MessageCircle className="w-6 h-6" />
        {!hasGreeted && (
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 border-2 border-background animate-pulse" />
        )}
      </motion.button>
    </>
  );
}
