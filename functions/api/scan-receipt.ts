// Optional AI receipt scanner for Cloudflare Pages (runs as a free serverless function).
// Needs the secret GEMINI_API_KEY (free key from aistudio.google.com/apikey, no billing).
// Optional: GEMINI_MODEL (default: gemini-flash-latest).

interface Env {
  GEMINI_API_KEY?: string;
  GEMINI_MODEL?: string;
}

const CATEGORY_IDS = [
  'plucking','dehusking','collecting_piling','transport','land_clearing',
  'seedlings_transport','pit_drainage','infilling_vacancies','weeding','fertilizer',
  'soil_moisture','fencing_maintenance','wildlife_protection','pest_disease_control',
  'family_labor','other',
];

const PROMPT = `You are helping a Sri Lankan Fairtrade & Organic coconut farmer record an expense from a receipt, bill, or handwritten ledger note (which may be in Sinhala, English, or Tamil).
Return JSON with:
1. amount: total in LKR as a positive number (0 if unreadable).
2. date: YYYY-MM-DD, or "" if missing/unclear.
3. categoryId: exactly one of: ${CATEGORY_IDS.join(', ')}.
   (plucking=coconut plucking; dehusking; collecting_piling; transport=tractor/lorry/fuel; land_clearing; seedlings_transport=seedlings & transport; pit_drainage; infilling_vacancies; weeding; fertilizer=fertilizer/dolomite/compost; soil_moisture=husk burying/mulching; fencing_maintenance; wildlife_protection=monkey/squirrel/elephant protection; pest_disease_control; family_labor; other)
4. note: short description of items (max 60 chars, keep original Sinhala or English item names).`;

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

export const onRequestPost = async ({ request, env }: { request: Request; env: Env }) => {
  if (!env.GEMINI_API_KEY) return json({ error: 'Receipt scanning is not configured.' }, 503);

  let body: { imageBase64?: string; mimeType?: string };
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Invalid request.' }, 400);
  }
  const { imageBase64, mimeType } = body;
  if (!imageBase64 || !mimeType || !mimeType.startsWith('image/') || imageBase64.length > 8_000_000) {
    return json({ error: 'Missing or invalid receipt image.' }, 400);
  }

  const model = env.GEMINI_MODEL || 'gemini-flash-latest';
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': env.GEMINI_API_KEY },
      body: JSON.stringify({
        contents: [{ parts: [{ inlineData: { mimeType, data: imageBase64 } }, { text: PROMPT }] }],
        generationConfig: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: 'OBJECT',
            properties: {
              amount: { type: 'NUMBER' },
              date: { type: 'STRING' },
              categoryId: { type: 'STRING' },
              note: { type: 'STRING' },
            },
            required: ['amount', 'date', 'categoryId', 'note'],
          },
        },
      }),
    },
  );

  if (!res.ok) {
    return json({ error: res.status === 429 ? 'Daily free limit reached. Try later.' : `AI error ${res.status}` }, 502);
  }

  try {
    const data = (await res.json()) as any;
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '{}';
    const p = JSON.parse(text);
    return json({
      amount: typeof p.amount === 'number' && Number.isFinite(p.amount) && p.amount > 0 ? Math.round(p.amount * 100) / 100 : 0,
      date: typeof p.date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(p.date) ? p.date : '',
      categoryId: CATEGORY_IDS.includes(p.categoryId) ? p.categoryId : 'other',
      note: typeof p.note === 'string' ? p.note.slice(0, 80) : '',
    });
  } catch {
    return json({ error: 'Could not read the AI response.' }, 502);
  }
};
