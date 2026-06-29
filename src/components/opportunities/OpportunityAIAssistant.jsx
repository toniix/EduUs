import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, X, Send, Loader2, Sparkles, ChevronDown } from "lucide-react";

/* ─── Mensajes de bienvenida / sugerencias ───────────────────── */
const SUGGESTIONS = [
  "¿Cuáles son los requisitos principales de esta oportunidad?",
  "¿Cómo puedo fortalecer mi postulación?",
  "¿Qué documentos debo preparar?",
  "¿Cuáles son los beneficios de esta oportunidad?",
];

/* ─── Burbuja de mensaje ─────────────────────────────────────── */
function MessageBubble({ message }) {
  const isAssistant = message.role === "assistant";
  return (
    <motion.div
      className={`flex gap-2.5 ${isAssistant ? "items-start" : "items-start flex-row-reverse"}`}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
    >
      {isAssistant && (
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-secondary to-secondary/70 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
          <Bot className="w-3.5 h-3.5 text-white" />
        </div>
      )}
      <div
        className={`max-w-[82%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
          isAssistant
            ? "bg-gray-50 border border-gray-100 text-gray-700 rounded-tl-sm"
            : "bg-primary text-white rounded-tr-sm shadow-sm shadow-primary/20"
        }`}
      >
        {message.content}
      </div>
    </motion.div>
  );
}

/* ─── Estado de carga del asistente ─────────────────────────── */
function TypingIndicator() {
  return (
    <motion.div
      className="flex items-start gap-2.5"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{ duration: 0.25 }}
    >
      <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-secondary to-secondary/70 flex items-center justify-center flex-shrink-0 shadow-sm">
        <Bot className="w-3.5 h-3.5 text-white" />
      </div>
      <div className="bg-gray-50 border border-gray-100 rounded-2xl rounded-tl-sm px-4 py-3">
        <div className="flex gap-1 items-center h-4">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-gray-400"
              animate={{ y: [0, -4, 0] }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                delay: i * 0.15,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Panel del chat ─────────────────────────────────────────── */
function ChatPanel({ opportunity, onClose }) {
  const [messages, setMessages] = useState([
    {
      id: "welcome",
      role: "assistant",
      content: `¡Hola! Soy tu asistente de oportunidades educativas. Estoy aquí para ayudarte con todo lo relacionado a **${opportunity?.title || "esta convocatoria"}**. ¿En qué te puedo ayudar?`,
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll al último mensaje
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Focus en el input al abrir
  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 200);
  }, []);

  /**
   * Genera una respuesta contextual del asistente.
   * En producción, esto debería conectarse a una API de LLM
   * pasando el contexto de la oportunidad.
   */
  const generateResponse = async (userMessage) => {
    const lowerMsg = userMessage.toLowerCase();
    const opp = opportunity || {};

    await new Promise((r) => setTimeout(r, 1000 + Math.random() * 800));

    if (lowerMsg.includes("requisito") || lowerMsg.includes("requiere")) {
      const reqs = Array.isArray(opp.requirements)
        ? opp.requirements.join(", ")
        : typeof opp.requirements === "string"
        ? opp.requirements
        : null;
      return reqs
        ? `Los requisitos de ${opp.title} incluyen: ${reqs}. Te recomiendo revisar también el sitio oficial para verificar si hay actualizaciones recientes.`
        : `Para conocer los requisitos exactos de ${opp.title || "esta oportunidad"}, te recomiendo visitar el sitio oficial de ${opp.organization || "la institución"}.`;
    }

    if (lowerMsg.includes("beneficio") || lowerMsg.includes("ofrece")) {
      const bens = Array.isArray(opp.benefits)
        ? opp.benefits.join(", ")
        : typeof opp.benefits === "string"
        ? opp.benefits
        : null;
      return bens
        ? `Esta oportunidad ofrece los siguientes beneficios: ${bens}. Es una excelente oportunidad para tu desarrollo profesional y académico.`
        : `Para conocer los beneficios específicos, te recomiendo revisar los detalles en la página oficial de ${opp.organization || "la organización convocante"}.`;
    }

    if (lowerMsg.includes("documento") || lowerMsg.includes("preparar")) {
      return `Para postular a ${opp.title || "esta oportunidad"}, generalmente necesitarás: CV actualizado en inglés/español (según el contexto), carta de motivación, certificados de estudios, carta de recomendación, y pasaporte vigente si es internacional. Verifica siempre los documentos exactos en las bases oficiales.`;
    }

    if (lowerMsg.includes("plazo") || lowerMsg.includes("fecha") || lowerMsg.includes("deadline")) {
      if (opp.deadline) {
        const formatted = new Date(opp.deadline).toLocaleDateString("es-ES", {
          day: "numeric",
          month: "long",
          year: "numeric",
        });
        return `La fecha límite de postulación es el ${formatted}. Te recomiendo postular con al menos una semana de anticipación para evitar imprevistos técnicos.`;
      }
      return "La fecha límite no está especificada. Te recomiendo contactar directamente a la institución para confirmar los plazos.";
    }

    if (lowerMsg.includes("fortalecer") || lowerMsg.includes("mejorar") || lowerMsg.includes("carta")) {
      return `Para fortalecer tu postulación a ${opp.title || "esta oportunidad"}: 1) Personaliza tu carta de motivación mencionando proyectos específicos de ${opp.organization || "la organización"}. 2) Cuantifica tus logros en el CV. 3) Consigue cartas de recomendación de personas relevantes. 4) Muestra tu conocimiento del impacto de la oportunidad. ¿Quieres que profundice en alguno de estos puntos?`;
    }

    if (lowerMsg.includes("idioma") || lowerMsg.includes("inglés")) {
      return `El nivel de idioma requerido depende de la institución. Para oportunidades internacionales, generalmente se solicita inglés B2 o superior (TOEFL/IELTS/Cambridge). Si la oportunidad es en ${opp.country || "otro país"}, verifica los requisitos lingüísticos específicos en las bases.`;
    }

    return `Gracias por tu pregunta sobre ${opp.title || "esta oportunidad"}. Para darte información precisa, te recomiendo revisar las bases oficiales en el sitio de ${opp.organization || "la institución convocante"} o contactarles directamente. ¿Hay algo más específico en lo que pueda orientarte?`;
  };

  const handleSend = async (text = input.trim()) => {
    if (!text || isLoading) return;
    setInput("");

    const userMsg = { id: Date.now(), role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const response = await generateResponse(text);
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, role: "assistant", content: response },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "assistant",
          content: "Lo siento, hubo un error al procesar tu pregunta. Por favor intenta de nuevo.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label="Asistente de oportunidades"
      className="fixed bottom-24 right-4 sm:right-6 z-40 w-[calc(100vw-2rem)] sm:w-96 flex flex-col rounded-2xl bg-white border border-gray-200 shadow-2xl overflow-hidden"
      style={{ maxHeight: "min(520px, calc(100dvh - 8rem))" }}
      initial={{ opacity: 0, scale: 0.92, y: 24, transformOrigin: "bottom right" }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.92, y: 24 }}
      transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
    >
      {/* Header del panel */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-secondary/5 to-transparent flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-secondary to-secondary/70 flex items-center justify-center shadow-sm">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-green-400 border-2 border-white" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900 leading-none">Asistente EDU-US</p>
            <p className="text-[11px] text-gray-400 mt-0.5">IA · Responde al instante</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all duration-150 active:scale-95"
          aria-label="Cerrar asistente"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Mensajes */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
        <AnimatePresence>{isLoading && <TypingIndicator />}</AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Sugerencias rápidas (solo al inicio) */}
      {messages.length === 1 && (
        <div className="px-4 pb-3 flex flex-col gap-1.5 flex-shrink-0">
          <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wide mb-1">
            Preguntas frecuentes
          </p>
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => handleSend(s)}
              className="text-left text-xs text-gray-600 bg-gray-50 hover:bg-secondary/8 border border-gray-100 hover:border-secondary/30 rounded-lg px-3 py-2 transition-all duration-150 active:scale-[0.98] line-clamp-1"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="px-3 pb-3 pt-2 border-t border-gray-100 flex-shrink-0">
        <div className="flex items-end gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 focus-within:border-secondary/60 focus-within:ring-1 focus-within:ring-secondary/20 transition-all duration-200">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Escribe tu pregunta..."
            rows={1}
            disabled={isLoading}
            className="flex-1 bg-transparent text-sm text-gray-900 placeholder-gray-400 resize-none border-0 outline-none focus:ring-0 leading-relaxed disabled:opacity-50"
            style={{ maxHeight: "80px" }}
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || isLoading}
            className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center flex-shrink-0 text-white transition-all duration-150 hover:bg-primary/90 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm shadow-primary/30"
            aria-label="Enviar mensaje"
          >
            {isLoading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Send className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
        <p className="text-[10px] text-gray-400 text-center mt-1.5">
          Respuestas orientativas · Verifica siempre la fuente oficial
        </p>
      </div>
    </motion.div>
  );
}

/* ─── FAB + Panel ────────────────────────────────────────────── */
/**
 * OpportunityAIAssistant
 *
 * Botón flotante que abre un chat panel contextual sobre la oportunidad.
 *
 * Props:
 *   opportunity: object — datos completos de la oportunidad para contexto
 */
export default function OpportunityAIAssistant({ opportunity }) {
  const [isOpen, setIsOpen] = useState(false);
  const [hasBeenOpened, setHasBeenOpened] = useState(false);

  const handleOpen = () => {
    setIsOpen(true);
    setHasBeenOpened(true);
  };

  const handleClose = () => setIsOpen(false);

  return (
    <>
      <AnimatePresence mode="wait">
        {isOpen && (
          <ChatPanel
            key="chat"
            opportunity={opportunity}
            onClose={handleClose}
          />
        )}
      </AnimatePresence>

      {/* FAB */}
      <motion.div
        className="fixed bottom-5 right-4 sm:right-6 z-40"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.8, ease: [0.23, 1, 0.32, 1] }}
      >
        <button
          onClick={isOpen ? handleClose : handleOpen}
          className={`
            group relative flex items-center gap-2.5 rounded-full shadow-lg shadow-secondary/25
            transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)]
            active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2
            ${
              isOpen
                ? "bg-gray-700 text-white px-4 py-3 hover:bg-gray-800"
                : "bg-gradient-to-br from-secondary to-secondary/80 text-white px-5 py-3.5 hover:shadow-xl hover:shadow-secondary/30 hover:-translate-y-0.5"
            }
          `}
          aria-label={isOpen ? "Cerrar asistente IA" : "Pedir ayuda al asistente IA"}
          aria-expanded={isOpen}
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                className="flex items-center gap-2"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.15 }}
              >
                <ChevronDown className="w-4 h-4" />
                <span className="text-sm font-medium">Cerrar</span>
              </motion.div>
            ) : (
              <motion.div
                key="open"
                className="flex items-center gap-2.5"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.15 }}
              >
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-semibold">Pedir ayuda a la IA</span>
                {!hasBeenOpened && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-accent border-2 border-white animate-pulse" />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </motion.div>
    </>
  );
}
