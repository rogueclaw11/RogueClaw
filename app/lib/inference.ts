import Anthropic from "@anthropic-ai/sdk";

export const inferenceClient = new Anthropic({
  apiKey: process.env.AGENT_INFERENCE_KEY,
});

export const AGENT_MODEL = "claude-sonnet-4-6";
