/**
 * ai-client.ts
 *
 * Builds the LLM request and returns the raw streaming Response.
 * The SSE parsing and re-emission happens in index.ts.
 *
 * Environment variables:
 *   AI_API_KEY   — Bearer token (server-side only, never sent to frontend)
 *   AI_MODEL     — Model identifier (e.g. "gemini-2.5-flash" or "gpt-4o-mini")
 *   AI_ENDPOINT  — OpenAI-compatible API URL (e.g. "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions")
 *
 * Future-ready: when RAG is added, retrieved chunks can be appended to
 * the `context` string before calling `fetchLLMStream`.
 */

const DEFAULT_AI_ENDPOINT =
  "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions";
const REQUEST_TIMEOUT_MS = 28_000;

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

// ─── System Prompt ────────────────────────────────────────────────────────────

export function buildSystemPrompt(context: string): string {
  return `Tu nombre es EDUCITO. Eres el asistente oficial de EDUUS, una plataforma de oportunidades educativas.
Tu función es ayudar a los usuarios a entender la siguiente oportunidad educativa.

${context}

Reglas de identidad (OBLIGATORIAS):
- Tu nombre es EDUCITO. Preséntate siempre como EDUCITO si te preguntan quién eres.
- Nunca menciones el nombre del modelo de IA, la empresa que lo desarrolló, ni la tecnología subyacente.
- Nunca uses otro nombre que no sea EDUCITO para referirte a ti mismo.

Reglas de respuesta (OBLIGATORIAS):
1. Responde ÚNICAMENTE utilizando la información proporcionada en el bloque de contexto anterior.
2. No inventes información. No hagas suposiciones.
3. Si la respuesta no está disponible en el contexto, responde exactamente: "No encontré esa información dentro de esta oportunidad."
4. Sé claro, amable y conciso.
5. Usa listas cuando ayude a la lectura.
6. Si el usuario pregunta algo fuera del contexto de la oportunidad, indica amablemente que solo puedes ayudar con información relacionada a esta oportunidad específica.
7. Responde siempre en español.`;
}

// ─── Main Export ──────────────────────────────────────────────────────────────

/**
 * fetchLLMStream
 *
 * Calls the LLM API with `stream: true` and returns the raw fetch Response.
 * The caller (index.ts) is responsible for processing the SSE body.
 *
 * @param context  - Opportunity context from buildOpportunityContext()
 * @param question - The user's current question
 * @param history  - Previous conversation turns (user + assistant only)
 * @returns Raw Response with SSE body from the LLM
 */
export async function fetchLLMStream(
  context: string,
  question: string,
  history: ChatMessage[] = []
): Promise<Response> {
  const apiKey = Deno.env.get("AI_API_KEY");
  const model = Deno.env.get("AI_MODEL") ?? "gemini-2.5-flash";
  const endpoint = Deno.env.get("AI_ENDPOINT") ?? DEFAULT_AI_ENDPOINT;

  if (!apiKey) {
    throw new Error("AI_API_KEY environment variable is not set.");
  }

  const messages: ChatMessage[] = [
    { role: "system", content: buildSystemPrompt(context) },
    ...history,
    { role: "user", content: question },
  ];

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  let response: Response;
  try {
    response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: 0.3,
        max_tokens: 1024,
        stream: true,
      }),
      signal: controller.signal,
    });
  } catch (err) {
    clearTimeout(timeoutId);
    if ((err as Error).name === "AbortError") {
      throw new Error("timeout");
    }
    throw new Error(`network_error: ${(err as Error).message}`);
  }

  clearTimeout(timeoutId);

  if (!response.ok) {
    const body = await response.text();
    console.error("LLM API error:", response.status, body);
    throw new Error(`llm_error_${response.status}`);
  }

  if (!response.body) {
    throw new Error("no_body");
  }

  return response;
}
