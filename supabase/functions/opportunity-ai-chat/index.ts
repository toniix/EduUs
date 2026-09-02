/**
 * opportunity-ai-chat/index.ts
 *
 * Supabase Edge Function — entrypoint.
 *
 * Receives:
 *   POST { opportunityId: string, question: string, history?: ChatMessage[] }
 *
 * Returns (on success):
 *   text/event-stream — SSE with chunks: data: {"t":"token"}\n\n
 *   Terminated with: data: [DONE]\n\n
 *
 * Returns (on error, before stream starts):
 *   application/json — { error: "message" }
 *
 * Flow:
 *   1. Validate request
 *   2. Fetch opportunity from Supabase (service role)
 *   3. Build context
 *   4. Call LLM with stream: true via fetchLLMStream()
 *   5. Transform OpenAI SSE → simple {"t": "token"} SSE
 *   6. Stream response to client
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { buildOpportunityContext } from "./context-builder.ts";
import { fetchLLMStream, type ChatMessage } from "./ai-client.ts";

// ─── CORS Headers ─────────────────────────────────────────────────────────────

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// ─── Response helpers ─────────────────────────────────────────────────────────

function jsonError(message: string, status = 400): Response {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function sseResponse(readable: ReadableStream<Uint8Array>): Response {
  return new Response(readable, {
    headers: {
      ...corsHeaders,
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
    },
  });
}

// ─── SSE Transform ────────────────────────────────────────────────────────────

/**
 * transformOpenAIStream
 *
 * Reads the OpenAI SSE body (data: {...choices:[{delta:{content:"t"}}]}\n\n)
 * and re-emits a simplified format: data: {"t":"token"}\n\n
 * Ends with: data: [DONE]\n\n
 *
 * On stream error, emits: data: {"error":"message"}\n\n before closing.
 */
function transformOpenAIStream(
  llmBody: ReadableStream<Uint8Array>
): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  return new ReadableStream<Uint8Array>({
    async start(controller) {
      const reader = llmBody.getReader();
      let buffer = "";

      const emit = (chunk: string) =>
        controller.enqueue(encoder.encode(chunk));

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });

          // SSE lines are separated by \n; a message ends with \n\n
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? ""; // keep incomplete last line in buffer

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed.startsWith("data:")) continue;

            const data = trimmed.slice(5).trim();

            if (data === "[DONE]") {
              emit("data: [DONE]\n\n");
              continue;
            }

            try {
              const parsed = JSON.parse(data);
              const token: string | undefined =
                parsed?.choices?.[0]?.delta?.content;
              if (token) {
                emit(`data: ${JSON.stringify({ t: token })}\n\n`);
              }
            } catch {
              // Malformed JSON chunk — skip silently
            }
          }
        }
      } catch (err) {
        console.error("Stream transform error:", err);
        emit(`data: ${JSON.stringify({ error: "stream_error" })}\n\n`);
      } finally {
        reader.releaseLock();
        controller.close();
      }
    },
  });
}

// ─── Handler ──────────────────────────────────────────────────────────────────

serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return jsonError("Method Not Allowed", 405);
  }

  // ── 1. Parse and validate body ───────────────────────────────────────────
  let body: {
    opportunityId?: string;
    question?: string;
    history?: ChatMessage[];
  };

  try {
    body = await req.json();
  } catch {
    return jsonError("El cuerpo de la solicitud no es JSON válido.");
  }

  const { opportunityId, question, history = [] } = body;

  if (!opportunityId || typeof opportunityId !== "string") {
    return jsonError("El campo 'opportunityId' es requerido y debe ser un string.");
  }

  if (!question || typeof question !== "string" || question.trim().length === 0) {
    return jsonError("El campo 'question' es requerido y no puede estar vacío.");
  }

  if (question.trim().length > 1000) {
    return jsonError("La pregunta excede el límite de 1000 caracteres.");
  }

  // ── 2. Fetch opportunity from Supabase ───────────────────────────────────
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
    return jsonError("Error de configuración del servidor.", 500);
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  const { data: opportunity, error: dbError } = await supabase
    .from("opportunities")
    .select(
      "title, description, organization, country, location, modality, audience, " +
      "deadline, benefits, requirements, contact, social_links, " +
      "application_steps, documentation, video_url, is_published"
    )
    .eq("id", opportunityId)
    .single();

  if (dbError) {
    console.error("Supabase error fetching opportunity:", dbError);
    return jsonError("No se pudo obtener la información de la oportunidad.", 404);
  }

  if (!opportunity) {
    return jsonError("Oportunidad no encontrada.", 404);
  }

  if (opportunity.is_published === false) {
    return jsonError("Oportunidad no disponible.", 403);
  }

  // ── 3. Build context ─────────────────────────────────────────────────────
  const context = buildOpportunityContext(opportunity);

  // ── 4. Sanitize history ──────────────────────────────────────────────────
  const sanitizedHistory: ChatMessage[] = Array.isArray(history)
    ? history
        .filter(
          (m) =>
            m &&
            (m.role === "user" || m.role === "assistant") &&
            typeof m.content === "string"
        )
        .slice(-10)
        .map((m) => ({
          role: m.role,
          content: m.content.slice(0, 2000),
        }))
    : [];

  // ── 5. Fetch LLM stream ──────────────────────────────────────────────────
  let llmResponse: Response;
  try {
    llmResponse = await fetchLLMStream(context, question.trim(), sanitizedHistory);
  } catch (err) {
    console.error("LLM fetch error:", err);
    return jsonError("El asistente no está disponible en este momento.", 503);
  }

  // ── 6. Transform and stream to client ────────────────────────────────────
  const outputStream = transformOpenAIStream(llmResponse.body!);
  return sseResponse(outputStream);
});
