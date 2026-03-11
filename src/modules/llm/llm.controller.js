import { summarizeText } from './llm.service.js';

const MIN_LENGTH = 50;
const MAX_LENGTH = 10000;

export async function summarize(req, res) {
  try {
    const { text } = req.body || {};

    if (!text || typeof text !== 'string' || !text.trim()) {
      return res.status(400).json({ error: 'Field "text" is required.' });
    }

    const trimmed = text.trim();

    if (trimmed.length < MIN_LENGTH) {
      return res.status(400).json({
        error: `Text is too short to summarize. Minimum length is ${MIN_LENGTH} characters.`,
      });
    }

    if (trimmed.length > MAX_LENGTH) {
      return res.status(413).json({
        error: `Text is too long to summarize. Maximum length is ${MAX_LENGTH} characters.`,
      });
    }

    const result = await summarizeText(trimmed);
    return res.json(result);
  } catch (err) {
    const status = err.statusCode || 500;
    const message =
      status === 500 ? 'Failed to generate summary' : err.message;
    return res.status(status).json({ error: message });
  }
}

