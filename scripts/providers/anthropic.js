const DEFAULT_MODEL = 'claude-opus-4-5';

async function review({ model, prompt }) {
  const Anthropic = require('@anthropic-ai/sdk');
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const response = await client.messages.create({
    model: model || DEFAULT_MODEL,
    max_tokens: 4096,
    messages: [{ role: 'user', content: prompt }],
  });

  return response.content[0].text;
}

module.exports = { review, DEFAULT_MODEL };