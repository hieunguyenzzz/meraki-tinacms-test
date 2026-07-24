const GEMINI_MODEL = 'gemini-3.5-flash-lite';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

export async function detectFormLanguage(text: string): Promise<'en' | 'vi'> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured');
  }

  const response = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            {
              text: `Is the following text written in English or Vietnamese? Reply with exactly one word, "en" or "vi", nothing else.\n\n"""\n${text}\n"""`,
            },
          ],
        },
      ],
      generationConfig: { temperature: 0, maxOutputTokens: 5 },
    }),
  });

  if (!response.ok) {
    throw new Error(`Gemini request failed: ${response.status} ${await response.text()}`);
  }

  const data = await response.json();
  const answer = String(data?.candidates?.[0]?.content?.parts?.[0]?.text || '')
    .trim()
    .toLowerCase();

  if (answer.startsWith('vi')) return 'vi';
  if (answer.startsWith('en')) return 'en';

  throw new Error(`Unexpected Gemini response: "${answer}"`);
}
