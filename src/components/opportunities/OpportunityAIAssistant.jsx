import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Send,
  Loader2,
  Sparkles,
  ChevronDown,
  AlertCircle,
  RotateCcw,
} from "lucide-react";
import aiIcon from "../../assets/icono.png";

// ─── Env (for direct fetch — supabase.functions.invoke doesn't support streaming) ──

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
const FUNCTION_URL = `${SUPABASE_URL}/functions/v1/opportunity-ai-chat`;

// ─── Constants ─────────────────────────────────────────────────────────────────

const SUGGESTIONS = [
  "¿Cuáles son los requisitos?",
  "¿Quién puede postular?",
  "¿Cuáles son los beneficios?",
  "¿Cómo puedo aplicar?",
];

const TIMEOUT_MS = 30_000;

// ─── Markdown-lite + URL renderer ─────────────────────────────────────────────

/**
 * inlineFormat
 * Parses a single line of text and renders bold, markdown links, raw URLs,
 * and plain text as React elements.
 */
function inlineFormat(text) {
  if (!text) return null;

  // Regex matches:
  // 1) Markdown link: [Label](url)
  // 2) Raw URL: http://... or https://...
  // 3) Bold: **text**
  const regex =
    /(\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)|https?:\/\/[^\s<)]+|\*\*([^*]+)\*\*)/g;

  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }

    const fullMatch = match[0];

    // Markdown link: [Label](url)
    if (fullMatch.startsWith("[") && match[2] && match[3]) {
      const label = match[2];
      const url = match[3];
      parts.push(
        <a
          key={`link-${match.index}`}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-secondary font-medium underline underline-offset-2 break-all hover:text-secondary/80 transition-colors duration-150"
        >
          {label}
        </a>,
      );
    }
    // Bold: **content**
    else if (fullMatch.startsWith("**") && fullMatch.endsWith("**")) {
      const innerText = fullMatch.slice(2, -2);
      // Recursively format inner text so bold URLs like **https://...** become clickable links!
      parts.push(
        <strong
          key={`strong-${match.index}`}
          className="font-semibold text-white"
        >
          {inlineFormat(innerText)}
        </strong>,
      );
    }
    // Raw URL: https://... or http://...
    else if (
      fullMatch.startsWith("http://") ||
      fullMatch.startsWith("https://")
    ) {
      const cleanUrl = fullMatch.replace(/[.,;:!?)]+$/, "");
      const trailing = fullMatch.slice(cleanUrl.length);

      parts.push(
        <span key={`url-${match.index}`} className="inline">
          <a
            href={cleanUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-secondary font-medium underline underline-offset-2 break-all hover:text-secondary/80 transition-colors duration-150"
          >
            {cleanUrl}
          </a>
          {trailing}
        </span>,
      );
    } else {
      parts.push(fullMatch);
    }

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts;
}

/**
 * renderMarkdown
 * Converts a multi-line assistant response string to a React tree.
 */
function renderMarkdown(text) {
  if (!text) return null;

  const lines = text.split("\n");
  const elements = [];
  let listBuffer = [];
  let key = 0;

  const flushList = () => {
    if (listBuffer.length === 0) return;
    elements.push(
      <ul key={`ul-${key++}`} className="mt-2 mb-1.5 space-y-1 pl-1">
        {listBuffer.map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-gray-200">
            <span className="mt-[7px] w-1.5 h-1.5 rounded-full bg-secondary flex-shrink-0 shadow-[0_0_8px_rgba(77,185,169,0.8)]" />
            <span className="flex-1">{inlineFormat(item)}</span>
          </li>
        ))}
      </ul>,
    );
    listBuffer = [];
  };

  for (const line of lines) {
    const trimmed = line.trim();

    // Bullet or numbered list item
    if (/^[-*•]\s+/.test(trimmed)) {
      listBuffer.push(trimmed.replace(/^[-*•]\s+/, ""));
      continue;
    }
    if (/^\d+\.\s+/.test(trimmed)) {
      listBuffer.push(trimmed.replace(/^\d+\.\s+/, ""));
      continue;
    }

    // Non-list line → flush pending list first
    flushList();

    if (trimmed === "") {
      elements.push(<div key={`gap-${key++}`} className="h-1.5" />);
    } else {
      elements.push(
        <span key={`p-${key++}`} className="block">
          {inlineFormat(trimmed)}
        </span>,
      );
    }
  }

  flushList();
  return elements;
}

// ─── MessageBubble ────────────────────────────────────────────────────────────

function MessageBubble({ message, isStreaming = false }) {
  const isAssistant = message.role === "assistant";
  const isError = message.isError;
  const isEmpty = !message.content && !isError;

  return (
    <motion.div
      className={`flex gap-3 ${isAssistant ? "items-start" : "items-start flex-row-reverse"}`}
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
    >
      {isAssistant && (
        <div
          className={`w-8 h-8 flex items-center justify-center flex-shrink-0 mt-0.5 ${
            isError
              ? "bg-red-950/80 border border-red-800 text-red-400 rounded-xl shadow-md"
              : ""
          }`}
        >
          {isError ? (
            <AlertCircle className="w-4 h-4 text-red-400" />
          ) : (
            <img
              src={aiIcon}
              alt="EDUCITO IA"
              className="w-full h-full object-contain filter drop-shadow-[0_2px_8px_rgba(77,185,169,0.6)]"
            />
          )}
        </div>
      )}

      <div
        className={`max-w-[85%] min-w-0 rounded-2xl px-4 py-3 text-sm leading-relaxed [overflow-wrap:anywhere] [word-break:break-word] break-words ${
          isAssistant
            ? isError
              ? "bg-red-950/40 border border-red-900/60 text-red-300 rounded-tl-xs"
              : "bg-[#0e2724]/90 border border-[#4db9a9]/20 text-gray-200 rounded-tl-xs shadow-md backdrop-blur-sm"
            : "bg-gradient-to-br from-primary via-primary to-orange-600 text-white rounded-tr-xs shadow-lg shadow-primary/20 font-medium"
        }`}
      >
        {isAssistant ? (
          isEmpty ? (
            /* Loading dots inside the single assistant bubble */
            <div className="flex gap-1.5 items-center h-4 py-0.5 px-0.5">
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  className="w-1.5 h-1.5 rounded-full bg-secondary shadow-[0_0_6px_rgba(77,185,169,0.8)]"
                  animate={{ y: [0, -5, 0], opacity: [0.4, 1, 0.4] }}
                  transition={{
                    duration: 0.7,
                    repeat: Infinity,
                    delay: i * 0.18,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </div>
          ) : (
            <>
              {renderMarkdown(message.content)}
              {/* Blinking cursor while streaming this specific message */}
              {isStreaming && (
                <motion.span
                  className="inline-block w-1.5 h-3.5 bg-secondary ml-0.5 align-middle rounded-full shadow-[0_0_8px_rgba(77,185,169,0.9)]"
                  animate={{ opacity: [1, 0] }}
                  transition={{
                    duration: 0.5,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
              )}
            </>
          )
        ) : (
          // User messages: preserve line breaks literally
          <span className="whitespace-pre-wrap">{message.content}</span>
        )}
      </div>
    </motion.div>
  );
}

// ─── ChatPanel ────────────────────────────────────────────────────────────────

const getStorageKey = (id) => `educito_chat_${id}`;

const INITIAL_WELCOME_MESSAGE = {
  id: "welcome",
  role: "assistant",
  content:
    "¡Hola! Soy **EDUCITO** 👋, el asistente de esta oportunidad. Puedo responder tus preguntas sobre requisitos, beneficios, fechas y cómo postular. ¿En qué te puedo ayudar?",
};

function ChatPanel({ opportunity, onClose }) {
  const opportunityId = opportunity?.id;

  // Initialize messages state from sessionStorage for the specific opportunity if available
  const [messages, setMessages] = useState(() => {
    if (!opportunityId) return [INITIAL_WELCOME_MESSAGE];
    try {
      const saved = sessionStorage.getItem(getStorageKey(opportunityId));
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error("Error cargando historial de chat de sessionStorage:", e);
    }
    return [INITIAL_WELCOME_MESSAGE];
  });

  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [streamingId, setStreamingId] = useState(null);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const abortRef = useRef(null);

  const isBusy = isLoading || streamingId !== null;

  // Persist messages to sessionStorage whenever they change
  useEffect(() => {
    if (!opportunityId || messages.length === 0) return;
    try {
      sessionStorage.setItem(
        getStorageKey(opportunityId),
        JSON.stringify(messages),
      );
    } catch (e) {
      console.error("Error guardando historial de chat en sessionStorage:", e);
    }
  }, [messages, opportunityId]);

  // Reset chat for current opportunity
  const handleResetChat = () => {
    if (isBusy || !opportunityId) return;
    try {
      sessionStorage.removeItem(getStorageKey(opportunityId));
    } catch (e) {
      console.error("Error eliminando historial de chat:", e);
    }
    setMessages([INITIAL_WELCOME_MESSAGE]);
  };

  // Auto-scroll when messages change or streaming updates content
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Focus input on open (only on desktop to prevent soft-keyboard popup on mobile)
  useEffect(() => {
    const isMobile =
      typeof window !== "undefined" &&
      (window.innerWidth < 768 || "ontouchstart" in window);

    if (!isMobile) {
      const t = setTimeout(() => inputRef.current?.focus(), 200);
      return () => clearTimeout(t);
    }
  }, []);

  // Cleanup abort on unmount
  useEffect(() => () => abortRef.current?.abort(), []);

  /**
   * autoResize
   * Grows/shrinks the textarea to fit its content, capped at ~120px.
   */
  const autoResize = (el) => {
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  };

  /**
   * sendQuestion
   *
   * Opens an SSE connection to the Edge Function, reads tokens as they
   * arrive, and incrementally updates the assistant message in state.
   */
  const sendQuestion = useCallback(
    async (text) => {
      const trimmed = text?.trim();
      if (!trimmed || isBusy) return;

      setInput("");
      if (inputRef.current) {
        inputRef.current.style.height = "auto";
      }

      const userMsgId = `u-${Date.now()}`;
      const assistantMsgId = `a-${Date.now() + 1}`;

      setMessages((prev) => [
        ...prev,
        { id: userMsgId, role: "user", content: trimmed },
        { id: assistantMsgId, role: "assistant", content: "" },
      ]);
      setIsLoading(true);

      const history = messages
        .filter((m) => m.id !== "welcome" && m.content)
        .map(({ role, content }) => ({ role, content }));

      const controller = new AbortController();
      abortRef.current = controller;
      const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

      let accumulated = "";
      let gotFirstToken = false;
      let hadError = false;

      try {
        const response = await fetch(FUNCTION_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
            apikey: SUPABASE_ANON_KEY,
          },
          body: JSON.stringify({
            opportunityId,
            question: trimmed,
            history,
          }),
          signal: controller.signal,
        });

        if (!response.ok) {
          const ct = response.headers.get("content-type") ?? "";
          if (ct.includes("application/json")) {
            const err = await response.json();
            throw new Error(err.error ?? `HTTP ${response.status}`);
          }
          throw new Error(`HTTP ${response.status}`);
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        setStreamingId(assistantMsgId);

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";

          for (const line of lines) {
            const trimmedLine = line.trim();
            if (!trimmedLine.startsWith("data:")) continue;

            const data = trimmedLine.slice(5).trim();
            if (data === "[DONE]") continue;

            try {
              const parsed = JSON.parse(data);

              if (parsed.error) {
                throw new Error(parsed.error);
              }

              if (parsed.t) {
                if (!gotFirstToken) {
                  setIsLoading(false);
                  gotFirstToken = true;
                }
                accumulated += parsed.t;
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === assistantMsgId
                      ? { ...m, content: accumulated }
                      : m,
                  ),
                );
              }
            } catch (parseErr) {
              if (parseErr.message !== "stream_error") {
                throw parseErr;
              }
              throw new Error(
                "El asistente no está disponible en este momento.",
              );
            }
          }
        }

        reader.releaseLock();

        if (!accumulated) {
          throw new Error(
            "El asistente no devolvió una respuesta. Intenta de nuevo.",
          );
        }
      } catch (err) {
        hadError = true;
        const isAbort =
          err.name === "AbortError" || err.message?.includes("abort");
        const msg = isAbort
          ? "La respuesta tardó demasiado. Por favor, intenta de nuevo."
          : err.message || "El asistente no está disponible en este momento.";

        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantMsgId ? { ...m, content: msg, isError: true } : m,
          ),
        );
      } finally {
        clearTimeout(timeoutId);
        setIsLoading(false);
        setStreamingId(null);
        if (!hadError && !accumulated) {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantMsgId
                ? {
                    ...m,
                    content: "El asistente no está disponible en este momento.",
                    isError: true,
                  }
                : m,
            ),
          );
        }
      }
    },
    [messages, isBusy, opportunityId],
  );

  const handleSend = () => {
    if (input.trim()) sendQuestion(input);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
    autoResize(e.target);
  };

  const handleRetry = () => {
    const lastUser = [...messages].reverse().find((m) => m.role === "user");
    if (!lastUser) return;
    setMessages((prev) => prev.filter((m) => !m.isError));
    sendQuestion(lastUser.content);
  };

  const showSuggestions = messages.length === 1 && !isBusy;
  const lastMsgIsError = messages.at(-1)?.isError === true && !isBusy;

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label="Asistente EDUCITO"
      className="fixed inset-x-3 bottom-3 sm:bottom-5 sm:right-6 sm:left-auto z-50 w-auto sm:w-[410px] flex flex-col rounded-3xl bg-[#0a1c1a]/95 backdrop-blur-xl border border-[#4db9a9]/25 shadow-[0_25px_60px_rgba(0,0,0,0.75),0_0_30px_rgba(77,185,169,0.12)] overflow-hidden text-gray-100"
      style={{
        height: "min(620px, calc(100dvh - 2rem))",
        transformOrigin: "bottom right",
      }}
      initial={{ opacity: 0, y: 60, scale: 0.85 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 40, scale: 0.88 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* ── Header ── */}
      <div className="flex items-center justify-between px-4 py-3.5 border-b border-[#4db9a9]/20 bg-gradient-to-r from-[#0d2825] via-[#091b19] to-[#071614] flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center">
              <img
                src={aiIcon}
                alt="EDUCITO IA"
                className="w-full h-full object-contain filter drop-shadow-[0_0_8px_rgba(77,185,169,0.7)]"
              />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#091b19] shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white tracking-wide font-heading">
                EDUCITO
              </h3>
              <span className="text-[10px] font-semibold tracking-wider text-secondary bg-secondary/15 border border-secondary/30 rounded-full px-2 py-0.5 uppercase">
                IA
              </span>
            </div>
            <p className="text-[11px] text-[#4db9a9]/80 mt-0.5">
              Asistente oficial
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {messages.length > 1 && (
            <button
              onClick={handleResetChat}
              disabled={isBusy}
              className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#4db9a9]/20 transition-all duration-150 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
              aria-label="Reiniciar chat"
              title="Reiniciar chat"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#4db9a9]/20 transition-all duration-150 active:scale-95"
            aria-label="Cerrar asistente"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── Messages ── */}
      <div
        className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-[#0d2825]"
        aria-live="polite"
        aria-label="Conversación con EDUCITO"
      >
        {messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            message={msg}
            isStreaming={msg.id === streamingId}
          />
        ))}

        {/* Suggested questions — inside scroll, under welcome message */}
        <AnimatePresence>
          {showSuggestions && (
            <motion.div
              key="suggestions"
              className="flex flex-col gap-2 pt-1"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
            >
              <p className="text-[10px] font-semibold text-[#4db9a9]/90 uppercase tracking-wider pl-1">
                Preguntas frecuentes
              </p>
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => sendQuestion(s)}
                  disabled={isBusy}
                  className="text-left text-xs text-gray-200 bg-[#0c2421]/90 hover:bg-[#4db9a9]/15 border border-[#4db9a9]/20 hover:border-[#4db9a9]/50 rounded-xl px-3.5 py-2.5 transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed leading-relaxed shadow-sm group flex items-center justify-between"
                >
                  <span>{s}</span>
                  <Sparkles className="w-3.5 h-3.5 text-[#4db9a9]/60 group-hover:text-secondary transition-colors duration-200 flex-shrink-0 ml-2" />
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={messagesEndRef} />
      </div>

      {/* ── Retry button on error ── */}
      <AnimatePresence>
        {lastMsgIsError && (
          <motion.div
            className="px-4 pb-2 flex-shrink-0"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <button
              onClick={handleRetry}
              className="w-full flex items-center justify-center gap-2 text-xs font-medium text-red-300 hover:text-white bg-red-950/60 hover:bg-red-900/80 border border-red-800/80 rounded-xl px-3 py-2 transition-all duration-150 active:scale-[0.98]"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reintentar respuesta
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Input ── */}
      <div className="p-3 border-t border-[#4db9a9]/20 bg-[#071614]/90 flex-shrink-0">
        <div className="flex items-end gap-2 bg-[#0c2421]/95 border border-[#4db9a9]/25 focus-within:border-[#4db9a9]/60 focus-within:ring-1 focus-within:ring-[#4db9a9]/30 rounded-2xl px-3.5 py-2.5 transition-all duration-200">
          <textarea
            ref={inputRef}
            id="ai-assistant-input"
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Pregúntale a EDUCITO..."
            disabled={isBusy}
            maxLength={1000}
            aria-label="Escribe tu pregunta a EDUCITO"
            rows={1}
            className="flex-1 bg-transparent text-sm text-gray-100 placeholder-gray-400 resize-none border-0 outline-none focus:ring-0 leading-relaxed disabled:opacity-50 overflow-hidden"
            style={{ minHeight: "22px", maxHeight: "120px" }}
          />
          <button
            id="ai-assistant-send"
            onClick={handleSend}
            disabled={!input.trim() || isBusy}
            aria-label="Enviar mensaje"
            className="w-8 h-8 rounded-xl bg-gradient-to-tr from-primary to-orange-500 hover:from-primary/90 hover:to-orange-400 text-white shadow-md shadow-primary/20 flex items-center justify-center flex-shrink-0 transition-all duration-150 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed mb-0.5"
          >
            {isBusy ? (
              <Loader2 className="w-4 h-4 animate-spin text-white" />
            ) : (
              <Send className="w-4 h-4 text-white" />
            )}
          </button>
        </div>
        <p className="text-[10px] text-gray-400/80 text-center mt-2 font-medium">
          Enter = enviar · Shift+Enter = nueva línea · Información oficial
        </p>
      </div>
    </motion.div>
  );
}

// ─── OpportunityAIAssistant (FAB + Speech Bubble Tooltip + Futuristic Panel) ─

/**
 * OpportunityAIAssistant
 *
 * Futuristic floating action button + speech bubble tooltip that opens a streaming chat panel.
 *
 * Props:
 *   opportunity: object — full opportunity record from Supabase (must include `id`)
 */
export default function OpportunityAIAssistant({ opportunity }) {
  const [isOpen, setIsOpen] = useState(false);
  const [hasBeenOpened, setHasBeenOpened] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleOpen = () => {
    setIsOpen(true);
    setHasBeenOpened(true);
  };

  const handleClose = () => setIsOpen(false);

  if (!opportunity?.id) return null;

  return (
    <>
      <AnimatePresence mode="wait">
        {isOpen && (
          <ChatPanel
            key="chat-panel"
            opportunity={opportunity}
            onClose={handleClose}
          />
        )}
      </AnimatePresence>

      {/* ── Futuristic FAB Widget + Speech Bubble Tooltip (Visible ONLY when chat is closed) ── */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            key="fab-widget"
            className="fixed bottom-5 right-4 sm:right-6 z-40 flex flex-col items-end"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {/* Floating Speech Bubble Tooltip — shown ONLY on hover when closed */}
            <AnimatePresence>
              {isHovered && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.9 }}
                  transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
                  onClick={handleOpen}
                  className="cursor-pointer mb-3 select-none pointer-events-auto"
                >
                  <div className="relative bg-white text-gray-900 font-medium text-xs sm:text-sm px-4 py-2.5 rounded-2xl shadow-[0_10px_25px_rgba(0,0,0,0.15)] border border-gray-100 flex items-center gap-2 hover:scale-105 transition-transform duration-200">
                    <Sparkles className="w-4 h-4 text-secondary flex-shrink-0" />
                    <span className="font-semibold text-gray-800">
                      ¿Necesitas ayuda?
                    </span>
                    {/* Tail pointing to the button */}
                    <div className="absolute -bottom-1.5 right-6 sm:right-8 w-3 h-3 bg-white border-r border-b border-gray-100 rotate-45" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Circular Avatar FAB Button */}
            <button
              id="ai-assistant-fab"
              onClick={handleOpen}
              aria-label="Abrir EDUCITO"
              aria-expanded={false}
              className="relative group p-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a1c1a] transition-transform active:scale-95"
            >
              {/* Ambient Glow Aura */}
              <div className="absolute inset-2 rounded-full bg-gradient-to-r from-secondary via-primary to-accent opacity-50 blur-lg group-hover:opacity-85 transition-opacity duration-300 animate-pulse" />

              {/* Icon Container with Drop-Shadow */}
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <img
                  src={aiIcon}
                  alt="EDUCITO IA"
                  className="w-full h-full object-contain filter drop-shadow-[0_4px_14px_rgba(77,185,169,0.65)] group-hover:drop-shadow-[0_8px_24px_rgba(77,185,169,0.95)] transition-all duration-300"
                />
                {!hasBeenOpened && (
                  <span className="absolute top-0 right-0 sm:top-1 sm:right-1 flex h-3.5 w-3.5 z-10">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75" />
                    <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-secondary" />
                  </span>
                )}
              </div>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
