import { config } from '../../config/index.js';

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
const MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';

export async function summarizeText(text) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    const error = new Error('LLM provider is not configured');
    error.statusCode = 500;
    throw error;
  }

  const prompt = [
    {
      role: 'system',
      content:
        'You are a helpful assistant that writes concise summaries in 3-6 bullet points. Keep the output under about 120 words.',
    },
    {
      role: 'user',
      content: `Summarize the following text:\n\n${text}`,
    },
  ];

  let response;
  try {
    response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages: prompt,
        temperature: config.llmTemperature,
      }),
    });
  } catch (err) {
    const error = new Error('Failed to call LLM provider');
    error.statusCode = 502;
    throw error;
  }

  if (!response.ok) {
    let providerBody = null;
    try {
      providerBody = await response.json();
    } catch {
      try {
        providerBody = await response.text();
      } catch {
        providerBody = null;
      }
    }

    const error = new Error(
      `LLM provider returned an error (status ${response.status})`
    );
    error.statusCode = 502;
    error.providerStatus = response.status;
    error.providerError = providerBody;
    throw error;
  }

  const data = await response.json();
  const summary =
    data.choices?.[0]?.message?.content?.trim() ||
    'No summary available from provider.';

  return { summary, model: MODEL };
}

