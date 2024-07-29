const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey:
    process.env.OPENAI_API_KEY ||
    "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",
});

module.exports = {
  openai,
};
